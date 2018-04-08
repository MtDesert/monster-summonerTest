"use strict";
cc._RFpush(module, '2c379MY7cZHLJxgKBD3JnP/', 'monsterState');
// scripts\monsterState.js

var allData = require('allData'); //引用所有公共数据
//根据不同的事件响应，控制所有状态的显示（暴击，大量回血，吸血，光环，buff等）

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