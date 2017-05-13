var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var Comment = new Schema({
	discount: {
		type: ObjectId,
		ref: 'Discount'
	},
	user: {
		type: ObjectId,
		ref: 'User'
	},
	zan: {
		type: Number,
		default: 0
	},
	zanUser: [{
		type: ObjectId,
		ref: 'User'
	}], 
	content: String,
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

Comment.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now();
	}

	next();
});

Comment.statics = {
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

module.exports = mongoose.model('Comment', Comment);
