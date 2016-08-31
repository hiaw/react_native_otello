import Counter from './Counter.js'
import CounterArray from './CounterArray.js'
import OtelloBoard from './OtelloBoard.js'

let store = {
  board: new OtelloBoard(),
  counter: new Counter(),
  counterArray: new CounterArray()
}
store.counterArray.addCounter()

export default store
