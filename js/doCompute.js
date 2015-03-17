/**
 * doCompute.js
 */
	var slideCount = 0;
	var slideWidth = 0;
	var slideHeight = 0;
	var sliderUIWidth = 0;
	var currentSlide=1;
	
function setDimension(){
	
	$("#matrix_entries").empty();
	
	//	in case we are working with square matrices
	if (($("#operation").val()=="findDet")||($("#operation").val()=="inverse"))
	{
		$("#num_cols").val($("#num_rows").val());
		$("#augmented_cols").val("0");
	}
	
	num_rows=$("#num_rows").val();
	num_cols=$("#num_cols").val();
	augmented_cols =$("#augmented_cols").val();

	//	validate entries
	if ((num_rows<=0) ||(num_cols<=0)|| (augmented_cols<0)||(augmented_cols>num_cols))
		{
		alert("Invalid dimensions. Please review your input.");
		return;
		}

	for (row=1;row<=num_rows;row++)
	{
		for (col=1;col<=num_cols;col++)
		{
			sNewEntryName='entries[]';
			if (col>num_cols-augmented_cols)
			{
				sEntryClass="augmented";
			}
			else
			{
				sEntryClass="entry";
			}
			$("<input/>",{
			//	id: sNewEntryName,
				name: sNewEntryName,
				//pattern: '^[+-]?\\d*(.\\d*)?',
				type: "text",
				class: sEntryClass,
				value: (($("#rdmEntries").val()==1)?Math.floor(Math.random()*4-2):0)
			}).appendTo("#matrix_entries");
		}
		$("#matrix_entries").append("<br/>");
	}
	
	
	$("#dimensionForm").hide();
	$("#matrix_entries_container").show();
}

function initSlider(){
	//	Get slider info
	slideCount = $('#slider div.step').length;
	slideWidth = $('#slider div.step').width();
	slideHeight = $('#slider div.step').height();
	sliderUIWidth = slideCount * slideWidth;
	currentSlide=1;
	
	//	Set Slider width
	$('#outputDiv').css({ width: slideWidth, height: slideHeight });
	$("#slider").css({ width: sliderUIWidth, marginLeft:0,left:0});
	//slideFirst();
}
//form control
function slideLeft(){
	if (currentSlide<slideCount)
	{
		$("#slider").animate({
			left:"-="+slideWidth
		})
		currentSlide++;
	}
	
}

function slideRight(){
	if (currentSlide>1)
	{
		$("#slider").animate({
			left:"+="+slideWidth
		})
		currentSlide--;
	}
}
function slideLast(){
	$("#slider").animate({
		left:-sliderUIWidth+slideWidth
	})
	currentSlide=slideCount;
}
function slideFirst(){
	$("#slider").animate({
		left:0
	})
	currentSlide=1;
}

//	Step control form
//	previous button
$("#previous").click(function(){
	slideRight();
});

//	next button
$("#next").click(function(){
	slideLeft();
});

//	last button
$("#last").click(function(){
	slideLast();
});

//	first button
$("#first").click(function(){
	slideFirst();
});

$("#outputDiv").swipe({
	swipeLeft:function(){slideLeft()},
	swipeRight:function(){slideRight()}
})
$("#startOver").click(function(event){
	event.preventDefault();
	$("#slider").empty();
	$("#inputDiv").show();
	document.getElementById("dimensionForm").reset();
	$("#dimensionForm").show();
	$("#matrix_entries_container").hide();
	$("#computeDiv").hide();
});
$("#modifyEntries").click(function(envent){
	event.preventDefault();
	$("#inputDiv").show();
	$("#matrix_entries_container").show();
	$("#computeDiv").hide();	
});
$(document).keyup(function(event){
	switch (event.which){
		case 37:
			bxSlider.goToPrevSlide();
			break;
		case 39:
			bxSlider.goToNextSlide();
			break;
	}
});

/*	end doCompute.js */