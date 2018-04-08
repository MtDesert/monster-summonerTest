var allData = require('allData'); //引用所有公共数据
//控制小怪物行动的脚本

cc.Class({
    'extends': cc.Component,

    onLoad: function onLoad() {
        this.action = 0;
    },

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有小怪物节点下的脚本都引用 monsterData 数据
        this.monsterData = this.getComponent('monsterData');

        this.action++;
        // console.log('action次数：' + this.action);

        //计时器控制怪物的行动，一定时间改变一次行动状态，随着怪物的等级升高，会慢慢开启更高级的移动方式
        this.monsterActionCallBack = (function () {
            //根据怪物等级决定行动状态范围
            var actionRange = allData.monsterLevel >= 6 ? 6 : allData.monsterLevel;
            this.monsterAction(cc.random0To1() * actionRange, this.monsterData.actionChangeInterval);
        }).bind(this);
        this.schedule(this.monsterActionCallBack, this.monsterData.actionChangeInterval);
    },

    monsterAction: function monsterAction(r, time) {
        /*
        怪物移动有下面5种方式：
        初始怪物只有普通移动，随着怪物的等级升高，会慢慢开启更高级的移动方式，并带有额外效果
        */
        //1.普通移动，随机直线移动到一个地点
        var moveBy = cc.moveBy(time, cc.randomMinus1To1() * this.node.parent.width, cc.randomMinus1To1() * this.node.parent.height);
        //2.以贝塞尔曲线移动到随机的4个点                    
        var bezier = [cc.p(cc.randomMinus1To1() * this.node.parent.width, cc.randomMinus1To1() * this.node.parent.height), cc.p(cc.randomMinus1To1() * this.node.parent.width, cc.randomMinus1To1() * this.node.parent.height), cc.p(cc.randomMinus1To1() * this.node.parent.width, cc.randomMinus1To1() * this.node.parent.height), cc.p(cc.randomMinus1To1() * this.node.parent.width, cc.randomMinus1To1() * this.node.parent.height)];
        var bezierBy = cc.bezierBy(time, bezier);
        //3.跳跃移动，跳到一个随机地点，高度跟monster节点高度相关，跳跃次数为怪物当前等级，（跳跃期间回血！回血效果跟怪物当前等级相关）
        var jumpBy = cc.jumpBy(time, cc.randomMinus1To1() * this.node.parent.width, cc.randomMinus1To1() * this.node.parent.height, allData.random(2, 3) * this.node.height, allData.monsterLevel);
        //4.一定时间之内闪烁，闪烁次数跟怪物当前等级相关，（闪烁期间闪避攻击！） 
        var blink = cc.blink(time, allData.monsterLevel * 2);
        //5.一定时间之内旋转，旋转角度跟怪物当前等级相关（旋转期间反弹攻击！）
        var rotateBy = cc.rotateBy(time, 180 * allData.monsterLevel);

        //根据随机的数字决定怪物的移动方式，并标记怪物当前行动状态
        if (r <= 1) {
            //1.普通移动
            this.monsterData.actionStatus = 1;
            return this.node.runAction(moveBy);
        } else if (r <= 2) {
            //2.贝塞尔曲线移动
            this.monsterData.actionStatus = 2;
            return this.node.runAction(bezierBy);
        } else if (r <= 3) {
            //3.跳跃移动
            this.monsterData.actionStatus = 3;
            return this.node.runAction(jumpBy);
        } else if (r <= 4) {
            //4.闪烁
            this.monsterData.actionStatus = 4;
            return this.node.getChildByName('monsterBody').runAction(blink);
        } else {
            //5.旋转
            this.monsterData.actionStatus = 5;
            return this.node.getChildByName('monsterBody').runAction(rotateBy);
        }
    },

    update: function update(dt) {
        //怪物4级以前不能穿墙,(杀到30怪的时候就可以穿墙了)
        if (allData.monsterLevel < 4) {
            allData.unThroughWalls(this.node, this.node.parent);
        } else {
            allData.throughWalls(this.node, this.node.parent);
        }
    },

    onDisable: function onDisable() {}

});