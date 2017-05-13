var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;

var passportLocalMongoose = require('passport-local-mongoose');

var Coupon = new Schema({
	title: {
		unique: true,
		type: String
	},
	point: Number,//领取积分
	price: Number,//金额
	expirationtime: Date,//有效期至
	category: {
		type: ObjectId,
		ref: 'Couponcategory'
	},//优惠券种类
	img: String,//图片
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

Coupon.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now();
	}

	next();
});

Coupon.statics = {
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

Coupon.plugin(passportLocalMongoose);

module.exports = mongoose.model('Coupon', Coupon);



