<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物车</div>
    </nav-bar>
    <!-- 新加一个 tab-control , 监听滚动位置 再显示，两个再重叠 -->
    <tab-control
      :titles="['流行','新款','精选']"
      @itemClick="itemClick"
      ref="tabControl1"
      :class="{fixed: isTabFixed}"
      class="tab-control"
      v-show="isTabFixed"
    />
    <scroll
      class="content"   
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @scroll="contentScroll"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control
        :titles="['流行','新款','精选']"
        @itemClick="itemClick"
        ref="tabControl2"
        :class="{fixed: isTabFixed}"
      />
      <goods-list :goods="showGoods" />
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backTop/BackTop";

import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { debounce } from "common/utils";
import {itemListenerMixin} from 'common/mixin';

export default {
  name: "Home",
  components: {
    NavBar,
    Scroll,
    TabControl,
    GoodsList,
    BackTop,
    HomeSwiper,
    RecommendView,
    FeatureView
  },
  mixins: [itemListenerMixin],        // 混入 mounted 中的对象
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffSetTop: 0,
      isTabFixed: false,
      saveY: 0,
    };
  },
  created() {
    // 1. 请求多个数据
    this.getHomeMultidata();

    // 2. 请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },

  mounted() {
    // 1. 监听item中图片加载完成后 滚动效果重新刷新
    // 调用防抖函数，返回一个函数 并赋值给 newRefresh

    // const newRefresh = debounce(this.$refs.scroll.refresh, 100);
    // this.itemImgListener = () => { newRefresh() }       // 用 itemImgListener 保存 重刷新函数，在离开home页时取消掉
    // this.$bus.$on("itemImgLoad", this.itemImgListener);

    // this.$bus.$on("itemImageLoad", () => {
    //   newRefresh() }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  // 有keep-alive 中 才会有 activated, deactivated 函数
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)    // 每次回到 home 页面时 都会滚动到离开时的位置，相当于保持位置
    this.$refs.scroll.refresh()   // 让滚动效果重新刷新
  },
  deactivated() {
    // 1. 离开 home 时 保存滚动位置
    this.saveY = this.$refs.scroll.getScrollY()  
    // 2. 取消全局事件的监听 (这里取消 在 home 页面的重刷新 函数)
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    // 监听点击 TabControl 事件方法 获取当前的类型
    itemClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // 保证两个 tabControl 被点击后都能显示当前 被点击商品类型，使其保持一致
      this.$refs.tabControl1.currentIndex = index;    
      this.$refs.tabControl2.currentIndex = index;
    },
    // 点击回到顶部方法，使用 scroll组件 封装的 scrollTo方法
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },

    // 监听滚动位置
    contentScroll(position) {
      // 1. 判断是否需要显示 BackTop按钮
      this.isShowBackTop = -position.y > 1000;
      // 2. 决定 tabControl是否吸顶 (position：fixed)
      this.isTabFixed = -position.y > this.tabOffSetTop;
    },

    // scroll 滚动到底部后 上拉加载更多
    loadMore() {
      this.getHomeGoods(this.currentType); // 执行获取商品方法， page + 1, 获取更多数据
    },

    // 获取 tabControl 的 offsetTop
    // 所有组件都有一个属性 $el ： 用于获取组件中的所有元素
    swiperImageLoad() {
      this.tabOffSetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    // 网络请求相关方法
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      // 再一次封装一个方法 包裹请求数据的方法，分别传入 type 可一次性获取全部商品数据
      const page = this.goods[type].page + 1; // 动态获取当前页码
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp(); // 完成当前上拉加载更多， 使得可继续上拉加载
      });
    }
  }
};
</script>

<style scoped>
#home {
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: white;
  /* 浏览器使用原生滚动时使用 */
  /* position: fixed;    
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

/* 设置局部滚动的 固定高度 */
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control {
  position: relative;
  z-index: 9;
}
/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>