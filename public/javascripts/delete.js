$(function(){
	$('.del').on('click',function(){
		var $target = $(this),
			id = $target.data('id'),
			$tr = $('.item-id-'+id);

		$.ajax({
			type: 'DELETE',
			url: '/admin/discountlist?id='+id
		})
		.done(function(result){
			if(result.success === 1){
				if($target.length > 0){
					$tr.remove();
					alert('删除成功!');
				}
			}
		})
	});

})