---
title: url参数拼接
date: 2024-11-04
tags:
  - url参数
---

```java
/**
 * url参数拼接
 *
 * @param source 参数
 * @return 拼接好的字符串
 */
public static String asUrlParams(Map<String, String> source) {
    return Joiner.on("&")
            // 用指定符号代替空值,key 或者value 为null都会被替换
            .useForNull("")
            .withKeyValueSeparator("=")
            .join(source);
}
```
