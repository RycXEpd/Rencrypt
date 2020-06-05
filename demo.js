var main= require('./encrypt')

console.log(main.encode('teststr',main.type.STR))//普通文本加密测试
var bin=main.tools.Str2Bin('test')//二进制转换测试
console.log(bin,main.encode(bin,main.type.BIN))//二进制文本加密测试
var hex=main.tools.Str2Hex('Hextest')
console.log(hex,main.encode(hex,main.type.HEX))//16进制文本加密测试
var ret=main.encode('testdecode',main.type.STR)//加密供解密测试
console.log(ret,main.decode(ret))//解密测试
console.log(main)//打印结构
