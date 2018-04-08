var allData = require('allData');//引用所有公共数据
//控制小怪物血条的脚本

cc.Class({
    extends: cc.Component,

    onEnable: function () {//统一用onEnable初始化，重新激活时此函数也会调用
        //所有小怪物节点下的脚本都引用 monsterData 数据
        this.monsterData = this.getComponent('monsterData');


        //初始化：怪物最大血量随机，最大血量随着被杀的怪物数增加而变大,死一个怪加this.monsterData.hpIncreaseRatio生命上限
        
        this.monsterData.maxHp = Math.floor(allData.randomNormal() * (this.monsterData.maxHpInit + this.monsterData.hpIncreaseRatio * allData.killMonsterNum));
        this.monsterData.currentHp = this.monsterData.maxHp;

    },

    update: function (dt) {
        //控制currentHp范围在[0，maxHp]之间
        this.monsterData.currentHp = allData.limitCurrentHp(this.monsterData.currentHp, this.monsterData.maxHp);
        //血条长度，数值实时变化
        this.node.getChildByName('monsterHp').getComponent(cc.ProgressBar).progress = this.monsterData.currentHp / this.monsterData.maxHp;
        this.node.getChildByName('monsterHp').getChildByName('hpNum').getComponent(cc.Label).string = this.monsterData.currentHp +  '/' + this.monsterData.maxHp;
        //怪物空血就销毁回收节点,杀死怪物数+1，同步更新怪物等级
        if(this.monsterData.currentHp <= 0){
            //向上发射怪物被杀事件
            this.node.dispatchEvent(new cc.Event.EventCustom('monsterKilled', true));



            //将此monster节点所有数据和脚本状态初始化并回收
            cc.find('monsterState/state', this.node).opacity = 0;
            cc.find('monsterState/crit', this.node).opacity = 0;
            cc.find('monsterState/recovey', this.node).opacity = 0;
            this.getComponent('monsterAction').enabled = true;
            this.node.parent.getComponent('gameCreateMonster').monsterPool.put(this.node);
        }

    },
});
