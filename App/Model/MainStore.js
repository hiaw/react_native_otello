import Cell from './Cell.js'
import Counter from './Counter.js'
import CounterArray from './CounterArray.js'

let store = {
  cell: new Cell(),
  counter: new Counter(),
  counterArray: new CounterArray()
}
store.counterArray.addCounter()

export default store
