var cheerio = require('cheerio');
var fs= require('fs');
var path = require('path');

var Discount = require('../models/discount'),
    Comment = require('../models/comment'),
    Category = require('../models/category'),
    User = require('../models/user');

var curl = require('../public/javascripts/curl.js');
//扒取目标网站
var url = "http://www.huim.com/kuaibao/";

exports.detail = function(req, res, next) {
  var id = req.params.id;

  Discount.findOne({_id: id})
  .populate('user')
  .exec(function(err,discount){
    Comment
    .find({discount: id})
    .populate('user','username')
    .sort({'meta.updateAt':-1})
    .exec(function(err, comments){
      
      res.render('detail', { 
        filename: 'detail',
        discount: discount,
        comments: comments
      });
    })
    
  }) 
};

exports.subpage = function(req, res, next) {
  var id = req.params.id,
      page = req.params.page,
      allCategory,
      count = 5,
      index = (page-1)*count;

  if(id){
    Category.fetchCT(function(err, categories){
      allCategory = categories;

      Category
        .findOne({_id:id})
        .populate({
          path: 'discounts'
        })
        .exec(function(err, categories){
          if(err){
            console.log(err);
          }
          
          var length = categories.discounts.length;

          Category
          .findOne({_id:id})
          .populate({
            path: 'discounts',
            select: '_id img key intro site category',
            options: {skip: index ,limit: count}
          })
          .exec(function(err, categories){
            if(err){
              console.log(err);
            }

            res.render('index_category', { 
              filename:'index',
              discounts: categories.discounts,
              categories: allCategory,
              id: id,
              length: length
            });
          });

        });
    });

  }
  
};

exports.update = function(req, res, next) {
  
  var id = req.params.id;

  if(id){
    Discount.findById(id, function(err, discount){
      if(err){
        console.log(err);
      }

      Category.fetchCT(function(err, categories){
        if(err){
          console.log(err);
        }
        res.render('discount_admin',{
          title: '后台推荐更新页',
          discount: discount,
          categories: categories  
        });
      });
    });
  }
}

//储存用户上传图片
exports.inputPublish = function(req, res, next){

  var posterData = req.files.upload,
      filePath = posterData.path,
      originalFilename = posterData.originalFilename;
  
  if (originalFilename) {
    fs.readFile(filePath, function(err, data) {
      var timestamp = Date.now()
      var type = posterData.type.split('/')[1]
      var img = timestamp + '.' + type
      var newPath = path.join(__dirname, '../', '/public/upload/' + img)

      fs.writeFile(newPath, data, function(err) {
        req.img = '/upload/' + img;
        next()
      })
    })
  }
  else {
    next()
  }
};

