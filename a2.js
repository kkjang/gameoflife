$(function() {
	$("#graph_size_slider").slider({
		value: 20,
		min: 20,
		max: 200,
		slide: function(event, ui) {
        $("#graph_size").val(ui.value);
      }
	});
	var canvas = document.getElementById("game_canvas");
	var ctx = canvas.getContext("2d");
	var size = $("#graph_size").val();
	var cells = null;
	$("#run").on("click", function(){
		size = $("#graph_size").val();
		ctx.clearRect(0,0,canvas.width, canvas.height)
		init();
	});
	canvas.addEventListener("mousedown", clickCell, false);

	function init(){
		cells = new Array(size);
		for(var i = 0; i < size; i++) {
			cells[i] = new Array(size);
		}
		for(var i=0; i < size; i++){
			for(var j=0; j < size; j++){
				cells[i][j] = 0;
			}
		}

		drawGraph();
	}

	function drawGraph(){
		height = canvas.height;
		width = canvas.width;
		cell_height = height / size;
		cell_width = width / size;
		for(var i=0; i < size; i++){
			for(var j=0; j < size; j++){
				ctx.beginPath();
				ctx.rect(i*cell_width,j*cell_height, cell_width, cell_height);
				if (cells[i][j] == 0){
					ctx.stroke();
				}
				else{
					ctx.fill();
				}
			}
		}
	}

	function clickCell(event){
		var x_pos = event.x;
		var y_pos = event.y;

		x_pos -= canvas.offsetLeft;
		y_pos -= canvas.offsetTop;

		var cell_x = Math.floor(x_pos / cell_width);
		var cell_y = Math.floor(y_pos / cell_height);
		ctx.clearRect(cell_x*cell_width, cell_y*cell_height, cell_width, cell_height);
		ctx.beginPath();
		ctx.rect(cell_x*cell_width, cell_y*cell_height, cell_width, cell_height);
		if (cells[cell_x][cell_y] == 0){
			ctx.fill();
		}
		else{
			ctx.stroke();
		}
	}
});
	
