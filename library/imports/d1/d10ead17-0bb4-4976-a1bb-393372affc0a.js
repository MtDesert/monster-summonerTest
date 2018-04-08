var allData = require('allData'); //引用所有公共数据
//存放小怪物的数据，每个小怪物节点只能对自己的数据进行读写

cc.Class({
    'extends': cc.Component,

    properties: {
        currentHp: {
            'default': 0,
            tooltip: '怪物当前生命值',
            visible: false
        },

        maxHp: {
            'default': 0,
            tooltip: '怪物的当前生命上限',
            visible: false
        },

        maxHpInit: {
            'default': 0,
            tooltip: '怪物的初始生命上限'
        },

        actionStatus: {
            'default': 0,
            tooltip: '怪物当前的行动状态',
            visible: false
        },

        actionChangeInterval: {
            'default': 0,
            tooltip: '怪物改变行动状态的时间间隔'
        },

        hpIncreaseRatio: {
            'default': 0,
            tooltip: '死亡怪物数给后面怪物生命增加的比例'
        },

        damage: {
            'default': 0,
            tooltip: '怪物的攻击力'
        },

        damageIncreaseRatio: {
            'default': 0,
            tooltip: '死亡1个怪物给后面怪物攻击增加的比例'
        }

    }
});