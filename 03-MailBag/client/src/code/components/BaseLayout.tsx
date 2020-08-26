import React, { Component } from 'react'

import { createState } from '../state'

class BaseLayout extends Component {
  state = createState(this)

  render () {
    return <div className='appContainer'>{/* TODO */}</div>
  }
}

export default BaseLayout
