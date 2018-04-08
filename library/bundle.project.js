require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"allData":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2131bdI1D9BMrMk8FfO3+Nm', 'allData');
// scripts\allData.js

//存放所有游戏通用数据和函数，每个脚本都可以对这里的数据进行读写

var allData = {
    //hero已经杀死的monster数目
    killMonsterNum: 0,
    //怪物等级，每杀死10个升一级,初始1级  
    monsterLevel: 1,

    //限制穿墙函数，selfNode到了wallsNode的边缘会被限制在边缘
    unThroughWalls: function unThroughWalls(selfNode, wallsNode) {

        if (selfNode.x + selfNode.width / 2 > wallsNode.width / 2) {
            //限右
            selfNode.x = wallsNode.width / 2 - selfNode.width / 2;
        }
        if (selfNode.x - selfNode.width / 2 < -wallsNode.width / 2) {
            //限左
            selfNode.x = -(wallsNode.width / 2 - selfNode.width / 2);
        }
        if (selfNode.y + selfNode.height / 2 > wallsNode.height / 2) {
            //限上
            selfNode.y = wallsNode.height / 2 - selfNode.height / 2;
        }
        if (selfNode.y - selfNode.height / 2 < -wallsNode.height / 2) {
            //限上
            selfNode.y = -(wallsNode.height / 2 - selfNode.height / 2);
        }
    },

    //穿墙函数，selfNode到了wallsNode的边缘会穿到对边
    throughWalls: function throughWalls(selfNode, wallsNode) {

        if (selfNode.x + selfNode.width / 2 > wallsNode.width / 2) {
            //从右穿
            selfNode.x = -(wallsNode.width / 2 - selfNode.width / 2);
        }
        if (selfNode.x - selfNode.width / 2 < -wallsNode.width / 2) {
            //从左穿
            selfNode.x = wallsNode.width / 2 - selfNode.width / 2;
        }
        if (selfNode.y + selfNode.height / 2 > wallsNode.height / 2) {
            //从上穿
            selfNode.y = -(wallsNode.height / 2 - selfNode.height / 2);
        }
        if (selfNode.y - selfNode.height / 2 < -wallsNode.height / 2) {
            //从下穿
            selfNode.y = wallsNode.height / 2 - selfNode.height / 2;
        }
    },

    //限制currentHp范围在[0，maxHp]之间，返回currentHp的值
    limitCurrentHp: function limitCurrentHp(currentHp, maxHp) {
        if (currentHp <= 0) {
            currentHp = 0;
        }
        if (currentHp >= maxHp) {
            currentHp = maxHp;
        }
        return currentHp;
    },

    //随机一个范围 min~max 的小数
    random: function random(min, max) {
        var ratio = cc.random0To1();
        return min + (max - min) * ratio;
    },

    //弱化随机，随机0.4~0.8的小数
    randomWeak: function randomWeak() {
        return this.random(0.4, 0.8);
    },

    //正常随机：随机一个范围 0.8~1.2 的小数
    randomNormal: function randomNormal() {
        return this.random(0.8, 1.2);
    },

    //增强随机，随机1.2~1.6的小数
    randomStrengthen: function randomStrengthen() {
        return this.random(1.2, 1.6);
    },

    //随机一个范围 min~max 的整数
    randomInt: function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    //随机怪物模型   最大随机图片范围，相对resources的文件路径，目标节点
    randomModel: function randomModel(maxRange, url, targetNode) {
        var num = this.randomInt(1, maxRange);
        cc.loader.loadRes(url.toString() + '/' + num.toString(), cc.SpriteFrame, function (err, spriteFrame) {
            targetNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    }

};

module.exports = allData;

cc._RFpop();
},{}],"gameControl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6a361KoTf1Lhpw+KyDth7BP', 'gameControl');
// scripts\gameControl.js

var allData = require('allData'); //引用所有公共数据
//控制Canvas下面所有脚本组件的激活状态，游戏流程控制的主脚本

var game = 0;

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有Canvas节点下的脚本都引用 gameData 数据
        this.gameData = this.getComponent('gameData');
        //取得hero的数据脚本
        var heroData = this.node.getChildByName('hero').getComponent('heroData');
        var heroAttack = this.node.getChildByName('hero').getComponent('heroAttack');

        //播放背景音乐
        cc.audioEngine.playEffect(this.gameData.bgmusic, true, 0.3);

        //开启碰撞
        cc.director.getCollisionManager().enabled = true;

        //注册响应事件
        this.node.on('monsterKilled', function (event) {
            //怪物被杀数目，怪物等级更新
            allData.killMonsterNum++;
            allData.monsterLevel = 1 + Math.floor(allData.killMonsterNum / 10);
            //取得怪物monster的数据脚本
            var monsterData = this.node.getChildByName('monster').getComponent('monsterData');
            //后面出现的怪物攻击增加
            monsterData.damage += monsterData.damageIncreaseRatio;

            //杀怪数目的label更新
            this.node.getChildByName('killMonsterNum').getComponent(cc.Label).string = 'kills:' + allData.killMonsterNum;

            //hero升级判断,每杀heroData.killNumToLevelUp个怪升1级
            if (allData.killMonsterNum % heroData.killNumToLevelUp == 0) {
                //播放hero升级音乐
                cc.audioEngine.playEffect(this.gameData.heroLevelUp, false);
                //hero升级
                heroData.level++;
                //生命上限和当前生命都提高
                heroData.maxHp += heroData.hpIncreaseRatio;
                heroData.currentHp += heroData.hpIncreaseRatio;
            }
        }, this);
    },

    update: function update(dt) {}
});

cc._RFpop();
},{"allData":"allData"}],"gameCreateBoss":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0d4f7qfYpBOLLyNxMIDgZsr', 'gameCreateBoss');
// scripts\gameCreateBoss.js

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

cc._RFpop();
},{"allData":"allData"}],"gameCreateMonster":[function(require,module,exports){
"use strict";
cc._RFpush(module, '740adxqgMtDcLk1lBs8I3dG', 'gameCreateMonster');
// scripts\gameCreateMonster.js

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

cc._RFpop();
},{"allData":"allData"}],"gameData":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dd4c8zNxYhDCaYWhRphY4Jt', 'gameData');
// scripts\gameData.js

var allData = require('allData'); //引用所有公共数据
//存放小怪物的数据，每个小怪物节点只能对自己的数据进行读写

cc.Class({
    'extends': cc.Component,

    properties: {

        monsterPrefab: {
            'default': null,
            type: cc.Prefab,
            tooltip: '怪物模型的预制体'
        },

        normalRate: {
            'default': 0,
            tooltip: '正常产生一个小怪的间隔时间'
        },

        extraTime: {
            'default': 0,
            tooltip: '判断是否额外产生一个小怪的间隔时间'
        },

        extraProb: {
            'default': 0,
            tooltip: '判断是否额外产生一个小怪的概率0~1',
            range: [0, 1]
        },

        extraInterval: {
            'default': 0,
            tooltip: '额外产生一个小怪的间隔时间'
        },

        extraRepeat: {
            'default': 0,
            tooltip: '额外产生小怪的个数int',
            type: cc.Integer
        },

        bgmusic: {
            'default': null,
            url: cc.AudioClip,
            tooltip: '游戏初始的背景音乐'
        },

        heroLevelUp: {
            'default': null,
            url: cc.AudioClip,
            tooltip: 'hero升级时候的音乐'
        }
    }
});

cc._RFpop();
},{"allData":"allData"}],"heroAction":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e74d2THPKVFLbePK7gPR6dk', 'heroAction');
// scripts\heroAction.js

var allData = require('allData'); //引用所有公共数据
//控制hero行动的脚本

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有hero节点下的脚本都引用 heroData 数据
        this.heroData = this.getComponent('heroData');

        //注册触屏监听,根据触屏输入，判断hero当前是否移动，记录将要移动到点的位置
        this.heroMoveToPosition();

        this.node.getChildByName('heroHalo').runAction(cc.repeatForever(cc.rotateBy(1, 240)));
    },

    heroMoveToPosition: function heroMoveToPosition() {
        //根据触屏输入，判断hero当前是否移动，记录将要移动到点的位置
        //初始化移动点位置，移动状态
        var self = this;
        self.isMoving = false;
        self.moveToPosition = cc.p(0, 0);
        //注册触屏监听
        self.heroData.canvas.on(cc.Node.EventType.TOUCH_START, function (event) {
            var touches = event.getTouches();
            var touchLocation = touches[0].getLocation();
            self.isMoving = true;
            self.moveToPosition = self.heroData.canvas.convertToNodeSpaceAR(touchLocation);
        }, self.node);
        self.heroData.canvas.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var touches = event.getTouches();
            var touchLocation = touches[0].getLocation();
            self.moveToPosition = self.heroData.canvas.convertToNodeSpaceAR(touchLocation);
        }, self.node);
        self.heroData.canvas.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.isMoving = false; //手指离开屏幕，移动停止
        }, self.node);
    },

    update: function update(dt) {
        if (this.isMoving) {
            //记录当前位置
            var oldPosition = this.node.position;
            //很近距离(x和y都相差很少)就不移动，防止到达目的地后抖动
            if (Math.abs(oldPosition.x - this.moveToPosition.x) > this.heroData.moveSpeed / 100 || Math.abs(oldPosition.y - this.moveToPosition.y) > this.heroData.moveSpeed / 100) {
                //根据当前位置和目的位置计算出移动方向
                var direction = cc.pNormalize(cc.pSub(this.moveToPosition, oldPosition));
                //根据hero移动速度，按移动方向算出hero的新位置
                var newPosition = cc.pAdd(oldPosition, cc.pMult(direction, this.heroData.moveSpeed * dt));
                //根据新位置坐标实时更新hero的位置
                this.node.setPosition(newPosition);
            }
        }

        //限制hero穿墙
        allData.unThroughWalls(this.node, this.node.parent);
    }
});

cc._RFpop();
},{"allData":"allData"}],"heroAttack":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6a28c4rvjNPm7oPhgA2mW/A', 'heroAttack');
// scripts\heroAttack.js

var allData = require('allData'); //引用所有公共数据
//控制hero攻击的脚本

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有hero节点下的脚本都引用 heroData 数据
        this.heroData = this.getComponent('heroData');
        //创建一个heroBallistic的节点池 this.heroBallisticPool
        this.heroBallisticPool = new cc.NodePool();
        //hero攻击计时器初始化
        this.attackTimer = 0;

        //初始化this.heroBallisticPool
        this.heroBallisticPoolInit();
    },

    heroBallisticPoolInit: function heroBallisticPoolInit() {
        var heroBallisticInitCount = 10; //默认最多10粒子弹在场
        for (var i = 0; i < heroBallisticInitCount; ++i) {
            var heroBallistic = cc.instantiate(this.heroData.bulletPrefab); //生成子弹
            this.heroBallisticPool.put(heroBallistic); // 通过 put 接口放入对象池
        }
    },

    createHeroBallistic_Attack: function createHeroBallistic_Attack(parentNode, position, attacker) {
        var heroBallistic = null;
        if (this.heroBallisticPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            heroBallistic = this.heroBallisticPool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，就用 cc.instantiate 重新创建
            heroBallistic = cc.instantiate(this.heroData.bulletPrefab);
        }
        heroBallistic.parent = parentNode; // 将生成的heroBallistic加入节点树
        heroBallistic.setPosition(position);

        //将玩家当前所有攻击属性赋予子弹！
        heroBallistic.getComponent('heroBallisticData').damage = attacker.damage;
        heroBallistic.getComponent('heroBallisticData').critProb = attacker.critProb;
        heroBallistic.getComponent('heroBallisticData').critTimes = attacker.critTimes;
        heroBallistic.getComponent('heroBallisticData').vampire = attacker.vampire;

        //子弹飞起来，攻击！hero当前位置向上飞行一个canvas高度
        heroBallistic.runAction(cc.moveTo(this.heroData.ballisticSpeed, this.node.x, this.node.y + this.heroData.canvas.height));
    },

    update: function update(dt) {
        //hero攻击的计时器，每隔一个单位攻击间隔就攻击一次
        this.attackTimer += dt;
        if (this.attackTimer >= this.heroData.attackInterval) {
            //在hero当前位置生成子弹 and 将玩家当前攻击属性赋予子弹！子弹发射！
            this.createHeroBallistic_Attack(this.node.parent, this.node.position, this.heroData);
            this.attackTimer = 0;
        }
    }
});

cc._RFpop();
},{"allData":"allData"}],"heroBallisticData":[function(require,module,exports){
"use strict";
cc._RFpush(module, '336a59F341KhrXcpTx9O/Mx', 'heroBallisticData');
// scripts\heroBallisticData.js

var allData = require('allData'); //引用所有公共数据
//子弹子弹的数据，伤害和攻击效果跟子弹当前状态有关

cc.Class({
    'extends': cc.Component,

    properties: {
        damage: {
            'default': 0,
            tooltip: '子弹的伤害',
            visible: false
        },

        critProb: {
            'default': 0,
            tooltip: '判断子弹是否暴击的概率0~1',
            range: [0, 1],
            visible: false
        },

        critTimes: {
            'default': 0,
            tooltip: '子弹的暴击倍数',
            visible: false
        },

        vampire: {
            'default': 0,
            tooltip: '子弹攻击吸血比例',
            visible: false
        }

    },

    update: function update(dt) {
        //子弹子弹越界就回收
        if (this.node.y >= this.node.parent.height / 2) {
            this.node.stopAllActions();
            this.node.parent.getChildByName('hero').getComponent('heroAttack').heroBallisticPool.put(this.node);
        }
    }

});

cc._RFpop();
},{"allData":"allData"}],"heroCollision":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e53e4iQP1hHfpkHWJsAlKWv', 'heroCollision');
// scripts\heroCollision.js

var allData = require('allData'); //引用所有公共数据
//处理hero跟怪物碰撞，被子弹击中等受伤掉血的所有信息

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有hero节点下的脚本都引用 heroData 数据
        this.heroData = this.getComponent('heroData');

        this.critShowTime = 0;
    },

    //被怪物碰到，被攻击到都掉血
    onCollisionEnter: function onCollisionEnter(other, self) {
        //对碰撞情况进行划分
        if (other.node.group === 'monster') {
            //被hero子弹击中
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

    update: function update(dt) {
        //暴击标志显现2秒
        this.critShowTime -= dt;
        if (this.critShowTime <= 0) {
            cc.find('heroState/crit', this.node).opacity = 0;
        }
    }
});

