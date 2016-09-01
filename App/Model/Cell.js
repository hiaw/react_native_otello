import {reaction, observable, observe, computed, autorun} from 'mobx';
import autobind from 'autobind-decorator'

const CELL_STATUS = {
  EMPTY : 0,
  BLACK : 1,
  WHITE : 2
}

@autobind
class Cell {
  @observable status = 0;
  id = Math.random()

  bump(){
    this.status = (this.status+1) % 3;
  }
}

export default Cell;
