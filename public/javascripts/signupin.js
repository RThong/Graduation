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
			var target = $(this).parent('.input_con');
			target.find('.alert').hide();
			target.find('.alert_data').show();
		})
		.on('blur', function(){

			if(!$(this).attr('placeholder')){
				$(this).attr('placeholder', '请输入帐号');
				var target = $(this).parent('.input_con');
				target.find('.alert_data').hide();

				if($(this).val().length != 0){

					$.post('/ajax/username', {username: $(this).val()})
					.done(function(result){
						if(result.status == 0){
							target.find('.alert_msg').show().find('.alert_con').text(result.info);
							$('#inputUsername').data('verify',0);
						}
						if(result.status == 1){
							target.find('.alert_ok').show();
							$('#inputUsername').data('verify',1);
						}
					})
					.fail(function(error){
						console.log(error);
					});
				}
			}
		});

	$('#inputPassword')
		.on('focus', function(){
			$(this).removeAttr('placeholder');
			var target = $(this).parent('.input_con');
			target.find('.alert').hide();
			target.find('.alert_data').show();
		})
		.on('blur', function(){
			if(!$(this).attr('placeholder')){

				$(this).attr('placeholder', '请输入密码');
				var target = $(this).parent('.input_con');	
				target.find('.alert_data').hide();

				if($(this).val().length < 6 && $(this).val().length != 0){
					target.find('.alert_data').hide();
					target.find('.alert_msg').show();
					$(this).data('verify',0);
				}
				else if($(this).val().length == 0){
					$(this).data('verify',0);
				}
				else{
					$(this).data('verify',1);
				}
			}

		});

	$('#inputConfirm')
	.on('focus', function(){
		$(this).removeAttr('placeholder');
		var target = $(this).parent('.input_con');
		target.find('.alert').hide();
		target.find('.alert_data').show();
	})
	.on('blur', function(){
		if(!$(this).attr('placeholder')){
			$(this).attr('placeholder', '请确认密码');
			var target = $(this).parent('.input_con');
			target.find('.alert_data').hide();

			if(!($('#inputPassword').val() == $('#inputConfirm').val())){
				target.find('.alert_msg').show();
				$(this).data('verify',0);
			}
			else{
				$(this).data('verify',1);
			}
		}

	});



	$('#inputUser')
	.on('focus', function(){
		$(this).removeAttr('placeholder');
		var target = $(this).parent('.input_con');
		target.find('.alert').hide();
	})
	.on('blur', function(){
		if(!$(this).attr('placeholder'))
			$(this).attr('placeholder', '请输入帐号');

		if($(this).val().length == 0){
			var target = $(this).parent('.input_con');
			target.find('.alert').hide();
			target.find('.alert_msg').show();
		}

	});

	$('#inputPass')
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
});

function check(form){
	if($('#inputUsername') && $('#inputUsername').data('verify') == 0){
		var target = $('#inputUsername').parent('.input_con');
		target.find('.alert').hide();
		target.find('.alert_msg').show();
		return false;
	}
	if($('#inputPassword').val().length < 6  && $('#inputPassword').data('verify') == 0){
		var target = $('#inputPassword').parent('.input_con');
		target.find('.alert').hide();
		target.find('.alert_msg').show();
		return false;
	}
	if($('#inputConfirm') && $('#inputConfirm').data('verify') == 0){
		var target = $('#inputConfirm').parent('.input_con');
		target.find('.alert').hide();
		target.find('.alert_msg').show();
		return false;
	}
	return true;
}

function checkLogin(){
	if($('#inputUse').val().length == 0){
		return false;
	}
	if($('#inputPass').val().length == 0){
		return false;
	}
	return true;
}