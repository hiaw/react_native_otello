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

@observer
class Counter extends React.Component {
  render () {
    let board = this.props.store.board
    let size = this.props.store.size
    let rowView = board.cells.map((cell, i) => {
      return (
        <BoardCellView key={cell.id}>
          <Button key={cell.id} onPress={() => board.updateBoard(i)}>{cell.status}</Button>
        </BoardCellView>
      )
    })
    let boardView = _.chunk(rowView, size).map((row, i) => {
        return <View key={i} style={styles.row}>{row}</View>
    })

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
        <Text>Turn { board.turnColor}</Text>
      </View>
    )
  }
}

export default Counter
