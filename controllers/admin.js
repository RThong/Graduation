var Discount = require('../models/discount'),
		Category = require('../models/category');



exports.index = function(req, res, next){
	res.render('admin_index', {
    title: '管理员页面'
  })
	 
};

exports.verify = function(req, res, next){

	Discount
	.find({type: '2',verify: '0'})
	.populate({
		path: 'category',
		select: 'name'
	})
	.exec(function(err, discounts){
		if(err){
			console.log(err);
		}

		res.render('admin_verify',{
			title: '爆料审核页',
			discounts: discounts
		});
	})
	 
};

exports.discountList = function(req, res, next) {
  
  Discount
    //查询是管理员发布的信息和已审核通过的爆料
    .find({$or: [{type:'1'}, {status: { $lt: 10 }}] })
    .populate({
      path: 'category',
      select: 'name'
    })
    .exec(function(err, discounts){
      if(err){
        console.log(err);
      }

      res.render('discountlist_admin',{
        title: '推荐列表页',
        discounts: discounts
      });
  }) 
};

exports.discountInput = function(req, res, next) {

  Category.fetchCT(function(err, categories){
    res.render('discount_admin',{
      filename: 'discount_admin',
      title: '推荐录入页',
      discount: {},
      categories: categories
    });
  })
  
};

