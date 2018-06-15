import React, { Component } from 'react'
import ComposeThreeElements from '../ComposeThreeElements';

export default (container, objModel, vectorData, pressureData) => {
  const canvas = createCanvas(document, container);
  const composeThreeElements = new ComposeThreeElements(canvas, objModel, vectorData, pressureData);

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
      requestAnimationFrame(render);
      composeThreeElements.update();
  }

  return {
    dispatchEvent
  }
}
