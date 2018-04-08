var allData = require('allData');//引用所有公共数据
//存放小怪物的数据，每个小怪物节点只能对自己的数据进行读写

cc.Class({
    extends: cc.Component,

    properties: {

        monsterPrefab:{
            default:null,
            type:cc.Prefab,
            tooltip: '怪物模型的预制体',
        },  
        
        normalRate: {
            default: 0,
            tooltip: '正常产生一个小怪的间隔时间',
        },

        extraTime: {
            default: 0,
            tooltip: '判断是否额外产生一个小怪的间隔时间',
        },

        extraProb: {
            default: 0,
            tooltip: '判断是否额外产生一个小怪的概率0~1',
            range: [0,1],
        },

        extraInterval: {
            default: 0,
            tooltip: '额外产生一个小怪的间隔时间',
        }, 
        
        extraRepeat: {
            default: 0,
            tooltip: '额外产生小怪的个数int',
            type: cc.Integer,
        },

        bgmusic: {
            default: null,
            url: cc.AudioClip,
            tooltip: '游戏初始的背景音乐',
        },

        heroLevelUp: {
            default: null,
            url: cc.AudioClip,
            tooltip: 'hero升级时候的音乐',
        },
    },
});
