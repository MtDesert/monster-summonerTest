"use strict";
cc._RFpush(module, '6a28c4rvjNPm7oPhgA2mW/A', 'heroAttack');
// scripts\heroAttack.js

var allData = require('allData'); //引用所有公共数据
//控制hero攻击的脚本

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有hero节点下的脚本都引用 heroData 数据
        this.heroData = this.getComponent('heroData');
        //创建一个heroBallistic的节点池 this.heroBallisticPool
        this.heroBallisticPool = new cc.NodePool();
        //hero攻击计时器初始化
        this.attackTimer = 0;

        //初始化this.heroBallisticPool
        this.heroBallisticPoolInit();
    },

    heroBallisticPoolInit: function heroBallisticPoolInit() {
        var heroBallisticInitCount = 10; //默认最多10粒子弹在场
        for (var i = 0; i < heroBallisticInitCount; ++i) {
            var heroBallistic = cc.instantiate(this.heroData.bulletPrefab); //生成子弹
            this.heroBallisticPool.put(heroBallistic); // 通过 put 接口放入对象池
        }
    },

    createHeroBallistic_Attack: function createHeroBallistic_Attack(parentNode, position, attacker) {
        var heroBallistic = null;
        if (this.heroBallisticPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            heroBallistic = this.heroBallisticPool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，就用 cc.instantiate 重新创建
            heroBallistic = cc.instantiate(this.heroData.bulletPrefab);
        }
        heroBallistic.parent = parentNode; // 将生成的heroBallistic加入节点树
        heroBallistic.setPosition(position);

        //将玩家当前所有攻击属性赋予子弹！
        heroBallistic.getComponent('heroBallisticData').damage = attacker.damage;
        heroBallistic.getComponent('heroBallisticData').critProb = attacker.critProb;
        heroBallistic.getComponent('heroBallisticData').critTimes = attacker.critTimes;
        heroBallistic.getComponent('heroBallisticData').vampire = attacker.vampire;

        //子弹飞起来，攻击！hero当前位置向上飞行一个canvas高度
        heroBallistic.runAction(cc.moveTo(this.heroData.ballisticSpeed, this.node.x, this.node.y + this.heroData.canvas.height));
    },

    update: function update(dt) {
        //hero攻击的计时器，每隔一个单位攻击间隔就攻击一次
        this.attackTimer += dt;
        if (this.attackTimer >= this.heroData.attackInterval) {
            //在hero当前位置生成子弹 and 将玩家当前攻击属性赋予子弹！子弹发射！
            this.createHeroBallistic_Attack(this.node.parent, this.node.position, this.heroData);
            this.attackTimer = 0;
        }
    }
});

cc._RFpop();