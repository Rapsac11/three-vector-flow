import * as THREE from 'three';

import { OrbitControls } from 'react-three-model-loader'
export function SceneSubject(scene, camera) {

	const radius = 2;
	const mesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(radius, 2), new THREE.MeshStandardMaterial({  }));
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(300,300,30,30),
    new THREE.MeshBasicMaterial({wireframe: true, color:0x333000,
    side:THREE.DoubleSide})
  )

	mesh.position.set(0, 0, -20);
  planeMesh.position.set(0, 0, -20);

	scene.add(mesh);
  scene.add(planeMesh);
  //var controls = new OrbitControls( camera )
	this.update = function(time) {
		//const scale = Math.sin(time)+2;
    //controls.update()
		//mesh.scale.set(scale, scale, scale);
	}
}
