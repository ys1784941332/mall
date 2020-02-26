# mall

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

小结：

#### 1. 本地项目与 github 联系方法
方法一（推荐）、先在 github中创建一个仓库， 在本地建的项目中先通过 `git remote add origin https://github.com/ys1784941332/mall.git`，再 `git push -u origin maste`r ，就可以将 本地项目连接到 github
方法二、先在github在新建个仓库， 再在本地 git clone https://github.com/ys1784941332/mall.git 拉取项目，
   通过 vue-cli 新建个项目，将项目各文件拷贝到拉取的项目中
#### 2. 划分目录结构，新建 router, store,common, views 等文件夹
#### 3.  css样式初始化   githhub 下载引入 `normalize.css`，再引入css 文件（`base.css`)
#### 4. 新建 `vue.config.js` 文件 并配置 别名， 从外导入 `.editorconfig`  配置文件
#### 5. 安装 vue-router 
#### 6. 封装顶部 tabbar , 并引用
#### 7.安装axios, 并在network 中进行网络模块封装
#### 8. 引入轮播图组件 swiper 
#### 9. 在原生滚动中可使用 `position: sticky;  top: 44px;` 实现顶部停留问题
#### 10. npm下载 better-scroll（1.13.2版本） 并 封装为 Scroll 组件  
better-scroll 基本使用：  

```bash 
//在 mouted（） {}  写入
const bscroll =  new BScroll(document.querySelector('.content'), {
    probeType: 3,   //监测滚动位置，01不监测，2 不监测手离开后的滚动， 3 都监测
    click: true,   // 滚动内容可点击（button设置 false 可以点击，div 一定要设为 true)
    pullUpLoad: true  // 上拉刷新
  })
  bscroll.on('scroll', position => {
    // console.log(position);
  })

  bscroll.on('pullingUp', () => {
    console.log('上拉加载');    // 默认只能加载一次
    // 发送网络请求， 请求更多数据， 拿到数据并展示后 调用
    bscroll.finishPullUp()    // 刷新上拉加载
  })
```
#### 11.解决网络问题图片还未加载完，scroll 计算的高度（scrollerHeight属性)不准确导致的 滚动延缓bug，需要重新计算高度。因为涉及到非父子组件的通信, 所以这里我们选择了`事件总线`bus

```bash
* Vue.prototype.$bus = new Vue()           // main.js中
* this.$bus.$emit('事件名称', 参数)           
* this.$bus.$on('事件名称', 回调函数(参数))
```
#### 12. 对于refresh非常频繁的问题, 封装 防抖操作 
#### 13. 封装 BackTop 回到顶部组件，监听组件（加`native`)的点击事件回到顶部，v-show判断显示和隐藏, 监听上拉加载更多
```bash
 <back-top @click.native="backClick" v-show="isShowBackTop"/>
```

#### 14. 吸顶效果实现
必须当图片加载完后 再计算 offsetTop   ，给轮播图 加 @load="方法"

***
**注意**：`在详情页点击刷新，数据会重新从服务器请求，所以返回 home 页时 不会保持原来位置`
#### 15. 详情页
      1. 封装导航栏 DetailNavBar,  
      2. 封装轮播图  DetailSwiper
      3. 商品基本信息  DetailBaseInfo
      4. 店铺信息  DetailShopInfo
      5. 商品详情数据   DetailGoodsInfo   监听 图片长度加载完成后，再刷新滚动  
      6. 商品参数     DetailParamInfo
      7. 评论信息    DetailCommentInfo
      8. 推荐信息    使用封装的 goods组件
      9. 底部栏       DetailBottomBar
     10. 封装回到顶部栏到mixin   BackTop     
```bash
Q1 解决在 home 和 detail 周期函数 mounted 中复用代码 问题： 使用混入 mixin 
```

```bash
Q2 解决网络问题图片还未加载完，scroll  滚动延缓，需要重新计算高度：监听图片加载完后，执行 refresh()
```

 

```bash
Q3 标题和内容的联动效果
```
**1.点击标题 滚动 到对应位置**
`保存每个title 对应的 内容高度 offsetTop（点击函数里面获取） ，再通过点击标题调用 scrollTo()来实现`
**2.滚动内容 切换  对应标题**
`将滚动的高度  与 4个title 对应高度 对比， 更改 index ,改变对应标题样式`

**offsetTop**: `元素相对于父级定位元素(relative，absolute，fixed)的距离，只有元素（渲染完成）才会计算入offsetTop，若是中间有元素数据需要异步获取，会导致最终获取的offsetTop值偏小
`

**注： 如何才能获取到正确的 offsetTop?**
+ 1.created 不行，不能获取到元素
+ 2.mounted 也不行，数据还没有获取到
+ 3.获取到数据的回调也不行，DOM 还没有渲染完
+ 4.$nextTick也不行，图片的高度没有被计算在内
+ 5.图片加载完成后，获取的高度才正确 （项目中 是 在 updated  函数中）
***


### 16.购物车
**mixin混入对象和Vuex的区别：**
+ Vuex是状态共享管理，所以Vuex中的所有变量和方法都是可以读取和更改并相互影响的；