cc._RFpop();
},{"allData":"allData"}],"heroControl":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f81e3uyqJFEeIMgs3iI5GJO', 'heroControl');
// scripts\heroControl.js

var allData = require('allData'); //引用所有公共数据
//控制hero节点下所有其他脚本组件激活状态的脚本，hero控制的主脚本

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有hero节点下的脚本都引用 heroData 数据
        this.heroData = this.getComponent('heroData');
    },

    update: function update(dt) {}
});

cc._RFpop();
},{"allData":"allData"}],"heroData":[function(require,module,exports){
"use strict";
cc._RFpush(module, '87e22eFnyVGTLzw5/jccnJo', 'heroData');
// scripts\heroData.js

var allData = require('allData'); //引用所有公共数据
//处理hero的所有属性，数据信息

cc.Class({
    'extends': cc.Component,

    properties: {

        //为hero移动引用canvas
        canvas: cc.Node,

        moveSpeed: {
            'default': 0,
            tooltip: 'hero移动速度'
        },

        currentHp: {
            'default': 0,
            tooltip: 'hero当前生命值',
            visible: false
        },

        maxHp: {
            'default': 0,
            tooltip: 'hero当前生命上限',
            visible: false
        },

        maxHpInit: {
            'default': 0,
            tooltip: 'hero初始生命上限'
        },

        hpIncreaseRatio: {
            'default': 0,
            tooltip: '等级数给hero生命上限增加的比例'
        },

        recovey: {
            'default': 0,
            tooltip: 'hero每秒每级回血数'
        },

        //4种攻击属性：0.火属性，增加后续伤害   1.冰属性，击中减速作用
        //            2.风属性，往后推动作用   3.地属性，一定概率击晕
        bulletPrefab: {
            'default': null,
            type: cc.Prefab,
            tooltip: 'hero攻击弹道的预制体'
        },

        attackInterval: {
            'default': 0,
            tooltip: 'hero连续两次攻击之间的时间间隔，间隔越短攻速越快'
        },

        ballisticSpeed: {
            'default': 0,
            tooltip: 'hero攻击弹道飞行一个canvas高度的时间，时间越短弹道越快'
        },

        damage: {
            'default': 0,
            tooltip: 'hero的攻击力'
        },

        damageIncreaseRatio: {
            'default': 0,
            tooltip: '等级数给hero攻击力增加的比例'
        },

        critProb: {
            'default': 0,
            tooltip: '判断hero是否暴击的概率0~1',
            range: [0, 1]
        },

        critTimes: {
            'default': 0,
            tooltip: 'hero的暴击倍数'
        },

        vampire: {
            'default': 0,
            tooltip: 'hero攻击吸血比例'
        },

        killNumToLevelUp: {
            'default': 0,
            tooltip: 'hero升一级需要杀怪的数目'
        },

        level: {
            'default': 1,
            tooltip: 'hero的等级'
        }

    },

    update: function update(dt) {}

});

cc._RFpop();
},{"allData":"allData"}],"heroHp":[function(require,module,exports){
"use strict";
cc._RFpush(module, '455b4NHS6RCCYny1DCzOpfQ', 'heroHp');
// scripts\heroHp.js

var allData = require('allData'); //引用所有公共数据
//处理hero生命值的变化

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有hero节点下的脚本都引用 heroData 数据
        this.heroData = this.getComponent('heroData');

        //初始化hero血量，最大血量随着等级增加而变大，
        this.heroData.maxHp = Math.floor(allData.randomNormal() * (this.heroData.maxHpInit + this.heroData.hpIncreaseRatio * this.heroData.level));
        this.heroData.currentHp = this.heroData.maxHp;

        //hero回血的计时器
        this.heroRecoveyTimer = 1;
    },

    update: function update(dt) {

        //hero空血时，游戏结束，重新加载初始场景
        if (this.heroData.currentHp <= 0) {

            allData.killMonsterNum = 0;
            allData.monsterLevel = 1;
            this.heroData.level = 1;
            cc.audioEngine.stopAllEffects();
            cc.director.loadScene('Game');
        }

        //hero回血计时
        this.heroRecoveyTimer -= dt;
        if (this.heroRecoveyTimer <= 0) {
            this.heroData.currentHp += this.heroData.recovey * this.heroData.level;
            this.heroRecoveyTimer = 1;
        }

        //控制currentHp范围在[0，maxHp]之间
        this.heroData.currentHp = allData.limitCurrentHp(this.heroData.currentHp, this.heroData.maxHp);
        //血条长度，数值实时变化
        this.node.getChildByName('heroHp').getComponent(cc.ProgressBar).progress = this.heroData.currentHp / this.heroData.maxHp;
        this.node.getChildByName('heroHp').getChildByName('hpNum').getComponent(cc.Label).string = this.heroData.currentHp + '/' + this.heroData.maxHp;
    }
});

cc._RFpop();
},{"allData":"allData"}],"heroState":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a9a47cPeRhOybVzQsCOMYA1', 'heroState');
// scripts\heroState.js

var allData = require('allData'); //引用所有公共数据
//根据不同的事件响应，控制所有状态的显示（暴击，大量回血，吸血，光环，buff等）

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有hero节点下的脚本都引用 heroData 数据
        this.heroData = this.getComponent('heroData');
    },

    update: function update(dt) {}
});

cc._RFpop();
},{"allData":"allData"}],"monsterAction":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0edb2pmk/NNabJOli0yo14j', 'monsterAction');
// scripts\monsterAction.js

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

cc._RFpop();
},{"allData":"allData"}],"monsterCollision":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9072cZWyvhIZKIXCay6PctA', 'monsterCollision');
// scripts\monsterCollision.js

var allData = require('allData'); //引用所有公共数据
//处理碰撞,及碰撞之后所有信息

cc.Class({
    'extends': cc.Component,

    onLoad: function onLoad() {
        this.Collision = 0;
        this.hpShowTime = 0;
        this.critShowTime = 0;
    },

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有小怪物节点下的脚本都引用 monsterData 数据
        this.monsterData = this.getComponent('monsterData');
    },

    //处理其他节点跟本节点的碰撞
    onCollisionEnter: function onCollisionEnter(other, self) {
        //对碰撞情况进行划分
        if (other.node.group === 'heroBallistic') {
            //被hero子弹击中
            var heroBallisticData = other.getComponent('heroBallisticData');
            //血条显现2秒
            cc.find('monsterHp', this.node).opacity = 255;
            this.hpShowTime = 2;

            //判断是否暴击
            if (cc.random0To1() <= heroBallisticData.critProb) {
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

    update: function update(dt) {
        //血条显现2秒
        this.hpShowTime -= dt;
        if (this.hpShowTime <= 0) {
            cc.find('monsterHp', this.node).opacity = 0;
        }
        //暴击标志显现2秒
        this.critShowTime -= dt;
        if (this.critShowTime <= 0) {
            cc.find('monsterState/crit', this.node).opacity = 0;
        }
    }
});

cc._RFpop();
},{"allData":"allData"}],"monsterControl":[function(require,module,exports){
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
},{"allData":"allData"}],"monsterData":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd10ea0XC7RJdqG7OTNyr/wK', 'monsterData');
// scripts\monsterData.js

var allData = require('allData'); //引用所有公共数据
//存放小怪物的数据，每个小怪物节点只能对自己的数据进行读写

cc.Class({
    'extends': cc.Component,

    properties: {
        currentHp: {
            'default': 0,
            tooltip: '怪物当前生命值',
            visible: false
        },

        maxHp: {
            'default': 0,
            tooltip: '怪物的当前生命上限',
            visible: false
        },

        maxHpInit: {
            'default': 0,
            tooltip: '怪物的初始生命上限'
        },

        actionStatus: {
            'default': 0,
            tooltip: '怪物当前的行动状态',
            visible: false
        },

        actionChangeInterval: {
            'default': 0,
            tooltip: '怪物改变行动状态的时间间隔'
        },

        hpIncreaseRatio: {
            'default': 0,
            tooltip: '死亡怪物数给后面怪物生命增加的比例'
        },

        damage: {
            'default': 0,
            tooltip: '怪物的攻击力'
        },

        damageIncreaseRatio: {
            'default': 0,
            tooltip: '死亡1个怪物给后面怪物攻击增加的比例'
        }

    }
});

cc._RFpop();
},{"allData":"allData"}],"monsterHp":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1d2e54qxatC7Zlt3l/BVjkU', 'monsterHp');
// scripts\monsterHp.js

var allData = require('allData'); //引用所有公共数据
//控制小怪物血条的脚本

cc.Class({
    'extends': cc.Component,

    onEnable: function onEnable() {
        //统一用onEnable初始化，重新激活时此函数也会调用
        //所有小怪物节点下的脚本都引用 monsterData 数据
        this.monsterData = this.getComponent('monsterData');

        //初始化：怪物最大血量随机，最大血量随着被杀的怪物数增加而变大,死一个怪加this.monsterData.hpIncreaseRatio生命上限

        this.monsterData.maxHp = Math.floor(allData.randomNormal() * (this.monsterData.maxHpInit + this.monsterData.hpIncreaseRatio * allData.killMonsterNum));
        this.monsterData.currentHp = this.monsterData.maxHp;
    },

    update: function update(dt) {
        //控制currentHp范围在[0，maxHp]之间
        this.monsterData.currentHp = allData.limitCurrentHp(this.monsterData.currentHp, this.monsterData.maxHp);
        //血条长度，数值实时变化
        this.node.getChildByName('monsterHp').getComponent(cc.ProgressBar).progress = this.monsterData.currentHp / this.monsterData.maxHp;
        this.node.getChildByName('monsterHp').getChildByName('hpNum').getComponent(cc.Label).string = this.monsterData.currentHp + '/' + this.monsterData.maxHp;
        //怪物空血就销毁回收节点,杀死怪物数+1，同步更新怪物等级
        if (this.monsterData.currentHp <= 0) {
            //向上发射怪物被杀事件
            this.node.dispatchEvent(new cc.Event.EventCustom('monsterKilled', true));

            //将此monster节点所有数据和脚本状态初始化并回收
            cc.find('monsterState/state', this.node).opacity = 0;
            cc.find('monsterState/crit', this.node).opacity = 0;
            cc.find('monsterState/recovey', this.node).opacity = 0;
            this.getComponent('monsterAction').enabled = true;
            this.node.parent.getComponent('gameCreateMonster').monsterPool.put(this.node);
        }
    }
});

