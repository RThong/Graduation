$(function(){
	$('.get_coupon').on('click', function(){
		if(!$('#cur_user').val()){
			$('.cover').removeClass('modal_hide');
			$('.modal').removeClass('modal_hide');
			return;
		}
		$.post('/ajax/getCoupon', {
			userId: $('.coupon_action').find('input').eq(0).val(),
			categoryId: $('.coupon_action').find('input').eq(1).val()
		})
		.done(function(res){
			if(res.status == 0){
				prompt(1,'兑换失败, 积分不够');
			}
			if(res.status == 1){
				prompt(0,'兑换成功');
				window.location.href=window.location.href
			}
			
		})
		.fail(function(res){
			console.log('error!');
		});
	});


});