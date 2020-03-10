var main= require('./encrypt')

console.log(main.encode('teststr',main.TYPE_STR))//普通文本加密测试
var bin=Str2Bin('test')//二进制转换测试
console.log(bin,main.encode(bin,main.TYPE_BIN))//二进制文本加密测试
var hex=Str2Hex('Hextest')
console.log(hex,main.encode(hex,main.TYPE_HEX))//16进制文本加密测试
var ret=main.encode('testdecode',main.TYPE_STR)//加密供解密测试
console.log(ret,main.decode(ret))//解密测试
console.log(main)//打印结构
