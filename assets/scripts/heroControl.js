var allData = require('allData');//引用所有公共数据
//控制hero节点下所有其他脚本组件激活状态的脚本，hero控制的主脚本

cc.Class({
    extends: cc.Component,

    onEnable: function () {//统一用onEnable初始化，重新激活时此函数也会调用
        //所有hero节点下的脚本都引用 heroData 数据
        this.heroData = this.getComponent('heroData');

       


    },

    update: function (dt) {

    },
});
