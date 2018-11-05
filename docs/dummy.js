/**
 *
 * WebCam Mesh by Felix Turner
 * @felixturner / www.airtight.cc
 * (c) Airtight Interactive Inc. 2012
 *
 * Connects HTML5 WebCam input to a WebGL 3D Mesh. It creates a 3D depth map by mapping pixel brightness to Z-depth.
 * Perlin noise is used for the ripple effect and CSS3 filters are used for color effects.
 * Use mouse move to tilt and scroll wheel to zoom. Requires Chrome or Opera.
 *
 */
// ページの読み込みを待つ
//window.addEventListener('load', detectSpecs);
//window.addEventListener('load', initSocket1_1);

function initSocket1_1() {

  var fov = 70;
  var canvasWidth = 320 / 2;
  var canvasHeight = 240 / 2;
  var vidWidth = 320;
  var vidHeight = 240;
  var tiltSpeed = 0.1;
  var tiltAmount = 0.5;
  var width = $('.cont').width();
  var height = $('.cont').height();

  var perlin = new ImprovedNoise();
  var camera, scene, renderer;
  var controls;
  var mouseX = 0;
  var mouseY = 0;
  var windowHalfX, windowHalfY;
  var video, videoTexture;
  var world3D;
  var geometry;
  var vidCanvas;
  var ctx;
  var pixels;
  var noisePosn = 0;
  var wireMaterial;
  var meshMaterial;
  var container;
  var params;
  var title, info, prompt;


  function detectSpecs() {
    //function initSocket1_1() {

    //init HTML elements
    container = document.querySelector('#container');
    prompt = document.querySelector('#prompt');
    //  info = document.querySelector('#info');
    //  title = document.querySelector('#title');
    //  info.style.display = 'none';
    //  title.style.display = 'none';
    //  container.style.display = 'none';

    var hasWebgl = (function () {
      try {
        return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
      } catch (e) {
        return false;
      }
    })();

    var hasGetUserMedia = (function () {
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    })();

    //console.log("hasWebGL: " + hasWebgl);
    //console.log("hasGetUserMedia: " + hasGetUserMedia);
    if (!hasGetUserMedia) {
      prompt.innerHTML = 'This demo requires webcam support (Chrome or Opera).';
    } else if (!hasWebgl) {
      prompt.innerHTML = 'No WebGL support detected. Please try restarting the browser.';
    } else {
      prompt.innerHTML = 'Please allow camera access.';
      init();
    }

  }

  function init() {

    // stop the user getting a text cursor
    document.onselectstart = function () {
      return false;
    };

    //init control panel
    params = new WCMParams();
    gui = new dat.GUI();
    gui.add(params, 'zoom', 0.1, 5).name('Zoom').onChange(onParamsChange);
    gui.add(params, 'mOpac', 0, 1).name('Mesh Opacity').onChange(onParamsChange);
    gui.add(params, 'wfOpac', 0, 0.3).name('Grid Opacity').onChange(onParamsChange);
    gui.add(params, 'contrast', 1, 5).name('Contrast').onChange(onParamsChange);
    gui.add(params, 'saturation', 0, 2).name('Saturation').onChange(onParamsChange);
    gui.add(params, 'zDepth', 0, 1000).name('Z Depth');
    gui.add(params, 'noiseStrength', 0, 600).name('Noise Strength');
    gui.add(params, 'noiseSpeed', 0, 0.05).name('Noise Speed');
    gui.add(params, 'noiseScale', 0, 0.1).name('Noise Scale');
    gui.add(params, 'invertZ').name('Invert Z');
    //gui.add(this, 'saveImage').name('Snapshot');
    //  gui.close();
    gui.domElement.style.display = 'none';

    //Init 3D
    scene = new THREE.Scene();
    //  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 5000);
    camera = new THREE.PerspectiveCamera(fov, width / height, 1, 5000);
    camera.target = new THREE.Vector3(0, 0, 0);
    scene.add(camera);
    camera.position.z = 600;
    controls = new THREE.OrbitControls(camera);

    //init webcam texture
    video = document.createElement('video');
    video.width = vidWidth;
    video.height = vidHeight;
    video.autoplay = true;
    video.loop = true;

    //make it cross browser
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    //get webcam
    navigator.getUserMedia({
      video: true
    }, function (stream) {
      //on webcam enabled
      //    video.src = window.URL.createObjectURL(stream);
      video.srcObject = stream;
      prompt.style.display = 'none';
      //    title.style.display = 'inline';
      container.style.display = 'inline';
      gui.domElement.style.display = 'inline';
    }, function (error) {
      prompt.innerHTML = 'Unable to capture WebCam. Please reload the page.';
    });

    videoTexture = new THREE.Texture(video);
    videoTexture.minFilter = THREE.LinearFilter;

    world3D = new THREE.Object3D();
    scene.add(world3D);

    //add mirror plane
    geometry = new THREE.PlaneGeometry(640, 480, canvasWidth, canvasHeight);
    //  geometry = new THREE.PlaneGeometry(512, 512, canvasWidth, canvasHeight);
    geometry.dynamic = true;
    meshMaterial = new THREE.MeshBasicMaterial({
      opacity: 1,
      map: videoTexture
    });
    var mirror = new THREE.Mesh(geometry, meshMaterial);
    world3D.add(mirror);

    //add wireframe plane
    wireMaterial = new THREE.MeshBasicMaterial({
      opacity: 0.1,
      color: 0xffffff,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    var wiremirror = new THREE.Mesh(geometry, wireMaterial);
    world3D.add(wiremirror);
    wiremirror.position.z = 5;

    //init renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.sortObjects = false;
    //  renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // add Stats
    stats = new Stats();
    document.querySelector('.fps').appendChild(stats.domElement);

    //init vidCanvas - used to analyze the video pixels
    vidCanvas = document.createElement('canvas');
    //  document.body.appendChild(vidCanvas);
    var canvas4 = document.getElementById('canvas4');
    canvas4.insertBefore(vidCanvas, canvas4.firstChild);
    vidCanvas.style.position = 'absolute';
    vidCanvas.style.display = 'none';
    ctx = vidCanvas.getContext('2d');

    //init listeners
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onResize, false);
    document.addEventListener('mousewheel', onWheel, false);
    //  container.addEventListener('click', hideInfo, false);
    //  document.querySelector('.closeBtn').addEventListener('click', hideInfo, false);
    //  title.addEventListener('click', showInfo, false);

    //handle WebGL context lost
    renderer.domElement.addEventListener("webglcontextlost", function (event) {
      prompt.style.display = 'inline';
      prompt.innerHTML = 'WebGL Context Lost. Please try reloading the page.';
    }, false);

    onResize();

    animate();

  }

  // params for dat.gui

  function WCMParams() {
    this.zoom = 1;
    this.mOpac = 1;
    this.wfOpac = 0.1;
    this.contrast = 3;
    this.saturation = 1;
    this.invertZ = false;
    this.zDepth = 400;
    this.noiseStrength = 200;
    this.noiseScale = 0.01;
    this.noiseSpeed = 0.02;
    //this.doSnapshot = function() {};
  }

  function onParamsChange() {
    meshMaterial.opacity = params.mOpac;
    wireMaterial.opacity = params.wfOpac;
    container.style.webkitFilter = "contrast(" + params.contrast + ") saturate(" + params.saturation + ")";
  }

  function getZDepths() {

    noisePosn += params.noiseSpeed;

    //draw webcam video pixels to canvas for pixel analysis
    //double up on last pixel get because there is one more vert than pixels
    ctx.drawImage(video, 0, 0, canvasWidth + 1, canvasHeight + 1);
    pixels = ctx.getImageData(0, 0, canvasWidth + 1, canvasHeight + 1).data;

    for (var i = 0; i < canvasWidth + 1; i++) {
      for (var j = 0; j < canvasHeight + 1; j++) {
        var color = new THREE.Color(getColor(i, j));
        var brightness = getBrightness(color);
        var gotoZ = params.zDepth * brightness - params.zDepth / 2;

        //add noise wobble
        gotoZ += perlin.noise(i * params.noiseScale, j * params.noiseScale, noisePosn) * params.noiseStrength;
        //invert?
        if (params.invertZ) gotoZ = -gotoZ;
        //tween to stablize
        geometry.vertices[j * (canvasWidth + 1) + i].z += (gotoZ - geometry.vertices[j * (canvasWidth + 1) + i].z) / 5;
      }
    }
    geometry.verticesNeedUpdate = true;
  }

  function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / (windowHalfX);
    mouseY = (event.clientY - windowHalfY) / (windowHalfY);
  }

  function animate() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      videoTexture.needsUpdate = true;
      getZDepths();
    }
    stats.update();
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    world3D.scale = new THREE.Vector3(params.zoom, params.zoom, 1);
    world3D.rotation.x += ((mouseY * tiltAmount) - world3D.rotation.x) * tiltSpeed;
    world3D.rotation.y += ((mouseX * tiltAmount) - world3D.rotation.y) * tiltSpeed;
    //camera.lookAt(camera.target);
    renderer.render(scene, camera);
  }

  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    //  renderer.setSize(width, height);
    camera.aspect = window.innerWidth / window.innerHeight;
    //  camera.aspect = width / height;
    camera.updateProjectionMatrix();
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    //    windowHalfX = width / 2;// windowHalfY = height / 2;
  }

  // Returns a hexidecimal color for a given pixel in the pixel array.

  function getColor(x, y) {
    var base = (Math.floor(y) * (canvasWidth + 1) + Math.floor(x)) * 4;
    var c = {
      r: pixels[base + 0],
      g: pixels[base + 1],
      b: pixels[base + 2],
      a: pixels[base + 3]
    };
    return (c.r << 16) + (c.g << 8) + c.b;
  }

  //return pixel brightness between 0 and 1 based on human perceptual bias

  function getBrightness(c) {
    return (0.34 * c.r + 0.5 * c.g + 0.16 * c.b);
  }

  //function hideInfo() {
  //  info.style.display = 'none';
  //  title.style.display = 'inline';
  //}
  //
  //function showInfo() {
  //  info.style.display = 'inline';
  //  title.style.display = 'none';
  //}

  function onWheel(event) {

    params.zoom += event.wheelDelta * 0.002;
    //limit
    params.zoom = Math.max(params.zoom, 0.1);
    params.zoom = Math.min(params.zoom, 5);

    //update gui slider
    gui.__controllers[0].updateDisplay();
  }

  //function saveImage() {
  //  render();
  //  window.open(renderer.domElement.toDataURL("image/png"));
  //}

  //start the show
  detectSpecs();
}




