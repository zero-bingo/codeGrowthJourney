let _Vue = null

export default class RouterVue {
  static install (Vue) {
    // 1.判断当前插件是否已经安装
    if(RouterVue.install.installed) return
    RouterVue.install.installed = true
    // 2.把Vue记录到全局变量
    _Vue = Vue
    // 3.创建Vue实例时候，也就是new Vue传入router（是RouterVue的实例），将其注入到所有Vue实例上
    _Vue.mixin({
      beforeCreate() {
        // 只需要一次注入即可
        if(this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  constructor(options) {
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init() {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  createRouteMap() {
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponents(Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      methods: {
        clickHandler(e) {
          e.preventDefault()
          history.pushState({}, '', this.to)
          this.$router.data.current = this.to
        }
      },
      render(h) {
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickHandler
          }
        }, this.$slot.default)
      }
    })
    const component = this.routeMap[this.data.current]
    Vue.component('router-view', {
      render(h) {
        return h(component)
      }
    })
  }

  initEvent() {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}