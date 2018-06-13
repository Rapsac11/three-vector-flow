import * as THREE from 'three'

export default (scene, vectorData) => {

    var line;

    let probeGroup = new THREE.Group();

     vectorData ? vectorData.map(
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
    //scene.add( mesh );

    function update(time) {
      if(vectorData) {
        let time2 = performance.now() / (10);
        let increment = Math.abs(time2 % (vectorData[0].timesteps.length-1))
        let step = increment.toFixed(0)
        probeGroup.traverse( function ( child ) {
          if ( child.type == "Line" ) {
            child.geometry.verticesNeedUpdate = true;
            child.geometry.vertices[1] = new THREE.Vector3( child.geometry.vertices[0].x+child.userData[step].x,child.geometry.vertices[0].y+child.userData[step].z,child.geometry.vertices[0].z+child.userData[step].y)
          }
  			});
        line.geometry.verticesNeedUpdate = true;
      }
    }

    function inSceneEvent(content){

    }

    return {
        update,
        inSceneEvent
    }
}
