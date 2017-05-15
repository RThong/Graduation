var User = require('../models/user'),
    Discount = require('../models/discount'),
    Comment = require('../models/comment');

var passport = require('passport');

exports.index = function(req, res, next){
	if(!res.locals.user){
		res.redirect('/signup');
	}
	else{
    User
    .findOne({_id: res.locals.user._id})
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
      .findOne({_id: res.locals.user._id})
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
        .findOne({_id: res.locals.user._id})
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
          .findOne({_id: res.locals.user._id})
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
              coupons: coupons
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
    path: 'discounts'   
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
    path: 'collects'   
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
    } 
  })
  .exec(function(err, user){
    if(err){
      console.log(err);
    }
    res.json(user);
  });
};