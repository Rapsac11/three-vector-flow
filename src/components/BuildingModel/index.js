import * as THREE from 'three'

export default (scene, objModel) => {

    let dataSet = objModel
    dataSet.rotation.x = Math.PI * 1.5;
    //dataSet.rotation.y = Math.PI ;
    dataSet.position.z += 25
    //dataSet.position.x += 6
    //dataSet.position.y += 3
    scene.add(dataSet)

    function onToggle(layer) {
      var selectedLayer = layer
      dataSet.traverse( function ( child ) {
        if (child.material && child.name == selectedLayer) {
          child.material.opacity == 0.3 ?
          child.material.opacity = 0 :
          child.material.opacity = 0.3
        }
      })
    }

    function update(time) {

    }

    function inSceneEvent(content){
      onToggle(content)
    }

    return {
        update,
        inSceneEvent
    }
}
