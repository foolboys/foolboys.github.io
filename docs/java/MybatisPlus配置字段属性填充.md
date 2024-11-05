---
title: MybatisPlus配置字段属性填充
date: 2024-11-04
tags:
  - mybatis
  - mybatis-plus
---
## Mybatis-Plus配置字段属性填充

在日常开发中, 常常会遇到有些数据库字段必填, 但是又重复编写的情况, 给自己浪费大量时间. 而在集成了mybatis-plus的项目中, 解决这个就相对比较简单了.

mybatis-plus提供了字段属性注入的接口, 我们只需要实现这个接口, 然后配置相应的填充即可, 简单配置如下:
```java
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {  
  

    private final String UPDATE_BY = "updateBy";  
  
  
    private final String UPDATED_BY = "updatedBy";  
  
    /**  
     * 未找到查询方法  
     * @param metaObject  
     */  
    @Override  
    public void insertFill(MetaObject metaObject) {  
        String userName = JwtUserUtil.getUsername();  
        this.strictInsertFill(metaObject, UPDATE_BY, String.class, userName);  
        this.strictInsertFill(metaObject, UPDATED_BY, String.class, userName);  
    }  
  
    @Override  
    public void updateFill(MetaObject metaObject) {  
        String userName = JwtUserUtil.getUsername();  
        this.strictInsertFill(metaObject, UPDATE_BY, String.class, userName);  
        this.strictInsertFill(metaObject, UPDATED_BY, String.class, userName);  
    }  
  
  
    @Override  
    public MetaObjectHandler strictFillStrategy(MetaObject metaObject, String fieldName, Supplier<?> fieldVal) {  
        // 但当自动填充字段为 updateTime 时，始终更新它  
        if (fieldName.equals(UPDATE_TIME) || fieldName.equals(UPDATE_BY) || fieldName.equals(UPDATED_At) || fieldName.equals(UPDATED_BY)) {  
            Object obj = fieldVal.get();  
            metaObject.setValue(fieldName, obj);  
            // 这个 if 是源码中的
        } else if (metaObject.getValue(fieldName) == null) {   
            Object obj = fieldVal.get();  
            if (Objects.nonNull(obj)) {  
                metaObject.setValue(fieldName, obj);  
            }  
        }  
        return this;  
    }
```

然后在mybatis的实体类上加上注解
```java
@TableField(fill = FieldFill.INSERT_UPDATE)  
private Long updateBy;
```

后续在使用mybatis-plus进行新增/修改操作时, 就会自动填充属性了

如果上述配置不生效, 那说明可能是系统手动中配置了sqlSession相关, 导致注入配置失效, 此时, 我们需要在手动配置的地方加上属性注入, 代码如下:
```java
@Configuration  
public class MybatisPlusConfig {  
  
    @Bean  
    public MybatisSqlSessionFactoryBean sqlSessionFactory(DataSource dataSource) throws IOException {  
        MybatisSqlSessionFactoryBean sessionFactory = new MybatisSqlSessionFactoryBean();  
        sessionFactory.setDataSource(dataSource);  
        // 全局配置  
        GlobalConfig globalConfig = new GlobalConfig();  
        // 配置填充器 MyMetaObjectHandler 可以直接 @Autowired 先注入，就不用new了  
        globalConfig.setMetaObjectHandler(new MyMetaObjectHandler());  
        sessionFactory.setGlobalConfig(globalConfig);  
        return sessionFactory;  
    }  
}
```

这样, 在后续编码中使用到mybatis-plus的地方就不需要在频繁填充这些字段啦.
