var {encode,decode,tools,type}= require('./encrypt')

console.log(encode('teststr',type.STR))//普通文本加密测试
var bin=tools.Str2Bin('test')//二进制转换测试
console.log(bin,encode(bin,type.BIN))//二进制文本加密测试
var hex=tools.Str2Hex('Hextest')
console.log(hex,encode(hex,type.HEX))//16进制文本加密测试
var ret=encode('testdecode',type.STR)//加密供解密测试
console.log(ret,decode(ret))//解密测试
//console.log(main)//打印结构
//测试自定义预处理&后处理函数
function testHook(data){
    return '110';
}
let opts={dataafter:testHook};
console.log(encode('test',type.STR,opts));