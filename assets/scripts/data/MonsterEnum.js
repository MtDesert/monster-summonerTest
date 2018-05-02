const Race={//种族
	Human:0,//人类
	Beast:1,//兽族
	Dragon:2,//龙族
	Magic:3,//魔法族
}
const MoveType={//移动类型
	Walk:0,//步行
	Swin:1,//游泳
	Fly:2,//飞行
}
const Attribute={//属性
	None:0,//无
	Fire:1,//火
	Ice:2,//冰
	Thunder:3,//雷
	Ground:4,//地
	Sacred:5//圣
}
const AttackType={//攻击类型
	Direct:0,//直接攻击
	Indirect:1,//间接攻击
	Bomb:2//炸弹攻击
}
const Feature={//特性
	//属性防御
	AttrDefend:0,//属性防御,不会陷入异常状态
	FireAttrDefend:1,//火属性防御,被火属性攻击时损伤/5,被冰属性攻击时损伤*3
	IceAttrDefend:2,//冰属性防御,被冰属性攻击时损伤/4,被火属性攻击时损伤*3
	ThunderAttrDefend:3,//雷属性防御,被雷属性攻击时损伤/4,被火属性攻击时损伤*3
	GroundAttrDefend:4,//地属性防御,被地属性攻击时损伤/4,被雷属性攻击时损伤*3
	//攻击方式防御
	DirectAtkDefend:5,//直接攻击防御,被直接攻击时损伤/2
	IndirectAtkDefend:6,//间接攻击防御,被间接攻击时损伤/2
	BombAtkDefend:7,//炸弹攻击防御,被炸弹攻击时损伤/5
	//技能型
	Break:8,//破坏,攻击召唤台时攻击*5
	Capture:9,//占领,可占领被破坏的召唤台
	DestoryMagic:10,//灭魔,对魔族攻击*4
	DragonSlay:11,//屠龙,对龙族攻击*4
	DefenceRateIgnore:12,//防御率无视,防御数值不参与计算
	Stealth:13,//攻击前或在自身攻击范围外,不会被发现
	//体质
	Aquatic:14,//水生,在水上时移动力&攻击力*1.5
	Plant:15,//植物,被冰雷地属性攻击时损伤/4,被火属性攻击时损伤*3
	Machine:16,//机械,被火冰地属性攻击时损伤/4,被雷属性攻击时损伤*3
	SoftBody:17,//软体,被物理间接攻击时损伤/2,被魔法攻击时损伤*2
	//其它
	Monosome:18,//单体,只能召唤1只
}
const Status={
	Normal:0,//正常
	SlowDown:1,//减速,通常是冰属性造成
	Dizzy:2,//眩晕,通常是雷属性造成
	Confuse:3,//混乱,通常是地属性造成
}

module.exports={
	Race,MoveType,Attribute,AttackType,Feature,Status
}
