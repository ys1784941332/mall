import Toast from './Toast'

const obj = {}

obj.install = function(Vue) {        // install函数 默认会有 Vue 为参数

  // 1. 创建组件构造器
  const toastConstructor = Vue.extend(Toast)

  // 2. new 的方式，根据组件构造器，创建一个组件对象
  const toast = new toastConstructor()

  // 3. 将组件对象，手动挂载到某一个元素上
  toast.$mount(document.createElement('div'))

  // 4. toast.$el 对应的就是 div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast;

}

export default obj