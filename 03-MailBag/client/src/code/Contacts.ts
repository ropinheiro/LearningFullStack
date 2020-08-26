import axios, { AxiosResponse } from 'axios'

import { config } from './config'

export interface IContact {
  _id?: number
  name: string
  email: string
}

export class Worker {
  public async listContacts (): Promise<IContact[]> {
    console.log('Contacts.Worker.listContacts()')

    const response: AxiosResponse = await axios.get(
      `${config.serverAddress}/contacts`
    )
    return response.data
  }

  public async addContact (inContact: IContact): Promise<IContact> {
    console.log('Contacts.Worker.addContact()', inContact)

    const response: AxiosResponse = await axios.post(
      `${config.serverAddress}/contacts`,
      inContact
    )
    return response.data
  }

  public async deleteContact (inID): Promise<void> {
    console.log('Contacts.Worker.deleteContact()', inID)

    await axios.delete(`${config.serverAddress}/contacts/${inID}`)
  }
}
