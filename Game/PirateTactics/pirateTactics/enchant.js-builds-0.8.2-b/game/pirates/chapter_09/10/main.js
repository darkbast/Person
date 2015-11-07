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

        outOfBorders: function(i, j) {
            if (i < 0) return true;
            if (i >= this.mapWidth) return true;
            if (j < 0) return true;
            if (j >= this.mapHeight) return true;

            return false;
        },

        setActiveFune: function(fune) {
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
                    this.drawMovementRange();
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
    var Fune = Class.create(Sprite, {
        initialize: function(scene) {
            Sprite.call(this, 64, 64);
            this.image = game.assets[shipsSpriteSheet];
            this.frame = [0, 0, 0, 0, 1, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 3, 3, 3];

            this.stats = {
                movement: 3,
            };
        },

        getMovement: function() {
            return this.stats.movement;
        },
    });


    /**
     * ロードが完了した直後に実行される関数を指定している。
     */
    game.onload = function(){
        var sceneGameMain = new Scene();

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

        // 船をシーンに追加
        var fune = new Fune();
        map.addChild(fune);
        map.positionFune(fune, 3, 3);
        map.setActiveFune(fune);

        // ゲームにシーンを追加
        game.pushScene(sceneGameMain);
    };

    game.start();
};
