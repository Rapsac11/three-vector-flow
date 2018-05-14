import React, {Component} from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import { connect } from 'react-redux'
import { OrbitControls, ThreeDModel, loadModelLocally, loadModel } from 'react-three-model-loader'
import BoxProbe from '../BoxProbe'




class ReactThreeRenderer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loadedModel: null,
      flow: null,
      box: 1,
      positionUpdate : 0,
      timestep: 0
    };
    this.cameraPosition = new THREE.Vector3(0, 400, 100);
    this.cameraQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0.9, 0, 0), -Math.PI / 2);

    this._onAnimate = () => {
        // we will get this callback every frame
        //console.log(this.state.timestep)
        // pretend cubeRotation is immutable.
        // this helps with updates and pure rendering.
        // React will be sure that the rotation has now updated.
        this.setState({
            positionUpdate: this.state.positionUpdate + 0.1,
            timestep: this.state.timestep == 299 ? 0 : this.state.timestep + 1,
        });
      };




  }


  componentWillMount(){
    fetch('https://s3-ap-southeast-2.amazonaws.com/three.json.zonemodel/VectorFlow.json')
    .then(data => data.json())
    .then(data => {console.log(data); this.setState({flow: data})})
  }

  componentDidMount() {
    let controls = new OrbitControls(this.refs.camera);
    //this.controls = controls;
    controls.autoRotate = true;
  }

  componentWillUnmount() {

  }

  render() {
    const {model} = this.props
    const { loadedModel, flow, positionUpdate, timestep } = this.state
    const width = window.innerWidth;
    const height = 400;
    const aspectratio = width / height;

    var cameraprops = {
      fov : 75,
      aspect : aspectratio,
      near : 0.1,
      far : 1000,
      position : new THREE.Vector3(0,10,50),
      lookAt : new THREE.Vector3(0,0,0)
    };

    return (
      <div>
        <React3 mainCamera="maincamera" width={width} height={height} clearColor={0xbcbcbc}
        //onAnimate={this._onAnimate}
        >
          <scene>
            <perspectiveCamera ref="camera" name="maincamera" {...cameraprops} />
            <ambientLight
              color={new THREE.Color(0x333333)}
            />
            <directionalLight
              color={new THREE.Color(0xFFFFFF)}
              intensity={1.5}
              position={new THREE.Vector3(0, 0, 60)}
            />
            <mesh
          rotation={this.state.cubeRotation}
          position={new THREE.Vector3(this.state.box,this.state.box,this.state.box)}
        >
          <boxGeometry
            width={this.state.box}
            height={this.state.box}
            depth={this.state.box}
          />
          <meshBasicMaterial
            color={0x00ff00}
          />
        </mesh>

            <BoxProbe
              data = {flow}
              timestep = {timestep}
            />

            <mesh
              key={THREE.Math.generateUUID()}
              rotation={new THREE.Euler(-Math.PI / 2,0,0)}
            >
            <planeBufferGeometry
              width={300}
              height={300}
              widthSegments={30}
              heightSegments={30}
            />
            <meshBasicMaterial
              opacity={0.5}
              color={0x333000}
              side={THREE.DoubleSide}
              wireframe
            />
          </mesh>
        </scene>
      </React3>
    </div>);
  }
}

export default connect(
  state => ({
    model: state.modelLoaderReducer.loadedObject
  }),
  {
   loadModel
  }
)(ReactThreeRenderer)
