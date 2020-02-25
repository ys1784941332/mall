import {debounce} from './utils';
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null    // 保存监听的 重刷新函数
    }
  },
  mounted() {
    let newRefresh = debounce(this.$refs.scroll.refresh, 100);
    this.itemImgListener = () => { newRefresh() }       // 用 itemImgListener 保存 重刷新函数，在离开home页时取消掉
    this.$bus.$on("itemImgLoad", this.itemImgListener);

    // console.log('我是混入中的内容');
  }
}

// backTop 回到顶部
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false   
    }
  },
  methods: {
    // 点击回到顶部方法，使用 scroll组件 封装的 scrollTo方法
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    // 判断是否需要显示 BackTop按钮
    listenShowBackTop(position) {             // 必须在 监听滚动函数 里面调用它
      this.isShowBackTop = -position.y > 1000;
    }
  }
}