<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" class="check-button" @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计：{{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算：({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'

  import { mapGetters } from 'vuex'

  export default {
    name: 'CartBottomBar',
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),      // 获取 getters 中的 cartList
      // 计算总价格
      totalPrice() {      
        return '￥' + this.cartList.filter(item => {
          return item.checked             // 过滤掉 没被选中的商品
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0)
      },
      // 算出选中商品个数
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      // 判断 全选按钮是否要被选中
      isSelectAll() {
        if(this.cartList.length === 0) return false         // 初始没商品时

        //方法一： 如果找出 没被选中商品 获取长度为一个正数，再取反，则为 false
        // return !(this.cartList.filter(item => !item.checked).length)
        // 方法二：当找到一个没被选中的函数会返回 true，再 加！最后则返回true  
        return !this.cartList.find(item => !item.checked)      
        // 方法三：遍历
        // for (let item of this.cartList) {
        //   if(!item.checked) {         // 如果有没被选中的，直接返回 false
        //     return false             
        //   }
        //   return true
        // }
      }
    },
    methods: {
      checkClick() {
        if(this.isSelectAll) {
          this.cartList.forEach(item => item.checked = false)
        } else {
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {            // 点击去计算 判断是否点击购买的商品
        if(!this.isSelectAll) {
          this.$toast.show('请选择要购买的商品', 1500)
        }
      }
    }
  }

</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;
    height: 40px;
    line-height: 40px;
    background-color: #eee;
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 80px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 10px;
  }

  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    color: #fff;
    background-color: red;
    text-align: center;
  }
</style>
