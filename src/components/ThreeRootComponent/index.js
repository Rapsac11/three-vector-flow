import React, { Component } from 'react'
import SceneManager from '../SceneManager';

export default (container, objModel, vectorData) => {
  const canvas = createCanvas(document, container);
  const sceneManager = new SceneManager(canvas, objModel, vectorData);

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

      sceneManager.onWindowResize()
  }

  function mouseMove({screenX, screenY}) {
      sceneManager.onMouseMove(screenX-canvasHalfWidth, screenY-canvasHalfHeight);
  }

  function onClick(id){
      dispatchEvent(id, 'BuildingModel')
  }

  function render(time) {
      requestAnimationFrame(render);
      sceneManager.update();
  }

  function dispatchEvent(content, threeElement) {
    sceneManager.passEventToThreeElement(content, threeElement)
  }

  return {
    dispatchEvent
  }
}
