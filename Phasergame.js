function script2() {
    var game = new Phaser.Game(480, 320, Phaser.AUTO, 'game2', { preload: preload, create: create, update: update });

    //定义小球、砖块等游戏画面上的元素
    var ball;
    var paddle; //玩家控制的板子
    var bricks; //砖块
    var newBrick;
    var brickInfo;
    var scoreText; //分数信息
    var score = 0;
    var lives = 3;  //初始化分数和生命值计数器
    var livesText;      //生命值信息
    var lifeLostText;   //失去生命时的文本
    var playing = false;    //控制游玩状态
    var startButton;    //控制按钮状态 防止重复启动游戏


    //预加载 对所有图片、音效以及动画进行预加载
    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;//缩放模式为 SHOW_ALL
        game.scale.pageAlignHorizontally = true;//游戏画面将水平居中对齐到浏览器窗口中。
        game.scale.pageAlignVertically = true;//游戏画面将垂直居中对齐到浏览器窗口中。


        game.load.audio('water', 'audios/water.mp3')//音效——小球消除砖块
        game.load.audio('start', 'audios/start.mp3')//音效——游戏开始
        game.load.audio('win', 'audios/win.mp3')//音效——游戏胜利
        game.load.audio('lose', 'audios/lose.mp3')//音效——游戏失败
        game.load.image('background', 'images/blockgame_bg.png'); //图片——背景图片加载

        game.load.image('paddle', 'images/paddle.png');//图片——板子
        game.load.image('brick', 'images/brick.png');//图片——砖块
        game.load.image('winner', 'images/win.jpg');//图片——胜利结算
        game.load.image('loser', 'images/lose.jpg');//图片——失败结算
        game.load.spritesheet('ball', 'images/wobble.png', 20, 20);//动画——小球撞击摆动，后面的数字是精灵帧的宽和高
        game.load.spritesheet('button', 'images/button.png', 120, 40);//动画——开始按钮的浮动

    }


    function create() {
        const background = game.add.sprite(0, 0, 'background');//设置背景精灵
        background.width = game.world.width;  // 设置宽度为游戏世界宽度
        background.height = game.world.height; // 设置高度为游戏世界高度

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.checkCollision.down = false;//启用物理系统不允许小球往底部碰撞，若碰撞判定为出界

        ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball');
        // 创建小球精灵，位置为游戏世界宽度的 50% 和高度的 25，使用纹理 'ball'

        ball.animations.add('wobble', [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
        // 为小球添加动画 'wobble'，动画帧为 [0, 1, 0, 2, 0, 1, 0, 2, 0]，帧率为 24

        ball.anchor.set(0.5);// 设置小球的锚点为 (0.5, 0.5)，使其在旋转或移动时以中心为基点

        game.physics.enable(ball, Phaser.Physics.ARCADE);// 启用小球的物理属性
        ball.body.collideWorldBounds = true;// 使小球在游戏世界边界内碰撞
        ball.body.bounce.set(1);// 设置小球碰撞后的反弹程度为 1
        ball.checkWorldBounds = true;// 使小球在超出游戏世界边界时触发相关事件
        ball.events.onOutOfBounds.add(ballLeaveScreen, this);//当小球超出边界时调用 ballLeaveScreen 函数

        paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
        // 创建挡板精灵，位置为游戏世界宽度的 50% 和高度的 5，使用纹理 'paddle'

        paddle.anchor.set(0.5, 1); // 设置挡板的锚点为 (0.5, 1)，使其在旋转或移动时以底部中心为基点
        game.physics.enable(paddle, Phaser.Physics.ARCADE);// 启用挡板的物理属性
        paddle.body.immovable = true; // 设置挡板为不可移动，其他物体可以与之碰撞但不会推动它

        initBricks();// 初始化砖块

        textStyle = { font: '18px Arial', fill: '#0095DD' };// 设置文本样式
        scoreText = game.add.text(5, 5, 'Points: 0', textStyle);// 创建显示分数的文本，初始值为 'Points: 0'
        livesText = game.add.text(game.world.width - 5, 5, 'Lives: ' + lives, textStyle);   // 创建显示生命值的文本            
        livesText.anchor.set(1, 0); // 设置生命值文本的锚点为 (1, 0)，使其右对齐
        lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, '失去一次生命，点击继续', textStyle);
        // 创建显示生命丢失信息的文本，初始为 '失去一次生命，点击继续'

        lifeLostText.anchor.set(0.5);// 设置丢失生命文本的锚点为 (0.5)，使其居中
        lifeLostText.visible = false; // 将丢失生命文本设置为不可见

        startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
        // 创建开始按钮，位置为游戏世界宽度和高度的 50%，使用纹理 'button'

        startButton.anchor.set(0.5);  // 设置开始按钮的锚点为 (0.5)，使其居中
    }

    //更新函数更新动画每一帧
    function update() {

        game.physics.arcade.collide(ball, paddle, ballHitPaddle);// 检测小球与挡板之间的碰撞
        game.physics.arcade.collide(ball, bricks, ballHitBrick);// 检测小球与砖块之间的碰撞
        if (playing) {
            paddle.x = game.input.x || game.world.width * 0.5;
        }
        // 如果游戏正在进行中，则更新挡板的位置，使其跟随鼠标的 x 坐标

    }

    function initBricks() {
        brickInfo = {
            width: 50,
            height: 20,//砖块的大小
            count: {
                row: 7,
                col: 3//几行几列
            },
            offset: {
                top: 50,
                left: 60//初始化位置
            },
            padding: 10//砖块之间的间距
        }
        bricks = game.add.group();
        for (c = 0; c < brickInfo.count.col; c++) {
            for (r = 0; r < brickInfo.count.row; r++) {
                var brickX = (r * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
                var brickY = (c * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
                newBrick = game.add.sprite(brickX, brickY, 'brick');
                game.physics.enable(newBrick, Phaser.Physics.ARCADE);
                newBrick.body.immovable = true;
                newBrick.anchor.set(0.5);
                bricks.add(newBrick);
            }//生成砖块并添加到bricks中
        }
    }


    function ballHitBrick(ball, brick) {
        playaudio(1)//播放小球消除砖块音效
        var killTween = game.add.tween(brick.scale);// 创建一个 tween 动画，作用于砖块的缩放动画
        killTween.to({ x: 0, y: 0 }, 200, Phaser.Easing.Linear.None);
        // 设置 tween 动画的目标值为 (0, 0)，持续时间为 200 毫秒，

        killTween.onComplete.addOnce(function () {
            brick.kill();//消除砖块
        }, this);
        killTween.start();// 启动 tween 动画
        score += 10;//增加分数
        scoreText.setText('Points: ' + score);//输出分数变化

        if (score === brickInfo.count.row * brickInfo.count.col * 10) {
            const winner = game.add.image(0, 0, 'winner');
            winner.width = game.world.width;  // 设置宽度为游戏世界宽度
            winner.height = game.world.height; // 设置高度为游戏世界高度
            ball.body.velocity.set(0); // 停止小球的速度
            ball.body.immovable = true; // 让小球不再移动
            playaudio(3)//播放游戏胜利音效
            alert('恭喜你获得胜利');
            setTimeout(() => {
                location.reload();
            }, 3000);

        }
    }

    //小球的生命值消耗与出界检测
    function ballLeaveScreen() {
        lives--;
        if (lives) {
            livesText.setText('lives: ' + lives);//更新生命值信息
            lifeLostText.visible = true;//设置为可见
            ball.reset(game.world.width * 0.5, game.world.height - 25);//重置小球位置
            paddle.reset(game.world.width * 0.5, game.world.height - 5);//重置板子位置
            game.input.onDown.addOnce(function () {
                lifeLostText.visible = false;
                ball.body.velocity.set(150, -150);
            }, this);
        }
        else {
            const loser = game.add.image(0, 0, 'loser');//渲染游戏失败结算画面
            loser.width = game.world.width;  // 设置宽度为游戏世界宽度
            loser.height = game.world.height; // 设置高度为游戏世界高度
            playaudio(4)//播放游戏失败音效
            alert('你输了，再接再厉');
            setTimeout(() => {
                location.reload();//刷新页面
            }, 3000);
        }
    }
    function ballHitPaddle(ball, paddle) {
        ball.animations.play('wobble');//播放小球摆动动画
        ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x);
    }
    function startGame() {
        startButton.destroy();//消除按钮防止重复启动游戏
        playaudio(2)//播放游戏开始音效
        ball.body.velocity.set(150, -150);
        playing = true;//设置游戏状态为正在游戏
    }

    function drawBackground() {
        game.add.image(0, 0, 'background'); // 在每一帧中绘制背景
    }
    function playaudio(num//根据游戏情况播放对应的音效
    ) {
        switch (num) {
            case 1: game.sound.play('water'); break;//消除砖块音效
            case 2: game.sound.play('start'); break;
            case 3: game.sound.play('win'); break;
            case 4: game.sound.play('lose'); break;
        }
    }
}

script2()