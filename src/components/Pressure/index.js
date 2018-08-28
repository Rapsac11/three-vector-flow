import * as THREE from 'three'
import 'three-lut'

export default (scene, pressureData) => {

      let pressureCenters = []
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

      let latticeGeometry = new THREE.PlaneGeometry( 20, 20, 20, 20 )
      let bufferGeometry = new THREE.BufferGeometry().fromGeometry( latticeGeometry )
      let calculatedCentroidPressures = []
      let calculatedCentroidPressuresPerTimestep = []
      let rawGeom = bufferGeometry.getAttribute('position').array

      let line

      let tempProbeGroup = new THREE.Group()
      let tempProbeTilesGroup = new THREE.Group()

      let colorMap = 'rainbow'
			let	numberOfColors = 512

      let lutColors = []

      let lut = new THREE.Lut( colorMap, numberOfColors )
      lut.setMax( 200 )
      lut.setMin( 0 )

      for ( let i = 0; i < rawGeom.length; i += 3) {

        let tempProbeMaterial = new THREE.LineBasicMaterial({	color: 0xff0000})
        let lineGeometry = new THREE.Geometry()

        let position = new THREE.Vector3()
        position.x = (rawGeom[i])
        position.y = (rawGeom[i+1])+12
        position.z = (rawGeom[i+2])

        let nearest = {distance: 100000, pressure: 10, node: "empty", timesteps: "empty", ratio: "empty"}
        let secondNearest = {distance: 100000, pressure: 10, node: "empty", timesteps: "empty", ratio: "empty"}
        let thirdNearest = {distance: 100000, pressure: 10, node: "empty", timesteps: "empty", ratio: "empty"}
        let fourthNearest = {distance: 100000, pressure: 10, node: "empty", timesteps: "empty", ratio: "empty"}

        for ( let x = 0; x < pressureCenters.length; x++) {
          let distance = position.distanceTo( pressureCenters[x].location )
          let pressure = pressureCenters[x].pressureAtTimesteps[0]
          let pressureAtTimesteps = []
          for ( let p = 0; p < pressureCenters[x].pressureAtTimesteps.length; p++) {
            pressureAtTimesteps.push(pressureCenters[x].pressureAtTimesteps[p])
          }
          let node = pressureCenters[x].location
          let timesteps = pressureCenters[x].pressureAtTimesteps

          if(distance < nearest.distance) {
            nearest.distance = distance
            nearest.pressure = pressure
            nearest.pressureAtTimesteps = pressureAtTimesteps
            nearest.node = node
            nearest.timesteps = timesteps
          } else if (distance < secondNearest.distance) {
            secondNearest.distance = distance
            secondNearest.pressure = pressure
            secondNearest.pressureAtTimesteps = pressureAtTimesteps
            secondNearest.node = node
            secondNearest.timesteps = timesteps
          } else if (distance < thirdNearest.distance) {
            thirdNearest.distance = distance
            thirdNearest.pressure = pressure
            thirdNearest.pressureAtTimesteps = pressureAtTimesteps
            thirdNearest.node = node;
            thirdNearest.timesteps = timesteps
          } else if (distance < fourthNearest.distance) {
            fourthNearest.distance = distance
            fourthNearest.pressure = pressure
            thirdNearest.pressureAtTimesteps = pressureAtTimesteps
            fourthNearest.node = node;
            fourthNearest.timesteps = timesteps
          }
        }

        let interpolatedPressures = []
        let scalarBase = fourthNearest.distance
        let nearestWeighting = scalarBase - nearest.distance
        let secondNearestWeighting = scalarBase - secondNearest.distance
        let thirdNearestWeighting = scalarBase - thirdNearest.distance
        let sumOfWeightings = nearestWeighting + secondNearestWeighting + thirdNearestWeighting

        nearest.ratio = nearestWeighting / sumOfWeightings
        secondNearest.ratio = secondNearestWeighting / sumOfWeightings
        thirdNearest.ratio = thirdNearestWeighting / sumOfWeightings

        for ( let y = 0; y < nearest.timesteps.length; y++) {
          let interpolatedPressure = nearest.ratio*nearest.timesteps[y] +
                                     secondNearest.ratio*secondNearest.timesteps[y] +
                                     thirdNearest.ratio*thirdNearest.timesteps[y]
          interpolatedPressures.push(interpolatedPressure)
        }

        calculatedCentroidPressures.push(nearest.pressure)
        calculatedCentroidPressuresPerTimestep.push(nearest.pressureAtTimesteps)

        let positionEnd = new THREE.Vector3()
        positionEnd.x = (rawGeom[i])
        positionEnd.y = (rawGeom[i+1])+12
        positionEnd.z = (rawGeom[i+2])+(((nearest.pressure/100)-1.5)*3)

        lineGeometry.vertices.push(
          position,
          positionEnd
        )

        line = new THREE.Line( lineGeometry, tempProbeMaterial )
        line.userData = interpolatedPressures
        tempProbeGroup.add( line )
      }

      bufferGeometry.addAttribute('pressure', Float32Array.from(calculatedCentroidPressures))

      tempProbeGroup.rotation.x = Math.PI * 1.5
      tempProbeGroup.position.z += 25
      scene.add( tempProbeGroup );

      const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 )
				directionalLight.position.x = 17
				directionalLight.position.y = 9
				directionalLight.position.z = 30
				directionalLight.name = 'directionalLight'
				scene.add( directionalLight )

      let lutColorsAtAllTimesteps = []
      for ( let j = 0; j < calculatedCentroidPressuresPerTimestep[0].length; j++ ) {
        let lutColorsAtTimestep = []
        for ( let i = 0; i < calculatedCentroidPressuresPerTimestep.length; i++ ) {
  						let colorValue = calculatedCentroidPressuresPerTimestep[ i ][j]
  						let color = lut.getColor( colorValue )
  						if ( color == undefined ) {
  							console.log( "ERROR: " + colorValue )
  						} else {
  							lutColorsAtTimestep[ 3 * i     ] = color.r
  							lutColorsAtTimestep[ 3 * i + 1 ] = color.g
  							lutColorsAtTimestep[ 3 * i + 2 ] = color.b
  						}
  					}
        lutColorsAtAllTimesteps.push(lutColorsAtTimestep)
      }

			bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( lutColors[0] ), 3 ) )

      const latticeMaterial = new THREE.MeshLambertMaterial( { color: 0xF5F5F5, vertexColors: THREE.VertexColors} )
      const lattice = new THREE.Mesh( bufferGeometry, latticeMaterial )

      lattice.rotation.x = Math.PI * 1.5;
      lattice.position.z += 13
      scene.add( lattice )

    function update(time) {
      if(pressureData) {
        let rate = 50
        let increment = Math.abs(time*rate % (pressureData[0].timesteps.length-1))
        let step = increment.toFixed(0)
        bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( lutColorsAtAllTimesteps[step] ), 3 ) )
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
