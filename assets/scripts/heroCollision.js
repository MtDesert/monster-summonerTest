var allData = require('allData');//引用所有公共数据
//处理hero跟怪物碰撞，被子弹击中等受伤掉血的所有信息

cc.Class({
    extends: cc.Component,

    onEnable: function () {//统一用onEnable初始化，重新激活时此函数也会调用
        //所有hero节点下的脚本都引用 heroData 数据
        this.heroData = this.getComponent('heroData');
        
        this.critShowTime = 0;

    },

    //被怪物碰到，被攻击到都掉血
    onCollisionEnter: function(other, self) {
        //对碰撞情况进行划分
        if(other.node.group === 'monster'){//被hero子弹击中
            var monsterData = other.getComponent('monsterData');
            
            //hero掉血
            var heroCrited = parseInt(allData.randomNormal() * monsterData.damage);
            this.heroData.currentHp -= heroCrited;
            //hero节点的状态显示栏显现，一个移动的红色暴击伤害出现在头顶，持续2秒
            this.critShowTime = 2;
            var crit = cc.find('heroState/crit', this.node);
            crit.opacity = 255;
            crit.getComponent(cc.Label).string = '-' + heroCrited;
            crit.setPosition(-20, -40);
            crit.runAction(cc.moveTo(2, -40, -20));
           
        }


    },


    update: function (dt) {
         //暴击标志显现2秒
         this.critShowTime -= dt;
         if(this.critShowTime <= 0){
            cc.find('heroState/crit', this.node).opacity = 0;
         }

    },
});
