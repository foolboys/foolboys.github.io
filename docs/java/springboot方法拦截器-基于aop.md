---
title: springboot方法拦截器-基于aop
date: 2024-11-04
tags:
  - 拦截器
---

## 1. 引入aop依赖
```xml
<dependency>  
   <groupId>org.springframework.boot</groupId>  
   <artifactId>spring-boot-starter-aop</artifactId>  
   <version>2.7.12</version>  
</dependency>
```

## 2. 编写拦截器
```java
/**  
* @author RYH  
* @since 2023/6/16  
**/  
public class MyInterceptor implements MethodInterceptor {  
	@Override  
	public Object invoke(MethodInvocation invocation) throws Throwable {  
	System.out.println(invocation.getMethod().getName());  
	return invocation.proceed();  
	}  
}
```

## 3. 编写拦截器配置

### 切点表达式
```java
/**  
* @author RYH  
* @since 2023/6/25  
**/  
@Configuration  
public class InterceptorConfig {  
	//注意该地址为项目具体包地址  
	public static final String traceExecution = "execution(* com.ryh.springboot.controller..*.*(..))";  
	  
	@Bean  
	public DefaultPointcutAdvisor defaultPointcutAdvisor2() {  
		MyInterceptor interceptor = new MyInterceptor();  
		AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();  
		pointcut.setExpression(traceExecution);  
		DefaultPointcutAdvisor advisor = new DefaultPointcutAdvisor();  
		advisor.setPointcut(pointcut);  
		advisor.setAdvice(interceptor);  
		return advisor;  
	}  
}
```


### 注解模式
```java
@Configuration  
public class InterceptorConfig {  
    //注意该地址为项目具体包地址  
    public static final String traceExecution = "execution(* com.ryh.springboot.controller..*.*(..))";  
   
    @Bean  
    public DefaultPointcutAdvisor timePointcutAdvisor2() {  
        TimeInterceptor interceptor = new TimeInterceptor();  
        AnnotationMatchingPointcut annotationMatchingPointcut = AnnotationMatchingPointcut.forMethodAnnotation(Times.class);  
        DefaultPointcutAdvisor advisor = new DefaultPointcutAdvisor();  
        advisor.setPointcut(annotationMatchingPointcut);  
        advisor.setAdvice(interceptor);  
        return advisor;  
    }  
}
```



## 4. 访问测试

![Pasted image 20230625174747](image/Pasted%20image%2020230625174747.png)
