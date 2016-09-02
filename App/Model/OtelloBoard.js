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

  initialValues() {
    let middle = SIZE / 2 - 1;
    this.cells[ SIZE * middle + middle].status = CELL_STATUS.BLACK
    this.cells[ SIZE * middle + middle + 1].status = CELL_STATUS.WHITE
    this.cells[ SIZE * (middle + 1)+ middle].status = CELL_STATUS.WHITE
    this.cells[ SIZE * (middle + 1)+ middle + 1].status = CELL_STATUS.BLACK
  }

  @action updateBoard(i) {
    this.cells[i].bump()
    let status = this.cells[i].status
    /* this.checkHorizontal(i, status)*/
    /* this.checkHorizontalRight(i, status)*/
    this.checkHorizontalLeft(i, status)
    /* this.checkVertical(i, status)*/
    /* this.checkDiagonalTopLeft(i, status)*/
    /* this.checkDiagonalTopRight(i, status)*/
    /* this.checkDiagonalBottomLeft(i, status)*/
    /* this.checkDiagonalBottomRight(i, status)*/
    /* this.checkDiagonal(i, status)*/
  }

  getCellPosition(i) {
    let row = parseInt(i/SIZE)
    let col = i % SIZE
    return {row, col}
  }

  // Vertical
  checkVertical(i, status) {
    let {row, col} = this.getCellPosition(i)
    for (i = 0; i < SIZE; i++){
      this.cells[ i * SIZE + col].status = status
    }
  }

  // Horizontal
  checkHorizontal(i, status) {
    this.checkHorizontalRight(i, status)
    this.checkHorizontalLeft(i, status)
  }

  checkHorizontalRight(i, status) {
    this.horizontalForLoop(i, OP.PLUS, status)
  }

  checkHorizontalLeft(i, status) {
    this.horizontalForLoop(i, OP.MINUS, status)
  }

  horizontalForLoop(i, op, status) {
    let {row, col} = this.getCellPosition(i)
    let min = op === OP.PLUS ? col : 0
    let max = op === OP.PLUS ? SIZE : col
    for (i = min; i < max; i++){
      this.cells[ row * SIZE + i].status = status
    }
  }

  // Diagonal
  checkDiagonal(i, status) {
    this.checkDiagonalTopLeft(i, status)
    this.checkDiagonalTopRight(i, status)
    this.checkDiagonalBottomLeft(i, status)
    this.checkDiagonalBottomRight(i, status)
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


  diagonalForLoop(i, rowOp, colOp, status) {
    let {row, col} = this.getCellPosition(i)
    let pos, newRow, newCol
    for (i = 0; i < SIZE; i++){
      let newRow = rowOp === OP.PLUS ? row + i: row - i
      let newCol = colOp === OP.PLUS ? col + i: col - i
      if ( newRow >= 0 && newCol < SIZE) {
        pos = newRow * SIZE + newCol
        if (pos >= 0 && pos < SIZE*SIZE) {
          this.cells[pos].status = status
        }
      }
    }
  }
}

module.exports = {OtelloBoard, SIZE};
