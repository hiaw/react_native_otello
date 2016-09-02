import {reaction, computed, action, observable, untracked, autorun} from 'mobx';
import autobind from 'autobind-decorator'

import Cell, {CELL_STATUS} from './Cell.js'

const SIZE = 8

const OP = {
  MINUS: 0,
  PLUS: 1
}

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
    /* this.checkDiagonalTopRight(i, status)*/
    this.checkDiagonalBottomLeft(i, status)
    /* this.checkDiagonalBottomRight(i, status)*/
  }

  initialValues() {
    let middle = SIZE / 2 - 1;
    this.cells[ SIZE * middle + middle].status = CELL_STATUS.BLACK
    this.cells[ SIZE * middle + middle + 1].status = CELL_STATUS.WHITE
    this.cells[ SIZE * (middle + 1)+ middle].status = CELL_STATUS.WHITE
    this.cells[ SIZE * (middle + 1)+ middle + 1].status = CELL_STATUS.BLACK
  }

  checkVertical(i, status) {
    let {row, col} = this.getCellPosition(i)
    for (i = 0; i < SIZE; i++){
      this.cells[ i * SIZE + col].status = status
    }
  }

  checkHorizontal(i, status) {
    let {row, col} = this.getCellPosition(i)
    for (i = 0; i < SIZE; i++){
      this.cells[ row * SIZE + i].status = status
    }
  }

  checkDiagonal(i, status) {
    this.checkDiagonalTopLeft(i)
    this.checkDiagonal_right(i)
  }

  checkDiagonalTopLeft(i, status) {
    this.diagonalForLoop(i, OP.MINUS, OP.MINUS, status)
  }

  checkDiagonalTopRight(i, status) {
    this.diagonalForLoop(i, OP.MINUS, OP.PLUS, status)
  }

  checkDiagonalBottomLeft(i, status) {
    this.diagonalForLoop(i, OP.PLUS, OP.MINUS, status)
  }

  checkDiagonalBottomRight(i, status) {
    this.diagonalForLoop(i, OP.PLUS, OP.PLUS, status)
  }

  getCellPosition(i) {
    let row = parseInt(i/SIZE)
    let col = i % SIZE
    return {row, col}
  }

  diagonalForLoop(i, rowOp, colOp, status) {
    let {row, col} = this.getCellPosition(i)
    let pos, newRow, newCol
    for (i = 0; i < SIZE; i++){
      let newRow = rowOp === OP.PLUS ? row + i: row - i
      let newCol = colOp === OP.PLUS ? col + i: col - i
      if ( newRow >= 0 && newCol < SIZE) {
        pos = newRow * SIZE + newCol
        if (pos > 0 && pos < SIZE*SIZE) {
          this.cells[pos].status = status
        }
      }
    }
  }
}

module.exports = {OtelloBoard, SIZE};
