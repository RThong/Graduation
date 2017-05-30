var User = require('../models/user'),
    Discount = require('../models/discount'),
    Comment = require('../models/comment');

var passport = require('passport');

exports.index = function(req, res, next){
	if(!req.user){
		res.redirect('/signup');
	}
	else{
    User.findById(req.user._id, function(err, user){
      if(err){
        console.log(err);
      }

      var discount_count = user.discounts.length,
          comment_count = user.comments.length,
          collect_count = user.collects.length,
          coupon_count = user.coupons.length;


      User
      .findOne({_id: req.user._id})
      .populate({
        path: 'discounts',
        select: '_id title key img status meta',
        options: {limit: 5}  
      })
      .exec(function(err, user){
        if(err){
          console.log(err);
        }

        var discounts = user.discounts;

        User
        .findOne({_id: req.user._id})
        .populate({
          path: 'comments',
          select: '_id meta discount content',
          options: {limit: 5,sort:{'meta.updateAt':-1}},

          populate: {
            path: 'discount',
            select: 'title img type'
          }
        })
        .exec(function(err, user){
          if(err){
            console.log(err);
          }

          var comments = user.comments;

          User
          .findOne({_id: req.user._id})
          .populate({
            path: 'collects',
            select: '_id meta img title type',
            options: {limit: 5,sort:{'meta.updateAt':-1}}
          })
          .exec(function(err, user){
            if(err){
              console.log(err);
            }

            var collects = user.collects;

            User
            .findOne({_id: req.user._id})
            .populate({
              path: 'coupons',
              options: {limit: 5,sort:{'meta.updateAt':-1}},
              populate: {     
                path: 'category',
                populate: {     
                  path: 'theme'
                }
              }
            })
            .exec(function(err, user){
              if(err){
                console.log(err);
              }

              var coupons = user.coupons;

              res.render('user_index', { 
                filename: 'user',
                discounts: discounts,
                comments: comments,
                collects: collects,
                coupons: coupons,
                discount_count: discount_count,
                comment_count: comment_count,
                collect_count: collect_count,
                coupon_count: coupon_count
              });

            });
          });

        });
      });
    });
  }
  
};

exports.login = function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if(err){ 
      return next(err); 
    }
    //未找到用户
    if(!user){ 
      return res.redirect('/signin');
    }
    //找到该用户
    req.logIn(user, function(err) {
      if(err){
        return next(err);
      }
      if(req.headers.referer.indexOf('signin')>=0){
        return res.redirect('/');
      }
      else{
        return res.redirect(req.headers.referer);
      }
      
      
    
    });

  })(req, res, next);
  
};

exports.signup = function(req, res, next){
  User.register(new User({ username: req.body.user.username }), req.body.user.password,
    function(err) {
      if (err) return next(err);
      
      res.redirect('/signin');
    });
};

//登出
exports.logout = function(req, res, next) {
  delete req.session.passport;
  res.redirect('/'); 
};

exports.pageComment = function(req, res, next){
  
  User
  .findOne({_id: res.locals.user._id})
  .populate({
    path: 'comments',
    options: {sort:{'meta.updateAt':-1}},
    populate: {
      path: 'discount'
    }
  })  
  .exec(function(err, user){
    if(err){
      console.log(err);
    }
    res.json(user);
  });
};

exports.pagePublish = function(req, res, next){
  
  User
  .findOne({_id: res.locals.user._id})
  .populate({
    path: 'discounts',
    options: {sort:{'meta.updateAt':-1}} 
  })
  .exec(function(err, user){
    if(err){
      console.log(err);
    }
    res.json(user);
  });
};

exports.pageCollect = function(req, res, next){
  
  User
  .findOne({_id: res.locals.user._id})
  .populate({
    path: 'collects',
    options: {sort:{'meta.updateAt':-1}}   
  })
  .exec(function(err, user){
    if(err){
      console.log(err);
    }
    res.json(user);
  });
};

exports.pageCoupon = function(req, res, next){
  
  User
  .findOne({_id: res.locals.user._id})
  .populate({
    path: 'coupons',
    populate: {
      path: 'category',
      populate: {
        path: 'theme'
      }
    },
    options: {sort:{'meta.updateAt':-1}}
  })
  .exec(function(err, user){
    if(err){
      console.log(err);
    }
    res.json(user);
  });
};

//管理员权限审核
exports.adminRequired = function(req, res, next){
  var role = req.user.role;

  if(role >= 10){
    next();
  }
  else{
    return res.redirect('/');
  }
};

//用户权限审核
exports.signinRequired = function(req, res, next){
  
  if(req.user){
    next();
  }
  else{
    return res.redirect('/signin');
  }
};

//用户名查重
exports.check = function(req, res, next){
  User.findOne({username: req.body.username}, function(err, user){
    if(err){
      console.log(err);
    }
    if(user){
      res.json({
        status: 0,
        info: '用户名已存在'
      });
    }
    else{
      res.json({
        status: 1,
        info: '用户名可用'
      });
    }
  })
};

exports.ajaxLogin = function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if(err){ 
      return next(err); 
    }
    //未找到用户
    if(!user){ 
      return res.json({
        status: 0,
        info:'帐号或密码错误 !'
      }); 
    }
    //找到该用户
    req.logIn(user, function(err) {
      if(err){
        return next(err);
      }
      // if(req.headers.referer.indexOf('signin')>=0){
      //   return res.redirect('/');
      // }
      // else{
      //   return res.redirect(req.headers.referer);
      // }
      
      res.json({
        status: 1,
        info:'登录成功'
      }); 
    
    });

  })(req, res, next);
  
};