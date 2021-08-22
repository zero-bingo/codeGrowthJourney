var aButtons = document.querySelectorAll('button')

// 基础
// for (var i = 0; i < aButtons.length; i++) {
//   aButtons[i].onclick = function () {
//     console.log(`当前索引值为${i}`)
//   }
// }

/**
 * 闭包
 * 自定义属性
 * 事件委托
 */
// for (var i = 0; i < aButtons.length; i++) {
//   (function (i) {
//     aButtons[i].onclick = function () {
//       console.log(`当前索引值为${i}`)
//     }
//   })(i)
// }

// for (var i = 0; i < aButtons.length; i++) {
//   aButtons[i].onclick = (function (i) {
//     return function () {
//       console.log(`当前索引值为${i}`)
//     }
//   })(i)
// }

// for (let i = 0; i < aButtons.length; i++) {
//   aButtons[i].onclick = function () {
//     console.log(`当前索引值为${i}`)
//   }
// }

// for (var i = 0; i < aButtons.length; i++) {
//   aButtons[i].myIndex = i
//   aButtons[i].onclick = function () {
//     console.log(`当前索引值为${this.myIndex}`)
//   }
// }

// document.body.onclick = function (ev) {
//   var target = ev.target,
//     targetDom = target.tagName
//   if (targetDom === 'BUTTON') {
//     var index = target.getAttribute('index')
//     console.log(`当前点击的是第 ${index} 个`)
//   }
// }