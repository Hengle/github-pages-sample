window.addEventListener('load', init);

function init() {
  const width = 960;
  const height = 480;
  const mouse = new THREE.Vector2();
  const canvas = document.querySelector("#myCanvas");
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  });
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  //camera.position.set(0, 500, +1000);
  camera.position.set(0, 0, 1000);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  const ambientLight = new THREE.AmbientLight(0x999999);
  scene.add(ambientLight);

  //touchstart時座標
  //touchmove
  //touchend
  //以上を使ってすわイプしながらの赤光線発射を試す

  //できたらオブジェクト生成をついづいさせる

  //固定位置からのオブジェクト生成を行う

  //それの発動条件を光線衝突時にする


  //  const container = new THREE.Object3D();
  //  scene.add(container);
  //  const material = new THREE.MeshStandardMaterial({
  //    color: 0xFFFFFF,
  //    side: THREE.DoubleSide
  //  });
  //  const geometryList = [
  //                    new THREE.SphereGeometry(50), // 球体
  //                    new THREE.BoxGeometry(100, 100, 100), // 直方体
  //                    new THREE.PlaneGeometry(100, 100), // 平面
  //                    new THREE.TetrahedronGeometry(100, 0), // カプセル形状
  //                    new THREE.ConeGeometry(100, 100, 32), // 三角錐
  //                    new THREE.CylinderGeometry(50, 50, 100, 32), // 円柱
  //                    new THREE.TorusGeometry(50, 30, 16, 100) // ドーナツ形状
  //                ];
  //  const meshList = [];
  //  geometryList.map((geometry, index) => {
  //    const mesh = new THREE.Mesh(geometry, material);
  //    container.add(mesh);
  //    // 円周上に配置
  //    mesh.position.x = 400 * Math.sin(index / geometryList.length * Math.PI * 2);
  //    mesh.position.z = 400 * Math.cos(index / geometryList.length * Math.PI * 2);
  //    meshList.push(mesh)
  //  });

  tick();

  function tick() {
    //container.rotation.z += 0.01;
    //container.position.x += -50;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

}


//window.addEventListener('DOMContentLoaded', () => {
//  const main = new Main();
//  // サーバーからmouseDownToMainというデータを受信
//  // コントローラーのマウスダウンイベントがサーバーを経由してメイン画面に届いた
//  socket.on('mouseDownToMain', (data) => {
//    main.handleMouseDown(data);
//  });
//  // サーバーからmouseMoveToMainというデータを受信
//  // コントローラーのマウスムーブイベントがサーバーを経由してメイン画面に届いた
//  socket.on('mouseMoveToMain', (data) => {
//    main.handleMouseMove(data);
//  });
//  // サーバーからmmouseUpToMainというデータを受信
//  // コントローラーのマウスアップイベントがサーバーを経由してメイン画面に届いた
//  socket.on('mouseUpToMain', (data) => {
//    main.handleMouseUp(data);
//  });
//
//  // デモ用コード
//  $('#controllerURL').text(location.origin + '/controller.html');
//});

