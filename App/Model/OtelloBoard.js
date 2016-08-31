import {reaction, observable, observe, computed, autorun} from 'mobx';
import autobind from 'autobind-decorator'

import Cell from './Cell.js'

@autobind
class OtelloBoard {
  @observable cells = [];
  id = Math.random()

  constructor() {
    for (i = 0; i< 9*9; i++) {
      this.cells.push(new Cell())
    }
  }
}

export default OtelloBoard;
