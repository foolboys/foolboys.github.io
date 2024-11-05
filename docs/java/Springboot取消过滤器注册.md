---
title: Springboot取消过滤器注册
date: 2024-11-04
tags:
  - 过滤器
---
> 有时候会有部分jar里面引入了我们不需要的Filter, 但是有没有提供取消注入的条件, 可以使用此方法


- 代码
```java  
/**  
* @author RYH  
* @since 2023/5/17  
**/  
@Configuration  
public class FilterConfig {  
/**  
* 干掉验签使用的过滤器,因为会导致取request.getParameterMaps()失效  
*  
* @param filter 验签过滤器  
* @return bean  
*/  
@Bean  
public FilterRegistrationBean<SignRequestIoFilter> cancelMyFilterRegistration(SignRequestIoFilter filter) {  
		FilterRegistrationBean<SignRequestIoFilter> registration = new FilterRegistrationBean<SignRequestIoFilter>(filter);  
	registration.setEnabled(false);  
	return registration;  
	}  
}

```
