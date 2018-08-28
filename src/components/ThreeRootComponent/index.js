import React, { Component } from 'react'
import * as THREE from 'three';
import { connect } from 'react-redux'
import store from '../../index.js'
import { setTimer } from '../../actions.js'
import ComposeThreeElements from '../ComposeThreeElements';

export default (container, objModel, vectorData, pressureData, layers, getNum) => {

  const clock = new THREE.Clock();
  let timeAtClockStart = clock.getElapsedTime();
  const canvas = createCanvas(document, container);
  const composeThreeElements = new ComposeThreeElements(canvas, objModel, vectorData, pressureData);
  let paused = true
  let step = 0

  let canvasHalfWidth;
  let canvasHalfHeight;

  bindEventListeners();
  render();

  function createCanvas(document, container) {
      const canvas = document.createElement('canvas');
      container.appendChild(canvas);
      return canvas;
  }


  function bindEventListeners() {

      function getEventTarget(e) {
        e = e || window.event;
        return e.target || e.srcElement;
      }
      document.getElementById('buttonBar').onclick = function(event) {
          var target = getEventTarget(event);
          onClick(target.id);
      };
      window.onresize = resizeCanvas;
      window.onmousemove = mouseMove;
      resizeCanvas();
  }

  function resizeCanvas() {
      canvas.style.width = '100%';
      canvas.style.height= '100%';

      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      canvasHalfWidth = Math.round(canvas.offsetWidth/2);
      canvasHalfHeight = Math.round(canvas.offsetHeight/2);

      composeThreeElements.onWindowResize()
  }

  function mouseMove({screenX, screenY}) {
      composeThreeElements.onMouseMove(screenX-canvasHalfWidth, screenY-canvasHalfHeight);
  }

  function onClick(id){
      dispatchEvent(id, 'BuildingModel')
  }

  function dispatchEvent(content, threeElement) {
    composeThreeElements.passEventToThreeElement(content, threeElement)
  }

  function render(time) {
      const testPauseClock = clock.getElapsedTime();
      let rate = 50
      let increment = Math.abs(testPauseClock*rate % (300))
      paused ? null: step = increment.toFixed(0)
      //console.log(step)

      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(render);
      composeThreeElements.update(elapsedTime);
  }

  console.log(store.dispatch(setTimer(3)))

  return {
    dispatchEvent
  }
}
