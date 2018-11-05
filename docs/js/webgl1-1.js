// ページの読み込みを待つ
//window.addEventListener('load', initWebGL1_1);

'use strict';

function initWebGL1_1() {
  // サイズを指定
  //  const width = window.innerWidth;
  //  const height = window.innerHeight;
  const width = $('.cont').width();
  const height = $('.cont').height();
  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas1'),
    //    alpha: true
  });
  renderer.setSize(width, height);
  // シーンを作成
  const scene = new THREE.Scene();
  // カメラを作成
  //  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  const camera = new THREE.PerspectiveCamera(45, width / height);
  //    camera.position.set(100, 150, 500);
  camera.position.set(0, 0, +1000);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  const controls = new THREE.OrbitControls(camera);
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
  const geometry = new THREE.BoxGeometry(50, 50, 50);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "sample";
  scene.add(mesh);

  var posX, posY, posZ;
  var flg = false;
  var meshList = [];
  //  var j = 0;
  for (var j = 0; j < 200; j++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 800;
    mesh.position.y = (Math.random() - 0.5) * 800;
    mesh.position.z = (Math.random() - 0.5) * 800;
    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    mesh.rotation.z = Math.random() * 2 * Math.PI;
    //    meshList.push(mesh);
    scene.add(mesh);
  }
  //  tick0();
  tickObj.tick0 = function () {
    //  function tick0() {
    renderer.render(scene, camera);
    callbackId = requestAnimationFrame(tickObj["tick0"]);
  }
  tickObj["tick0"]();
}
