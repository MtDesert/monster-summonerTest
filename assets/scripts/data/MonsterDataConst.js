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
	Ground:4,//地
	Sacred:5//圣
}
const AttackType={
	Direct:0,//直接攻击
	Indirect:1,//间接攻击
	Bomb:2//炸弹攻击
}

const monsterDataList=[
	{num:0,name:"怪物",race:Race.Human,lv:255,moveType:MoveType.Fly,
	health:255,skill:255,attack:255,range:255,speed:255,move:255,mp:255,summon:255,physicDamage:1.0,magicDamage:0.7,
	explain:"测试用的怪物",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:true}},

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

	{num:31,name:"冰之女王灵歌",race:Race.Magic,lv:3,moveType:MoveType.Fly,
	health:450,skill:30,attack:25,range:8,speed:32,move:8,mp:20,summon:25,physicDamage:0.9,magicDamage:0.9,
	explain:"在充满威严的冰之女王面前，不管谁都只能选择服从或是被冻死。",
	atkType:{attrib:Attribute.Ice,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:32,name:"冰之魔导士",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:220,skill:10,attack:15,range:8,speed:21,move:5,mp:10,summon:18,physicDamage:1.0,magicDamage:1.0,
	explain:"4大魔导士之一。在去永久冻土旅行的时候，他决定吧全部的生物都冻上。",
	atkType:{attrib:Attribute.Ice,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:33,name:"魔像守卫",race:Race.Beast,lv:3,moveType:MoveType.Walk,
	health:300,skill:0,attack:20,range:1,speed:53,move:6,mp:6,summon:9,physicDamage:0.9,magicDamage:0.8,
	explain:"这个机械人偶是古代机械帝国作为守门人而使用的。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:34,name:"犀龙",race:Race.Dragon,lv:3,moveType:MoveType.Walk,
	health:300,skill:0,attack:30,range:1,speed:35,move:6,mp:7,summon:11,physicDamage:0.7,magicDamage:1.2,
	explain:"这种龙拥有强劲的四肢和尖锐的犄角，但作为代价，失去了翅膀。",
	atkType:{attrib:Attribute.Ground,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:35,name:"雷霆龙",race:Race.Dragon,lv:3,moveType:MoveType.Walk,
	health:440,skill:0,attack:1,range:7,speed:16,move:6,mp:20,summon:29,physicDamage:0.7,magicDamage:1.3,
	explain:"4大元素龙之一。体内流动的电气通过角发射出去，烧焦敌人，或是麻痹其运动神经。",
	atkType:{attrib:Attribute.Thunder,type:AttackType.Direct,isMagic:false,through:true}},

	{num:36,name:"沙漠狙击手",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:180,skill:0,attack:22,range:7,speed:21,move:7,mp:6,summon:13,physicDamage:0.9,magicDamage:0.8,
	explain:"沙漠的住民桑德尔为了自由揭竿而起，以弩为武器战斗。出自「利修硫战记」",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:37,name:"影子骑士",race:Race.Magic,lv:1,moveType:MoveType.Walk,
	health:220,skill:0,attack:30,range:1,speed:64,move:7,mp:7,summon:9,physicDamage:1.0,magicDamage:1.0,
	explain:"全身包裹着魔法道具的战士，能够击退任何敌人。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:true,through:false}},

	{num:38,name:"兽王基尔哥恩",race:Race.Beast,lv:3,moveType:MoveType.Walk,
	health:550,skill:10,attack:100,range:2,speed:40,move:7,mp:25,summon:45,physicDamage:0.8,magicDamage:0.7,
	explain:"统治兽族200多年的兽族之王。和魔王拜伦是战乱中培养出友情的义兄弟。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:39,name:"小龙士兵",race:Race.Dragon,lv:1,moveType:MoveType.Walk,
	health:210,skill:0,attack:25,range:1,speed:53,move:6,mp:6,summon:7,physicDamage:0.8,magicDamage:1.0,
	explain:"忘记了吐火的方法，用剑的本领大概比笨拙的人类战士要强吧。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:40,name:"神兵瓦基洛斯",race:Race.Beast,lv:3,moveType:MoveType.Walk,
	health:460,skill:0,attack:80,range:2,speed:32,move:6,mp:20,summon:35,physicDamage:1.0,magicDamage:0.7,
	explain:"据说是由神打造的巨神兵。寄宿着神的愤怒。为了守护历史的记录，永远看守着神殿的入口。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:41,name:"蒸汽机器人",race:Race.Beast,lv:3,moveType:MoveType.Walk,
	health:450,skill:20,attack:20,range:8,speed:24,move:5,mp:20,summon:25,physicDamage:0.9,magicDamage:0.8,
	explain:"由H99研究所造出的最后一台泛用型超破坏兵器。直到将所有生命根绝为止都会继续行动。",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:42,name:"刺钉蜂",race:Race.Beast,lv:2,moveType:MoveType.Fly,
	health:140,skill:0,attack:18,range:1,speed:64,move:7,mp:5,summon:5,physicDamage:1.0,magicDamage:0.9,
	explain:"由H99研究所造出的最后一台泛用型超破坏兵器。直到将所有生命根绝为止都会继续行动。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:43,name:"蛇龙",race:Race.Dragon,lv:2,moveType:MoveType.Walk,
	health:180,skill:0,attack:20,range:1,speed:45,move:6,mp:6,summon:6,physicDamage:0.8,magicDamage:1.2,
	explain:"蛇和龙结合生出的新龙族，是一种非常好战的生物。一旦见到运动中的物体，就会用尖锐的毒牙将其麻痹。",
	atkType:{attrib:Attribute.Thunder,type:AttackType.Direct,isMagic:false,through:false}},

	{num:44,name:"雪妖精",race:Race.Magic,lv:2,moveType:MoveType.Fly,
	health:140,skill:0,attack:10,range:7,speed:21,move:9,mp:5,summon:8,physicDamage:1.0,magicDamage:1.0,
	explain:"当大地需要沉默时，就会悄悄地积起雪来。不要忘记，这是个小家伙干的。",
	atkType:{attrib:Attribute.Ice,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:45,name:"斯帕克",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:240,skill:15,attack:20,range:8,speed:17,move:8,mp:12,summon:19,physicDamage:1.0,magicDamage:1.0,
	explain:"从异世界出现的家务机器人。她能让体内的永久电池超速运行，从而放出100万伏特的点击。",
	atkType:{attrib:Attribute.Thunder,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:46,name:"史莱姆",race:Race.Beast,lv:1,moveType:MoveType.Walk,
	health:210,skill:0,attack:25,range:1,speed:53,move:6,mp:6,summon:7,physicDamage:1.0,magicDamage:1.0,
	explain:"黏糊糊又软绵绵，要伤到它们可能意外的困难呢。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:47,name:"美人鱼战士",race:Race.Beast,lv:2,moveType:MoveType.Swin,
	health:240,skill:0,attack:32,range:2,speed:53,move:6,mp:7,summon:10,physicDamage:1.0,magicDamage:0.7,
	explain:"在海上，没有能和她媲美的东西。当目光被她所吸引而一枪击倒者不在少数。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:48,name:"枪兵龙",race:Race.Dragon,lv:2,moveType:MoveType.Walk,
	health:230,skill:0,attack:25,range:1,speed:45,move:6,mp:7,summon:11,physicDamage:0.7,magicDamage:1.2,
	explain:"智力聪慧的龙，通过不懈努力，终于掌握了武器的使用。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:49,name:"大地神欧.托普提",race:Race.Magic,lv:3,moveType:MoveType.Walk,
	health:450,skill:30,attack:25,range:8,speed:32,move:7,mp:20,summon:25,physicDamage:0.9,magicDamage:0.9,
	explain:"太古人所崇拜的大地之神。这位神的愤怒会撼动大地，使生物活在混乱之中。",
	atkType:{attrib:Attribute.Ground,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:50,name:"大地之魔导士",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:220,skill:10,attack:15,range:8,speed:21,move:5,mp:10,summon:18,physicDamage:1.0,magicDamage:1.0,
	explain:"4大魔导士之一。与大地契约的他，能自由地操纵地下的毒气。",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:51,name:"装甲龙",race:Race.Dragon,lv:3,moveType:MoveType.Walk,
	health:260,skill:0,attack:40,range:1,speed:35,move:7,mp:7,summon:14,physicDamage:0.7,magicDamage:1.2,
	explain:"在龙族之中，格斗能力特别优秀的龙。发达的鳞片就像铠甲一样。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:52,name:"大魔王拜伦",race:Race.Magic,lv:3,moveType:MoveType.Walk,
	health:550,skill:10,attack:50,range:8,speed:32,move:6,mp:25,summon:32,physicDamage:0.9,magicDamage:0.9,
	explain:"修得了全部魔法的大魔法师，曾在太古的大战中，使用108种魔法打倒了大量敌军。",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:53,name:"太阳王阿波罗",race:Race.Magic,lv:3,moveType:MoveType.Walk,
	health:450,skill:30,attack:50,range:8,speed:32,move:7,mp:20,summon:25,physicDamage:0.9,magicDamage:0.9,
	explain:"得到了太阳之力的这个精灵，利用那无限的力量，长期作为国王君临的火之国。",
	atkType:{attrib:Attribute.Fire,type:AttackType.Indirect,isMagic:true,thrdough:false}},

	{num:54,name:"鹿首骑士",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:280,skill:0,attack:29,range:2,speed:53,move:9,mp:7,summon:10,physicDamage:1.0,magicDamage:0.7,
	explain:"拥有鹿头和马脚的可怕骑士，只凭一把刀就能让对手陷入痛苦之中。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:55,name:"死亡之花",race:Race.Beast,lv:3,moveType:MoveType.Walk,
	health:320,skill:8,attack:30,range:8,speed:45,move:5,mp:20,summon:19,physicDamage:1.0,magicDamage:0.8,
	explain:"处于所有植物类怪物顶端的存在。从身体上无数的鲜花中，散播致死的花粉。",
	atkType:{attrib:Attribute.Ground,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:56,name:"暗蚀龙",race:Race.Dragon,lv:3,moveType:MoveType.Walk,
	health:550,skill:50,attack:10,range:8,speed:26,move:5,mp:25,summon:36,physicDamage:0.6,magicDamage:1.4,
	explain:"因为战斗时像恶魔一般残忍而得到了这个称呼。与之为敌是令人非常恐怖的。",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:true}},

	{num:57,name:"狂暴章鱼",race:Race.Beast,lv:2,moveType:MoveType.Swin,
	health:280,skill:0,attack:20,range:2,speed:22,move:4,mp:6,summon:11,physicDamage:1.0,magicDamage:1.0,
	explain:"发生基因突变的章鱼，异常凶暴化。甚至会因没有在海中捕获足够的猎物，而登陆觅食。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:58,name:"驯鹿猎人",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:180,skill:0,attack:20,range:7,speed:21,move:7,mp:6,summon:13,physicDamage:0.9,magicDamage:0.7,
	explain:"这优秀的射击本领，是在寒冷地区的生存中自然而然掌握的战斗能力。",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:59,name:"屠龙战士",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:220,skill:0,attack:20,range:1,speed:53,move:7,mp:7,summon:7,physicDamage:0.9,magicDamage:0.9,
	explain:"与龙作战的宿命战士。他穿着龙麟做的铠甲，拿着龙牙做的剑。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:60,name:"龙骑士",race:Race.Dragon,lv:3,moveType:MoveType.Fly,
	health:240,skill:0,attack:25,range:9,speed:26,move:9,mp:7,summon:17,physicDamage:0.7,magicDamage:1.3,
	explain:"这种小人看似弱小，但是它们乘坐在龙族朋友的背上，与任何敌人都能战斗。出自「波玛雅之书」",
	atkType:{attrib:Attribute.Fire,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:61,name:"淑女龙",race:Race.Dragon,lv:2,moveType:MoveType.Walk,
	health:260,skill:0,attack:32,range:2,speed:53,move:7,mp:7,summon:10,physicDamage:0.7,magicDamage:1.2,
	explain:"它的体术通过战胜其他重量级的龙而骎于完善。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:62,name:"海豚龙",race:Race.Dragon,lv:2,moveType:MoveType.Swin,
	health:220,skill:0,attack:25,range:1,speed:45,move:6,mp:6,summon:9,physicDamage:0.8,magicDamage:1.0,
	explain:"原本是不喜欢战斗的温和性格，但是对于破坏海洋环境的人，会毫不犹豫的进行突袭。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:63,name:"钻头龙",race:Race.Dragon,lv:2,moveType:MoveType.Walk,
	health:200,skill:0,attack:25,range:1,speed:53,move:7,mp:6,summon:7,physicDamage:0.8,magicDamage:1.0,
	explain:"鼻子上的钻头能穿透任何装甲，它是因吞下地底的奥哈利刚原石而形成的。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:64,name:"奈格尔",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:130,skill:0,attack:20,range:7,speed:24,move:7,mp:5,summon:12,physicDamage:1.0,magicDamage:1.0,
	explain:"为了治疗伤口而生存着。确实比谁都理解生命的重要性。",
	atkType:{attrib:Attribute.Sacred,type:AttackType.Direct,isMagic:false,through:false}},

	{num:65,name:"热带食人花",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:180,skill:0,attack:15,range:8,speed:32,move:5,mp:0,summon:13,physicDamage:1.0,magicDamage:0.9,
	explain:"伴随异常气象出现在原始森林中的食人植物。只有狂风暴雨才能滋润它们的饥渴。",
	atkType:{attrib:Attribute.Ground,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:66,name:"土精灵",race:Race.Beast,lv:3,moveType:MoveType.Walk,
	health:180,skill:1,attack:10,range:1,speed:29,move:7,mp:8,summon:15,physicDamage:1.0,magicDamage:0.7,
	explain:"他们拥有兽族第一的工匠技术，能快速建造出一座坚固的城塞。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:67,name:"鹰身人战士",race:Race.Beast,lv:2,moveType:MoveType.Fly,
	health:250,skill:0,attack:32,range:2,speed:45,move:8,mp:7,summon:10,physicDamage:0.9,magicDamage:0.7,
	explain:"在鸟身人之中拥有特别高的战斗力。本来不喜欢战斗，但为了和平也会拼尽全力。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:68,name:"哈默林",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:180,skill:0,attack:10,range:8,speed:20,move:7,mp:5,summon:11,physicDamage:1.0,magicDamage:1.0,
	explain:"哈默林凭借乐器演奏出的「魔气弹」，会让有耳朵的人棘手得难以对付。",
	atkType:{attrib:Attribute.Ground,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:69,name:"爆炎虫",race:Race.Beast,lv:3,moveType:MoveType.Walk,
	health:240,skill:0,attack:3,range:7,speed:13,move:8,mp:10,summon:20,physicDamage:1.0,magicDamage:0.8,
	explain:"能喷火的虫类。原本只是小虫，由于吸收了大量紫外线，突变成了如今巨大的样子。",
	atkType:{attrib:Attribute.Fire,type:AttackType.Indirect,isMagic:false,through:true}},

	{num:70,name:"自爆杀手",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:140,skill:1,attack:15,range:1,speed:40,move:7,mp:9,summon:15,physicDamage:1.0,magicDamage:0.7,
	explain:"H99研究所制造的未知改造人。连体内流淌着的血液都是爆炸物。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:71,name:"半渔人",race:Race.Beast,lv:2,moveType:MoveType.Swin,
	health:150,skill:0,attack:18,range:7,speed:20,move:6,mp:5,summon:13,physicDamage:1.0,magicDamage:0.9,
	explain:"他们的水性非常优秀，是可怕的强敌。凭借背上的氧气罐，甚至连逃到陆地的猎物都能追上。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:72,name:"蛮族勇者雷妲",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:240,skill:0,attack:40,range:1,speed:45,move:6,mp:7,summon:11,physicDamage:1.0,magicDamage:0.7,
	explain:"对居住于荒莽之地的蛮族而言，这名勇者是他们的骄傲。至今未尝一败。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:73,name:"小幽灵",race:Race.Beast,lv:1,moveType:MoveType.Walk,
	health:160,skill:0,attack:14,range:1,speed:80,move:8,mp:5,summon:6,physicDamage:1.0,magicDamage:0.9,
	explain:"据说，他们是由受到残酷待遇的人们的憎恨聚集而成的。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:74,name:"飞龙巴尔瓦罗",race:Race.Dragon,lv:2,moveType:MoveType.Fly,
	health:230,skill:0,attack:25,range:1,speed:64,move:8,mp:7,summon:8,physicDamage:0.7,magicDamage:1.2,
	explain:"住在自然没怎么被破坏的地方，生性敏感的龙。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:75,name:"烈焰龙",race:Race.Dragon,lv:3,moveType:MoveType.Walk,
	health:480,skill:0,attack:2,range:7,speed:17,move:5,mp:20,summon:36,physicDamage:0.7,magicDamage:1.3,
	explain:"4大元素龙之一。据说它投身大火之中获得了炎的力量。",
	atkType:{attrib:Attribute.Fire,type:AttackType.Indirect,isMagic:false,through:true}},

	{num:76,name:"菲亚哥尔",race:Race.Magic,lv:3,moveType:MoveType.Walk,
	health:450,skill:10,attack:40,range:9,speed:29,move:5,mp:20,summon:25,physicDamage:0.9,magicDamage:0.9,
	explain:"过去曾一时被魔法支配过，没想到在沉睡期间，会再次被召唤士征召……",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:77,name:"气球鲸",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:220,skill:0,attack:2,range:1,speed:16,move:7,mp:8,summon:15,physicDamage:1.0,magicDamage:0.1,
	explain:"引以为豪的橡胶皮肤，能将所有魔法攻击反弹回去。究竟是不是用体内的气体使自己浮起来呢。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:78,name:"不死鸟",race:Race.Magic,lv:3,moveType:MoveType.Fly,
	health:400,skill:30,attack:50,range:9,speed:32,move:9,mp:20,summon:27,physicDamage:0.9,magicDamage:1.0,
	explain:"从传说的昆仑山飞来的梦幻之鸟。「飞升之火」会治疗受伤的同伴，并将敌人包围在焚烧罪恶的地狱之火中。",
	atkType:{attrib:Attribute.Sacred,type:AttackType.Direct,isMagic:false,through:false}},

	{num:79,name:"伏兵喵太郎",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:150,skill:0,attack:15,range:7,speed:40,move:7,mp:6,summon:11,physicDamage:1.0,magicDamage:0.8,
	explain:"接受了严酷训练的忍者。像猫一样灵活的动作，能从敌人的视线中消失身姿。",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:80,name:"部族猎人",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:160,skill:0,attack:20,range:9,speed:18,move:7,mp:6,summon:14,physicDamage:1.0,magicDamage:0.8,
	explain:"他们是长期浴血战场的民族，为了使对手感到恐惧而戴上了华丽的假面。",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:81,name:"小火龙",race:Race.Dragon,lv:2,moveType:MoveType.Walk,
	health:200,skill:0,attack:20,range:6,speed:32,move:6,mp:5,summon:13,physicDamage:0.9,magicDamage:1.2,
	explain:"火龙王伊格尼鲁的后代。虽然现在还小，但也不能大意。",
	atkType:{attrib:Attribute.Fire,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:82,name:"弹弹怪",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:260,skill:0,attack:30,range:1,speed:53,move:6,mp:7,summon:10,physicDamage:1.0,magicDamage:1.0,
	explain:"总是充满活力的弹来弹去。难以被飞行道具命中。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:83,name:"飞行射手",race:Race.Beast,lv:2,moveType:MoveType.Fly,
	health:140,skill:0,attack:14,range:7,speed:22,move:8,mp:6,summon:9,physicDamage:1.0,magicDamage:0.8,
	explain:"弗里吉亚博士发现的奇怪生物。会从空中抛射弩箭。",
	atkType:{attrib:Attribute.Ground,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:84,name:"炎之魔导士",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:220,skill:10,attack:35,range:8,speed:21,move:5,mp:10,summon:18,physicDamage:1.0,magicDamage:1.0,
	explain:"4大魔导士之一。得到了太阳之力的魔导士，在破坏力方面应该超出了其他3位。",
	atkType:{attrib:Attribute.Fire,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:85,name:"哈比人",race:Race.Magic,lv:1,moveType:MoveType.Walk,
	health:180,skill:0,attack:20,range:1,speed:53,move:7,mp:5,summon:6,physicDamage:1.0,magicDamage:1.0,
	explain:"长期使用「魔法锤子」的过程中，这个小人忘记了怎么使用魔法。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:true,through:false}},

	{num:86,name:"魔法巨怪",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:280,skill:0,attack:35,range:1,speed:45,move:6,mp:7,summon:11,physicDamage:0.9,magicDamage:1.0,
	explain:"在巨怪之中，只有比较聪明的巨怪，才能够使用哈比人的「魔法锤子」。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:true,through:false}},

	{num:87,name:"巡游神父",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:140,skill:14,attack:30,range:8,speed:21,move:6,mp:8,summon:15,physicDamage:1.0,magicDamage:1.0,
	explain:"沐浴在圣光中的神父，为了治疗所有受伤的生命，踏上了旅途。",
	atkType:{attrib:Attribute.Sacred,type:AttackType.Direct,isMagic:false,through:false}},

	{num:88,name:"马波古",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:300,skill:0,attack:25,range:1,speed:45,move:6,mp:6,summon:11,physicDamage:1.0,magicDamage:1.0,
	explain:"制作了设有魔法机关的活动人偶的天才老人。没能做出人工智能的他，自己做了进去。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:true,through:false}},

	{num:89,name:"猛犸战士",race:Race.Beast,lv:3,moveType:MoveType.Walk,
	health:270,skill:0,attack:50,range:1,speed:35,move:5,mp:8,summon:14,physicDamage:0.9,magicDamage:0.9,
	explain:"在被冰封的猛犸里，寄宿着勇猛战士的灵魂，他的战斧连冰山都能轻易击碎。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:90,name:"见习魔女",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:180,skill:0,attack:30,range:7,speed:22,move:7,mp:6,summon:16,physicDamage:1.0,magicDamage:1.0,
	explain:"从魔法学校毕业的小魔法师，喜欢恶作剧。有时会作出蛋糕，有时会帮助孩子，也会往敌人身上丢火球……",
	atkType:{attrib:Attribute.Fire,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:91,name:"迷你牛头人",race:Race.Beast,lv:1,moveType:MoveType.Walk,
	health:200,skill:0,attack:25,range:1,speed:53,move:7,mp:6,summon:7,physicDamage:1.0,magicDamage:0.8,
	explain:"牛头人身的兽人。虽然个子矮小，但非常顽强。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:92,name:"金属龙",race:Race.Dragon,lv:2,moveType:MoveType.Fly,
	health:180,skill:0,attack:25,range:1,speed:64,move:8,mp:6,summon:7,physicDamage:0.9,magicDamage:1.1,
	explain:"不止是嘴巴，全身都覆盖着金属的鳞片，非常的坚硬。可以说全身都是凶器。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:93,name:"大钳蟹",race:Race.Beast,lv:1,moveType:MoveType.Swin,
	health:180,skill:0,attack:18,range:1,speed:53,move:6,mp:5,summon:6,physicDamage:1.0,magicDamage:0.9,
	explain:"锋利的蟹钳不只是用来捕鱼，也能使凶暴的怪物绝命。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:94,name:"独角兽",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:150,skill:0,attack:10,range:7,speed:17,move:10,mp:5,summon:10,physicDamage:1.0,magicDamage:1.0,
	explain:"从犄角发射的雷霆，是魔界最美丽的光辉。",
	atkType:{attrib:Attribute.Thunder,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:95,name:"雷神达尔卡斯",race:Race.Magic,lv:3,moveType:MoveType.Walk,
	health:450,skill:30,attack:25,range:8,speed:32,move:7,mp:20,summon:20,physicDamage:0.9,magicDamage:0.9,
	explain:"带来雷霆全因是他，恩惠的雨滴也是。惹怒了这位大神可不是什么上策。",
	atkType:{attrib:Attribute.Thunder,type:AttackType.Indirect,isMagic:true,through:false}},

	{num:96,name:"老鼠弓箭手",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:120,skill:0,attack:12,range:9,speed:29,move:7,mp:5,summon:11,physicDamage:1.0,magicDamage:0.9,
	explain:"单独一只虽然很弱小，但如果聚集起来的话，连巨怪都能赶走！",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:97,name:"霸王花",race:Race.Beast,lv:3,moveType:MoveType.Walk,
	health:300,skill:0,attack:30,range:3,speed:35,move:5,mp:12,summon:15,physicDamage:1.0,magicDamage:0.8,
	explain:"生长在原始森林里的这种花非常危险。这种花只会在尸山上开放。",
	atkType:{attrib:Attribute.Ground,type:AttackType.Direct,isMagic:false,through:false}},

	{num:98,name:"枪龙",race:Race.Dragon,lv:1,moveType:MoveType.Swin,
	health:200,skill:0,attack:20,range:1,speed:53,move:6,mp:6,summon:7,physicDamage:0.8,magicDamage:1.2,
	explain:"手上的枪非常坚硬，不怎么适合这样瘦小的身体，非常强力。这种龙在水上和地上都非常的活跃。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:99,name:"利皮",race:Race.Dragon,lv:1,moveType:MoveType.Walk,
	health:180,skill:0,attack:20,range:1,speed:53,move:6,mp:5,summon:6,physicDamage:0.9,magicDamage:1.2,
	explain:"不怎么像龙的怪物。有意识的拒绝成长。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:100,name:"岩鸟",race:Race.Beast,lv:2,moveType:MoveType.Fly,
	health:180,skill:0,attack:25,range:1,speed:64,move:9,mp:6,summon:7,physicDamage:1.0,magicDamage:0.8,
	explain:"最初是亲近人的怪物，但因为同伴不断被捕杀，而变得开始袭击人类。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:101,name:"长弓魔像",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:160,skill:0,attack:20,range:10,speed:21,move:4,mp:7,summon:14,physicDamage:0.9,magicDamage:0.8,
	explain:"要使用钢铁做成的巨大弓，只有这种受过弓箭训练的魔像才行吧。",
	atkType:{attrib:Attribute.None,type:AttackType.Indirect,isMagic:false,through:false}},

	{num:102,name:"双足飞龙",race:Race.Dragon,lv:3,moveType:MoveType.Fly,
	health:340,skill:0,attack:2,range:8,speed:26,move:9,mp:15,summon:26,physicDamage:0.7,magicDamage:1.2,
	explain:"飞行能力无与伦比的强大龙族。正所谓翔天之龙。",
	atkType:{attrib:Attribute.Fire,type:AttackType.Indirect,isMagic:false,through:true}},

	{num:103,name:"奇迹小丑",race:Race.Magic,lv:2,moveType:MoveType.Walk,
	health:180,skill:1,attack:20,range:1,speed:40,move:7,mp:9,summon:15,physicDamage:1.0,magicDamage:1.0,
	explain:"被遗忘的太古机关人偶。一旦它让自己体内的小型原子炉暴走，就会引起威力惊人的大爆炸。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},

	{num:104,name:"兹姆兹姆",race:Race.Beast,lv:2,moveType:MoveType.Walk,
	health:320,skill:0,attack:50,range:10,speed:40,move:10,mp:12,summon:20,physicDamage:0.7,magicDamage:0.7,
	explain:"虽然讨厌战争，但因被召唤出来，只好不情愿地战斗。就算看起来被打败，实际是瞬间移动到其他地方去了。",
	atkType:{attrib:Attribute.None,type:AttackType.Direct,isMagic:false,through:false}},
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
