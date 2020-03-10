//字符串转二进制
function Str2Bin(str) {
    var buffer = Buffer.from(str);
    const length = buffer.length;
    let ret = '';
    for (let i = 0; i < length; i++) {
        const bin = Number(buffer[i]).toString(2)
        ret += '0'.repeat(8 - bin.length) + bin; // 不足八位前置补0
    }
    return ret.toString();
}
function Bin2Str(bin) {
    var str = '';
    for (var i = 0; i < bin.length; i = i + 8) {
        let s = bin.slice(i, i + 8);
        s = s.slice(s.indexOf('1'));
        str = str + s + ' ';
    }
    var result = [];
    var list = str.split(" ");
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var asciiCode = parseInt(item, 2);
        var charValue = String.fromCharCode(asciiCode);
        result.push(charValue);
    }
    return result.join("");
}
//字符串转16进制
function Str2Hex(str) {
    var val = new Array();
    var ret = '';
    for (var i = 0; i < str.length; i++) {
        val[i] = str.charCodeAt(i).toString(16);
        if (val[i].length != 2) {
            val[i] = '0' + val[i];
        }
    }
    for (var i = 0; i < val.length; i++) {
        ret += val[i];
    }
    return ret;
}
//16进制转字符串
function Hex2Str(hex) {
    var str = new Array();
    for (var i = 0; i < (hex.length / 2); i++) {
        str[i] = hex.substr(i * 2, 2);
    }
    var val = '';
    for (var i = 0; i < str.length; i++) {
        val += String.fromCharCode('0x' + str[i]);
    }
    return val;
}
function UpdateStr(str,substr,position){
    position=position|0;
    let s=str.slice(0,position-1);
    let e=str.slice(position);
    return s+substr+e;
}
const TYPE_BIN = 0;
const TYPE_STR = 1;
const TYPE_HEX = 2;
//特征值异变，by Rsteam
function encode(odata, type, param) {
    param = param | {};//设置header
    switch (type) {
        case 1:
            odata = Str2Bin(odata);
            break;
        case 2:
            odata = Str2Bin(Hex2Str(odata));
            break;
    }
    var posarr = [];//挂空，初始化
    var length = 0;//默认置零
    var data = "";//挂空，初始化
    //首次循环预定义length
    for (var i = 0; i < odata.length; i++) { if (odata[i] == 1) { if ((((i + 1).toString(16)).length % 2) == 1) { length = ((i + 1).toString(16)).length + 1; } } }
    for (var i = 0; i < odata.length; i++) {
        //定位特征值
        if (odata[i] == 1) {
            var ostr = (i + 1).toString(16);
            ostr = '0'.repeat(length - ostr.length) + ostr;
            posarr.push(ostr);
        }
        //防止数组超标
        if (i % 255 == 0) {
            while (posarr.length != 0) {
                var rand = parseInt(Math.random() * posarr.length);
                data += posarr[rand];
                posarr.splice(rand, 1);
            }
        }
    }
    //处理剩余数据
    while (posarr.length != 0) {
        var rand = parseInt(Math.random() * posarr.length);
        data += posarr[rand];
        posarr.splice(rand, 1);
    }
    //add header(16-bit)
    //特征length
    length = length.toString(16);
    //格式化header:特征值长度
    length = '0'.repeat(8 - length.length) + length;
    //反特征length
    let dlength = odata.length.toString(16);
    //格式化header:总长度
    dlength = '0'.repeat(8 - dlength.length) + dlength;
    header = dlength + length;
    data = header + data;
    return data;
}
function decode(str){
    str=str.toString();
    //header parser
    var header={data_length:0,length:0};
    header.data_length=parseInt(str.slice(0,8),16);
    header.length=parseInt(str.slice(8,16),16);
    let data=str.slice(16);
    var ret='0'.repeat(header.data_length);
    console.log(data.length)
    for(var i=0;i<data.length;i=i+header.length){
        //console.log(i)
        //console.log(data.slice(i,header.length))
        let position=parseInt(data.slice(i,i+header.length),16);
        //console.log(position)
        ret=UpdateStr(ret,'1',position);
    }
    return ret;
}
module.exports={encode,decode,Bin2Str,Str2Bin,Str2Hex,Hex2Str,TYPE_BIN,TYPE_STR,TYPE_HEX}
