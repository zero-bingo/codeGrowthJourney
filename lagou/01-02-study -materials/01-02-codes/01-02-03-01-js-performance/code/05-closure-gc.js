let a = 10
function foo(a) {
  return function (b) {
    console.log(b + (++a))
  }
}

let fn = foo(10)
fn(5)
foo(6)(7)
fn(20)
console.log(a)

