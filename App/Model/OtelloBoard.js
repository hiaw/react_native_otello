import {reaction, computed, action, observable, untracked, autorun} from 'mobx';
import autobind from 'autobind-decorator'

import Cell, {CELL_STATUS} from './Cell.js'

const SIZE = 8

@autobind
class OtelloBoard {
  @observable cells = [];
  id = Math.random()

  constructor() {
    for (i = 0; i< SIZE*SIZE; i++) {
      this.cells.push(new Cell())
    }
    this.initialValues()
  }

  @action updateBoard(i) {
    this.cells[i].bump()
    let status = this.cells[i].status
    /* this.checkHorizontal(i, status)*/
    /* this.checkVertical(i, status)*/
    /* this.checkDiagonalTopLeft(i, status)*/
    this.checkDiagonalTopRight(i, status)
  }

  initialValues() {
    let middle = SIZE / 2 - 1;
    this.cells[ SIZE * middle + middle].status = CELL_STATUS.BLACK
    this.cells[ SIZE * middle + middle + 1].status = CELL_STATUS.WHITE
    this.cells[ SIZE * (middle + 1)+ middle].status = CELL_STATUS.WHITE
    this.cells[ SIZE * (middle + 1)+ middle + 1].status = CELL_STATUS.BLACK
  }

  checkVertical(i, status) {
    let col = i % SIZE
    for (i = 0; i < SIZE; i++){
      this.cells[ i * SIZE + col].status = status
    }
  }

  checkHorizontal(i, status) {
    let row = parseInt(i/SIZE)
    for (i = 0; i < SIZE; i++){
      this.cells[ row * SIZE + i].status = status
    }
  }

  checkDiagonal(i, status) {
    this.checkDiagonalTopLeft(i)
    this.checkDiagonal_right(i)
  }

  checkDiagonalTopLeft(i, status) {
    let row = parseInt(i/SIZE)
    let col = i % SIZE
    let pos
    for (i = 0; i < SIZE; i++){
      if ( row-i >= 0 && col-i >= 0) {
        pos = (row-i) * SIZE + (col-i)
        if (pos > 0 && pos < SIZE*SIZE) {
          this.cells[pos].status = status
        }
      }
    }
  }

  checkDiagonalTopRight(i, status) {
    let row = parseInt(i/SIZE)
    let col = i % SIZE
    let pos
    for (i = 0; i < SIZE; i++){
      if ( row-i >= 0 && col+i < SIZE) {
        pos = (row-i) * SIZE + col+i
        if (pos > 0 && pos < SIZE*SIZE) {
          this.cells[pos].status = status
        }
      }
    }
  }

  diagonalForLoop(i) {

  }
}

module.exports = {OtelloBoard, SIZE};
