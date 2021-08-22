// 减少访问层级 
// var obj = {
//   age: 18, 
//   methods: {
//     m1: {
//       name: '', 
//       time: 100
//     },
//     m2: {
//       name: '',

//     }
//   }
// }

function Person() {
  this.name = 'zce'
  this.age = 40
}

let p1 = new Person()
console.log(p1.age)

function Person() {
  this.name = 'zce'
  this.age = 40
  this.getAge = function () {
    return this.age
  }
}

let p1 = new Person()
console.log(p1.getAge())