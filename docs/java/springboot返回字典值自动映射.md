---
title: springboot返回字典值自动映射
date: 2024-11-04
tags:
- aop
- 字典
---

在日常开发中, 我们有时候会遇到需要将后端返回的字段进行自动转换给前端的状况, 但是每次转换之前都要循环的去修改然后返回, 或者数据库关联字典表, 这样处理其起来会比较麻烦, 这种情况下, 我们可以配合spring自带的json解析来进行处理, 相关参考如下:


### 注解
```java
/**  
 * @author RYH  
 * @since 2024/1/2  
 **/@Target({ElementType.FIELD})  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
public @interface Dict {  
  
    String value() default "";  
  
    String dictType() default "";  
  
    Class<? extends BaseMapping> mappingClass() default StaticDictMapping.class;  
}
```



### 映射配置
```java
package com.ryh.springboot.config;  
  
import cn.hutool.extra.spring.SpringUtil;  
import com.fasterxml.jackson.databind.ObjectMapper;  
import com.github.pagehelper.PageInfo;  
import com.ryh.springboot.annos.Dict;  
import com.ryh.springboot.dto.AjaxResult;  
import com.ryh.springboot.mapping.BaseMapping;  
import org.apache.commons.collections4.CollectionUtils;  
import org.apache.commons.collections4.MapUtils;  
import org.springframework.beans.BeanUtils;  
import org.springframework.cglib.beans.BeanGenerator;  
import org.springframework.context.annotation.Configuration;  
import org.springframework.http.HttpOutputMessage;  
import org.springframework.http.MediaType;  
import org.springframework.http.converter.HttpMessageNotWritableException;  
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;  
import org.springframework.lang.Nullable;  
  
import java.io.IOException;  
import java.lang.reflect.Field;  
import java.lang.reflect.Modifier;  
import java.lang.reflect.Type;  
import java.util.Arrays;  
import java.util.Collections;  
import java.util.List;  
import java.util.Map;  
import java.util.Objects;  
import java.util.stream.Collectors;  
  
/**  
 * @author RYH  
 * @since 2024/1/10  
 **/@Configuration  
public class DictJsonConvert extends MappingJackson2HttpMessageConverter {  
  
    public DictJsonConvert(ObjectMapper objectMapper) {  
        super(objectMapper);  
    }  
  
    @Override  
    protected void writeInternal(Object o, @Nullable Type type, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {  
        if (o instanceof PageInfo && !CollectionUtils.isEmpty(((PageInfo) o).getList())) {  
            ((PageInfo) o).setList(parseObjToMap(((PageInfo) o).getList()));  
        }  
        if (o instanceof AjaxResult && Objects.nonNull(((AjaxResult) o).get("data"))) {  
            Object data = ((AjaxResult) o).get("data");  
            Object parsed = parseObjToMap(data instanceof List ? (List<?>) data : Collections.singletonList(data));  
            if (Objects.isNull(parsed)) {  
                ((AjaxResult) o).put("data", null);  
            }  
            ((AjaxResult) o).put("data", data instanceof List ? parsed : ((List<?>) parsed).get(0));  
        }  
        super.writeInternal(o, type, outputMessage);  
    }  
  
    @Override  
    protected boolean canWrite(MediaType mediaType) {  
        return Objects.nonNull(mediaType) && Objects.equals(mediaType.toString(), "application/json");  
    }  
  
    public List<?> parseObjToMap(List<?> rows) {  
        return rows.stream().map(o -> {  
            Map<String, Object> labelMap = getLabelStr(o);  
            if (!MapUtils.isEmpty(labelMap)) {  
                return createDynamicBean(o, labelMap);  
            }  
            return o;  
        }).collect(Collectors.toList());  
    }  
  
    private Object createDynamicBean(Object source, Map<String, Object> labelMap) {  
        BeanGenerator generator = new BeanGenerator();  
        generator.setSuperclass(source.getClass());  
        labelMap.forEach((k, v) -> generator.addProperty(k + "Label", Object.class));  
        Object proxy = generator.create();  
        BeanUtils.copyProperties(source, proxy);  
        final Class<?> dynamicObjClass = proxy.getClass();  
        labelMap.forEach((k, v) -> {  
            try {  
                Field field = dynamicObjClass.getDeclaredField("$cglib_prop_" + k + "Label");  
                field.setAccessible(true);  
                field.set(proxy, v);  
            } catch (Exception e) {  
                logger.error(e);  
            }  
        });  
        return proxy;  
    }  
  
    private Map<String, Object> getLabelStr(Object o) {  
        return Arrays.stream(o.getClass().getDeclaredFields()).filter(field -> !Modifier.isFinal(field.getModifiers()))  
                .filter(field -> field.isAnnotationPresent(Dict.class)).collect(Collectors.toMap(Field::getName, field -> {  
                    try {  
                        field.setAccessible(true);  
                        Object val = field.get(o);  
                        if (Objects.nonNull(val)) {  
                            Dict dict = field.getAnnotation(Dict.class);  
                            BaseMapping mapping = SpringUtil.getBean(dict.mappingClass());  
                            if (Objects.isNull(mapping)) {  
                                mapping = dict.mappingClass().newInstance();  
                            }  
                            return Objects.requireNonNull(mapping).mapping(val, dict.dictType(), field.getName());  
                        }  
                    } catch (Exception e) {  
                        logger.error(e.getMessage(), e);  
                    }  
                    return Collections.emptyMap();  
                }));  
    }  
}
```

