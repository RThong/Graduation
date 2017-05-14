var CouponCategory = require('../models/couponCategory'),
    Coupon = require('../models/coupon'),
    Theme = require('../models/theme');

exports.input = function(req, res, next){
  Theme.fetch(function(err, themes){
    if(err){
      console.log(err);
    }

    res.render('admin_couponCategory', {
      title: '优惠券类型录入页',
      themes: themes
    })
  })
} 

exports.handleData = function(req, res, next){
  var _couponCategory = new CouponCategory(req.body.category);

  _couponCategory.save(function(err, category){
    if(err){
      console.log(err);
    }

    Theme.findById(category.theme, function(err, theme){
      theme.categories.push(category._id);
      theme.save();
      
      var list = [];
      var coupon = {
        title: category.title,
        expirationtime: category.expirationtime,
        category: category._id
      }; 

      for(var i = 0;i < category.count; i++){
        list.push(coupon);
      }
      Coupon.create(list, function(err, coupons){
        if(err){
          console.log(err);
        }

        var arr=[];
        coupons.forEach(function(item){
          arr.push(item._id);
        });
        category.coupons = category.coupons.concat(arr);
        category.save(function(err, category){

        })
      })
    })
    
  })
} 

exports.detail = function(req, res, next){
  var coupon = req.params.coupon;

  CouponCategory.findOne({_id: coupon})
  .populate({
    path: 'theme coupons'
  })
  .exec(function(err,couponCategory){
    var getCount = 0;
    couponCategory.coupons.forEach(function(item){
      if(item.user){
        getCount += 1;
      }
      
    })
    res.render('coupon_detail', {
      filename: 'coupon_detail',
      couponCategory: couponCategory,
      getCount: getCount
    })
  })
}