define(["three", "ImprovedNoise", "scene"], function (THREE, ImprovedNoise, scene) {
  // Create noise and save it to texture
  var width = 1024;
  var size = width * width;
  var data = new Uint8Array(size);

  // Zero out height data
  for (var i = 0; i < size; i++) {
    data[i] = 0;
  }

  var perlin = new ImprovedNoise();
  var quality = 1;
  var z = Math.random() * 100;


  // Do several passes to get more detail
  for (var iteration = 0; iteration < 4; iteration++) {
    for (var i = 0; i < size; i++) {
      var x = i % width;
      var y = Math.floor(i / width);
      data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality);
    }
    quality *= 5;
  }


  //  var geo = new THREE.Geometry();
  //  geo.vertices.push(new THREE.Vector3(-100, 0, 0));
  //  geo.vertices.push(new THREE.Vector3(100, 0, 0));
  //  var mat = new THREE.LineBasicMaterial({
  //    color: 0x00FFFF,
  //    linewidth: 2
  //  });
  //  line = new THREE.Line(geo, mat);
  //  scene.add(line);

  var noise = new THREE.DataTexture(data, width, width, THREE.AlphaFormat);
  noise.wrapS = THREE.MirroredRepeatWrapping;
  noise.wrapT = THREE.MirroredRepeatWrapping;
  noise.magFilter = THREE.LinearFilter;
  noise.minFilter = THREE.LinearMipMapLinearFilter;
  noise.generateMipmaps = true;
  noise.needsUpdate = true;
  return noise;
});
