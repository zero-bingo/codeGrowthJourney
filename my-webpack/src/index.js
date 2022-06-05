import { sum } from './js/utils.js'
import title from './title'
import p from './pdf'

console.log(sum(1, 2))
console.log(title)

if(module.hot) {
  module.hot.accept(['./title.js'], () => {
    // hmr后的操作
  })
}