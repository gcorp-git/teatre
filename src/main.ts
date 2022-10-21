import { API, IAPI } from './client/core/api'
import { Root } from './client/core/root'

declare global {
  interface Window {
    api: IAPI
  }
}

const root = new Root({
  selector: '#app',
  api: new API(window.api),
})

root.start()
