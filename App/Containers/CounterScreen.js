import React from 'react'
import {
  View,
  Text
} from 'react-native'
import Button from 'react-native-button'
import {observer} from 'mobx-react/native'
import _ from 'lodash'

import CounterRow from '../Components/CounterRow.js'
import styles from './Styles/CounterScreen.Style.js'

@observer
class Counter extends React.Component {
  render () {
    let counterArray = this.props.store.counterArray
    let counterO = this.props.store.counter
    let board = this.props.store.board
    let rowView = board.cells.map((cell) => {
      return <Button key={cell.id} onPress={cell.bump}>{cell.status}</Button>
    })
    let boardView = _.chunk(rowView, 9).map((row, i) => {
        return <View key={i} style={styles.row}>{row}</View>
    })

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Otello
        </Text>
        {boardView}
      </View>
    )
  }
}

export default Counter