exports.handleData = function(req, res, next) {
  var discount = req.body.discount,
      id = discount._id;

  if(req.img){
    discount.img = req.img;
  }

  var _discount = new Discount(discount); 

  //修改
  if(id){
    Discount.findById(id, function(err,discount){
      if(err){
        console.log(err);
      }
      //如果是修改推荐，并且没有分类
      if(!discount.category){
        discount.category = _discount.category;
        discount.save(function(err,discount){
          Discount.findOneAndUpdate({_id:id},_discount,function(err, discount){
            if(err){
              console.log(err);
            }
            Category.findById(discount.category, function(err, category){
              if(err){
                console.log(err);
              }

              if(category.discounts.indexOf(discount._id)<0){
                category.discounts.push(discount._id);

                category.save(function(err, category){
                  if(err){
                    console.log(err);
                  }

                  res.redirect('/admin/discountlist');           
                })
              }
              else{
                //
              }
            })
            
          });
        }) 
      }
      //如果是修改推荐，但是有分类
      else{
        var originCategory = discount.category;
        //和以前分类不同
        if(_discount.category.toString() != originCategory.toString()){
          Discount.findOneAndUpdate({_id:id},_discount,function(err,discount){
            if(err){
              console.log(err);
            }
            Category.findById(originCategory, function(err, category){

              category.discounts.splice(category.discounts.indexOf(id),1);
              category.save(function(err, category){

                Category.findById(_discount.category,function(err, category){
                  category.discounts.push(id);
                  category.save(function(err,category){

                      res.redirect('/admin/discountlist');
                    
                  })
                })
              });
            })
          })
          
        }
        //和以前分类相同
        else{
          Discount.findOneAndUpdate({_id:id},_discount)
            .exec(function(err,discount){
              User.findById(discount.user, function(err, user){
                if(err){
                  console.log(err);
                }
                user.point += 30;
                user.save(function(err, user){
                  res.redirect('/admin/discountlist');
                })
              })
              
            })
        }
      }
      
          
    })
  }
  //存储
  else{    
    _discount.save(function(err, discount){
      if(err){
        console.log(err);
      }

      Category.findById(discount.category, function(err, category){
        if(err){
          console.log(err);
        }
        //如果该分类下不存在这个优惠
        if(category.discounts.indexOf(discount._id)<0){
          category.discounts.push(discount._id);

          category.save(function(err, category){
            if(err){
              console.log(err);
            }

            User.findById(discount.user, function(err, user){
              if(err){
                console.log(err);
              }
              console.log('!!!!!!!')
              user.discounts.push(discount._id);

              user.save(function(err, user){
                if(discount.type == '1'){
                  res.redirect('/admin/discountlist'); 
                }
                else{
                  //返回结果给用户
                  res.redirect('/publish/'+ discount.id);
                }
              })
              
            })
            
                      
          })
        }
        else{
          //
        }        
      });
    });
  }
  
  
};

exports.inputDatas = function(req, res, next) {
  curl.download(url, function(data) {
    if (data) {
      //console.log(data);
      var list=[];
      var $ = cheerio.load(data,{decodeEntities: false});

      $("div.zhi_list").each(function(i, e) {
        var obj={};

        obj.img = $(e).find('.list_pic img').attr('data-original')?
        $(e).find('.list_pic img').attr('data-original'):$(e).find('.list_pic>a>img').attr('src');
        
        obj.title = $(e).find('.list_tit').text();
        obj.key = $(e).find('.list_price').text();
        obj.intro = $(e).find('.list_doc').eq(0).text();
        obj.site = $(e).find('.list_buy_btn').attr('href');
        obj.type = '1';
        obj.verify = '1';
        list.push(obj);
      });
      Discount.create(list,function(err){
        if(err){
          console.log(err);
        }
        res.redirect('/admin/discountlist');
      })
      
    } else {
      console.log("error");
    } 
  });

  
};

exports.publishSite = function(req, res, next){

  Category.fetchCT(function(err,categories){
      res.render('publish_add',{
        filename:'publish_add',
        categories: categories
      });
    });
};

exports.publishIndex = function(req, res, next){
  
  Discount.find({type: '2', status: { $lt: 10 }}, function(err,discounts){
    if (err) {
      console.log(err);
    }
    console.log(discounts)
    Category.fetchCT(function(err,categories){
      res.render('publish_index',{
        filename:'publish_index',
        discounts: discounts,
        categories: categories
      });
    });
    
  });
    
};

exports.verify = function(req, res, next){
  
  var id = req.params.id;

  if(id){
    Discount.findById(id, function(err, discount){
      if(err){
        console.log(err);
      }

      Category.fetchCT(function(err, categories){
        if(err){
          console.log(err);
        }
        res.render('admin_verify_detail',{
          title: '后台爆料查看页',
          discount: discount,
          categories: categories  
        });
      });
    });
  }
    
};

exports.collect = function(req, res, next){

  if(req.body.action == '1'){

    User.findById(res.locals.user._id, function(err, user){
      if(err){
        console.log(err);
      }

      user.collects.push(req.body.id);
      user.save(function(err, user){
        res.json({
          info: 'collect success!'
        })
      })
    })
  }
  if(req.body.action == '0'){
    User.findById(res.locals.user._id, function(err, user){
      if(err){
        console.log(err);
      }

      user.collects.splice(user.collects.indexOf(req.body.id),1);
      user.save(function(err, user){
        res.json({
          count: user.collects.length,
          info: 'revoke success!'
        })
      })
    })
  }
  
}