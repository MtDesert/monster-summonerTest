var allData = require('allData'); //引用所有公共数据
//处理hero的所有属性，数据信息

cc.Class({
    'extends': cc.Component,

    properties: {

        //为hero移动引用canvas
        canvas: cc.Node,

        moveSpeed: {
            'default': 0,
            tooltip: 'hero移动速度'
        },

        currentHp: {
            'default': 0,
            tooltip: 'hero当前生命值',
            visible: false
        },

        maxHp: {
            'default': 0,
            tooltip: 'hero当前生命上限',
            visible: false
        },

        maxHpInit: {
            'default': 0,
            tooltip: 'hero初始生命上限'
        },

        hpIncreaseRatio: {
            'default': 0,
            tooltip: '等级数给hero生命上限增加的比例'
        },

        recovey: {
            'default': 0,
            tooltip: 'hero每秒每级回血数'
        },

        //4种攻击属性：0.火属性，增加后续伤害   1.冰属性，击中减速作用
        //            2.风属性，往后推动作用   3.地属性，一定概率击晕
        bulletPrefab: {
            'default': null,
            type: cc.Prefab,
            tooltip: 'hero攻击弹道的预制体'
        },

        attackInterval: {
            'default': 0,
            tooltip: 'hero连续两次攻击之间的时间间隔，间隔越短攻速越快'
        },

        ballisticSpeed: {
            'default': 0,
            tooltip: 'hero攻击弹道飞行一个canvas高度的时间，时间越短弹道越快'
        },

        damage: {
            'default': 0,
            tooltip: 'hero的攻击力'
        },

        damageIncreaseRatio: {
            'default': 0,
            tooltip: '等级数给hero攻击力增加的比例'
        },

        critProb: {
            'default': 0,
            tooltip: '判断hero是否暴击的概率0~1',
            range: [0, 1]
        },

        critTimes: {
            'default': 0,
            tooltip: 'hero的暴击倍数'
        },

        vampire: {
            'default': 0,
            tooltip: 'hero攻击吸血比例'
        },

        killNumToLevelUp: {
            'default': 0,
            tooltip: 'hero升一级需要杀怪的数目'
        },

        level: {
            'default': 1,
            tooltip: 'hero的等级'
        }

    },

    update: function update(dt) {}

});