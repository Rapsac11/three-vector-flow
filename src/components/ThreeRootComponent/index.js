import React, { Component } from 'react'
import threeEntryPoint from '../Three/threeEntryPoint';

class ThreeWrapper extends Component {
  componentDidMount() {
    threeEntryPoint(this.threeRootElement);
    let controls = new OrbitControls(camera);
    //this.controls = controls;
  }
  render () {
      return (
        <div ref={element => this.threeRootElement = element} />
      );
  }
}

export default ThreeWrapper
