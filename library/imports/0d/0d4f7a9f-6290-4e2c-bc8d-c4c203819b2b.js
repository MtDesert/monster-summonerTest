var allData = require('allData'); //引用所有公共数据
//控制大怪物在场景生成与回收的脚本，生成Boss

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有Canvas节点下的脚本都引用 gameData 数据
        this.gameData = this.getComponent('gameData');
    },

    update: function update(dt) {}
});