$(function(){

	$('.sign_date').text(moment().format('D'));

	$('.sign_btn').on('click', function(){
		console.log($(this).hasClass('login_modal'))
		if(!$(this).hasClass('login_modal')){

			$.post('/user/sign', {
				id: $(this).data('user')
			})
			.done(function(res){
				$('.sign_days').text(res.signDays);
			})
			.fail(function(res){
				console.log('error!');
			})
		}
		
	})

	$('.sign_btn').on('click', function(){
		if(!$(this).hasClass('login_modal')){
			$('.nosign_box').css('display', 'none');
		$('.oksign_box').removeClass('sign_hide');	
		}
		
	})
})