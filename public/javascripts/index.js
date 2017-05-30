$(function(){

	$('.sign_date').text(moment().format('D'));

	$('.sign_btn').on('click', function(){
		
		if(!$(this).hasClass('login_modal')){

			$.post('/user/sign', {
				id: $(this).data('user')
			})
			.done(function(res){
				if(res.signDays <= 7){
					prompt('签到成功，积分加5');
				}
				else{
					prompt('签到成功，积分加10');
				}			
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

	$(window).on('scroll',function(){
		if($(window).scrollTop() > $('.rec_content').find('.container').offset().top - 100){
			$('.side_nav').addClass('fixed_nav');
		}
		else{
			$('.side_nav').removeClass('fixed_nav');
		}
	});

	$('.site_page').on('click', '.page_box', function(){
		console.log($(this).text())
	})
})