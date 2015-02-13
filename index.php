<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>

<link href="css/style.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
<script type="text/javascript">
// function createMatrix(){}

var matrix = function(){
	
	this.num_rows=0;
	this.num_cols=0;
	this.isSquare=false;
	this.isAugmented=false;
	this.entries = [];
	
	function setEntries(){
		this.entries = [this.num_rows][this.num_cols];
	}
	
	function displayMatrix(){
		
	}
	
	interchangeRows: function(firstrow,secondrow){
		
	}
	
	addRowMultiple: function(firstrow,secondrow,multiplier){
		
	}
	
	multiplyRow: function(row,multiplier){
		for (col=1;col<=num_cols;col++)
		{
			this.entries[row][col]*=multiplier;
		}
	}
}
</script>
</head>
<body>
<form name="matrix_dim" id="matrix_dim" action="">
<input type="text" name="num_rows" id="num_rows" class="entry" value="1"/>\(\times\)<input type="text" name="num_cols" id="num_cols" class="entry" value="1"/><br/><br>
Augemented Rows: <input type="text" name="augmentedRows" id="augmentedRows" value="0"/><br/>
<button type="submit">Set dimension</button>
</form><br/>
<form name="frmMatrix" id="frmMatrix" method="post" action="doCompute.php">
<div id="matrix_entries">

</div>
<select name="operationType">
<option value="Gauss">Gauss elimination</option>
<option value="Gauss-Jordan">Gauss-Jordan elimination</option>
<option value="findDet">Determinant</option>
<option value="inverse">Inverse</option>
</select>
<button type="submit">Submit</button>
</form>
<script type="text/javascript">
$("#matrix_dim").submit(function(event){
	event.preventDefault();
	$("#matrix_entries").empty();
	num_rows=$("#num_rows").val();
	num_cols=$("#num_cols").val();
	augmented_rows =$("#augmentedRows").val();
	$("<input/>",{
		id: "augmented_rows",
		name: "augmented_rows",
		type: "hidden",
		value: augmented_rows
	}).appendTo("#matrix_entries");

	for (row=1;row<=num_rows;row++)
	{
		for (col=1;col<=num_cols;col++)
		{
			sNewEntryName="e["+row+"]["+col+"]";
			if (col>num_cols-augmented_rows)
			{
				sEntryClass="augmented";
			}
			else
			{
				sEntryClass="entry";
			}
			$("<input/>",{
				id: sNewEntryName,
				name: sNewEntryName,
				//pattern: '^[+-]?\\d*(.\\d*)?',
				type: "text",
				class: sEntryClass,
				value: "0"
			}).appendTo("#matrix_entries");
		}
		$("#matrix_entries").append("<br/>");
	}
})
</script>
</body>
</html>