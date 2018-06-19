//待测试参数表
const ParametersArray=[
	undefined,null,
	Infinity,-Infinity,NaN,
	true,false,
	Math.E,
	Math.LN2,
	Math.LN10,
	Math.LOG2E,
	Math.LOG10E,
	Math.PI,
	Math.SQRT1_2,
	Math.SQRT2,
	Number.EPSILON,
	Number.MAX_SAFE_INTEGER,
	Number.MIN_SAFE_INTEGER,
	Number.MAX_VALUE,
	Number.MIN_VALUE,
	0,1,-1,
	"","233","fuck",
	new Object,new Date(),new RegExp(),new Number(),new String(),new Boolean(),new Function(),
	[],{},this
]

//待测试函数表
const FunctionsArray=[
	Object,
	Number,
	String,
	Boolean,
	//Date,
	//RegExp,
	Function,
	encodeURI,
	decodeURI,
	encodeURIComponent,
	decodeURIComponent,
	escape,
	unescape,
	eval,
	isFinite,
	isNaN,
	parseFloat,
	parseInt,
	Object.is
]

//检查参数表重复性
function checkParamatersRepeat(){
for(var idx in ParametersArray){
	for(var i in ParametersArray){
		var a=ParametersArray[idx];
		var b=ParametersArray[i];
		if(a===b && idx!==i){
			console.log("[%d]===[%d]",idx,i)
			console.log(a,b)
		}
	}
}
}

//冒烟测试
function smokeTest(functionsArray,parametersArray){

//需要测试所有待测函数
for(var idx in functionsArray){
	//取出函数
	var func=functionsArray[idx];
	if(typeof(func)!=="function"){
		console.log(func+"不是函数");
		continue;
	}
	console.log("测试函数"+func.name+"参数个数"+func.length)
	//建立测试参数索引表
	var paramIdx=[];
	var paramArray=[];
	for(var i=0;i<func.length;++i){
		paramIdx.push(0);
		paramArray.push(parametersArray[0]);
	}
	var idx=func.length;//用于改变参数的索引
	while(true){//组合出所有参数,并进行测试
		try{
			func.apply(null,paramArray);
		}catch(exception){
			console.log("参数数组:");
			console.log(paramArray)
			console.log("引发错误: "+exception);
			
		}
		//改变参数索引
		--idx;
		do{
			++paramIdx[idx];
			if(paramIdx[idx]>=parametersArray.length){
				paramIdx[idx]=0;
				--idx;
			}else break;
		}while(idx>=0);
		if(idx<0)break;
		//改变参数
		for(;idx<func.length;++idx){
			paramArray[idx] = parametersArray[ paramIdx[idx] ];
		}
	}
}
}

//开始测试
module.exports={
	smokeTest
}
