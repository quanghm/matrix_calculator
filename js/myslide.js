
	var slideCount = $('#slider div').length;
	var slideWidth = $('#slider div').width();
	var slideHeight = $('#slider div').height();
	var sliderUlWidth = slideCount * slideWidth;
function initSlider(){	
	$('#outputDiv').css({ width: slideWidth, height: slideHeight });
	
	$('#slider').css({ width: sliderUlWidth, marginLeft: - slideWidth });
	$("#slider").children().css({display:block});
}

//    $('#outputDiv p:last-child').prependTo('#outputDiv');

function moveLeft() {
	$('#outputDiv span').animate({
		left: + slideWidth
	}, 200, function () {
		//$('#outputDiv p:last-child').prependTo('#outputDiv');
		$('#outputDiv span').css('left', '');
	});
};

function moveRight() {
	$('#outputDiv span').animate({
		left: - slideWidth
	}, 200, function () {
	   // $('#slider ul li:first-child').appendTo('#slider ul');
		$('#outputDiv span').css('left', '');
	});
};

$('a.control_prev').click(function () {
	moveLeft();
});

$('a.control_next').click(function () {
	moveRight();
});
