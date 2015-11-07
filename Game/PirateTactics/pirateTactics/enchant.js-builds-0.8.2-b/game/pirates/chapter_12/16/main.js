/**
 * enchant.js を使う前に必要な処理。
 */
enchant();

window.onload = function(){

    var game = new Core(960, 640);
    game.fps = 30; //fps 一秒に何回を画面更新する

    /**
     * 必要なファイルを相対パスで引数に指定する。 ファイルはすべて、ゲームが始まる前にロードされる。
     */
    var mapFrame  = "../../../resources/mapframe.png";
    game.preload(mapFrame);

    var mapBackground00  = "../../../resources/map00.png";
    game.preload(mapBackground00);

    var mapTiles  = "../../../resources/maptiles.png";
    game.preload(mapTiles);

    var mapUI  = "../../../resources/mapui.png";
    game.preload(mapUI);

    var shipsSpriteSheet  = "../../../resources/ships.png";
    game.preload(shipsSpriteSheet);

    var pirateSprites = [
        "../../../resources/pirate00.png",
        "../../../resources/pirate01.png",
        "../../../resources/pirate02.png",
        "../../../resources/pirate03.png",
    ];
    for (var i=0; i < pirateSprites.length; ++i) {
        game.preload(pirateSprites[i]);
    }

    var pirateChibiSprites = [
        "../../../resources/pirateChibi00.png",
        "../../../resources/pirateChibi01.png",
        "../../../resources/pirateChibi02.png",
        "../../../resources/pirateChibi03.png",
    ];
    for (var i=0; i < pirateChibiSprites.length; ++i) {
        game.preload(pirateChibiSprites[i]);
    }

    var ui1x1Black    = "../../../resources/1x1black.png";
    game.preload(ui1x1Black);

    var uiWindowSprite    = "../../../resources/window.png";
    game.preload(uiWindowSprite);

    var uiCancelBtnSprite = "../../../resources/btnCancel.png";
    game.preload(uiCancelBtnSprite);

    var fontStyle = "32px 'ＭＳ ゴシック', arial, sans-serif";

    /**
     * Utils
     */
    var utils = {
        getEuclideanDistance: function(startI, startJ, endI, endJ) {
            var distanceSq = Math.pow(startI -endI, 2) +Math.pow(startJ -endJ, 2);
            var distance   = Math.sqrt(distanceSq);
            return distance;
        },

        getManhattanDistance: function(startI, startJ, endI, endJ) {
            var distance = Math.abs(startI -endI) +Math.abs(startJ -endJ);
            return distance;
        },

        getChebyshevDistance: function(startI, startJ, endI, endJ) {
            var distance = Math.max(Math.abs(startI -endI), Math.abs(startJ -endJ));
            return distance;
        },
    };

    /**
     * Map のマスの定義
     */
    var tileTypes = {
        umi:  {id:0, name:"umi"},
        arai: {id:1, name:"arai"},
        asai: {id:2, name:"asai"},
        riku: {id:3, name:"riku"},
        iwa:  {id:4, name:"iwa"},
    };

    /**
     * Map クラス
     */
    var GameMap = Class.create({
        initialize: function(scene, mapData) {
            // 枠
            var frame = new Sprite(960, 640);
            frame.image = game.assets[mapFrame];
            scene.addChild(frame);
            this.frame = frame;

            // 背景
            var background = new Sprite(64*13, 64*9);
            background.image = game.assets[mapBackground00];
            background.x = 64;
            background.y = 10;
            scene.addChild(background);
            this.background = background;

            // マス
            var tiles = new Map(64, 64);
            tiles.image = game.assets[mapTiles];
            tiles.x = 64;
            tiles.y = 10;
            tiles.loadData(mapData);
            tiles.opacity = 0.25;
            scene.addChild(tiles);
            this.tiles = tiles;

            // マップを大きさを保存
            this.mapHeight = mapData.length;
            this.mapWidth  = mapData[0].length;

            //　元のマップデータから陸や岩のcollisionデータを生成します
            var mapCollisionData = [];
            for(var j=0; j < this.mapHeight; j++) {
                mapCollisionData[j] = [];
                for(var i=0; i < this.mapWidth; i++) {
                    if (mapData[j][i] == tileTypes.riku.id || mapData[j][i] == tileTypes.iwa.id) {
                        mapCollisionData[j].push(1);
                    } else {
                        mapCollisionData[j].push(0);
                    }
                }
            }
            this.tiles.collisionData = mapCollisionData

            // underLayer
            var underLayer = new Group();
            underLayer.touchEnabled = false;
            scene.addChild(underLayer);
            this.underLayer = underLayer;

            // playLayer
            var playLayer = new Group();
            playLayer.touchEnabled = false;
            scene.addChild(playLayer);
            this.playLayer = playLayer;

            // overLayer
            var overLayer = new Group();
            overLayer.touchEnabled = false;
            scene.addChild(overLayer);
            this.overLayer = overLayer;

            var self = this;
            tiles.touchEnabled = true;
            tiles.addEventListener(enchant.Event.TOUCH_END, function(params){
                self.ontouchend(params)
            });

            tiles.addEventListener(enchant.Event.TOUCH_START, function(params){
                self.ontouchupdate(params)
            });

            tiles.addEventListener(enchant.Event.TOUCH_MOVE, function(params){
                self.ontouchupdate(params)
            });
        },

        setController: function(controller) {
            this.controller = controller;
        },

        toLocalSpace:function(worldX, worldY) {
            var localX = worldX -this.tiles.x;
            var localY = worldY -this.tiles.y;
            return {x:localX, y:localY};
        },

        toWorldSpace:function(localX, localY) {
            var worldX = localX +this.tiles.x;
            var worldY = localY +this.tiles.y;
            return {x:worldX, y:worldY};
        },

        getMapTileAtPosition: function(localX, localY) {
            return {
                i: Math.floor(localX/64),
                j: Math.floor(localY/64)
            };
        },

        getMapPositionAtTile: function(i,j) {
            return {
                localX: i *64,
                localY: j *64
            };
        },

        getTileInfo:function(id) {
            for(t in tileTypes) {
                if (tileTypes[t].id == id) {
                    return tileTypes[t];
                }
            }
        },

        addChild: function(object) {
            this.playLayer.addChild(object);
        },

        positonObject: function(object, i, j) {
            var postion = this.getMapPositionAtTile(i, j);
            var worldPosition = this.toWorldSpace(postion.localX, postion.localY);

            object.x = worldPosition.x;
            object.y = worldPosition.y;

            object.i = i;
            object.j = j;
        },

        positionFune: function(fune, i, j) {
            this.positonObject(fune, i, j);

        },

        getEuclideanDistance: function(startI, startJ, endI, endJ) {
            return utils.getEuclideanDistance(startI, startJ, endI, endJ);
        },

        getManhattanDistance: function(startI, startJ, endI, endJ) {
            return utils.getManhattanDistance(startI, startJ, endI, endJ);
        },

        getChebyshevDistance: function(startI, startJ, endI, endJ) {
            return utils.getChebyshevDistance(startI, startJ, endI, endJ);
        },

        outOfBorders: function(i, j) {
            if (i < 0) return true;
            if (i >= this.mapWidth) return true;
            if (j < 0) return true;
            if (j >= this.mapHeight) return true;

            return false;
        },

        setActiveFune: function(fune) {
            fune.map = this;
            this.activeFune = fune;
            this.drawMovementRange()
        },

        ontouchend:function(params) {
            if (this.mapMarker) {
                this.overLayer.removeChild(this.mapMarker)
                delete this.mapMarker;
            }

            var localPosition = this.toLocalSpace(params.x, params.y);

            var tileData = this.tiles.checkTile(localPosition.x, localPosition.y);
            var tileInfo = this.getTileInfo(tileData);

            if (this.tiles.hitTest(localPosition.x, localPosition.y) == true) {
                console.log("通れない", tileInfo.name, "world X", params.x, "localX", localPosition.x, "worldY", params.y, "localY", localPosition.y)
            } else {
                console.log("通れる", tileInfo.name, "world X", params.x, "localX", localPosition.x, "worldY", params.y, "localY", localPosition.y)

                var tile = this.getMapTileAtPosition(localPosition.x, localPosition.y);
                if (this.outOfBorders(tile.i, tile.j)) {
                    return;
                }
                console.log("i", tile.i, "j", tile.j, "distance", this.getManhattanDistance(this.activeFune.i, this.activeFune.j, tile.i, tile.j));

                if (this.getManhattanDistance(this.activeFune.i, this.activeFune.j, tile.i, tile.j) <= this.activeFune.getMovement()) {
                    this.positionFune(this.activeFune, tile.i, tile.j);
                    this.controller.endTurn();
                }
            }
        },

        ontouchupdate: function(params) {
            var localPosition = this.toLocalSpace(params.x, params.y);
            var tile = this.getMapTileAtPosition(localPosition.x, localPosition.y);
            if (this.outOfBorders(tile.i, tile.j)) {
                return
            }

            if (this.mapMarker == undefined) {
                this.mapMarker = new Sprite(64, 64);
                this.mapMarker.image = game.assets[mapUI];
                this.positonObject(this.mapMarker, tile.i, tile.j);
                this.overLayer.addChild(this.mapMarker);
            } else {
                this.positonObject(this.mapMarker, tile.i, tile.j);
            }

            if (this.tiles.hitTest(localPosition.x, localPosition.y) == true) {
                this.mapMarker.frame = 1;
            } else {
                if (this.getManhattanDistance(this.activeFune.i, this.activeFune.j, tile.i, tile.j) <= this.activeFune.getMovement()) {
                    this.mapMarker.frame = 0;
                } else {
                    this.mapMarker.frame = 1;
                }
            }
        },

        drawMovementRange: function() {
            console.log("update drawMovementRange")
            if (this.areaRangeLayer) {
                this.underLayer.removeChild(this.areaRangeLayer);
                delete this.areaRangeLayer;
            }

            this.areaRangeLayer = new Group();
            this.underLayer.addChild(this.areaRangeLayer);

            for (var rangeI = -this.activeFune.getMovement(); rangeI <= this.activeFune.getMovement(); rangeI++) {
                var targetI = this.activeFune.i +rangeI;
                for (var rangeJ = -this.activeFune.getMovement(); rangeJ <= this.activeFune.getMovement(); rangeJ++) {
                    var targetJ = this.activeFune.j +rangeJ;

                    if (!this.outOfBorders(targetI, targetJ)) {
                        if (this.getManhattanDistance(this.activeFune.i, this.activeFune.j, targetI, targetJ) <= this.activeFune.getMovement()) {
                            var areaSprite = new Sprite(64, 64);
                            areaSprite.touchEnabled = false;
                            areaSprite.image = game.assets[mapUI];
                            var position = this.getMapPositionAtTile(targetI, targetJ);
                            if (this.tiles.hitTest(position.localX, position.localY) == true) {
                                areaSprite.frame = 3;
                            } else {
                                areaSprite.frame = 2;
                            }
                            this.positonObject(areaSprite, targetI, targetJ);
                            this.areaRangeLayer.addChild(areaSprite);
                        }
                    }
                }
            }
        },
    });


    /**
     * 基本船のクラス
     */
    var BaseFune = Class.create(Group, {
        initialize: function(id, stats) {
            Group.call(this);

            var fune = new Sprite(64, 64);
            this.fune = fune;
            fune.image = game.assets[shipsSpriteSheet];
            fune.frame = [0, 0, 0, 0, 1, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 3, 3, 3];
            fune.sinkFrame = [3, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, null];
            this.addChild(fune);

            this.stats    = {
                id:        id,
                movement:  stats.movement,
                range:     stats.range,
                attack:    stats.attack,
                defense:   stats.defense,
                hpMax:     stats.hpMax,
            };
            this.stats.hp = this.stats.hpMax;

        },

        getId: function() {
            return this.stats.id;
        },

        getMovement: function() {
            return this.stats.movement;
        },

        getRange: function() {
            return this.stats.range;
        },

        getAttack: function() {
            return this.stats.attack;
        },

        getDefense: function() {
            return this.stats.defense;
        },

        getHPMax: function() {
            return this.stats.hpMax;
        },

        getHP: function() {
            return this.stats.hp;
        },

        getCaptainName: function() {
            return "無名";
        },

        getImage: function() {
            return game.assets[pirateSprites[this.getId() -1]]
        },

        getChibiImage: function() {
            return game.assets[pirateChibiSprites[this.getId() -1]]
        },

        withinRange: function(i, j) {
            var distance = utils.getManhattanDistance(this.i, this.j, i, j);
            console.log("withinRange", "distance", distance, "range", this.stats.range, distance <= this.stats.range);
            if (distance <= this.stats.range) {
                return true;
            } else {
                return false;
            }
        },

        takeDamage: function(damage) {
            var actualDamage = Math.max(damage -this.stats.defense, 1);
            this.stats.hp -= actualDamage;
            return this.stats.hp;
        },

        healDamage: function(recover) {
            this.stats.hp = Math.min(this.stats.hp + recover, this.stats.hpMax);
        },

        attackFune: function(otherFune) {
            var damage;
            var baseDamage = this.stats.attack;
            var variance   = Math.random() -0.5;
            var variableDamage = (baseDamage /10) * variance;

            var attackRoll = Math.random();

            // クリティカルヒット 10%
            // ミス 10%
            if (attackRoll > 0.9) {
                // クリティカル　ダメージx2
                damage = (baseDamage +variableDamage) *2;
                alert("Critical!")
            } else if (attackRoll < 0.1) {
                // ミス ダメージ 0
                damage = 0;
            } else {
                damage = baseDamage +variableDamage;
            }

            damage = Math.ceil(damage);

            if (damage > 0) {
                var beforeHp = otherFune.getHP();
                var afterHp  = otherFune.takeDamage(damage);

                alert("beforeHp: "+beforeHp+" -"+damage+"(-DEF) ="+afterHp);

                if (afterHp <= 0) {
                    alert("沈没した！");
                    otherFune.sinkShip();
                }
            } else {
                alert("ミス！");
            }
            this.player.controller.endTurn();
        },

        ontouchend: function(params) {
            if (this.player.isActive()) {
                if (this.player.getActiveFune() == this) {
                    var popup = new FunePopup(this);
                    popup.onCancel = function() {

                    }
                } else {
                    this.player.setActiveFune(this);
                }
            } else {
                var activePlayer = this.player.controller.getActivePlayer();
                var activeFune   = activePlayer.getActiveFune();
                if (activeFune.withinRange(this.i, this.j)) {
                    activeFune.attackFune(this);
                } else {
                    alert("攻撃は届けません");
                }
            }
        },

        sinkShip: function() {
            this.player.removeFune(this);
            this.parentNode.removeChild(this);
        }
    });

    /**
     * 船の種類
     */
    var CaptainFune = Class.create(BaseFune, {
        initialize: function(id) {
            BaseFune.call(this, id, {
                movement:  4,
                range:     3,
                attack:  100,
                defense:  50,
                hpMax:   120,
            });

            this.fune.frame = [0, 0, 0, 0, 1, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 3, 3, 3];
            this.fune.sinkFrame = [3, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, null];

        },

        getCaptainName: function() {
            return "キャプテン";
        }
    });

    var HayaiFune = Class.create(BaseFune, {
        initialize: function(id) {
            BaseFune.call(this, id, {
                movement:  5,
                range:     3,
                attack:   80,
                defense:  60,
                hpMax:    80,
            });

            this.fune.frame = [8, 8, 8, 8, 9, 9, 9, 10, 10, 9, 9, 8, 8, 8, 8, 11, 11, 11];
            this.fune.sinkFrame = [11, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, null];
        },

        getCaptainName: function() {
            return "はやいちゃん";
        }
    });

    var KataiFune = Class.create(BaseFune, {
        initialize: function(id) {
            BaseFune.call(this, id, {
                movement:  3,
                range:     3,
                attack:   80,
                defense:  60,
                hpMax:   240,
            });

            this.fune.frame = [16, 16, 16, 16, 17, 17, 17, 18, 18, 17, 17, 16, 16, 16, 16, 19, 19, 19];
            this.fune.sinkFrame = [19, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, null];
        },

        getCaptainName: function() {
            return "かたいちゃん";
        }
    });

    var KougekiFune = Class.create(BaseFune, {
        initialize: function(id) {
            BaseFune.call(this, id, {
                movement:  3,
                range:     3,
                attack:  120,
                defense:  40,
                hpMax:   150,
            });

            this.fune.frame = [24, 24, 24, 24, 25, 25, 25, 26, 26, 25, 25, 24, 24, 24, 24, 27, 27, 27];
            this.fune.sinkFrame = [27, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, null];
        },

        getCaptainName: function() {
            return "こうげきちゃん";
        }
    });

    /**
     * プレイヤー
     */
    var GamePlayer = Class.create({
        initialize: function(data) {
            this.funeList = [];
            this.data = data;
        },

        isActive: function() {
            return this.myTurn;
        },

        setActive: function(flag) {
            this.myTurn = flag;
        },

        getData: function(key) {
            return this.data[key];
        },

        setData: function(key, value) {
            this.data[key] = value;
        },

        setController: function(controller) {
            this.controller = controller;
        },

        addFune: function(fune) {
            fune.player = this;
            this.funeList.push(fune)
        },

        removeFune: function(fune) {
            delete fune.player;

            var newList = [];
            for (var i=0; i < this.getFuneCount(); ++i) {
                if (this.getFune(i) != fune) {
                    newList.push(this.getFune(i));
                }
            }
            this.funeList = newList;

            if (this.activeFune == fune) {
                this.activeFune = null;
            }
        },

        getFune: function(index) {
            return this.funeList[index];
        },

        getFuneCount: function() {
            return this.funeList.length;
        },

        getActiveFune: function() {
            if (this.activeFune) {
                return this.activeFune;
            } else {
                return this.funeList[0];
            }
        },

        setActiveFune: function(fune) {
            this.activeFune = fune;
            this.controller.updateTurn();
        },
    });


    /**
     * ゲーム管理クラス
     */
    var GameManager = Class.create({
        initialize: function() {
            this.playerList = [];
            this.turnCounter = 0;
        },

        addPlayer: function(player) {
            player.setController(this);
            this.playerList.push(player)
        },

        setMap: function(map) {
            map.setController(this);
            this.map = map;
        },

        setTurnUI: function(ui) {
            this.turnUI = ui;
        },

        setStartPositions: function(startPositions) {
            this.startPositions = startPositions;
        },

        getActivePlayer: function() {
            return this.playerList[this.turnCounter % this.playerList.length];
        },

        getNonActivePlayer: function() {
           return this.playerList[(this.turnCounter +1) % this.playerList.length];
        },

        beginGame: function() {
            var player1 = this.playerList[0];
            for(var funeIndex = 0; funeIndex < player1.getFuneCount(); funeIndex++) {
                var fune = player1.getFune(funeIndex);
                this.map.addChild(fune);
                var startPosition = this.startPositions.player1[funeIndex]
                this.map.positionFune(fune, startPosition.i, startPosition.j);
            }

            var player2 = this.playerList[1];
            for(var funeIndex = 0; funeIndex < player2.getFuneCount(); funeIndex++) {
                var fune = player2.getFune(funeIndex);
                fune.originX = 32;
                fune.scaleX = -1;
                this.map.addChild(fune);
                var startPosition = this.startPositions.player2[funeIndex]
                this.map.positionFune(fune, startPosition.i, startPosition.j);

            }

            this.startTurn();
        },

        startTurn: function() {
            var player = this.getActivePlayer();
            player.setActive(true);

            this.updateTurn();
        },

        updateTurn: function() {
            this.map.setActiveFune(this.getActivePlayer().getActiveFune());
            this.map.drawMovementRange();
            this.turnUI.updateTurn(this.turnCounter);
            this.turnUI.updatePlayer(this.getActivePlayer().getData("name"));
        },

        endTurn: function() {
            var player = this.getActivePlayer();
            player.setActive(false);

            var winner = this.getWinner();
            if (winner) {
                alert("プレイヤー："+winner.getData("name")+" の勝利です");
                alert("game over");
                location.reload();
            } else {
                this.turnCounter++;
                this.startTurn();
            }
        },

        getWinner: function() {
            if (this.getActivePlayer().getFuneCount() == 0) {
                if (this.getNonActivePlayer().getFuneCount() == 0) {
                    return this.getActivePlayer();
                } else {
                    return this.getNonActivePlayer();
                }
            } else if (this.getNonActivePlayer().getFuneCount() == 0) {
                return this.getActivePlayer();
            }
            return null
        },
    })

    /**
     * ターン関係の情報を表示するクラス
     */
    var TurnUI = Class.create({
        initialize: function(scene) {
            var fontColor = "rgba(255, 255, 105, 1.0)";

            this.turnLabel = new Label();
            scene.addChild(this.turnLabel);
            this.turnLabel.x = 64*5;
            this.turnLabel.y = 640 -40;
            this.turnLabel.font = fontStyle;
            this.turnLabel.color = fontColor;

            this.playerLabel = new Label();
            scene.addChild(this.playerLabel);
            this.playerLabel.x = 64;
            this.playerLabel.y = 640 -40;
            this.playerLabel.font = fontStyle;
            this.playerLabel.color = fontColor;
        },

        updateTurn: function(turn) {
            this.turnLabel.text = "ターン:"+turn;
        },

        updatePlayer: function(name) {
            this.playerLabel.text = name;
        },

    })

    /**
     * キャラのポップアップウィンドー
     */
    var FunePopup = Class.create(Scene, {
        initialize: function(fune) {
            Scene.call(this);
            game.pushScene(this);

            var shieldSprite = new Sprite(960, 640);
            shieldSprite.image = game.assets[ui1x1Black];
            shieldSprite.opacity = 0.5
            this.addChild(shieldSprite);

            var windowGroup = new Group();
            windowGroup.x = (960 -512)/2;
            windowGroup.y = (640 -512)/2;
            this.addChild(windowGroup);

            var windowSprite = new Sprite(512, 512);
            windowSprite.image = game.assets[uiWindowSprite];
            windowGroup.addChild(windowSprite);

            var statsGroup = new Group();
            statsGroup.x = 64;
            statsGroup.y = 32;
            windowGroup.addChild(statsGroup);

            var fontColor = "rgba(255, 255, 105, 1.0)";

            captainLabel = new Label("船長："+fune.getCaptainName());
            statsGroup.addChild(captainLabel);
            captainLabel.x = 0;
            captainLabel.y = 0;
            captainLabel.font = fontStyle;
            captainLabel.color = fontColor;

            attackLabel = new Label("攻撃力："+fune.getAttack());
            statsGroup.addChild(attackLabel);
            attackLabel.x = 0;
            attackLabel.y = 64 *1;
            attackLabel.font = fontStyle;
            attackLabel.color = fontColor;

            defenseLabel = new Label("防御力："+fune.getDefense());
            statsGroup.addChild(defenseLabel);
            defenseLabel.x = 0;
            defenseLabel.y = 64 *2;
            defenseLabel.font = fontStyle;
            defenseLabel.color = fontColor;

            movementLabel = new Label("移動力："+fune.getMovement());
            statsGroup.addChild(movementLabel);
            movementLabel.x = 0;
            movementLabel.y = 64 *3;
            movementLabel.font = fontStyle;
            movementLabel.color = fontColor;

            rangeLabel = new Label("攻撃の距離："+fune.getRange());
            statsGroup.addChild(rangeLabel);
            rangeLabel.x = 0;
            rangeLabel.y = 64 *4;
            rangeLabel.font = fontStyle;
            rangeLabel.color = fontColor;

            hpLabel = new Label("HP："+fune.getHP()+"/"+fune.getHPMax());
            statsGroup.addChild(hpLabel);
            hpLabel.x = 0;
            hpLabel.y = 64 *5;
            hpLabel.font = fontStyle;
            hpLabel.color = fontColor;

            var pirate = new Sprite(400, 640);
            pirate.x = 350;
            pirate.y = -50;
            pirate.opacity = 0;
            pirate.image = fune.getImage();
            windowGroup.addChild(pirate);

            var self = this;
            var cancelBtnSprite = new Sprite(128, 64);
            cancelBtnSprite.image = game.assets[uiCancelBtnSprite];
            cancelBtnSprite.x = 64;
            cancelBtnSprite.y = 512 -64 -32;

            windowGroup.addChild(cancelBtnSprite);

            cancelBtnSprite.addEventListener(enchant.Event.TOUCH_END, function(params) {
                game.popScene();
                if (self.onCancel) {
                    self.onCancel()
                }
            })
        },
    })

    /**
     * ロードが完了した直後に実行される関数を指定している。
     */
    game.onload = function(){
        var sceneGameMain = new Scene();

        // ゲームロジックの管理
        var manager = new GameManager();

        // マスのデータ
        var mapDisplayData = [
            [3, 3, 2, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0],
            [3, 2, 0, 0, 2, 3, 3, 2, 0, 1, 0, 0, 0],
            [3, 0, 4, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0],
            [3, 0, 0, 0, 0, 2, 2, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 4, 0, 0, 0, 1, 1, 0, 4, 0],
            [1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2],
            [0, 0, 0, 3, 3, 2, 0, 0, 0, 0, 4, 2, 3],
            [0, 0, 0, 3, 3, 3, 2, 0, 0, 2, 2, 3, 3],
        ];

        var map = new GameMap(sceneGameMain, mapDisplayData);
        manager.setMap(map);

        var turnUI = new TurnUI(sceneGameMain);
        manager.setTurnUI(turnUI);

        // プレイヤー１
        var player1 = new GamePlayer({name:"プレイヤー１"});
        manager.addPlayer(player1);
        // プレイヤー1に船を４つあげよう
        player1.addFune(new CaptainFune(1));
        player1.addFune(new HayaiFune(2));
        player1.addFune(new KataiFune(3));
        player1.addFune(new KougekiFune(4));

        // プレイヤー２
        var player2 = new GamePlayer({name:"プレイヤー２"});
        manager.addPlayer(player2);
        // プレイヤー1に船を４つあげよう
        player2.addFune(new CaptainFune(1));
        player2.addFune(new HayaiFune(2));
        player2.addFune(new KataiFune(3));
        player2.addFune(new KougekiFune(4));

        // 船の初期の位置
        var startPositions = {
            player1: [
                {i: 0, j: 8}, {i: 0, j: 6}, {i: 1, j: 7}, {i: 2, j: 8}
            ],
            player2: [
                {i: 12, j: 0}, {i: 10, j: 0}, {i: 11, j: 1}, {i: 12, j: 2}
            ],
        }
        manager.setStartPositions(startPositions);

        // ゲームにシーンを追加
        game.pushScene(sceneGameMain);

        // ゲームのロジック開始
        manager.beginGame();
    };

    game.start();
};
