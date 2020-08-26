import React, { Component } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { createState } from '../state'

class BaseLayout extends Component {
  state = createState(this)

  render () {
    return (
      <div className='appContainer'>
        {
          <Dialog
            open={this.state.pleaseWaitVisible}
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
            transitionDuration={0}
          >
            <DialogTitle style={{ textAlign: 'center' }}>
              Bitte warte einen Moment
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                ...Server wird kontaktiert...
              </DialogContentText>
            </DialogContent>
          </Dialog>

          /* TODO */
        }
      </div>
    )
  }
}

export default BaseLayout
