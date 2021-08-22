const PENDING = 'pending';
const REJECTED = 'rejected';
const FULLFILLED = 'fullfilled';

class MyPromise {
  value = undefined;
  reason = undefined;
  successCb = [];
  failCb = [];

  constructor(excutor) {
    try {
      excutor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error)
    }
  }

  resolve= value => {
    if (this.status !== PENDING) return;
    this.status = FULLFILLED;
    this.value = value;
    while (this.successCb.length) this.successCb.shift()();
  }

  reject = reason => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    this.reason = reason;
    while (this.failCb.length) this.failCb.shift()();
  }

  then = (successCb, failCb) => {
    let promise = new MyPromise((resolve, reject) => {
      if (this.status === FULLFILLED) {
        setTimeout(() => {
          try {
            const v = this.successCb(this.value);
            resolvePromise(promise, v, resolve, reject)
          } catch (error) {
            this.reject(error)
          }
        }, 0);
      } else if(this.status === REJECTED) {
        setTimeout(() => {
          try {
            const v = this.failCb(this.value);
            resolvePromise(promise, v, resolve, reject)
          } catch (error) {
            this.reject(error)
          }
        }, 0);
      } else {
        this.successCb.push(() => {
          setTimeout(() => {
            try {
              const v = successCb(this.value);
              resolvePromise(promise, v, resolve, reject)
            } catch (error) {
              this.reject(error)
            }
          }, 0);
        });
        this.failCb.push(() => {
          setTimeout(() => {
            try {
              const v = failCb(this.value);
              resolvePromise(promise, v, resolve, reject)
            } catch (error) {
              this.reject(error)
            }
          }, 0);
        });
      }
    });

    return promise;
  }
}

function resolvePromise (self, v, resolve, reject) {
  if(self === v) {
    return reject(new Error('Promise chain cycle'))
  }

  if(v instanceof MyPromise) {
    v.then(resolve, reject)
  } else {
    resolve(v);
  }
}