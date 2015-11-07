/**
 * enchant.js を使う前に必要な処理。
 */
enchant();

window.onload = function(){

    var game = new Core(960, 640);

    /**
     * 必要なファイルを相対パスで引数に指定する。 ファイルはすべて、ゲームが始まる前にロードされる。
     */
    var mapBack  = "../../../resources/mapframe.png";

    game.preload(mapBack);

    /**
     * ロードが完了した直後に実行される関数を指定している。
     */
    game.onload = function(){
        var sceneGameMain = new Scene();

        // マップの背景を画面と同じ大きさに作ります
        var background = new Sprite(960, 640);
        background.image = game.assets[mapBack];

        // マップの背景をシーンに追加
        sceneGameMain.addChild(background);

        // ゲームにシーンを追加
        game.pushScene(sceneGameMain);
    };

    game.start();
};
