<template>
  <div class="goods-item" @click="itemClick">
    <img v-lazy="showImage" alt @load="imageLoad" />
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">￥{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsListItem',
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    showImage() {
      // 在详情页中使用 GoodsList 时 无 goodsItem.show.img 属性，只有 goodsItem.image 来获取图片
      return this.goodsItem.image || this.goodsItem.show.img || this.goodsItem.img
    }
  },
  methods: {
    imageLoad() {             // 利用 vue 中的事件监听图片加载完成后  @load='方法'
      this.$bus.$emit('itemImageLoad')     // 事件总线


      // 在 home 和 item 中同时需要监听 图片加载完 后 执行刷新方法，所以必须区分 (实现的另一种方法)
      // if(this.$route.path.indexOf('/home') {
      //   this.$bus.$emit('homeitemImageLoad')
      //  } else if(this.$route.path.indexOf('/detail')) {
      //    this.$bus.$emit('detailItemImgLoad')
      //  }
    },
    itemClick() {
      this.$router.push('/detail/' + this.goodsItem.iid)
    }
  }
}
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;
  width: 48%;
}
.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  /* 超出部分 ...  */
  text-overflow: ellipsis;
  /* 不换行 */
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: 0;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>
