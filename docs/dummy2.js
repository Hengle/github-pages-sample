class WebGL1_1 {
  constructor() {
    this.width = $('.cont').width();
    this.height = $('.cont').height();
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#myCanvas1'),
    });
    //    var renderer1_1 = this.renderer.setSize(this.width, this.height);
    this.renderer.setSize(this.width, this.height);
    var renderer1_1 = this.renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height);
    this.camera.position.set(0, 0, +1000);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.controls = new THREE.OrbitControls(this.camera);
    this.spotLight = new THREE.SpotLight(0x223344);
    this.spotLight.position.set(5, 20, 15);
    this.spotLight.angle = 0.8;
    this.spotLight.intensity = 0.7;
    this.spotLight.penumbra = 0.8;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.bias = -0.001;
    this.scene.add(this.spotLight);
    this.scene.add(this.spotLight.target);
    this.directionalLight = new THREE.DirectionalLight(0xaaaaaa);
    this.directionalLight.position.set(-15, 15, 20);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.x = 1024;
    this.directionalLight.shadow.mapSize.y = 1024;
    this.directionalLight.shadow.camera.right = 20;
    this.directionalLight.shadow.camera.top = 20;
    this.directionalLight.shadow.camera.left = -20;
    this.directionalLight.shadow.camera.bottom = -20;
    this.renderer.shadowMap.renderSignalSided = false;
    this.renderer.shadowMap.renderReverseSided = false;
    this.directionalLight.shadow.bias = -0.001;
    this.scene.add(this.directionalLight);
    this.ambientLight = new THREE.AmbientLight(0x333333);
    this.scene.add(this.ambientLight);
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffffff
    });
    this.geometry = new THREE.BoxGeometry(50, 50, 50);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = "sample";
    this.scene.add(this.mesh);

    this.flg = false;
    this.meshList = [];
    for (var j = 0; j < 200; j++) {
      const mesh = new THREE.Mesh(this.geometry, this.material);
      mesh.position.x = (Math.random() - 0.5) * 800;
      mesh.position.y = (Math.random() - 0.5) * 800;
      mesh.position.z = (Math.random() - 0.5) * 800;
      mesh.rotation.x = Math.random() * 2 * Math.PI;
      mesh.rotation.y = Math.random() * 2 * Math.PI;
      mesh.rotation.z = Math.random() * 2 * Math.PI;
      this.scene.add(mesh);
    }
  }
}

var webgl1_1;

startObj.start0 = function start() {
  webgl1_1 = new WebGL1_1();
  //  tick0();
};

tickObj.tick0 = function tick0() {
  webgl1_1.renderer.render(webgl1_1.scene, webgl1_1.camera);
  callbackId = requestAnimationFrame(tick0);
}

