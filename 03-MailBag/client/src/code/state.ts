export function createState (inParentComponent: any) {
  return {
    pleaseWaitVisible: false,

    // TODO: other properties

    showHidePleaseWait: function (inVisible: boolean): void {
      this.setState({ pleaseWaitVisible: inVisible })
    }.bind(inParentComponent)

    // TODO: other functions
  }
}
