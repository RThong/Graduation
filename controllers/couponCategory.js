var CouponCategory = require('../models/couponCategory'),
    Coupon = require('../models/coupon'),
    Theme = require('../models/theme');

exports.index = function(req, res, next){
  res.render('coupon_index', {
    filename: 'coupon_index'
  })
}

exports.input = function(req, res, next){
  Theme.fetch(function(err, themes){
    if(err){
      console.log(err);
    }

    console.log(themes)
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
      
    })
    // var list = [];
    // var coupon = {
    //   title: category.title,
    //   expirationtime: category.expirationtime
    // }; 
    
    // for(var i = 0;i < category.count; i++){
    //   list.push(coupon);
    // }
    // Coupon.create(list, function(err, coupon){
    //   if(err){
    //     console.log(err);
    //   }
    // })
  })
} 

exports.detail = function(req, res, next){
  var coupon = req.params.coupon;

  CouponCategory.findOne({_id: coupon})
  .populate({
    path: 'theme'
  })
  .exec(function(err,couponCategory){
    res.render('coupon_detail', {
      filename: 'coupon_detail',
      couponCategory: couponCategory
    })
  })
}