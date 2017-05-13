var moment = require('moment');

var Discount = require('../models/discount'),
    Category = require('../models/category'),
    Sign = require('../models/sign');

exports.index = function(req, res, next) {

  Discount.find({type: '1'}, function(err,discounts){
    if (err) {
      console.log(err);
    }
    Category.fetchCT(function(err,categories){
      if(res.locals.user){
        Sign.findOne({user: res.locals.user._id}, function(err, sign){
          
          var isSign = '';//1为已签到,0位未签到
          if(moment(sign.meta.updateAt).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")){
            isSign = '1';
          }
          else{
            isSign = '0';
          }
          res.render('index',{
            filename:'index',
            discounts: discounts,
            categories: categories,
            isSign: isSign,
            sign: sign
          });
        })
      }
      else{
        res.render('index',{
          filename:'index',
          discounts: discounts,
          categories: categories
        });
      }
          
    });
    
  }); 
  
};