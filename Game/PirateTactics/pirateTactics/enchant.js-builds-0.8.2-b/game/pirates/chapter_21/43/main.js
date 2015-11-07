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
        "../../../resources/pirateChibi04.png",
        "../../../resources/pirateChibi05.png",
    ];
    for (var i=0; i < pirateChibiSprites.length; ++i) {
        game.preload(pirateChibiSprites[i]);
    }

    var explosionSpriteSheet  = "../../../resources/explosion.png";
    game.preload(explosionSpriteSheet);

    var ui1x1Black    = "../../../resources/1x1black.png";
    game.preload(ui1x1Black);

    var uiStartScreen   = "../../../resources/startScreen.png";
    game.preload(uiStartScreen);

    var uiStoryScreen   = "../../../resources/storyScreen.png";
    game.preload(uiStoryScreen);

    var uiVSScreen   = "../../../resources/vsScreen.png";
    game.preload(uiVSScreen);

    var uiAlertScreen   = "../../../resources/alertScreen.png";
    game.preload(uiAlertScreen);

    var uiWindowSprite    = "../../../resources/window.png";
    game.preload(uiWindowSprite);

    var uiStoryBtnSprite = "../../../resources/btnStory.png";
    game.preload(uiStoryBtnSprite);

    var uiVersusBtnSprite = "../../../resources/btnVS.png";
    game.preload(uiVersusBtnSprite);

    var uiHumanBtnSprite = "../../../resources/btnHuman.png";
    game.preload(uiHumanBtnSprite);

    var uiCpuBtnSprite = "../../../resources/btnCPU.png";
    game.preload(uiCpuBtnSprite);

    var uiContinueBtnSprite = "../../../resources/btnContinue.png";
    game.preload(uiContinueBtnSprite);

    var uiNewBtnSprite = "../../../resources/btnNew.png";
    game.preload(uiNewBtnSprite);

    var uiTwitterBtnSprite = "../../../resources/twitter.png";
    game.preload(uiTwitterBtnSprite);

    var uiSettingsSprite    = "../../../resources/settings.png";
    game.preload(uiSettingsSprite);

    var uiCancelBtnSprite = "../../../resources/btnCancel.png";
    game.preload(uiCancelBtnSprite);

    var uiSkillBtnSprite = "../../../resources/btnSkill.png";
    game.preload(uiSkillBtnSprite);

    var uiArrowSprite = "../../../resources/arrow.png";
    game.preload(uiArrowSprite);

    var uiHealthBack      = "../../../resources/healthBack.png";
    game.preload(uiHealthBack);

    var uiHealthRed       = "../../../resources/healthRed.png";
    game.preload(uiHealthRed);

    var uiHealthGreen     = "../../../resources/healthGreen.png";
    game.preload(uiHealthGreen);

    var uiPlayerBanner1   = "../../../resources/playerBanner1.png";
    game.preload(uiPlayerBanner1);

    var uiPlayerBanner2   = "../../../resources/playerBanner2.png";
    game.preload(uiPlayerBanner2);

    var uiWin             = "../../../resources/win.png";
    game.preload(uiWin);

    var uiLose            = "../../../resources/lose.png";
    game.preload(uiLose);

    /**
     * Audio
     */
    var sndBGM            = "../../../resources/music/highseas.mp3";
    game.preload(sndBGM);

    var sndClick          = "../../../resources/sound/se2.wav";
    game.preload(sndClick);

    var sndExplosion      = "../../../resources/sound/shot2.wav";
    game.preload(sndExplosion);

    var sndSinkShip       = "../../../resources/sound/bomb4.wav";
    game.preload(sndSinkShip);

    var sndChangeShips    = "../../../resources/sound/se4.wav";
    game.preload(sndChangeShips);

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

        beginUIShield: function() {
            if (!utils.shieldSprite) {
                var shieldSprite = new Sprite(960, 640);
                shieldSprite.image = game.assets[ui1x1Black];
                shieldSprite.opacity = 0.0;
                game.currentScene.addChild(shieldSprite);
                utils.shieldSprite = shieldSprite;
            }
        },

        endUIShield: function() {
            if (utils.shieldSprite) {
                utils.shieldSprite.parentNode.removeChild(utils.shieldSprite);
                utils.shieldSprite = null;
            }
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
            this.tiles.collisionData = mapCollisionData;

            // 検索用のデータ
            var mapSearchData = [];
            var mapSearchDataLight  = [];
            var mapSearchDataHeavy  = [];

            for(var j=0; j < this.mapHeight; j++) {
                mapSearchData[j] = [];
                mapSearchDataLight[j] = [];
                mapSearchDataHeavy[j] = [];
                for(var i=0; i < this.mapWidth; i++) {
                    if (mapData[j][i] == tileTypes.riku.id || mapData[j][i] == tileTypes.iwa.id) {
                        mapSearchData[j].push(0);
                        mapSearchDataLight[j].push(0);
                        mapSearchDataHeavy[j].push(0);
                    } else {
                        if (mapData[j][i] == tileTypes.arai.id) {
                            mapSearchData[j].push(2);
                            mapSearchDataLight[j].push(3);
                            mapSearchDataHeavy[j].push(1);
                        } else if (mapData[j][i] == tileTypes.asai.id) {
                            mapSearchData[j].push(2);
                            mapSearchDataLight[j].push(1);
                            mapSearchDataHeavy[j].push(3);
                        } else {
                            mapSearchData[j].push(1);
                            mapSearchDataLight[j].push(1);
                            mapSearchDataHeavy[j].push(1);
                        }
                    }
                }
            }

            this.searchGraph = new Graph(mapSearchData);
            this.searchGraphLight = new Graph(mapSearchDataLight);
            this.searchGraphHeavy = new Graph(mapSearchDataHeavy);

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

            tiles.addEventListener(enchant.Event.ENTER_FRAME, function(params){
                self.zsort();
            })
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


        moveFune: function(fune, path, onEnd) {
            if (path.length > 0) {
                var nextMasu = path.shift();
                var i = nextMasu.y;
                var j = nextMasu.x;
                var cost = nextMasu.getCost()

                var postion       = this.getMapPositionAtTile(i, j);
                var worldPosition = this.toWorldSpace(postion.localX, postion.localY);

                //console.log("path length:", path.length, "move: ", i, j, worldPosition.x, worldPosition.y);

                fune.i = i;
                fune.j = j;

                var self = this;
                fune.tl.moveTo(worldPosition.x, worldPosition.y, 10 *cost, enchant.Easing.QUAD_EASEINOUT).then(function(){
                    self.moveFune(fune, path, onEnd);
                });
            } else {
                onEnd();
            }
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

        getPath: function(fune, i,j, targetI, targetJ) {
            var path;
            if (this.outOfBorders(targetI, targetJ)) {
                targetI = i;
                targetJ = j;
            }
            if (fune.moveType == "normal") {
                var start = this.searchGraph.grid[j][i];
                var end   = this.searchGraph.grid[targetJ][targetI];
                path = astar.search(this.searchGraph, start, end);
            }
            if (fune.moveType == "light") {
                var start = this.searchGraphLight.grid[j][i];
                var end   = this.searchGraphLight.grid[targetJ][targetI];
                path = astar.search(this.searchGraphLight, start, end);
            }
            if (fune.moveType == "heavy") {
                var start = this.searchGraphHeavy.grid[j][i];
                var end   = this.searchGraphHeavy.grid[targetJ][targetI];
                path = astar.search(this.searchGraphHeavy, start, end);
            }

            path.cost = 0;
            for(var i=0; i<path.length;i++){
                path.cost += path[i].getCost();
            }
            return path;
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
                    var path = this.getPath(this.activeFune, this.activeFune.i, this.activeFune.j, tile.i, tile.j);
                    if (path.cost <= this.activeFune.getMovement()) {
                        var self = this;
                        utils.beginUIShield();
                        self.moveFune(self.activeFune, path, function() {
                            self.controller.endTurn();
                        });
                    }
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
                    var path = this.getPath(this.activeFune, this.activeFune.i, this.activeFune.j, tile.i, tile.j);
                    if (path.cost <= this.activeFune.getMovement()) {
                        this.mapMarker.frame = 0;
                    } else {
                        this.mapMarker.frame = 1;
                    }
                } else {
                    this.mapMarker.frame = 1;
                }
            }
        },

        drawMovementRange: function() {
            //console.log("update drawMovementRange");
            if (this.areaRangeLayer) {
                this.underLayer.removeChild(this.areaRangeLayer);
                delete this.areaRangeLayer;
            }

            this.areaRangeLayer = new Group();
            this.underLayer.addChild(this.areaRangeLayer);

            var openOnly = false;
            var moveList = this.getMovementRange(this.activeFune, openOnly);
            for (var positionIndex = 0; positionIndex < moveList.length; ++positionIndex) {
                var nextPostion = moveList[positionIndex];

                var areaSprite = new Sprite(64, 64);
                areaSprite.touchEnabled = false;
                areaSprite.image = game.assets[mapUI];
                if (nextPostion.open) {
                    areaSprite.frame = 2;
                } else {
                    areaSprite.frame = 3;
                }
                this.positonObject(areaSprite, nextPostion.i, nextPostion.j);
                this.areaRangeLayer.addChild(areaSprite);

            }
        },

        getMovementRange: function(fune, openOnly) {
            var funeList = this.controller.getFuneList();
            var moveList = [];

            for (var rangeI = -fune.getMovement(); rangeI <= fune.getMovement(); rangeI++) {
                var targetI = fune.i +rangeI;
                for (var rangeJ = -fune.getMovement(); rangeJ <= fune.getMovement(); rangeJ++) {
                    var targetJ = fune.j +rangeJ;

                    if (!this.outOfBorders(targetI, targetJ)) {
                        if (this.getManhattanDistance(fune.i, fune.j, targetI, targetJ) <= fune.getMovement()) {
                            var path = this.getPath(fune, fune.i, fune.j, targetI, targetJ);
                            if (path.cost <= fune.getMovement()) {
                                var position = this.getMapPositionAtTile(targetI, targetJ);
                                var isOpen = true;
                                if (this.tiles.hitTest(position.localX, position.localY) == true) {
                                    isOpen = false;
                                } else {
                                    for (var i=0; i < funeList.length; i++) {
                                        var otherFune = funeList[i];
                                        if (targetI == otherFune.i && targetJ == otherFune.j) {
                                            isOpen = false;
                                        }
                                    }
                                }
                                if (isOpen == false) {
                                    if (openOnly == false) {
                                        moveList.push({i:targetI, j:targetJ, open:false});
                                    }
                                } else {
                                    moveList.push({i:targetI, j:targetJ, open:true});
                                }
                            }
                        }
                    }
                }
            }

            return moveList;
        },

        zsort: function() {
            var zorder = [];
            for (var c=0; c < this.playLayer.childNodes.length; ++c) {
                zorder.push(this.playLayer.childNodes[c]);
            }
            zorder.sort(function(a, b) {
                if (a.y > b.y) {
                    return 1;
                } else if (a.y == b.y) {
                    if (a.x > b.x) {
                        return 1;
                    } else if (a.x == b.x) {
                        return 0;
                    } else {
                        return -1;
                    }
                } else {
                    return -1;
                }
            });
            for (var i=0; i < zorder.length; ++i) {
                this.playLayer.addChild(zorder[i]);
            }
        }
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

            var healthBackSprite   = new Sprite(64, 12);
            this.healthBackSprite  = healthBackSprite;
            healthBackSprite.image = game.assets[uiHealthBack];
            healthBackSprite.y     = 64 -6;
            this.addChild(healthBackSprite);

            var healthRedSprite   = new Sprite(64, 12);
            this.healthRedSprite  = healthRedSprite;
            healthRedSprite.originX = 0
            healthRedSprite.image = game.assets[uiHealthRed];
            healthRedSprite.y     = 64 -6;
            this.addChild(healthRedSprite);

            var healthGreenSprite   = new Sprite(64, 12);
            this.healthGreenSprite  = healthGreenSprite;
            healthGreenSprite.originX = 0
            healthGreenSprite.image = game.assets[uiHealthGreen];
            healthGreenSprite.y     = 64 -6;
            this.addChild(healthGreenSprite);

            this.stats    = {
                id:        id,
                movement:  stats.movement,
                range:     stats.range,
                attack:    stats.attack,
                defense:   stats.defense,
                hpMax:     stats.hpMax,
            };
            this.stats.hp = this.stats.hpMax;

            this.moveType   = "normal";
            this.usedSkill  = false;
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

        getSkillName: function() {
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
            //console.log("withinRange", "distance", distance, "range", this.stats.range, distance <= this.stats.range);
            if (distance <= this.stats.range) {
                return true;
            } else {
                return false;
            }
        },

        updateHPBar: function() {
            var ratio = Math.max(this.stats.hp / this.stats.hpMax, 0);
            if (ratio > 0.5) {
                this.healthGreenSprite.scaleX = ratio;
            } else {
                this.healthGreenSprite.scaleX = 0;
            }
            this.healthRedSprite.scaleX = ratio;
        },

        takeDamage: function(damage) {
            var actualDamage = Math.max(damage -this.stats.defense, 1);
            this.stats.hp -= actualDamage;
            this.updateHPBar();
            return this.stats.hp;
        },

        healDamage: function(recover) {
            this.stats.hp = Math.min(this.stats.hp + recover, this.stats.hpMax);
            this.updateHPBar();
        },

        attackFune: function(otherFune) {
            utils.beginUIShield();
            var damage;
            var baseDamage = this.stats.attack;
            var variance   = Math.random() -0.5;
            var variableDamage = (baseDamage /10) * variance;

            var attackRoll = Math.random();
            var isCritical = false;
            // クリティカルヒット 10%
            // ミス 10%
            if (attackRoll > 0.9) {
                // クリティカル　ダメージx2
                damage = (baseDamage +variableDamage) *2;
                var isCritical = true;
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

                var explosion = new Explosion();
                explosion.x = otherFune.x +32;
                explosion.y = otherFune.y +32;
                this.player.controller.sndManager.playFX(sndExplosion);
                game.currentScene.addChild(explosion);

                if (isCritical) {
                    var alertWindow = new AlertWindow("クリティカル！", this.player.controller);
                    var self = this;
                    alertWindow.onTouch = function() {
                        if (afterHp <= 0) {
                            var alertWindow = new AlertWindow("沈没...", self.player.controller);
                            alertWindow.onTouch = function() {
                                otherFune.sinkShip();
                                self.player.controller.endTurn();
                            }
                        } else {
                            self.player.controller.endTurn();
                        }
                    }
                } else {
                    if (afterHp <= 0) {
                        var alertWindow = new AlertWindow("沈没...", this.player.controller);
                        var self = this;
                        alertWindow.onTouch = function() {
                            otherFune.sinkShip();
                            self.player.controller.endTurn();
                        }
                    } else {
                        this.player.controller.endTurn();
                    }

                }

            } else {
                var alertWindow = new AlertWindow("ミス！", this.player.controller);
                var self = this;
                alertWindow.onTouch = function() {
                    self.player.controller.endTurn();
                }
            }
        },

        ontouchend: function(params) {
            if (this.player.isActive()) {
                if (this.player.getActiveFune() == this) {
                    var popup = new FunePopup(this);
                    popup.onCancel = function() {

                    }
                    var self = this;
                    popup.onSkill = function() {
                        if (self.canUseSkill()) {
                            self.activateSkill(function() {
                                self.player.controller.endTurn();
                            })
                        }
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
                    new AlertWindow("攻撃は届けません", this.player.controller);
                }
            }
        },

        activateSkill: function(onEnd) {
            utils.beginUIShield();
            this.usedSkill = true;
            var pirateChibi = new Sprite(512, 512);
            pirateChibi.image = this.getChibiImage();
            pirateChibi.opacity = 0;
            if (this.scaleX > 0) {
                pirateChibi.x = -50;
            } else {
                pirateChibi.x = 960 -512 +50;
            }
            var alertWindow = new AlertWindow(this.getSkillName(), this.player.controller);
            alertWindow.addChild(pirateChibi, alertWindow.firstChild);
            pirateChibi.tl.fadeIn(10);
            var self = this;
            alertWindow.onTouch = function() {
                self.processSkill(onEnd);
            }
        },

        processSkill: function(onEnd) {
            onEnd();
        },

        refreshSkill: function() {
            this.usedSkill = false;
        },

        canUseSkill: function() {
            return this.usedSkill == false;
        },

        sinkShip: function() {
            this.player.controller.sndManager.playFX(sndSinkShip);
            this.player.removeFune(this);
            this.fune.frame = this.fune.sinkFrame;
            this.counter = 1;
            this.onenterframe = function(){ // enterframe event listener
                this.counter++;
                if (this.counter == 12 ) {
                    this.parentNode.removeChild(this);
                }
            };
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
        },

        getSkillName: function() {
            return "オウエン";
        },

        processSkill: function(onEnd) {
            var count = this.player.getFuneCount();
            for(var i=0; i < count; i++) {
                var fune = this.player.getFune(i);
                var toHeal = Math.ceil(fune.getHPMax() /2);
                fune.healDamage(toHeal);
            }
            onEnd();
        },
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

            this.moveType   = "light";
            this.fune.frame = [8, 8, 8, 8, 9, 9, 9, 10, 10, 9, 9, 8, 8, 8, 8, 11, 11, 11];
            this.fune.sinkFrame = [11, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, null];
        },

        getCaptainName: function() {
            return "はやいちゃん";
        },

        getSkillName: function() {
            return "ハリーアップ";
        },

        processSkill: function(onEnd) {
            this.player.controller.getFreeTurns(this.player, 2);
            onEnd();
        },
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

            this.moveType   = "heavy";
            this.fune.frame = [16, 16, 16, 16, 17, 17, 17, 18, 18, 17, 17, 16, 16, 16, 16, 19, 19, 19];
            this.fune.sinkFrame = [19, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, null];
            this.indestructible = false;
        },

        getCaptainName: function() {
            return "かたいちゃん";
        },

        getSkillName: function() {
            return "アイロンシールド";
        },

        processSkill: function(onEnd) {
            this.indestructible = true;
            onEnd();
        },

        attackFune: function(otherFune) {
            this.indestructible = false;
            BaseFune.prototype.attackFune.call(this, otherFune);
        },

        takeDamage: function(damage) {
            if (this.indestructible) {
                this.indestructible = false
                return this.getHP()
            } else {
                return BaseFune.prototype.takeDamage.call(this, damage);
            }
        },
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
        },

        getSkillName: function() {
            return "バレットストーム";
        },

        processSkill: function(onEnd) {
            var damage = this.stats.attack;
            var count = this.player.controller.getNonActivePlayer().getFuneCount();
            for(var i=0; i < count; i++) {
                var fune = this.player.controller.getNonActivePlayer().getFune(i);
                if (this.withinRange(fune.i, fune.j)) {
                    var afterHp = fune.takeDamage(damage);
                    var explosion = new Explosion();
                    explosion.x = fune.x +32;
                    explosion.y = fune.y +32;
                    this.player.controller.sndManager.playFX(sndExplosion);
                    game.currentScene.addChild(explosion);

                    if (afterHp <= 0) {
                        fune.sinkShip();
                    }
                }
            }
            onEnd();
        },
    });

    var TekiFune = Class.create(BaseFune, {
        initialize: function(id) {
            BaseFune.call(this, id, {
                movement:  4,
                range:     3,
                attack:   50,
                defense:  40,
                hpMax:    50,
            });

            this.moveType   = "light";
            this.fune.frame = [32, 32, 32, 32, 33, 33, 34, 34, 34, 33, 33, 32, 32, 32, 32, 35, 35, 35];
            this.fune.sinkFrame = [35, 35, 35, 36, 36, 37, 37, 38, 38, 39, 39, null];
        },

        getCaptainName: function() {
            return "テシタちゃん";
        },

        getSkillName: function() {
            return "パワーアップ";
        },

        processSkill: function(onEnd) {
            this.stats.attack  += 10;
            this.stats.defense += 10;
            onEnd();
        },
    });

    var BossFune = Class.create(KougekiFune, {
        initialize: function(id) {
            BaseFune.call(this, id, {
                movement:  3,
                range:     3,
                attack:  100,
                defense:  60,
                hpMax:   240,
            });

            this.moveType   = "normal";
            this.fune.frame = [40, 40, 40, 40, 41, 41, 41, 42, 42, 41, 41, 40, 40, 40, 40, 43, 43, 43];
            this.fune.sinkFrame = [43, 43, 43, 44, 44, 45, 45, 46, 46, 47, 47, null];
        },

        getCaptainName: function() {
            return "ボス";
        },

        getSkillName: function() {
            return "カミワザ";
        },

        processSkill: function(onEnd) {
            var count = this.player.getFuneCount();
            for(var i=0; i < count; i++) {
                var fune = this.player.getFune(i);
                var toHeal = Math.ceil(fune.getHPMax() /4);
                fune.healDamage(toHeal);
            }

            var damage = this.stats.attack;
            var count = this.player.controller.getNonActivePlayer().getFuneCount();
            for(var i=0; i < count; i++) {
                var fune = this.player.controller.getNonActivePlayer().getFune(i);
                if (this.withinRange(fune.i, fune.j)) {
                    var afterHp = fune.takeDamage(damage);
                    var explosion = new Explosion();
                    explosion.x = fune.x +32;
                    explosion.y = fune.y +32;
                    this.player.controller.sndManager.playFX(sndExplosion);
                    game.currentScene.addChild(explosion);

                    if (afterHp <= 0) {
                        fune.sinkShip();
                    }
                }
            }
            onEnd();
        },
    });

    var Explosion = Class.create(Sprite, {
        initialize: function(id, stats) {
            Sprite.call(this, 32, 32);

            this.image = game.assets[explosionSpriteSheet];
            this.frame = [0,1,2,3,1,2,3,4,null];

            this.counter = 0;
        },
        onenterframe:function(){ // enterframe event listener
            this.counter++;
            if (this.counter == 9 ) {
                this.parentNode.removeChild(this);
            }
        },
    });

    /**
     * プレイヤー
     */
    var GamePlayer = Class.create({
        initialize: function(id, data) {
            this.funeList = [];
            this.id   = id;
            this.data = data;
            this.funeCountInitial = 0;
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
            this.funeList.push(fune);
            this.funeCountInitial++;
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

        getFuneCountInitial: function() {
            return this.funeCountInitial;
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

    var AIPlayer = Class.create(GamePlayer, {
        initialize: function(id, data) {
            GamePlayer.call(this, id, data);
            this.state = new OpeningState(this);
        },

        resetState: function() {
            this.state = new OpeningState(this);
            this.funeCountInitial = 0;
        },

        simulatePlay: function() {
            this.state = this.state.updateState();
            var action = this.state.chooseAction();

            this.setActiveFune(action.fune);

            var self = this;
            setTimeout(function() {
                switch(action.type) {
                    case "attack":
                        action.fune.attackFune(action.target);
                        break;
                    case "skill":
                        action.fune.activateSkill(function() {
                            self.controller.endTurn();
                        })
                        break;
                    case "move":
                        if (action.path && action.path.length > 0) {
                            self.controller.map.moveFune(action.fune, action.path, function() {
                                self.controller.endTurn();
                            })
                        } else {
                            self.controller.endTurn();
                        }
                        break;
                }
            }, 1000);
        },
    });

    var BaseState = Class.create({
        initialize: function(player) {
            this.player = player;
        },

        updateState: function() {
            return this;
        },

        chooseAction: function() {
            // Choose randomly
            var maxFuneIndex = this.player.getFuneCount();
            var funeIndex    = Math.floor(Math.random() * maxFuneIndex);
            var fune         = this.player.getFune(funeIndex);

            // Use skill randomly
            if (fune.canUseSkill() && Math.random() < 0.1) {
                return {
                    type: "skill",
                    fune: fune,
                }
            }

            // Search for nearby enemies
            var count = this.player.controller.getNonActivePlayer().getFuneCount();
            for(var i=0; i < count; i++) {
                var targetFune = this.player.controller.getNonActivePlayer().getFune(i);
                if (fune.withinRange(targetFune.i, targetFune.j)) {
                    return {
                        type:   "attack",
                        fune:   fune,
                        target: targetFune,
                    }
                }
            }

            // If no actions taken then move randomly
            var openOnly = true;
            var moveList = this.player.controller.map.getMovementRange(fune, openOnly);
            var randomIndex = Math.floor(Math.random() * moveList.length);
            var targetPosition = moveList[randomIndex];

            var path     = this.player.controller.map.getPath(fune, fune.i, fune.j, targetPosition.i, targetPosition.j);
            return {
                type:"move",
                fune: fune,
                path: path,
            };
        },

        getRandomFune: function() {
            var maxFuneIndex = this.player.getFuneCount();
            var funeIndex    = Math.floor(Math.random() * maxFuneIndex);
            var fune         = this.player.getFune(funeIndex);
            return fune;
        },

        getTargetsWithinRange: function(fune) {
            var targets    = [];
            var otherCount = this.player.controller.getNonActivePlayer().getFuneCount();
            for(var j=0; j < otherCount; j++) {
                var targetFune = this.player.controller.getNonActivePlayer().getFune(j);
                if (fune.withinRange(targetFune.i, targetFune.j)) {
                    targets.push(targetFune);
                }
            }
            return targets;
        },

        isTargeted: function(fune) {
            var otherCount = this.player.controller.getNonActivePlayer().getFuneCount();
            for(var j=0; j < otherCount; j++) {
                var targetFune = this.player.controller.getNonActivePlayer().getFune(j);
                if (targetFune.withinRange(fune.i, fune.j)) {
                    return true;
                }
            }
            return false;
        },

        getMovePosition: function(fune, avoidEnemyRate) {
            var openOnly = true;
            var moveList = this.player.controller.map.getMovementRange(fune, openOnly);
            var moveTargetList = [];
            for (var i=0; i < moveList.length; i++) {
                var targetPosition = moveList[i];
                var otherCount = this.player.controller.getNonActivePlayer().getFuneCount();
                for(var j=0; j < otherCount; j++) {
                    var otherFune = this.player.controller.getNonActivePlayer().getFune(j);
                    if (otherFune.withinRange(targetPosition.i, targetPosition.j)) {
                        if (Math.random() < avoidEnemyRate) {
                            continue;
                        }
                    }
                    moveTargetList.push(targetPosition)
                }
            }
            return moveTargetList;
        },

        getRandomPath: function(fune, avoidEnemyRate) {
            var moveList = this.getMovePosition(fune, avoidEnemyRate);
            var pathList = [];
            for (var i=0; i < moveList.length; i++) {
                var targetPosition = moveList[i];
                var path = this.player.controller.map.getPath(fune, fune.i, fune.j, targetPosition.i, targetPosition.j);
                if (path.length > 0) {
                    pathList.push(path);
                }
            }

            var path = pathList[Math.floor(Math.random() * pathList.length)];
            return path;
        },

        sortPathByLength: function(pathList) {
            pathList.sort(function(a, b) {
              if (a.length < b.length)
                 return 1;
              if (a.length > b.length)
                return -1;
              return 0;
            });
            return pathList;
        },

        testSkillUseInCombat: function(fune) {
            if (fune.canUseSkill()) {
                if (fune instanceof CaptainFune) {
                    // Should Captain Heal ships?
                    var count = this.player.getFuneCount();
                    var woundedCount = 0;
                    for(var j=0; j < count; j++) {
                        var woundedFune = this.player.getFune(j);
                        if (woundedFune.getHP() < (woundedFune.getHPMax() *0.7)) {
                            woundedCount++;
                        }
                    }
                    if (Math.random() <= (woundedCount/this.player.getFuneCount()) ) {
                        return {
                            type: "skill",
                            fune: fune,
                        }
                    }
                } else if (fune instanceof KougekiFune) {
                    // Should kougeki use attack skill
                    var targetCount = 0;
                    // look for attack targets
                    var otherCount = this.player.controller.getNonActivePlayer().getFuneCount();
                    for(var j=0; j < otherCount; j++) {
                        var targetFune = this.player.controller.getNonActivePlayer().getFune(j);
                        if (fune.withinRange(targetFune.i, targetFune.j)) {
                            targetCount++;
                        }
                    }
                    if (Math.random() <= (targetCount *0.3) ) {
                        return {
                            type: "skill",
                            fune: fune,
                        }
                    }
                } else {
                    // Other skills are used randomly
                    if (Math.random() < 0.2) {
                        return {
                            type: "skill",
                            fune: fune,
                        }
                    }
                }
            }
            return;
        }
    });

    var OpeningState = Class.create(BaseState, {
        updateState: function() {
            var count = this.player.getFuneCount();
            for(var i=0; i < count; i++) {
                var fune    = this.player.getFune(i);
                var targets = this.getTargetsWithinRange(fune);
                if (targets.length > 0) {
                    console.log("AI switch from OpeningState to MidGameState");
                    return new MidGameState(this.player);
                }
            }
            console.log("AI in OpeningState");
            return this;
        },

        chooseAction: function() {
            var fune         = this.getRandomFune();

            // Skill
            if (fune instanceof KataiFune) {
                if (fune.canUseSkill() && Math.random() < 0.3) {
                    console.log("AI use skill", fune.getCaptainName(), fune.getSkillName());
                    return {
                        type: "skill",
                        fune: fune,
                    }
                }
            } else {
                // Other skills are not used in Opening Phase
            }

            // If no actions taken then move randomly
            var moveList = this.getMovePosition(fune, 0.25);
            var pathList = [];
            for (var i=0; i < moveList.length; i++) {
                var targetPosition = moveList[i];
                if (targetPosition.i <= (fune.i +2) && targetPosition.j >= (fune.j -2)) {
                    pathList.push(this.player.controller.map.getPath(fune, fune.i, fune.j, targetPosition.i, targetPosition.j));
                }
            }
            // Longer paths first
            pathList = this.sortPathByLength(pathList);
            // Choose from the 30% longest paths
            var randomLongPathIndex = Math.floor(Math.random() *(pathList.length *0.3));
            var path = pathList[randomLongPathIndex];
            if (path == null) {
                console.log("AI no safe path");
                path = this.getRandomPath(fune, 0.0);
            }
            console.log("AI random long Move", fune.getCaptainName());
            return {
                type: "move",
                fune: fune,
                path: path,
            };
        },
    });

    var MidGameState = Class.create(BaseState, {
        updateState: function() {
            // We are losing
            if (this.player.getFuneCount() <= Math.ceil(this.player.getFuneCountInitial() /2)) {
                console.log("AI switch from MidGameState to EndGameBadState");
                return new EndGameBadState(this.player);
            }
            // We are winning
            if (this.player.controller.getNonActivePlayer().getFuneCount() <= Math.ceil(this.player.controller.getNonActivePlayer().getFuneCountInitial() /2)) {
                console.log("AI switch from MidGameState to EndGameGoodState");
                return new EndGameGoodState(this.player);
            }
            console.log("AI in MidGameState");
            return this;
        },

        chooseAction: function() {
            var count = this.player.getFuneCount();
            for(var i=0; i < count; i++) {
                var fune = this.player.getFune(i);

                // skill を使う
                var skillUse = this.testSkillUseInCombat(fune);
                if (skillUse) {
                    console.log("AI use skill", fune.getCaptainName(), fune.getSkillName());
                    return skillUse;
                }

                // look for attack targets
                var targets = this.getTargetsWithinRange(fune);
                if (targets.length > 0) {
                    if (Math.random() < 0.7) {
                        var target = targets[Math.floor(Math.random() *targets.length)];
                        console.log("AI attack from", fune.getCaptainName(), "on", target.getCaptainName());
                        return {
                            type:   "attack",
                            fune:   fune,
                            target: target,
                        }
                    }
                }

                //wounded ships try to escape
                if (fune.getHP() < (fune.getHPMax() * 0.5) ) {
                    if (Math.random() < 0.3) {
                        if (this.isTargeted(fune)) {
                            var path = this.getRandomPath(fune, 0.9);
                            if (path) {
                                console.log("AI escaping", fune.getCaptainName());
                                return {
                                    type:"move",
                                    fune: fune,
                                    path: path,
                                }
                            }
                        }
                    }
                }
            }
            // If no actions taken then move randomly
            var fune = this.getRandomFune();
            var path = this.getRandomPath(fune, 0.5);
            if (path == null) {
                console.log("AI no safe path");
                path = this.getRandomPath(fune, 0.0);
            }
            console.log("AI random move", fune.getCaptainName());
            return {
                type:"move",
                fune: fune,
                path: path,
            }
        },
    });

    var EndGameGoodState = Class.create(BaseState, {
        updateState: function() {
            if (this.player.getFuneCount() < this.player.controller.getNonActivePlayer().getFuneCount()) {
                console.log("AI switch from EndGameGoodState to EndGameBadState");
                return new EndGameBadState(this.player);
            }
            console.log("AI in EndGameGoodState");
            return this;
        },

        chooseAction: function() {
            var count = this.player.getFuneCount();
            for(var i=0; i < count; i++) {
                var fune = this.player.getFune(i);

                // skill を使う
                var skillUse = this.testSkillUseInCombat(fune);
                if (skillUse) {
                    console.log("AI use skill", fune.getCaptainName(), fune.getSkillName());
                    return skillUse;
                }

                // look for attack targets
                var targets = this.getTargetsWithinRange(fune);
                if (targets.length > 0) {
                    if (Math.random() < 0.9) {
                        var target = targets[Math.floor(Math.random() *targets.length)];
                        console.log("AI attack from", fune.getCaptainName(), "on", target.getCaptainName());
                        return {
                            type:   "attack",
                            fune:   fune,
                            target: target,
                        }
                    }
                }
            }
            // If no actions taken then move randomly
            var fune = this.getRandomFune();
            var path = this.getRandomPath(fune, 0.5);
            if (path == null) {
                console.log("AI no safe path");
                path = this.getRandomPath(fune, 0.0);
            }
            console.log("AI random move", fune.getCaptainName());
            return {
                type:"move",
                fune: fune,
                path: path,
            }
        },
    });

    var EndGameBadState = Class.create(BaseState, {
        updateState: function() {
            if (this.player.getFuneCount() > this.player.controller.getNonActivePlayer().getFuneCount()) {
                console.log("AI switch from EndGameBadState to EndGameGoodState");
                return new EndGameGoodState(this.player);
            }
            console.log("AI in EndGameBadState");
            return this;
        },

        chooseAction: function() {
            var count = this.player.getFuneCount();
            for(var i=0; i < count; i++) {
                var fune = this.player.getFune(i);

                //wounded ships try to escape
                if (fune.getHP() < (fune.getHPMax() * 0.5) ) {
                    if (Math.random() < 0.5) {
                        if (this.isTargeted(fune)) {
                            var path = this.getRandomPath(fune, 0.9);
                            if (path) {
                                console.log("AI escaping", fune.getCaptainName());
                                return {
                                    type:"move",
                                    fune: fune,
                                    path: path,
                                }
                            }
                        }
                    }
                }

                // skill を使う
                var skillUse = this.testSkillUseInCombat(fune);
                if (skillUse) {
                    console.log("AI use skill", fune.getCaptainName(), fune.getSkillName());
                    return skillUse;
                }

                // look for attack targets
                var targets = this.getTargetsWithinRange(fune);
                if (targets.length > 0) {
                    if (Math.random() < 0.9) {
                        var target = targets[Math.floor(Math.random() *targets.length)];
                        console.log("AI attack from", fune.getCaptainName(), "on", target.getCaptainName());
                        return {
                            type:   "attack",
                            fune:   fune,
                            target: target,
                        }
                    }
                }
            }
            // If no actions taken then move randomly
            var fune = this.getRandomFune();
            var path = this.getRandomPath(fune, 0.8);
            if (path == null) {
                console.log("AI no safe path");
                path = this.getRandomPath(fune, 0.0);
            }
            console.log("AI random move", fune.getCaptainName());
            return {
                type:"move",
                fune: fune,
                path: path,
            }
        },
    });


    /**
     * ゲーム管理クラス
     */
    var GameManager = Class.create({
        initialize: function() {
            this.playerList = [];
            this.turnCounter = 0;
            this.mode = "";

            this.sndManager = new SoundManager();
        },

        addPlayer: function(player) {
            player.setController(this);
            this.playerList.push(player)
        },

        setMap: function(map) {
            map.setController(this);
            this.map = map;
        },

        setFrameUI: function(ui) {
            this.frameUI = ui;
            ui.manager = this;
        },

        setStartPositions: function(startPositions) {
            this.startPositions = startPositions;
        },

        getActivePlayer: function() {
            return this.playerList[this.turnCounter % this.playerList.length];
        },

        getPlayer: function(number) {
            return this.playerList[number -1];
        },

        getNonActivePlayer: function() {
           return this.playerList[(this.turnCounter +1) % this.playerList.length];
        },

        getFuneList: function() {
            var funeList = [];
            var player1 = this.getPlayer(1);
            for(var i=0; i < player1.getFuneCount(); i++) {
                funeList.push(player1.getFune(i));
            }
            var player2 = this.getPlayer(2);
            for(var i=0; i < player2.getFuneCount(); i++) {
                funeList.push(player2.getFune(i));
            }
            return funeList;
        },

        beginVersusGame: function(opponent) {
            this.mode = "versus";

            // 船の初期の位置
            var startPositions = {
                player1: [
                    {i: 0, j: 8}, {i: 0, j: 6}, {i: 1, j: 7}, {i: 2, j: 8}
                ],
                player2: [
                    {i: 12, j: 0}, {i: 10, j: 0}, {i: 11, j: 1}, {i: 12, j: 2}
                ],
            }
            this.setStartPositions(startPositions);

            // プレイヤー１
            var player1 = new GamePlayer(1, {name:"プレイヤー１"});
            this.addPlayer(player1);
            // プレイヤー1に船を４つあげよう
            player1.addFune(new CaptainFune(1));
            player1.addFune(new HayaiFune(2));
            player1.addFune(new KataiFune(3));
            player1.addFune(new KougekiFune(4));

            this.placePlayerShips(player1);

            // プレイヤー２
            var player2;
            if (opponent == "human") {
                player2 = new GamePlayer(2, {name:"プレイヤー２"});
            } else if (opponent == "ai") {
                player2 = new AIPlayer(2, {name:"プレイヤー２"});
            }

            this.addPlayer(player2);
            // プレイヤー1に船を４つあげよう
            player2.addFune(new CaptainFune(1));
            player2.addFune(new HayaiFune(2));
            player2.addFune(new KataiFune(3));
            player2.addFune(new KougekiFune(4));

            this.placePlayerShips(player2);

            this.sndManager.playBGM();
            this.startTurn();
        },

        beginCampaignGame: function(stageId) {
            this.mode = "campaign";

            var funeList;
            var saveData = $.jStorage.get("save data");
            if (saveData) {
                stageId  = saveData.stageId;
                funeList = saveData.funeList;
            }

            // プレイヤー１
            var player1 = new GamePlayer(1, {name:"プレイヤー１"});
            this.addPlayer(player1);

            if (funeList) {
                for(var funeIndex = 0; funeIndex < funeList.length; funeIndex++) {
                    var fune = this.funeFactory(funeList[funeIndex]);
                    player1.addFune(fune);
                }
            } else {
                // プレイヤー1に船を４つあげよう
                player1.addFune(new CaptainFune(1));
                player1.addFune(new HayaiFune(2));
                player1.addFune(new KataiFune(3));
                player1.addFune(new KougekiFune(4));
            }

            // 船の初期の位置
            var startPositions = {
                player1: [
                    {i: 0, j: 8}, {i: 0, j: 6}, {i: 1, j: 7}, {i: 2, j: 8}
                ],
            }
            this.setStartPositions(startPositions);

            this.placePlayerShips(player1);

            if (this.getPlayer(2) == undefined) {
                var player2 = new AIPlayer(2, {name:"敵"});
                this.addPlayer(player2);
            }

            if (stageId) {
                this.setupStage(stageId);
            } else {
                this.setupStage(1);
            }

            this.sndManager.playBGM();
            this.startTurn();
        },

        placePlayerShips: function(player) {
            for(var funeIndex = 0; funeIndex < player.getFuneCount(); funeIndex++) {
                var fune = player.getFune(funeIndex);
                this.map.addChild(fune);
                var startPosition
                if (player.id == 1) {
                    startPosition = this.startPositions.player1[funeIndex];
                } else {
                    startPosition = this.startPositions.player2[funeIndex];
                }
                this.map.positionFune(fune, startPosition.i, startPosition.j);
            }
        },

        refreshPlayer: function(player) {
            for(var funeIndex = 0; funeIndex < player.getFuneCount(); funeIndex++) {
                var fune = player.getFune(funeIndex);
                var recoverHp = fune.getHPMax();
                fune.healDamage(recoverHp);
                fune.refreshSkill();
            }
            this.placePlayerShips(player);
            this.turnCounter = 0;
            this.skipTurns = 0;
            if (player instanceof AIPlayer) {
                player.resetState();
            }
        },

        setupStage: function(stageId) {
            this.stageId = stageId;
            this.frameUI.updateStage(stageId);

            var saveData = {
                stageId: stageId,
                funeList: [],
            };

            var player = this.getPlayer(1);
            for(var funeIndex = 0; funeIndex < player.getFuneCount(); funeIndex++) {
                var fune = player.getFune(funeIndex);
                saveData.funeList.push(fune.getId());
            }
            $.jStorage.set("save data", saveData);

            var player2 = this.getPlayer(2);
            var stageIndex = (stageId-1) % StageData.length;
            var stageData = StageData[stageIndex];
            for(var i=0; i< stageData.startPositions.length; i++) {
                var entry = stageData.startPositions[i];

                var fune = this.funeFactory(entry.type);
                fune.originX = 32;
                fune.scaleX = -1;
                player2.addFune(fune);
                this.map.addChild(fune);
                this.map.positionFune(fune, entry.i, entry.j);
            }
        },

        startTurn: function() {
            utils.endUIShield();
            var player = this.getActivePlayer();
            if (this.skipTurns) {
                if (player != this.skipper) {
                    this.skipTurns--;
                    utils.beginUIShield();
                    return this.endTurn();
                }
            }
            player.setActive(true);
            this.updateTurn();
            if (player instanceof AIPlayer) {
                utils.beginUIShield();
                player.simulatePlay();
            }
        },

        updateTurn: function() {
            this.map.setActiveFune(this.getActivePlayer().getActiveFune());
            this.map.drawMovementRange();
            this.frameUI.updateTurn(this.turnCounter);
            this.frameUI.updatePlayer(this.getActivePlayer().getData("name"));
            this.sndManager.playFX(sndChangeShips);
        },

        endTurn: function() {
            var player = this.getActivePlayer();
            player.setActive(false);

            var winner = this.getWinner();
            if (winner) {
                var self = this;
                setTimeout(function(){
                    if (self.mode == "versus") {
                        self.versusOver(winner);
                    } else if (self.mode == "campaign") {
                        self.campaignOver(winner);
                    }
                }, 1000);
            } else {
                this.turnCounter++;

                var playerBanner = new Sprite(512, 256);
                if (player.id == 1) {
                    playerBanner.image = game.assets[uiPlayerBanner2];
                } else if (player.id == 2) {
                    playerBanner.image = game.assets[uiPlayerBanner1];
                }

                playerBanner.opacity = 0;
                playerBanner.x = 480 -256;
                playerBanner.y = 320 -128;
                game.currentScene.addChild(playerBanner);

                var self = this;
                playerBanner.tl.fadeIn(20).delay(30).fadeOut(10).then(function() {
                    self.startTurn();
                    game.currentScene.removeChild(playerBanner);
                })
            }
        },

        versusOver: function(winner) {
            var touchable = new ShieldWindow(this);
            utils.beginUIShield();

            var playerBanner = new Sprite(512, 256);
            if (winner.id == 1) {
                playerBanner.image = game.assets[uiPlayerBanner1];
            } else if (winner.id == 2) {
                playerBanner.image = game.assets[uiPlayerBanner2];
            }

            playerBanner.opacity = 0;
            playerBanner.x = 480 -256;
            playerBanner.y = 320 -128;
            game.currentScene.addChild(playerBanner);

            var self = this;
            playerBanner.tl.fadeIn(20).delay(30).fadeOut(10).then(function() {
                game.currentScene.removeChild(playerBanner);

                var resultBanner = new Sprite(512, 256);
                resultBanner.image = game.assets[uiWin];
                resultBanner.opacity = 0;
                resultBanner.touchEnabled = false;
                resultBanner.x = 480 -256;
                resultBanner.y = 320 -128;
                game.currentScene.addChild(resultBanner);

                resultBanner.tl.fadeIn(20).then(function(){
                    touchable.onTouch = function() {
                        location.reload();
                    };
                    utils.endUIShield();
                });
            });
        },

        campaignOver: function(winner) {
            var touchable = new ShieldWindow(this);
            utils.beginUIShield();

            var playerBanner = new Sprite(512, 256);
            playerBanner.image = game.assets[uiPlayerBanner1];

            playerBanner.opacity = 0;
            playerBanner.x = 480 -256;
            playerBanner.y = 320 -128;
            game.currentScene.addChild(playerBanner);

            var self = this;
            playerBanner.tl.fadeIn(20).delay(30).fadeOut(10).then(function() {
                game.currentScene.removeChild(playerBanner);

                var resultBanner = new Sprite(512, 256);
                if (winner.id == 1) {
                    resultBanner.image = game.assets[uiWin];
                    touchable.onTouch = function() {
                        self.refreshPlayer(self.getPlayer(1));
                        self.refreshPlayer(self.getPlayer(2));
                        self.setupStage(self.stageId +1);
                        self.startTurn();
                    };
                } else if (winner.id == 2) {
                    resultBanner.image = game.assets[uiLose];
                    var tweet = new TwitterButton({
                        stageId: self.stageId,
                        url: "https://dl.dropboxusercontent.com/u/4325065/pirateTactics/enchant.js-builds-0.8.1/game/pirates/head/index.html"
                    });
                    touchable.addChild(tweet);
                    tweet.x = 480 -32;
                    tweet.y = 450;

                    touchable.onTouch = function() {
                        $.jStorage.deleteKey("save data");
                        location.reload();
                    };
                }
                resultBanner.opacity = 0;
                resultBanner.touchEnabled = false;
                resultBanner.x = 480 -256;
                resultBanner.y = 320 -128;
                game.currentScene.addChild(resultBanner);

                resultBanner.tl.fadeIn(20).then(function(){
                    utils.endUIShield();
                });
            });
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

        openSettings: function() {
            new SettingsWindow(this);
        },

        getFreeTurns: function(player, turns) {
            this.skipper = player;
            this.skipTurns = turns;
        },

        funeFactory: function(name) {
            switch(name) {
                case 1:
                case "captain":
                    return new CaptainFune(1);
                case 2:
                case "hayai":
                    return new HayaiFune(2);
                case 3:
                case "katai":
                    return new KataiFune(3);
                case 4:
                case "kougeki":
                    return new KougekiFune(4);
                case 5:
                case "teki":
                    return new TekiFune(5);
                case 6:
                case "boss":
                    return new BossFune(6);
            }
        },
    })

    /**
     * ターン関係の情報を表示するクラス
     */
    var FrameUI = Class.create({
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

            this.stageLabel = new Label();
            scene.addChild(this.stageLabel);
            this.stageLabel.x = 64*8;
            this.stageLabel.y = 640 -40;
            this.stageLabel.font = fontStyle;
            this.stageLabel.color = fontColor;

            this.settingsButton = new Sprite(64, 64);
            scene.addChild(this.settingsButton);
            this.settingsButton.image = game.assets[uiSettingsSprite];
            this.settingsButton.x = 64*14;
            this.settingsButton.y = 640 -64;

            var self = this;
            this.settingsButton.addEventListener(enchant.Event.TOUCH_START, function(params) {
                self.settingsButton.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT)
                new SettingsWindow(self.manager);
            });

            this.settingsButton.addEventListener(enchant.Event.TOUCH_END, function(params) {
                self.settingsButton.tl.scaleTo(1.0, 3);
            });
        },

        updateTurn: function(turn) {
            this.turnLabel.text = "ターン:"+turn;
        },

        updatePlayer: function(name) {
            this.playerLabel.text = name;
        },

        updateStage: function(stageId) {
            this.stageLabel.text = "ステージ:"+stageId;
        }

    })

    /**
     * オーディオ管理
     */
    var SoundManager = Class.create(Sprite, {
        initialize: function() {
            Sprite.call(this, 1,1);
            this.volume = $.jStorage.get("sound volume", 0.5);
            this.bgmPlaying = false;
        },

        playBGM: function() {
            this.bgmPlaying = true;

            game.assets[sndBGM].play();
            if(game.assets[sndBGM].src){
                game.assets[sndBGM].src.loop = true;
            } else {
                game.currentScene.addChild(this);
            }
            game.assets[sndBGM].volume = this.volume *0.3;
        },

        playFX: function(name) {
            var fx = game.assets[name].clone();
            fx.play();
            fx.volume = this.volume;
        },

        pauseBGM: function() {
            this.bgmPlaying = false;
            game.assets[sndBGM].pause();
        },

        stopBGM: function() {
            this.bgmPlaying = false;
            game.assets[sndBGM].stop();
        },

        volumeUp: function() {
            this.volume += 0.05;
            if (this.volume > 1) {
                this.volume = 1;
            }
            console.log("volume", this.volume);
            $.jStorage.set("sound volume", this.volume);
            game.assets[sndBGM].volume = this.volume *0.3;
            this.playFX(sndClick);
        },

        volumeDown: function() {
            this.volume -= 0.05;
            if (this.volume < 0) {
                this.volume = 0;
            }
            console.log("volume", this.volume);
            $.jStorage.set("sound volume", this.volume);
            game.assets[sndBGM].volume = this.volume *0.3;
            this.playFX(sndClick);
        },

        getVolume: function() {
            return this.volume;
        },

        onenterframe: function(){
            if (this.bgmPlaying) {
                game.assets[sndBGM].play();
            }
        },
    })

    /**
     * キャラのポップアップウィンドー
     */
    var FunePopup = Class.create(Scene, {
        initialize: function(fune) {
            Scene.call(this);
            game.pushScene(this);

            fune.player.controller.sndManager.playFX(sndClick);

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

            var skillBtnSprite = new Sprite(128, 64);
            skillBtnSprite.image = game.assets[uiSkillBtnSprite];
            skillBtnSprite.x = 64 *4;
            skillBtnSprite.y = 512 -64 -32;
            windowGroup.addChild(skillBtnSprite);

            if (fune.usedSkill) {
                skillBtnSprite.opacity = 0.5;
            }

            windowGroup.originX = 256;
            windowGroup.originY = 256;
            windowGroup.scaleX = 0.7;
            windowGroup.scaleY = 0.7;
            windowGroup.tl.scaleTo(1, 10, enchant.Easing.ELASTIC_EASEOUT).then(function() {
                pirate.y = -50;
                pirate.tl.moveBy(-50, -25, 5).and().fadeIn(10);

                cancelBtnSprite.addEventListener(enchant.Event.TOUCH_START, function(params) {
                    cancelBtnSprite.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT)
                });

                cancelBtnSprite.addEventListener(enchant.Event.TOUCH_END, function(params) {
                    shieldSprite.tl.fadeTo(0, 5);
                    cancelBtnSprite.tl.scaleTo(0.9, 3).and().fadeTo(0, 5);
                    pirate.tl.fadeTo(0, 5);
                    windowSprite.tl.fadeTo(0, 5).then(function() {
                        game.popScene();
                        fune.player.controller.sndManager.playFX(sndClick);
                        if (self.onCancel) {
                            self.onCancel()
                        }
                    });
                });

                if (fune.usedSkill == false) {
                    skillBtnSprite.addEventListener(enchant.Event.TOUCH_START, function(params) {
                        skillBtnSprite.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT)
                    });

                    skillBtnSprite.addEventListener(enchant.Event.TOUCH_END, function(params) {
                        shieldSprite.tl.fadeTo(0, 5);
                        skillBtnSprite.tl.scaleTo(0.9, 3).and().fadeTo(0, 5);
                        pirate.tl.fadeTo(0, 5);
                        windowSprite.tl.fadeTo(0, 5).then(function() {
                            game.popScene();
                            fune.player.controller.sndManager.playFX(sndClick);
                            if (self.onSkill) {
                                self.onSkill()
                            }
                        });
                    });
                }
            });
        },
    })


    var TwitterButton = Class.create(Sprite, {
        initialize: function(options) {
            Sprite.call(this, 64, 64);
            this.image = game.assets[uiTwitterBtnSprite];
            this.stageId = options.stageId;
            this.url     = options.url;
        },

        ontouchend: function(params) {
            window.open("https://twitter.com/intent/tweet?url="+encodeURIComponent(this.url)+"&text="+encodeURIComponent("ステージ"+this.stageId+"まで行けました！みんなはどこまで行ける？")+"&hashtags=piratesTactics,海賊", "twitter", "top=50, left=50, width=500, height=400");
        }
    })
    /**
     * シールドタッチのポップアップウィンドー
     */
    var ShieldWindow = Class.create(Scene, {
        initialize: function(gameManager) {
            Scene.call(this);
            game.pushScene(this);

            gameManager.sndManager.playFX(sndClick);

            var shieldSprite = new Sprite(960, 640);
            shieldSprite.image = game.assets[ui1x1Black];
            shieldSprite.opacity = 0.5
            this.addChild(shieldSprite);

            var self = this;
            shieldSprite.addEventListener(enchant.Event.TOUCH_END, function(params) {
                if (self.onTouch) {
                    gameManager.sndManager.playFX(sndClick);
                    game.popScene();
                    self.onTouch();
                }
            });
        }
    })

    var AlertWindow = Class.create(Scene, {
        initialize: function(message, gameManager) {
            Scene.call(this);
            game.pushScene(this);

            var shieldSprite = new Sprite(960, 640);
            shieldSprite.image = game.assets[ui1x1Black];
            shieldSprite.opacity = 0.2
            this.addChild(shieldSprite);

            var windowSprite = new Sprite(320, 160);
            windowSprite.image = game.assets[uiAlertScreen];
            windowSprite.x = (960 -320)/2;
            windowSprite.y = (640 -160)/2;
            this.addChild(windowSprite);

            var fontColor = "rgba(255, 255, 105, 1.0)";

            messageLabel = new Label(message);
            this.addChild(messageLabel);
            messageLabel.x = windowSprite.x +40;
            messageLabel.y = windowSprite.y +64;
            messageLabel.font = fontStyle;
            messageLabel.color = fontColor;

            var once = false;
            var self = this;
            this.addEventListener(enchant.Event.TOUCH_END, function(params) {
                if (once == false) {
                    once = true;
                    windowSprite.tl.fadeTo(0, 5).then(function() {
                        gameManager.sndManager.playFX(sndClick);
                        game.popScene();
                        if (self.onTouch) {
                            self.onTouch();
                        }
                    });
                }
            });
        },
    })

    /**
     * キャラのポップアップウィンドー
     */
    var SettingsWindow = Class.create(Scene, {
        initialize: function(gameManager) {
            Scene.call(this);
            game.pushScene(this);

            gameManager.sndManager.playFX(sndClick);

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

            var settingsGroup = new Group();
            settingsGroup.x = 64;
            settingsGroup.y = 32;
            windowGroup.addChild(settingsGroup);

            var fontColor = "rgba(255, 255, 105, 1.0)";

            soundLabel = new Label("音量");
            settingsGroup.addChild(soundLabel);
            soundLabel.x = 0;
            soundLabel.y = 16;
            soundLabel.font = fontStyle;
            soundLabel.color = fontColor;

            var sndUpButton = new Sprite(64, 64);
            settingsGroup.addChild(sndUpButton);
            sndUpButton.x = 64 *4;
            sndUpButton.y = 0;
            sndUpButton.image = game.assets[uiArrowSprite];

            var isKeyPressed = false;
            sndUpButton.addEventListener(enchant.Event.TOUCH_START, function(params) {
                if (gameManager.sndManager.getVolume() < 1) {
                    if (isKeyPressed == false) {
                        isKeyPressed = true;
                        sndUpButton.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT);
                    }
                }
            });

            sndUpButton.addEventListener(enchant.Event.TOUCH_END, function(params) {
                if (gameManager.sndManager.getVolume() < 1) {
                    if (isKeyPressed == true) {
                        gameManager.sndManager.volumeUp();
                        sndUpButton.tl.scaleTo(1.0, 3).then(function() {
                            isKeyPressed = false;
                        });
                    }
                }
            });

            var sndDownButton = new Sprite(64, 64);
            settingsGroup.addChild(sndDownButton);
            sndDownButton.x = 64*5 +5;
            sndDownButton.y = 0;
            sndDownButton.rotation = 180;
            sndDownButton.image = game.assets[uiArrowSprite];

            sndDownButton.addEventListener(enchant.Event.TOUCH_START, function(params) {
                if (gameManager.sndManager.getVolume() > 0) {
                    if (isKeyPressed == false) {
                        isKeyPressed = true;
                        sndDownButton.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT);
                    }
                }
            });

            sndDownButton.addEventListener(enchant.Event.TOUCH_END, function(params) {
                if (gameManager.sndManager.getVolume() > 0) {
                    if (isKeyPressed == true) {
                        gameManager.sndManager.volumeDown();
                        sndDownButton.tl.scaleTo(1.0, 3).then(function() {
                            isKeyPressed = false;
                        });
                    }
                }
            });

            var self = this;
            var cancelBtnSprite = new Sprite(128, 64);
            cancelBtnSprite.image = game.assets[uiCancelBtnSprite];
            cancelBtnSprite.x = 64;
            cancelBtnSprite.y = 512 -64 -32;

            windowGroup.addChild(cancelBtnSprite);

            windowGroup.originX = 256;
            windowGroup.originY = 256;
            windowGroup.scaleX = 0.7;
            windowGroup.scaleY = 0.7;
            windowGroup.tl.scaleTo(1, 10, enchant.Easing.ELASTIC_EASEOUT).then(function() {
                cancelBtnSprite.addEventListener(enchant.Event.TOUCH_START, function(params) {
                    cancelBtnSprite.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT)
                });

                cancelBtnSprite.addEventListener(enchant.Event.TOUCH_END, function(params) {
                    shieldSprite.tl.fadeTo(0, 5);
                    cancelBtnSprite.tl.scaleTo(0.9, 3).and().fadeTo(0, 5);
                    windowSprite.tl.fadeTo(0, 5).then(function() {
                        gameManager.sndManager.playFX(sndClick);
                        game.popScene();
                    });
                });
            });
        },
    })


    /**
     * キャラのポップアップウィンドー
     */
    var StartScreen = Class.create(Scene, {
        initialize: function(gameManager) {
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
            windowSprite.image = game.assets[uiStartScreen];
            windowGroup.addChild(windowSprite);

            var self = this;
            var versusBtnSprite = new Sprite(128, 64);
            versusBtnSprite.image = game.assets[uiVersusBtnSprite];
            versusBtnSprite.x = 64 *1.5;
            versusBtnSprite.y = 512 -64 -32;
            windowGroup.addChild(versusBtnSprite);

            var campaignBtnSprite = new Sprite(128, 64);
            campaignBtnSprite.image = game.assets[uiStoryBtnSprite];
            campaignBtnSprite.x = 64 *4.5;
            campaignBtnSprite.y = 512 -64 -32;
            windowGroup.addChild(campaignBtnSprite);

            windowGroup.originX = 256;
            windowGroup.originY = 256;

            versusBtnSprite.addEventListener(enchant.Event.TOUCH_START, function(params) {
                versusBtnSprite.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT)
            });

            versusBtnSprite.addEventListener(enchant.Event.TOUCH_END, function(params) {
                shieldSprite.tl.fadeTo(0, 5);
                versusBtnSprite.tl.scaleTo(0.9, 3).and().fadeTo(0, 5);
                windowSprite.tl.fadeTo(0, 5).then(function() {
                    gameManager.sndManager.playFX(sndClick);
                    game.popScene();
                    new VersusScreen(gameManager);
                });
            });

            campaignBtnSprite.addEventListener(enchant.Event.TOUCH_START, function(params) {
                campaignBtnSprite.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT)
            });

            campaignBtnSprite.addEventListener(enchant.Event.TOUCH_END, function(params) {
                campaignBtnSprite.tl.scaleTo(0.9, 3).and().fadeTo(0, 5);
                windowSprite.tl.fadeTo(0, 5).then(function() {
                    gameManager.sndManager.playFX(sndClick);
                    game.popScene();
                    new CampaignScreen(gameManager);
                });
            });
        },
    })

    /**
     * キャラのポップアップウィンドー
     */
    var CampaignScreen = Class.create(Scene, {
        initialize: function(gameManager) {
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
            windowSprite.image = game.assets[uiStoryScreen];
            windowGroup.addChild(windowSprite);

            var self = this;

            var saveData = $.jStorage.get("save data");
            if (saveData) {
                console.log("Found Save Data", saveData.stageId)
                var continueBtnSprite = new Sprite(128, 64);
                continueBtnSprite.image = game.assets[uiContinueBtnSprite];
                continueBtnSprite.x = 64 *1.5;
                continueBtnSprite.y = 512 -64 -32;
                windowGroup.addChild(continueBtnSprite);

                continueBtnSprite.addEventListener(enchant.Event.TOUCH_START, function(params) {
                    continueBtnSprite.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT)
                });

                continueBtnSprite.addEventListener(enchant.Event.TOUCH_END, function(params) {
                    shieldSprite.tl.fadeTo(0, 5);
                    continueBtnSprite.tl.scaleTo(0.9, 3).and().fadeTo(0, 5);
                    windowSprite.tl.fadeTo(0, 5).then(function() {
                        gameManager.beginCampaignGame();
                        gameManager.sndManager.playFX(sndClick);
                        game.popScene();
                    });
                });
            }

            var newBtnSprite = new Sprite(128, 64);
            newBtnSprite.image = game.assets[uiNewBtnSprite];
            newBtnSprite.x = 64 *4.5;
            newBtnSprite.y = 512 -64 -32;
            windowGroup.addChild(newBtnSprite);

            windowGroup.originX = 256;
            windowGroup.originY = 256;

            newBtnSprite.addEventListener(enchant.Event.TOUCH_START, function(params) {
                newBtnSprite.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT)
            });

            newBtnSprite.addEventListener(enchant.Event.TOUCH_END, function(params) {
                $.jStorage.deleteKey("save data")
                shieldSprite.tl.fadeTo(0, 5);
                newBtnSprite.tl.scaleTo(0.9, 3).and().fadeTo(0, 5);
                windowSprite.tl.fadeTo(0, 5).then(function() {
                    gameManager.beginCampaignGame();
                    gameManager.sndManager.playFX(sndClick);
                    game.popScene();
                });
            });
        },
    })

    var VersusScreen = Class.create(Scene, {
        initialize: function(gameManager) {
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
            windowSprite.image = game.assets[uiVSScreen];
            windowGroup.addChild(windowSprite);

            var self = this;

            var humanBtnSprite = new Sprite(128, 64);
            humanBtnSprite.image = game.assets[uiHumanBtnSprite];
            humanBtnSprite.x = 64 *1.5;
            humanBtnSprite.y = 512 -64 -32;
            windowGroup.addChild(humanBtnSprite);

            windowGroup.originX = 256;
            windowGroup.originY = 256;

            humanBtnSprite.addEventListener(enchant.Event.TOUCH_START, function(params) {
                humanBtnSprite.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT)
            });

            humanBtnSprite.addEventListener(enchant.Event.TOUCH_END, function(params) {
                shieldSprite.tl.fadeTo(0, 5);
                humanBtnSprite.tl.scaleTo(0.9, 3).and().fadeTo(0, 5);
                windowSprite.tl.fadeTo(0, 5).then(function() {
                    gameManager.beginVersusGame("human");
                    gameManager.sndManager.playFX(sndClick);
                    game.popScene();
                });
            });

            var cpuBtnSprite = new Sprite(128, 64);
            cpuBtnSprite.image = game.assets[uiCpuBtnSprite];
            cpuBtnSprite.x = 64 *4.5;
            cpuBtnSprite.y = 512 -64 -32;
            windowGroup.addChild(cpuBtnSprite);

            windowGroup.originX = 256;
            windowGroup.originY = 256;

            cpuBtnSprite.addEventListener(enchant.Event.TOUCH_START, function(params) {
                cpuBtnSprite.tl.scaleTo(1.1, 10, enchant.Easing.ELASTIC_EASEOUT)
            });

            cpuBtnSprite.addEventListener(enchant.Event.TOUCH_END, function(params) {
                shieldSprite.tl.fadeTo(0, 5);
                cpuBtnSprite.tl.scaleTo(0.9, 3).and().fadeTo(0, 5);
                windowSprite.tl.fadeTo(0, 5).then(function() {
                    gameManager.beginVersusGame("ai");
                    gameManager.sndManager.playFX(sndClick);
                    game.popScene();
                });
            });
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

        var frameUI = new FrameUI(sceneGameMain);
        manager.setFrameUI(frameUI);

        // ゲームにシーンを追加
        game.pushScene(sceneGameMain);
        new StartScreen(manager);
    };

    game.start();
};