### 实体类

```java
package com.ryh.springboot.dto;  
  
  
import org.apache.commons.lang3.StringUtils;  
  
import java.util.HashMap;  
import java.util.Objects;  
  
/**  
 * 操作消息提醒  
 *  
 * @author RYH  
 */public class AjaxResult extends HashMap<String, Object> {  
    private static final long serialVersionUID = 1L;  
  
    /**  
     * 状态码  
     */  
    public static final String CODE_TAG = "code";  
  
    /**  
     * 返回内容  
     */  
    public static final String MSG_TAG = "msg";  
  
    /**  
     * 数据对象  
     */  
    public static final String DATA_TAG = "data";  
  
    /**  
     * 初始化一个新创建的 AjaxResult 对象，使其表示一个空消息。  
     */  
    public AjaxResult() {  
    }  
    /**  
     * 初始化一个新创建的 AjaxResult 对象  
     *  
     * @param code 状态码  
     * @param msg  返回内容  
     */  
    public AjaxResult(int code, String msg) {  
        super.put(CODE_TAG, code);  
        super.put(MSG_TAG, msg);  
    }  
  
    /**  
     * 初始化一个新创建的 AjaxResult 对象  
     *  
     * @param code 状态码  
     * @param msg  返回内容  
     * @param data 数据对象  
     */  
    public AjaxResult(int code, String msg, Object data) {  
        super.put(CODE_TAG, code);  
        super.put(MSG_TAG, msg);  
        if (Objects.nonNull(data)) {  
            super.put(DATA_TAG, data);  
        }  
    }  
  
    /**  
     * 返回成功消息  
     *  
     * @return 成功消息  
     */  
    public static AjaxResult success() {  
        return AjaxResult.success("操作成功");  
    }  
  
    /**  
     * 返回成功数据  
     *  
     * @return 成功消息  
     */  
    public static AjaxResult success(Object data) {  
        return AjaxResult.success("操作成功", data);  
    }  
  
    /**  
     * 返回成功消息  
     *  
     * @param msg 返回内容  
     * @return 成功消息  
     */  
    public static AjaxResult success(String msg) {  
        return AjaxResult.success(msg, null);  
    }  
  
    /**  
     * 返回成功消息  
     *  
     * @param msg  返回内容  
     * @param data 数据对象  
     * @return 成功消息  
     */  
    public static AjaxResult success(String msg, Object data) {  
        return new AjaxResult(200, msg, data);  
    }  
  
    /**  
     * 返回错误消息  
     *  
     * @return  
     */  
    public static AjaxResult error() {  
        return AjaxResult.error("操作失败");  
    }  
  
    /**  
     * 返回错误消息  
     *  
     * @param msg 返回内容  
     * @return 警告消息  
     */  
    public static AjaxResult error(String msg) {  
        return AjaxResult.error(msg, null);  
    }  
  
    /**  
     * 返回错误消息  
     *  
     * @param msg  返回内容  
     * @param data 数据对象  
     * @return 警告消息  
     */  
    public static AjaxResult error(String msg, Object data) {  
        return new AjaxResult(500, msg, data);  
    }  
  
    /**  
     * 返回错误消息  
     *  
     * @param code 状态码  
     * @param msg  返回内容  
     * @return 警告消息  
     */  
    public static AjaxResult error(int code, String msg) {  
        return new AjaxResult(code, msg, null);  
    }  
}

```


```java
package com.ryh.springboot.dto;  
  
import com.ryh.springboot.annos.Dict;  
import com.ryh.springboot.mapping.StaticDictMapping;  
import lombok.Data;  
  
/**  
 * @author RYH  
 * @since 2023/6/29  
 **/@Data  
public class TestDict {  
  
    private String name;  
  
    @Dict(mappingClass = StaticDictMapping.class)  
    private String hobby;  
  
  
    private String hobbyCh;  
}

```

### 映射接口
```java
  
/**  
 * @author RYH  
 * @since 2024/1/11  
 **/public interface BaseMapping {  
  
    Object mapping(Object o, String dictName, String propertyName);  
}
```


### 映射实现
```java
package com.ryh.springboot.mapping;  
  
import org.springframework.stereotype.Component;  
  
/**  
 * @author RYH  
 * @since 2024/1/11  
 **/@Component  
public class StaticDictMapping implements BaseMapping {  
    @Override  
    public Object mapping(Object o, String dictName, String propertyName) {  
        if ("basketball".equals(o)) {  
            return "唱跳rap篮球";  
        }  
        return null;  
    }  
}

```
