var MonsterEnum=require("./MonsterEnum")
for(var name in MonsterEnum){
	eval("const "+name+"=MonsterEnum."+name);
}
var MonsterDataConst=require("./MonsterDataConst")
for(var name in MonsterDataConst){
	eval("const "+name+"=MonsterDataConst."+name);
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

//种族克制系数(攻击方,防御方)
function raceRestrainFactor(atkRace,defRace){
	var atk=[atkRace,defRace];
	var def=[defRace,atkRace];
	var arr=RaceRestrainRelation;
	for(var i=0;i<arr.length;++i){
		if(atk[0]===arr[i][0] && atk[1]===arr[i][1])return 1.2;//上手系数
		if(def[0]===arr[i][0] && def[1]===arr[i][1])return 0.8;//下手系数
	}
	return 1;
}

//属性克制系数(攻击方,防御方)
function attributeRestrainFactor(atkAttr,defAttr){
	var atk=[atkAttr,defAttr];
	var def=[defAttr,atkAttr];
	var arr=AttributeRestrainRelation;
	for(var i=0;i<arr.length;++i){
		if(atk[0]===arr[i][0] && atk[1]===arr[i][1])return 1.5;
		if(def[0]===arr[i][0] && def[1]===arr[i][1])return 1.5;
	}
	return 1;
}
//移动攻击类型克制系数
function moveAttackTypeRestrainFactor(atkType,defType){
	var atk=[atkType,defType];
	var def=[defType,atkType];
	var arr=MoveAttackTypeRestrainRelation;
	for(var i=0;i<arr.length;++i){
		if(atk[0]===arr[i][0] && atk[1]===arr[i][1])return 1.2;//上手系数
		if(def[0]===arr[i][0] && def[1]===arr[i][1])return 0.8;//下手系数
	}
	return 1;
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
//移动攻击类型克制关系

module.exports={
	RaceRestrainRelation,
	AttributeRestrainRelation,
	MoveAttackTypeRestrainRelation,
	raceRestrainFactor,
	attributeRestrainFactor,
	moveAttackTypeRestrainFactor,
	getMoveAttackType
}
