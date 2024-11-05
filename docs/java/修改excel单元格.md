---
title: 修改excel单元格
date: 2024-11-04
tags:
  - excel
---

> 需要先复制单元格样式, 啊然后在设置, 否则excel中有共享样式的话会导致共享样式的单元格全部变色



```java

public class TestExcel {  
  
  
    static final String PATH = "E:/doc/202310071810172dbf.xlsx";  
  
    public static void main(String[] args) {  
        ExcelWriter writer = ExcelUtil.getWriter(PATH);  
        String s = writer.getSheetNames().get(0);  
        writer = writer.setSheet(s);  
        CellStyle oldStyle = writer.getOrCreateCellStyle("A5");  
        CellStyle newStyle = writer.createCellStyle("A5");  
        BeanUtils.copyProperties(oldStyle, newStyle);  
        newStyle.setFillForegroundColor(IndexedColors.LIGHT_ORANGE.getIndex());  
        //创建工作薄  
        newStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);  
        writer.close();  
    }  
}
```
