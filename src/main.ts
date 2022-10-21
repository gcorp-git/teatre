import { API, IAPI } from './client/core/api'
import { Root } from './client/core/root'

declare global {
  interface Window {
    getAPIOnce: () => IAPI
  }
}

const root = new Root({
  selector: '#app',
  api: new API(window.getAPIOnce()),
})

root.start()
