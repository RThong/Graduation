var CouponCategory = require('../models/couponCategory'),
    Coupon = require('../models/coupon'),
    User = require('../models/user');

exports.getCoupon = function(req, res, next){
  console.log(req.body)
  Coupon.findOne({category: req.body.categoryId, user: {$exists: false}}, function(err, coupon){
    if(err){
      console.log(err);
    }
    coupon.user = req.body.userId;
    coupon.save(function(err, coupon){
      User.findById(req.body.userId, function(err, user){
        user.coupons.push(coupon._id);
        user.save(function(err, user){
          res.json({
            info: 'success!'
          })
        })
      })
    })
  })
}