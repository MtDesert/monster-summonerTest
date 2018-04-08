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