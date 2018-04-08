//存放所有游戏通用数据和函数，每个脚本都可以对这里的数据进行读写

var allData = {
    //hero已经杀死的monster数目
    killMonsterNum: 0,
    //怪物等级，每杀死10个升一级,初始1级   
    monsterLevel: 1,

    //限制穿墙函数，selfNode到了wallsNode的边缘会被限制在边缘
    unThroughWalls: function(selfNode, wallsNode){

        if((selfNode.x + selfNode.width/2) > wallsNode.width/2){//限右
            selfNode.x = wallsNode.width/2 - selfNode.width/2;
        } 
        if((selfNode.x - selfNode.width/2) < -wallsNode.width/2){//限左
            selfNode.x = -(wallsNode.width/2 - selfNode.width/2);
        }
        if((selfNode.y + selfNode.height/2) > wallsNode.height/2){//限上
            selfNode.y = wallsNode.height/2 - selfNode.height/2;
        } 
        if((selfNode.y - selfNode.height/2) < -wallsNode.height/2){//限上
            selfNode.y = -(wallsNode.height/2 - selfNode.height/2);
        }
    },

    //穿墙函数，selfNode到了wallsNode的边缘会穿到对边
    throughWalls: function(selfNode, wallsNode){

        if((selfNode.x + selfNode.width/2) > wallsNode.width/2){//从右穿
            selfNode.x = -(wallsNode.width/2 - selfNode.width/2);
        } 
        if((selfNode.x - selfNode.width/2) < -wallsNode.width/2){//从左穿
            selfNode.x = wallsNode.width/2 - selfNode.width/2;
        }
        if((selfNode.y + selfNode.height/2) > wallsNode.height/2){//从上穿
            selfNode.y = -(wallsNode.height/2 - selfNode.height/2);
        } 
        if((selfNode.y - selfNode.height/2) < -wallsNode.height/2){//从下穿
            selfNode.y = wallsNode.height/2 - selfNode.height/2;
        }
    },

    //限制currentHp范围在[0，maxHp]之间，返回currentHp的值
    limitCurrentHp: function(currentHp, maxHp){
        if(currentHp <= 0){
            currentHp = 0;
        }
        if(currentHp >= maxHp){
            currentHp = maxHp;
        }
        return currentHp;
    },

    //随机一个范围 min~max 的小数
    random: function(min, max){
        var ratio = cc.random0To1();
        return min + (max - min) * ratio;
    },

    //弱化随机，随机0.4~0.8的小数
    randomWeak: function(){
        return this.random(0.4, 0.8);
    },

    //正常随机：随机一个范围 0.8~1.2 的小数
    randomNormal: function(){
        return this.random(0.8, 1.2);
    },
    
    //增强随机，随机1.2~1.6的小数
    randomStrengthen: function(){
        return this.random(1.2, 1.6);
    },

    //随机一个范围 min~max 的整数
    randomInt: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    //随机怪物模型   最大随机图片范围，相对resources的文件路径，目标节点 
    randomModel: function(maxRange, url, targetNode){
        var num = this.randomInt(1, maxRange);
        cc.loader.loadRes(url.toString() + '/' + num.toString(), cc.SpriteFrame, function (err, spriteFrame) {
        targetNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },


    

};

module.exports = allData;