///**
// * パーティクルデモのメインクラスです。
// * @class project.Main
// */
//
//class Main {
//  /**
//   * @constructor
//   */
//  constructor() {
//    // 初期設定
//    this.stage = new createjs.Stage('myCanvas');
//    if (createjs.Touch.isSupported()) {
//      createjs.Touch.enable(this.stage);
//    }
//    // パーティクルサンプルを作成
//    this.sample = new ParticleSample();
//    this.stage.addChild(this.sample);
//    // Tickerを作成
//    createjs.Ticker.timingMode = createjs.Ticker.RAF;
//    createjs.Ticker.addEventListener('tick', () => {
//      this.handleTick();
//    });
//    // リサイズイベント
//    this.handleResize();
//    window.addEventListener('resize', () => {
//      this.handleResize();
//    });
//  }
//
//  handleMouseDown(data) {
//    this.sample.changeEmitPosition(data);
//    this.sample.mouseDown();
//  }
//
//  handleMouseMove(data) {
//    this.sample.changeEmitPosition(data);
//  }
//
//  handleMouseUp(data) {
//    this.sample.changeEmitPosition(data);
//    this.sample.mouseUp();
//  }
//
//  /**
//   * エンターフレームイベント
//   */
//  handleTick() {
//    // create residual image effect
//    this.stage.update();
//  }
//
//  /**
//   * リサイズイベント
//   */
//  handleResize() {
//    this.stage.canvas.width = window.innerWidth;
//    this.stage.canvas.height = window.innerHeight;
//  }
//}
//
///**
// * 大量のパーティクルを発生させてみた
// * マウスを押してる間でてくるよ
// * @see http://wonderfl.net/c/4WjT
// * @class demo.ParticleSample
// */
//class ParticleSample extends createjs.Container {
//  constructor() {
//    super();
//    this._count = 0;
//    this._bg = new createjs.Shape();
//    this.addChild(this._bg);
//    this._emitter = new ParticleEmitter();
//    this.addChild(this._emitter.container);
//    this._emitX = 0;
//    this._emitY = 0;
//    this._shadow = new createjs.Bitmap('images/Shadow.jpg');
//    this.addChildAt(this._shadow, 0);
//    this.on('tick', this.enterFrameHandler, this);
//    this.handleResize();
//    window.addEventListener('resize', () => {
//      this.handleResize();
//    });
//  }
//
//  /**
//   * エンターフレームイベント
//   * @param event
//   */
//  enterFrameHandler(event) {
//    this._emitter.latestX = this._emitX;
//    this._emitter.latestY = this._emitY;
//    this._emitter.update();
//  }
//
//  changeEmitPosition(eventData) {
//    const uvx = eventData.eventUVX;
//    const uvy = eventData.eventUVY;
//    this._emitX = window.innerWidth * uvx;
//    this._emitY = window.innerHeight * uvy;
//  }
//
//  mouseDown() {
//    this._emitter.latestX = this._emitX;
//    this._emitter.latestY = this._emitY;
//    this._eventMouseDown = this.on('tick', this.createParticle, this);
//    this._isDown = true;
//  }
//
//  mouseUp() {
//    this.off('tick', this._eventMouseDown);
//    this._isDown = false;
//  }
//
//  createParticle(event) {
//    if (this._isDown)
//      this._emitter.emit(this._emitX, this._emitY);
//  }
//
//  handleResize() {
//    this._shadow.scaleX = (window.innerWidth / 1024);
//    this._shadow.scaleY = (window.innerHeight / 1024);
//  }
//}
//
///**
// * パーティクル発生装置。マウス座標から速度を計算する。
// * @class project.Emitter
// */
//class Emitter {
//  /**
//   * @constructor
//   */
//  constructor() {
//    this.vy = 0;
//    this.vx = 0;
//    this.x = 0;
//    this.y = 0;
//    this.latestX = 0;
//    this.latestY = 0;
//  }
//
//  /**
//   * パーティクルエミッターの計算を行います。この計算によりマウスの引力が計算されます。
//   * @method
//   */
//  update() {
//    const dx = this.latestX - this.x;
//    const dy = this.latestY - this.y;
//    const d = Math.sqrt(dx * dx + dy * dy) * 0.2;
//    const rad = Math.atan2(dy, dx);
//    this.vx += Math.cos(rad) * d;
//    this.vy += Math.sin(rad) * d;
//    this.vx *= 0.4;
//    this.vy *= 0.4;
//    this.x += this.vx;
//    this.y += this.vy;
//  }
//}
//
///**
// * パーティクルエミッター
// * @class project.ParticleEmitter
// */
//class ParticleEmitter extends Emitter {
//  /**
//   * @constructor
//   */
//  constructor() {
//    super();
//    this.numParticles = 3;
//    this.PRE_CACHE_PARTICLES = 300;
//    this.container = new createjs.Container();
//    this._particleActive = [];
//    this._particlePool = [];
//    /* 予め必要そうな分だけ作成しておく */
//    for (let i = 0; i < this.PRE_CACHE_PARTICLES; i++) {
//      this._particlePool.push(new Particle());
//    }
//  }
//
//  /**
//   * パーティクルを発生させます。
//   * @param {number} x パーティクルの発生座標
//   * @param {number} y パーティクルの発生座標
//   * @method
//   */
//  emit(x, y) {
//    for (let i = 0; i < this.numParticles; i++) {
//      this.getNewParticle(x, y);
//    }
//  }
//
//  /**
//   * パーティクルを更新します。
//   * @method
//   */
//  update() {
//    super.update();
//    for (let i = 0; i < this._particleActive.length; i++) {
//      const p = this._particleActive[i];
//      if (!p.getIsDead()) {
//        if (p.x >= window.innerWidth) {
//          p.vx *= -0.5;
//          p.x = window.innerWidth;
//        } else if (p.x <= 0) {
//          p.vx *= -0.5;
//          p.x = 0;
//        }
//        p.update();
//      } else {
//        this.removeParticle(p);
//      }
//    }
//  }
//
//  /**
//   * パーティクルを追加します。
//   * @param {THREE.Vector3} emitPoint
//   * @method
//   */
//  getNewParticle(emitX, emitY) {
//    const p = new Particle();
//    p.resetParameters(this.x, this.y, this.vx, this.vy);
//    this._particleActive.push(p);
//    this.container.addChild(p);
//    return p;
//  }
//
//  /**
//   * パーティクルを削除します。
//   * @param {Particle} particle
//   * @method
//   */
//  removeParticle(p) {
//    this.container.removeChild(p);
//    const index = this._particleActive.indexOf(p);
//    if (index > -1) {
//      this._particleActive.splice(index, 1);
//    }
//    this.toPool(p);
//  }
//
//  /**
//   * アクティブなパーティクルを取り出します。
//   * @returns {project.Particle[]}
//   * @method
//   */
//  getActiveParticles() {
//    return this._particleActive;
//  }
//
//  /**
//   * プールにインスタンスを格納します。
//   * @param {project.Particle}
//   * @method
//   */
//  toPool(particle) {
//    this._particlePool.push(particle);
//  }
//}
//
///**
// * @class demo.Particle
// */
//class Particle extends createjs.Shape {
//  /**
//   * コンストラクタ
//   * @constructor
//   */
//  constructor() {
//    super();
//    this.rotation = Math.random() * 360;
//    this.size = 20 + Math.random() * 40;
//    const colorHsl = createjs.Graphics.getHSL(new Date().getTime() / 40 + Math.random() * 4 + particleColor, 100 + Math.random() * 4, 50 + Math.random() * 4);
//    this.graphics.clear();
//    this.graphics.beginRadialGradientFill([colorHsl, '#000000'], [0.0, 1.0], 0, 0, this.size / 2, 0, 0, this.size);
//    this.graphics.drawCircle(0, 0, this.size);
//    this.graphics.endFill();
//    this.compositeOperation = 'lighter';
//    this.mouseEnabled = false;
//    const padding = 2;
//    this.cache(-this.size - padding, -this.size - padding, this.size * 2 + padding * 2, this.size * 2 + padding * 2);
//    this._destroy = true;
//  }
//
//  /**
//   * パーティクルをリセットします。
//   * @param {createjs.Point} point
//   * @param {number} vx
//   * @param {number} vy
//   */
//  resetParameters(emitX, emitY, vx, vy) {
//    this.x = emitX;
//    this.y = emitY;
//    this.vx = vx * 0.5 + (Math.random() - 0.5) * 10;
//    this.vy = vy * 0.5 + (Math.random() - 0.7) * 10;
//    this.life = Math.random() * 60 + 4;
//    this._count = 0;
//    this._destroy = false;
//    this.alpha = 1.0;
//    this.scaleX = this.scaleY = 1.0;
//  }
//
//  /**
//   * パーティクル個別の内部計算を行います。
//   * @method
//   */
//  update() {
//    this.vy -= 0.5;
//    this.x += this.vx;
//    this.y += this.vy;
//    this._count++;
//    const maxD = (1 - this._count / this.life / 2);
//    this.alpha = Math.random() * 0.6 + 0.4;
//    this.scaleX = this.scaleY = maxD;
//    // 死亡フラグ
//    if (this.life < this._count) {
//      this._destroy = true;
//      this.parent.removeChild(this);
//    }
//  }
//
//  /**
//   * パーティクルが死んでいるかどうかを確認します。
//   * @returns {boolean}
//   * @method
//   */
//  getIsDead() {
//    return this._destroy;
//  }
//}

//float timer = 0.0;
//float[] timing;
//int indexTiming = 0;
//int cool = 0;
//int good = 0;
//int bad = 0;
//
//int goodEffect;
//int badEffect;
//
//timing = {
//    1.495 f,
//    2.220 f,
//    2.580 f,
//    2.942 f,
//    3.664 f,
//    4.387 f,
//    4.749 f,
//    5.110 f,
//    5.472 f,
//    5.833 f,
//    6.556 f,
//    7.279 f,
//    7.818 f,
//    8.363 f,
//    8.725 f,
//    9.267 f,
//    9.809 f,
//    10.170 f,
//    10.713 f,
//    11.255 f,
//    11.616 f,
//    11.797 f,
//    11.978 f,
//    12.158 f,
//    12,
//    339 f,
//    1000 f
//};
