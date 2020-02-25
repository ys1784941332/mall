import {request} from './request'
export function getDetail(iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}

// 获取推荐数据
export function getRecommend() {
  return request({
    url: '/recommend'
  })
}

// Es6 语法
// class Person {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age
//   }
// }
// const p = new Person('why', 18)


// 把多个从服务器返回的数据封装到 一个类中，用类创建对象，传到所需数据的组件中
// 商品基本信息
export class Goods {                
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title
    this.desc = itemInfo.desc
    this.newPrice = itemInfo.price
    this.oldPrice = itemInfo.oldPrice
    this.discount = itemInfo.discountDesc
    this.columns = columns
    this.services = services
    this.realPrice = itemInfo.lowNowPrice
  }
}

// 商家信息
export class Shop {       
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods;
  }
}

// 商品参数
export class GoodsParams {
  constructor(info, rule) {
    // images 可能没有值 （某些商品有值， 某些没有）
    this.image = info.images ? info.images[0] : '';
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}