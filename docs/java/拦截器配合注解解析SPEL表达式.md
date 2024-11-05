---
title: 拦截器配合注解解析SPEL表达式
date: 2024-11-04
tags:
  - 拦截器
  - 自定义注解
---
### 定义注解

```java
/**  
 * @author RYH  
 * @since 2023/12/27  
 **/@Target({ElementType.METHOD})  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
public @interface TestSpe {  
  
    String value();  
}
```

### 定义拦截器

```java
/**  
 * @author RYH  
 * @since 2023/6/16  
 **/@Slf4j  
public class SpeInterceptor implements MethodInterceptor {  
    /**  
     * 上下文对象  
     */  
    private final ApplicationContext applicationContext;  
  
    public SpeInterceptor(ApplicationContext applicationContext) {  
        this.applicationContext = applicationContext;  
    }  
  
    @Override  
    public Object invoke(MethodInvocation invocation) throws Throwable {  
        TestSpe testSpe = invocation.getMethod().getAnnotation(TestSpe.class);  
        String exp = testSpe.value();  
        MethodBasedEvaluationContext evaluationContext = new MethodBasedEvaluationContext(TypedValue.NULL, invocation.getMethod(),  
                invocation.getArguments(), new DefaultParameterNameDiscoverer());  
        evaluationContext.setBeanResolver(new BeanFactoryResolver(applicationContext));  
        ExpressionParser parser = new SpelExpressionParser();  
        Expression expression = parser.parseExpression(testSpe.value());  
        Object value = expression.getValue(evaluationContext);  
        log.info("解析到参数表达式参数>>>>>:{}", value);  
        return invocation.proceed();  
    }  
}
```


### 注册拦截器
```java
@Bean  
public DefaultPointcutAdvisor timePointcutAdvisor2(ApplicationContext context) {  
    SpeInterceptor interceptor = new SpeInterceptor(context);  
    AnnotationMatchingPointcut annotationMatchingPointcut = AnnotationMatchingPointcut.forMethodAnnotation(TestSpe.class);  
    DefaultPointcutAdvisor advisor = new DefaultPointcutAdvisor();  
    advisor.setPointcut(annotationMatchingPointcut);  
    advisor.setAdvice(interceptor);  
    return advisor;  
}
```

### 测试

#### 参数类型
```java
@MethodLog  
@TestSpe("#season")  
@GetMapping("/test2")  
public String test2(String season) throws IOException, InterruptedException {  
    Thread.sleep(5000);  
    return "HELLO WORLD";  
}
```
#### 结果
```bash
c.r.springboot.intecpter.SpeInterceptor  : 解析到参数表达式参数>>>>>:spring
```

#### bean类型
```java
@TestSpe("@ss.testLock(null)")  
@PostMapping("/test3")  
public String test(String aaa) throws IOException {  
    return "HELLO WORLD";  
}
```

#### 结果
```bash
c.r.springboot.intecpter.SpeInterceptor  : 解析到参数表达式参数>>>>>:成功
```