+ mixin可以定义公用的变量或方法，但是mixin中的数据是不共享的，也就是每个组件中的mixin实例都是不一样的，都是单独存在的个体，不存在相互影响的；

+ mixin混入对象值为函数的同名函数选项将会进行递归合并为数组，两个函数都会执行，只不过先执行mixin中的同名函数；

+ mixin混入对象值为对象的同名对象将会进行替换，都优先执行组件内的同名对象，也就是组件内的同名对象将mixin混入对象的同名对象进行覆盖；
 
**16.1**：`用 vuex 保存 传到购物车的数据`    
+ npm下载并在store文件夹 index.js中安装使用 并导出，在main.js中导入挂载
+ 将 vuex 进行 重构

**16.2**：通过 ...mapgetters 将数据获取到  ，实现  导航栏` NavBar`
**16.3**：使用 scroll  （所滚动内容必须设置高度），在 activated 中调用 refresh（)
**16.3**:  子组件 `CartList  、  CartListItem`， 封装 按钮组件 `CheckButton`
**16.4**: 在vuex 中定义 checked 默认为选中状态，传给 组件，监听 按钮组件（加 `.native)`的点击  ，改变商品 状态
**16.5**: 底部工具栏  组件 `CartBottomBar`
* **计算价格**： `filter` 先过滤掉未被选中的商品， 再通过从vuex获取数据 通过 `reduce()` 计算总价格
* **全选按钮**：
	+ 显示的状态: 判断有一个不选中，全选就不选中 
	+ 点击全选按钮：如果原来全是选中， 点击全部不选中； 否则 点击选中  
* **选中商品个数**： 算出 选中商品个数 的长度
 
**16.6**： **详情页加入购物车 Toast 实现**：
+  在 vuex 中 的 `action` 中使用 `Promise` 将 提示语句  回调出来
+ 使用 `{ mapActions }` 将 其中的 addCart 方法 映射到  methods 中，再通过 `this.addCart(`）就可以调用
+ 方法一： 正常封装成一个组件 Toast,引用再使用   方法二： 将 Toast 封装到 Vue 的 原型 上

**注意:**
* `fastclick` 解决移动端点击 300ms 延迟问题 1. npm安装，2. main.js引入，
   3. FastClick.attach(document.body)
+ `图片懒加载` `vue-lazyload` 1. npm 安装 2. main.js 导入  3. Vue.use()   
+ `移动端适配px->vw`：1. npm 安装 postcss-px-to-viewport    --save --dev 2. 新建 postcss.config.js 文件 并 配置
       
**17.windows上部署：（tomcat/nginx 在服务器中提供服务的软件）**
一、将自己电脑作为服务器 -> window -> nginx
1.官网下载 nginx , 执行 .exe 文件，浏览器输入  localhost 有页面 就启动成功
2. 将 dist 文件 拷贝到 nginx 根目录中，修改 配置文件 nginx.conf  中的  location    html 改为 dist, 重启 nginx (nginx -s reload  重启nginx)
3. 浏览器输入 localhost 即可展示项目
二、远程 连接服务器 上部署
 安装 centerOs ，再 yum install nginx
 yum : linux 安装包管理工具
 
 
       
       
       


***
***
***
Home页知识点总结：

### 一. FeatureView

* 独立组件封装FeatureView
  * div>a>img	



### 二. TabControl

* 独立组件的封装
  * props -> titles
  * div>根据titles v-for遍历 div -> span{{title}}
  * css相关
  * 选中哪一个tab, 哪一个tab的文字颜色变色, 下面border-bottom
    * currentIndex



### 三. 首页商品数据的请求

#### 3.1. 设计数据结构, 用于保存数据

goods: {

pop: page/list

new: page/list

sell: page/list

}



#### 3.2. 发送数据请求

* 在home.js中封装getHomeGoods(type, page)
* 在Home.vue中, 又在methods中getHomeGoods(type)
* 调用getHomeGoods('pop')/getHomeGoods('new')/getHomeGoods('sell')
  * page: 动态的获取对应的page
* 获取到数据: res
  * this.goods[type].list.push(...res.data.list)
  * this.goods[type].page += 1

goods: {

pop: page1:/list[30]

new: page1/list[30]

sell: page1/list[30]

}

### 四. 对商品数据进行展示

#### 4.1. 封装GoodsList.vue组件

* props: goods -> list[30]
* v-for goods -> GoodsListItem[30]
* GoodListItem(组件) -> GoodsItem(数据)



#### 4.2. 封装GoodsListItem.vue组件

* props: goodsItem 
* goodsItem 取出数据, 并且使用正确的div/span/img基本标签进行展示



### 五. 对滚动进行重构: Better-Scroll

#### 5.1. 在index.html中使用Better-Scroll

* const bscroll = new BScroll(el, {   })
* 注意: wrapper -> content -> 很多内容
* 1.监听滚动
  * probeType: 0/1/2(手指滚动)/3(只要是滚动)
  * bscroll .on('scroll', (position) => {})
