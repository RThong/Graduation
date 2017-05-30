var Theme = require('../models/theme'),
    CouponCategory = require('../models/couponCategory');

exports.index = function(req, res, next){
  Theme.fetch(function(err, themes){
    if(err){
      console.log(err);
    }
    CouponCategory.find(null, null ,{limit:5, sort:{'receiveCount':-1}})
      .populate({
        path: 'theme'
      })
      .exec(function(err,categories){  
      if(err){
        console.log(err);
      }
      
      res.render('theme_index', {
        filename: 'theme_index',
        themes: themes,
        categories: categories
      })
    })
    
  })
  
}

exports.input = function(req, res, next){
  res.render('admin_theme', {
    title: '优惠券主题录入页'
  })
} 

exports.handleData = function(req, res, next){
  var _theme = new Theme(req.body.theme);

  _theme.save(function(err, theme){
    if(err){
      console.log(err);
    }

    res.redirect('/admin');
  })
} 
exports.detail = function(req, res, next){
  var theme = req.params.theme;

  Theme.findOne({_id: theme})
  .populate({
    path: 'categories'
  })
  .exec(function(err,theme){
 
    res.render('theme_detail', {
      filename: 'theme_detail',
      theme: theme
    })
  })
} 
