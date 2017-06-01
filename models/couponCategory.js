var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Couponcategory = new Schema({
	title: {
		type: String,
		unique: true
	},
	theme:{
		type: ObjectId,
		ref: 'Theme'
	},
	coupons: [{
		type: ObjectId,
		ref: 'Coupon'
	}],
	count: Number,//数量
	receiveCount: {
		type: Number,
		default: 0
	},//已领取数量
	expirationtime: Date,//有效期至
	point: Number,//领取积分
	price: Number,//金额
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


Couponcategory.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now();
	}

	next();
});

Couponcategory.statics = {
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

module.exports = mongoose.model('Couponcategory', Couponcategory);
