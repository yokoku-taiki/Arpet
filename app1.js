window.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("renderCanvas");
  const cameraSelection = document.getElementById("cameraSelection");
  const frontCameraButton = document.getElementById("frontCamera");
  const backCameraButton = document.getElementById("backCamera");

  const engine = new BABYLON.Engine(canvas, true);

  const createScene = function (facingMode) {
    const scene = new BABYLON.Scene(engine);

    // カメラを設定
    const camera = new BABYLON.FreeCamera(
      "camera1",
      new BABYLON.Vector3(0, 0, -20), // カメラを後方に配置
      scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false); // カメラを固定

    // 環境光を設定
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 1.5; // 明るさを増加

    // スマホ画面をシミュレートする壁（9:16のアスペクト比）
    const phoneWall = BABYLON.MeshBuilder.CreatePlane(
      "phoneWall",
      { width: 9, height: 16 }, // 縦16横9のアスペクト比
      scene
    );
    phoneWall.position = new BABYLON.Vector3(0, 0, 0); // 画面中央に配置

    // カメラ映像を取得し、壁に投影する処理
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 }, // 解像度を1920x1080に指定
          height: { ideal: 1080 },
        },
      })
      .then((stream) => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();

        // Babylon.js のビデオテクスチャを作成
        const videoTexture = new BABYLON.VideoTexture(
          "videoTexture",
          video,
          scene,
          true,
          true
        );

        // 映像の上下反転修正
        videoTexture.uScale = -1; // 横反転
        videoTexture.vScale = -1; // 縦反転

        const videoMaterial = new BABYLON.StandardMaterial("videoMat", scene);
        videoMaterial.diffuseTexture = videoTexture;
        phoneWall.material = videoMaterial; // 壁にカメラ映像を貼り付け

        // 読み込み後すぐにリサイズをトリガー
        setTimeout(() => {
          window.dispatchEvent(new Event("resize")); // リサイズイベントを強制的に発生させる
        }, 0); // 0msの遅延でリサイズイベントを実行
      })
      .catch((error) => {
        console.error("カメラのアクセスに失敗しました: ", error);
        alert("カメラにアクセスできません。設定を確認してください。");
      });

    return scene;
  };

  function startCamera(facingMode) {
    cameraSelection.style.display = "none";
    canvas.style.display = "block";

    const scene = createScene(facingMode);

    engine.runRenderLoop(function () {
      scene.render();
    });

    window.addEventListener("resize", function () {
      engine.resize();
    });
  }

  frontCameraButton.addEventListener("click", function () {
    startCamera("user");
  });

  backCameraButton.addEventListener("click", function () {
    startCamera("environment");
  });
});
