import {CELL_STATUS} from './Cell.js'

const SIZE = 8
const SIZE2 = SIZE * SIZE

const OP = {
  MINUS: 0,
  PLUS: 1
}

getAllMoves = (pos, status, cells) => {
  let {row, col} = getCellPosition(pos)
  let moves = []
  if (cells[pos].status === CELL_STATUS.EMPTY) {
    return moves
  }
  moves = moves.concat(checkVerticalTop(row, col, status, cells))
  moves = moves.concat(checkVerticalBottom(row, col, status, cells))
  moves = moves.concat(checkHorizontalRight(row, col, status, cells))
  moves = moves.concat(checkHorizontalLeft(row, col, status, cells))
  moves = moves.concat(checkDiagonalTopLeft(row, col, status, cells))
  moves = moves.concat(checkDiagonalTopRight(row, col, status, cells))
  moves = moves.concat(checkDiagonalBottomLeft(row, col, status, cells))
  moves = moves.concat(checkDiagonalBottomRight(row, col, status, cells))
  /* console.log(JSON.stringify(moves)) */
  return moves
}

// Helpers
getCellPosition = (i) => {
  let row = parseInt(i / SIZE)
  let col = i % SIZE
  return {row, col}
}

opposite = (status) => {
  if (CELL_STATUS.BLACK === status)
    return CELL_STATUS.WHITE
  else
    return CELL_STATUS.BLACK
}

// Vertical
checkVerticalTop = (row, col, status, cells) => {
  let max = -1
  let min = row
  let num = (min + 1) * SIZE + col
  if (num > 0 && num < SIZE2 && cells[num].status === opposite(status)) {
    for (i = min + 2; i < SIZE; i++) {
      num = i * SIZE + +col
      if (cells[num].status === CELL_STATUS.EMPTY) {
        break
      }
      if (cells[num].status === status) {
        max = i
        break
      }
    }
  }
  return calculateColumn(min, max, col, status, cells)
}

checkVerticalBottom = (row, col, status, cells) => {
  let max = row
  let min = -1
  let num = (max - 1) * SIZE + col
  if (num > 0 && num < SIZE2 && cells[num].status === opposite(status)) {
    for (i = max - 2; i >= 0; i--) {
      num = i * SIZE + +col
      if (cells[num].status === CELL_STATUS.EMPTY) {
        break
      }
      if (cells[num].status === status) {
        min = i
        break
      }
    }
  }
  return calculateColumn(min, max, col, status, cells)
}

calculateColumn = (min, max, col, status, cells) => {
  let moves = []
  if (min > -1 && max > -1) {
    for (i = min; i < max; i++) {
      /* console.log("Pushing " +  (i * SIZE + col)) */
      moves.push(i * SIZE + col)
    }
  }
  /* console.log(JSON.stringify(moves)) */
  return moves
}

// Horizontal
checkHorizontalRight = (row, col, status, cells) => {
  let max = -1
  let min = col
  let num = row * SIZE + (min + 1)
  if (num > 0 && num < SIZE2 && cells[num].status === opposite(status)) {
    for (i = min + 2; i < SIZE; i++) {
      num = row * SIZE + i
      if (cells[num].status === CELL_STATUS.EMPTY) {
        break
      }
      if (cells[num].status === status) {
        max = i
        break
      }
    }
  }
  return calculateRow(min, max, row, status, cells)
}

checkHorizontalLeft = (row, col, status, cells) => {
  let max = col
  let min = -1
  let num = row * SIZE + (max - 1)
  if (num > 0 && num < SIZE2 && cells[num].status === opposite(status)) {
    for (i = max - 2; i >= 0; i--) {
      num = row * SIZE + i
      if (cells[num].status === CELL_STATUS.EMPTY) {
        break
      }
      if (cells[num].status === status) {
        min = i
        break
      }
    }
  }
  return calculateRow(min, max, row, status, cells)
}

calculateRow = (min, max, row, status, cells) => {
  let moves = []
  if (min > -1 && max > -1) {
    for (i = min; i < max; i++) {
      moves.push(row * SIZE + i)
    }
  }
  return moves
}

// Diagonal
checkDiagonalTopLeft = (row, col, status, cells) => {
  let count = Math.min(row, col)
  return diagonalForLoop(row, col, count, OP.MINUS, OP.MINUS, status, cells)
}

checkDiagonalTopRight = (row, col, status, cells) => {
  let count = Math.min(row, SIZE - 1 - col)
  return diagonalForLoop(row, col, count, OP.MINUS, OP.PLUS, status, cells)
}

checkDiagonalBottomLeft = (row, col, status, cells) => {
  let count = Math.min(SIZE - 1 - row, col)
  return diagonalForLoop(row, col, count, OP.PLUS, OP.MINUS, status, cells)
}

checkDiagonalBottomRight = (row, col, status, cells) => {
  let count = Math.min(SIZE - 1 - row, SIZE - 1 - col)
  return diagonalForLoop(row, col, count, OP.PLUS, OP.PLUS, status, cells)
}

diagonalForLoop = (row, col, count, rowOp, colOp, status, cells) => {
  let num = -1
  let newRow = rowOp === OP.PLUS ? row + 1 : row - 1
  let newCol = colOp === OP.PLUS ? col + 1 : col - 1
  let pos = newRow * SIZE + newCol

  // First one should be opposite
  if (newRow >= 0 && newCol < SIZE &&
      pos >= 0 && pos < SIZE2 &&
      cells[pos].status === opposite(status)
  ) {
    for (i = 2; i <= count; i++) {
      newRow = rowOp === OP.PLUS ? row + i : row - i
      newCol = colOp === OP.PLUS ? col + i : col - i
      if (newRow >= 0 && newCol < SIZE) {
        pos = newRow * SIZE + newCol
        if (pos >= 0 && pos < SIZE2) {
          if (cells[pos].status === status) {
            num = i
            break
          }
        }
      }
    }
  }

  return calculateDiagonal(num, row, col, rowOp, colOp, status, cells)
}

calculateDiagonal = (num, row, col, rowOp, colOp, status, cells) => {
  let moves = []
  let pos, newRow, newCol
  if (num > -1) {
    for (i = 0; i < num; i++) {
      newRow = rowOp === OP.PLUS ? row + i : row - i
      newCol = colOp === OP.PLUS ? col + i : col - i
      pos = newRow * SIZE + newCol
      moves.push(pos)
    }
  }
  return moves
}

module.exports = {SIZE, getAllMoves}
