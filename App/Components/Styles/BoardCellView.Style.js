import {
  StyleSheet,
  Dimensions
} from 'react-native'

import { SIZE } from '../../Model/OtelloBoard.js'

const WindowSize = Dimensions.get('window')
const BoardWidth = WindowSize.width
const CellSize = Math.floor(BoardWidth / SIZE)

export default {
  grid: {
    backgroundColor: 'green',
    width: CellSize,
    height: CellSize,
    borderWidth: 1
  }
}
