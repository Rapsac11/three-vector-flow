import * as THREE from 'three';
import OBJLoader from 'three-obj-loader';
OBJLoader(THREE);

export const SET_TIME = "SET_TIME"

export const loadObj = (url) => {
  let loader = new THREE.OBJLoader();
  var loadedObject = "";
  return new Promise(function(resolve, reject) {
    loader.load(url, function ( loadedObject ) {
      loadedObject.traverse( function( node ) {
          if( node.material ) {
              node.material.side = THREE.DoubleSide;
              node.material.transparent = true;
              node.material.opacity = 0.3
          }
      });
      if (true) {
        resolve(loadedObject)
      } else {
        reject(loadedObject)
      }
    })
  })
}


export const loadJson = (url, name) => {
  let loader = new THREE.JSONLoader();
  var loadedObject = "";
  return new Promise(function(resolve, reject) {
    loader.load(url, function ( geometry ) {
      if (true) {
        loadedObject = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({
            vertexColors : THREE.FaceColors,
        }));
        resolve({[name]: loadedObject})
      } else {
        reject({[name]: loadedObject})
      }
    })
  })
}

export const setTimer = time => ({
      type: 'SET_TIME',
      payload: time
})
