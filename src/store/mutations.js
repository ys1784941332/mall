import {ADD_COUNTER, ADD_TO_CART} from './mutation-types'

export default  {
  // mutations 中用来修改 state 中 状态
  // mutations 中的每个方法尽可能完成的 事件 比较单一
  [ADD_COUNTER](state, payload) {
    payload.count++               // 老商品数量 + 1
  },
  [ADD_TO_CART](state, payload) {     // 新商品添加到购物车
    state.cartList.push(payload)
  }
}