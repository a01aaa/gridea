import GA from 'electron-google-analytics'
import macaddress from 'macaddress'
import * as pkg from '../../package.json'

interface EvOptions {
  evLabel?: any
  evValue?: any
}

const hostname = 'http://client.gridea.dev'

class Analytics {
  private readonly ga: any

  private clientId: any

  constructor() {
    this.ga = new GA('UA-113307620-4', { debug: false })
    
    this.ga.set('version', (pkg as any).version)
  }

  public getClientId(callback: any) {
    if (this.clientId) {
      callback(this.clientId)
    }
    macaddress.one((err: any, mac: string) => {
      this.clientId = mac
      callback(mac)
    })
  }

  public async pageView(url: string, title?: string) {
    this.getClientId(async (clientId: any) => {
      try {
        const res = await this.ga.pageview(hostname, url, title, 1, clientId)
        console.log(res)
      } catch (e) {
        console.error(e)
      }
    })
  }

  public async event(evCategory: string, evAction: string, options: EvOptions) {
    this.getClientId(async (clientId: any) => {
      try {
        const res = await this.ga.event(evCategory, evAction, {
          ...options,
          clientID: clientId,
        })
        console.log(res)
      } catch (e) {
        console.error(e)
      }
    })
  }

  public async exception(exDesc: string, exFatal: any) {
    this.getClientId(async (clientId: any) => {
      try {
        const res = await this.ga.exception(exDesc, exFatal)
        console.log(res)
      } catch (e) {
        console.error(e)
      }
    })
  }
}

export default new Analytics()