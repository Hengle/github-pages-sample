// ページの読み込みを待つ
    window.addEventListener('load', init);

    function init() {
      // サイズを指定
      const width = window.innerWidth;
      const height = window.innerHeight;
      // レンダラーを作成
      const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas'),
      });
      renderer.setSize(width, height);
      // シーンを作成
      const scene = new THREE.Scene();
      // カメラを作成
      const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
      camera.position.set(100, 150, 500);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      //スポットライト
      const spotLight = new THREE.SpotLight(0x223344);
      spotLight.position.set(5, 20, 15);
      spotLight.angle = 0.8;
      spotLight.intensity = 0.7;
      spotLight.penumbra = 0.8;
      spotLight.castShadow = true;
      spotLight.shadow.bias = -0.001;
      scene.add(spotLight);
      scene.add(spotLight.target);
      // 平行光源
      const directionalLight = new THREE.DirectionalLight(0xaaaaaa);
      directionalLight.position.set(-15, 15, 20);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.x = 1024;
      directionalLight.shadow.mapSize.y = 1024;
      directionalLight.shadow.camera.right = 20;
      directionalLight.shadow.camera.top = 20;
      directionalLight.shadow.camera.left = -20;
      directionalLight.shadow.camera.bottom = -20;
      renderer.shadowMap.renderSingleSided = false;
      renderer.shadowMap.renderReverseSided = false;
      directionalLight.shadow.bias = -0.001;
      scene.add(directionalLight);
      // 環境光源
      const ambientLight = new THREE.AmbientLight(0x333333);
      scene.add(ambientLight);
      // 直方体を作成
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff
      });
      // const geometry = new THREE.SphereGeometry(100, 100, 100);
      const geometry = new THREE.BoxGeometry(100, 100, 100);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = "sample";
      scene.add(mesh);

      var posX, posY, posZ;
      var flg = false;
      var meshList = [];
      var j = 0;
      for (var i = 0; i < 100; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        meshList.push(mesh);
      }
      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();
      window.addEventListener("mousemove", function(e) {
        var rect = e.target.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        mouseX = (mouseX / window.innerWidth) * 2 - 1;
        mouseY = -(mouseY / window.innerHeight) * 2 + 1;
        var pos = new THREE.Vector3(mouseX, mouseY, 1);
        pos.unproject(camera);
        meshList[j].position.x = pos.x;
        meshList[j].position.y = pos.y;
        meshList[j].position.z = pos.z;
        meshList[j].rotation.x = Math.random() * 2 * Math.PI;
        meshList[j].rotation.y = Math.random() * 2 * Math.PI;
        meshList[j].rotation.z = Math.random() * 2 * Math.PI;
        scene.add(meshList[j]);
        // 始点、向きベクトルを渡してレイを作成 
        var ray = new THREE.Raycaster(camera.position, pos.sub(camera.position).normalize());
        // 交差判定 
        // 引数は取得対象となるMeshの配列を渡す。以下はシーン内のすべてのオブジェクトを対象に。 
        var objs = ray.intersectObjects(scene.children);
        if (objs.length > 0) {
          for (var i = 0; i < objs.length; i++) {
            if (objs[i].object.name == "sample") {
              console.log("ok");
            }
          }
        }
        if (j < 99) {
          j = j + 1;
        } else {
          j = 0;
        }
      });
      tick();
      //    毎フレーム時に実行されるループイベントです
      function tick() {
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
      }
    }