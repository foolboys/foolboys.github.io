---
title: java过滤器拦截器中添加请求header
date: 2024-11-05
tags:
  - 过滤器
  - 请求头
---
## java过滤器拦截器中添加请求header

目前, 在servlet中只提供了request.getHeader()的方法, 但是在日常开发中, 我们经常会遇到又需要改动request请求头的情况. 像是在身份认证,或者请求头参数.
这种情况下, 就不能依赖于httpServletRequest的api了,这里我们需要利用servlet的装饰器, 改写servlet的部分方法,这样就可以在filter或者intercepter中加入自己想要的请求头了,具体代码实现如下:

```java  
/**  
 * 改写添加header  
 * * @author RYH  
 * @since 2023/3/20  
 **/
 public class HeaderMapRequestWrapper extends HttpServletRequestWrapper {  
    public HeaderMapRequestWrapper(HttpServletRequest request) {  
        super(request);  
    }  
  
    private final Map<String, String> headerMap = new HashMap<>();  
  
    public void addHeader(String name, String value) {  
        headerMap.put(name, value);  
    }  
  
    @Override  
    public String getHeader(String name) {  
        String headerValue = super.getHeader(name);  
        if (headerMap.containsKey(name)) {  
            headerValue = headerMap.get(name);  
        }  
        return headerValue;  
    }  
  
    @Override  
    public Enumeration<String> getHeaderNames() {  
        List<String> names = Collections.list(super.getHeaderNames());  
        names.addAll(headerMap.keySet());  
        return Collections.enumeration(names);  
    }  
  
    @Override  
    public Enumeration<String> getHeaders(String name) {  
        List<String> values = Collections.list(super.getHeaders(name));  
        if (headerMap.containsKey(name)) {  
            values.add(headerMap.get(name));  
        }  
        return Collections.enumeration(values);  
    }  
}
```

然后, 在过滤器中/拦截器中, 将原来的request对象进行装饰, 就可以实现改写请求头的目的了.具体代码如下:
```java
/**  
 * @author RYH  
 * @since 2023/3/20  
 **/
@WebFilter(urlPatterns = "/v1/*")  
public class DefaultApiTypeFilter implements Filter {  
  
    @Override  
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {  
        HttpServletRequest req = (HttpServletRequest) request;  
        String apiType = req.getHeader(Constant.HEADERS_API_TYPE);  
        if (StringUtils.isEmpty(apiType)) {  
            HeaderMapRequestWrapper requestWrapper = new HeaderMapRequestWrapper(req);  
            requestWrapper.addHeader(Constant.HEADERS_API_TYPE, "abcd");  
            chain.doFilter(requestWrapper, response);  
            return;  
        }  
        chain.doFilter(request, response);  
    }  
}
```
