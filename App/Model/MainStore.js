import OtelloBoard from './OtelloBoard.js'
import {SIZE} from './GameLogic.js'

let store = {
  board: new OtelloBoard(),
  size: SIZE
}

export default store
