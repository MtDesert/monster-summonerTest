var allData = require('allData'); //引用所有公共数据
//控制小怪物在场景生成与回收的脚本，生成普通的小怪

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有Canvas节点下的脚本都引用 gameData 数据
        this.gameData = this.getComponent('gameData');
        //创建一个monster的节点池 this.monsterPool
        this.monsterPool = new cc.NodePool();

        //初始化this.monsterPool
        this.monsterPoolInit();

        //以一定的速率产生怪物
        this.createMonsterNormal(this.gameData.normalRate);

        //还有一定概率产生额外的怪物
        this.createMonsterExtra(this.gameData.extraTime, this.gameData.extraProb, this.gameData.extraInterval, this.gameData.extraRepeat);
    },

    monsterPoolInit: function monsterPoolInit() {
        var monsterInitCount = 20; //默认最多20个怪物在场
        for (var i = 0; i < monsterInitCount; ++i) {
            var monster = cc.instantiate(this.gameData.monsterPrefab); // 创建 monster 节点
            this.monsterPool.put(monster); // 通过 put 接口放入对象池
        }
    },

    createMonster: function createMonster(parentNode) {
        var monster = null;
        if (this.monsterPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            monster = this.monsterPool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，就用 cc.instantiate 重新创建
            monster = cc.instantiate(this.gameData.monsterPrefab);
        }
        monster.parent = parentNode; // 将生成的monster加入节点树
        return monster; //返回monster节点，调用函数可以设置monster节点的位置
    },

    createMonsterNormal: function createMonsterNormal(rate) {
        //在屏幕最上方一定速率产生怪物:每rate秒产生一个怪物
        this.schedule(function () {
            var monsterNode = this.createMonster(this.node);
            //随机怪物模型
            var url = 'monster';
            allData.randomModel(103, url, monsterNode.getChildByName('monsterBody'));
            //随机设置怪物位置
            monsterNode.setPosition(cc.randomMinus1To1() * (this.node.width / 2 - monsterNode.width / 2), this.node.height / 2 - monsterNode.height / 2);
        }, rate);
    },

    createMonsterExtra: function createMonsterExtra(time, prob, interval, repeat) {
        //用计时器产生额外的怪物：
        //每time时间随机一个0~1的数字，如果小于产生概率 prob，
        //则接下来每interval秒在场景随机位置产生一个额外的怪物，此轮产生repeat个怪物
        this.schedule(function () {
            if (cc.random0To1() <= prob) {
                this.schedule(function () {
                    var monsterNode = this.createMonster(this.node);
                    //随机怪物模型
                    var url = 'monster';
                    allData.randomModel(103, url, monsterNode.getChildByName('monsterBody'));
                    //随机设置怪物位置
                    monsterNode.setPosition(cc.randomMinus1To1() * (this.node.width / 2 - monsterNode.width / 2), cc.randomMinus1To1() * (this.node.height / 2 - monsterNode.height / 2));
                }, interval, repeat);
            }
        }, time);
    },

    update: function update(dt) {}
});