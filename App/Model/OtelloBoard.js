import {reaction, computed, action, observable, untracked, autorun} from 'mobx';
import autobind from 'autobind-decorator'

import Cell, {CELL_STATUS} from './Cell.js'

export const SIZE = 8
const SIZE2 = SIZE * SIZE

const OP = {
  MINUS: 0,
  PLUS: 1
}
// Helpers
const getCellPosition = (i) =>{
  let row = parseInt(i/SIZE)
  let col = i % SIZE
  return {row, col}
}

const opposite = (status) => {
  if (CELL_STATUS.BLACK === status)
    return CELL_STATUS.WHITE
  else
    return CELL_STATUS.BLACK
}


@autobind
export default class OtelloBoard {
  @observable cells = [];
  @observable turn = CELL_STATUS.BLACK
  id = Math.random()

  constructor() {
    for (i = 0; i< SIZE2; i++) {
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
    return SIZE2- this.whiteCount - this.blackCount
  }

  // Turns
  @action changeTurn() {
    this.turn = this.turn === CELL_STATUS.BLACK?
                CELL_STATUS.WHITE :
                CELL_STATUS.BLACK
  }

  @computed get turnColor() {
    return this.turn === CELL_STATUS.BLACK?
                'Black' : 'White'
  }
  // Game logic
  @action updateBoard(i) {
    if (this.cells[i].status === CELL_STATUS.EMPTY) {
      let {row, col} = getCellPosition(i)
      let moves = this.checkAll(row, col, this.turn)
      // Do the change
      if (moves.length > 0) {
        /* console.log(JSON.stringify(moves))*/
        this.cells[i].status = this.turn
        this.turnMoveTiles(moves, this.turn)
        this.changeTurn()
      }
    }
  }

 turnMoveTiles(moves, status) {
    for(var i = 0; i < moves.length; i++) {
      this.cells[moves[i]].status = status
    }
  }

  checkAll(row, col, status) {
    let moves = []
    moves = moves.concat(this.checkVerticalTop(row, col, status))
    moves = moves.concat(this.checkVerticalBottom(row, col, status))
    moves = moves.concat(this.checkHorizontalRight(row, col, status))
    moves = moves.concat(this.checkHorizontalLeft(row, col, status))
    moves = moves.concat(this.checkDiagonalTopLeft(row, col, status))
    moves = moves.concat(this.checkDiagonalTopRight(row, col, status))
    moves = moves.concat(this.checkDiagonalBottomLeft(row, col, status))
    moves = moves.concat(this.checkDiagonalBottomRight(row, col, status))
    /* console.log(JSON.stringify(moves))*/
    return moves
  }

  // Vertical
  checkVerticalTop(row, col, status) {
    let max = -1
    let min = row
    let num = (min + 1) * SIZE + col
    if (num > 0 && num < SIZE2 && this.cells[num].status === opposite(status) ) {
      for (i = min + 2; i < SIZE; i++){
        num = i * SIZE + + col
        if (this.cells[num].status === CELL_STATUS.EMPTY) {
          break
        }
        if (this.cells[num].status === status) {
          max = i
          break
        }
      }
    }
    return this.updateCol(min, max, col, status)
  }

  checkVerticalBottom(row, col, status) {
    let max = row
    let min = -1
    let num = (max - 1) * SIZE + col
    if (num > 0 && num < SIZE2 && this.cells[num].status === opposite(status)) {
      for (i = max - 2; i >= 0; i--){
        num = i * SIZE + + col
        if (this.cells[num].status === CELL_STATUS.EMPTY) {
          break
        }
        if (this.cells[num].status === status) {
          min = i
          break
        }
      }
    }
    return this.updateCol(min, max, col, status)
  }

  updateCol( min, max, col, status) {
    let moves = []
    if (min > -1 && max > -1) {
      for (i = min; i < max; i++){
        /* console.log("Pushing " +  (i * SIZE + col))*/
        moves.push( i * SIZE + col)
      }
    }
    /* console.log(JSON.stringify(moves))*/
    return moves
  }

  // Horizontal
  checkHorizontalRight(row, col, status) {
    let max = -1
    let min = col
    let num = row * SIZE + (min + 1)
    if (num > 0 && num < SIZE2 && this.cells[num].status === opposite(status)) {
      for (i = min + 2; i < SIZE; i++){
        num = row * SIZE + i
        if (this.cells[num].status === CELL_STATUS.EMPTY) {
          break
        }
        if (this.cells[num].status === status) {
          max = i
          break
        }
      }
    }
    return this.updateRow(min, max, row, status)
  }

  checkHorizontalLeft(row, col, status) {
    let max = col
    let min = -1
    let num = row * SIZE + (max - 1)
    if (num > 0 && num < SIZE2 && this.cells[num].status === opposite(status)) {
      for (i = max - 2; i >= 0; i--){
        num = row * SIZE + i
        if (this.cells[num].status === CELL_STATUS.EMPTY) {
          break
        }
        if (this.cells[num].status === status) {
          min = i
          break
        }
      }
    }
    return this.updateRow(min, max, row, status)
  }

  updateRow( min, max, row, status) {
    let moves = []
    if (min > -1 && max > -1) {
      for (i = min; i < max; i++){
        moves.push( row * SIZE + i)
      }
    }
    return moves
  }

  // Diagonal
  checkDiagonalTopLeft(row, col, status) {
    let count = Math.min(row, col)
    return this.diagonalForLoop(row, col, count, OP.MINUS, OP.MINUS, status)
  }

  checkDiagonalTopRight(row, col, status) {
    let count = Math.min(row, SIZE - 1 - col)
    return this.diagonalForLoop(row, col, count, OP.MINUS, OP.PLUS, status)
  }

  checkDiagonalBottomLeft(row, col, status) {
    let count = Math.min(SIZE - 1 - row, col)
    return this.diagonalForLoop(row, col, count, OP.PLUS, OP.MINUS, status)
  }

  checkDiagonalBottomRight(row, col, status) {
    let count = Math.min(SIZE - 1 - row, SIZE - 1 - col)
    return this.diagonalForLoop(row, col, count, OP.PLUS, OP.PLUS, status)
  }

  diagonalForLoop(row, col, count, rowOp, colOp, status) {
    let num = -1
    let newRow = rowOp === OP.PLUS ? row + 1: row - 1
    let newCol = colOp === OP.PLUS ? col + 1: col - 1
    let pos = newRow * SIZE + newCol

    // First one should be opposite
    if (newRow >= 0 && newCol < SIZE &&
        pos >= 0 && pos < SIZE2 &&
        this.cells[pos].status === opposite(status)
    ) {
      for (i = 2; i <= count; i++){
        newRow = rowOp === OP.PLUS ? row + i: row - i
        newCol = colOp === OP.PLUS ? col + i: col - i
        if ( newRow >= 0 && newCol < SIZE) {
          pos = newRow * SIZE + newCol
          if (pos >= 0 && pos < SIZE2) {
            if (this.cells[pos].status === status) {
              num = i
              break
            }
          }
        }
      }
    }

    return this.updateDiagonal(num, row, col, rowOp, colOp, status)
  }

  updateDiagonal( num, row, col, rowOp, colOp, status) {
    let moves = []
    let pos, newRow, newCol
    if ( num > -1 ) {
      for (i = 0; i < num; i++){
        newRow = rowOp === OP.PLUS ? row + i: row - i
        newCol = colOp === OP.PLUS ? col + i: col - i
        pos = newRow * SIZE + newCol
        moves.push(pos)
      }
    }
    return moves
  }

}
