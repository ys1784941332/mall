<template>
  <div class="goods">
    <!-- 每一个 item 是一个对象，包含一个商品的所有属性， 再传给子组件 goodsListItem 细分数据展示 -->
    <goods-list-item v-for="(item,index) in goods" :key="index" :goods-item="item"/>
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem'
export default {
  name: 'GoodsList',
  components: {
    GoodsListItem
  },
  props: {
    goods: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
  .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;  
    padding: 2px;
  }


</style>