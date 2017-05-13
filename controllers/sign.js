var moment = require('moment');

var User = require('../models/user'),
    Sign = require('../models/sign');

exports.sign = function(req, res, next){
	
	Sign.findOne({user: req.body.id}, function(err, sign){
		if(err){
			console.log(err);
		}
		//如果该用户还有签到过
		if(!sign){
			var _sign = new Sign({
				user: req.body.id,
				signDays: 1
			});

			_sign.save(function(err, sign){
				if(err){
					console.log(err);
				}

				User.findById(req.body.id, function(err, user){
					user.point += 5;
					user.save(function(err, user){
						res.json({
							signDays: sign.signDays,
							point: 5
						})
					})
				})			
			});
		}
		//该用户曾经签到过
		else{
			//今天
			var lastSign = moment(sign.meta.updateAt).format("YYYY-MM-DD");

			//判断今天是否已经签到
			if(lastSign == moment().format("YYYY-MM-DD")){
				console.log('今天已经签到过了!!!')
			}
			//判断昨天是否签到(是否连续签到)
			else if(lastSign == moment().subtract(1, "days").format("YYYY-MM-DD")){
				sign.signDays += 1;
				sign.save(function(err, sign){
					if(err){
						console.log(err);
					}

					var todayPoint;
					if(sign.signDays > 7){
						todayPoint = 10;
					}
					else{
						todayPoint = 5;					
					}

					User.findById(req.body.id, function(err, user){
						user.point += todayPoint;
						user.save(function(err, user){
							res.json({
								signDays: sign.signDays,
								point: todayPoint
							})
						})
					})
					
				})
			}
			//不是连续签到
			else{
				sign.signDays = 1;
				sign.save(function(err, sign){
					if(err){
						console.log(err);
					}

					User.findById(req.body.id, function(err, user){
						user.point += 5;
						user.save(function(err, user){
							res.json({
								signDays: sign.signDays,
								point: 5
							})
						})
					})
					
				})
			}
		}
	})
}