<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    };
  },
  mounted() {
    // 1. 创建 Bscroll 对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType, // 监听滚动
      pullUpLoad: this.pullUpLoad // 上拉加载
    });

    // 2. 监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on("scroll", position => {
        this.$emit("scroll", position);
      });
    }

    // 3. 监听scroll 滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        this.$emit("pullingUp");
      });
    }
  },
  methods: {
    // 封装一个 点击回到顶部的 方法   设置 time 默认为 300ms
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    // 封装 可多次上拉加载更多方法
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    // 封装刷新事件
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    // 获得离开 home 界面的 滚动位置信息
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
};
</script>

<style scoped>
</style>