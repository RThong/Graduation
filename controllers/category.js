var Category = require('../models/category');

exports.inputSite = function(req, res, next) {
 
  res.render('category_admin',{
    title: '商品类型录入页'
  });
};

exports.input = function(req, res, next) {

  var _category = new Category(req.body.category);
  _category.save(function(err, category){
    if(err){
      console.log(err);
    } 
    res.redirect('/admin/categorylist'); 
  });
};

exports.list = function(req, res, next){

  Category.fetch(function(err,categories){
    if (err) {
      console.log(err);
    }
    res.render('categorylist_admin',{
      title: '分类列表',
      categories: categories
    });
  });
};