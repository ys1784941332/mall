import {ADD_COUNTER, ADD_TO_CART} from './mutation-types'

export default {
  addCart(context, payload) {      // payload : 新添加的商品
    // 1. 查找之前数组中是否有该商品
    let oldProduct = null;
    for(let item of context.state.cartList) {   
      if(item.iid === payload.iid) {      // 判断老商品 与 最新添加的商品 的 id 是否相同，
        oldProduct = item                 // 相同 就将其 设为 老商品
      }
    }

    // 判断是否 为 oldProduct
    if(oldProduct) {
      // oldProduct.count += 1;       // 将 改状态的方法 放到 mutations 中
      context.commit('ADD_COUNTER', oldProduct)
    } else {
      payload.count =1
      // state.cartList.push(payload)  
      context.commit('ADD_TO_CART', payload)
    }
    
  }
}