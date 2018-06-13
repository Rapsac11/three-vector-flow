import * as THREE from 'three';
import VectorFlow from '../VectorFlow';
import BuildingModel from '../BuildingModel'

import { OrbitControls, loadModelLocally } from 'react-three-model-loader'

export default (canvas, objModel, vectorData) => {

    const clock = new THREE.Clock();
    const origin = new THREE.Vector3(0,0,0);

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    const mousePosition = {
        x: 0,
        y: 0
    }

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const sceneSubjects = createSceneSubjects(scene, objModel, vectorData);

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#FFF");

        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    function buildCamera({ width, height }) {
      const camera = new THREE.PerspectiveCamera( 50, (900 || window.innerWidth) / (900 || window.innerHeight), 0.1, 1000 );
			camera.position.y = 5;
			camera.position.z = 15;
      camera.rotation.y = 100;

        return camera;
    }

    function createSceneSubjects(scene, objModel, vectorData) {
        const sceneSubjects = [
          {
            'VectorFlow': new VectorFlow(scene, vectorData),
            'BuildingModel': new BuildingModel(scene, objModel),
          },
        ];

        return sceneSubjects;
    }

    function update() {
        const elapsedTime = clock.getElapsedTime();

        for(let i=0; i<sceneSubjects.length; i++)
            Object.values(sceneSubjects[0])[i].update(elapsedTime);

        renderer.render(scene, camera);
    }

    let controls = new OrbitControls( camera, renderer.domElement );
    controls.object.position.set(3,20,13);
    controls.target = new THREE.Vector3( 3,1,13);
    controls.update();

    function updateCameraPositionRelativeToMouse() {
        camera.position.x += (  (mousePosition.x * 0.01) - camera.position.x ) * 0.01;
        camera.position.y += ( -(mousePosition.y * 0.01) - camera.position.y ) * 0.01;
        camera.lookAt(origin);
    }

    function onWindowResize() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    function onMouseMove(x, y) {
        mousePosition.x = x;
        mousePosition.y = y;
    }

    function passEventToThreeElement(content, threeElement){
      sceneSubjects[0][threeElement].inSceneEvent(content)
    }


    return {
        update,
        onWindowResize,
        onMouseMove,
        passEventToThreeElement
    }
}
