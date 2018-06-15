import * as THREE from 'three'

export default (scene, vectorData) => {

    var line;

    let vectorProbeGroup = new THREE.Group();

     vectorData ? vectorData.map(
      item => {
        const vectorProbeMaterial = new THREE.LineBasicMaterial({	color: 0x0000ff});
        let lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(
          new THREE.Vector3( item.location.x, item.location.y, item.location.z ),
          new THREE.Vector3( item.location.x, item.location.y +1, item.location.z )
        );
        line = new THREE.Line( lineGeometry, vectorProbeMaterial );
        line.userData = item.timesteps
        vectorProbeGroup.add( line );
      }
    ) : null
    vectorProbeGroup.rotation.x = Math.PI * 1.5;
    vectorProbeGroup.position.z += 25
    scene.add( vectorProbeGroup );

    function update(time) {
      if(vectorData) {
        let time2 = performance.now() / (10);
        let increment = Math.abs(time2 % (vectorData[0].timesteps.length-1))
        let step = increment.toFixed(0)
        vectorProbeGroup.traverse( function ( child ) {
          if ( child.type == "Line" ) {
            child.geometry.verticesNeedUpdate = true;
            child.geometry.vertices[1] = new THREE.Vector3( child.geometry.vertices[0].x+child.userData[step].x,child.geometry.vertices[0].y+child.userData[step].y,child.geometry.vertices[0].z+child.userData[step].z)
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
