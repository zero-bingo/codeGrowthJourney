const PENDING = 'pending';
const REJECTED = 'rejected';
const FULFILLED = 'fulfilled';

class MyPromise {
  status = PENDING;
  reason = undefined;
  value = undefined;
  successCbList = [];
  failCbList = [];


  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  resolve = value => {
    if (this.status !== PENDING) return;
    this.status = FULFILLED;
    this.value = value;
    if (this.successCbList.length) {
      this.successCbList.shift()();
    }
  }

  reject = reason => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
    if (this.failCbList.length) {
      this.failCbList.shift()();
    }
  }

  then = (
    successCb = value => value,
    failCb = reason => {throw new Error(reason)}
  ) => {
    let p2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          let x = successCb(this.value)
          resolveResult(p2, x, resolve, reject)
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          let x = failCb(this.reason)
          resolveResult(p2, x, resolve, reject)
        }, 0)
      } else {
        this.successCbList.push(() => {
          setTimeout(() => {
            let x = successCb(this.value)
            resolveResult(p2, x, resolve, reject)
          }, 0)
        })
        this.failCbList.push(() => {
          setTimeout(() => {
            let x = failCb(this.reason)
            resolveResult(p2, x, resolve, reject)
          }, 0)
        })
      }
    })
    return p2
  }

  catch = failCb => {
    return this.then(undefined, failCb)
  }

  finally = cb => {
    return this.then(
      // 不论什么状态都会执行cb，然后利用静态方法resolve給cb的返回值增加了可以调用then的能力，相当于执行cb还能跳过cb把value/reason传递给后面的then
      value => MyPromise.resolve(cb()).then(() => value),
      reason => MyPromise.resolve(cb()).then(() => {throw new Error(reason)}),
    )
  }

  static all (array) {
    const result = [];
    const index = 0;
    return new MyPromise((resolve, reject) => {
      function addItem (key, value) {
        result[key] = value;
        index++;
        if(index === array.length) {
          resolve(result)
        }
      }
      for(let i = 0; i < array.length; i++) {
        const curItem = array[i];
        if (curItem instanceof MyPromise) {
          curItem.then(value => addItem(i, value), reason => reject(reason))
        } else {
          addItem(i, curItem)
        }
      }
    })
  }

  static resolve = value => {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise((resolve, reject) => resolve(value))
  }

}

function resolveResult (p2, x, resolve, reject) {
  if (p2 === x) {
    return reject(new Error('cycle promise'))
  } else if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}

// test
const promise = new Mypromiseromise((resolve, reject) => {
  resolve(1)
  // reject(2)
})
function otherP() {
  return new MyPromise((resolve, reject) => {
    setTimeout(resolve, 3000, 'otherP')
    // resolve('otherP')
    // reject(2)
  })
}

promise
  .then(
    val => {
      console.log(val)
      return otherP()
    },
    err => console.log(err)
  )
  .then(
    val => console.log(val),
    err => console.log(err)
  )