"use strict";

// ページが読み込み終わったら初期化する
//window.addEventListener("load", initWebGL1_2);

var world = null;

function initWebGL1_2() {

  // グローバルに「world」インスタンスを用意しなければならない
  //  var world = null;

  /** LiquidFunの単位はメートル。px換算の数値を設定します。 */
  var METER = 100 / 2;
  /** 時間のステップを設定します。60FPSを示します。 */
  var TIME_STEP = 1.0 / 60.0;
  /** 速度の計算回数です。回数が多いほど正確になりますが、計算負荷が増えます。 */
  var VELOCITY_ITERATIONS = 1;
  /** 位置の計算回数です。回数が多いほど正確になりますが、計算負荷が増えます。 */
  var POSITION_ITERATIONS = 1;
  /** パーティクルのサイズです。 */
  var SIZE_PARTICLE = 4 / 2;
  /** ドラッグボールのサイズです。 */
  var SIZE_DRAGBLE = 50 / 2;

  var windowW, windowH;

  /////** 画面のサイズ(横幅)です。 */
  //var windowW = $('.cont').innerWidth() / 2;
  /////** 画面のサイズ(高さ)です。 */
  //var windowH = $('.cont').innerHeight() / 2;
  /** DPIです。 */
  var dpi = window.devicePixelRatio || 1.0;

  /** [Pixi.js] ステージです。 */
  var stage;
  var app;
  /** [Pixi.js] ドラッグボールの表示オブジェクトです。 */
  var _pixiDragBall;
  /** [Pixi.js] 粒子の表示オブジェクトの配列です。 */
  var _pixiParticles = [];
  var _isDragging = false;

  /** [LiquidFun] パーティクルシステムです。 */
  var _b2ParticleSystem;
  /** [LiquidFun] ドラッグボール用のインスタンスです。 */
  var _b2DragBallFixutre;
  /** [LiquidFun] マクスジョイントです。 */
  var _b2MouseJoint;
  /** [LiquidFun] ドラッグボール制御用のインスタンスです。 */
  var _b2GroundBody;

  /** 端末ごとにパフォーマンスを調整するための変数です。 */
  var performanceLevel;
  switch (navigator.platform) {
    case "Win32": // Windowsだったら
    case "MacIntel": // OS Xだったら
      performanceLevel = "high";
      break;
    case "iPhone": // iPhoneだったら
    default:
      // その他の端末も
      performanceLevel = "low";
  }

  // ページが読み込み終わったら初期化する
  //window.addEventListener("load", initWebGL1_2);

  init();

  function init() {
    windowW = $('.cont').innerWidth() / 2;
    windowH = $('.cont').innerHeight() / 2;
    // 重力の設定
    var gravity = new b2Vec2(0, 10);
    // Box2D(LiquidFun)の世界を作成
    world = new b2World(gravity);

    // グランドの作成
    _b2GroundBody = world.CreateBody(new b2BodyDef());

    // Box2Dのコンテンツを作成
    createPhysicsWalls();
    createPhysicsParticles();
    createPhysicsBall();

    // Pixiのコンテンツを作成
    createPixiWorld();

    // 定期的に呼び出す関数(エンターフレーム)を設定
    handleTick();

    setupDragEvent();
  }

  /** LiquidFunの世界で「壁」を生成します。 */
  function createPhysicsWalls() {
    var density = 0;

    var bdDef = new b2BodyDef();
    var bobo = world.CreateBody(bdDef);
    // 壁の生成 (地面)
    var wg = new b2PolygonShape();
    wg.SetAsBoxXYCenterAngle(
      windowW / METER / 2, // 幅
      5 / METER, // 高さ
      new b2Vec2(
        windowW / METER / 2, // X座標
        windowH / METER + 0.05
      ), // Y座標
      0
    );
    bobo.CreateFixtureFromShape(wg, density);

    // 壁の生成 (左側)
    var wgl = new b2PolygonShape();
    wgl.SetAsBoxXYCenterAngle(
      5 / METER, // 幅
      windowH / METER / 2, // 高さ
      new b2Vec2(
        -0.05, // X座標
        windowH / METER / 2
      ), // Y座標
      0
    );
    bobo.CreateFixtureFromShape(wgl, density);

    // 壁の生成 (右側)
    var wgr = new b2PolygonShape();
    wgr.SetAsBoxXYCenterAngle(
      5 / METER, // 幅
      windowH / METER / 2, // 高さ
      new b2Vec2(
        windowW / METER + 0.05, // X座標
        windowH / METER / 2
      ), // Y座標
      0
    );
    bobo.CreateFixtureFromShape(wgr, density);
  }

  /** LiquidFunの世界で「粒子」を生成します。 */
  function createPhysicsParticles() {
    // 粒子の作成 (プロパティーの設定)
    var psd = new b2ParticleSystemDef();
    psd.radius = SIZE_PARTICLE / METER; // 粒子の半径
    psd.pressureStrength = 4.0; // Increases pressure in response to compression Smaller values allow more compression
    _b2ParticleSystem = world.CreateParticleSystem(psd);
    // 粒子の発生領域
    var box = new b2PolygonShape();

    var w = performanceLevel === "high" ? 256 / 2 : 128 / 2;
    var h = performanceLevel === "high" ? 384 / 2 : 128 / 2;
    box.SetAsBoxXYCenterAngle(
      w / METER, // 幅
      h / METER, // 高さ
      new b2Vec2(
        windowW / 2 / METER, // 発生X座標
        -windowH / 2 / METER
      ), // 発生Y座標
      0
    );
    var particleGroupDef = new b2ParticleGroupDef();
    particleGroupDef.shape = box; // 発生矩形を登録
    _b2ParticleSystem.CreateParticleGroup(particleGroupDef);
  }

  function createPhysicsBall() {
    // 属性を設定
    var bd = new b2BodyDef();
    bd.type = b2_dynamicBody;
    bd.position.Set(
      windowW / 2 / METER, // 発生X座標
      -windowH * 1.5 / METER // 発生Y座標
    );
    // 形状を設定
    var circle = new b2CircleShape();
    circle.radius = SIZE_DRAGBLE / METER;

    // 実態を作成
    var body = world.CreateBody(bd);
    _b2DragBallFixutre = body.CreateFixtureFromShape(circle, 8); //鉄：7.9、アルミニウム：2.6、ゴム：0.4、木：1.4、コンクリート：2.4、氷：1;
    _b2DragBallFixutre.friction = 0.1; // 鉄：0.6、アルミニウム：0.6、ゴム：0.9、木：0.5、コンクリート：0.7、氷：0
    _b2DragBallFixutre.restitution = 0.1; // 鉄：0.2、アルミニウム：0.3、ゴム：0.9、木：0.3、コンクリート：0.1、氷：0.1
  }

  function createPixiWorld() {
    // Pixiの世界を作成
    app = new PIXI.Application(windowW, windowH, {
      resolution: dpi,
      autoStart: true
    });
    //  document.body.appendChild(app.view);
    var canvas2 = document.getElementById('canvas2');
    canvas2.insertBefore(app.view, canvas2.firstChild);
    stage = app.stage;

    // canvas 要素でグラフィックを作成 (ドローコール削減のため)
    var canvas = document.createElement("canvas");
    canvas.width = SIZE_PARTICLE * 2 * dpi; //16
    canvas.height = SIZE_PARTICLE * 2 * dpi; //16
    var ctx = canvas.getContext("2d");
    ctx.arc(
      SIZE_PARTICLE * dpi,
      SIZE_PARTICLE * dpi,
      SIZE_PARTICLE * dpi / 2,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "white";
    ctx.fill();

    // canvas 要素をテクスチャーに変換
    var texture = PIXI.Texture.fromCanvas(canvas);

    // パーティクルの作成
    var length = _b2ParticleSystem.GetPositionBuffer().length / 2;
    for (var i = 0; i < length; i++) {
      var shape = new PIXI.Sprite(texture); // シェイプを作成
      shape.scale.set(1 / dpi);
      shape.pivot.x = SIZE_PARTICLE * dpi; //8
      shape.pivot.y = SIZE_PARTICLE * dpi; //8

      stage.addChild(shape); // 画面に追加
      _pixiParticles[i] = shape; // 配列に格納
    }

    // ドラッグボールの作成
    _pixiDragBall = new PIXI.Graphics();
    _pixiDragBall.beginFill(0x990000); // 色指定
    _pixiDragBall.drawCircle(0, 0, SIZE_DRAGBLE); // 大きさを指定
    stage.addChild(_pixiDragBall); // 画面に追加
  }

  /** 時間経過で指出される関数です。 */
  function handleTick() {
    // 物理演算エンジンを更新
    world.Step(TIME_STEP, VELOCITY_ITERATIONS, POSITION_ITERATIONS);

    // パーティクルシステムの計算結果を取得
    var particlesPositions = _b2ParticleSystem.GetPositionBuffer();

    // 粒子表現 : 物理演算エンジンとPixiの座標を同期
    for (var i = 0; i < _pixiParticles.length; i++) {
      var shape = _pixiParticles[i]; // 配列から要素を取得
      // LiquidFunの配列から座標を取得
      var xx = particlesPositions[i * 2] * METER;
      var yy = particlesPositions[i * 2 + 1] * METER;
      // 座標を表示パーツに適用
      shape.x = xx;
      shape.y = yy;
    }

    // ドラッグボール : 物理演算エンジンとPixiの座標を同期
    _pixiDragBall.x = _b2DragBallFixutre.body.GetPosition().x * METER;
    _pixiDragBall.y = _b2DragBallFixutre.body.GetPosition().y * METER;

    requestAnimationFrame(handleTick);
  }

  /** ドラッグイベントを設定します。 */
  function setupDragEvent() {
    _pixiDragBall.interactive = true;
    _pixiDragBall.on("mousedown", dragStart);
    _pixiDragBall.on("mousemove", dragMove);
    _pixiDragBall.on("mouseup", dragEnd);
    _pixiDragBall.on("mouseupoutside", dragEnd);
    _pixiDragBall.on("touchstart", dragStart);
    _pixiDragBall.on("touchmove", dragMove);
    _pixiDragBall.on("touchend", dragEnd);
    _pixiDragBall.on("touchendoutside", dragEnd);

    function dragStart(event) {
      _isDragging = true;
      var p = getMouseCoords(event.data.global);
      var aabb = new b2AABB();
      aabb.lowerBound.Set(p.x - 0.001, p.y - 0.001);
      aabb.upperBound.Set(p.x + 0.001, p.y + 0.001);
      var queryCallback = new QueryCallback(p);
      world.QueryAABB(queryCallback, aabb);

      if (queryCallback.fixture) {
        var body = queryCallback.fixture.body;
        var md = new b2MouseJointDef();
        md.bodyA = _b2GroundBody;
        md.bodyB = body;
        md.target = p;
        md.maxForce = 1000 * body.GetMass();
        // マウスジョイントを作成
        _b2MouseJoint = world.CreateJoint(md);
        body.SetAwake(true);
      }
    }

    function dragMove(event) {
      if (_isDragging === true) {
        var p = getMouseCoords(event.data.global);
        if (_b2MouseJoint) {
          // マウスジョイントの対象座標を更新
          _b2MouseJoint.SetTarget(p);
        }
      }
    }

    function dragEnd(event) {
      _isDragging = false;
      if (_b2MouseJoint) {
        // マウスジョイントを破棄
        world.DestroyJoint(_b2MouseJoint);
        _b2MouseJoint = null;
      }
    }
  }

  /**
   * マウス座標を取得します。
   * @return b2Vec2 マウス座標のベクター情報です。
   */
  function getMouseCoords(point) {
    var p = new b2Vec2(point.x / METER, point.y / METER);
    return p;
  }

  /**
   * LiquidFun の衝突判定に使うクラスです。
   * @constructor
   */
  function QueryCallback(point) {
    this.point = point;
    this.fixture = null;
  }
  /**@return bool 当たり判定があれば true を返します。 */
  QueryCallback.prototype.ReportFixture = function (fixture) {
    var body = fixture.body;
    if (body.GetType() === b2_dynamicBody) {
      var inside = fixture.TestPoint(this.point);
      if (inside) {
        this.fixture = fixture;
        return true;
      }
    }
    return false;
  };

}


//function createPhysicsWalls() {
//  var density = 0;
//  var bdDef = new b2BodyDef();
//  var bobo = world.CreateBody(bdDef);
//  var wg = new b2PolygonShape();
//  wg.SetAsBoxXYCenterAngle(
//    webgl1_2.windowW / webgl1_2.METER / 2,
//    5 / webgl1_2.METER,
//    new b2Vec2(
//      webgl1_2.windowW / webgl1_2.METER / 2,
//      webgl1_2.windowH / webgl1_2.METER + 0.05
//    ),
//    0
//  );
//  bobo.CreateFixtureFromShape(wg, density);
//  var wgl = new b2PolygonShape();
//  wgl.SetAsBoxXYCenterAngle(
//    5 / webgl1_2.METER,
//    webgl1_2.windowH / webgl1_2.METER / 2,
//    new b2Vec2(
//      -0.05,
//      webgl1_2.windowH / webgl1_2.METER / 2
//    ),
//    0
//  );
//  bobo.CreateFixtureFromShape(wgl, density);
//  var wgr = new b2PolygonShape();
//  wgr.SetAsBoxXYCenterAngle(
//    5 / webgl1_2.METER,
//    webgl1_2.windowH / webgl1_2.METER / 2,
//    new b2Vec2(
//      webgl1_2.windowW / webgl1_2.METER + 0.05,
//      webgl1_2.windowH / webgl1_2.METER / 2
//    ),
//    0
//  );
//  bobo.CreateFixtureFromShape(wgr, density);
//}
//
//function createPhysicsParticles() {
//  var psd = new b2ParticleSystemDef();
//  psd.radius = webgl1_2.SIZE_PARTICLE / webgl1_2.METER;
//  psd.pressureStrength = 4.0;
//  webgl1_2._b2ParticleSystem = world.CreateParticleSystem(psd);
//  var box = new b2PolygonShape();
//  var w = webgl1_2.performanceLevel === "high" ? 256 / 2 : 128 / 2;
//  var h = webgl1_2.performenceLevel === "high" ? 384 / 2 : 128 / 2;
//  box.SetAsBoxXYCenterAngle(
//    w / webgl1_2.METER,
//    h / webgl1_2.METER,
//    new b2Vec2(
//      webgl1_2.windowW / 2 / webgl1_2.METER,
//      -webgl1_2.windowH / 2 / webgl1_2.METER
//    ),
//    0
//  );
//  var particleGroupDef = new b2ParticleGroupDef();
//  particleGroupDef.shape = box;
//  webgl1_2._b2ParticleSystem.CreateParticleGroup(particleGroupDef);
//}
//
//function createPhysicsBall() {
//  var bd = new b2BodyDef();
//  bd.type = b2_dynamicBody;
//  bd.position.Set(
//    webgl1_2.windowW / 2 / webgl1_2.METER,
//    -webgl1_2.windowH * 1.5 / webgl1_2.METER
//  );
//  var circle = new b2CircleShape();
//  circle.radius = webgl1_2.SIZE_DRAGBLE / webgl1_2.METER;
//
//  var body = world.CreateBody(bd);
//  webgl1_2._b2DragBallFixutre = body.CreateFixtureFromShape(circle, 8);
//  webgl1_2._b2DragBallFixutre.friction = 0.1;
//  webgl1_2._b2DragBallFixutre.restitution = 0.1;
//}
//
//function createPixiWorld() {
//  webgl1_2.app = new PIXI.Application(webgl1_2.windowW, webgl1_2.windowH, {
//    resolution: webgl1_2.dpi,
//    autoStart: true
//  });
//  var canvas2 = document.getElementById('canvas2');
//  canvas2.insertBefore(webgl1_2.app.view, canvas2.firstChild);
//  webgl1_2.stage = webgl1_2.app.stage;
//
//  var canvas = document.createElement("canvas");
//  canvas.width = webgl1_2.SIZE_PARTICLE * 2 * webgl1_2.dpi; //16
//  canvas.height = webgl1_2.SIZE_PARTICLE * 2 * webgl1_2.dpi; //16
//  var ctx = canvas.getContext("2d");
//  ctx.arc(
//    webgl1_2.SIZE_PARTICLE * webgl1_2.dpi,
//    webgl1_2.SIZE_PARTICLE * webgl1_2.dpi,
//    webgl1_2.SIZE_PARTICLE * webgl1_2.dpi / 2,
//    0,
//    2 * Math.PI,
//    false
//  );
//  ctx.fillStyle = "white";
//  ctx.fill();
//
//  var texture = PIXI.Texture.fromCanvas(canvas);
//
//  var length = webgl1_2._b2ParticleSystem.GetPositionBuffer().length / 2;
//  for (var i = 0; i < length; i++) {
//    var shape = new PIXI.Sprite(texture);
//    shape.scale.set(1 / webgl1_2.dpi);
//    shape.pivot.x = webgl1_2.SIZE_PARTICLE * webgl1_2.dpi; //8
//    shape.pivot.y = webgl1_2.SIZE_PARTICLE * webgl1_2.dpi; //8
//
//    webgl1_2.stage.addChild(shape);
//    webgl1_2._pixiParticles[i] = shape;
//  }
//
//  webgl1_2._pixiDragBall = new PIXI.Graphics();
//  webgl1_2._pixiDragBall.beginFill(0x990000);
//  webgl1_2._pixiDragBall.drawCircle(0, 0, webgl1_2.SIZE_DRAGBLE);
//  webgl1_2.stage.addChild(webgl1_2._pixiDragBall);
//}
//
//function setupDragEvent() {
//  webgl1_2._pixiDragBall.interactive = true;
//  webgl1_2._pixiDragBall.on("mousedown", dragStart);
//  webgl1_2._pixiDragBall.on("mousemove", dragMove);
//  webgl1_2._pixiDragBall.on("mouseup", dragEnd);
//  webgl1_2._pixiDragBall.on("mouseupoutside", dragEnd);
//  webgl1_2._pixiDragBall.on("touchstart", dragStart);
//  webgl1_2._pixiDragBall.on("touchmove", dragMove);
//  webgl1_2._pixiDragBall.on("touchend", dragEnd);
//  webgl1_2._pixiDragBall.on("touchendoutside", dragEnd);
//
//  function dragStart(event) {
//    webgl1_2._isDragging = true;
//    var p = getMouseCoords(event.data.global);
//    var aabb = new b2AABB();
//    aabb.lowerBound.Set(p.x - 0.001, p.y - 0.001);
//    aabb.upperBound.Set(p.x + 0.001, p.y + 0.001);
//    var queryCallback = new QueryCallback(p);
//    world.QueryAABB(queryCallback, aabb);
//
//    if (queryCallback.fixture) {
//      var body = queryCallback.fixture.body;
//      var md = new b2MouseJointDef();
//      md.bodyA = webgl1_2._b2GroundBody;
//      md.bodyB = body;
//      md.target = p;
//      md.maxForce = 1000 * body.GetMass();
//      webgl1_2._b2MouseJoint = world.CreateJoint(md);
//      body.SetAwake(true);
//    }
//  }
//
//  function dragMove(event) {
//    if (webgl1_2._isDragging === true) {
//      var p = getMouseCoords(event.data.global);
//      if (webgl1_2._b2MouseJoint) {
//        webgl1_2._b2MouseJoint.SetTarget(p);
//      }
//    }
//  }
//
//  function dragEnd(event) {
//    webgl1_2._isDragging = false;
//    if (webgl1_2._b2MouseJoint) {
//      world.DestroyJoint(webgl1_2._b2MouseJoint);
//      webgl1_2._b2MouseJoint = null;
//    }
//  }
//}
//
//function getMouseCoords(point) {
//  var p = new b2Vec2(point.x / webgl1_2.METER, point.y / webgl1_2.METER);
//  return p;
//}
//
//function QueryCallback(point) {
//  this.point = point;
//  this.fixture = null;
//}
//
//QueryCallback.prototype.ReportFixture = function (fixture) {
//  var body = fixture.body;
//  if (body.GetType() === b2_dynamicBody) {
//    var inside = fixture.TestPoint(this.point);
//    if (inside) {
//      this.fixture = fixture;
//      return true;
//    }
//  }
//  return false;
//};
//
//tickObj.tick1 = function () {
//  world.Step(webgl1_2.TIME_STEP, webgl1_2.VELOCITY_ITERATIONS, webgl1_2.POSITION_ITERATIONS);
//
//  var particlesPositions = webgl1_2._b2ParticleSystem.GetPositionBuffer();
//
//  for (var i = 0; i < webgl1_2._pixiParticles.length; i++) {
//    var shape = webgl1_2._pixiParticles[i];
//    var xx = particlesPositions[i * 2] * webgl1_2.METER;
//    var yy = particlesPositions[i * 2 + 1] * webgl1_2.METER;
//    shape.x = xx;
//    shape.y = yy;
//  }
//
//  webgl1_2._pixiDragBall.x = webgl1_2._b2DragBallFixutre.body.GetPosition().x * webgl1_2.METER;
//  webgl1_2._pixiDragBall.y = webgl1_2._b2DragBallFixutre.body.GetPosition().y * webgl1_2.METER;
//  count++;
//  console.log(count);
//  callbackId = requestAnimationFrame(tick1);
//  //  requestAnimationFrame(tick1);
//}

//
//
//// ページの読み込みを待つ
//window.addEventListener('load', initWebGL1_1);
//
//'use strict';
//
//function initWebGL1_1() {
//  // サイズを指定
//  //  const width = window.innerWidth;
//  //  const height = window.innerHeight;
//  const width = $('.cont').width();
//  const height = $('.cont').height();
//  // レンダラーを作成
//  const renderer = new THREE.WebGLRenderer({
//    canvas: document.querySelector('#myCanvas1'),
//  });
//  renderer.setSize(width, height);
//  // シーンを作成
//  const scene = new THREE.Scene();
//  // カメラを作成
//  //  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
//  const camera = new THREE.PerspectiveCamera(45, width / height);
//  //    camera.position.set(100, 150, 500);
//  camera.position.set(0, 0, +1000);
//  camera.lookAt(new THREE.Vector3(0, 0, 0));
//  const controls = new THREE.OrbitControls(camera);
//  //スポットライト
//  const spotLight = new THREE.SpotLight(0x223344);
//  spotLight.position.set(5, 20, 15);
//  spotLight.angle = 0.8;
//  spotLight.intensity = 0.7;
//  spotLight.penumbra = 0.8;
//  spotLight.castShadow = true;
//  spotLight.shadow.bias = -0.001;
//  scene.add(spotLight);
//  scene.add(spotLight.target);
//  // 平行光源
//  const directionalLight = new THREE.DirectionalLight(0xaaaaaa);
//  directionalLight.position.set(-15, 15, 20);
//  directionalLight.castShadow = true;
//  directionalLight.shadow.mapSize.x = 1024;
//  directionalLight.shadow.mapSize.y = 1024;
//  directionalLight.shadow.camera.right = 20;
//  directionalLight.shadow.camera.top = 20;
//  directionalLight.shadow.camera.left = -20;
//  directionalLight.shadow.camera.bottom = -20;
//  renderer.shadowMap.renderSingleSided = false;
//  renderer.shadowMap.renderReverseSided = false;
//  directionalLight.shadow.bias = -0.001;
//  scene.add(directionalLight);
//  // 環境光源
//  const ambientLight = new THREE.AmbientLight(0x333333);
//  scene.add(ambientLight);
//  // 直方体を作成
//  const material = new THREE.MeshStandardMaterial({
//    color: 0xffffff
//  });
//  // const geometry = new THREE.SphereGeometry(100, 100, 100);
//  const geometry = new THREE.BoxGeometry(50, 50, 50);
//  const mesh = new THREE.Mesh(geometry, material);
//  mesh.name = "sample";
//  scene.add(mesh);
//
//  var posX, posY, posZ;
//  var flg = false;
//  var meshList = [];
//  //  var j = 0;
//  for (var j = 0; j < 200; j++) {
//    const mesh = new THREE.Mesh(geometry, material);
//    mesh.position.x = (Math.random() - 0.5) * 800;
//    mesh.position.y = (Math.random() - 0.5) * 800;
//    mesh.position.z = (Math.random() - 0.5) * 800;
//    mesh.rotation.x = Math.random() * 2 * Math.PI;
//    mesh.rotation.y = Math.random() * 2 * Math.PI;
//    mesh.rotation.z = Math.random() * 2 * Math.PI;
//    //    meshList.push(mesh);
//    scene.add(mesh);
//  }
//
//
//  //  const mouse = new THREE.Vector2();
//  //  window.addEventListener("mousemove", function (e) {
//  //    var rect = e.target.getBoundingClientRect();
//  //    var mouseX = e.clientX - rect.left;
//  //    var mouseY = e.clientY - rect.top;
//  //    mouseX = (mouseX / window.innerWidth) * 2 - 1;
//  //    mouseY = -(mouseY / window.innerHeight) * 2 + 1;
//  //    var pos = new THREE.Vector3(mouseX, mouseY, 1);
//  //    pos.unproject(camera);
//  //    meshList[j].position.x = pos.x;
//  //    meshList[j].position.y = pos.y;
//  //    meshList[j].position.z = pos.z;
//  //    meshList[j].rotation.x = Math.random() * 2 * Math.PI;
//  //    meshList[j].rotation.y = Math.random() * 2 * Math.PI;
//  //    meshList[j].rotation.z = Math.random() * 2 * Math.PI;
//  //    scene.add(meshList[j]);
//  //
//  //    if (j < 99) {
//  //      j = j + 1;
//  //    } else {
//  //      j = 0;
//  //    }
//  //  });
//  tick();
//  //    毎フレーム時に実行されるループイベントです
//  function tick() {
//    renderer.render(scene, camera);
//    requestAnimationFrame(tick);
//  }
//}
//
//
