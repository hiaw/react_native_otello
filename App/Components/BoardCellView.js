import React from 'react'
import {
  View,
  Dimensions,
  Text
} from 'react-native'
import {observer} from 'mobx-react/native'

import styles from './Styles/BoardCellView.Style.js'

export const Size = Dimensions.get('window');

@observer
class BoardCellView extends React.Component {
  render () {
    return (
      <View style={styles.grid}>
      </View>
    )
  }
}

export default BoardCellView
