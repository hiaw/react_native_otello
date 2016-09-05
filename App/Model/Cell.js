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
  id = Math.random()
}
