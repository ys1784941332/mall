<template>
  <swiper ref="swiper" v-if="banners.length">
    <swiper-item v-for="(item, index) in banners" :key="index">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

	export default {
		name: "HomeSwiper",
    components: {
		  Swiper,
      SwiperItem
    },
    data() {
      return {
        isLoad: false
      }
    },
    props: {
		  banners: {
		    type: Array,
        default: []
      }
    },
    methods: {
		  stopTimer() {
		    this.$refs.swiper.stopTimer()
      },
      startTimer() {
		    if (this.$refs.swiper) {
          this.$refs.swiper.startTimer()
        }
      },
      // 监听 轮播图片 加载完
      imageLoad() {
        if (!this.isLoad) {        
          this.$emit('swiperImageLoad')
          this.isLoad = true   // 通过变量 isLoad 记录当前发出去的事件，响应四次让其只发出去一次
        }
      }
    }
	}
</script>

<style scoped>

</style>
