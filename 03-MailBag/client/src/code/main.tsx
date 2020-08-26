import 'normalize.css'
import '../css/main.css'

import React from 'react'
import ReactDOM from 'react-dom'

import BaseLayout from './components/BaseLayout'
import * as IMAP from './IMAP'

// Start rendering and show cover while things are being loaded
const baseComponent: any = ReactDOM.render(<BaseLayout />, document.body)
baseComponent.state.showHidePleaseWait(true)

async function getMailboxes () {
  const imapWorker: IMAP.Worker = new IMAP.Worker()
  const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes()
  mailboxes.forEach(inMailbox => {
    baseComponent.state.addMailboxToList(inMailbox)
  })
}

getMailboxes().then(function () {
  async function getContacts () {}
  getContacts().then(() => baseComponent.state.showHidePleaseWait(false))
})
