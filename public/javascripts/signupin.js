$(function(){
	$('.btn')
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

		$('#inputConfirm')
		.on('focus', function(){
			$(this).removeAttr('placeholder');
		})
		.on('blur', function(){
			if(!$(this).attr('placeholder'))
				$(this).attr('placeholder', '请确认密码');
		});
})