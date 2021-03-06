$(function(){
	// console.log(moment().isBefore('2017-05-15T07:26:32.611Z'))


	$('.more').on('click', function(){
		var index = $(this).parents('.info_wrap').index();
		$('.tab_list').find('.tab_current').removeClass('tab_current');
		$('.tab_list').find('.tab_box').eq(index+1).addClass('tab_current');

		var target = $('.tab_list').find('.tab_box').eq(index+1);

		tabChange(target)
	})

	//左tab height
	if($('.cropbox')){
		uploadImg($('.nickname').find('img').attr('src'));
	}
	

	$('.left_nav').height($('.user_content').find('.container').height());

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
		tabChange(target)
		// $('.my_list').find('.current_content').removeClass('current_content');
		// var targetBox = $('.my_list').find('.info_content').eq(target.index()-1);

		// targetBox.addClass('current_content');

		// if(targetBox.data('flag') == '0'){
		// 	if(target.index() == 2){
		// 		$.get('/ajax/page_comment')
		// 		.done(function(res){
		// 			commentDom(2, res);
		// 			targetBox.data('flag', '1');
		// 		})
		// 		.fail(function(res){
		// 			console.log('error!');
		// 		})
		// 	}

		// 	if(target.index() == 3){
		// 		$.get('/ajax/page_publish')
		// 		.done(function(res){
		// 			publishDom(3, res);
		// 			targetBox.data('flag', '1');
		// 		})
		// 		.fail(function(res){
		// 			console.log('error!');
		// 		})
		// 	}

		// 	if(target.index() == 5){
		// 		$.get('/ajax/page_coupon')
		// 		.done(function(res){
		// 			couponDom(5, res);
		// 			targetBox.data('flag', '1');
		// 		})
		// 		.fail(function(res){
		// 			console.log('error!');
		// 		})
		// 	}

		// }

		// if(target.index() == 4){
		// 	targetBox.find('.my_collect').remove();

		// 	$.get('/ajax/page_collect')
		// 	.done(function(res){
		// 		collectDom(4, res);
				
		// 	})
		// 	.fail(function(res){
		// 		console.log('error!');
		// 	})
		// }
		
	});

	$('.imageBox').on('mouseenter', function(){
		$('body').attr({
			'onmousewheel': 'return false;'
		})
	})
	.on('mouseleave', function(){
		$('body').removeAttr('onmousewheel');
	});

	//上传图片保存
	$('.img_save').on('click', function(){
		if(!$('.cropped').find('img').attr('src')){
			prompt(1,'请选定好头像');
			return;
		}
		else{
			$.post('/ajax/change_ava', {
				img: $('.cropped').find('img').attr('src')
			})
			.done(function(res){
				if(res.status == 1){
					prompt(0,'修改成功');
				}
			})
			.done(function(error){
				console.log(error)
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

function couponDom(index, result){
	var dom = `<div class="coupon_content">
								<table class="coupon_table">
									<thead class="coupon_other">
										<tr>
											<th>优惠券名称</th><th>券号</th><th>有效期至</th><th>优惠券状态</th>
										</tr>
									</thead>
									<tbody>`;

	result.coupons.forEach(function(item){
		dom += `<tr>
			<td><a target="_blank" href="/theme/`+ item.category.theme._id + `/`+ item.category._id + `">`+ item.title + `</a></td><td>`+ item._id + `</td><td>`+ moment(item.expirationtime).format('YYYY-MM-DD') + `</td>
			<td>
				<a href="`+ item.category.theme.link + `" target="_blank">前往使用<span class="arrow">></span></a>
			</td>
		</tr>`
	})

	dom += `</tbody></table></div>`;
	$(".info_content").eq(index-1).prepend(dom);
}

function uploadImg(src){
	var options =
	{
		thumbBox: '.thumbBox',
		spinner: '.spinner',
		imgSrc: src
	}
	var cropper = $('.imageBox').cropbox(options);
	$('#upload-file').on('change', function(){
		var path = $(this).val(),  
		extStart = path.lastIndexOf('.'),  
		ext = path.substring(extStart,path.length).toUpperCase();  

        //获取图片大小，注意使用this，而不是$(this)  
        var size = this.files[0].size / 1024;  
        if(size > 500){  
        	prompt(1,'图片大小不能超过500K');  

        	return false;  
        }

        var reader = new FileReader();
        reader.onload = function(e) {
        	options.imgSrc = e.target.result;
        	cropper = $('.imageBox').cropbox(options);
        }
        reader.readAsDataURL(this.files[0]);
        this.files = [];
      })
	$('#btnCrop').on('click', function(){
		var img = cropper.getDataURL();
		$('.cropped').html('');
		$('.cropped').append('<img src="' + img + '" align="absmiddle" '
			+ 'style="width:128px;margin-top:4px;border-radius:128px;'
			+  'box-shadow:0px 0px 12px #7E7E7E;"><p>128px*128px</p>');
	});
}


function tabChange(target){
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

			if(target.index() == 5){
				$.get('/ajax/page_coupon')
				.done(function(res){
					couponDom(5, res);
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
				collectDom(4, res);
				
			})
			.fail(function(res){
				console.log('error!');
			})
		}
}