* 2.上拉加载
  * pullUpLoad: true
  * bscroll .on('pullingUp', () => {})
* 3.click: false
  * button可以监听点击
  * div不可以

#### 5.2. 在Vue项目中使用Better-Scroll

* 在Profile.vue中简单的演示
* 对Better-Scroll进行封装: Scroll.vue
* Home.vue和Scroll.vue之间进行通信
  * Home.vue将probeType设置为3
  * Scroll.vue需要通过$emit, 实时将事件发送到Home.vue

### 六. 回到顶部BackTop

#### 6.1. 对BackTop.vue组件的封装



#### 6.2. 如何监听组件的点击

* 直接监听back-top的点击, 但是可以直接监听?
  * 不可以, 必须添加修饰.native
* 回到顶部
  * scroll对象, scroll.scrollTo(x, y, time)
  * this.$refs.scroll.scrollTo(0, 0, 500)



#### 6.3. BackTop组件的显示和隐藏 

* isShowBackTop: false
* 监听滚动, 拿到滚动的位置:
  * -position.y > 1000  -> isShowBackTop: true
  * isShowBackTop = -position.y > 1000





### 七. 解决首页中可滚动区域的问题

* Better-Scroll在决定有多少区域可以滚动时, 是根据scrollerHeight属性决定
  * scrollerHeight属性是根据放Better-Scroll的content中的子组件的高度
  * 但是我们的首页中, 刚开始在计算scrollerHeight属性时, 是没有将图片计算在内的
  * 所以, 计算出来的告诉是错误的(1300+)
  * 后来图片加载进来之后有了新的高度, 但是scrollerHeight属性并没有进行更新.
  * 所以滚动出现了问题
* 如何解决这个问题了?
  * 监听每一张图片是否加载完成, 只要有一张图片加载完成了, 执行一次refresh()
  * 如何监听图片加载完成了?
    * 原生的js监听图片: img.onload = function() {}
    * Vue中监听: @load='方法'
  * 调用scroll的refresh()
* 如何将GoodsListItem.vue中的事件传入到Home.vue中
  * 因为涉及到非父子组件的通信, 所以这里我们选择了**事件总线**
    * bus ->总线
    * Vue.prototype.$bus = new Vue()           // main.js中
    * this.$bus.$emit('事件名称', 参数)           
    * this.$bus.$on('事件名称', 回调函数(参数))


* 问题一: refresh找不到的问题
  * 第一: 在Scroll.vue中, 调用this.scroll的方法之前, 判断this.scroll对象是否有值
  * 第二: 在mounted生命周期函数中使用 this.$refs.scroll而不是created中
* 问题二: 对于refresh非常频繁的问题, 进行防抖操作
  * 防抖debounce/节流throttle(课下研究一下)
  * 防抖函数起作用的过程:
    * 如果我们直接执行refresh, 那么refresh函数会被执行30次.
    * 可以将refresh函数传入到debounce函数中, 生成一个新的函数.
    * 之后在调用非常频繁的时候, 就使用新生成的函数.
    * 而新生成的函数, 并不会非常频繁的调用, 如果下一次执行来的非常快, 那么会将上一次取消掉

```js
      debounce(func, delay) {
        let timer = null
        return function (...args) {
          if (timer) clearTimeout(timer)
          timer = setTimeout(() => {
            func.apply(this, args)
          }, delay)
        }
      },
```



### 八. 上拉加载更多的功能

- 监听滚到底部
  + 

### 九. tabControl的吸顶效果

#### 9.1. 获取到tabControl的offsetTop

* 必须知道滚动到多少时, 开始有吸顶效果, 这个时候就需要获取tabControl的offsetTop
* 但是, 如果直接在mounted中获取tabControl的offsetTop, 那么值是不正确.
* 如何获取正确的值了?
  * 监听HomeSwiper中img的加载完成.
  * 加载完成后, 发出事件, 在Home.vue中, 获取正确的值.
  * 补充:
    * 为了不让HomeSwiper多次发出事件,
    * 可以使用isLoad的变量进行状态的记录.
  * 注意: 这里不进行多次调用和debounce的区别

#### 9.2. 监听滚动, 动态的改变tabControl的样式

* 问题:动态的改变tabControl的样式时, 会出现两个问题:
  * 问题一: 下面的商品内容, 会突然上移
  * 问题二: tabControl虽然设置了fixed, 但是也随着Better-Scroll一起滚出去了.
* 其他方案来解决停留问题.
  * 在最上面, 多复制了一份TabControl组件对象, 利用它来实现停留效果.
  * 当用户滚动到一定位置时, TabControl显示出来.
  * 当用户滚动没有达到一定位置时, TabControl隐藏起来.



### 十. 让Home保持原来的状态

#### 10.1. 让Home不要随意销毁掉

* keep-alive

#### 10.2. 让Home中的内容保持原来的位置

* 离开时, 保存一个位置信息saveY.
* 进来时, 将位置设置为原来保存的位置saveY信息即可.
  * 注意: 最好回来时, 进行一次refresh()















非父子组件通信:

https://www.jb51.net/article/132371.htm



