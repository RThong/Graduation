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
			var target = $(this).parent('.input_con');
			target.find('.alert').hide();
		})
		.on('blur', function(){
			if(!$(this).attr('placeholder'))
			$(this).attr('placeholder', '请输入帐号');
			
		});

	$('#inputPassword')
		.on('focus', function(){
			$(this).removeAttr('placeholder');
			var target = $(this).parent('.input_con');
			target.find('.alert').hide();
			
		})
		.on('blur', function(){
			if(!$(this).attr('placeholder'))
			$(this).attr('placeholder', '请输入密码');

			if($(this).val().length == 0){
				var target = $(this).parent('.input_con');
				target.find('.alert').hide();
				target.find('.alert_msg').show();
			}
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

	$('.login_btn').on('click', function(){
		if($('#inputUsername').val().length == 0){
			var target = $('#inputUsername').parent('.input_con');
			target.find('.alert').hide();
			target.find('.alert_msg').show();  
			return ;
		}
		if($('#inputPassword').val().length == 0){
			var target = $('#inputPassword').parent('.input_con');
			target.find('.alert').hide();
			target.find('.alert_msg').show(); 
			return ;
		}
		$.post('/ajax/signin', {
			username: $('#inputUsername').val(),
			password: $('#inputPassword').val()
		})
		.done(function(res){
			if(res.status == 0){
				$('.password').find('.alert_msg').show().find('.alert_con').text(res.info);
			}
			if(res.status == 1){
				location.href = '';
			}
		})
		.fail(function(error){
			console.log(error);
		})
	});

	
});

function prompt(text){
	$('.modal_info').find('.modal_txt').text(text);
	$('.modal_info').show().delay(2000).fadeOut();
}