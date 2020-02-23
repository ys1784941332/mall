import {debounce} from './utils';
import Scroll from "components/common/scroll/Scroll";

export const itemListenerMixin = {
  components: {

  },
  methods: {

  },

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