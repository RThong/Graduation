var moment = require('moment');

var Discount = require('../models/discount'),
    Category = require('../models/category'),
    Sign = require('../models/sign');

exports.index = function(req, res, next) {
  Discount.find({type: '1'}, function(err,discounts){
    var length = discounts.length;

    Discount.find({type: '1'},null,{limit:5}, function(err,discounts){
      if (err) {
        console.log(err);
      }
      Category.fetchCT(function(err,categories){
        if(req.user){
          Sign.findOne({user: req.user._id}, function(err, sign){
            if(sign){
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
                sign: sign,
                length: length
              });
            }
            else{
              res.render('index',{
                filename:'index',
                discounts: discounts,
                categories: categories,
                sign: '',
                length: length
              });
            }
          })
        }
        else{
          res.render('index',{
            filename:'index',
            discounts: discounts,
            categories: categories,
            length: length
          });
        }
            
      });
      
    }); 
  });  
};

exports.page = function(req, res, next) {
  var page = req.params.page,
      count = 5,
      index = (page-1)*count;

  Discount.count({}, function(err, length){
    
    Discount.find({type: 1}, null, {skip:index, limit: count}, function(err, discounts){
      res.render('index_page', { 
        filename:'index',
        discounts: discounts,
        length: length,
        page: page
      });
    });

  });       
          

  
};