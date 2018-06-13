import React, { Component } from 'react'

class LayerButton extends Component {
  constructor() {
    super()
    this.state = {
      something: 'someState'
    }
  }

  render() {

    const divStyle = {
      width: '50px',
      height: '20px',
      display: 'inline-block',
      border: '1px solid #CCC'
    }
    return(
      <div style={divStyle}
      id={this.props.id}>
      </div>
    )

  }
}

export default LayerButton
