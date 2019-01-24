$(document).ready(function() {
	// temperature count
	$('.devices-status__count').each(function() {
		var minus = $(this).find('.minus');
		var plus = $(this).find('.plus');
		var input = $(this).find('input');
		minus.on('click', function() {
			input.val(Number(input.val()) - 1);
		});
		plus.on('click', function() {
			input.val(Number(input.val()) + 1);
		});
	});
	
	// close app-status
	$('.app-status__close').on('click', function() {
		$('#app-status').removeClass('active');
	});

	// Preview video
	$(window).on('load', function() {
		setTimeout(function() {
			$('.preview-video').css('display', 'none');
		}, 4000);
	}); 
});

