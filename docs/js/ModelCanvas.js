    var ModelCanvas = function (w, h) {
        this.width = w;
        this.height = h;
        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.renderer = null;
    }

    ModelCanvas.prototype.init = function () {
        // 空のシーンを作成
        this.scene = new THREE.Scene();

        // カメラの作成・設定(今回は透視投影)
        //this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height);
        // カメラの位置を決める
        this.camera.position.set(0, 0, 30);

        // レンダラの作成
        this.renderer = new THREE.WebGLRenderer();
        // canvasの大きさを決める
        this.renderer.setSize(this.width, this.height);
        // 背景色(何も描画されていない部分の色)を決める
        this.renderer.setClearColor(0xffffff, 1.0);

        // レンダラをhtmlのbodyに追加
        document.body.appendChild(this.renderer.domElement);

        // TrackballControls オブジェクトを作成
        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
        //this.controls = new THREE.OrbitControls(this.camera);

        // シーンの初期化
        this.initScene();
        // 描画
        this.updateCanvas();
    };

    ModelCanvas.prototype.initScene = function () {
        // ジオメトリの作成
        var geom = new THREE.TorusGeometry(5, 2, 8, 16);
        // マテリアルの作成
        /*var material = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });*/
        var material = new THREE.ShaderMaterial({
            vertexShader: document.getElementById("vshader").textContent,
            fragmentShader: document.getElementById("fshader").textContent
        });
        // 作成したジオメトリとマテリアルからオブジェクトを作成
        var torus = new THREE.Mesh(geom, material);
        // オブジェクトに回転を設定
        torus.rotation.x = -Math.PI / 4;
        // オブジェクトをシーンに追加
        this.scene.add(torus);
    };

    ModelCanvas.prototype.updateCanvas = function () {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    };
