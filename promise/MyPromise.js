const PENDING = 'pending'; // 等待
const FULFILLED = 'fulfilled'; // 成功
const REJECTED = 'rejected'; // 失败

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  status = PENDING
  value = undefined
  reason = undefined
  successCbList = []
  failCbList = []

  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while(this.successCbList.length) this.successCbList.shift()()
  }
  reject = reason => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while(this.failCbList.length) this.failCbList.shift()()
  }
  then(
    successCb = value => value,
    failCb = reason => { throw reason }
  ) {
    let p2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          let x = successCb(this.value)
          resolvePromise(p2, x, resolve, reject)
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          let x = failCb(this.value)
          resolvePromise(p2, x, resolve, reject)
        }, 0)
      } else {
        this.successCbList.push(() => {
          setTimeout(() => {
            let x = successCb(this.value)
            resolvePromise(p2, x, resolve, reject)
          }, 0)
        })
        this.failCbList.push(() => {
          setTimeout(() => {
            let x = failCb(this.value)
            resolvePromise(p2, x, resolve, reject)
          }, 0)
        })
      }
    })
    return p2
  }

  static all(array) {
    
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise((resolve, reject) => resolve(value))
  }

  catch(failCb) {
    return this.then(undefined, failCb)
  }

  finally(callback) {

  }
}

function resolvePromise(p2, x, resolve, reject) {
  if(p2 === x) {
    return reject(new Error('cycle promise'))
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}

let ppp = new Promise(function (resolve, reject) {
  resolve('success')
})
function p1 () {
  return new Promise(function (resolve, reject) {
    // setTimeout(function () {
      resolve('p1')
    // }, 2000)
  })
}
ppp.then(value => {
  console.log(value)
  return p1()
})
.then(value => console.log(value))