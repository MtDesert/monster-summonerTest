"use strict";
cc._RFpush(module, '6a361KoTf1Lhpw+KyDth7BP', 'gameControl');
// scripts\gameControl.js

var allData = require('allData'); //引用所有公共数据
//控制Canvas下面所有脚本组件的激活状态，游戏流程控制的主脚本

var game = 0;

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有Canvas节点下的脚本都引用 gameData 数据
        this.gameData = this.getComponent('gameData');
        //取得hero的数据脚本
        var heroData = this.node.getChildByName('hero').getComponent('heroData');
        var heroAttack = this.node.getChildByName('hero').getComponent('heroAttack');

        //播放背景音乐
        cc.audioEngine.playEffect(this.gameData.bgmusic, true, 0.3);

        //开启碰撞
        cc.director.getCollisionManager().enabled = true;

        //注册响应事件
        this.node.on('monsterKilled', function (event) {
            //怪物被杀数目，怪物等级更新
            allData.killMonsterNum++;
            allData.monsterLevel = 1 + Math.floor(allData.killMonsterNum / 10);
            //取得怪物monster的数据脚本
            var monsterData = this.node.getChildByName('monster').getComponent('monsterData');
            //后面出现的怪物攻击增加
            monsterData.damage += monsterData.damageIncreaseRatio;

            //杀怪数目的label更新
            this.node.getChildByName('killMonsterNum').getComponent(cc.Label).string = 'kills:' + allData.killMonsterNum;

            //hero升级判断,每杀heroData.killNumToLevelUp个怪升1级
            if (allData.killMonsterNum % heroData.killNumToLevelUp == 0) {
                //播放hero升级音乐
                cc.audioEngine.playEffect(this.gameData.heroLevelUp, false);
                //hero升级
                heroData.level++;
                //生命上限和当前生命都提高
                heroData.maxHp += heroData.hpIncreaseRatio;
                heroData.currentHp += heroData.hpIncreaseRatio;
            }
        }, this);
    },

    update: function update(dt) {}
});

cc._RFpop();