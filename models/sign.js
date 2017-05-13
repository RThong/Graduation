var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Sign = new Schema({
	user:{
		type: ObjectId,
		ref: 'User'
	},
	signDays: Number,//连续签到天数
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

Sign.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now();
	}

	next();
});

Sign.statics = {
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

module.exports = mongoose.model('Sign', Sign);
