var MonsterEnum=require("./MonsterEnum")
for(var name in MonsterEnum){
	eval("const "+name+"=MonsterEnum."+name);
}
var MonsterDataConst=require("./MonsterDataConst")
for(var name in MonsterDataConst){
	eval("const "+name+"=MonsterDataConst."+name);
}

//恶心的javascript小数误差,用此乘法来减少误差
Number.prototype.multiply=function(arg){ 
	var m=0,s1=parseFloat(this).toString(),s2=arg.toString(); 
	try{m+=s1.split(".")[1].length}catch(e){} 
	try{m+=s2.split(".")[1].length}catch(e){} 
	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}

//种族克制(单向)关系
const RaceRestrainRelation=[
	[Race.Beast ,Race.Dragon],
	[Race.Dragon,Race.Magic],
	[Race.Magic ,Race.Beast],
];

//属性克制(双向)表
const AttributeRestrainRelation=[
	[Attribute.Fire,Attribute.Ice],
	[Attribute.Thunder,Attribute.Ground],
];

//移动攻击类型克制表
const MoveAttackTypeRestrainRelation=[
	[MoveAttackType.Fly,MoveAttackType.GroundDirect],
	[MoveAttackType.GroundDirect,MoveAttackType.GroundIndirect],
	[MoveAttackType.GroundIndirect,MoveAttackType.Fly],
];

function restrainFactor(attacker,defender,arr,atkRet,defRet){
	var atk=[attacker,defender];
	var def=[defender,attacker];
	for(var i=0;i<arr.length;++i){
		if(atk[0]===arr[i][0] && atk[1]===arr[i][1])return atkRet;//上手系数
		if(def[0]===arr[i][0] && def[1]===arr[i][1])return defRet;//下手系数
	}
	return 1;
}
//种族克制系数(攻击方,防御方)
function raceRestrainFactor(atkRace,defRace){
	return restrainFactor(atkRace,defRace,RaceRestrainRelation,1.2,0.8);
}

//属性克制系数(攻击方,防御方)
function attributeRestrainFactor(atkAttr,defAttr){
	return restrainFactor(atkAttr,defAttr,AttributeRestrainRelation,1.5,1.5);
}
//移动攻击类型克制系数
function moveAttackTypeRestrainFactor(atkType,defType){
	return restrainFactor(atkType,defType,MoveAttackTypeRestrainRelation,1.2,0.8);
}

//推断移动攻击类型
function getMoveAttackType(monsterData){
	if(monsterData){
		switch(monsterData.moveType){
			case MoveType.Walk:
				switch(monsterData.atkType.type){
					case AttackType.Direct:return MoveAttackType.GroundDirect;
					case AttackType.Indirect:return MoveAttackType.GroundIndirect;
				}
			case MoveType.Fly:return MoveAttackType.Fly;
		}
		return MoveAttackType.Others;
	}
}

//克制系数(攻击方数据,防御方数据)
function allRestrainFactor(atkMonsterDataA,atkMonsterDataB){
	if(atkMonsterDataA && atkMonsterDataB){
		var raceFactor=raceRestrainFactor(atkMonsterDataA.race,atkMonsterDataA.race);
		var attrFactor=attributeRestrainFactor(atkMonsterDataA.atkType.attrib,atkMonsterDataB.atkType.attrib);
		var moveAttackFactor=moveAttackTypeRestrainFactor(
			getMoveAttackType(atkMonsterDataA),
			getMoveAttackType(atkMonsterDataB)
		);
		return raceFactor.multiply(attrFactor).multiply(moveAttackFactor);
	}
}

module.exports={
	RaceRestrainRelation,
	AttributeRestrainRelation,
	MoveAttackTypeRestrainRelation,
	raceRestrainFactor,
	attributeRestrainFactor,
	moveAttackTypeRestrainFactor,
	allRestrainFactor,
	getMoveAttackType
}
