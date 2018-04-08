"use strict";
cc._RFpush(module, 'c9bb4idhNBLmoK6ziRTKJ6O', 'monsterControl');
// scripts\monsterControl.js

var allData = require('allData'); //引用所有公共数据
//控制小怪物monster节点下面所有脚本组件的激活状态，小怪物控制的主脚本

cc.Class({
    'extends': cc.Component,

    onLoad: function onLoad() {},

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有小怪物节点下的脚本都引用 monsterData 数据
        this.monsterData = this.getComponent('monsterData');
    },

    update: function update(dt) {}
});

cc._RFpop();