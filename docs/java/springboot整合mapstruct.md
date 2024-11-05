---
title: rocketmq的事物消息
date: 2024-11-04
tags:
  - mapstruct
---
### 起因

> 在日常开发中, 经常会涉及到各种实体类转换的过程, 有时候可能为了防止数据库字段泄漏, 特意影藏数据库字段来进行展示. 这时候, 如果使用传统的Beanutils.copy()方法将不太适用.需要手动进行set属性, 但是当属性字段交多时,就比较麻烦.而 **mapstruct**的出现就是为了解决这个问题的.

### 使用

1. 依赖引入

   ```xml
           <dependency>
               <groupId>org.mapstruct</groupId>
               <artifactId>mapstruct</artifactId>
               <version>1.5.5.Final</version>
           </dependency>
   ```

   插件 `注意,由于mapstruct是编译时生效,没有插件将可能导致编译失败`

   ```xml
               <plugin>
                   <groupId>org.apache.maven.plugins</groupId>
                   <artifactId>maven-compiler-plugin</artifactId>
                   <version>3.8.1</version>
                   <configuration>
                       <source>1.8</source>
                       <target>1.8</target>
                       <annotationProcessorPaths>
                           <path>
                               <groupId>org.mapstruct</groupId>
                               <artifactId>mapstruct-processor</artifactId>
                               <version>1.5.5.Final</version>
                           </path>
                       </annotationProcessorPaths>
                   </configuration>
               </plugin>
   ```

   

2. 实体类编写

   首先是 dto

   ```java
   /**
    * @author RYH
    * @since 2023/6/29
    **/
   public class TestDto {
   
       private String name;
       private String title;
   
       public String getName() {
           return name;
       }
   
       public void setName(String name) {
           this.name = name;
       }
   
       public String getTitle() {
           return title;
       }
   
       public void setTitle(String title) {
           this.title = title;
       }
   }
   ```

   然后是数据层

   ```java
   /**
    * @author RYH
    * @since 2023/6/16
    **/
   public class Test {
       private String name;
       private String nickName;
   
       public String getName() {
           return name;
       }
   
       public void setName(String name) {
           this.name = name;
       }
   
       public String getNickName() {
           return nickName;
       }
   
       public void setNickName(String nickName) {
           this.nickName = nickName;
       }
   }
   
   ```

3. 映射编写

   ```java
   /**
    * @author RYH
    * @since 2023/6/29
    **/
   @Mapper
   public interface TestDtoMapping {
       TestDtoMapping INSTANCE = Mappers.getMapper(TestDtoMapping.class);
   
       @Mapping(target = "title",source = "nickName")
       TestDto carToCarDto(Test car);
   }
   ```

4. 使用

   ```java
   /**
    * @author RYH
    * @since 2023/6/16
    **/
   @RestController
   @RequiredArgsConstructor
   public class TestController {
   
   
       @GetMapping("/test")
       public String test(Test r) {
           TestDto testDto = TestDtoMapping.INSTANCE.carToCarDto(r);
           return testDto.toString();
       }
   }
   ```

   如上, 即可自动进行属性转换, 其原理是在编译时自动生成set和get相关代码,避免自己在业务中手写大量重复代码

   ### 注意

   现在很多项目都会整合lombok插件, 同属于编译时插件, mapstruct插件依赖于对象的get和set方法, 因此在插件引入时, 需要将lombok插件放在mapstruct插件之前. 像这样

   ```xml
               <plugin>
                   <groupId>org.apache.maven.plugins</groupId>
                   <artifactId>maven-compiler-plugin</artifactId>
                   <version>3.8.1</version>
                   <configuration>
                       <source>1.8</source>
                       <target>1.8</target>
                       <annotationProcessorPaths>
                           <path>
                               <groupId>org.projectlombok</groupId>
                               <artifactId>lombok</artifactId>
                               <version>${lombok.version}</version>
                           </path>
                           <path>
                               <groupId>org.mapstruct</groupId>
                               <artifactId>mapstruct-processor</artifactId>
                               <version>1.5.5.Final</version>
                           </path>
                       </annotationProcessorPaths>
                   </configuration>
               </plugin>
   ```

   否则, 编译时就会出现找不到方法等异常.

