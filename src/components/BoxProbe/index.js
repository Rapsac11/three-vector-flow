import React, { Component } from 'react';
import { connect } from 'react-redux';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

class BoxProbe extends Component {

    render() {
      const { data, timestep } = this.props

        let loadedMeshes = []

         data ? data.map(
          item => {
            loadedMeshes.push(
              <mesh
                position={new THREE.Vector3(item.location.x*5-12+item.timesteps[timestep].x,item.location.z*5+item.timesteps[timestep].z,item.location.y*5-65+item.timesteps[timestep].y)}
                key={item.name}

              >
                <boxGeometry
                  width={1}
                  height={1}
                  depth={1}
                />
                <meshBasicMaterial
                  color={0xf4417a}
                />
              </mesh>
            )
          }
        ) : null
        return (
          <group>
          {loadedMeshes}
          </group>
        )
      }
    }


  export default (BoxProbe)
