import * as THREE from 'three'
import 'three-lut';

export default (scene, pressureData) => {

      var pressureCenters = []
      pressureData ? pressureData.map(
       item => {
         pressureCenters.push(
           {
             location: new THREE.Vector3( item.location.x, item.location.y, item.location.z ),
             pressureAtTimesteps: item.timesteps
           }
         );
       }
     ) : null

      var latticeGeometry = new THREE.PlaneGeometry( 20, 20, 20, 20 );
      var bufferGeometry = new THREE.BufferGeometry().fromGeometry( latticeGeometry );
      var calculatedCentroidPressures = []
      var calculatedCentroidPressuresPerTimestep = []
      var rawGeom = bufferGeometry.getAttribute('position').array

      var line;

      let tempProbeGroup = new THREE.Group();
      let tempProbeTilesGroup = new THREE.Group();

      var colorMap = 'rainbow';
			var	numberOfColors = 512;

      var lutColors = [];

      var lut = new THREE.Lut( colorMap, numberOfColors );
      lut.setMax( 200 );
      lut.setMin( 0 );

      for ( var i = 0; i < rawGeom.length;) {

        let tempProbeMaterial = new THREE.LineBasicMaterial({	color: 0xff0000});
        let lineGeometry = new THREE.Geometry();

        var position = new THREE.Vector3();
        position.x = (rawGeom[i]);
        position.y = (rawGeom[i+1])+12;
        position.z = (rawGeom[i+2]);

        var nearest = {distance: 100000, pressure: 10, node: "empty", timesteps: "empty", ratio: "empty"}
        var secondNearest = {distance: 100000, pressure: 10, node: "empty", timesteps: "empty", ratio: "empty"}
        var thirdNearest = {distance: 100000, pressure: 10, node: "empty", timesteps: "empty", ratio: "empty"}
        var fourthNearest = {distance: 100000, pressure: 10, node: "empty", timesteps: "empty", ratio: "empty"}

        for ( var x = 0; x < pressureCenters.length; x++) {
          var distance = position.distanceTo( pressureCenters[x].location )
          var pressure = pressureCenters[x].pressureAtTimesteps[0]
          var pressureAtTimesteps = []
          for ( var p = 0; p < pressureCenters[x].pressureAtTimesteps.length; p++) {
            pressureAtTimesteps.push(pressureCenters[x].pressureAtTimesteps[p])
          }
          var node = pressureCenters[x].location
          var timesteps = pressureCenters[x].pressureAtTimesteps

          if(distance < nearest.distance) {
            nearest.distance = distance;
            nearest.pressure = pressure;
            nearest.pressureAtTimesteps = pressureAtTimesteps;
            nearest.node = node;
            nearest.timesteps = timesteps;
          } else if (distance < secondNearest.distance) {
            secondNearest.distance = distance;
            secondNearest.pressure = pressure;
            secondNearest.pressureAtTimesteps = pressureAtTimesteps;
            secondNearest.node = node;
            secondNearest.timesteps = timesteps;
          } else if (distance < thirdNearest.distance) {
            thirdNearest.distance = distance;
            thirdNearest.pressure = pressure;
            thirdNearest.pressureAtTimesteps = pressureAtTimesteps;
            thirdNearest.node = node;
            thirdNearest.timesteps = timesteps;
          } else if (distance < fourthNearest.distance) {
            fourthNearest.distance = distance;
            fourthNearest.pressure = pressure;
            thirdNearest.pressureAtTimesteps = pressureAtTimesteps;
            fourthNearest.node = node;
            fourthNearest.timesteps = timesteps;
          }
        }

        var interpolatedPressures = []
        var scalarBase = fourthNearest.distance;
        var nearestWeighting = scalarBase - nearest.distance;
        var secondNearestWeighting = scalarBase - secondNearest.distance;
        var thirdNearestWeighting = scalarBase - thirdNearest.distance;
        var sumOfWeightings = nearestWeighting + secondNearestWeighting + thirdNearestWeighting

        nearest.ratio = nearestWeighting / sumOfWeightings;
        secondNearest.ratio = secondNearestWeighting / sumOfWeightings;
        thirdNearest.ratio = thirdNearestWeighting / sumOfWeightings;

        for ( var y = 0; y < nearest.timesteps.length; y++) {
          var interpolatedPressure = nearest.ratio*nearest.timesteps[y] +
                                     secondNearest.ratio*secondNearest.timesteps[y] +
                                     thirdNearest.ratio*thirdNearest.timesteps[y]
          interpolatedPressures.push(interpolatedPressure)
        }

        calculatedCentroidPressures.push(nearest.pressure)
        calculatedCentroidPressuresPerTimestep.push(nearest.pressureAtTimesteps)

        var positionEnd = new THREE.Vector3();
        positionEnd.x = (rawGeom[i]);
        positionEnd.y = (rawGeom[i+1])+12;
        positionEnd.z = (rawGeom[i+2])+(((nearest.pressure/100)-1.5)*3);

        lineGeometry.vertices.push(
          position,
          positionEnd
        )

        line = new THREE.Line( lineGeometry, tempProbeMaterial );
        line.userData = interpolatedPressures
        tempProbeGroup.add( line );

        i += 3
      }

      bufferGeometry.addAttribute('pressure', Float32Array.from(calculatedCentroidPressures))

      tempProbeGroup.rotation.x = Math.PI * 1.5;
      tempProbeGroup.position.z += 25
      scene.add( tempProbeGroup );

      var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
				directionalLight.position.x = 17;
				directionalLight.position.y = 9;
				directionalLight.position.z = 30;
				directionalLight.name = 'directionalLight';
				scene.add( directionalLight );

      var lutColorsAtAllTimesteps = []
      for ( var j = 0; j < calculatedCentroidPressuresPerTimestep[0].length; j++ ) {
        var lutColorsAtTimestep = []
        for ( var i = 0; i < calculatedCentroidPressuresPerTimestep.length; i++ ) {
  						var colorValue = calculatedCentroidPressuresPerTimestep[ i ][j];
  						var color = lut.getColor( colorValue );
  						if ( color == undefined ) {
  							console.log( "ERROR: " + colorValue );
  						} else {
  							lutColorsAtTimestep[ 3 * i     ] = color.r;
  							lutColorsAtTimestep[ 3 * i + 1 ] = color.g;
  							lutColorsAtTimestep[ 3 * i + 2 ] = color.b;
  						}
  					}
        lutColorsAtAllTimesteps.push(lutColorsAtTimestep)
      }

			bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( lutColors[0] ), 3 ) );
      var latticeMaterial = new THREE.MeshLambertMaterial( { color: 0xF5F5F5, vertexColors: THREE.VertexColors} );
      var lattice = new THREE.Mesh( bufferGeometry, latticeMaterial );
      lattice.rotation.x = Math.PI * 1.5;
      lattice.position.z += 13
      scene.add( lattice );

    function update(time) {
      if(pressureData) {
        let time2 = performance.now() / (10);
        let increment = Math.abs(time2 % (pressureData[0].timesteps.length-1))
        let step = increment.toFixed(0)
        bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( lutColorsAtAllTimesteps[step] ), 3 ) );
        tempProbeGroup.traverse( function ( child ) {
          if ( child.type == "Line" ) {
            child.geometry.verticesNeedUpdate = true;
            child.geometry.vertices[1] = new THREE.Vector3( child.geometry.vertices[0].x,child.geometry.vertices[0].y,child.geometry.vertices[0].z+(((child.userData[step]/100)-1.5)*3))
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
