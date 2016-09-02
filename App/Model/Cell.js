import {reaction, observable, observe, computed, autorun} from 'mobx';
import autobind from 'autobind-decorator'

export const CELL_STATUS = {
  EMPTY : 0,
  BLACK : 1,
  WHITE : 2
}

@autobind
export default class Cell {
  @observable status = 0
  @observable turn = CELL_STATUS.BLACK
  id = Math.random()

  bump(){
    this.status = (this.status+1) % 3;
  }

  @action changeTurn() {
    this.turn = this.turn === CELL_STATUS.BLACK?
                CELL_STATUS.BLACK :
                CELL_STATUS.WHITE
  }
}
