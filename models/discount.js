var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Discount = new Schema({
	title: String,
	img: String,
	key: String,
	intro: String,
	site: String,
	category:{
		type: ObjectId,
		ref: 'Category'
	},
	user:{
		type: ObjectId,
		ref: 'User'
	},
	type: String,//1是管理员发布的优惠,2是用户发布的爆料
	verify: String,//0是未审核,1是已审核
	status: Number,//反馈给用户的信息,小于10代表通过,大于10代表未通过
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

Discount.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now();
	}

	next();
});

Discount.statics = {
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

module.exports = mongoose.model('Discount', Discount);
