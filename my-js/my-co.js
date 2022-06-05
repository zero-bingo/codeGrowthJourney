// ajax返回promise对象
function ajax(url) {}

function * main () {
  const users = yield ajax();
  console.log(users)
  const res = yield ajax();
  console.log(res)
}

const g = main()
// 执行到第一个yield暂停
const result = g.next()
// 将执行结果 也就是promise作为value返回，利用then将promise的结果进一步传递会下一个next执行，这样main函数就有了数据
result.value.then(data => g.next(data))

// 简单把上面几步抽象成递归即可复用
function co (generator) {
  const g = generator()

  function next (data) {
    let result = g.next(data);
    if (result.done) return result.value;
    result.value.then(data => next(data))
  }

  next()
}

// async/await 就是 generator + promise的语法糖 能够更友好的用同步代码书写异步操作