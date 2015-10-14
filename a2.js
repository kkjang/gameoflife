$(function() {
	var canvas = document.getElementById("game_canvas");
	var ctx = canvas.getContext("2d");
	var size = 20;
	var cells = null;
	var neighbor_radius = 1;
	var running = false;
	var vectors = generateVectors();
	$("#graph_size_slider").slider({
		value: 20,
		min: 20,
		max: 200,
		slide: function(event, ui) {
        $("#graph_size").val(ui.value);
      }
	});
	$("#neighbor_radius_slider").slider({
		value: 1,
		min: 1,
		max: 10,
		slide: function(event, ui) {
        $("#neighbor_radius").val(ui.value);
        neighbor_radius = $("#neighbor_radius").val();
		vectors = generateVectors();
      }
	});
	$("#set_settings").on("click", function(){
		running = false;
		size = $("#graph_size").val();
		init();
	});
	canvas.addEventListener("mousedown", clickCell, false);
	$("#run").on("click", function(){
		running = true;
		setInterval(beginGame, 100);
	});
	$("#stop").on("click", function(){
		running = false;
	});
	$("#step").on("click", function(){
		if (running == false){
			step();
		}
	});
	$("#randomize_grid").on("click", function(){
		if (running == false){
			randomize_grid();
		}
	});

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
		ctx.clearRect(0,0,width, height);
		cell_height = height / size;
		cell_width = width / size;
		for(var i=0; i < size; i++){
			for(var j=0; j < size; j++){
				ctx.beginPath();
				ctx.rect(i*cell_width,j*cell_height, cell_width, cell_height);
				if (cells[i][j] == 0){
					ctx.stroke();
				}
				else if(cells[i][j] == -1){
					fill_cell('green');
					ctx.stroke();
				}
				else{
					fill_cell('black');
				}
			}
		}
	}

	function fill_cell(color){
		ctx.fillStyle = color;
		ctx.fill();
	}

	function randomize_grid(){
		var random_int = null;
		cells = new Array(size);
		for(var i = 0; i < size; i++) {
			cells[i] = new Array(size);
		}
		for(var i=0; i < size; i++){
			for(var j=0; j < size; j++){
				var random_int = Math.round(Math.random());
				console.log(random_int);
				cells[i][j] = random_int;
			}
		}
		drawGraph();
	}

	function clickCell(event){
		var x_pos = event.x;
		var y_pos = event.y;

		x_pos -= canvas.offsetLeft;
		y_pos -= canvas.offsetTop;

		var cell_x = Math.floor(x_pos / (canvas.height / size));
		var cell_y = Math.floor(y_pos / (canvas.width / size));
		ctx.beginPath();
		ctx.rect(cell_x*cell_width, cell_y*cell_height, cell_width, cell_height);
		if (cells[cell_x][cell_y] < 1){
			fill_cell('black');
			cells[cell_x][cell_y] = 1;
		}
		else{
			fill_cell('green');
			ctx.stroke();
			cells[cell_x][cell_y] = -1;
		}
		console.log(cell_x, cell_y);
	}

	function step(){
		running = true;
		beginGame();
		running = false;
	}

	function beginGame(){
		if (running == true){
			var new_grid = new Array(size);
			for(var i = 0; i < size; i++) {
				new_grid[i] = new Array(size);
			}
			for(var i=0; i < size; i++){
				for(var j=0; j < size; j++){
					new_grid[i][j] = findNeighbors([i, j]);
				}
			}
			cells = new_grid.slice();
			drawGraph();
		}
	}

	function findNeighbors(cell){
		var alive = 0;
		for (var i=0;i < vectors.length; i++){
			var vector = vectors[i];
			var x = cell[0] + vector[0];
			var y = cell[1] + vector[1];
			if ((x > 0 && x < size) && (y > 0 && y < size)){
				if (cells[x][y] == 1){
					alive++;
				}
			} 
		}
		console.log(alive, cell);
		return determine_status(cell, alive);
	}

	function determine_status(cell, alive){
		var cell_status = cells[cell[0]][cell[1]];
		if (cell_status == 1){
			if (alive == 3){
				return 1;
			}
			if (alive < 2 || alive > 3){
				return -1;
			}
			else{
				return 1;
			}
		}
		else{
			if (alive == 3){
				return 1;
			}
			else{
				return cell_status;
			}
		}
	}

	function generateVectors(){
		var new_vectors = new Array();
		for (var i=-1*neighbor_radius; i <= neighbor_radius; i++){
			for (var j=-1*neighbor_radius; j<= neighbor_radius; j++){
				if ((i != 0) || (j != 0)){
					new_vectors.push([i,j]);
				}
			}
		}
		return new_vectors;
	}
});
	