//var webgl1_2;
//var world = null;
//
//class WebGL1_2 {
//  constructor() {
//    this.METER = 100 / 2;
//    this.TIME_STEP = 1.0 / 60.0;
//    this.VELOCITY_ITERATIONS = 1;
//    this.POSITION_ITERATIONS = 1;
//    this.SIZE_PARTICLE = 4 / 2;
//    this.SIZE_DRAGBLE = 50 / 2;
//    this.windowW = $(".cont").innerWidth() / 2;;
//    this.windowH = $(".cont").innerHeight() / 2;;
//    this.dpi = window.devicePixcelRatio || 1.0;
//    this.stage;
//    this.app;
//    this._pixiDragBall;
//    this._pixiParticles = [];
//    this._isDragging = false;
//    this._b2ParticleSystem;
//    this._b2DtagBallFixutre;
//    this._b2MouseJoint;
//    this._b2GroundBody;
//    this.performanceLevel;
//
//    switch (navigator.platform) {
//      case "Win32":
//      case "MacIntel":
//        this.performanceLevel = "high";
//        break;
//      case "iPhone":
//      default:
//        this.performanceLevel = "low";
//    }
//  }
//}
//
////function createPhysicsWalls() {
//var createPhysicsWalls = function () {
//  var density = 0;
//  var bdDef = new b2BodyDef();
//  var bobo = world.CreateBody(bdDef);
//  var wg = new b2PolygonShape();
//  wg.SetAsBoxXYCenterAngle(
//    this.windowW / this.METER / 2,
//    5 / this.METER,
//    new b2Vec2(
//      this.windowW / this.METER / 2,
//      this.windowH / this.METER + 0.05
//    ),
//    0
//  );
//  bobo.CreateFixtureFromShape(wg, density);
//  var wgl = new b2PolygonShape();
//  wgl.SetAsBoxXYCenterAngle(
//    5 / this.METER,
//    this.windowH / this.METER / 2,
//    new b2Vec2(
//      -0.05,
//      this.windowH / this.METER / 2
//    ),
//    0
//  );
//  bobo.CreateFixtureFromShape(wgl, density);
//  var wgr = new b2PolygonShape();
//  wgr.SetAsBoxXYCenterAngle(
//    5 / this.METER,
//    this.windowH / this.METER / 2,
//    new b2Vec2(
//      this.windowW / this.METER + 0.05,
//      this.windowH / this.METER / 2
//    ),
//    0
//  );
//  bobo.CreateFixtureFromShape(wgr, density);
//}
//
////function createPhysicsParticles() {
//var createPhysicsParticles = function () {
//  var psd = new b2ParticleSystemDef();
//  psd.radius = this.SIZE_PARTICLE / this.METER;
//  psd.pressureStrength = 4.0;
//  this._b2ParticleSystem = world.CreateParticleSystem(psd);
//  var box = new b2PolygonShape();
//  var w = this.performanceLevel === "high" ? 256 / 2 : 128 / 2;
//  var h = this.performenceLevel === "high" ? 384 / 2 : 128 / 2;
//  box.SetAsBoxXYCenterAngle(
//    w / this.METER,
//    h / this.METER,
//    new b2Vec2(
//      this.windowW / 2 / this.METER,
//      -this.windowH / 2 / this.METER
//    ),
//    0
//  );
//  var particleGroupDef = new b2ParticleGroupDef();
//  particleGroupDef.shape = box;
//  this._b2ParticleSystem.CreateParticleGroup(particleGroupDef);
//}
//
//var createPhysicsBall = function () {
//  var bd = new b2BodyDef();
//  bd.type = b2_dynamicBody;
//  bd.position.Set(
//    this.windowW / 2 / this.METER,
//    -this.windowH * 1.5 / this.METER
//  );
//  var circle = new b2CircleShape();
//  circle.radius = this.SIZE_DRAGBLE / this.METER;
//
//  var body = world.CreateBody(bd);
//  this._b2DragBallFixutre = body.CreateFixtureFromShape(circle, 8);
//  this._b2DragBallFixutre.friction = 0.1;
//  this._b2DragBallFixutre.restitution = 0.1;
//}
//
//var createPixiWorld = function () {
//  this.app = new PIXI.Application(this.windowW, this.windowH, {
//    resolution: this.dpi,
//    autoStart: true
//  });
//  var canvas2 = document.getElementById('canvas2');
//  canvas2.insertBefore(this.app.view, canvas2.firstChild);
//  this.stage = this.app.stage;
//
//  var canvas = document.createElement("canvas");
//  canvas.width = this.SIZE_PARTICLE * 2 * this.dpi; //16
//  canvas.height = this.SIZE_PARTICLE * 2 * this.dpi; //16
//  var ctx = canvas.getContext("2d");
//  ctx.arc(
//    this.SIZE_PARTICLE * this.dpi,
//    this.SIZE_PARTICLE * this.dpi,
//    this.SIZE_PARTICLE * this.dpi / 2,
//    0,
//    2 * Math.PI,
//    false
//  );
//  ctx.fillStyle = "white";
//  ctx.fill();
//
//  var texture = PIXI.Texture.fromCanvas(canvas);
//
//  var length = this._b2ParticleSystem.GetPositionBuffer().length / 2;
//  //  this.length = length;
//  for (var i = 0; i < length; i++) {
//    var shape = new PIXI.Sprite(texture);
//    shape.scale.set(1 / this.dpi);
//    shape.pivot.x = this.SIZE_PARTICLE * this.dpi; //8
//    shape.pivot.y = this.SIZE_PARTICLE * this.dpi; //8
//
//    this.stage.addChild(shape);
//    this._pixiParticles[i] = shape;
//  }
//
//  this._pixiDragBall = new PIXI.Graphics();
//  this._pixiDragBall.beginFill(0x990000);
//  this._pixiDragBall.drawCircle(0, 0, this.SIZE_DRAGBLE);
//  this.stage.addChild(this._pixiDragBall);
//}
//
//var setupDragEvent = function () {
//  this._pixiDragBall.interactive = true;
//  this._pixiDragBall.on("mousedown", dragStart);
//  this._pixiDragBall.on("mousemove", dragMove);
//  this._pixiDragBall.on("mouseup", dragEnd);
//  this._pixiDragBall.on("mouseupoutside", dragEnd);
//  this._pixiDragBall.on("touchstart", dragStart);
//  this._pixiDragBall.on("touchmove", dragMove);
//  this._pixiDragBall.on("touchend", dragEnd);
//  this._pixiDragBall.on("touchendoutside", dragEnd);
//
//  function dragStart(event) {
//    this._isDragging = true;
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
//      md.bodyA = this._b2GroundBody;
//      md.bodyB = body;
//      md.target = p;
//      md.maxForce = 1000 * body.GetMass();
//      this._b2MouseJoint = world.CreateJoint(md);
//      body.SetAwake(true);
//    }
//  }
//
//  function dragMove(event) {
//    if (this._isDragging === true) {
//      var p = getMouseCoords(event.data.global);
//      if (this._b2MouseJoint) {
//        this._b2MouseJoint.SetTarget(p);
//      }
//    }
//  }
//
//  function dragEnd(event) {
//    this._isDragging = false;
//    if (this._b2MouseJoint) {
//      world.DestroyJoint(this._b2MouseJoint);
//      this._b2MouseJoint = null;
//    }
//  }
//}
//
//var getMouseCoords = function (point) {
//  var p = new b2Vec2(point.x / this.METER, point.y / this.METER);
//  return p;
//}
//
//var QueryCallback = function (point) {
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
////var setTick = function () {
////  world.Step(this.TIME_STEP, this.VELOCITY_ITERATIONS, this.POSITION_ITERATIONS);
////
////  var particlesPositions = this._b2ParticleSystem.GetPositionBuffer();
////
////  for (var i = 0; i < this.length; i++) {
////    var shape = this._pixiParticles[i];
////    var xx = particlesPositions[i * 2] * this.METER;
////    var yy = particlesPositions[i * 2 + 1] * this.METER;
////    shape.x = xx;
////    shape.y = yy;
////  }
////
////  this._pixiDragBall.x = this._b2DragBallFixutre.body.GetPosition().x * this.METER;
////  this._pixiDragBall.y = this._b2DragBallFixutre.body.GetPosition().y * this.METER;
////  callbackId = requestAnimationFrame(setTick);
////}
//
////startObj.start1 = function start1() {
//function start1() {
//  webgl1_2 = new WebGL1_2();
//
//  //  webgl1_2.windowW = $(".cont").innerWidth() / 2;
//  //  webgl1_2.windowH = $(".cont").innerHeight() / 2;
//  var gravity = new b2Vec2(0, 10);
//  world = new b2World(gravity);
//  webgl1_2._b2GroundBody = world.CreateBody(new b2BodyDef());
//  createPhysicsWalls();
//  createPhysicsParticles();
//  createPhysicsBall();
//  createPixiWorld();
//  setupDragEvent();
//  tick1();
//};
//
////tickObj.tick1 = function tick1() {
//function tick1() {
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
//};
