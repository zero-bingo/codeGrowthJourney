class Dep {
  constructor() {
    this.subs = []
  }

  addSub(watcher) {
    if(watcher && watcher.update) {
      this.subs.push(watcher)
    }
  }

  notify() {
    this.subs.forEach(sub => sub.update())
  }
}

class Watcher {
  update() {
    console.log('update')
  }
}

const dep = new Dep()
const watcher = new Watcher()

dep.addSub(watcher)

dep.notify()