function Str2Bin(Str){
    var ret='';
    for(let i=0;i<Str.length;i++){
        let temp=Str.charCodeAt(i).toString(2);
        //ret+='0'.repeat(8-temp.length)+temp;//原始方法
        ret+=temp.padStart(8,'0');
    }
    return ret;
}
function Bin2Str(Bin){
    var ret='';
    for(let i=0;i<Bin.length;i=i+8){
        let temp=Bin.slice(i,i+8);
        temp=parseInt(temp,2);
        ret+=String.fromCharCode(temp);
    }
    return ret;
}
function Str2Hex(Str){
    var ret='';
    for(let i=0;i<Str.length;i++){
        let temp=Str.charCodeAt(i).toString(16);
        //ret+='0'.repeat(2-temp.length)+temp;//原始方法
        ret+=temp.padStart(2,'0');
    }
    return ret;
}
function Hex2Str(Hex){
    var ret='';
    for(let i=0;i<Hex.length;i=i+2){
        let temp=Hex.slice(i,i+2);
        temp=parseInt(temp,16);
        ret+=String.fromCharCode(temp);
    }
    return ret;
}
function Hex2Bin(Hex){
    var ret='';
    for(let i=0;i<Hex.length;i=i+2){
        let temp=Hex.slice(i,i+2);
        temp=parseInt(temp,16);
        temp=temp.toString(2);
        ret+=temp.padStart(8,'0');
    }
    return ret;
}
function Bin2Hex(Bin){
    var ret='';
    for(let i=0;i<Bin.length;i=i+8){
        let temp=Bin.slice(i,i+8);
        temp=parseInt(temp,2);
        temp=temp.toString(16);
        ret+=temp.padStart(2,'0');
    }
    return ret;
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
//特征值异变
function encode(odata, type, param) {
    param = param | {};//设置header
    switch (type) {
        case 1:
            odata = Str2Bin(odata);
            break;
        case 2:
            odata = Hex2Bin(odata);
            break;
    }
    var posarr = [];//挂空，初始化
    var length = 0;//默认置零
    var data = "";//挂空，初始化
    //for (var i = 0; i < odata.length; i++) { if (odata[i] == 1) { if ((((i + 1).toString(16)).length % 2) == 1) { length = ((i + 1).toString(16)).length + 1; } } }
    length=odata.lastIndexOf('1').toString(16).length;//获取length
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
module.exports={encode,decode,Bin2Str,Str2Bin,Str2Hex,Hex2Str,Hex2Bin,Bin2Hex,TYPE_BIN,TYPE_STR,TYPE_HEX}
