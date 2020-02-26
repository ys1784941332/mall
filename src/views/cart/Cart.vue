<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list />

    <!-- 底部汇总 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from './childComps/CartList'
  import CartBottomBar from './childComps/CartBottomBar.vue'


  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'Cart',
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      // 将 store 中的 getter 映射到局部计算属性
      // ...mapGetters(['cartLength', 'cartList'])        // 第一种写法
      ...mapGetters({
        length: 'cartLength', // 第二种写法（ 自定义名字 ）
        list: 'cartList'
      })

    }

  }

</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }

</style>
