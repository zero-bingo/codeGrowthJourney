class EventEmitter {
  constructor() {
    this.subs = {}
  }

  $on(eventName, fn) {
    this.subs[eventName] = this.subs[eventName] || []
    this.subs[eventName].push(fn)
  }

  $emit(eventName) {
    this.subs[eventName].forEach(fn => {
      fn()
    })
  }
}

const em = new EventEmitter()
// em.$on()