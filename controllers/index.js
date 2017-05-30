var moment = require('moment');

var Discount = require('../models/discount'),
    Category = require('../models/category'),
    Sign = require('../models/sign'),
    Comment = require('../models/comment');

exports.index = function(req, res, next) {
  Discount.find({type: '1'},null,{limit:5, sort:{'hot':-1}}, function(err,discounts){
    if (err) {
      console.log(err);
    }
    var hots = discounts;

    Discount.find({type: '1'}, function(err,discounts){
      if (err) {
        console.log(err);
      }
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
                length: length,
                hots: hots
              });
            }
            else{
              res.render('index',{
                filename:'index',
                discounts: discounts,
                categories: categories,
                sign: '',
                length: length,
                hots: hots
              });
            }
          })
          }
          else{
            res.render('index',{
              filename:'index',
              discounts: discounts,
              categories: categories,
              length: length,
              hots: hots
            });
          }

        });
      });
    }); 
  });  
};

exports.page = function(req, res, next) {
  var page = req.params.page,
  count = 5,
  index = (page-1)*count;

  Discount.count({type: 1}, function(err, length){
    if (err) {
      console.log(err);
    }
    Discount.find({type: '1'},null,{limit:5, sort:{'hot':-1}}, function(err,discounts){
      if (err) {
        console.log(err);
      }
      var hots = discounts;

      Discount.find({type: 1}, null, {skip:index, limit: count}, function(err, discounts){
        if (err) {
          console.log(err);
        }
        Category.fetchCT(function(err,categories){
          if (err) {
            console.log(err);
          }
          res.render('index_page', { 
            filename:'index',
            discounts: discounts,
            length: length,
            categories: categories,
            page: page,
            hots: hots
          });
        });
      })
    });       
 });        

  
};

exports.search = function(req, res, next){
  var key = req.query.key;

  Discount.find({title: new RegExp(key+'.*')})
  .populate('user')
  .exec(function(err, discounts){
    if(err){
      console.log(err);
    }
    
    res.render('result', {
      filename:'result',
      key: key,
      discounts: discounts
    })
  })

}
