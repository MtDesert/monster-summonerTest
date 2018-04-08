var allData = require('allData');//引用所有公共数据
//处理hero生命值的变化

cc.Class({
    extends: cc.Component,

    onEnable: function () {//统一用onEnable初始化，重新激活时此函数也会调用
        //所有hero节点下的脚本都引用 heroData 数据
        this.heroData = this.getComponent('heroData');


        //初始化hero血量，最大血量随着等级增加而变大，
        this.heroData.maxHp = Math.floor(allData.randomNormal() * (this.heroData.maxHpInit + this.heroData.hpIncreaseRatio * this.heroData.level));
        this.heroData.currentHp = this.heroData.maxHp;

        //hero回血的计时器
        this.heroRecoveyTimer = 1;
        

    },

    update: function (dt) {
 
        //hero空血时，游戏结束，重新加载初始场景
        if(this.heroData.currentHp <= 0){
            
            allData.killMonsterNum = 0;
            allData.monsterLevel = 1;
            this.heroData.level = 1;
            cc.audioEngine.stopAllEffects();
            cc.director.loadScene('Game');
        }

        //hero回血计时
        this.heroRecoveyTimer -= dt;
        if(this.heroRecoveyTimer <= 0){
            this.heroData.currentHp += this.heroData.recovey * this.heroData.level;
            this.heroRecoveyTimer = 1;
        }

        //控制currentHp范围在[0，maxHp]之间
        this.heroData.currentHp = allData.limitCurrentHp(this.heroData.currentHp, this.heroData.maxHp);
        //血条长度，数值实时变化
        this.node.getChildByName('heroHp').getComponent(cc.ProgressBar).progress = this.heroData.currentHp / this.heroData.maxHp;
        this.node.getChildByName('heroHp').getChildByName('hpNum').getComponent(cc.Label).string = this.heroData.currentHp +  '/' + this.heroData.maxHp;

    },
});
