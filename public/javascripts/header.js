$(function(){
	$('.login_modal').on('click',function(){
		$('.cover').removeClass('modal_hide');
		$('.modal').removeClass('modal_hide');
	});
	$('.modal_close').on('click', function(){
		$('.cover').addClass('modal_hide');
		$('.modal').addClass('modal_hide');
	})
	$('.login_btn')
		.on('mouseenter', function(){
			$(this).css('background', '#F26B5E');
		})
		.on('mouseleave', function(){
			$(this).css('background', '#ec3524');
		});

	$('#inputUsername')
		.on('focus', function(){
			$(this).removeAttr('placeholder');
		})
		.on('blur', function(){
			if(!$(this).attr('placeholder'))
			$(this).attr('placeholder', '请输入帐号');
		});

	$('#inputPassword')
		.on('focus', function(){
			$(this).removeAttr('placeholder');
		})
		.on('blur', function(){
			if(!$(this).attr('placeholder'))
			$(this).attr('placeholder', '请输入密码');
		});


	$('.user_info')
	.on('mouseenter', '.user_list', function(){
		$(this).find('.nickname').css({
			'background': '#fff',
			'border-color': '#ebebeb'
		});
		$(this).find('.dropdown').css('display', 'block');	
	})
	.on('mouseleave', '.user_list', function(){	
		$(this).find('.nickname').css({
			'background': '#f5f5f5',
			'border-color': '#f5f5f5'
		});	
		$(this).find('.dropdown').css('display','none');	
	});



})
