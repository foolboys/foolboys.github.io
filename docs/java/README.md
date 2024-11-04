---
title: rocketmq的事物消息
date: 2024-11-04
tags:
  - 事务消息
  - rocketmq
---
### 前言

> rocketmq的事物消息, 主要是为了解决在方法处理过程中, 将消息提交到broker时出现的消息丢失情况, 保证消息投递的可靠性.以及mq和本地事物的一致性

### 原理

> 事物消息, 主要是采用了一个中间状态的形式来进行处理. 消息在被推入mq后, 这个消息并不是直接发送到我们锁订阅的Topic, 而是会产生一个`半消息`
>
> 在mq中的体现为`RMQ_SYS_TRANS_HALF_TOPIC` , 当业务处理完数据, 推送消息之后, 消息会暂存到半消息中, 然后mq会对业务进行本地事物执行. 如果本地事物执行成功, 此时半消息才会被推入相应Topic. 这时才会被消费者消费到. 如果, 本地事物执行失败, 则此条消息将被丢弃, 不会被消费者消费到. 假如本地事物执行状态未知, 那么mq会对本地事物进行回查, 判断本地事物是否成功执行, 然后再进行半消息的提交或者丢弃.

### 代码示例

- 依赖

  ```xml
          <dependency>
              <groupId>org.apache.rocketmq</groupId>
              <artifactId>rocketmq-spring-boot-starter</artifactId>
              <version>2.2.1</version>
          </dependency>
  ```

- 配置

  ```properties
  rocketmq.name-server=192.168.33.10:9876
  rocketmq.producer.group=FOOL_BOY_TEST_PRODUCER
  ```

- 生产者

  ```java
  /**
   * @author RYH
   * @since 2023/6/16
   **/
  @Slf4j
  @RestController
  @RequiredArgsConstructor
  public class TestController {
  
      final RocketMQTemplate rocketMQTemplate;
  
  
      @GetMapping("/test2")
      public String test2() throws MQClientException {
          JSONObject object = new JSONObject();
          object.put("test", "01");
          TransactionSendResult sendResult = rocketMQTemplate.sendMessageInTransaction("TEST_TRAN_01", MessageBuilder.withPayload(object).build(), null);
          if (sendResult.getSendStatus().equals(SendStatus.SEND_OK)) {
              log.info("发送成功");
          } else {
              log.error("发送失败{}",JSONObject.toJSONString(sendResult));
          }
          return "ok";
      }
  }
  ```





- 消费者

  ```java
  /**
   * @author RYH
   * @since 2023/6/29
   **/
  @Slf4j
  @Component
  @RocketMQMessageListener(topic = "TEST_TRAN_01", consumerGroup = "TEST_TRAN_01_GROUP")
  public class TestConsumer implements RocketMQListener<JSONObject> {
      @Override
      public void onMessage(JSONObject message) {
          log.info("消费者开始消费掉{}",message.toJSONString());
      }
  }
  ```



#### 效果演示

- 本地事物执行成功

- 本地事物代码以及结果

  ```java
  /**
   * @author RYH
   * @since 2023/6/29
   **/
  @Slf4j
  @RocketMQTransactionListener
  public class LocalTransactionListener implements RocketMQLocalTransactionListener {
  
      @Override
      public RocketMQLocalTransactionState executeLocalTransaction(org.springframework.messaging.Message msg, Object arg) {
          log.info("执行本地事物");
          return RocketMQLocalTransactionState.COMMIT;
      }
  
      @Override
      public RocketMQLocalTransactionState checkLocalTransaction(org.springframework.messaging.Message msg) {
          log.info("查询本地事物");
          return RocketMQLocalTransactionState.COMMIT;
      }
  }
  ```



  ```bash
  2023-07-03 15:26:17.922  INFO 1896 --- [nio-8080-exec-1] c.r.s.listener.LocalTransactionListener  : 执行本地事物
  2023-07-03 15:26:17.924  INFO 1896 --- [nio-8080-exec-1] c.r.s.controller.TestController          : 发送成功
  2023-07-03 15:26:17.957  INFO 1896 --- [MessageThread_1] c.ryh.springboot.listener.TestConsumer   : 消费者开始消费掉{"test":"01"}
  ```



- 本地事物执行失败

- 本地事物代码以及结果



  ```java
  /**
   * @author RYH
   * @since 2023/6/29
   **/
  @Slf4j
  @RocketMQTransactionListener
  public class LocalTransactionListener implements RocketMQLocalTransactionListener {
  
      @Override
      public RocketMQLocalTransactionState executeLocalTransaction(org.springframework.messaging.Message msg, Object arg) {
          log.info("执行本地事物");
          return RocketMQLocalTransactionState.ROLLBACK;
      }
  
      @Override
      public RocketMQLocalTransactionState checkLocalTransaction(org.springframework.messaging.Message msg) {
          log.info("查询本地事物");
          return RocketMQLocalTransactionState.COMMIT;
      }
  }
  ```

  ```bash
  2023-07-03 15:30:44.206  INFO 5524 --- [nio-8080-exec-3] c.r.s.listener.LocalTransactionListener  : 执行本地事物
  2023-07-03 15:30:44.207  INFO 5524 --- [nio-8080-exec-3] c.r.s.controller.TestController          : 发送成功
  ```



- 本地事物执行未知

- 本地事物代码以及结果



  ```java
  /**
   * @author RYH
   * @since 2023/6/29
   **/
  @Slf4j
  @RocketMQTransactionListener
  public class LocalTransactionListener implements RocketMQLocalTransactionListener {
  
      @Override
      public RocketMQLocalTransactionState executeLocalTransaction(org.springframework.messaging.Message msg, Object arg) {
          log.info("执行本地事物");
          return RocketMQLocalTransactionState.UNKNOWN;
      }
  
      @Override
      public RocketMQLocalTransactionState checkLocalTransaction(org.springframework.messaging.Message msg) {
          log.info("查询本地事物");
          return RocketMQLocalTransactionState.COMMIT;
      }
  }
  
  ```



  ```bash
  2023-07-03 15:33:10.167  INFO 28500 --- [nio-8080-exec-1] c.r.s.listener.LocalTransactionListener  : 执行本地事物
  2023-07-03 15:33:10.169  INFO 28500 --- [nio-8080-exec-1] c.r.s.controller.TestController          : 发送成功
  2023-07-03 15:33:32.058  INFO 28500 --- [pool-1-thread-1] c.r.s.listener.LocalTransactionListener  : 查询本地事物
  2023-07-03 15:33:32.216  INFO 28500 --- [MessageThread_1] c.ryh.springboot.listener.TestConsumer   : 消费者开始消费掉{"test":"01"}
  ```

