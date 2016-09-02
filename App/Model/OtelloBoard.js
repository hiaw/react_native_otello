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

  // count remaining
  @computed get whiteCount() {
    let count = 0
    this.cells.map(cell => {
      if (cell.status === CELL_STATUS.WHITE) {
        count++
      }
    })
    return count
  }

  @computed get blackCount() {
    let count = 0
    this.cells.map(cell => {
      if (cell.status === CELL_STATUS.BLACK) {
        count++
      }
    })
    return count
  }

  @computed get emptyCount() {
    return SIZE*SIZE - this.whiteCount - this.blackCount
  }

  // Game logic
  @action updateBoard(i) {
    this.cells[i].bump()
    let status = this.cells[i].status
    let {row, col} = this.getCellPosition(i)
    this.checkHorizontal(row, col, status)
    this.checkVertical(row, col, status)
    /* this.checkDiagonalTopLeft(row, col, status)*/
    /* this.checkDiagonalTopRight(row, col, status)*/
    /* this.checkDiagonalBottomLeft(row, col, status)*/
    /* this.checkDiagonalBottomRight(row, col, status)*/
    this.checkDiagonal(row, col, status)
  }

  getCellPosition(i) {
    let row = parseInt(i/SIZE)
    let col = i % SIZE
    return {row, col}
  }

  // Vertical
  checkVertical(row, col, status) {
    this.checkVerticalTop(row, col, status)
    this.checkVerticalBottom(row, col, status)
  }

  checkVerticalTop(row, col, status) {
    let max = -1
    let min = row
    for (i = min + 1; i < SIZE; i++){
      let num = i * SIZE + + col
      if (this.cells[num].status === status) {
        max = i
        break
      }
    }
    this.updateCol(min, max, col, status)
  }

  checkVerticalBottom(row, col, status) {
    let max = row
    let min = -1
    for (i = max - 1; i >= 0; i--){
      let num = i * SIZE + + col
      if (this.cells[num].status === status) {
        min = i
        break
      }
    }
    this.updateCol(min, max, col, status)
  }

  updateCol( min, max, col, status) {
    if (min > -1 && max > -1) {
      for (i = min; i < max; i++){
        this.cells[ i * SIZE + col].status = status
      }
    }
  }

  // Horizontal
  checkHorizontal(row, col, status) {
    this.checkHorizontalRight(row, col, status)
    this.checkHorizontalLeft(row, col, status)
  }

  checkHorizontalRight(row, col, status) {
    let max = -1
    let min = col
    for (i = min + 1; i < SIZE; i++){
      let num = row * SIZE + i
      if (this.cells[num].status === status) {
        max = i
        break
      }
    }
    this.updateRow(min, max, row, status)
  }

  checkHorizontalLeft(row, col, status) {
    let max = col
    let min = -1
    for (i = max - 1; i >= 0; i--){
      let num = row * SIZE + i
      if (this.cells[num].status === status) {
        min = i
        break
      }
    }
    this.updateRow(min, max, row, status)
  }

  updateRow( min, max, row, status) {
    if (min > -1 && max > -1) {
      for (i = min; i < max; i++){
        this.cells[ row * SIZE + i].status = status
      }
    }
  }

  // Diagonal
  checkDiagonal(row, col, status) {
    this.checkDiagonalTopLeft(row, col, status)
    this.checkDiagonalTopRight(row, col, status)
    this.checkDiagonalBottomLeft(row, col, status)
    this.checkDiagonalBottomRight(row, col, status)
  }

  checkDiagonalTopLeft(row, col, status) {
    let count = Math.max(row, col)
    this.diagonalForLoop(row, col, count, OP.MINUS, OP.MINUS, status)
  }

  checkDiagonalTopRight(row, col, status) {
    let count = Math.max(row, SIZE - col)
    this.diagonalForLoop(row, col, count, OP.MINUS, OP.PLUS, status)
  }

  checkDiagonalBottomLeft(row, col, status) {
    let count = Math.max(SIZE - row, col)
    this.diagonalForLoop(row, col, count, OP.PLUS, OP.MINUS, status)
  }

  checkDiagonalBottomRight(row, col, status) {
    let count = SIZE - Math.max(row, col)
    this.diagonalForLoop(row, col, count, OP.PLUS, OP.PLUS, status)
  }

  diagonalForLoop(row, col, count, rowOp, colOp, status) {
    let num = -1
    let pos, newRow, newCol

    for (i = 1; i < count; i++){
      newRow = rowOp === OP.PLUS ? row + i: row - i
      newCol = colOp === OP.PLUS ? col + i: col - i
      if ( newRow >= 0 && newCol < SIZE) {
        pos = newRow * SIZE + newCol
        if (pos >= 0 && pos < SIZE*SIZE) {
          if (this.cells[pos].status === status) {
            num = i
            break
          }
        }
      }
    }

    this.updateDiagonal(num, row, col, rowOp, colOp, status)
  }

  updateDiagonal( num, row, col, rowOp, colOp, status) {
    let pos, newRow, newCol
    if ( num > -1 ) {
      for (i = 0; i < num; i++){
        newRow = rowOp === OP.PLUS ? row + i: row - i
        newCol = colOp === OP.PLUS ? col + i: col - i
        pos = newRow * SIZE + newCol
        this.cells[pos].status = status
      }
    }
  }

}

module.exports = {OtelloBoard, SIZE};
