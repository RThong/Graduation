var CouponCategory = require('../models/couponCategory'),
    Coupon = require('../models/coupon'),
    User = require('../models/user');

exports.getCoupon = function(req, res, next){

  Coupon.findOne({category: req.body.categoryId, user: {$exists: false}}, function(err, coupon){
    if(err){
      console.log(err);
    }
    
    User.findById(req.body.userId, function(err, user){
      if(err){
        console.log(err);
      }
      console.log(coupon.point,user.point)
      if(coupon.point > user.point){
        res.json({
          info:'积分不够!'
        })
      }
      else{       
        coupon.user = req.body.userId;
        coupon.save(function(err, coupon){

          user.coupons.push(coupon._id);
          user.point = user.point - coupon.point;
          user.save(function(err, user){
            res.json({
              info: 'success!'
            })
          })
        })
      }

    })
    
  })
}