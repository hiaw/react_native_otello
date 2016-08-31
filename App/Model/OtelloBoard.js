import {reaction, observable, observe, computed, autorun} from 'mobx';
import autobind from 'autobind-decorator'

import Cell from './Cell.js'

const SIZE = 9

@autobind
class OtelloBoard {
  @observable cells = [];
  id = Math.random()

  constructor() {
    for (i = 0; i< SIZE*SIZE; i++) {
      this.cells.push(new Cell())
    }
  }
}

module.exports = {OtelloBoard, SIZE};
