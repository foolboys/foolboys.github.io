---
title: Redisson分布式锁注意事项
date: 2024-11-04
tags:
  - 分布式锁
---

### 背景

> 最近在项目中使用到了Redisson分布式锁, 用于解决并发情况下出现的重复处理问题. 但是在部分场景中, 有锁没锁住的情况出现.于是就对上场景进行复现.

### 代码部分

- 依赖

  ```xml
          <dependency>
              <groupId>org.redisson</groupId>
              <artifactId>redisson-spring-boot-starter</artifactId>
              <version>3.13.6</version>
          </dependency>
          <dependency>
              <groupId>com.baomidou</groupId>
              <artifactId>mybatis-plus-boot-starter</artifactId>
              <version>3.3.2</version>
          </dependency>
          <dependency>
              <groupId>mysql</groupId>
              <artifactId>mysql-connector-java</artifactId>
              <version>8.0.21</version>
          </dependency>
  ```

- 配置

  ```yaml
  spring:
    redis:
      host: 192.168.33.10
      port: 6379
    datasource:
      driver-class-name: com.mysql.cj.jdbc.Driver
      username: root
      password: root
      url: jdbc:mysql://192.168.33.10:3306/blog
  ```

- controller

  ```java
  /**
   * @author RYH
   * @since 2023/6/16
   **/
  @Slf4j
  @RestController
  @RequiredArgsConstructor
  public class TestController {
  
      final TestService testService;
  
      final ExecutorService executorService = Executors.newFixedThreadPool(10);
  
      @GetMapping("/test3")
      public String test3() throws InterruptedException {
          CountDownLatch latch = new CountDownLatch(100);
          for (int i = 0; i < 20; i++) {
              for (int j = 0; j < 5; j++) {
                  SysUser sysUser = SysUser.builder().username("test" + j).sex(1).password("8888").phone("13122121212").build();
                  int finalI = i;
                  int finalJ = j;
                  CompletableFuture.supplyAsync(() -> testService.testLock(sysUser), executorService).whenComplete((s, e) -> {
                      latch.countDown();
                      log.info(("第" + finalI + "次循环,插入第" + finalJ + "条数据结果:" + s + "异常:" + e.getMessage()));
                  });
  
              }
          }
          latch.await();
          return "ok";
      }
  }
  ```

- service

  ```java
  /**
   * @author RYH
   * @since 2023/7/6
   **/
  public interface TestService {
  
      String testLock(SysUser user);
  
  }
  ```

- service实现类

  ```java
  /**
   * @author RYH
   * @since 2023/7/6
   **/
  @Slf4j
  @Service
  @RequiredArgsConstructor
  public class TestServiceImpl implements TestService {
  
      final SysUserMapper userMapper;
  
      final RedissonClient redissonClient;
  
      @Override
      @Transactional(rollbackFor = Exception.class)
      public String testLock(SysUser user) {
          RLock lock = redissonClient.getLock("lock" + user.getUsername());
          try {
              boolean lock1 = lock.tryLock(10, 10, TimeUnit.SECONDS);
              if (lock1) {
                  int count = userMapper.selectCount(Wrappers.lambdaQuery(SysUser.class).eq(SysUser::getUsername, user.getUsername()));
                  // 模拟其他操作
                  Thread.sleep(1000);
                  if (count == 0) {
                      userMapper.insert(user);
                  }
              } else {
                  log.info("抢锁失败,数据已存在");
              }
          } catch (Exception e) {
              log.error(e.getMessage(),e);
              return "出错了";
          } finally {
              if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                  lock.unlock();
              }
          }
          return "成功";
      }
  }
  ```

- mapper

  ```java
  /**
   * @author RYH
   * @since 2023/7/6
   **/
  @Mapper
  public interface SysUserMapper extends BaseMapper<SysUser> {
  }
  
  ```

- ddl

  ```sql
  create table sys_user
  (
      id       int auto_increment
          primary key,
      username varchar(255) default '' not null,
      password varchar(255) default '' not null,
      sex      tinyint      default 0  not null,
      phone    varchar(255)            not null,
      constraint sys_user_pk
          unique (username)
  );
  
  ```

  

### 解释

> 有代码可知, 目前是想往数据库中插入5条数据, 这里模仿并发, 开启了100个请求, 但是数据中会出现重复数据, 因此在service层加上了分布式锁来保证数据插入不会出现主键冲突. 同时注意, 这个方法加上了事物

### 测试结果

```bash
2023-07-07 11:46:23.423 ERROR 14088 --- [pool-2-thread-9] c.r.s.service.impl.TestServiceImpl       : 
### Error updating database.  Cause: java.sql.SQLIntegrityConstraintViolationException: Duplicate entry 'test3' for key 'sys_user_pk'
### The error may exist in com/ryh/springboot/mapper/SysUserMapper.java (best guess)
### The error may involve com.ryh.springboot.mapper.SysUserMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_user  ( username, password, sex, phone )  VALUES  ( ?, ?, ?, ? )
### Cause: java.sql.SQLIntegrityConstraintViolationException: Duplicate entry 'test3' for key 'sys_user_pk'
; Duplicate entry 'test3' for key 'sys_user_pk'; nested exception is java.sql.SQLIntegrityConstraintViolationException: Duplicate entry 'test3' for key 'sys_user_pk'
```

### 分析

> 我在插入之前加了分布式锁, 执行过程中还先查询后插入, 为啥还出现了主键冲突异常呢? 
>
> 思索再三, 最后发现,还是*@Transactional*(rollbackFor = Exception.*class*)的原因.
>
> 我们都知道, Spring的申明试事务, 是基于AOP的, 也就是说, 会给我们生成一个代理对象Proxy. 而事务的提交是在Proxy.process()方法之后, 这里就涉及到一个问题, 如果方法上开启了事务, 而这时候, 方法里面加锁, 锁的释放会在事务提交之前, 这样就会在锁释放和事务提交之前产生一个间隙, 而这时, 就会出现连个事务插入同一条数据的情况. 

### 解决

> 知道了事情产生的原因, 那么问题就好解决了. 
>
> - 可以将锁提升到事务方法外层, 保证事务提交, 再释放锁
> - 可以使用手动提交, 保证方法结束前提交事务
