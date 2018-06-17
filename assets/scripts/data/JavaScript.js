//这是用来扩展原始JavaScript功能的文件

//Math.min,Math.max的扩展版
Math.minMaxOfObject=function(obj,isMax){
	var ret = isMax ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
	var code="if(num"+(isMax?">":"<")+"ret)ret=num;";//这是比较代码
	var num;
	for(var i in obj){
		num=obj[i];
		if(isNaN(num))continue;//跳过非数值部分
		eval(code);//更新最值
	}
	return ret;
}
//Math.min的扩展版,可从obj对象中找
Math.minOfObject=function(obj){return Math.minMaxOfObject(obj,false);}
//Math.max的扩展版,可从obj对象中找
Math.maxOfObject=function(obj){return Math.minMaxOfObject(obj,true);}

//Number.isInteger的扩展版,可同时判断多个数
Number.areIntegers=function(){
	var b=false;
	for(var i in arguments){
		b=Number.isInteger(Number(arguments[i]));//注意:typeof(arguments[i])==="object",所以需要Number()来转换
		if(!b){break;}
	}
	return b;
}

//求出数字的浮点数位数
Number.prototype.floatLength=function(){
	var array=parseFloat(this).toString().split(".");//分离成整数部分和小数部分
	return array.length>=2 ? array[1].length : 0;//返回有效长度
}
//Number.prototype.floatLength的object版
Number.floatLengthOfObject=function(obj){
	var ret={},num;
	for(var i in obj){
		num=obj[i];
		if(typeof(num)==="number"){
			ret[i] = num.floatLength();
		}
	}
	return ret;
}
//Number.prototype.floatLength的不定参数版
Number.floatLength=function(){
	return Number.floatLengthOfObject(arguments);
}

//从Number.floatLength的返回结果中寻找最大值maxLen,返回10的maxLen次方
Number.pow_10_maxFloatLength=function(){
	var ret=Number.floatLengthOfObject(arguments);
	var maxLen=Math.maxOfObject(ret);
	return Math.pow(10,maxLen);
}

//无损四则运算
Number.prototype.arithmetic=function(arg,operator){
	if(Number.areIntegers(this,arg))return eval("this"+operator+"arg");//整数运算
	//小数运算,需要先变成整数,然后运算,再变回小数
	switch(operator){
		case "*":{//乘法,
			var len=this.floatLength();
			var len0=arg.floatLength();
			return (this*Math.pow(10,len)) * (arg*Math.pow(10,len0)) / Math.pow(10,len + len0);
		}break;
		case "+":case "-":case "/":{
			var m=Number.pow_10_maxFloatLength(this,arg);
			var code="((this*m)"+operator+"(arg*m))";//动态构造表达式
			if(operator!=="/")code+="/m;";//除法不需要除以/m
			return eval(code)
		}break;
		case "%":{
			var quotient=Math.floor(this.divide(arg));
			if(quotient<0){
				++quotient;//Math.floor向下取整是往数轴左方向取的,商为负数的时候需要+1
			}
			return this.minus(quotient.multiply(arg));
		}break;
	}
}
//无损加法
Number.prototype.plus=function(arg){return this.arithmetic(arg,"+");}
//无损减法
Number.prototype.minus=function(arg){return this.arithmetic(arg,"-");}
//无损乘法
Number.prototype.multiply=function(arg){return this.arithmetic(arg,"*");}
//无损除法
Number.prototype.divide=function(arg){return this.arithmetic(arg,"/");}
//无损求余
Number.prototype.mod=function(arg){return this.arithmetic(arg,"%");}
