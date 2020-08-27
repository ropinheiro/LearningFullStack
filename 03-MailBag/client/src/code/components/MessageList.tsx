import React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const MessageList = ({ state }) => (
  <Table stickyHeader padding='none'>
    <TableHead>
      <TableRow>
        <TableCell style={{ width: 120 }}>Datum</TableCell>
        <TableCell style={{ width: 300 }}>Von</TableCell>
        <TableCell>Betreff</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {state.messages.map(
        (message: {
          id: string
          date: string | number | Date
          from: string
          subject: string
        }) => (
          <TableRow key={message.id} onClick={() => state.showMessage(message)}>
            <TableCell>{new Date(message.date).toLocaleDateString()}</TableCell>
            <TableCell>{message.from}</TableCell>
            <TableCell>{message.subject}</TableCell>
          </TableRow>
        )
      )}
    </TableBody>
  </Table>
)

export default MessageList
