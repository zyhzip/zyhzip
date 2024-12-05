function script1() {
    // 声明全局变量
    var game, bgm, button_stopbgm, button_setting, textStyle, livesText, damageText, playerheart, playerdamage, Button;

    // 基础变量
    var lives = 10;
    var damage = 0;
    var keys = [];
    var currentLevel = 1;
    var bgmstatus = false;
    var gameStarted = false;

    const allKeys = [
        'Golden_Key',
        'Desert_Key',
        'Frozen_Key',
        'Jungle_Key',
        'Corruption_Key',
        'Crimson_Key',
        'Hallowed_Key'
    ];

    const levelAssets = [
        { bg: 'forest', chest: 'Golden_Chest', key: 'Golden_Key' },
        { bg: 'desert', chest: 'Desert_Chest', key: 'Desert_Key' },
        { bg: 'snow', chest: 'Frozen_Chest', key: 'Frozen_Key' },
        { bg: 'jungle', chest: 'Jungle_Chest', key: 'Jungle_Key' },
        { bg: 'corruption', chest: 'Corruption_Chest', key: 'Corruption_Key' },
        { bg: 'crimson', chest: 'Crimson_Chest', key: 'Crimson_Key' },
        { bg: 'hallow', chest: 'Hallowed_Chest', key: 'Hallowed_Key' }
    ];

    function preload() {
        // 设置缩放
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // 加载所有资源
        game.load.image('playerheart', 'images/PlayerHeart.png');
        game.load.image('playerdamage', 'images/damage.png');
        game.load.image('button', 'images/start_button.png');
        game.load.image('button_stopbgm', 'images/stopbgm.png');
        game.load.image('button_setting', 'images/setting.png');
        game.load.image('monster', 'images/smsw.jpg');
        game.load.audio('bgm', 'audios/bgm.mp3');

        // 加载背景
        game.load.image('start', 'images/background/8-Forest_background_10.png');
        game.load.image('forest', 'images/background/1-Forest_background_4.png');
        game.load.image('desert', 'images/background/2-Desert_background_2.png');
        game.load.image('snow', 'images/background/3-Snow_biome_background_7.png');
        game.load.image('jungle', 'images/background/4-Jungle_background_5.png');
        game.load.image('corruption', 'images/background/5-Corruption_background_3.png');
        game.load.image('crimson', 'images/background/6-Crimson_background_5.png');
        game.load.image('hallow', 'images/background/7-Hallow_background_5.png');

        // 加载宝箱
        game.load.image('Golden_Chest', 'images/chest/1-Golden_Chest.png');
        game.load.image('Desert_Chest', 'images/chest/2-Desert_Chest.png');
        game.load.image('Frozen_Chest', 'images/chest/3-Frozen_Chest.png');
        game.load.image('Jungle_Chest', 'images/chest/4-Jungle_Chest.png');
        game.load.image('Corruption_Chest', 'images/chest/5-Corruption_Chest.png');
        game.load.image('Crimson_Chest', 'images/chest/6-Crimson_Chest.png');
        game.load.image('Hallowed_Chest', 'images/chest/7-Hallowed_Chest.png');

        // 加载钥匙
        allKeys.forEach(key => {
            game.load.image(key, `images/key/${key}.png`);
        });
    }

    function create() {
        try {
            // 尝试加载存档
            const savedLevel = localStorage.getItem('currentLevel');
            if (savedLevel) {
                lives = parseInt(localStorage.getItem('lives')) || 10;
                damage = parseInt(localStorage.getItem('damage')) || 0;
                keys = JSON.parse(localStorage.getItem('keys')) || [];
                currentLevel = parseInt(savedLevel);
                gameStarted = true;

                createGameScreen();
                playaudio();
            } else {
                createStartScreen();
            }
        } catch (error) {
            console.error('加载存档失败:', error);
            localStorage.clear();
            createStartScreen();
        }
    }

    // 初始化游戏
    game = new Phaser.Game(480, 320, Phaser.AUTO, 'game1', {
        preload: preload,
        create: create,
        update: update
    });

    function startgame() {
        Button.destroy();
        // 初始化新游戏
        lives = 10;
        damage = 0;
        currentLevel = 1;
        keys = [];
        gameStarted = true;

        // 生成随机钥匙
        const shuffledKeys = [...allKeys].sort(() => Math.random() - 0.5);
        keys = shuffledKeys.slice(0, 4);

        // 保存初始状态
        saveGameState();

        playaudio();
        createGameScreen();
    }

    function saveGameState() {
        localStorage.setItem('lives', lives);
        localStorage.setItem('damage', damage);
        localStorage.setItem('currentLevel', currentLevel);
        localStorage.setItem('keys', JSON.stringify(keys));
    }

    function createStartScreen() {
        game.world.removeAll();

        const background = game.add.image(0, 0, 'start');
        background.width = game.world.width;
        background.height = game.world.height;

        Button = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startgame, this, 1, 0, 2);
        Button.anchor.set(0.5);
        Button.height = game.world.height * 0.15;
        Button.width = game.world.width * 0.1;

        createUI();
    }

    function createUI() {
        button_stopbgm = game.add.button(game.world.width * 0.01, game.world.height * 0.01, 'button_stopbgm', stopbgm);
        button_stopbgm.height = game.world.height * 0.09;
        button_stopbgm.width = game.world.width * 0.06;

        button_setting = game.add.button(game.world.width * 0.01, game.world.height * 0.12, 'button_setting')
        button_setting.height = game.world.height * 0.09;
        button_setting.width = game.world.width * 0.06;

        textStyle = { font: '18px Arial', fill: '#ff0000' };
        livesText = game.add.text(game.world.width - 5, 5, ':' + lives, textStyle);
        livesText.anchor.set(1, 0);

        playerheart = game.add.image(game.world.width - 35, 5, 'playerheart')
        playerheart.width = game.world.height * 0.06;
        playerheart.height = game.world.width * 0.04;
        playerheart.anchor.set(1, 0);

        damageText = game.add.text(game.world.width - 5, 30, ':' + damage, textStyle)
        damageText.anchor.set(1, 0);

        playerdamage = game.add.image(game.world.width - 35, 30, 'playerdamage')
        playerdamage.width = game.world.height * 0.06;
        playerdamage.height = game.world.width * 0.04;
        playerdamage.anchor.set(1, 0);
    }

    async function createGameScreen() {
        game.world.removeAll();

        const levelAsset = levelAssets[currentLevel - 1];
        const background = game.add.image(0, 0, levelAsset.bg);
        background.width = game.world.width;
        background.height = game.world.height;

        displayKeys();

        const [chestText, monsterText] = await Promise.all([
            fetch(`gameText/chest${currentLevel}.txt`).then(r => r.text()),
            fetch('gameText/monster.txt').then(r => r.text())
        ]);

        const chest = game.add.sprite(game.world.width * 0.25, game.world.height * 0.45, levelAsset.chest);
        chest.scale.setTo(0.8);
        chest.anchor.setTo(0.5);
        chest.inputEnabled = true;

        if (!keys.includes(levelAsset.key)) {
            chest.tint = 0x666666;
        }

        chest.events.onInputDown.add(() => {
            if (keys.includes(levelAsset.key)) {
                makeChoice('chest');
                keys = keys.filter(k => k !== levelAsset.key);
                displayKeys();
            } else {
                const noKeyText = game.add.text(game.world.centerX, game.world.centerY,
                    '没有对应的钥匙！',
                    { font: 'bold 24px Microsoft YaHei', fill: '#ff0000' }
                );
                noKeyText.anchor.setTo(0.5);
                game.time.events.add(1000, () => noKeyText.destroy(), this);
            }
        });

        const chestDesc = game.add.text(game.world.width * 0.25, game.world.height * 0.7, chestText,
            {
                font: '12px Microsoft YaHei',
                fill: '#ffffff',
                align: 'center',
                wordWrap: true,
                wordWrapWidth: 120,
                lineSpacing: 3
            }
        );
        chestDesc.anchor.setTo(0.5);
        chestDesc.scale.setTo(0.8);

        const monster = game.add.sprite(game.world.width * 0.75, game.world.height * 0.45, 'monster');
        monster.scale.setTo(0.1);
        monster.anchor.setTo(0.5);
        monster.inputEnabled = true;
        monster.events.onInputDown.add(() => makeChoice('battle'));

        const monsterDesc = game.add.text(game.world.width * 0.75, game.world.height * 0.7, monsterText,
            {
                font: '12px Microsoft YaHei',
                fill: '#ffffff',
                align: 'center',
                wordWrap: true,
                wordWrapWidth: 120,
                lineSpacing: 3
            }
        );
        monsterDesc.anchor.setTo(0.5);
        monsterDesc.scale.setTo(0.8);

        const levelText = game.add.text(game.world.centerX, 20,
            `第 ${currentLevel} 关`,
            {
                font: 'bold 24px Microsoft YaHei',
                fill: '#ffffff',
                align: 'center'
            }
        );
        levelText.anchor.setTo(0.5);

        createUI();
    }

    function makeChoice(choice) {
        if (!gameStarted) return;

        if (choice === 'chest') {
            if (keys.includes(levelAssets[currentLevel - 1].key)) {
                damage += 5;
                keys = keys.filter(k => k !== levelAssets[currentLevel - 1].key);
                displayKeys();
            }
        } else {
            const battleResult = calculateBattle(currentLevel, damage);
            if (battleResult.success) {
                const victoryText = game.add.text(game.world.centerX, game.world.centerY,
                    `战斗胜利！成功通过这一关！`,
                    { font: 'bold 24px Microsoft YaHei', fill: '#00ff00' }
                );
                victoryText.anchor.setTo(0.5);
                game.time.events.add(1000, () => victoryText.destroy(), this);
            } else {
                lives -= battleResult.healthLoss;
                const defeatText = game.add.text(game.world.centerX, game.world.centerY,
                    `战斗失败！生命值-${battleResult.healthLoss}`,
                    { font: 'bold 24px Microsoft YaHei', fill: '#ff0000' }
                );
                defeatText.anchor.setTo(0.5);
                game.time.events.add(1000, () => defeatText.destroy(), this);
            }
        }

        currentLevel++;
        if (currentLevel > 7 || lives <= 0) {
            if (bgm) {
                bgm.stop();
                bgmstatus = false;
            }
            localStorage.clear(); // 游戏结束时清除存档
            gameComplete(currentLevel > 7 && lives > 0);
        } else {
            saveGameState(); // 保存当前进度
            updateUI();
            createGameScreen();
        }
    }

    function calculateBattle(level, playerDamage) {
        const baseDifficulty = 0.7 - (level * 0.08);
        const damageBonus = playerDamage * 0.01;
        const successRate = Math.min(0.9, Math.max(0.1, baseDifficulty + damageBonus));
        const isSuccess = Math.random() < successRate;

        if (isSuccess) {
            return {
                success: true,
                damageBonus: 0
            };
        } else {
            return {
                success: false,
                healthLoss: Math.floor(1 + (level * 0.8))
            };
        }
    }

    function updateUI() {
        livesText.text = ':' + lives;
        damageText.text = ':' + damage;
    }

    function gameComplete(success) {
        game.world.removeAll();

        // 停止背景音乐
        if (bgm) {
            bgm.stop();
            bgmstatus = false;
        }

        if (success) {
            const text = game.add.text(game.world.centerX, game.world.centerY + 50,
                '恭喜通关！你找到了最终的宝箱！\n剩余生命值:' + lives,
                {
                    font: 'bold 24px Microsoft YaHei',
                    fill: '#ffffff',
                    align: 'center'
                }
            );
            text.anchor.setTo(0.5);
        } else {
            const text = game.add.text(game.world.centerX, game.world.centerY,
                '游戏结束！\n你的生命值耗尽了...',
                {
                    font: 'bold 24px Microsoft YaHei',
                    fill: '#ff0000',
                    align: 'center'
                }
            );
            text.anchor.setTo(0.5);
        }

        // 3秒后重新开始
        game.time.events.add(3000, () => {
            game.world.removeAll();
            localStorage.clear(); // 清除存档

            // 重置变量
            lives = 10;
            damage = 0;
            currentLevel = 1;
            keys = [];
            gameStarted = false;

            if (window.keySprites) {
                window.keySprites.forEach(sprite => sprite.destroy());
                window.keySprites = [];
            }

            createStartScreen();
        }, this);
    }

    function playaudio() {
        bgm = game.sound.play('bgm', 1, 0.2, true);
        bgmstatus = true;
    }

    function stopbgm() {
        if (bgmstatus) {
            bgm.pause();
            bgmstatus = false;
        } else {
            bgm.resume();
            bgmstatus = true;
        }
    }

    function update() {
        // 空的更新循环
    }

    // 添加显示钥匙的函数
    function displayKeys() {
        // 清除之前的钥匙显示
        if (window.keySprites) {
            window.keySprites.forEach(sprite => sprite.destroy());
        }
        window.keySprites = [];

        // 显示当前拥有的钥匙
        keys.forEach((key, index) => {
            const keySprite = game.add.sprite(50 + index * 40, 10, key);
            keySprite.scale.setTo(0.4);
            window.keySprites.push(keySprite);
        });
    }
}

script1();