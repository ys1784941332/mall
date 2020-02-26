<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <!-- 给滚动设置固定高度的样式 -->
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramsInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <detail-bottom-bar @addToCart="addToCart" />
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {
    mapActions
  } from 'vuex';


  import {
    getDetail,
    getRecommend,
    Goods,
    Shop,
    GoodsParams
  } from "network/detail";
  import {
    debounce
  } from "common/utils";
  import {
    itemListenerMixin,
    backTopMixin
  } from "common/mixin";

  export default {
    name: "Detail",
    components: {
      DetailNavBar, // 导航栏
      DetailSwiper, // 轮播图
      DetailBaseInfo, // 商品基本信息
      DetailShopInfo, // 店铺信息
      DetailGoodsInfo, // 商品详情数据
      DetailParamInfo, // 商品参数
      DetailCommentInfo, // 评论信息
      Scroll, //  滚动
      GoodsList, // 商品推荐
      DetailBottomBar, // 底部栏
    },
    mixins: [itemListenerMixin, backTopMixin],
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
        themeTopYs: [], // 顶部标题 对应的 Y 值
        getThemeTopY: null,
        currentIndex: 0, // 保存当前滚动获取到的 index
      };
    },
    created() {
      // 1. 保存传入的 iid
      this.iid = this.$route.params.iid;

      // 2. 根据 iid 请求详情数据
      getDetail(this.iid).then(res => {
        const data = res.result; // 获取数据
        // 2.1.获取顶部轮播图数据
        this.topImages = data.itemInfo.topImages;

        // 2.2.获取商品信息   (根据封装的 Goods 类 获取所有不同来源的商品信息 存到 goods 中)
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );

        // 2.3. 获取店铺信息
        this.shop = new Shop(data.shopInfo);

        // 2.4. 保存商品的详情数据
        this.detailInfo = data.detailInfo;

        // 2.5. 获取参数的信息
        this.paramsInfo = new GoodsParams(
          data.itemParams.info,
          data.itemParams.rule
        );

        // 2.6. 取出评论信息    (有些商品无评论信息)
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }

        // dom结构随数据改变这样的操作都应该放进 this.$nextTick() 的回调函数中
        // 这个地方图片还没加载完，高度获取不对
        // this.$nextTick(() => {
        //   this.themeTopYs.push[0];
        //   this.themeTopYs.push[this.$refs.params.$el.offsetTop];
        //   this.themeTopYs.push[this.$refs.comment.$el.offsetTop];
        //   this.themeTopYs.push[this.$refs.recommend.$el.offsetTop];
        //   console.log(this.themeTopYs);
        // })
      });

      // 3.请求获取推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list;
      });
    },
    mounted() {},
    destroyed() {
      this.$bus.$off("itemImgLoad", this.itemImgListener); // 取消全局事件的监听 (这里取消 在 home 页面的重刷新 函数)
    },
    updated() {
      // let img = document
      //   .getElementsByClassName("content")[0]
      //   .getElementsByTagName("img");
      // let count = 0;
      // let length = img.length;
      // if (length) {
      //   const that = this;
      //   let timer = setInterval(() => {
      //     if (count == length) {
      //       that.$refs.scroll.refresh();
      //       that.$nextTick(() => {
      //         // 在this.$nextTick()中 将回调延迟到下次 DOM 更新循环之后执行，可获取到最新的数据
      //         that.themeTopYs = [];
      //         that.themeTopYs.push(0);
      //         that.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //         that.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //         that.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //         console.log(this.themeTopYs);
      //       });

      //       clearInterval(timer);
      //     } else if (img[count].complete) {
      //       count++;
      //     }
      //   }, 100);
      // }

      this.$nextTick(() => { // 在this.$nextTick()中 将回调延迟到下次 DOM 更新循环之后执行，可获取到最新的数据
        this.themeTopYs = [] // 每次 push 时先清空
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE); //新增一个 数字的最大值
      })
    },
    methods: {
      ...mapActions(['addCart']), // 将 addCart 方法映射过来
      imageLoad() {
        this.$refs.scroll.refresh();
      },
      titleClick(index) { // 点击 title 滚动到对应位置
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
      },
      // 监听滚动， 获取滚动位置
      contentScroll(position) {
        const positionY = -position.y;
        // 四个高度： 0, 10697, 11423, 11618
        // postionY 在 0 和 10697 之间 ， index =  0
        // postionY 在 10697 和 11423 之间 ， index =  1
        // postionY 在 11423 和 11618 之间 ， index =  2
        // postionY 超过  11618  ， index =  3
        // console.log(this.themeTopYs);

        let length = this.themeTopYs.length;

        /**
         * 判断的方案:
         *  方案一:
         *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
         *    优点: 不需要引入其他的内容, 通过逻辑解决
         *    缺点: 判断条件过长, 并且不容易理解
         * 
         *  方案二:
         *    条件: 给themeTops最后添加一个很大的值 Number.MAX_VALUE , 用于和最后一个主题的top进行比较.
         *    优点: 简洁明了, 便于理解
         *    缺点: 需要引入一个较大的int数字
         */

        for (let i = 0; i < length - 1; i++) { // length-1 最后那个最大值不需要取到
          // 方案 一:
          // this.currentIndex == i  时, 就不会重新赋值 currentIndex, 防止赋值频繁
          // if ( this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) ||
          //   (i === length - 1 && positionY >= this.themeTopYs[i])) ) {
          //   this.currentIndex = i       
          // 将 当前滚动获取的 currentIndex 传给 NavBar 组件里面的 currentIndex
          //   this.$refs.nav.currentIndex = this.currentIndex;
          // }

          // 方案二:
          // this.currentIndex == i  时, 就不会重新赋值 currentIndex, 防止赋值频繁
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
            this.currentIndex = i;
            // 将 当前滚动获取的 currentIndex 传给 NavBar 组件里面的 currentIndex
            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }

        this.listenShowBackTop(position); // 调用 mixin 的函数来判断是否显示 BackTop 按钮
      },
      // 添加到购物车方法
      addToCart() {
        // 1. 获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;
        // product.count = 1;

        // 2. 将商品添加到购物车
        // this.$store.commit('addCart', product)       // addCart 方法在 mutations 中时
        // this.$store.dispatch('addCart', product).then(res => {       // addCart 方法在 actions 中
        //   console.log(res);
        // })       

        this.addCart(product).then(res => { // 映射 addCart方法后可以这样 调用
          // this.show = true;
          // this.message = res;
          // setTimeout(() => {
          //   this.message = false;
          //   this.message = ''
          // }, 1500)
          
          this.$toast.show(res)     // 调用 封装的 toast 中的 show 函数 
          console.log(res);
        })
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
    height: calc(100% - 44px - 49px);
  }

</style>
