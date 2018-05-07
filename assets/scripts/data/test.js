var MonsterEnum = require('./MonsterEnum')
var MDC = require('./MonsterDataConst')
var MonsterFunction = require('./MonsterFunction')

//保存错误信息的数组
var errorArray=[];

//检查枚举
function checkEnum(enumTypeName,Enum){
	if(Enum instanceof Object){
		//建立枚举名表以便检查
		var names=[];
		for(var i in Enum){
			names.push(i);
		}
		//检查所有枚举
		for(var a=0;a<names.length;++a){
			//检查类型
			var value=Enum[names[a]];
			if(isNaN(value)){
				errorArray.push(enumTypeName+"."+names[a]+"的值不是数字");
			}
			//检查重复性
			for(var b=a+1;b<names.length;++b){
				if(value===Enum[names[b]]){
					errorArray.push(enumTypeName+"的枚举名"+names[a]+","+names[b]+"具有相同的枚举值:"+value);
				}
			}
		}
		//释放内存
		names.splice(0,names.length);
		delete names;
	}else{
		errorArray.push(enumTypeName+"不是Object");
	}
}

//怪物数据的各个属性的对应类型[变量名,变量类型]
var nameTypeArray={
	name:"string",
	race:"number",
	lv:"number",
	moveType:"number",
	health:"number",
	skill:"number",
	attack:"number",
	range:"number",
	speed:"number",
	move:"number",
	mp:"number",
	summon:"number",
	physicDamage:"number",
	magicDamage:"number",
	explain:"string",
	atkType:{
		attrib:"number",
		type:"number",
		isMagic:true,//需要的时候设置成true
		through:true,//需要的时候设置成true
	},
	feature:["number"],
}

//检查类型(待检测的obj,标准的object)
function checkType(id,obj,object){
	for(var name in object){
		var type=object[name];
		var value=obj[name];
		var strType=typeof(type);
		//console.log(name+" : "+strType);
		switch(strType){
			case "string"://用字符串来描述的类型
				if(typeof(value)!==type){
					errorArray.push("怪物["+id+"]."+name+"的类型不是"+type);
				}
			break;
			case "number":
				if(isNaN(type)){
					if(!isNaN(value)){
						errorArray.push("怪物["+id+"]."+name+"的类型是数字");
					}
				}else{
					if(isNaN(value)){
						errorArray.push("怪物["+id+"]."+name+"的类型不是数字");
					}
				}
			break;
			case "boolean":
				if(value && typeof(value)!==strType){//要么undefined要么是boolean类型
					errorArray.push("怪物["+id+"]."+name+"的值不为boolean");
				}
			break;
			case "function"://可能是用某种构造函数生成的
				if(!(value instanceof type)){
					errorArray.push("怪物["+id+"]."+name+"的值不是"+type+"返回的");
				}
			break;
			case "object":
				if(value instanceof Array){
					var array=[];
					for(var i=0;i<value.length;++i)array.push(type[0]);
					checkType(id,value,array);
					//释放内存
					array.splice(0,array.length)
					delete array;
				}else if(value instanceof Object){
					checkType(id,value,type);
				}
			break;
			case "symbol":break;
			case "undefined":
			break;
			default:console.log("宿主类型"+strType);
		}
	}
}

//检测开始
for(var name in MonsterEnum){//检查所有导出的枚举类型
	checkEnum(name,MonsterEnum[name])
}
if(MDC.monsterDataList instanceof Array){//检查所有怪物数据
	//检查每个怪物的数据
	for(var id=0;id<MDC.monsterDataList.length;++id){
		var monster=MDC.monsterDataList[id];
		//开始检查属性表
		checkType(id,monster,nameTypeArray);
		break;
	}
}else{
	errorArray.push("没有怪物数据表");
}

//报告错误
if(errorArray.length>0){
	for(var i in errorArray){
		console.log(errorArray[i]);
	}
	//释放内存
	errorArray.splice(0,errorArray.length);
	delete errorArray;
	return;
}else{
	console.log("没发现问题");
}

//测试代码
console.log("种族克制情况")
for(var i in MonsterEnum.Race){
	for(var j in MonsterEnum.Race){
		var factor=MonsterFunction.raceRestrainFactor(MonsterEnum.Race[i],MonsterEnum.Race[j]);
		if(factor!=1){
			console.log(i+"打"+j+"造成"+factor+"倍损伤");
		}
	}
}
console.log("属性克制情况")
for(var i in MonsterEnum.Attribute){
	for(var j in MonsterEnum.Attribute){
		var factor=MonsterFunction.attributeRestrainFactor(MonsterEnum.Attribute[i],MonsterEnum.Attribute[j]);
		if(factor!=1){
			console.log(i+"打"+j+"造成"+factor+"倍损伤");
		}
	}
}
console.log("移动攻击类型克制情况")
for(var i in MonsterEnum.MoveAttackType){
	for(var j in MonsterEnum.MoveAttackType){
		var factor=MonsterFunction.moveAttackTypeRestrainFactor(MonsterEnum.MoveAttackType[i],MonsterEnum.MoveAttackType[j]);
		if(factor!=1){
			console.log(i+"打"+j+"造成"+factor+"倍损伤");
		}
	}
}
