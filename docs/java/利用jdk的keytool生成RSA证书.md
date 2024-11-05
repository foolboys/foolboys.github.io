---
title: 利用jdk的keytool生成RSA证书
date: 2024-11-04
tags:
  - keytools
  - 证书
---
# 1. 生成JKS文件
在cmd中执行JDK中keytool的命令：
```bash
keytool -genkeypair -alias test -validity 36500 -keyalg RSA -dname "CN=jwt,OU=jtw,O=jwt,L=zurich,S=zurich, C=CH" -keypass 123456 -keystore test.keystore -storepass 123456
```
 
或者省略-dname参数（执行命令时会再次提示输入）：
```bash
keytool -genkeypair -alias test -validity 36500 -keyalg RSA -keypass 123456 -keystore test.jks -storepass 123456
 
执行完命令后，会警告：

JKS 密钥库使用专用格式。建议使用 "keytool -importkeystore -srckeystore test.jks -destkeystore test.jks -deststoretype pkcs12" 迁移到行业标准格式 PKCS12。

此时，安装提示的命令，再执行一下即可，整个过程如下：



2. 使用openssl查看公钥
2.1 安装openssl（如果电脑上已经安装过了，就可以跳过）
URL: http://slproweb.com/products/Win32OpenSSL.html

安装完成后，配置环境变量。把openssl安装路径bin的路径（例如 C:\Program Files\OpenSSL-Win64\bin）加入到操作系统的系统环境变量Path中。

关闭当前cmd窗口，或者重启电脑，重新打开一个cmd，此时openssl命令就可以直接使用了。

2.2 查看公钥
执行查看公钥的命令：
# keytool -list -rfc --keystore test.jks | openssl x509 -inform pem -pubkey
```


解释
	-alias test              别名
	 -validity 36500          过期时间（天），默认大约90天
	 -keyalg RSA              加密算法
	 -dname "CN=jwt,OU=jtw,O=jwt,L=zurich,S=zurich, C=CH"  名字与姓氏，组织单位，城市，区县，国家代码
	-keypass 123456          key密码，证书的密码
	-keystore test.jks       生成的jks文件位置和名称
	-storepass 123456        strore密码，证书库的密码



# 2. 执行完命令后，会警告：
`JKS 密钥库使用专用格式。建议使用 "keytool -importkeystore -srckeystore test.jks -destkeystore test.jks -deststoretype pkcs12" 迁移到行业标准格式 PKCS12。`

此时，安装提示的命令，再执行一下即可，整个过程如下：
![[Pasted image 20230421161618.png]]
# 3.使用openssl查看公钥
```bash
keytool -list -rfc --keystore test.jks | openssl x509 -inform pem -pubkey
```
生成的公钥如下（-----BEGIN PUBLIC KEY----- 和 -----END PUBLIC KEY----- 之间的是公钥，包括这两个头和尾）
![[Pasted image 20230421162103.png]]
# 3. 从JKS或者keystore文件，导出公钥publickey.cer证书
执行命令：
```
keytool -export -alias test -keystore test.jks -file test-publickey.cer
```
然后可以在windows系统下，双击证书文件，可以查看证书信息。
