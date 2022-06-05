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
// const promise = new Mypromiseromise((resolve, reject) => {
//   resolve(1)
//   // reject(2)
// })
// function otherP() {
//   return new MyPromise((resolve, reject) => {
//     setTimeout(resolve, 3000, 'otherP')
//     // resolve('otherP')
//     // reject(2)
//   })
// }

// promise
//   .then(
//     val => {
//       console.log(val)
//       return otherP()
//     },
//     err => console.log(err)
//   )
//   .then(
//     val => console.log(val),
//     err => console.log(err)
//   )

Promise.resolve()
.then(() => {
  console.log(0)
  return Promise.resolve(4)
  // return 4
})
.then((res) => {console.log(res)})

Promise.resolve()
.then(() => {console.log(1)})
.then(() => {console.log(2)})
.then(() => {console.log(3)})
.then(() => {console.log(5)})
.then(() => {console.log(6)})

/**
 * 向消息队列中推入期约1落定后需要执行的回调then0
    向消息队列中推入期约2落定后需要执行的回调then1
    第一次eventloop结束【then0，then1】

    第一个期约落定为resolved状态
    进入then0，输出0，return4
    向消息队列中推入期约落定后执行then4
    推出then0
    第二个期约落定为resolved状态
    进入then1，输出1
    向消息队列中推入期约落定后执行then2
    推出then1
    第二次eventloop结束【then4，then2】

    then4的上一个期约返回值为4，状态为resolved落定
    进入执行then4，输出4
    推出then4
    then2的上一个期约没有返回值，没改变状态，为resolved落定
    进入then2，输出2
    向消息队列中推入期约落定后执行then3
    第三次eventloop结束【then3】
 * 
*/


/**
 * 向消息队列中推入期约1落定后需要执行的回调then0
向消息队列中推入期约2落定后需要执行的回调then1
第一次eventloop结束【then0，then1】

第一个期约落定为resolved状态
进入then0，输出0，return新的期约
向消息队列中推入Promise.resolve(4)
推出then0
第二个期约落定为resolved状态
进入then1，输出1
向消息队列中推入期约落定后执行then2
推出then1
第二次eventloop结束【Promise.resolve(4)，then2】

新的期约Promise.resolve(4)执行，状态为resolved落定
向消息队列中推入return 4
推出Promise.resolve(4)
then2的上一个期约没有返回值，没改变状态，为resolved落定
进入then2，输出2
向消息队列中推入期约落定后执行then3
第三次eventloop结束【return 4，then3】// 012

return 4执行
向消息队列中推入期约落定后执行then4
推出return 4
then3的上一个期约没有返回值，没改变状态，为resolved落定
进入then3，输出3
向消息队列中推入期约落定后执行then5
第三次eventloop结束【then4，then5】// 0123

。。。

 * */
// 输出结果0123456 请解释！