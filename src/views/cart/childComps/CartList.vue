<template>
  <div class="cart">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList" :key="index" :item-info="item"/>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem'

import { mapGetters } from 'vuex'

export default {
  name: 'CartList',
  components: {
    Scroll,
    CartListItem
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  activated() {
    // 包证在 进入购物车页面时 重新刷洗 滚动效果
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
  
  .content {
    height: calc(100vh - 44px - 40px - 49px);
    overflow: hidden;
  }
</style>