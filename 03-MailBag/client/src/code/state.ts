import * as Contacts from './Contacts'
import { config } from './config'
import * as IMAP from './IMAP'
import * as SMTP from './SMTP'

export function createState (inParentComponent: any) {
  return {
    pleaseWaitVisible: false,

    contacts: [],
    mailboxes: [],
    messages: [],
    currentView: 'welcome',
    currentMailbox: null,

    messageID: null,
    messageDate: null,
    messageFrom: null,
    messageTo: null,
    messageSubject: null,
    messageBody: null,

    contactID: null,
    contactName: null,
    contactEmail: null,

    showHidePleaseWait: function (inVisible: boolean): void {
      this.setState({ pleaseWaitVisible: inVisible })
    }.bind(inParentComponent),

    showContact: function (
      inID: string,
      inName: string,
      inEmail: string
    ): void {
      console.log('state.showContact()', inID, inName, inEmail)

      this.setState({
        currentView: 'contact',
        contactID: inID,
        contactName: inName,
        contactEmail: inEmail
      })
    }.bind(inParentComponent),

    showAddContact: function (): void {
      console.log('state.showAddContact()')

      this.setState({
        currentView: 'contactAdd',
        contactID: null,
        contactName: '',
        contactEmail: ''
      })
    }.bind(inParentComponent),

    showMessage: async function (inMessage: IMAP.IMessage): Promise<void> {
      console.log('state.showMessage()', inMessage)

      this.state.showHidePleaseWait(true)
      const imapWorker: IMAP.Worker = new IMAP.Worker()
      const mb: String = await imapWorker.getMessageBody(
        inMessage.id,
        this.state.currentMailbox
      )
      this.state.showHidePleaseWait(false)

      this.setState({
        currentView: 'message',
        messageID: inMessage.id,
        messageDate: inMessage.date,
        messageFrom: inMessage.from,
        messageTo: '',
        messageSubject: inMessage.subject,
        messageBody: mb
      })
    }.bind(inParentComponent),

    showComposeMessage: function (inType: string): void {
      console.log('state.showComposeMessage()')

      switch (inType) {
        case 'new':
          this.setState({
            currentView: 'compose',
            messageTo: '',
            messageSubject: '',
            messageBody: '',
            messageFrom: config.userEmail
          })
          break

        case 'reply':
          this.setState({
            currentView: 'compose',
            messageTo: this.state.messageFrom,
            messageSubject: `Re: ${this.state.messageSubject}`,
            messageBody: `\n\n---- Original Message ----\n\n${this.state.messageBody}`,
            messageFrom: config.userEmail
          })
          break

        case 'contact':
          this.setState({
            currentView: 'compose',
            messageTo: this.state.contactEmail,
            messageSubject: '',
            messageBody: '',
            messageFrom: config.userEmail
          })
          break
      }
    }.bind(inParentComponent),

    addMailboxToList: function (inMailbox: IMAP.IMailbox): void {
      console.log('state.addMailboxToList()', inMailbox)

      const cl: IMAP.IMailbox[] = this.state.mailboxes.slice(0)

      cl.push(inMailbox)

      this.setState({ mailboxes: cl })
    }.bind(inParentComponent),

    addContactToList: function (inContact: Contacts.IContact): void {
      console.log('state.addContactToList()', inContact)

      const cl = this.state.contacts.slice(0)

      cl.push({
        _id: inContact._id,
        name: inContact.name,
        email: inContact.email
      })

      this.setState({ contacts: cl })
    }.bind(inParentComponent),

    addMessageToList: function (inMessage: IMAP.IMessage): void {
      console.log('state.addMessageToList()', inMessage)

      const cl = this.state.messages.slice(0)

      cl.push({
        id: inMessage.id,
        date: inMessage.date,
        from: inMessage.from,
        subject: inMessage.subject
      })

      this.setState({ messages: cl })
    }.bind(inParentComponent),

    clearMessages: function (): void {
      console.log('state.clearMessages()')

      this.setState({ messages: [] })
    }.bind(inParentComponent),

    setCurrentMailbox: function (inPath: String): void {
      console.log('state.setCurrentMailbox()', inPath)

      this.setState({ currentView: 'welcome', currentMailbox: inPath })

      this.state.getMessages(inPath)
    }.bind(inParentComponent),

    getMessages: async function (inPath: string): Promise<void> {
      console.log('state.getMessages()')

      this.state.showHidePleaseWait(true)
      const imapWorker: IMAP.Worker = new IMAP.Worker()
      const messages: IMAP.IMessage[] = await imapWorker.listMessages(inPath)
      this.state.showHidePleaseWait(false)

      this.state.clearMessages()
      messages.forEach((inMessage: IMAP.IMessage) => {
        this.state.addMessageToList(inMessage)
      })
    }.bind(inParentComponent),

    fieldChangeHandler: function (inEvent: any): void {
      console.log(
        'state.fieldChangeHandler()',
        inEvent.target.id,
        inEvent.target.value
      )

      if (
        inEvent.target.id === 'contactName' &&
        inEvent.target.value.length > 16
      ) {
        return
      }

      this.setState({ [inEvent.target.id]: inEvent.target.value })
    }.bind(inParentComponent),

    saveContact: async function (): Promise<void> {
      console.log(
        'state.saveContact()',
        this.state.contactID,
        this.state.contactName,
        this.state.contactEmail
      )

      const cl = this.state.contacts.slice(0)

      this.state.showHidePleaseWait(true)
      const contactsWorker: Contacts.Worker = new Contacts.Worker()
      const contact: Contacts.IContact = await contactsWorker.addContact({
        name: this.state.contactName,
        email: this.state.contactEmail
      })
      this.state.showHidePleaseWait(false)

      cl.push(contact)

      this.setState({
        contacts: cl,
        contactID: null,
        contactName: '',
        contactEmail: ''
      })
    }.bind(inParentComponent),

    deleteContact: async function (): Promise<void> {
      console.log('state.deleteContact()', this.state.contactID)

      this.state.showHidePleaseWait(true)
      const contactsWorker: Contacts.Worker = new Contacts.Worker()
      await contactsWorker.deleteContact(this.state.contactID)
      this.state.showHidePleaseWait(false)

      const cl = this.state.contacts.filter(
        inElement => inElement._id != this.state.contactID
      )

      this.setState({
        contacts: cl,
        contactID: null,
        contactName: '',
        contactEmail: ''
      })
    }.bind(inParentComponent),

    deleteMessage: async function (): Promise<void> {
      console.log('state.deleteMessage()', this.state.messageID)

      this.state.showHidePleaseWait(true)
      const imapWorker: IMAP.Worker = new IMAP.Worker()
      await imapWorker.deleteMessage(
        this.state.messageID,
        this.state.currentMailbox
      )
      this.state.showHidePleaseWait(false)

      const cl = this.state.messages.filter(
        inElement => inElement.id != this.state.messageID
      )

      this.setState({ messages: cl, currentView: 'welcome' })
    }.bind(inParentComponent),

    sendMessage: async function (): Promise<void> {
      console.log(
        'state.sendMessage()',
        this.state.messageTo,
        this.state.messageFrom,
        this.state.messageSubject,
        this.state.messageBody
      )

      this.state.showHidePleaseWait(true)
      const smtpWorker: SMTP.Worker = new SMTP.Worker()
      await smtpWorker.sendMessage(
        this.state.messageTo,
        this.state.messageFrom,
        this.state.messageSubject,
        this.state.messageBody
      )
      this.state.showHidePleaseWait(false)

      this.setState({ currentView: 'welcome' })
    }.bind(inParentComponent)
  }
}
