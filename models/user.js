var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	username: {
		unique: true,
		type: String
	},
	password: String,
	//user身份标识，1是注册用户，大于等于10则是管理员
	role: {
		type: Number,
		default: 1
	},
	avatar: {
		type: String,
		default: '/images/default_avatar.jpg'
	},
	//注册账号: 10积分
	//每日签到: 5积分
	//连续签到天数>7: 10积分
	//评论: 5积分
	//爆料被采纳: 30积分
	point: {
		type: Number,
		default: 10
	},
	discounts:[{
		type: ObjectId,
		ref: 'Discount'
	}],
	comments:[{
		type: ObjectId,
		ref: 'Comment'
	}],
	collects:[{
		type: ObjectId,
		ref: 'Discount'
	}],
	coupons:[{
		type: ObjectId,
		ref: 'Coupon'
	}],
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
	    },	//录入时间
	    updateAt: {
	    	type: Date,
	    	default: Date.now()
	    }	//更新时间
	  }
	});

User.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now();
	}

	next();
});

User.statics = {
	fetch: function(cb) {
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb);
	},
	findById: function(id, cb) {
		return this
		.findOne({_id: id})
		.exec(cb);
	}
}

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);