cc._RFpop();
},{"allData":"allData"}],"monsterState":[function(require,module,exports){
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
},{"allData":"allData"}]},{},["monsterAction","gameCreateBoss","monsterHp","allData","monsterState","heroBallisticData","heroHp","heroAttack","gameControl","gameCreateMonster","heroData","monsterCollision","heroState","monsterControl","monsterData","gameData","heroCollision","heroAction","heroControl"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHRzL2FsbERhdGEuanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lQ29udHJvbC5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVDcmVhdGVCb3NzLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2FtZUNyZWF0ZU1vbnN0ZXIuanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lRGF0YS5qcyIsImFzc2V0cy9zY3JpcHRzL2hlcm9BY3Rpb24uanMiLCJhc3NldHMvc2NyaXB0cy9oZXJvQXR0YWNrLmpzIiwiYXNzZXRzL3NjcmlwdHMvaGVyb0JhbGxpc3RpY0RhdGEuanMiLCJhc3NldHMvc2NyaXB0cy9oZXJvQ29sbGlzaW9uLmpzIiwiYXNzZXRzL3NjcmlwdHMvaGVyb0NvbnRyb2wuanMiLCJhc3NldHMvc2NyaXB0cy9oZXJvRGF0YS5qcyIsImFzc2V0cy9zY3JpcHRzL2hlcm9IcC5qcyIsImFzc2V0cy9zY3JpcHRzL2hlcm9TdGF0ZS5qcyIsImFzc2V0cy9zY3JpcHRzL21vbnN0ZXJBY3Rpb24uanMiLCJhc3NldHMvc2NyaXB0cy9tb25zdGVyQ29sbGlzaW9uLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9uc3RlckNvbnRyb2wuanMiLCJhc3NldHMvc2NyaXB0cy9tb25zdGVyRGF0YS5qcyIsImFzc2V0cy9zY3JpcHRzL21vbnN0ZXJIcC5qcyIsImFzc2V0cy9zY3JpcHRzL21vbnN0ZXJTdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzIxMzFiZEkxRDlCTXJNazhGZk8zK05tJywgJ2FsbERhdGEnKTtcbi8vIHNjcmlwdHNcXGFsbERhdGEuanNcblxuLy/lrZjmlL7miYDmnInmuLjmiI/pgJrnlKjmlbDmja7lkozlh73mlbDvvIzmr4/kuKrohJrmnKzpg73lj6/ku6Xlr7nov5nph4znmoTmlbDmja7ov5vooYzor7vlhplcblxudmFyIGFsbERhdGEgPSB7XG4gICAgLy9oZXJv5bey57uP5p2A5q2755qEbW9uc3RlcuaVsOebrlxuICAgIGtpbGxNb25zdGVyTnVtOiAwLFxuICAgIC8v5oCq54mp562J57qn77yM5q+P5p2A5q27MTDkuKrljYfkuIDnuqcs5Yid5aeLMee6pyAgXG4gICAgbW9uc3RlckxldmVsOiAxLFxuXG4gICAgLy/pmZDliLbnqb/lopnlh73mlbDvvIxzZWxmTm9kZeWIsOS6hndhbGxzTm9kZeeahOi+uee8mOS8muiiq+mZkOWItuWcqOi+uee8mFxuICAgIHVuVGhyb3VnaFdhbGxzOiBmdW5jdGlvbiB1blRocm91Z2hXYWxscyhzZWxmTm9kZSwgd2FsbHNOb2RlKSB7XG5cbiAgICAgICAgaWYgKHNlbGZOb2RlLnggKyBzZWxmTm9kZS53aWR0aCAvIDIgPiB3YWxsc05vZGUud2lkdGggLyAyKSB7XG4gICAgICAgICAgICAvL+mZkOWPs1xuICAgICAgICAgICAgc2VsZk5vZGUueCA9IHdhbGxzTm9kZS53aWR0aCAvIDIgLSBzZWxmTm9kZS53aWR0aCAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGZOb2RlLnggLSBzZWxmTm9kZS53aWR0aCAvIDIgPCAtd2FsbHNOb2RlLndpZHRoIC8gMikge1xuICAgICAgICAgICAgLy/pmZDlt6ZcbiAgICAgICAgICAgIHNlbGZOb2RlLnggPSAtKHdhbGxzTm9kZS53aWR0aCAvIDIgLSBzZWxmTm9kZS53aWR0aCAvIDIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmTm9kZS55ICsgc2VsZk5vZGUuaGVpZ2h0IC8gMiA+IHdhbGxzTm9kZS5oZWlnaHQgLyAyKSB7XG4gICAgICAgICAgICAvL+mZkOS4ilxuICAgICAgICAgICAgc2VsZk5vZGUueSA9IHdhbGxzTm9kZS5oZWlnaHQgLyAyIC0gc2VsZk5vZGUuaGVpZ2h0IC8gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZk5vZGUueSAtIHNlbGZOb2RlLmhlaWdodCAvIDIgPCAtd2FsbHNOb2RlLmhlaWdodCAvIDIpIHtcbiAgICAgICAgICAgIC8v6ZmQ5LiKXG4gICAgICAgICAgICBzZWxmTm9kZS55ID0gLSh3YWxsc05vZGUuaGVpZ2h0IC8gMiAtIHNlbGZOb2RlLmhlaWdodCAvIDIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8v56m/5aKZ5Ye95pWw77yMc2VsZk5vZGXliLDkuoZ3YWxsc05vZGXnmoTovrnnvJjkvJrnqb/liLDlr7novrlcbiAgICB0aHJvdWdoV2FsbHM6IGZ1bmN0aW9uIHRocm91Z2hXYWxscyhzZWxmTm9kZSwgd2FsbHNOb2RlKSB7XG5cbiAgICAgICAgaWYgKHNlbGZOb2RlLnggKyBzZWxmTm9kZS53aWR0aCAvIDIgPiB3YWxsc05vZGUud2lkdGggLyAyKSB7XG4gICAgICAgICAgICAvL+S7juWPs+epv1xuICAgICAgICAgICAgc2VsZk5vZGUueCA9IC0od2FsbHNOb2RlLndpZHRoIC8gMiAtIHNlbGZOb2RlLndpZHRoIC8gMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGZOb2RlLnggLSBzZWxmTm9kZS53aWR0aCAvIDIgPCAtd2FsbHNOb2RlLndpZHRoIC8gMikge1xuICAgICAgICAgICAgLy/ku47lt6bnqb9cbiAgICAgICAgICAgIHNlbGZOb2RlLnggPSB3YWxsc05vZGUud2lkdGggLyAyIC0gc2VsZk5vZGUud2lkdGggLyAyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmTm9kZS55ICsgc2VsZk5vZGUuaGVpZ2h0IC8gMiA+IHdhbGxzTm9kZS5oZWlnaHQgLyAyKSB7XG4gICAgICAgICAgICAvL+S7juS4iuepv1xuICAgICAgICAgICAgc2VsZk5vZGUueSA9IC0od2FsbHNOb2RlLmhlaWdodCAvIDIgLSBzZWxmTm9kZS5oZWlnaHQgLyAyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZk5vZGUueSAtIHNlbGZOb2RlLmhlaWdodCAvIDIgPCAtd2FsbHNOb2RlLmhlaWdodCAvIDIpIHtcbiAgICAgICAgICAgIC8v5LuO5LiL56m/XG4gICAgICAgICAgICBzZWxmTm9kZS55ID0gd2FsbHNOb2RlLmhlaWdodCAvIDIgLSBzZWxmTm9kZS5oZWlnaHQgLyAyO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8v6ZmQ5Yi2Y3VycmVudEhw6IyD5Zu05ZyoWzDvvIxtYXhIcF3kuYvpl7TvvIzov5Tlm55jdXJyZW50SHDnmoTlgLxcbiAgICBsaW1pdEN1cnJlbnRIcDogZnVuY3Rpb24gbGltaXRDdXJyZW50SHAoY3VycmVudEhwLCBtYXhIcCkge1xuICAgICAgICBpZiAoY3VycmVudEhwIDw9IDApIHtcbiAgICAgICAgICAgIGN1cnJlbnRIcCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnJlbnRIcCA+PSBtYXhIcCkge1xuICAgICAgICAgICAgY3VycmVudEhwID0gbWF4SHA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnJlbnRIcDtcbiAgICB9LFxuXG4gICAgLy/pmo/mnLrkuIDkuKrojIPlm7QgbWlufm1heCDnmoTlsI/mlbBcbiAgICByYW5kb206IGZ1bmN0aW9uIHJhbmRvbShtaW4sIG1heCkge1xuICAgICAgICB2YXIgcmF0aW8gPSBjYy5yYW5kb20wVG8xKCk7XG4gICAgICAgIHJldHVybiBtaW4gKyAobWF4IC0gbWluKSAqIHJhdGlvO1xuICAgIH0sXG5cbiAgICAvL+W8seWMlumaj+acuu+8jOmaj+acujAuNH4wLjjnmoTlsI/mlbBcbiAgICByYW5kb21XZWFrOiBmdW5jdGlvbiByYW5kb21XZWFrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYW5kb20oMC40LCAwLjgpO1xuICAgIH0sXG5cbiAgICAvL+ato+W4uOmaj+acuu+8mumaj+acuuS4gOS4quiMg+WbtCAwLjh+MS4yIOeahOWwj+aVsFxuICAgIHJhbmRvbU5vcm1hbDogZnVuY3Rpb24gcmFuZG9tTm9ybWFsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYW5kb20oMC44LCAxLjIpO1xuICAgIH0sXG5cbiAgICAvL+WinuW8uumaj+acuu+8jOmaj+acujEuMn4xLjbnmoTlsI/mlbBcbiAgICByYW5kb21TdHJlbmd0aGVuOiBmdW5jdGlvbiByYW5kb21TdHJlbmd0aGVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYW5kb20oMS4yLCAxLjYpO1xuICAgIH0sXG5cbiAgICAvL+maj+acuuS4gOS4quiMg+WbtCBtaW5+bWF4IOeahOaVtOaVsFxuICAgIHJhbmRvbUludDogZnVuY3Rpb24gcmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgIH0sXG5cbiAgICAvL+maj+acuuaAqueJqeaooeWeiyAgIOacgOWkp+maj+acuuWbvueJh+iMg+WbtO+8jOebuOWvuXJlc291cmNlc+eahOaWh+S7tui3r+W+hO+8jOebruagh+iKgueCuVxuICAgIHJhbmRvbU1vZGVsOiBmdW5jdGlvbiByYW5kb21Nb2RlbChtYXhSYW5nZSwgdXJsLCB0YXJnZXROb2RlKSB7XG4gICAgICAgIHZhciBudW0gPSB0aGlzLnJhbmRvbUludCgxLCBtYXhSYW5nZSk7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybC50b1N0cmluZygpICsgJy8nICsgbnVtLnRvU3RyaW5nKCksIGNjLlNwcml0ZUZyYW1lLCBmdW5jdGlvbiAoZXJyLCBzcHJpdGVGcmFtZSkge1xuICAgICAgICAgICAgdGFyZ2V0Tm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHNwcml0ZUZyYW1lO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYWxsRGF0YTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzZhMzYxS29UZjFMaHB3K0t5RHRoN0JQJywgJ2dhbWVDb250cm9sJyk7XG4vLyBzY3JpcHRzXFxnYW1lQ29udHJvbC5qc1xuXG52YXIgYWxsRGF0YSA9IHJlcXVpcmUoJ2FsbERhdGEnKTsgLy/lvJXnlKjmiYDmnInlhazlhbHmlbDmja5cbi8v5o6n5Yi2Q2FudmFz5LiL6Z2i5omA5pyJ6ISa5pys57uE5Lu255qE5r+A5rS754q25oCB77yM5ri45oiP5rWB56iL5o6n5Yi255qE5Li76ISa5pysXG5cbnZhciBnYW1lID0gMDtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uIG9uRW5hYmxlKCkge1xuICAgICAgICAvL+e7n+S4gOeUqG9uRW5hYmxl5Yid5aeL5YyW77yM6YeN5paw5r+A5rS75pe25q2k5Ye95pWw5Lmf5Lya6LCD55SoXG4gICAgICAgIC8v5omA5pyJQ2FudmFz6IqC54K55LiL55qE6ISa5pys6YO95byV55SoIGdhbWVEYXRhIOaVsOaNrlxuICAgICAgICB0aGlzLmdhbWVEYXRhID0gdGhpcy5nZXRDb21wb25lbnQoJ2dhbWVEYXRhJyk7XG4gICAgICAgIC8v5Y+W5b6XaGVyb+eahOaVsOaNruiEmuacrFxuICAgICAgICB2YXIgaGVyb0RhdGEgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2hlcm8nKS5nZXRDb21wb25lbnQoJ2hlcm9EYXRhJyk7XG4gICAgICAgIHZhciBoZXJvQXR0YWNrID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdoZXJvJykuZ2V0Q29tcG9uZW50KCdoZXJvQXR0YWNrJyk7XG5cbiAgICAgICAgLy/mkq3mlL7og4zmma/pn7PkuZBcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmdhbWVEYXRhLmJnbXVzaWMsIHRydWUsIDAuMyk7XG5cbiAgICAgICAgLy/lvIDlkK/norDmkp5cbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIC8v5rOo5YaM5ZON5bqU5LqL5Lu2XG4gICAgICAgIHRoaXMubm9kZS5vbignbW9uc3RlcktpbGxlZCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy/mgKrnianooqvmnYDmlbDnm67vvIzmgKrniannrYnnuqfmm7TmlrBcbiAgICAgICAgICAgIGFsbERhdGEua2lsbE1vbnN0ZXJOdW0rKztcbiAgICAgICAgICAgIGFsbERhdGEubW9uc3RlckxldmVsID0gMSArIE1hdGguZmxvb3IoYWxsRGF0YS5raWxsTW9uc3Rlck51bSAvIDEwKTtcbiAgICAgICAgICAgIC8v5Y+W5b6X5oCq54mpbW9uc3RlcueahOaVsOaNruiEmuacrFxuICAgICAgICAgICAgdmFyIG1vbnN0ZXJEYXRhID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdtb25zdGVyJykuZ2V0Q29tcG9uZW50KCdtb25zdGVyRGF0YScpO1xuICAgICAgICAgICAgLy/lkI7pnaLlh7rnjrDnmoTmgKrnianmlLvlh7vlop7liqBcbiAgICAgICAgICAgIG1vbnN0ZXJEYXRhLmRhbWFnZSArPSBtb25zdGVyRGF0YS5kYW1hZ2VJbmNyZWFzZVJhdGlvO1xuXG4gICAgICAgICAgICAvL+adgOaAquaVsOebrueahGxhYmVs5pu05pawXG4gICAgICAgICAgICB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2tpbGxNb25zdGVyTnVtJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSAna2lsbHM6JyArIGFsbERhdGEua2lsbE1vbnN0ZXJOdW07XG5cbiAgICAgICAgICAgIC8vaGVyb+WNh+e6p+WIpOaWrSzmr4/mnYBoZXJvRGF0YS5raWxsTnVtVG9MZXZlbFVw5Liq5oCq5Y2HMee6p1xuICAgICAgICAgICAgaWYgKGFsbERhdGEua2lsbE1vbnN0ZXJOdW0gJSBoZXJvRGF0YS5raWxsTnVtVG9MZXZlbFVwID09IDApIHtcbiAgICAgICAgICAgICAgICAvL+aSreaUvmhlcm/ljYfnuqfpn7PkuZBcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuZ2FtZURhdGEuaGVyb0xldmVsVXAsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAvL2hlcm/ljYfnuqdcbiAgICAgICAgICAgICAgICBoZXJvRGF0YS5sZXZlbCsrO1xuICAgICAgICAgICAgICAgIC8v55Sf5ZG95LiK6ZmQ5ZKM5b2T5YmN55Sf5ZG96YO95o+Q6auYXG4gICAgICAgICAgICAgICAgaGVyb0RhdGEubWF4SHAgKz0gaGVyb0RhdGEuaHBJbmNyZWFzZVJhdGlvO1xuICAgICAgICAgICAgICAgIGhlcm9EYXRhLmN1cnJlbnRIcCArPSBoZXJvRGF0YS5ocEluY3JlYXNlUmF0aW87XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge31cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMGQ0ZjdxZllwQk9MTHlOeE1JRGdac3InLCAnZ2FtZUNyZWF0ZUJvc3MnKTtcbi8vIHNjcmlwdHNcXGdhbWVDcmVhdGVCb3NzLmpzXG5cbnZhciBhbGxEYXRhID0gcmVxdWlyZSgnYWxsRGF0YScpOyAvL+W8leeUqOaJgOacieWFrOWFseaVsOaNrlxuLy/mjqfliLblpKfmgKrnianlnKjlnLrmma/nlJ/miJDkuI7lm57mlLbnmoTohJrmnKzvvIznlJ/miJBCb3NzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiBvbkVuYWJsZSgpIHtcbiAgICAgICAgLy/nu5/kuIDnlKhvbkVuYWJsZeWIneWni+WMlu+8jOmHjeaWsOa/gOa0u+aXtuatpOWHveaVsOS5n+S8muiwg+eUqFxuICAgICAgICAvL+aJgOaciUNhbnZhc+iKgueCueS4i+eahOiEmuacrOmDveW8leeUqCBnYW1lRGF0YSDmlbDmja5cbiAgICAgICAgdGhpcy5nYW1lRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50KCdnYW1lRGF0YScpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge31cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNzQwYWR4cWdNdERjTGsxbEJzOEkzZEcnLCAnZ2FtZUNyZWF0ZU1vbnN0ZXInKTtcbi8vIHNjcmlwdHNcXGdhbWVDcmVhdGVNb25zdGVyLmpzXG5cbnZhciBhbGxEYXRhID0gcmVxdWlyZSgnYWxsRGF0YScpOyAvL+W8leeUqOaJgOacieWFrOWFseaVsOaNrlxuLy/mjqfliLblsI/mgKrnianlnKjlnLrmma/nlJ/miJDkuI7lm57mlLbnmoTohJrmnKzvvIznlJ/miJDmma7pgJrnmoTlsI/mgKpcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uIG9uRW5hYmxlKCkge1xuICAgICAgICAvL+e7n+S4gOeUqG9uRW5hYmxl5Yid5aeL5YyW77yM6YeN5paw5r+A5rS75pe25q2k5Ye95pWw5Lmf5Lya6LCD55SoXG4gICAgICAgIC8v5omA5pyJQ2FudmFz6IqC54K55LiL55qE6ISa5pys6YO95byV55SoIGdhbWVEYXRhIOaVsOaNrlxuICAgICAgICB0aGlzLmdhbWVEYXRhID0gdGhpcy5nZXRDb21wb25lbnQoJ2dhbWVEYXRhJyk7XG4gICAgICAgIC8v5Yib5bu65LiA5LiqbW9uc3RlcueahOiKgueCueaxoCB0aGlzLm1vbnN0ZXJQb29sXG4gICAgICAgIHRoaXMubW9uc3RlclBvb2wgPSBuZXcgY2MuTm9kZVBvb2woKTtcblxuICAgICAgICAvL+WIneWni+WMlnRoaXMubW9uc3RlclBvb2xcbiAgICAgICAgdGhpcy5tb25zdGVyUG9vbEluaXQoKTtcblxuICAgICAgICAvL+S7peS4gOWumueahOmAn+eOh+S6p+eUn+aAqueJqVxuICAgICAgICB0aGlzLmNyZWF0ZU1vbnN0ZXJOb3JtYWwodGhpcy5nYW1lRGF0YS5ub3JtYWxSYXRlKTtcblxuICAgICAgICAvL+i/mOacieS4gOWumuamgueOh+S6p+eUn+mineWklueahOaAqueJqVxuICAgICAgICB0aGlzLmNyZWF0ZU1vbnN0ZXJFeHRyYSh0aGlzLmdhbWVEYXRhLmV4dHJhVGltZSwgdGhpcy5nYW1lRGF0YS5leHRyYVByb2IsIHRoaXMuZ2FtZURhdGEuZXh0cmFJbnRlcnZhbCwgdGhpcy5nYW1lRGF0YS5leHRyYVJlcGVhdCk7XG4gICAgfSxcblxuICAgIG1vbnN0ZXJQb29sSW5pdDogZnVuY3Rpb24gbW9uc3RlclBvb2xJbml0KCkge1xuICAgICAgICB2YXIgbW9uc3RlckluaXRDb3VudCA9IDIwOyAvL+m7mOiupOacgOWkmjIw5Liq5oCq54mp5Zyo5Zy6XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9uc3RlckluaXRDb3VudDsgKytpKSB7XG4gICAgICAgICAgICB2YXIgbW9uc3RlciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuZ2FtZURhdGEubW9uc3RlclByZWZhYik7IC8vIOWIm+W7uiBtb25zdGVyIOiKgueCuVxuICAgICAgICAgICAgdGhpcy5tb25zdGVyUG9vbC5wdXQobW9uc3Rlcik7IC8vIOmAmui/hyBwdXQg5o6l5Y+j5pS+5YWl5a+56LGh5rGgXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY3JlYXRlTW9uc3RlcjogZnVuY3Rpb24gY3JlYXRlTW9uc3RlcihwYXJlbnROb2RlKSB7XG4gICAgICAgIHZhciBtb25zdGVyID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMubW9uc3RlclBvb2wuc2l6ZSgpID4gMCkge1xuICAgICAgICAgICAgLy8g6YCa6L+HIHNpemUg5o6l5Y+j5Yik5pat5a+56LGh5rGg5Lit5piv5ZCm5pyJ56m66Zey55qE5a+56LGhXG4gICAgICAgICAgICBtb25zdGVyID0gdGhpcy5tb25zdGVyUG9vbC5nZXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOWmguaenOayoeacieepuumXsuWvueixoe+8jOS5n+WwseaYr+WvueixoeaxoOS4reWkh+eUqOWvueixoeS4jeWkn+aXtu+8jOWwseeUqCBjYy5pbnN0YW50aWF0ZSDph43mlrDliJvlu7pcbiAgICAgICAgICAgIG1vbnN0ZXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmdhbWVEYXRhLm1vbnN0ZXJQcmVmYWIpO1xuICAgICAgICB9XG4gICAgICAgIG1vbnN0ZXIucGFyZW50ID0gcGFyZW50Tm9kZTsgLy8g5bCG55Sf5oiQ55qEbW9uc3RlcuWKoOWFpeiKgueCueagkVxuICAgICAgICByZXR1cm4gbW9uc3RlcjsgLy/ov5Tlm55tb25zdGVy6IqC54K577yM6LCD55So5Ye95pWw5Y+v5Lul6K6+572ubW9uc3RlcuiKgueCueeahOS9jee9rlxuICAgIH0sXG5cbiAgICBjcmVhdGVNb25zdGVyTm9ybWFsOiBmdW5jdGlvbiBjcmVhdGVNb25zdGVyTm9ybWFsKHJhdGUpIHtcbiAgICAgICAgLy/lnKjlsY/luZXmnIDkuIrmlrnkuIDlrprpgJ/njofkuqfnlJ/mgKrniak65q+PcmF0ZeenkuS6p+eUn+S4gOS4quaAqueJqVxuICAgICAgICB0aGlzLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtb25zdGVyTm9kZSA9IHRoaXMuY3JlYXRlTW9uc3Rlcih0aGlzLm5vZGUpO1xuICAgICAgICAgICAgLy/pmo/mnLrmgKrnianmqKHlnotcbiAgICAgICAgICAgIHZhciB1cmwgPSAnbW9uc3Rlcic7XG4gICAgICAgICAgICBhbGxEYXRhLnJhbmRvbU1vZGVsKDEwMywgdXJsLCBtb25zdGVyTm9kZS5nZXRDaGlsZEJ5TmFtZSgnbW9uc3RlckJvZHknKSk7XG4gICAgICAgICAgICAvL+maj+acuuiuvue9ruaAqueJqeS9jee9rlxuICAgICAgICAgICAgbW9uc3Rlck5vZGUuc2V0UG9zaXRpb24oY2MucmFuZG9tTWludXMxVG8xKCkgKiAodGhpcy5ub2RlLndpZHRoIC8gMiAtIG1vbnN0ZXJOb2RlLndpZHRoIC8gMiksIHRoaXMubm9kZS5oZWlnaHQgLyAyIC0gbW9uc3Rlck5vZGUuaGVpZ2h0IC8gMik7XG4gICAgICAgIH0sIHJhdGUpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVNb25zdGVyRXh0cmE6IGZ1bmN0aW9uIGNyZWF0ZU1vbnN0ZXJFeHRyYSh0aW1lLCBwcm9iLCBpbnRlcnZhbCwgcmVwZWF0KSB7XG4gICAgICAgIC8v55So6K6h5pe25Zmo5Lqn55Sf6aKd5aSW55qE5oCq54mp77yaXG4gICAgICAgIC8v5q+PdGltZeaXtumXtOmaj+acuuS4gOS4qjB+MeeahOaVsOWtl++8jOWmguaenOWwj+S6juS6p+eUn+amgueOhyBwcm9i77yMXG4gICAgICAgIC8v5YiZ5o6l5LiL5p2l5q+PaW50ZXJ2YWznp5LlnKjlnLrmma/pmo/mnLrkvY3nva7kuqfnlJ/kuIDkuKrpop3lpJbnmoTmgKrnianvvIzmraTova7kuqfnlJ9yZXBlYXTkuKrmgKrnialcbiAgICAgICAgdGhpcy5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY2MucmFuZG9tMFRvMSgpIDw9IHByb2IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vbnN0ZXJOb2RlID0gdGhpcy5jcmVhdGVNb25zdGVyKHRoaXMubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIC8v6ZqP5py65oCq54mp5qih5Z6LXG4gICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSAnbW9uc3Rlcic7XG4gICAgICAgICAgICAgICAgICAgIGFsbERhdGEucmFuZG9tTW9kZWwoMTAzLCB1cmwsIG1vbnN0ZXJOb2RlLmdldENoaWxkQnlOYW1lKCdtb25zdGVyQm9keScpKTtcbiAgICAgICAgICAgICAgICAgICAgLy/pmo/mnLrorr7nva7mgKrniankvY3nva5cbiAgICAgICAgICAgICAgICAgICAgbW9uc3Rlck5vZGUuc2V0UG9zaXRpb24oY2MucmFuZG9tTWludXMxVG8xKCkgKiAodGhpcy5ub2RlLndpZHRoIC8gMiAtIG1vbnN0ZXJOb2RlLndpZHRoIC8gMiksIGNjLnJhbmRvbU1pbnVzMVRvMSgpICogKHRoaXMubm9kZS5oZWlnaHQgLyAyIC0gbW9uc3Rlck5vZGUuaGVpZ2h0IC8gMikpO1xuICAgICAgICAgICAgICAgIH0sIGludGVydmFsLCByZXBlYXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aW1lKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHt9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2RkNGM4ek54WWhEQ2FZV2hScGhZNEp0JywgJ2dhbWVEYXRhJyk7XG4vLyBzY3JpcHRzXFxnYW1lRGF0YS5qc1xuXG52YXIgYWxsRGF0YSA9IHJlcXVpcmUoJ2FsbERhdGEnKTsgLy/lvJXnlKjmiYDmnInlhazlhbHmlbDmja5cbi8v5a2Y5pS+5bCP5oCq54mp55qE5pWw5o2u77yM5q+P5Liq5bCP5oCq54mp6IqC54K55Y+q6IO95a+56Ieq5bex55qE5pWw5o2u6L+b6KGM6K+75YaZXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICBtb25zdGVyUHJlZmFiOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgICAgICB0b29sdGlwOiAn5oCq54mp5qih5Z6L55qE6aKE5Yi25L2TJ1xuICAgICAgICB9LFxuXG4gICAgICAgIG5vcm1hbFJhdGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICfmraPluLjkuqfnlJ/kuIDkuKrlsI/mgKrnmoTpl7TpmpTml7bpl7QnXG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFUaW1lOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiAn5Yik5pat5piv5ZCm6aKd5aSW5Lqn55Sf5LiA5Liq5bCP5oCq55qE6Ze06ZqU5pe26Ze0J1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhUHJvYjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogJ+WIpOaWreaYr+WQpumineWkluS6p+eUn+S4gOS4quWwj+aAqueahOamgueOhzB+MScsXG4gICAgICAgICAgICByYW5nZTogWzAsIDFdXG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFJbnRlcnZhbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogJ+mineWkluS6p+eUn+S4gOS4quWwj+aAqueahOmXtOmalOaXtumXtCdcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYVJlcGVhdDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogJ+mineWkluS6p+eUn+Wwj+aAqueahOS4quaVsGludCcsXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gICAgICAgIH0sXG5cbiAgICAgICAgYmdtdXNpYzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXAsXG4gICAgICAgICAgICB0b29sdGlwOiAn5ri45oiP5Yid5aeL55qE6IOM5pmv6Z+z5LmQJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGhlcm9MZXZlbFVwOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICdoZXJv5Y2H57qn5pe25YCZ55qE6Z+z5LmQJ1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdlNzRkMlRIUEtWRkxiZVBLN2dQUjZkaycsICdoZXJvQWN0aW9uJyk7XG4vLyBzY3JpcHRzXFxoZXJvQWN0aW9uLmpzXG5cbnZhciBhbGxEYXRhID0gcmVxdWlyZSgnYWxsRGF0YScpOyAvL+W8leeUqOaJgOacieWFrOWFseaVsOaNrlxuLy/mjqfliLZoZXJv6KGM5Yqo55qE6ISa5pysXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiBvbkVuYWJsZSgpIHtcbiAgICAgICAgLy/nu5/kuIDnlKhvbkVuYWJsZeWIneWni+WMlu+8jOmHjeaWsOa/gOa0u+aXtuatpOWHveaVsOS5n+S8muiwg+eUqFxuICAgICAgICAvL+aJgOaciWhlcm/oioLngrnkuIvnmoTohJrmnKzpg73lvJXnlKggaGVyb0RhdGEg5pWw5o2uXG4gICAgICAgIHRoaXMuaGVyb0RhdGEgPSB0aGlzLmdldENvbXBvbmVudCgnaGVyb0RhdGEnKTtcblxuICAgICAgICAvL+azqOWGjOinpuWxj+ebkeWQrCzmoLnmja7op6blsY/ovpPlhaXvvIzliKTmlq1oZXJv5b2T5YmN5piv5ZCm56e75Yqo77yM6K6w5b2V5bCG6KaB56e75Yqo5Yiw54K555qE5L2N572uXG4gICAgICAgIHRoaXMuaGVyb01vdmVUb1Bvc2l0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdoZXJvSGFsbycpLnJ1bkFjdGlvbihjYy5yZXBlYXRGb3JldmVyKGNjLnJvdGF0ZUJ5KDEsIDI0MCkpKTtcbiAgICB9LFxuXG4gICAgaGVyb01vdmVUb1Bvc2l0aW9uOiBmdW5jdGlvbiBoZXJvTW92ZVRvUG9zaXRpb24oKSB7XG4gICAgICAgIC8v5qC55o2u6Kem5bGP6L6T5YWl77yM5Yik5pataGVyb+W9k+WJjeaYr+WQpuenu+WKqO+8jOiusOW9leWwhuimgeenu+WKqOWIsOeCueeahOS9jee9rlxuICAgICAgICAvL+WIneWni+WMluenu+WKqOeCueS9jee9ru+8jOenu+WKqOeKtuaAgVxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgc2VsZi5tb3ZlVG9Qb3NpdGlvbiA9IGNjLnAoMCwgMCk7XG4gICAgICAgIC8v5rOo5YaM6Kem5bGP55uR5ZCsXG4gICAgICAgIHNlbGYuaGVyb0RhdGEuY2FudmFzLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciB0b3VjaGVzID0gZXZlbnQuZ2V0VG91Y2hlcygpO1xuICAgICAgICAgICAgdmFyIHRvdWNoTG9jYXRpb24gPSB0b3VjaGVzWzBdLmdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICBzZWxmLmlzTW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYubW92ZVRvUG9zaXRpb24gPSBzZWxmLmhlcm9EYXRhLmNhbnZhcy5jb252ZXJ0VG9Ob2RlU3BhY2VBUih0b3VjaExvY2F0aW9uKTtcbiAgICAgICAgfSwgc2VsZi5ub2RlKTtcbiAgICAgICAgc2VsZi5oZXJvRGF0YS5jYW52YXMub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgdG91Y2hlcyA9IGV2ZW50LmdldFRvdWNoZXMoKTtcbiAgICAgICAgICAgIHZhciB0b3VjaExvY2F0aW9uID0gdG91Y2hlc1swXS5nZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgc2VsZi5tb3ZlVG9Qb3NpdGlvbiA9IHNlbGYuaGVyb0RhdGEuY2FudmFzLmNvbnZlcnRUb05vZGVTcGFjZUFSKHRvdWNoTG9jYXRpb24pO1xuICAgICAgICB9LCBzZWxmLm5vZGUpO1xuICAgICAgICBzZWxmLmhlcm9EYXRhLmNhbnZhcy5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgc2VsZi5pc01vdmluZyA9IGZhbHNlOyAvL+aJi+aMh+emu+W8gOWxj+W5le+8jOenu+WKqOWBnOatolxuICAgICAgICB9LCBzZWxmLm5vZGUpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5pc01vdmluZykge1xuICAgICAgICAgICAgLy/orrDlvZXlvZPliY3kvY3nva5cbiAgICAgICAgICAgIHZhciBvbGRQb3NpdGlvbiA9IHRoaXMubm9kZS5wb3NpdGlvbjtcbiAgICAgICAgICAgIC8v5b6I6L+R6Led56a7KHjlkox56YO955u45beu5b6I5bCRKeWwseS4jeenu+WKqO+8jOmYsuatouWIsOi+vuebrueahOWcsOWQjuaKluWKqFxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKG9sZFBvc2l0aW9uLnggLSB0aGlzLm1vdmVUb1Bvc2l0aW9uLngpID4gdGhpcy5oZXJvRGF0YS5tb3ZlU3BlZWQgLyAxMDAgfHwgTWF0aC5hYnMob2xkUG9zaXRpb24ueSAtIHRoaXMubW92ZVRvUG9zaXRpb24ueSkgPiB0aGlzLmhlcm9EYXRhLm1vdmVTcGVlZCAvIDEwMCkge1xuICAgICAgICAgICAgICAgIC8v5qC55o2u5b2T5YmN5L2N572u5ZKM55uu55qE5L2N572u6K6h566X5Ye656e75Yqo5pa55ZCRXG4gICAgICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGNjLnBOb3JtYWxpemUoY2MucFN1Yih0aGlzLm1vdmVUb1Bvc2l0aW9uLCBvbGRQb3NpdGlvbikpO1xuICAgICAgICAgICAgICAgIC8v5qC55o2uaGVyb+enu+WKqOmAn+W6pu+8jOaMieenu+WKqOaWueWQkeeul+WHumhlcm/nmoTmlrDkvY3nva5cbiAgICAgICAgICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSBjYy5wQWRkKG9sZFBvc2l0aW9uLCBjYy5wTXVsdChkaXJlY3Rpb24sIHRoaXMuaGVyb0RhdGEubW92ZVNwZWVkICogZHQpKTtcbiAgICAgICAgICAgICAgICAvL+agueaNruaWsOS9jee9ruWdkOagh+WunuaXtuabtOaWsGhlcm/nmoTkvY3nva5cbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2V0UG9zaXRpb24obmV3UG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy/pmZDliLZoZXJv56m/5aKZXG4gICAgICAgIGFsbERhdGEudW5UaHJvdWdoV2FsbHModGhpcy5ub2RlLCB0aGlzLm5vZGUucGFyZW50KTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzZhMjhjNHJ2ak5QbTdvUGhnQTJtVy9BJywgJ2hlcm9BdHRhY2snKTtcbi8vIHNjcmlwdHNcXGhlcm9BdHRhY2suanNcblxudmFyIGFsbERhdGEgPSByZXF1aXJlKCdhbGxEYXRhJyk7IC8v5byV55So5omA5pyJ5YWs5YWx5pWw5o2uXG4vL+aOp+WItmhlcm/mlLvlh7vnmoTohJrmnKxcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uIG9uRW5hYmxlKCkge1xuICAgICAgICAvL+e7n+S4gOeUqG9uRW5hYmxl5Yid5aeL5YyW77yM6YeN5paw5r+A5rS75pe25q2k5Ye95pWw5Lmf5Lya6LCD55SoXG4gICAgICAgIC8v5omA5pyJaGVyb+iKgueCueS4i+eahOiEmuacrOmDveW8leeUqCBoZXJvRGF0YSDmlbDmja5cbiAgICAgICAgdGhpcy5oZXJvRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50KCdoZXJvRGF0YScpO1xuICAgICAgICAvL+WIm+W7uuS4gOS4qmhlcm9CYWxsaXN0aWPnmoToioLngrnmsaAgdGhpcy5oZXJvQmFsbGlzdGljUG9vbFxuICAgICAgICB0aGlzLmhlcm9CYWxsaXN0aWNQb29sID0gbmV3IGNjLk5vZGVQb29sKCk7XG4gICAgICAgIC8vaGVyb+aUu+WHu+iuoeaXtuWZqOWIneWni+WMllxuICAgICAgICB0aGlzLmF0dGFja1RpbWVyID0gMDtcblxuICAgICAgICAvL+WIneWni+WMlnRoaXMuaGVyb0JhbGxpc3RpY1Bvb2xcbiAgICAgICAgdGhpcy5oZXJvQmFsbGlzdGljUG9vbEluaXQoKTtcbiAgICB9LFxuXG4gICAgaGVyb0JhbGxpc3RpY1Bvb2xJbml0OiBmdW5jdGlvbiBoZXJvQmFsbGlzdGljUG9vbEluaXQoKSB7XG4gICAgICAgIHZhciBoZXJvQmFsbGlzdGljSW5pdENvdW50ID0gMTA7IC8v6buY6K6k5pyA5aSaMTDnspLlrZDlvLnlnKjlnLpcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZXJvQmFsbGlzdGljSW5pdENvdW50OyArK2kpIHtcbiAgICAgICAgICAgIHZhciBoZXJvQmFsbGlzdGljID0gY2MuaW5zdGFudGlhdGUodGhpcy5oZXJvRGF0YS5idWxsZXRQcmVmYWIpOyAvL+eUn+aIkOWtkOW8uVxuICAgICAgICAgICAgdGhpcy5oZXJvQmFsbGlzdGljUG9vbC5wdXQoaGVyb0JhbGxpc3RpYyk7IC8vIOmAmui/hyBwdXQg5o6l5Y+j5pS+5YWl5a+56LGh5rGgXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY3JlYXRlSGVyb0JhbGxpc3RpY19BdHRhY2s6IGZ1bmN0aW9uIGNyZWF0ZUhlcm9CYWxsaXN0aWNfQXR0YWNrKHBhcmVudE5vZGUsIHBvc2l0aW9uLCBhdHRhY2tlcikge1xuICAgICAgICB2YXIgaGVyb0JhbGxpc3RpYyA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmhlcm9CYWxsaXN0aWNQb29sLnNpemUoKSA+IDApIHtcbiAgICAgICAgICAgIC8vIOmAmui/hyBzaXplIOaOpeWPo+WIpOaWreWvueixoeaxoOS4reaYr+WQpuacieepuumXsueahOWvueixoVxuICAgICAgICAgICAgaGVyb0JhbGxpc3RpYyA9IHRoaXMuaGVyb0JhbGxpc3RpY1Bvb2wuZ2V0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyDlpoLmnpzmsqHmnInnqbrpl7Llr7nosaHvvIzkuZ/lsLHmmK/lr7nosaHmsaDkuK3lpIfnlKjlr7nosaHkuI3lpJ/ml7bvvIzlsLHnlKggY2MuaW5zdGFudGlhdGUg6YeN5paw5Yib5bu6XG4gICAgICAgICAgICBoZXJvQmFsbGlzdGljID0gY2MuaW5zdGFudGlhdGUodGhpcy5oZXJvRGF0YS5idWxsZXRQcmVmYWIpO1xuICAgICAgICB9XG4gICAgICAgIGhlcm9CYWxsaXN0aWMucGFyZW50ID0gcGFyZW50Tm9kZTsgLy8g5bCG55Sf5oiQ55qEaGVyb0JhbGxpc3RpY+WKoOWFpeiKgueCueagkVxuICAgICAgICBoZXJvQmFsbGlzdGljLnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcblxuICAgICAgICAvL+WwhueOqeWutuW9k+WJjeaJgOacieaUu+WHu+WxnuaAp+i1i+S6iOWtkOW8ue+8gVxuICAgICAgICBoZXJvQmFsbGlzdGljLmdldENvbXBvbmVudCgnaGVyb0JhbGxpc3RpY0RhdGEnKS5kYW1hZ2UgPSBhdHRhY2tlci5kYW1hZ2U7XG4gICAgICAgIGhlcm9CYWxsaXN0aWMuZ2V0Q29tcG9uZW50KCdoZXJvQmFsbGlzdGljRGF0YScpLmNyaXRQcm9iID0gYXR0YWNrZXIuY3JpdFByb2I7XG4gICAgICAgIGhlcm9CYWxsaXN0aWMuZ2V0Q29tcG9uZW50KCdoZXJvQmFsbGlzdGljRGF0YScpLmNyaXRUaW1lcyA9IGF0dGFja2VyLmNyaXRUaW1lcztcbiAgICAgICAgaGVyb0JhbGxpc3RpYy5nZXRDb21wb25lbnQoJ2hlcm9CYWxsaXN0aWNEYXRhJykudmFtcGlyZSA9IGF0dGFja2VyLnZhbXBpcmU7XG5cbiAgICAgICAgLy/lrZDlvLnpo57otbfmnaXvvIzmlLvlh7vvvIFoZXJv5b2T5YmN5L2N572u5ZCR5LiK6aOe6KGM5LiA5LiqY2FudmFz6auY5bqmXG4gICAgICAgIGhlcm9CYWxsaXN0aWMucnVuQWN0aW9uKGNjLm1vdmVUbyh0aGlzLmhlcm9EYXRhLmJhbGxpc3RpY1NwZWVkLCB0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkgKyB0aGlzLmhlcm9EYXRhLmNhbnZhcy5oZWlnaHQpKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgLy9oZXJv5pS75Ye755qE6K6h5pe25Zmo77yM5q+P6ZqU5LiA5Liq5Y2V5L2N5pS75Ye76Ze06ZqU5bCx5pS75Ye75LiA5qyhXG4gICAgICAgIHRoaXMuYXR0YWNrVGltZXIgKz0gZHQ7XG4gICAgICAgIGlmICh0aGlzLmF0dGFja1RpbWVyID49IHRoaXMuaGVyb0RhdGEuYXR0YWNrSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIC8v5ZyoaGVyb+W9k+WJjeS9jee9rueUn+aIkOWtkOW8uSBhbmQg5bCG546p5a625b2T5YmN5pS75Ye75bGe5oCn6LWL5LqI5a2Q5by577yB5a2Q5by55Y+R5bCE77yBXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUhlcm9CYWxsaXN0aWNfQXR0YWNrKHRoaXMubm9kZS5wYXJlbnQsIHRoaXMubm9kZS5wb3NpdGlvbiwgdGhpcy5oZXJvRGF0YSk7XG4gICAgICAgICAgICB0aGlzLmF0dGFja1RpbWVyID0gMDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMzM2YTU5RjM0MUtoclhjcFR4OU8vTXgnLCAnaGVyb0JhbGxpc3RpY0RhdGEnKTtcbi8vIHNjcmlwdHNcXGhlcm9CYWxsaXN0aWNEYXRhLmpzXG5cbnZhciBhbGxEYXRhID0gcmVxdWlyZSgnYWxsRGF0YScpOyAvL+W8leeUqOaJgOacieWFrOWFseaVsOaNrlxuLy/lrZDlvLnlrZDlvLnnmoTmlbDmja7vvIzkvKTlrrPlkozmlLvlh7vmlYjmnpzot5/lrZDlvLnlvZPliY3nirbmgIHmnInlhbNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBkYW1hZ2U6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICflrZDlvLnnmoTkvKTlrrMnLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBjcml0UHJvYjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogJ+WIpOaWreWtkOW8ueaYr+WQpuaatOWHu+eahOamgueOhzB+MScsXG4gICAgICAgICAgICByYW5nZTogWzAsIDFdLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBjcml0VGltZXM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICflrZDlvLnnmoTmmrTlh7vlgI3mlbAnLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICB2YW1waXJlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiAn5a2Q5by55pS75Ye75ZC46KGA5q+U5L6LJyxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICAvL+WtkOW8ueWtkOW8uei2iueVjOWwseWbnuaUtlxuICAgICAgICBpZiAodGhpcy5ub2RlLnkgPj0gdGhpcy5ub2RlLnBhcmVudC5oZWlnaHQgLyAyKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5wYXJlbnQuZ2V0Q2hpbGRCeU5hbWUoJ2hlcm8nKS5nZXRDb21wb25lbnQoJ2hlcm9BdHRhY2snKS5oZXJvQmFsbGlzdGljUG9vbC5wdXQodGhpcy5ub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdlNTNlNGlRUDFoSGZwa0hXSnNBbEtXdicsICdoZXJvQ29sbGlzaW9uJyk7XG4vLyBzY3JpcHRzXFxoZXJvQ29sbGlzaW9uLmpzXG5cbnZhciBhbGxEYXRhID0gcmVxdWlyZSgnYWxsRGF0YScpOyAvL+W8leeUqOaJgOacieWFrOWFseaVsOaNrlxuLy/lpITnkIZoZXJv6Lef5oCq54mp56Kw5pKe77yM6KKr5a2Q5by55Ye75Lit562J5Y+X5Lyk5o6J6KGA55qE5omA5pyJ5L+h5oGvXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiBvbkVuYWJsZSgpIHtcbiAgICAgICAgLy/nu5/kuIDnlKhvbkVuYWJsZeWIneWni+WMlu+8jOmHjeaWsOa/gOa0u+aXtuatpOWHveaVsOS5n+S8muiwg+eUqFxuICAgICAgICAvL+aJgOaciWhlcm/oioLngrnkuIvnmoTohJrmnKzpg73lvJXnlKggaGVyb0RhdGEg5pWw5o2uXG4gICAgICAgIHRoaXMuaGVyb0RhdGEgPSB0aGlzLmdldENvbXBvbmVudCgnaGVyb0RhdGEnKTtcblxuICAgICAgICB0aGlzLmNyaXRTaG93VGltZSA9IDA7XG4gICAgfSxcblxuICAgIC8v6KKr5oCq54mp56Kw5Yiw77yM6KKr5pS75Ye75Yiw6YO95o6J6KGAXG4gICAgb25Db2xsaXNpb25FbnRlcjogZnVuY3Rpb24gb25Db2xsaXNpb25FbnRlcihvdGhlciwgc2VsZikge1xuICAgICAgICAvL+WvueeisOaSnuaDheWGtei/m+ihjOWIkuWIhlxuICAgICAgICBpZiAob3RoZXIubm9kZS5ncm91cCA9PT0gJ21vbnN0ZXInKSB7XG4gICAgICAgICAgICAvL+iiq2hlcm/lrZDlvLnlh7vkuK1cbiAgICAgICAgICAgIHZhciBtb25zdGVyRGF0YSA9IG90aGVyLmdldENvbXBvbmVudCgnbW9uc3RlckRhdGEnKTtcblxuICAgICAgICAgICAgLy9oZXJv5o6J6KGAXG4gICAgICAgICAgICB2YXIgaGVyb0NyaXRlZCA9IHBhcnNlSW50KGFsbERhdGEucmFuZG9tTm9ybWFsKCkgKiBtb25zdGVyRGF0YS5kYW1hZ2UpO1xuICAgICAgICAgICAgdGhpcy5oZXJvRGF0YS5jdXJyZW50SHAgLT0gaGVyb0NyaXRlZDtcbiAgICAgICAgICAgIC8vaGVyb+iKgueCueeahOeKtuaAgeaYvuekuuagj+aYvueOsO+8jOS4gOS4quenu+WKqOeahOe6ouiJsuaatOWHu+S8pOWus+WHuueOsOWcqOWktOmhtu+8jOaMgee7rTLnp5JcbiAgICAgICAgICAgIHRoaXMuY3JpdFNob3dUaW1lID0gMjtcbiAgICAgICAgICAgIHZhciBjcml0ID0gY2MuZmluZCgnaGVyb1N0YXRlL2NyaXQnLCB0aGlzLm5vZGUpO1xuICAgICAgICAgICAgY3JpdC5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgICAgY3JpdC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9ICctJyArIGhlcm9Dcml0ZWQ7XG4gICAgICAgICAgICBjcml0LnNldFBvc2l0aW9uKC0yMCwgLTQwKTtcbiAgICAgICAgICAgIGNyaXQucnVuQWN0aW9uKGNjLm1vdmVUbygyLCAtNDAsIC0yMCkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIC8v5pq05Ye75qCH5b+X5pi+546wMuenklxuICAgICAgICB0aGlzLmNyaXRTaG93VGltZSAtPSBkdDtcbiAgICAgICAgaWYgKHRoaXMuY3JpdFNob3dUaW1lIDw9IDApIHtcbiAgICAgICAgICAgIGNjLmZpbmQoJ2hlcm9TdGF0ZS9jcml0JywgdGhpcy5ub2RlKS5vcGFjaXR5ID0gMDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZjgxZTN1eXFKRkVlSU1nczNpSTVHSk8nLCAnaGVyb0NvbnRyb2wnKTtcbi8vIHNjcmlwdHNcXGhlcm9Db250cm9sLmpzXG5cbnZhciBhbGxEYXRhID0gcmVxdWlyZSgnYWxsRGF0YScpOyAvL+W8leeUqOaJgOacieWFrOWFseaVsOaNrlxuLy/mjqfliLZoZXJv6IqC54K55LiL5omA5pyJ5YW25LuW6ISa5pys57uE5Lu25r+A5rS754q25oCB55qE6ISa5pys77yMaGVyb+aOp+WItueahOS4u+iEmuacrFxuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gb25FbmFibGUoKSB7XG4gICAgICAgIC8v57uf5LiA55Sob25FbmFibGXliJ3lp4vljJbvvIzph43mlrDmv4DmtLvml7bmraTlh73mlbDkuZ/kvJrosIPnlKhcbiAgICAgICAgLy/miYDmnIloZXJv6IqC54K55LiL55qE6ISa5pys6YO95byV55SoIGhlcm9EYXRhIOaVsOaNrlxuICAgICAgICB0aGlzLmhlcm9EYXRhID0gdGhpcy5nZXRDb21wb25lbnQoJ2hlcm9EYXRhJyk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7fVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc4N2UyMmVGbnlWR1RMenc1L2pjY25KbycsICdoZXJvRGF0YScpO1xuLy8gc2NyaXB0c1xcaGVyb0RhdGEuanNcblxudmFyIGFsbERhdGEgPSByZXF1aXJlKCdhbGxEYXRhJyk7IC8v5byV55So5omA5pyJ5YWs5YWx5pWw5o2uXG4vL+WkhOeQhmhlcm/nmoTmiYDmnInlsZ7mgKfvvIzmlbDmja7kv6Hmga9cblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIC8v5Li6aGVyb+enu+WKqOW8leeUqGNhbnZhc1xuICAgICAgICBjYW52YXM6IGNjLk5vZGUsXG5cbiAgICAgICAgbW92ZVNwZWVkOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiAnaGVyb+enu+WKqOmAn+W6pidcbiAgICAgICAgfSxcblxuICAgICAgICBjdXJyZW50SHA6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICdoZXJv5b2T5YmN55Sf5ZG95YC8JyxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgbWF4SHA6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICdoZXJv5b2T5YmN55Sf5ZG95LiK6ZmQJyxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgbWF4SHBJbml0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiAnaGVyb+WIneWni+eUn+WRveS4iumZkCdcbiAgICAgICAgfSxcblxuICAgICAgICBocEluY3JlYXNlUmF0aW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICfnrYnnuqfmlbDnu5loZXJv55Sf5ZG95LiK6ZmQ5aKe5Yqg55qE5q+U5L6LJ1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlY292ZXk6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICdoZXJv5q+P56eS5q+P57qn5Zue6KGA5pWwJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vNOenjeaUu+WHu+WxnuaAp++8mjAu54Gr5bGe5oCn77yM5aKe5Yqg5ZCO57ut5Lyk5a6zICAgMS7lhrDlsZ7mgKfvvIzlh7vkuK3lh4/pgJ/kvZznlKhcbiAgICAgICAgLy8gICAgICAgICAgICAyLumjjuWxnuaAp++8jOW+gOWQjuaOqOWKqOS9nOeUqCAgIDMu5Zyw5bGe5oCn77yM5LiA5a6a5qaC546H5Ye75pmVXG4gICAgICAgIGJ1bGxldFByZWZhYjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICAgICAgdG9vbHRpcDogJ2hlcm/mlLvlh7vlvLnpgZPnmoTpooTliLbkvZMnXG4gICAgICAgIH0sXG5cbiAgICAgICAgYXR0YWNrSW50ZXJ2YWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICdoZXJv6L+e57ut5Lik5qyh5pS75Ye75LmL6Ze055qE5pe26Ze06Ze06ZqU77yM6Ze06ZqU6LaK55+t5pS76YCf6LaK5b+rJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGJhbGxpc3RpY1NwZWVkOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiAnaGVyb+aUu+WHu+W8uemBk+mjnuihjOS4gOS4qmNhbnZhc+mrmOW6pueahOaXtumXtO+8jOaXtumXtOi2iuefreW8uemBk+i2iuW/qydcbiAgICAgICAgfSxcblxuICAgICAgICBkYW1hZ2U6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICdoZXJv55qE5pS75Ye75YqbJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGRhbWFnZUluY3JlYXNlUmF0aW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICfnrYnnuqfmlbDnu5loZXJv5pS75Ye75Yqb5aKe5Yqg55qE5q+U5L6LJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyaXRQcm9iOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiAn5Yik5pataGVyb+aYr+WQpuaatOWHu+eahOamgueOhzB+MScsXG4gICAgICAgICAgICByYW5nZTogWzAsIDFdXG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JpdFRpbWVzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiAnaGVyb+eahOaatOWHu+WAjeaVsCdcbiAgICAgICAgfSxcblxuICAgICAgICB2YW1waXJlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiAnaGVyb+aUu+WHu+WQuOihgOavlOS+iydcbiAgICAgICAgfSxcblxuICAgICAgICBraWxsTnVtVG9MZXZlbFVwOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiAnaGVyb+WNh+S4gOe6p+mcgOimgeadgOaAqueahOaVsOebridcbiAgICAgICAgfSxcblxuICAgICAgICBsZXZlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAxLFxuICAgICAgICAgICAgdG9vbHRpcDogJ2hlcm/nmoTnrYnnuqcnXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge31cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0NTViNE5IUzZSQ0NZbnkxREN6T3BmUScsICdoZXJvSHAnKTtcbi8vIHNjcmlwdHNcXGhlcm9IcC5qc1xuXG52YXIgYWxsRGF0YSA9IHJlcXVpcmUoJ2FsbERhdGEnKTsgLy/lvJXnlKjmiYDmnInlhazlhbHmlbDmja5cbi8v5aSE55CGaGVyb+eUn+WRveWAvOeahOWPmOWMllxuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gb25FbmFibGUoKSB7XG4gICAgICAgIC8v57uf5LiA55Sob25FbmFibGXliJ3lp4vljJbvvIzph43mlrDmv4DmtLvml7bmraTlh73mlbDkuZ/kvJrosIPnlKhcbiAgICAgICAgLy/miYDmnIloZXJv6IqC54K55LiL55qE6ISa5pys6YO95byV55SoIGhlcm9EYXRhIOaVsOaNrlxuICAgICAgICB0aGlzLmhlcm9EYXRhID0gdGhpcy5nZXRDb21wb25lbnQoJ2hlcm9EYXRhJyk7XG5cbiAgICAgICAgLy/liJ3lp4vljJZoZXJv6KGA6YeP77yM5pyA5aSn6KGA6YeP6ZqP552A562J57qn5aKe5Yqg6ICM5Y+Y5aSn77yMXG4gICAgICAgIHRoaXMuaGVyb0RhdGEubWF4SHAgPSBNYXRoLmZsb29yKGFsbERhdGEucmFuZG9tTm9ybWFsKCkgKiAodGhpcy5oZXJvRGF0YS5tYXhIcEluaXQgKyB0aGlzLmhlcm9EYXRhLmhwSW5jcmVhc2VSYXRpbyAqIHRoaXMuaGVyb0RhdGEubGV2ZWwpKTtcbiAgICAgICAgdGhpcy5oZXJvRGF0YS5jdXJyZW50SHAgPSB0aGlzLmhlcm9EYXRhLm1heEhwO1xuXG4gICAgICAgIC8vaGVyb+WbnuihgOeahOiuoeaXtuWZqFxuICAgICAgICB0aGlzLmhlcm9SZWNvdmV5VGltZXIgPSAxO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuXG4gICAgICAgIC8vaGVyb+epuuihgOaXtu+8jOa4uOaIj+e7k+adn++8jOmHjeaWsOWKoOi9veWIneWni+WcuuaZr1xuICAgICAgICBpZiAodGhpcy5oZXJvRGF0YS5jdXJyZW50SHAgPD0gMCkge1xuXG4gICAgICAgICAgICBhbGxEYXRhLmtpbGxNb25zdGVyTnVtID0gMDtcbiAgICAgICAgICAgIGFsbERhdGEubW9uc3RlckxldmVsID0gMTtcbiAgICAgICAgICAgIHRoaXMuaGVyb0RhdGEubGV2ZWwgPSAxO1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcEFsbEVmZmVjdHMoKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnR2FtZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9oZXJv5Zue6KGA6K6h5pe2XG4gICAgICAgIHRoaXMuaGVyb1JlY292ZXlUaW1lciAtPSBkdDtcbiAgICAgICAgaWYgKHRoaXMuaGVyb1JlY292ZXlUaW1lciA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmhlcm9EYXRhLmN1cnJlbnRIcCArPSB0aGlzLmhlcm9EYXRhLnJlY292ZXkgKiB0aGlzLmhlcm9EYXRhLmxldmVsO1xuICAgICAgICAgICAgdGhpcy5oZXJvUmVjb3ZleVRpbWVyID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8v5o6n5Yi2Y3VycmVudEhw6IyD5Zu05ZyoWzDvvIxtYXhIcF3kuYvpl7RcbiAgICAgICAgdGhpcy5oZXJvRGF0YS5jdXJyZW50SHAgPSBhbGxEYXRhLmxpbWl0Q3VycmVudEhwKHRoaXMuaGVyb0RhdGEuY3VycmVudEhwLCB0aGlzLmhlcm9EYXRhLm1heEhwKTtcbiAgICAgICAgLy/ooYDmnaHplb/luqbvvIzmlbDlgLzlrp7ml7blj5jljJZcbiAgICAgICAgdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdoZXJvSHAnKS5nZXRDb21wb25lbnQoY2MuUHJvZ3Jlc3NCYXIpLnByb2dyZXNzID0gdGhpcy5oZXJvRGF0YS5jdXJyZW50SHAgLyB0aGlzLmhlcm9EYXRhLm1heEhwO1xuICAgICAgICB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2hlcm9IcCcpLmdldENoaWxkQnlOYW1lKCdocE51bScpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdGhpcy5oZXJvRGF0YS5jdXJyZW50SHAgKyAnLycgKyB0aGlzLmhlcm9EYXRhLm1heEhwO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYTlhNDdjUGVSaE95YlZ6UXNDT01ZQTEnLCAnaGVyb1N0YXRlJyk7XG4vLyBzY3JpcHRzXFxoZXJvU3RhdGUuanNcblxudmFyIGFsbERhdGEgPSByZXF1aXJlKCdhbGxEYXRhJyk7IC8v5byV55So5omA5pyJ5YWs5YWx5pWw5o2uXG4vL+agueaNruS4jeWQjOeahOS6i+S7tuWTjeW6lO+8jOaOp+WItuaJgOacieeKtuaAgeeahOaYvuekuu+8iOaatOWHu++8jOWkp+mHj+WbnuihgO+8jOWQuOihgO+8jOWFieeOr++8jGJ1ZmbnrYnvvIlcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uIG9uRW5hYmxlKCkge1xuICAgICAgICAvL+e7n+S4gOeUqG9uRW5hYmxl5Yid5aeL5YyW77yM6YeN5paw5r+A5rS75pe25q2k5Ye95pWw5Lmf5Lya6LCD55SoXG4gICAgICAgIC8v5omA5pyJaGVyb+iKgueCueS4i+eahOiEmuacrOmDveW8leeUqCBoZXJvRGF0YSDmlbDmja5cbiAgICAgICAgdGhpcy5oZXJvRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50KCdoZXJvRGF0YScpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge31cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMGVkYjJwbWsvTk5hYkpPbGkweW8xNGonLCAnbW9uc3RlckFjdGlvbicpO1xuLy8gc2NyaXB0c1xcbW9uc3RlckFjdGlvbi5qc1xuXG52YXIgYWxsRGF0YSA9IHJlcXVpcmUoJ2FsbERhdGEnKTsgLy/lvJXnlKjmiYDmnInlhazlhbHmlbDmja5cbi8v5o6n5Yi25bCP5oCq54mp6KGM5Yqo55qE6ISa5pysXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmFjdGlvbiA9IDA7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiBvbkVuYWJsZSgpIHtcbiAgICAgICAgLy/nu5/kuIDnlKhvbkVuYWJsZeWIneWni+WMlu+8jOmHjeaWsOa/gOa0u+aXtuatpOWHveaVsOS5n+S8muiwg+eUqFxuICAgICAgICAvL+aJgOacieWwj+aAqueJqeiKgueCueS4i+eahOiEmuacrOmDveW8leeUqCBtb25zdGVyRGF0YSDmlbDmja5cbiAgICAgICAgdGhpcy5tb25zdGVyRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50KCdtb25zdGVyRGF0YScpO1xuXG4gICAgICAgIHRoaXMuYWN0aW9uKys7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdhY3Rpb27mrKHmlbDvvJonICsgdGhpcy5hY3Rpb24pO1xuXG4gICAgICAgIC8v6K6h5pe25Zmo5o6n5Yi25oCq54mp55qE6KGM5Yqo77yM5LiA5a6a5pe26Ze05pS55Y+Y5LiA5qyh6KGM5Yqo54q25oCB77yM6ZqP552A5oCq54mp55qE562J57qn5Y2H6auY77yM5Lya5oWi5oWi5byA5ZCv5pu06auY57qn55qE56e75Yqo5pa55byPXG4gICAgICAgIHRoaXMubW9uc3RlckFjdGlvbkNhbGxCYWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8v5qC55o2u5oCq54mp562J57qn5Yaz5a6a6KGM5Yqo54q25oCB6IyD5Zu0XG4gICAgICAgICAgICB2YXIgYWN0aW9uUmFuZ2UgPSBhbGxEYXRhLm1vbnN0ZXJMZXZlbCA+PSA2ID8gNiA6IGFsbERhdGEubW9uc3RlckxldmVsO1xuICAgICAgICAgICAgdGhpcy5tb25zdGVyQWN0aW9uKGNjLnJhbmRvbTBUbzEoKSAqIGFjdGlvblJhbmdlLCB0aGlzLm1vbnN0ZXJEYXRhLmFjdGlvbkNoYW5nZUludGVydmFsKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLm1vbnN0ZXJBY3Rpb25DYWxsQmFjaywgdGhpcy5tb25zdGVyRGF0YS5hY3Rpb25DaGFuZ2VJbnRlcnZhbCk7XG4gICAgfSxcblxuICAgIG1vbnN0ZXJBY3Rpb246IGZ1bmN0aW9uIG1vbnN0ZXJBY3Rpb24ociwgdGltZSkge1xuICAgICAgICAvKlxyXG4gICAgICAgIOaAqueJqeenu+WKqOacieS4i+mdojXnp43mlrnlvI/vvJpcclxuICAgICAgICDliJ3lp4vmgKrnianlj6rmnInmma7pgJrnp7vliqjvvIzpmo/nnYDmgKrniannmoTnrYnnuqfljYfpq5jvvIzkvJrmhaLmhaLlvIDlkK/mm7Tpq5jnuqfnmoTnp7vliqjmlrnlvI/vvIzlubbluKbmnInpop3lpJbmlYjmnpxcclxuICAgICAgICAqL1xuICAgICAgICAvLzEu5pmu6YCa56e75Yqo77yM6ZqP5py655u057q/56e75Yqo5Yiw5LiA5Liq5Zyw54K5XG4gICAgICAgIHZhciBtb3ZlQnkgPSBjYy5tb3ZlQnkodGltZSwgY2MucmFuZG9tTWludXMxVG8xKCkgKiB0aGlzLm5vZGUucGFyZW50LndpZHRoLCBjYy5yYW5kb21NaW51czFUbzEoKSAqIHRoaXMubm9kZS5wYXJlbnQuaGVpZ2h0KTtcbiAgICAgICAgLy8yLuS7pei0neWhnuWwlOabsue6v+enu+WKqOWIsOmaj+acuueahDTkuKrngrkgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICB2YXIgYmV6aWVyID0gW2NjLnAoY2MucmFuZG9tTWludXMxVG8xKCkgKiB0aGlzLm5vZGUucGFyZW50LndpZHRoLCBjYy5yYW5kb21NaW51czFUbzEoKSAqIHRoaXMubm9kZS5wYXJlbnQuaGVpZ2h0KSwgY2MucChjYy5yYW5kb21NaW51czFUbzEoKSAqIHRoaXMubm9kZS5wYXJlbnQud2lkdGgsIGNjLnJhbmRvbU1pbnVzMVRvMSgpICogdGhpcy5ub2RlLnBhcmVudC5oZWlnaHQpLCBjYy5wKGNjLnJhbmRvbU1pbnVzMVRvMSgpICogdGhpcy5ub2RlLnBhcmVudC53aWR0aCwgY2MucmFuZG9tTWludXMxVG8xKCkgKiB0aGlzLm5vZGUucGFyZW50LmhlaWdodCksIGNjLnAoY2MucmFuZG9tTWludXMxVG8xKCkgKiB0aGlzLm5vZGUucGFyZW50LndpZHRoLCBjYy5yYW5kb21NaW51czFUbzEoKSAqIHRoaXMubm9kZS5wYXJlbnQuaGVpZ2h0KV07XG4gICAgICAgIHZhciBiZXppZXJCeSA9IGNjLmJlemllckJ5KHRpbWUsIGJlemllcik7XG4gICAgICAgIC8vMy7ot7Pot4Pnp7vliqjvvIzot7PliLDkuIDkuKrpmo/mnLrlnLDngrnvvIzpq5jluqbot59tb25zdGVy6IqC54K56auY5bqm55u45YWz77yM6Lez6LeD5qyh5pWw5Li65oCq54mp5b2T5YmN562J57qn77yM77yI6Lez6LeD5pyf6Ze05Zue6KGA77yB5Zue6KGA5pWI5p6c6Lef5oCq54mp5b2T5YmN562J57qn55u45YWz77yJXG4gICAgICAgIHZhciBqdW1wQnkgPSBjYy5qdW1wQnkodGltZSwgY2MucmFuZG9tTWludXMxVG8xKCkgKiB0aGlzLm5vZGUucGFyZW50LndpZHRoLCBjYy5yYW5kb21NaW51czFUbzEoKSAqIHRoaXMubm9kZS5wYXJlbnQuaGVpZ2h0LCBhbGxEYXRhLnJhbmRvbSgyLCAzKSAqIHRoaXMubm9kZS5oZWlnaHQsIGFsbERhdGEubW9uc3RlckxldmVsKTtcbiAgICAgICAgLy80LuS4gOWumuaXtumXtOS5i+WGhemXqueDge+8jOmXqueDgeasoeaVsOi3n+aAqueJqeW9k+WJjeetiee6p+ebuOWFs++8jO+8iOmXqueDgeacn+mXtOmXqumBv+aUu+WHu++8ge+8iSBcbiAgICAgICAgdmFyIGJsaW5rID0gY2MuYmxpbmsodGltZSwgYWxsRGF0YS5tb25zdGVyTGV2ZWwgKiAyKTtcbiAgICAgICAgLy81LuS4gOWumuaXtumXtOS5i+WGheaXi+i9rO+8jOaXi+i9rOinkuW6pui3n+aAqueJqeW9k+WJjeetiee6p+ebuOWFs++8iOaXi+i9rOacn+mXtOWPjeW8ueaUu+WHu++8ge+8iVxuICAgICAgICB2YXIgcm90YXRlQnkgPSBjYy5yb3RhdGVCeSh0aW1lLCAxODAgKiBhbGxEYXRhLm1vbnN0ZXJMZXZlbCk7XG5cbiAgICAgICAgLy/moLnmja7pmo/mnLrnmoTmlbDlrZflhrPlrprmgKrniannmoTnp7vliqjmlrnlvI/vvIzlubbmoIforrDmgKrnianlvZPliY3ooYzliqjnirbmgIFcbiAgICAgICAgaWYgKHIgPD0gMSkge1xuICAgICAgICAgICAgLy8xLuaZrumAmuenu+WKqFxuICAgICAgICAgICAgdGhpcy5tb25zdGVyRGF0YS5hY3Rpb25TdGF0dXMgPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5ydW5BY3Rpb24obW92ZUJ5KTtcbiAgICAgICAgfSBlbHNlIGlmIChyIDw9IDIpIHtcbiAgICAgICAgICAgIC8vMi7otJ3loZ7lsJTmm7Lnur/np7vliqhcbiAgICAgICAgICAgIHRoaXMubW9uc3RlckRhdGEuYWN0aW9uU3RhdHVzID0gMjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGUucnVuQWN0aW9uKGJlemllckJ5KTtcbiAgICAgICAgfSBlbHNlIGlmIChyIDw9IDMpIHtcbiAgICAgICAgICAgIC8vMy7ot7Pot4Pnp7vliqhcbiAgICAgICAgICAgIHRoaXMubW9uc3RlckRhdGEuYWN0aW9uU3RhdHVzID0gMztcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGUucnVuQWN0aW9uKGp1bXBCeSk7XG4gICAgICAgIH0gZWxzZSBpZiAociA8PSA0KSB7XG4gICAgICAgICAgICAvLzQu6Zeq54OBXG4gICAgICAgICAgICB0aGlzLm1vbnN0ZXJEYXRhLmFjdGlvblN0YXR1cyA9IDQ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdtb25zdGVyQm9keScpLnJ1bkFjdGlvbihibGluayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLzUu5peL6L2sXG4gICAgICAgICAgICB0aGlzLm1vbnN0ZXJEYXRhLmFjdGlvblN0YXR1cyA9IDU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdtb25zdGVyQm9keScpLnJ1bkFjdGlvbihyb3RhdGVCeSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgLy/mgKrniak057qn5Lul5YmN5LiN6IO956m/5aKZLCjmnYDliLAzMOaAqueahOaXtuWAmeWwseWPr+S7peepv+WimeS6hilcbiAgICAgICAgaWYgKGFsbERhdGEubW9uc3RlckxldmVsIDwgNCkge1xuICAgICAgICAgICAgYWxsRGF0YS51blRocm91Z2hXYWxscyh0aGlzLm5vZGUsIHRoaXMubm9kZS5wYXJlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxsRGF0YS50aHJvdWdoV2FsbHModGhpcy5ub2RlLCB0aGlzLm5vZGUucGFyZW50KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uIG9uRGlzYWJsZSgpIHt9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTA3MmNaV3l2aElaS0lYQ2F5NlBjdEEnLCAnbW9uc3RlckNvbGxpc2lvbicpO1xuLy8gc2NyaXB0c1xcbW9uc3RlckNvbGxpc2lvbi5qc1xuXG52YXIgYWxsRGF0YSA9IHJlcXVpcmUoJ2FsbERhdGEnKTsgLy/lvJXnlKjmiYDmnInlhazlhbHmlbDmja5cbi8v5aSE55CG56Kw5pKeLOWPiueisOaSnuS5i+WQjuaJgOacieS/oeaBr1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5Db2xsaXNpb24gPSAwO1xuICAgICAgICB0aGlzLmhwU2hvd1RpbWUgPSAwO1xuICAgICAgICB0aGlzLmNyaXRTaG93VGltZSA9IDA7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiBvbkVuYWJsZSgpIHtcbiAgICAgICAgLy/nu5/kuIDnlKhvbkVuYWJsZeWIneWni+WMlu+8jOmHjeaWsOa/gOa0u+aXtuatpOWHveaVsOS5n+S8muiwg+eUqFxuICAgICAgICAvL+aJgOacieWwj+aAqueJqeiKgueCueS4i+eahOiEmuacrOmDveW8leeUqCBtb25zdGVyRGF0YSDmlbDmja5cbiAgICAgICAgdGhpcy5tb25zdGVyRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50KCdtb25zdGVyRGF0YScpO1xuICAgIH0sXG5cbiAgICAvL+WkhOeQhuWFtuS7luiKgueCuei3n+acrOiKgueCueeahOeisOaSnlxuICAgIG9uQ29sbGlzaW9uRW50ZXI6IGZ1bmN0aW9uIG9uQ29sbGlzaW9uRW50ZXIob3RoZXIsIHNlbGYpIHtcbiAgICAgICAgLy/lr7nnorDmkp7mg4XlhrXov5vooYzliJLliIZcbiAgICAgICAgaWYgKG90aGVyLm5vZGUuZ3JvdXAgPT09ICdoZXJvQmFsbGlzdGljJykge1xuICAgICAgICAgICAgLy/ooqtoZXJv5a2Q5by55Ye75LitXG4gICAgICAgICAgICB2YXIgaGVyb0JhbGxpc3RpY0RhdGEgPSBvdGhlci5nZXRDb21wb25lbnQoJ2hlcm9CYWxsaXN0aWNEYXRhJyk7XG4gICAgICAgICAgICAvL+ihgOadoeaYvueOsDLnp5JcbiAgICAgICAgICAgIGNjLmZpbmQoJ21vbnN0ZXJIcCcsIHRoaXMubm9kZSkub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgIHRoaXMuaHBTaG93VGltZSA9IDI7XG5cbiAgICAgICAgICAgIC8v5Yik5pat5piv5ZCm5pq05Ye7XG4gICAgICAgICAgICBpZiAoY2MucmFuZG9tMFRvMSgpIDw9IGhlcm9CYWxsaXN0aWNEYXRhLmNyaXRQcm9iKSB7XG4gICAgICAgICAgICAgICAgLy9tb25zdGVy5pq05Ye75o6J6KGAXG4gICAgICAgICAgICAgICAgdmFyIG1vbnN0ZXJDcml0ZWQgPSBwYXJzZUludChhbGxEYXRhLnJhbmRvbU5vcm1hbCgpICogaGVyb0JhbGxpc3RpY0RhdGEuZGFtYWdlICogaGVyb0JhbGxpc3RpY0RhdGEuY3JpdFRpbWVzKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnN0ZXJEYXRhLmN1cnJlbnRIcCAtPSBtb25zdGVyQ3JpdGVkO1xuICAgICAgICAgICAgICAgIC8vbW9uc3RlcuiKgueCueeahOeKtuaAgeaYvuekuuagj+aYvueOsO+8jOS4gOS4quenu+WKqOeahOe6ouiJsuaatOWHu+S8pOWus+WHuueOsOWcqOWktOmhtu+8jOaMgee7rTLnp5JcbiAgICAgICAgICAgICAgICB0aGlzLmNyaXRTaG93VGltZSA9IDI7XG4gICAgICAgICAgICAgICAgdmFyIGNyaXQgPSBjYy5maW5kKCdtb25zdGVyU3RhdGUvY3JpdCcsIHRoaXMubm9kZSk7XG4gICAgICAgICAgICAgICAgY3JpdC5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgICAgICAgIGNyaXQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSAnLScgKyBtb25zdGVyQ3JpdGVkO1xuICAgICAgICAgICAgICAgIGNyaXQuc2V0UG9zaXRpb24oLTIwLCAtNDApO1xuICAgICAgICAgICAgICAgIGNyaXQucnVuQWN0aW9uKGNjLm1vdmVUbygyLCAtNDAsIC0yMCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL21vbnN0ZXLmma7pgJrmjonooYBcbiAgICAgICAgICAgICAgICB2YXIgbW9uc3RlckRhbWFnZWQgPSBwYXJzZUludChhbGxEYXRhLnJhbmRvbU5vcm1hbCgpICogaGVyb0JhbGxpc3RpY0RhdGEuZGFtYWdlKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnN0ZXJEYXRhLmN1cnJlbnRIcCAtPSBtb25zdGVyRGFtYWdlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICAvL+ihgOadoeaYvueOsDLnp5JcbiAgICAgICAgdGhpcy5ocFNob3dUaW1lIC09IGR0O1xuICAgICAgICBpZiAodGhpcy5ocFNob3dUaW1lIDw9IDApIHtcbiAgICAgICAgICAgIGNjLmZpbmQoJ21vbnN0ZXJIcCcsIHRoaXMubm9kZSkub3BhY2l0eSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy/mmrTlh7vmoIflv5fmmL7njrAy56eSXG4gICAgICAgIHRoaXMuY3JpdFNob3dUaW1lIC09IGR0O1xuICAgICAgICBpZiAodGhpcy5jcml0U2hvd1RpbWUgPD0gMCkge1xuICAgICAgICAgICAgY2MuZmluZCgnbW9uc3RlclN0YXRlL2NyaXQnLCB0aGlzLm5vZGUpLm9wYWNpdHkgPSAwO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjOWJiNGlkaE5CTG1vSzZ6aVJUS0o2TycsICdtb25zdGVyQ29udHJvbCcpO1xuLy8gc2NyaXB0c1xcbW9uc3RlckNvbnRyb2wuanNcblxudmFyIGFsbERhdGEgPSByZXF1aXJlKCdhbGxEYXRhJyk7IC8v5byV55So5omA5pyJ5YWs5YWx5pWw5o2uXG4vL+aOp+WItuWwj+aAqueJqW1vbnN0ZXLoioLngrnkuIvpnaLmiYDmnInohJrmnKznu4Tku7bnmoTmv4DmtLvnirbmgIHvvIzlsI/mgKrnianmjqfliLbnmoTkuLvohJrmnKxcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiBvbkVuYWJsZSgpIHtcbiAgICAgICAgLy/nu5/kuIDnlKhvbkVuYWJsZeWIneWni+WMlu+8jOmHjeaWsOa/gOa0u+aXtuatpOWHveaVsOS5n+S8muiwg+eUqFxuICAgICAgICAvL+aJgOacieWwj+aAqueJqeiKgueCueS4i+eahOiEmuacrOmDveW8leeUqCBtb25zdGVyRGF0YSDmlbDmja5cbiAgICAgICAgdGhpcy5tb25zdGVyRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50KCdtb25zdGVyRGF0YScpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge31cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZDEwZWEwWEM3UkpkcUc3T1ROeXIvd0snLCAnbW9uc3RlckRhdGEnKTtcbi8vIHNjcmlwdHNcXG1vbnN0ZXJEYXRhLmpzXG5cbnZhciBhbGxEYXRhID0gcmVxdWlyZSgnYWxsRGF0YScpOyAvL+W8leeUqOaJgOacieWFrOWFseaVsOaNrlxuLy/lrZjmlL7lsI/mgKrniannmoTmlbDmja7vvIzmr4/kuKrlsI/mgKrnianoioLngrnlj6rog73lr7noh6rlt7HnmoTmlbDmja7ov5vooYzor7vlhplcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBjdXJyZW50SHA6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICfmgKrnianlvZPliY3nlJ/lkb3lgLwnLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBtYXhIcDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogJ+aAqueJqeeahOW9k+WJjeeUn+WRveS4iumZkCcsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIG1heEhwSW5pdDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogJ+aAqueJqeeahOWIneWni+eUn+WRveS4iumZkCdcbiAgICAgICAgfSxcblxuICAgICAgICBhY3Rpb25TdGF0dXM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICfmgKrnianlvZPliY3nmoTooYzliqjnirbmgIEnLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBhY3Rpb25DaGFuZ2VJbnRlcnZhbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogJ+aAqueJqeaUueWPmOihjOWKqOeKtuaAgeeahOaXtumXtOmXtOmalCdcbiAgICAgICAgfSxcblxuICAgICAgICBocEluY3JlYXNlUmF0aW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICfmrbvkuqHmgKrnianmlbDnu5nlkI7pnaLmgKrniannlJ/lkb3lop7liqDnmoTmr5TkvosnXG4gICAgICAgIH0sXG5cbiAgICAgICAgZGFtYWdlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiAn5oCq54mp55qE5pS75Ye75YqbJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGRhbWFnZUluY3JlYXNlUmF0aW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6ICfmrbvkuqEx5Liq5oCq54mp57uZ5ZCO6Z2i5oCq54mp5pS75Ye75aKe5Yqg55qE5q+U5L6LJ1xuICAgICAgICB9XG5cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzFkMmU1NHF4YXRDN1psdDNsL0JWamtVJywgJ21vbnN0ZXJIcCcpO1xuLy8gc2NyaXB0c1xcbW9uc3RlckhwLmpzXG5cbnZhciBhbGxEYXRhID0gcmVxdWlyZSgnYWxsRGF0YScpOyAvL+W8leeUqOaJgOacieWFrOWFseaVsOaNrlxuLy/mjqfliLblsI/mgKrnianooYDmnaHnmoTohJrmnKxcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uIG9uRW5hYmxlKCkge1xuICAgICAgICAvL+e7n+S4gOeUqG9uRW5hYmxl5Yid5aeL5YyW77yM6YeN5paw5r+A5rS75pe25q2k5Ye95pWw5Lmf5Lya6LCD55SoXG4gICAgICAgIC8v5omA5pyJ5bCP5oCq54mp6IqC54K55LiL55qE6ISa5pys6YO95byV55SoIG1vbnN0ZXJEYXRhIOaVsOaNrlxuICAgICAgICB0aGlzLm1vbnN0ZXJEYXRhID0gdGhpcy5nZXRDb21wb25lbnQoJ21vbnN0ZXJEYXRhJyk7XG5cbiAgICAgICAgLy/liJ3lp4vljJbvvJrmgKrnianmnIDlpKfooYDph4/pmo/mnLrvvIzmnIDlpKfooYDph4/pmo/nnYDooqvmnYDnmoTmgKrnianmlbDlop7liqDogIzlj5jlpKcs5q275LiA5Liq5oCq5YqgdGhpcy5tb25zdGVyRGF0YS5ocEluY3JlYXNlUmF0aW/nlJ/lkb3kuIrpmZBcblxuICAgICAgICB0aGlzLm1vbnN0ZXJEYXRhLm1heEhwID0gTWF0aC5mbG9vcihhbGxEYXRhLnJhbmRvbU5vcm1hbCgpICogKHRoaXMubW9uc3RlckRhdGEubWF4SHBJbml0ICsgdGhpcy5tb25zdGVyRGF0YS5ocEluY3JlYXNlUmF0aW8gKiBhbGxEYXRhLmtpbGxNb25zdGVyTnVtKSk7XG4gICAgICAgIHRoaXMubW9uc3RlckRhdGEuY3VycmVudEhwID0gdGhpcy5tb25zdGVyRGF0YS5tYXhIcDtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgLy/mjqfliLZjdXJyZW50SHDojIPlm7TlnKhbMO+8jG1heEhwXeS5i+mXtFxuICAgICAgICB0aGlzLm1vbnN0ZXJEYXRhLmN1cnJlbnRIcCA9IGFsbERhdGEubGltaXRDdXJyZW50SHAodGhpcy5tb25zdGVyRGF0YS5jdXJyZW50SHAsIHRoaXMubW9uc3RlckRhdGEubWF4SHApO1xuICAgICAgICAvL+ihgOadoemVv+W6pu+8jOaVsOWAvOWunuaXtuWPmOWMllxuICAgICAgICB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ21vbnN0ZXJIcCcpLmdldENvbXBvbmVudChjYy5Qcm9ncmVzc0JhcikucHJvZ3Jlc3MgPSB0aGlzLm1vbnN0ZXJEYXRhLmN1cnJlbnRIcCAvIHRoaXMubW9uc3RlckRhdGEubWF4SHA7XG4gICAgICAgIHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnbW9uc3RlckhwJykuZ2V0Q2hpbGRCeU5hbWUoJ2hwTnVtJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB0aGlzLm1vbnN0ZXJEYXRhLmN1cnJlbnRIcCArICcvJyArIHRoaXMubW9uc3RlckRhdGEubWF4SHA7XG4gICAgICAgIC8v5oCq54mp56m66KGA5bCx6ZSA5q+B5Zue5pS26IqC54K5LOadgOatu+aAqueJqeaVsCsx77yM5ZCM5q2l5pu05paw5oCq54mp562J57qnXG4gICAgICAgIGlmICh0aGlzLm1vbnN0ZXJEYXRhLmN1cnJlbnRIcCA8PSAwKSB7XG4gICAgICAgICAgICAvL+WQkeS4iuWPkeWwhOaAqueJqeiiq+adgOS6i+S7tlxuICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdtb25zdGVyS2lsbGVkJywgdHJ1ZSkpO1xuXG4gICAgICAgICAgICAvL+WwhuatpG1vbnN0ZXLoioLngrnmiYDmnInmlbDmja7lkozohJrmnKznirbmgIHliJ3lp4vljJblubblm57mlLZcbiAgICAgICAgICAgIGNjLmZpbmQoJ21vbnN0ZXJTdGF0ZS9zdGF0ZScsIHRoaXMubm9kZSkub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICBjYy5maW5kKCdtb25zdGVyU3RhdGUvY3JpdCcsIHRoaXMubm9kZSkub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICBjYy5maW5kKCdtb25zdGVyU3RhdGUvcmVjb3ZleScsIHRoaXMubm9kZSkub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudCgnbW9uc3RlckFjdGlvbicpLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudC5nZXRDb21wb25lbnQoJ2dhbWVDcmVhdGVNb25zdGVyJykubW9uc3RlclBvb2wucHV0KHRoaXMubm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzJjMzc5TVk3Y1pITEp4Z0tCRDNKblAvJywgJ21vbnN0ZXJTdGF0ZScpO1xuLy8gc2NyaXB0c1xcbW9uc3RlclN0YXRlLmpzXG5cbnZhciBhbGxEYXRhID0gcmVxdWlyZSgnYWxsRGF0YScpOyAvL+W8leeUqOaJgOacieWFrOWFseaVsOaNrlxuLy/moLnmja7kuI3lkIznmoTkuovku7blk43lupTvvIzmjqfliLbmiYDmnInnirbmgIHnmoTmmL7npLrvvIjmmrTlh7vvvIzlpKfph4/lm57ooYDvvIzlkLjooYDvvIzlhYnnjq/vvIxidWZm562J77yJXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gb25FbmFibGUoKSB7XG4gICAgICAgIC8v57uf5LiA55Sob25FbmFibGXliJ3lp4vljJbvvIzph43mlrDmv4DmtLvml7bmraTlh73mlbDkuZ/kvJrosIPnlKhcbiAgICAgICAgLy/miYDmnInlsI/mgKrnianoioLngrnkuIvnmoTohJrmnKzpg73lvJXnlKggbW9uc3RlckRhdGEg5pWw5o2uXG4gICAgICAgIHRoaXMubW9uc3RlckRhdGEgPSB0aGlzLmdldENvbXBvbmVudCgnbW9uc3RlckRhdGEnKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHt9XG59KTtcblxuY2MuX1JGcG9wKCk7Il19
