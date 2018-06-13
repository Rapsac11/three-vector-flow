import * as THREE from 'three';
import OBJLoader from 'three-obj-loader';
OBJLoader(THREE);

export const SAMPLE_ACTION = 'SAMPLE_ACTION'
export const SAMPLE_THUNKED_ACTION = 'SAMPLE_THUNKED_ACTION'


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
              console.log(node.material);
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

export const sampleAction = item => ({
  type: sampleAction,
  payload: item
})

export const sampleThunkedAction = (item) => dispatch => {
    dispatch({
      type: sampleThunkedAction,
      payload: item
    })
}
