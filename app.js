window.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("renderCanvas");
  const cameraSelection = document.getElementById("cameraSelection");
  const frontCameraButton = document.getElementById("frontCamera");
  const backCameraButton = document.getElementById("backCamera");

  const engine = new BABYLON.Engine(canvas, true);

  // カメラ映像を表示するシーンを作成
  const createScene = function (facingMode) {
    const scene = new BABYLON.Scene(engine);

    // Babylon.js のカメラを作成（3Dシーン用）
    const camera = new BABYLON.FreeCamera(
      "camera1",
      new BABYLON.Vector3(0, 0, -10),
      scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());

    // 環境光
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.7;

    // カメラ映像を貼り付ける平面を作成
    const plane1 = BABYLON.MeshBuilder.CreatePlane(
      "plane1",
      { width: 16, height: 9 },
      scene
    );
    plane1.position = new BABYLON.Vector3(0, 0, 0);

    // Webカメラ映像を取得し、テクスチャに適用
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: facingMode } } })
      .then((stream) => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();

        // ビデオ要素を表示して確認（オプション：テスト用）
        video.style.position = "absolute";
        video.style.top = "0";
        video.style.left = "0";
        video.style.width = "100%";
        video.style.height = "100%";
        document.body.appendChild(video); // カメラ映像を画面全体に表示

        // Babylon.js のビデオテクスチャを作成
        const videoTexture = new BABYLON.VideoTexture(
          "video",
          video,
          scene,
          true,
          true
        );
        const videoMaterial = new BABYLON.StandardMaterial("videoMat", scene);
        videoMaterial.diffuseTexture = videoTexture;
        plane1.material = videoMaterial;
      })
      .catch((error) => {
        console.error("カメラのアクセスに失敗しました: ", error);
        alert("カメラにアクセスできません。設定を確認してください。");
      });

    return scene;
  };

  // カメラ選択時の処理
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

  // 内カメラボタンのクリックイベント
  frontCameraButton.addEventListener("click", function () {
    startCamera("user"); // 内カメラを使用
  });

  // 外カメラボタンのクリックイベント
  backCameraButton.addEventListener("click", function () {
    startCamera("environment"); // 外カメラを使用
  });
});
