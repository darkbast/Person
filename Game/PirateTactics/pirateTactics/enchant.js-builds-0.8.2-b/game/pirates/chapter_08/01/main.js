/**
 * enchant.js を使う前に必要な処理。
 */
enchant();

window.onload = function(){

    var game = new Core(960, 640);

    /**
     * 必要なファイルを相対パスで引数に指定する。 ファイルはすべて、ゲームが始まる前にロードされる。
     */
    var mapFrame  = "../../../resources/mapframe.png";
    game.preload(mapFrame);

    var mapBackground00  = "../../../resources/map00.png";
    game.preload(mapBackground00);

    var mapTiles  = "../../../resources/maptiles.png";
    game.preload(mapTiles);
    /**
     * ロードが完了した直後に実行される関数を指定している。
     */
    game.onload = function(){
        var sceneGameMain = new Scene();

        // 枠
        var frame = new Sprite(960, 640);
        frame.image = game.assets[mapFrame];
        sceneGameMain.addChild(frame);

        // 背景
        var background = new Sprite(64*13, 64*9);
        background.image = game.assets[mapBackground00];
        background.x = 64;
        background.y = 10;
        sceneGameMain.addChild(background);

        // マス
        var map = new Map(64, 64);
        map.x = 64;
        map.y = 10;

        map.image = game.assets[mapTiles];

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
        map.loadData(mapDisplayData);

        map.opacity = 0.5

        // マップをシーンに追加
        sceneGameMain.addChild(map);

        // ゲームにシーンを追加
        game.pushScene(sceneGameMain);
    };

    game.start();
};
