$(function(){
	//发表评论
	$('.btn_pub').on('click', function(){

		$.post('/user/comment', $('#commentForm').serialize())
		.done(function(res){
			dom(res);
			$('#comment_pub').val('');
			location.hash="#target-comment";
			// $('.form-group').find('textarea').val(''); 
		})
		.fail(function(res){
			console.log('err');
		});
	});
 	
 	//登录
	$('.login').on('click', function(){
		$('.cover').removeClass('modal_hide');
		$('.modal').removeClass('modal_hide');		
	});

	//点赞
	$('.comment_dec').on('click', '.csupport', function(){
		var target = $(this);
		var isSupport = $(this).data('issupport');//0是没有赞过,1是已经赞过

		//如果没登录
		if(!$('#cur_user').val()){
			$('.cover').removeClass('modal_hide');
			$('.modal').removeClass('modal_hide');
			return;
		}
		
		//没点赞
		if(isSupport == 0){
			$.post('/user/comment/support', {
				commentId: target.parents('#comment_list').find('#comment_id').val(),
				supportUser: $('#cur_user').val(),
				action: '1'//0是取消赞,1是赞
			})
			.done(function(res){
				target
				.data('issupport','1')
				.css('color', '#333')
				.attr('title', '取消赞')
				.find('.csupport_count').text(res.supportConut);
			})
			.fail(function(res){
				console.log('error!');
			})
		}
		
		if(isSupport == 1){
			$.post('/user/comment/support', {
				commentId: target.parents('#comment_list').find('#comment_id').val(),
				supportUser: $('#cur_user').val(),
				action: '0'
			})
			.done(function(res){
				target
				.data('issupport','0')
				.css('color', '#999')
				.attr('title', '赞')
				.find('.csupport_count').text(res.supportConut);
			})
			.fail(function(res){
				console.log('error!');
			})
		}
	})

	$('.left_shortcut').on('mouseenter', '.collect_btn', function(){
		
		$(this).css({
			'background': '#ea3524',
			'color': '#fff'
		})
		
	})

	$('.left_shortcut').on('mouseleave', '.collect_btn', function(){
		if($(this).data('flag') == 0){
			$(this).css({
				'background': '#fff',
				'color': '#999'
			})
		}
		if($(this).data('flag') == 1){
			$(this).css({
				'background': '#fff',
				'color': '#ea3524'
			})
		}
	})

	//收藏
	$('.left_shortcut').on('click', '.collect_btn', function(){
		var target = $(this);
		
		if($(this).data('flag') == 0){

			$.post('/user/collect', {
				id: $('#discountId').val(),
				action: '1'//1是收藏,0是取消收藏
			})
			.done(function(res){
				target
				.data('flag','1')
				.find('span').text('已收藏');
				target.find('.iconfont').removeClass('icon-shoucang');
				target.find('.iconfont').addClass('icon-shoucang1');
				target.addClass('has_collect');
				console.log(res)
			})
			.fail(function(res){
				console.log('error!');
			})		
		}
		if($(this).data('flag') == 1){
			$.post('/user/collect', {
				id: $('#discountId').val(),
				action: '0'//1是收藏,0是取消收藏
			})
			.done(function(res){
				target
				.data('flag','0')
				.find('span').text('收藏');
				target.find('.iconfont').removeClass('icon-shoucang1');
				target.find('.iconfont').addClass('icon-shoucang');
				target.removeClass('has_collect');
				console.log(res)
			})
			.fail(function(res){
				console.log('error!');
			})
			
		}
	})
});

function dom(res){
	$(".comment_dec").prepend(`
		<div id="comment_list" class="clearfix">
			<input id="comment_id" type="hidden" name="comment[_id]" value="`+ res.comment._id +`">
			<div class="comment_user_info fl">
				<img width="50px" src="https://i.huim.com/users/14184718036496.jpg" alt="" class="userinfo_avatar">
				<span class="userinfo_name">`+ res.user.username +`</span>
			</div>

			<div class="comment_content fl clearfix">
				<div class="top_info clearfix">
					<span class="comment_time">` + moment(res.comment.meta.updateAt).format('YYYY-MM-DD HH:mm:ss')+ `</span>
					<span class="comment_floor fr">`+ res.length +`#</span>
				</div>
				<p class="com_content">`+ res.comment.content +`</p>
				<div class="com_action fr clearfix">
				<a title="赞" class="csupport fl" href="javascript:;" data-issupport="0"><i class="iconfont icon-iconfontpraise"></i><span class="csupport_count">`+ res.comment.zan +`</span></a>
				</div>
			</div>
		</div>
		`);
}

