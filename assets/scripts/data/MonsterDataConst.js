/*
num编号number,最好不要重复
name名字string,一般是中文
race种族,做人不要有种族歧视,不做人也一样,建议改成数字常量比如枚举
lv等级number,还没发现具体作用
moveType移动类型,与地形共同影响移动速度,建议改成数字常量比如枚举

health生命number,不大于0就屎了...
skill技能number,0表示无特殊技能,非0表示技能冷却时间
attack攻击力number,表示能对敌人造成的正常伤害
range攻击范围number,敌人的距离在自己范围内的时候可以发动攻击
speed攻击速度number,值为40表示每秒可攻击一次
move移动速度number,单位时间内能移动的距离
mp法力number,召唤时候需要消耗的量
summon召唤时间number,召唤单个怪物所需的时间
physicDamage物理损伤有效率number,乘以攻击方的攻击力可得到损伤值
magicDamage魔法损伤有效率number,乘以攻击方的攻击力可得到损伤值

explain解释,用来说明这是什么东西

atkType攻击类型Array,成员解释如下
attrib属性Attribute,可能是相克时候用到
type攻击类型AttackType
isMagic物魔性boolean,物理为false,魔法为true
through贯通boolean,是否能贯通攻击,false表示攻击会被对方接下而不会往后继续传递
wideRange大范围boolean,是否属于大范围攻击
*/
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
	Ground:4//地
}
const AttackType={
	Direct:0,//直接攻击
	Indirect:1,//间接攻击
	Bomb:2//炸弹攻击
}

