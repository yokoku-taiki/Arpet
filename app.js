window.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);

  const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    // FreeCamera を作成して、シーン全体を見渡す
    const camera = new BABYLON.FreeCamera(
      "camera1",
      new BABYLON.Vector3(0.5, 5, -8),
      scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    camera.rotation.x -= Math.PI * 0.05;

    // 環境光
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.7;

    // カメラ映像を貼り付ける平面を作成
    const plane1 = BABYLON.Mesh.CreatePlane("plane1", 7, scene);
    plane1.rotation.z = Math.PI;
    plane1.position.y = 1;

    // Webカメラの映像をテクスチャとして取得し、平面に貼り付ける
    const videoMaterial = new BABYLON.StandardMaterial("texture1", scene);
    videoMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

    BABYLON.VideoTexture.CreateFromWebCam(
      scene,
      function (videoTexture) {
        videoMaterial.diffuseTexture = videoTexture;
        plane1.material = videoMaterial;
      },
      { maxWidth: 256, maxHeight: 256 } // 必要に応じて解像度を調整
    );

    return scene;
  };

  // シーンを作成
  const scene = createScene();

  // レンダーループを開始
  engine.runRenderLoop(function () {
    scene.render();
  });

  // ウィンドウリサイズに対応
  window.addEventListener("resize", function () {
    engine.resize();
  });
});
