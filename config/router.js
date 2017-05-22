var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');


var Index = require('../controllers/index'),
    Discount = require('../controllers/discount'),
    Category = require('../controllers/category'),
    User = require('../controllers/user'),
    Comment = require('../controllers/comment'),
    Admin = require('../controllers/admin'),
    Sign = require('../controllers/sign'),
    Theme = require('../controllers/theme'),
    CouponCategory = require('../controllers/couponCategory'),
    Coupon = require('../controllers/coupon');

var app = express();
var multipartMiddleware = multipart();


/* GET home page. */
router.get('/', Index.index);

//首页-分类子页
router.get('/discount/category/:id/:page', Discount.subpage);

//discount详细页
router.get('/discount/:id', Discount.detail);

//publish详细页
router.get('/publish/:id', Discount.detail);



//用户页首页
router.get('/my/index', User.index);

//注册页
router.get('/signup', function(req, res, next){
  res.render('signup');
});

//登录页
router.get('/signin', function(req, res, next){
  res.render('signin');
});

//退出登录
router.get('/logout', User.logout);

//用户登录
router.post('/user/signin', User.login);

//用户注册
router.post('/user/signup', User.signup);

//发表评论
router.post('/user/comment', Comment.publish);

//点赞
router.post('/user/comment/support', Comment.support);

//发布爆料页
router.get('/my/publish/add', Discount.publishSite);

//获得用户爆料
router.post('/my/publish/add/new', multipartMiddleware, Discount.inputPublish, Discount.handleData);

//全民爆料页
router.get('/publish', Discount.publishIndex);



//discount收藏
router.post('/user/collect', Discount.collect);

//用户签到
router.post('/user/sign', Sign.sign);

//用户主页ajax评论
router.get('/ajax/page_comment', User.pageComment);

//用户主页ajax评论
router.get('/ajax/page_publish', User.pagePublish);

//用户主页ajax评论
router.get('/ajax/page_collect', User.pageCollect);

//用户主页ajax优惠券
router.get('/ajax/page_coupon', User.pageCoupon);

//优惠券主题页面
router.get('/theme', Theme.index);

//优惠券详细页面
router.get('/theme/:theme', Theme.detail);

//首页分页
router.get('/page/:page', Index.page)



//优惠券主题录入页
router.get('/admin/theme',User.signinRequired, User.adminRequired, Theme.input);

//优惠券主题接受
router.post('/admin/theme/new',User.signinRequired, User.adminRequired, Theme.handleData);

//优惠券类型录入页
router.get('/admin/coupon_category',User.signinRequired, User.adminRequired, CouponCategory.input);

//优惠券主题接受
router.post('/admin/coupon_category/new',User.signinRequired, User.adminRequired, CouponCategory.handleData);

//管理员主页
router.get('/admin',User.signinRequired, User.adminRequired, Admin.index);

//审核爆料页
router.get('/admin/verify',User.signinRequired, User.adminRequired, Admin.verify);

//discounts审核页面
router.get('/admin/publish/:id',User.signinRequired, User.adminRequired, Discount.verify);

//录入页面
router.get('/admin/discount',User.signinRequired, User.adminRequired, Admin.discountInput);

//discounts列表页面
router.get('/admin/discountlist',User.signinRequired, User.adminRequired, Admin.discountList);

//discounts更新页面
router.get('/admin/discount/update/:id',User.signinRequired, User.adminRequired, Discount.update);

//获取录入的数据
router.post('/admin/discount/new',User.signinRequired, User.adminRequired, Discount.handleData);

//获取扒取数据
router.get('/admin/discount/newlists',User.signinRequired, User.adminRequired, Discount.inputDatas);

//商品类型录入页
router.get('/admin/category',User.signinRequired, User.adminRequired, Category.inputSite);

//保存商品类型数据
router.post('/admin/category/new',User.signinRequired, User.adminRequired, Category.input);

//商品类型列表页
router.get('/admin/categorylist',User.signinRequired, User.adminRequired, Category.list);




//优惠券页面
router.get('/theme/:theme/:coupon',User.signinRequired, User.adminRequired, CouponCategory.detail);

//用户领取优惠券ajax
router.post('/ajax/getCoupon', Coupon.getCoupon);

module.exports = router;