import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  // payload : 新添加的商品
  addCart(context, payload) {     
    return new Promise((resolve, reject) => {    //  在 Vuex 中使用 Promise , 实现弹出框 Toast
      // 1. 查找之前数组中是否有该商品
      let oldProduct = null;
      for (let item of context.state.cartList) {
        if (item.iid === payload.iid) {         // 判断老商品 与 最新添加的商品的 id 是否相同，
          oldProduct = item           // 相同 就将其设为 老商品
        }
      }

      // 判断是否 为 oldProduct
      if (oldProduct) {
        // oldProduct.count += 1;         // 将 改状态的方法 放到 mutations 中
        context.commit(ADD_COUNTER, oldProduct)
        resolve('当前商品数量+1')         // 回调出一句话 ，在 .then 中使用
      } else {
        payload.count = 1
        // state.cartList.push(payload)  
        context.commit(ADD_TO_CART, payload)
        resolve('添加了新的商品')
      }
    })
  }
}
