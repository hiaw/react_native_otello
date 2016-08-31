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
    let board = this.props.store.board
    let size = this.props.store.size
    let rowView = board.cells.map((cell) => {
      return <Button key={cell.id} onPress={cell.bump}>{cell.status}</Button>
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
      </View>
    )
  }
}

export default Counter
