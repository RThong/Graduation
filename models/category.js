var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Category = new Schema({
	name: {
		type: String,
		unique: true
	},
	discounts: [{
		type: ObjectId,
		ref: 'Discount'
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


Category.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now();
	}

	next();
});

Category.statics = {
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
	},
	fetchCT: function(cb) {
		return this
		.find({})
		.sort('meta.createAt')
		.exec(cb);
	}
}

module.exports = mongoose.model('Category', Category);
