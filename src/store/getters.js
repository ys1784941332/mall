export default {
  cartLength(state) {       // 将 getters 中的 cartlength 设为购物车的 计算属性 cartLength
    return state.cartList.length
  },
  cartList(state) {
    return state.cartList
  }

}