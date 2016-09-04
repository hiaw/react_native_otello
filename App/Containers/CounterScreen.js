import React from 'react'
import {
  View,
  Text
} from 'react-native'
import Button from 'react-native-button'
import {observer} from 'mobx-react/native'
import _ from 'lodash'

import BoardCellView from '../Components/BoardCellView.js'
import styles from './Styles/CounterScreen.Style.js'
import cellStyles from '../Components/Styles/BoardCellView.Style.js'
import {CELL_STATUS} from '../Model/Cell.js'

/* <BoardCellView key={cell.id} ></BoardCellView>*/
@observer
class Counter extends React.Component {
  render () {
    let board = this.props.store.board
    let size = this.props.store.size

    let rowView = board.cells.map((cell, i) => {
      let color = cellStyles.transparent
      switch (cell.status) {
        case CELL_STATUS.WHITE:
          color= cellStyles.white
          break
        case CELL_STATUS.BLACK:
          color = cellStyles.black
          break
      }
      return (
        <Button key={cell.id} onPress={() => board.updateBoard(i)}>
          <View style={[color, cellStyles.piece]} >
          </View>
        </Button>
      )
    })

    let boardView = _.chunk(rowView, size).map((row, i) => {
        return <View key={i} style={styles.row}>{row}</View>
    })

    let turnColor = cellStyles.black
    if (board.turn == CELL_STATUS.WHITE) turnColor = cellStyles.white
    let nStyle = {zIndex: 2}

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Otello
        </Text>
        {boardView}

        <Text></Text>
        <Text>White count { board.whiteCount }</Text>
        <Text>Black count { board.blackCount }</Text>
        <Text>Empty { board.emptyCount }</Text>
        <View style={[turnColor, cellStyles.piece, nStyle]} />
        <BoardCellView />
      </View>
    )
  }
}

export default Counter
