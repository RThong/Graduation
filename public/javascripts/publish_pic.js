function showPreview(source) {  
	var file = source.files[0]; 
	if(window.FileReader) {  
		var fr = new FileReader();  
		fr.onloadend = function(e) {  
			$('.add_upload').hide();
			$('#portrait').show().attr('src',e.target.result); 
		};  
		fr.readAsDataURL(file);  
	}  
}