<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
    <!-- 给滚动设置固定高度的样式 -->
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramsInfo"/>
      <detail-comment-info :comment-info="commentInfo"/>
      <goods-list :goods="recommends"/>
    </scroll>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'

import Scroll from "components/common/scroll/Scroll";
import GoodsList from 'components/content/goods/GoodsList'

import { getDetail, getRecommend, Goods, Shop, GoodsParams } from "network/detail";
import {debounce} from 'common/utils';
import {itemListenerMixin} from 'common/mixin';

export default {
  name: "Detail",
  components: {
    DetailNavBar, // 导航栏
    DetailSwiper, // 轮播图
    DetailBaseInfo, // 商品基本信息
    DetailShopInfo, // 店铺信息
    DetailGoodsInfo,    // 商品详情数据
    DetailParamInfo,     // 商品参数
    DetailCommentInfo,   // 评论信息
    Scroll,       //  滚动
    GoodsList     // 商品推荐
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramsInfo: {},
      commentInfo: {},
      recommends: [],
    };
  },
  created() {
    // 1. 保存传入的 iid
    this.iid = this.$route.params.iid;

    // 2. 根据 iid 请求详情数据
    getDetail(this.iid).then(res => {
      console.log(res);
      const data = res.result;     // 获取数据
      // 1.获取顶部轮播图数据
      this.topImages = data.itemInfo.topImages;

      // 2.获取商品信息   (根据封装的 Goods 类 获取所有不同来源的商品信息 存到 goods 中)
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3. 获取店铺信息
      this.shop = new Shop(data.shopInfo);

      // 4. 保存商品的详情数据
      this.detailInfo = data.detailInfo

      // 5. 获取参数的信息
      this.paramsInfo = new GoodsParams(data.itemParams.info, data.itemParams.rule)

      // 6. 取出评论信息    (有些商品无评论信息)
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
    });

    // 获取推荐数据
    getRecommend().then((res) => {
      console.log(res);
      this.recommends = res.data.list
    })
  },
  mounted() {
    // let newRefresh = debounce(this.$refs.scroll.refresh, 100);
    // this.itemImgListener = () => { newRefresh() }       // 用 itemImgListener 保存 重刷新函数，在离开home页时取消掉
    // this.$bus.$on("itemImgLoad", this.itemImgListener);
  },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener)  // 取消全局事件的监听 (这里取消 在 home 页面的重刷新 函数)
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()
    }
  }
};
</script>

<style scoped>
/* 将 底部 tabbar 固定 */
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

/* 将顶部 nav 固定 */
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px);
}
</style>