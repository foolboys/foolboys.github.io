(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{465:function(s,a,e){"use strict";e.r(a);var t=e(2),r=Object(t.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"_1-生成jks文件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-生成jks文件"}},[s._v("#")]),s._v(" 1. 生成JKS文件")]),s._v(" "),a("p",[s._v("在cmd中执行JDK中keytool的命令：")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("keytool "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-genkeypair")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-alias")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("test")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-validity")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("36500")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-keyalg")]),s._v(" RSA "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-dname")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"CN=jwt,OU=jtw,O=jwt,L=zurich,S=zurich, C=CH"')]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-keypass")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("123456")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-keystore")]),s._v(" test.keystore "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-storepass")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("123456")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("或者省略-dname参数（执行命令时会再次提示输入）：")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("keytool "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-genkeypair")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-alias")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("test")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-validity")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("36500")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-keyalg")]),s._v(" RSA "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-keypass")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("123456")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-keystore")]),s._v(" test.jks "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-storepass")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("123456")]),s._v("\n \n执行完命令后，会警告：\n\nJKS 密钥库使用专用格式。建议使用 "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"keytool -importkeystore -srckeystore test.jks -destkeystore test.jks -deststoretype pkcs12"')]),s._v(" 迁移到行业标准格式 PKCS12。\n\n此时，安装提示的命令，再执行一下即可，整个过程如下：\n\n\n\n"),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v(". 使用openssl查看公钥\n"),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.1")]),s._v(" 安装openssl（如果电脑上已经安装过了，就可以跳过）\nURL: http://slproweb.com/products/Win32OpenSSL.html\n\n安装完成后，配置环境变量。把openssl安装路径bin的路径（例如 C:"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("Program Files"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("OpenSSL-Win64"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("bin）加入到操作系统的系统环境变量Path中。\n\n关闭当前cmd窗口，或者重启电脑，重新打开一个cmd，此时openssl命令就可以直接使用了。\n\n"),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.2")]),s._v(" 查看公钥\n执行查看公钥的命令：\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# keytool -list -rfc --keystore test.jks | openssl x509 -inform pem -pubkey")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br")])]),a("p",[s._v('解释\n-alias test              别名\n-validity 36500          过期时间（天），默认大约90天\n-keyalg RSA              加密算法\n-dname "CN=jwt,OU=jtw,O=jwt,L=zurich,S=zurich, C=CH"  名字与姓氏，组织单位，城市，区县，国家代码\n-keypass 123456          key密码，证书的密码\n-keystore test.jks       生成的jks文件位置和名称\n-storepass 123456        strore密码，证书库的密码')]),s._v(" "),a("h1",{attrs:{id:"_2-执行完命令后-会警告"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-执行完命令后-会警告"}},[s._v("#")]),s._v(" 2. 执行完命令后，会警告：")]),s._v(" "),a("p",[a("code",[s._v('JKS 密钥库使用专用格式。建议使用 "keytool -importkeystore -srckeystore test.jks -destkeystore test.jks -deststoretype pkcs12" 迁移到行业标准格式 PKCS12。')])]),s._v(" "),a("p",[s._v("此时，安装提示的命令，再执行一下即可，整个过程如下：\n"),a("img",{attrs:{src:"https://gitee.com/isfoolboy/image/raw/master/202411061020114.png",alt:"Pasted image 20230421161618"}})]),s._v(" "),a("h1",{attrs:{id:"_3-使用openssl查看公钥"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-使用openssl查看公钥"}},[s._v("#")]),s._v(" 3.使用openssl查看公钥")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("keytool "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-list")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-rfc")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--keystore")]),s._v(" test.jks "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" openssl x509 "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-inform")]),s._v(" pem "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-pubkey")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("生成的公钥如下（-----BEGIN PUBLIC KEY----- 和 -----END PUBLIC KEY----- 之间的是公钥，包括这两个头和尾）\n"),a("img",{attrs:{src:"https://gitee.com/isfoolboy/image/raw/master/202411061020744.png",alt:"Pasted image 20230421162103"}})]),s._v(" "),a("h1",{attrs:{id:"_3-从jks或者keystore文件-导出公钥publickey-cer证书"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-从jks或者keystore文件-导出公钥publickey-cer证书"}},[s._v("#")]),s._v(" 3. 从JKS或者keystore文件，导出公钥publickey.cer证书")]),s._v(" "),a("p",[s._v("执行命令：")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("keytool -export -alias test -keystore test.jks -file test-publickey.cer\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("然后可以在windows系统下，双击证书文件，可以查看证书信息。")])])}),[],!1,null,null,null);a.default=r.exports}}]);