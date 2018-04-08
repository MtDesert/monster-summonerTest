var allData = require('allData');//引用所有公共数据
//处理碰撞,及碰撞之后所有信息

cc.Class({
    extends: cc.Component,

    onLoad: function(){
        this.Collision = 0;
        this.hpShowTime = 0;
        this.critShowTime = 0;
    },

    onEnable: function () {//统一用onEnable初始化，重新激活时此函数也会调用
        //所有小怪物节点下的脚本都引用 monsterData 数据
        this.monsterData = this.getComponent('monsterData');
            
       

    },

    //处理其他节点跟本节点的碰撞
    onCollisionEnter: function(other, self) {
        //对碰撞情况进行划分
        if(other.node.group === 'heroBallistic'){//被hero子弹击中
            var heroBallisticData = other.getComponent('heroBallisticData');
            //血条显现2秒
            cc.find('monsterHp', this.node).opacity = 255;
            this.hpShowTime = 2;

            //判断是否暴击
            if(cc.random0To1() <= heroBallisticData.critProb){
                //monster暴击掉血
                var monsterCrited = parseInt(allData.randomNormal() * heroBallisticData.damage * heroBallisticData.critTimes);
                this.monsterData.currentHp -= monsterCrited;
                //monster节点的状态显示栏显现，一个移动的红色暴击伤害出现在头顶，持续2秒
                this.critShowTime = 2;
                var crit = cc.find('monsterState/crit', this.node);
                crit.opacity = 255;
                crit.getComponent(cc.Label).string = '-' + monsterCrited;
                crit.setPosition(-20, -40);
                crit.runAction(cc.moveTo(2, -40, -20));
                
            } else {
                //monster普通掉血
                var monsterDamaged = parseInt(allData.randomNormal() * heroBallisticData.damage);
                this.monsterData.currentHp -= monsterDamaged;
            }
            
           
        }


    }, 

    update: function (dt) {
        //血条显现2秒
        this.hpShowTime -= dt;
        if(this.hpShowTime <= 0){
            cc.find('monsterHp', this.node).opacity = 0;
        }
        //暴击标志显现2秒
        this.critShowTime -= dt;
        if(this.critShowTime <= 0){
            cc.find('monsterState/crit', this.node).opacity = 0;
        }

    },
});
