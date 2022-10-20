import { API, IAPI } from './client/core/api'
import { Play } from './client/core/play'

declare global {
  interface Window {
    api: IAPI
  }
}

const play = new Play({
  selector: '#app',
  api: new API(window.api),
})

play.start()
