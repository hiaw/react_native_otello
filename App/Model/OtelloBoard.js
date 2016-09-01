import {reaction, computed, action, observable, untracked, autorun} from 'mobx';
import autobind from 'autobind-decorator'

import Cell from './Cell.js'

const SIZE =15

@autobind
class OtelloBoard {
  @observable cells = [];
  id = Math.random()

  constructor() {
    for (i = 0; i< SIZE*SIZE; i++) {
      this.cells.push(new Cell())
    }

    reaction(
      () => this.cells.map( cell => cell.status ),
      status => {
        console.log('Status has changed' + status)
      }
    )
  }
}

module.exports = {OtelloBoard, SIZE};