const monsterDataList=[
	{num:1,name:"弧光龙",race:Race.Dragon,lv:2,moveType:MoveType.Walk,
	health:50,skill:0,attack:25,range:8,speed:26,move:6,mp:6,summon:15,physicDamage:0.7,magicDamage:1.2,
	explain:"龙族之中最普通的龙，也可以说是在战斗方面，非常平衡的龙",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:2,name:"大地龙",race:Race.Dragon,lv:3,moveType:MoveType.Walk,
	health:480,skill:0,attack:1,range:7,speed:14,move:5,mp:20,summon:30,physicDamage:0.7,magicDamage:1.3,
	explain:"4大元素龙之一。借助大地之力的技能，能让敌人陷入混沌之中",
	atkType:{attrib:Attribute.Ground,type:AttackType.Indirect,isMagic:false,through:true}},

	{num:3,name:"冰霜龙",race:Race.Dragon,lv:3,moveType:MoveType.Walk,
	health:440,skill:0,attack:1,range:7,speed:16,move:6,mp:20,summon:29,physicDamage:0.7,magicDamage:1.3,
	explain:"4大元素龙之一。受到它攻击的对手会附带冰冻伤害，身体变得无法动弹。",
	atkType:{attrib:Attribute.Ice,type:AttackType.Indirect,isMagic:false,through:true}},

	{num:4,name:"亚马逊女战士",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:140,skill:0,attack:14,range:9,speed:29,move:7,mp:6,summon:12,physicDamage:1.0,magicDamage:1.0,
	explain:"从费门森林来的战斗民族。不知道她们会从战斗中找到怎样的生存意义。",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:5,name:"暴怒大猩猩",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:220,skill:0,attack:30,range:8,speed:17,move:5,mp:9,summon:21,physicDamage:1.0,magicDamage:0.9,
	explain:"使用怪力从有利地形投掷炸弹，向着集团发起攻势的话，一定会遭受严重的打击吧。",
	atkType:{attrib:Attribute.None,type:AttackType.Bomb,isMagic:false,through:false}},

	{num:6,name:"蚁族士兵",race:Race.Beast,lv:1,moveType:MoveType.Walk,
	health:180,skill:0,attack:20,range:1,speed:53,move:7,mp:5,summon:6,physicDamage:1.0,magicDamage:0.9,
	explain:"恪尽职守的他们是最强韧的士兵吧。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:7,name:"女武神",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:280,skill:0,attack:20,range:1,speed:45,move:7,mp:7,summon:8,physicDamage:0.9,magicDamage:0.9,
	explain:"她们手中的魔法剑，会带给敌人难以治好的伤口。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:8,name:"小魔女",race:Race.Magic,lv:2,moveType:MoveType.Fly,
	health:160,skill:0,attack:25,range:7,speed:24,move:7,mp:5,summon:14,physicDamage:1.0,magicDamage:1.0,
	explain:"魔族第一的恶作剧达人。跨坐在扫帚上战斗时，总是让人非常的困扰。",
	atkType:{attrib:Attribute.Fire,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:9,name:"维维",race:Race.Dragon,lv:2,moveType:MoveType.Fly,
	health:180,skill:0,attack:18,range:6,speed:35,move:8,mp:5,summon:12,physicDamage:0.9,magicDamage:1.2,
	explain:"虽然拥有龙的翅膀，看起来像是和其它怪物混血的龙族。",
	atkType:{attrib:Attribute.Fire,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:10,name:"梦幻海龙",race:Race.Dragon,lv:3,moveType:MoveType.Swin,
	health:300,skill:0,attack:25,range:8,speed:26,move:5,mp:7,summon:18,physicDamage:0.7,magicDamage:1.3,
	explain:"吸收海洋生命的精华而诞生的大型龙。其身姿起源于太古时代某种灭绝的生物。",
	atkType:{attrib:Attribute.Fire,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:11,name:"魔法兔子",race:Race.Magic,lv:1,moveType:MoveType.Walk,
	health:200,skill:0,attack:25,range:2,speed:53,move:8,mp:6,summon:7,physicDamage:1.0,magicDamage:1.0,
	explain:"太古时毁灭的文明留下的玩偶型机器人。这只小兔子引起的种种不可思议的现象，其实都是科学的力量。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:true,through:false}},

	{num:12,name:"攻城龙",race:Race.Dragon,lv:3,moveType:MoveType.Walk,
	health:550,skill:0,attack:200,range:2,speed:40,move:5,mp:20,summon:40,physicDamage:0.6,magicDamage:1.1,
	explain:"圣界3大巨龙之一。以龙族第一重为题。体型小的怪物什么的会被轻易地踩死。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:13,name:"复仇枯木",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:80,skill:0,attack:40,range:11,speed:12,move:4,mp:8,summon:23,physicDamage:1.0,magicDamage:0.7,
	explain:"被砍伐的树木，为了复仇站起来了。虽然种子炸弹很强，但它们似乎忘了复仇对象的脸。",
	atkType:{attrib:Attribute.None,type:AttackType.Bomb,isMagic:false,through:false}},

	{num:14,name:"稻草人魔像",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:260,skill:0,attack:11,range:1,speed:64,move:7,mp:5,summon:5,physicDamage:0.9,magicDamage:0.9,
	explain:"本来要被丢掉的破旧魔像被农夫塔里当做「稻草人」，赋予了生存之道。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:15,name:"雷之魔导士",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:220,skill:10,attack:15,range:8,speed:21,move:5,mp:10,summon:18,physicDamage:1.0,magicDamage:1.0,
	explain:"4大魔导士之一。能自由地操纵雷云的魔导士，能伤害对手，甚至夺取其运动能力。",
	atkType:{attrib:Attribute.Thunder,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:16,name:"乌龟加农炮",race:Race.Beast,lv:2,moveType:MoveType.Swin,
	health:100,skill:0,attack:30,range:13,speed:10,move:3,mp:7,summon:20,physicDamage:1.0,magicDamage:0.7,
	explain:"原本很温和的乌龟，却被安装了强力巨炮，变成了非常可怕的「移动炮台」。",
	atkType:{attrib:Attribute.Noadne,type:AttackType.Bomb,isMagic:false,through:false}},

	{num:17,name:"小鸦天狗",race:Race.Beast,lv:2,moveType:MoveType.Fly,
	health:200,skill:0,attack:22,range:2,speed:80,move:9,mp:7,summon:6,physicDamage:1.0,magicDamage:0.6,
	explain:"从人迹罕至的深山飞来的妖怪。使用充满了神通力的竹竿惩罚恶人。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:18,name:"海盗船长",race:Race.Beast,lv:2,moveType:MoveType.Swin,
	health:170,skill:0,attack:25,range:8,speed:21,move:6,mp:8,summon:18,physicDamage:1.0,magicDamage:0.7,
	explain:"装在手上的大炮，是为了与敌人的海盗船或鲸鱼战斗。他所到之处都会成为一片血海。",
	atkType:{attrib:Attribute.None,type:AttackType.Bomb,isMagic:false,through:false}},

	{num:19,name:"鬼面炮",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:100,skill:0,attack:50,range:11,speed:12,move:6,mp:10,summon:27,physicDamage:0.6,magicDamage:1.1,
	explain:"霍伊莱工房制作的炮击机器人。最初只是用来放烟火。",
	atkType:{attrib:Attribute.None,type:AttackType.Bomb,isMagic:false,through:false}},

	{num:20,name:"球根加农炮",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:80,skill:0,attack:20,range:11,speed:21,move:7,mp:6,summon:15,physicDamage:1.0,magicDamage:0.9,
	explain:"为了驱赶糟蹋田地者，球根甚至会发射种子炸弹。",
	atkType:{attrib:Attribute.None,type:AttackType.Bomb,isMagic:false,through:false}},

	{num:21,name:"杀人蔬菜",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:210,skill:0,attack:20,range:1,speed:64,move:7,mp:6,summon:7,physicDamage:1.0,magicDamage:0.7,
	explain:"被丢弃在野外的野菜们，汇聚憎恨化成了阿尼玛。打算用怨念缜绕剪刀收割生灵的首级。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:22,name:"三头龙",race:Race.Dragon,lv:3,moveType:MoveType.Walk,
	health:500,skill:0,attack:10,range:8,speed:14,move:5,mp:25,summon:46,physicDamage:0.7,magicDamage:1.3,
	explain:"圣界的3大巨龙之一。由3个龙首迸发的强大力量，来自于异次元。",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:true}},

	{num:23,name:"圣母龙",race:Race.Dragon,lv:3,moveType:MoveType.Walk,
	health:450,skill:10,attack:10,range:8,speed:26,move:5,mp:20,summon:38,physicDamage:0.6,magicDamage:1.4,
	explain:"圣界3大巨龙之一。以龙族第一没为题。同时也有巨大的力量，眼里充满了慈爱。",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:true}},

	{num:24,name:"古斯塔夫D",race:Race.Beast,lv:2,moveType:MoveType.Fly,
	health:150,skill:0,attack:20,range:8,speed:21,move:8,mp:7,summon:15,physicDamage:1.0,magicDamage:0.7,
	explain:"不知何时开始，飞船里寄宿这邪恶的灵魂，不断用大炮攻击地上的生物。",
	atkType:{attrib:Attribute.None,type:AttackType.Bomb,isMagic:false,through:false}},

	{num:25,name:"猎头婆婆",race:Race.Magic,lv:2,moveType:MoveType.Fly,
	health:160,skill:0,attack:100,range:1,speed:17,move:9,mp:6,summon:17,physicDamage:0.9,magicDamage:1.0,
	explain:"拥有诅咒道具「斩首大镰」的魔法师，曾经反反复复进行着恐怖的屠杀。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:true,through:false,wideRange:true}},

	{num:26,name:"云魔神",race:Race.Magic,lv:2,moveType:MoveType.Fly,
	health:160,skill:0,attack:20,range:7,speed:15,move:7,mp:6,summon:11,physicDamage:1.0,magicDamage:1.0,
	explain:"据说是经常出现在遇到困难的人面前温柔的魔人。会从受到帮助的人那里要求甜食作为回礼。",
	atkType:{attrib:Attribute.Thunder,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:27,name:"耀晶龙",race:Race.Dragon,lv:3,moveType:MoveType.Walk,
	health:550,skill:180,attack:10,range:8,speed:26,move:5,mp:25,summon:36,physicDamage:0.6,magicDamage:1.4,
	explain:"最接近神域的巨龙。她身上的水晶闪耀着充满了神圣感的光辉.",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:true}},

	{num:28,name:"冰晶灵",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:160,skill:0,attack:15,range:7,speed:21,move:6,mp:6,summon:12,physicDamage:1.0,magicDamage:1.0,
	explain:"寄宿在冰块里的怪物。能够自由的操纵冰。",
	atkType:{attrib:Attribute.Ice,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:29,name:"红莲加农炮",race:Race.Beast,lv:3,moveType:MoveType.Walk,
	health:220,skill:0,attack:30,range:8,speed:17,move:6,mp:10,summon:20,physicDamage:1.0,magicDamage:0.7,
	explain:"H99研究所制造的骇人听闻的机器人。本来应该守护城寨的大炮，被安装在它的头上。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:true}},

	{num:30,name:"幻象师沙汗",race:Race.Magic,lv:2,moveType:MoveType.Fly,
	health:160,skill:0,attack:15,range:8,speed:18,move:8,mp:6,summon:10,physicDamage:1.0,magicDamage:1.0,
	explain:"这个幻象师得到自由在空中飞行的力量后，开始复仇欺负过自己的人。",
	atkType:{attrib:Attribute.Ground,type:AttackType.Indirect,isMagic:true,through:false}},
]

//种族克制(单向)表
const RaceRestrainArray=[
	[Race.Beast ,Race.Dragon],
	[Race.Dragon,Race.Magic],
	[Race.Magic ,Race.Beast],
];
//属性克制(双向)表
const AttributeRestrainArray=[
	[Attribute.Fire,Attribute.Ice],
	[Attribute.Thunder,Attribute.Ground],
];
//种族克制系数
function raceRestrainFactor(atkRace,defRace){
	var atk=[atkRace,defRace];
	var def=[defRace,atkRace];
	var arr=RaceRestrainArray;
	for(var i=0;i<arr.length;++i){
		if(atk[0]===arr[i][0] && atk[1]===arr[i][1])return 1.2;
		if(def[0]===arr[i][0] && def[1]===arr[i][1])return 0.8;
	}
	return 1;
}
//属性克制系数
function attributeRestrainFactor(atkAttr,defAttr){
	var atk=[atkAttr,defAttr];
	var def=[defAttr,atkAttr];
	var arr=AttributeRestrainArray;
	for(var i=0;i<arr.length;++i){
		if(atk[0]===arr[i][0] && atk[1]===arr[i][1])return 1.5;
		if(def[0]===arr[i][0] && def[1]===arr[i][1])return 1.5;
	}
	return 1;
}

module.exports = {
	Race,
	MoveType,
	Attribute,
	AttackType,
	RaceRestrainArray,
	AttributeRestrainArray,
	raceRestrainFactor,
	attributeRestrainFactor,
	monsterDataList
}

//test
console.log("种族克制情况")
for(var i in Race){
	for(var j in Race){
		var factor=raceRestrainFactor(Race[i],Race[j]);
		if(factor!=1){
			console.log(i+"打"+j+"造成"+factor+"倍损伤");
		}
	}
}
console.log("属性克制情况")
for(var i in Attribute){
	for(var j in Attribute){
		var factor=attributeRestrainFactor(Attribute[i],Attribute[j]);
		if(factor!=1){
			console.log(i+"打"+j+"造成"+factor+"倍损伤");
		}
	}
}
