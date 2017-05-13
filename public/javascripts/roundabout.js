$(function(){
	var index = 0;
	var isAnimating = false;
	var label = $('.label'),carousel = $('.carousel');
	// carousel.each(function(ind,element){

	// })
	// function (ind)
	var timer = setInterval(function(){
				turn();
		},2000);
	
	
	$('.label-left').on('click',function(){
		if(isAnimating){return;}
		isAnimating = true;
		clearShow();
		if(index == 0){
			$('[data-id="'+(--$('.img').length).toString()+'"]').fadeIn('slow', function() {
				$(this).addClass('show');
				index = $('.img').length-1;
				isAnimating = false;
			});
			label.eq(--$('.img').length).addClass('active');
		}else{
			$('[data-id="'+(--index).toString()+'"]').fadeIn('slow', function() {
				$(this).addClass('show');
				isAnimating = false;
			});
			label.eq(index).addClass('active');
		}	
	})
	$('.label-right').on('click',function(){
		if(isAnimating){return;}
		isAnimating = true;
		clearShow();
		if(index == $('.img').length-1){
			$('[data-id="0"]').fadeIn('slow', function() {
				$(this).addClass('show');
				index = 0;
				isAnimating = false;
			});
			label.eq(0).addClass('active');
		}else{
			$('[data-id="'+(++index).toString()+'"]').fadeIn('slow', function() {
				$(this).addClass('show');
				isAnimating = false;
			});
			label.eq(index).addClass('active');
		}
		
	})

	$('.label').on('click',function(){
		if($(this).index() == $('.show').index()){
			return;
		}
		if(isAnimating){return;}
		isAnimating = true;
		clearShow();
		$('[data-id="'+$(this).index()+'"]').fadeIn('slow',function() {
				$(this).addClass('show');
				isAnimating = false;
			});
		$('.label').eq($(this).index()).addClass('active');
	})

	$('.carousel').on('mouseenter',function(){
		clearInterval(timer);
	})
	$('.carousel').on('mouseleave',function(){
		timer = setInterval(function(){
				turn();
		},2000);
	})

	function turn() {
		index = +$('.show').attr('data-id');
		clearShow();
		if(index == $('.img').length-1){
			$('[data-id="0"]').fadeIn('slow', function() {
				$(this).addClass('show');
				index = 0;
			});
			label.eq(0).addClass('active');	
		}
		else{
			$('[data-id="'+(++index).toString()+'"]').fadeIn('slow', function() {
				$(this).addClass('show');
			});
			label.eq(index).addClass('active');			
		}
	}
	function clearShow(){
		$('.show').fadeOut('slow', function() {
			$(this).removeClass('show');
		});
		$('.active').removeClass('active');
	}
})