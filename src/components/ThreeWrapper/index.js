import React, { Component } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'react-three-model-loader'

class ThreeWrapper extends Component {

  dumpThreeLogicInDiv(element, data, viewWidth, viewHeight, stepsPerSecond){
    var container, stats;
		var camera, scene, renderer;
		var group, probeGroup, arrowGroup, line;
		init(element);
		animate();
		function init(element) {
			container = document.createElement( 'div' );
			element.appendChild( container );

			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera( 50, (viewWidth || window.innerWidth) / (viewHeight || window.innerHeight), 0.1, 1000 );
			camera.position.y = 5;
			camera.position.z = 15;
      camera.rotation.y = 100;

			scene.add( camera );

			scene.add( new THREE.AmbientLight( 0x666666 ) );
			let light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
			light.position.set( 2, 8, 4 );
			light.castShadow = true;
			light.shadow.mapSize.width = 1024;
			light.shadow.mapSize.height = 1024;
			light.shadow.camera.far = 20;
			scene.add( light );

      probeGroup = new THREE.Group();

       data ? data.map(
        item => {
          const probeMaterial = new THREE.LineBasicMaterial({	color: 0x0000ff});
          let lineGeometry = new THREE.Geometry();
          lineGeometry.vertices.push(
          	new THREE.Vector3( item.location.x, item.location.z, item.location.y ),
          	new THREE.Vector3( item.location.x, item.location.z +1, item.location.y )
          );
          line = new THREE.Line( lineGeometry, probeMaterial );
          line.userData = item.timesteps
          probeGroup.add( line );
        }
      ) : null
      scene.add( probeGroup );

			let groundMaterial = new THREE.MeshPhongMaterial( { color: 0x404040, specular: 0x111111 } );
			let mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
			mesh.rotation.x = - Math.PI / 2;
			mesh.receiveShadow = true;
			scene.add( mesh );

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( (viewWidth || window.innerWidth) , (viewHeight || window.innerHeight));
			container.appendChild( renderer.domElement );
			renderer.gammaInput = true;
			renderer.gammaOutput = true;
			renderer.shadowMap.enabled = true;

			let controls = new OrbitControls( camera, renderer.domElement );
      controls.object.position.set(3,20,13);
      controls.target = new THREE.Vector3( 3,1,13);
			controls.update();

      //controls.target = new THREE.Vector3(10,10,10);
		}

		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}

		function animate() {
			let time = performance.now() / ((1000/stepsPerSecond) || 100);
      let increment = Math.abs(time % (data[0].timesteps.length-1))
      let step = increment.toFixed(0)
      probeGroup.traverse( function ( child ) {
        if ( child.type == "Line" ) {
          child.geometry.verticesNeedUpdate = true;
          child.geometry.vertices[1] = new THREE.Vector3( child.geometry.vertices[0].x+child.userData[step].x,child.geometry.vertices[0].y+child.userData[step].z,child.geometry.vertices[0].z+child.userData[step].y)
        }
			});
      line.geometry.verticesNeedUpdate = true;
			renderer.render( scene, camera );
			requestAnimationFrame( animate );
		}
  }

  componentDidMount() {
    fetch('https://s3-ap-southeast-2.amazonaws.com/three.json.zonemodel/VectorFlow.json')
    .then(data => data.json())
    .then(data => {console.log(data); this.dumpThreeLogicInDiv(this.refs.threeRoot, data, null, null, 100)})
  }

  render () {
      return (
        <div id="threeRoot" ref = "threeRoot"  />
      );
  }
}

export default ThreeWrapper
