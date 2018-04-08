var allData = require('allData');//引用所有公共数据
//子弹子弹的数据，伤害和攻击效果跟子弹当前状态有关

cc.Class({
    extends: cc.Component,

    properties: {
        damage: {
            default: 0,
            tooltip: '子弹的伤害',
            visible: false,
        },

        critProb: {
            default: 0,
            tooltip: '判断子弹是否暴击的概率0~1',
            range: [0,1],
            visible: false,
        },

        critTimes: {
            default: 0,
            tooltip: '子弹的暴击倍数',
            visible: false,
        },

        vampire: {
            default: 0,
            tooltip: '子弹攻击吸血比例',
            visible: false,
        },

        
    },


    update: function (dt) {
        //子弹子弹越界就回收
        if(this.node.y >= this.node.parent.height/2){
            this.node.stopAllActions();
            this.node.parent.getChildByName('hero').getComponent('heroAttack').heroBallisticPool.put(this.node);
        }
        

    },

});
