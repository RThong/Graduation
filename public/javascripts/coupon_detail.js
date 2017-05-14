$(function(){
	$('.get_coupon').on('click', function(){
		$.post('/ajax/getCoupon', {
			userId: $('.coupon_action').find('input').eq(0).val(),
			categoryId: $('.coupon_action').find('input').eq(1).val()
		})
		.done(function(res){

		})
		.fail(function(res){
			console.log('error!');
		});
	})
});