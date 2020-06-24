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
const BIN = 0;
const STR = 1;
const HEX = 2;
//特征值异变
function encode(data, type, options) {
    let opts=options||{};
    if(!opts.headerparser||typeof(opts.headerparser)!="function"){
        opts.headerparser=(datalength,taglength)=>{
            datalength=datalength.toString(16);
            datalength='0'.repeat(8-datalength.length)+datalength;
            taglength=taglength.toString(16);
            taglength='0'.repeat(8-taglength.length)+taglength;
            let headerlength=(datalength+taglength).length.toString(16);
            headerlength='0'.repeat(4-headerlength.length)+headerlength;
            return headerlength+datalength+taglength;
        }
    }
    if(!opts.dataparser||typeof(opts.headerparser)!="function"){
        opts.dataparser=(data)=>{
            return data;
        }
    }
    switch (type) {
        case 1:
            data = Str2Bin(data);
            break;
        case 2:
            data = Hex2Bin(data);
            break;
    }
    data=opts.dataparser(data);
    var posarr = [];//挂空，初始化
    var length = 0;//默认置零
    var ret = "";//挂空，初始化
    //for (var i = 0; i < odata.length; i++) { if (odata[i] == 1) { if ((((i + 1).toString(16)).length % 2) == 1) { length = ((i + 1).toString(16)).length + 1; } } }
    length=data.lastIndexOf('1').toString(16).length;//获取length
    for (var i = 0; i < data.length; i++) {
        //定位特征值
        if (data[i] == 1) {
            var str = (i + 1).toString(16);
            str = '0'.repeat(length - str.length) + str;
            posarr.push(str);
        }
        //防止数组超标
        if (i % 255 == 0) {
            while (posarr.length != 0) {
                var rand = parseInt(Math.random() * posarr.length);
                ret += posarr[rand];
                posarr.splice(rand, 1);
            }
        }
    }
    //处理剩余数据
    while (posarr.length != 0) {
        var rand = parseInt(Math.random() * posarr.length);
        ret += posarr[rand];
        posarr.splice(rand, 1);
    }
    //获取header
    let header=headerparser(data.length,length);
    ret = header + ret;
    return ret;
}
function decode(str,headerparser){
    if(!headerparser||typeof(headerparser)!="function"){
        headerparser=(headerstr)=>{
            let header={datalength:0,taglength:0};
            header.datalength=parseInt(headerstr.slice(0,8),16);
            header.taglength=parseInt(headerstr.slice(8,16),16);
            return header;
        }
    }
    str=str.toString();
    headerlength=parseInt(str.slice(0,4),16);
    //header parser
    const header=headerparser(str.slice(4,4+headerlength));
    let data=str.slice(4+headerlength);
    var ret='0'.repeat(header.datalength);
    console.log(data.length)
    for(var i=0;i<data.length;i=i+header.taglength){
        //console.log(i)
        //console.log(data.slice(i,header.length))
        let position=parseInt(data.slice(i,i+header.taglength),16);
        //console.log(position)
        ret=UpdateStr(ret,'1',position);
    }
    return ret;
}
module.exports={encode,decode,tools:{Bin2Str,Str2Bin,Str2Hex,Hex2Str,Hex2Bin,Bin2Hex},type:{BIN,STR,HEX}}
