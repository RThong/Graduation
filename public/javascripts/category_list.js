$(function(){
	var url = window.location.href;
	var arr = [];
	arr = url.split('/');
	$('.side_nav_container').find('.cat_list').each(function(){
		if($(this).find('a').attr('href') == ('/'+ arr[arr.length-1])){
			$(this).css('background','#ec3524').find('a').css('color', '#fff');
		}
	})
	
})
