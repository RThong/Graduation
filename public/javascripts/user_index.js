$(function(){
	console.log(moment().toISOString())
	//取消收藏
	$('.info_content').on('click', '.remove_collect', function(){
		var target = $(this).parents('.collect_box');

		$.post('/user/collect', {
			id: $(this).data('discount'),
			action: '0'//1是收藏,0是取消收藏
		})
		.done(function(res){
			target.remove();
			$('#collect_tit').text('收藏(' + res.count +')');
		})
		.fail(function(res){
			console.log('error!');
		})
	});

	//tab点击
	$('.tab_list').on('click', '.tab_box', function(){
		$('.tab_list').find('.tab_current').removeClass('tab_current');
		$(this).addClass('tab_current');

		var target = $(this);

		$('.my_list').find('.current_content').removeClass('current_content');
		var targetBox = $('.my_list').find('.info_content').eq(target.index()-1);

		targetBox.addClass('current_content');

		if(targetBox.data('flag') == '0'){
			if(target.index() == 2){
				$.get('/ajax/page_comment')
				.done(function(res){
					commentDom(2, res);
					targetBox.data('flag', '1');
				})
				.fail(function(res){
					console.log('error!');
				})
			}

			if(target.index() == 3){
				$.get('/ajax/page_publish')
				.done(function(res){
					publishDom(3, res);
					targetBox.data('flag', '1');
				})
				.fail(function(res){
					console.log('error!');
				})
			}

		}

		if(target.index() == 4){
			targetBox.find('.my_collect').remove();

			$.get('/ajax/page_collect')
			.done(function(res){
				console.log(res)
				collectDom(4, res);
				
			})
			.fail(function(res){
				console.log('error!');
			})
		}
		
	})
})

function commentDom(index, result){
	var dom = '<ul class="my_comment common_box">';

	result.comments.forEach(function(item){
		dom += `
			<li class="clearfix">
				<img class="headpic fl" width="50px" src="` + result.avatar + `" alt="">
				<div class="content_box fl">
					<div class="content_info_box clearfix">
						<p class="content_info con_ell fl">` + item.content + `</p>
						<span class="content_time fr">` + moment(item.meta.updateAt).format('YYYY-MM-DD HH:mm:ss') + `</span>
					</div>
					<div class="content_goods clearfix">
						<img class="fl" width="60px" height="60px" src="` + item.discount.img + `" alt="">
						<div class="content_goods_info fl link">
							<a href="/discount/` + item.discount._id + `#comment" target="_blank" class="commen_goods_tit">` + item.discount.title + `</a>
						</div>
					</div>
				</div>
			</li>`
	});
	
	dom += '</ul>'
	$(".info_content").eq(index-1).prepend(dom);
}

function publishDom(index, result){
	var dom = '<ul class="my_pulish common_box">';

	result.discounts.forEach(function(item){
		dom += `	
		<li class="clearfix">
			<img class="fl" width="50px" height="50px" src="` + item.img + `" alt="">
			<div class="content_box fl">
				<div class="content_info_box clearfix">
					<p class="content_info con_ell fl link"><a target="_blank" href="/publish/` + item._id + `">` + item.title + `</a></p>
					<span class="content_time fr">` + moment(item.meta.updateAt).format('YYYY-MM-DD HH:mm:ss') + `</span>
				</div>`
				if(!item.status){
					dom += `<p class="publish_statu">状态：正在审核...</p>`;
				}
				else{
					if(item.status < 10){
						dom += `<p class="publish_statu">状态：已采纳</p>`;
					}
					else if(item.status == 11){
						dom += `<p class="publish_statu">状态：未采纳（价格优势不足）</p>`;
					}
					else if(item.status == 12){
						dom += `<p class="publish_statu">状态：未采纳（已有该爆料）</p>`;
					}
				}
		dom += `</div>
		</li>`
	})
	dom += '</ul>';
	$(".info_content").eq(index-1).prepend(dom);
}

function collectDom(index, result){
	var dom = '<ul class="my_pulish common_box my_collect">';

	result.collects.forEach(function(item){
		dom += `<li class="collect_box clearfix">
									<img class="fl" width="50px" height="50px" src="` + item.img + `" alt="">
									<div class="content_box fl">
										<div class="content_info_box clearfix">`;

											if(item.type == '1'){
												dom += `<p class="content_info con_ell fl link"><a href="/discount/` + item._id + `" target="_blank">` + item.title + `</a></p>`;
											}
											if(item.type == '2'){
												dom += `<p class="content_info con_ell fl link"><a href="/publish/` + item._id + `" target="_blank">` + item.title + `</a></p>`;
											}

											dom += `<span class="content_time fr">` + moment(item.meta.updateAt).format('YYYY-MM-DD HH:mm:ss') + `</span>											
										</div>
										<div class="content_action clearfix">
											<a href="javascript:;" data-discount="` + item._id + `" class="remove_collect fr">取消收藏</a>
										</div>
									</div>
								</li>`;
	})
	dom += '</ul>';
	$(".info_content").eq(index-1).prepend(dom);
}
