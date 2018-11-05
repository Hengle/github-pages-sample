// Start the app
require(['detector', 'app', 'container', "scene"], function (Detector, app, container, scene) {
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    container.innerHTML = "";
  }

  // Initialize our app and start the animation loop (animate is expected to call itself)
  app.init();
  app.animate();

  //  const geo = new THREE.SphereGeometry(30, 30, 30);
  //  const mat = new THREE.MeshPhongMaterial({
  //    color: 0xFFffff
  //  });
  //  const mesh = new THREE.Mesh(geo, mat);
  //  scene.add(mesh);

  //  var geometry = new THREE.Geometry();
  //  geometry.vertices.push(new THREE.Vector3(-100, 0, 0));
  //  geometry.vertices.push(new THREE.Vector3(100, 0, 0));
  //  var material = new THREE.LineBasicMaterial({
  //    color: 0x00FFFF,
  //    linewidth: 2
  //  });
  //  line = new THREE.Line(geometry, material);
  //  scene.add(line);


});
