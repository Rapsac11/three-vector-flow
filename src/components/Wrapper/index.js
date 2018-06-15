import React, { Component } from 'react';
import styled from 'react-emotion';
import threeRootComponent from '../ThreeRootComponent'
import { loadObj } from '../../actions.js'
import LayerButton from '../LayerButton'

class Wrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modelData: {
        obj: 'https://s3-ap-southeast-2.amazonaws.com/three.json.zonemodel/internalheatloads.obj',
        vector: 'https://s3-ap-southeast-2.amazonaws.com/three.json.zonemodel/VectorFlow.json',
        pressure: 'https://s3-ap-southeast-2.amazonaws.com/three.json.zonemodel/pressures.json',
      },
      layers: null
    }
  }

  componentDidMount() {
      Promise.all(
          [
            fetch(this.state.modelData.vector).then(r => r.json()),
            loadObj(this.state.modelData.obj),
            fetch(this.state.modelData.pressure).then(r => r.json())
          ]
        )
        .then(
          //for some reason calling this.setState after threeRootComponent() will prevent canvas from rendering hence the chained promise
          ([vectorData, objModel, pressureData]) => {
            this.setState({
              layers: [...objModel.children]
            })
            return [vectorData, objModel, pressureData]
          }
        )
        .then(
          ([vectorData, objModel, pressureData]) => {
            threeRootComponent(this.threeRootElement, objModel, vectorData, pressureData, this.state.layers)
          }
        )
      .catch(e => console.error(e));
  }

  render() {

    const Container = styled('div')`
        text-align: center;
        font-size: 42px;
        color: #495057;
        -webkit-animation: fadein 2s; /* Safari, Chrome and Opera > 12.1 */
        -moz-animation: fadein 2s; /* Firefox < 16 */
        -ms-animation: fadein 2s; /* Internet Explorer */
        -o-animation: fadein 2s; /* Opera < 12.1 */
        animation: fadein 3s linear forwards;
        @keyframes fadeinout {
          0%,100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes fadein {
          0% { opacity: 0; }
          50% { opacity: 1; }
        }
    `

    const rootStyle = {
      height: "400px"
    }

    return (
      <div style={rootStyle}>
      <Container style={rootStyle}>
      <div style={rootStyle} ref={element => this.threeRootElement = element} />
      <div id="buttonBar">
      {
        this.state.layers ? this.state.layers.map(entry => {
          return <LayerButton id={entry.name} key={entry.name} data={entry} />
        }) : null
      }
      </div>
      </Container>
      </div>
    );
  }
}

export default Wrapper;
