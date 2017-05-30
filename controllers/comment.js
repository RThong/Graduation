var Comment = require('../models/comment'),
		User = require('../models/user'),
    Discount = require('../models/discount');

exports.publish = function(req, res, next){

  console.log(req.body)
  var _comment = new Comment(req.body.comment);
  _comment.save(function(err,comment){
    if(err){
      console.log(err);
    }
    
    User.findById(comment.user, function(err, user){
      if(err){
        console.log(err);
      }
      
      user.comments.push(comment._id);
      user.point += 5;

      user.save(function(err, comments){
        if(err){
          console.log(err);
        }
        Comment.find({}).exec(function(err, comments){
          if(err){
            console.log(err);
          }

          Discount.findById(req.body.comment.discount, function(err, discount){
            if(err){
              console.log(err);
            }
            discount.commentCount++;
            discount.save(function(err, discount){
              res.json({
                comment: comment,
                user: user,
                length: comments.length
              })
            })
          })
          ;
        })
      })
      
      
    })
    
  })
};

exports.support = function(req, res, next){
  console.log(req.body)
  Comment.findById(req.body.commentId, function(err, comment){
    if(err){
      console.log(err);
    }
    if(req.body.action == '1'){
      comment.zan = comment.zan + 1;
      comment.zanUser.push(req.body.supportUser);
    }
    else{
      comment.zan = comment.zan - 1;
      comment.zanUser.splice(comment.zanUser.indexOf(req.body.supportUser),1);
    }
    
    comment.save(function(err, comment){
      if(err){
        console.log(err);
      }
      res.json({
        supportConut: comment.zan
      })
    })
  })
};