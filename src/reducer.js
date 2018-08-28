import * as THREE from 'three'
import {SET_TIME} from './actions.js'

export const LOAD_MODEL = 'LOAD_MODEL'

export const loadModel = (url, name) => dispatch => {
  let loader = new THREE.JSONLoader();
  loader.load(url, function ( geometry ) {
    var loadedObject = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({
        vertexColors : THREE.FaceColors,
    }));
    console.log(loadedObject)
    dispatch({
      type: LOAD_MODEL,
      payload: [loadedObject, name]
    })
  })
}


const initialState = {
  loadedObject: null,
  setTime: 2,
}

export default function (state = initialState, {type, payload}) {
  switch (type) {
    case SET_TIME: {
      return {
        ...state,
        setTimer: payload
      }
    }
    default:
      return state
  }
}
