import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setTimer } from '../../actions.js'
import Wrapper from '../Wrapper'

class App extends Component {

  render() {
    this.props.setTimer(4)
    return (
      <div>
        <Wrapper />

        <div>{this.props.setTime}</div>
      </div>
    );
  }
}

export default connect(
  state => ({
    setTime: state.setTime
  }),
  {
    setTimer
  }
)(App);
