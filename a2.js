$(function() {
	var canvas = document.getElementById("game_canvas");
	canvas.textAlign = 'center';
	var ctx = canvas.getContext("2d");
	var size = 20;
	var cells = null;
	var neighbor_radius = 1;
	var outside_neighbor = 'toroid'
	var loneliness = 2;
	var overpopulation = 3;
	var g_min = 3;
	var g_max = 3;
	var run_speed = 100;
	var running = false;
	var refresh_id = null;
	var vectors = generateVectors();
	init();
	$("#graph_size_slider").slider({
		value: 20,
		min: 20,
		max: 200,
		slide: function(event, ui) {
        $("#graph_size").val(ui.value);
      }
	});
	$("#speed_slider").slider({
		value: 100,
		min: 0,
		max: 1000,
		slide: function(event, ui) {
        $("#run_speed").val(ui.value);
        run_speed = ui.value;
      }
	});
	$("#loneliness_slider").slider({
		value: 2,
		min: 1,
		max: overpopulation,
		slide: function(event, ui) {
        $("#loneliness").val(ui.value);
        loneliness = ui.value;
      }
	});
	$("#overpopulation_slider").slider({
		value: 3,
		min: 1,
		max: (4*neighbor_radius*neighbor_radius)+(4*neighbor_radius),
		slide: function(event, ui) {
        $("#overpopulation").val(ui.value);
        overpopulation = ui.value;
        $("#loneliness_slider").slider('option', 'max', overpopulation);
        if (overpopulation < loneliness){
        	$("#loneliness").val(overpopulation);
        	$("#loneliness_slider").slider('option', 'value', overpopulation);
        	loneliness = overpopulation
        }
      }
	});
	$("#generation_slider").slider({
      range: true,
      min: 1,
      max: (4*neighbor_radius*neighbor_radius)+(4*neighbor_radius),
      values: [3, 3],
      slide: function( event, ui ) {
        $("#gen").val(ui.values[0] + " - " + ui.values[1]);
        g_min = ui.values[0];
        g_max = ui.values[1];
      }
    });
    $("#gen").val( $("#generation_slider").slider("values", 0) +
      " - " + $("#generation_slider").slider("values", 1 ));

	$("#neighbor_radius_slider").slider({
		value: 1,
		min: 1,
		max: 10,
		slide: function(event, ui) {
        $("#neighbor").val(ui.value);
        neighbor_radius = ui.value;
        $("#overpopulation_slider").slider('option', 'max', (4*neighbor_radius*neighbor_radius)+(4*neighbor_radius));
        $("#overpopulation_slider").slider('option', 'value', 3);
        $("#generation_slider").slider('option', 'values', [3,3]);
        $("#gen").val(3 + " - " + 3);
        $("#overpopulation").val(3);
        $("#loneliness").val(2);
        $("#loneliness_slider").slider('option', 'value', 2);
        overpopulation = 3;
        loneliness = 2;
        g_min = 3;
        g_max = 3;
		vectors = generateVectors();
      }
	});
	$("#set_settings").on("click", function(){
		running = false;
		size = parseInt($("#graph_size").val());
		init();
	});
	canvas.addEventListener("mousedown", clickCell, false);
	$("#run").on("click", function(){
		running = true;
		refresh_id = setInterval(beginGame, run_speed);
	});
	$("#stop").on("click", function(){
		running = false;
		clearInterval(refresh_id);
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
	$( "#outside_menu" ).selectmenu({
		change: function(event,ui){
			outside_neighbor = ui.item.value;
		}
	});
	$( "#radio1" ).buttonset();
	$( "#radio2" ).buttonset();

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

	function get_cell(x, y){
		var max_x = parseInt(size);
		var max_y = parseInt(size)
		var outside = false;
		if ((x < 0 || x > (max_x-1)) || (y < 0 || y > (max_y-1))){
			outside = true;
		}
		if (!outside){
			return cells[x][y];
		}
		else{
			if (outside_neighbor == 'dead'){
				return 0;
			}
			else if(outside_neighbor == 'alive'){
				return 1;
			}
			else{
				return cells[mod(x, max_x)][mod(y, max_y)];
			}
		}
	}

	function mod(n, m) {
        return ((n % m) + m) % m;
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
		height = canvas.height;
		width = canvas.width;
		cell_height = height / size;
		cell_width = width / size;

		var cell_x = Math.floor(x_pos / (canvas.height / size));
		var cell_y = Math.floor(y_pos / (canvas.width / size));
		ctx.beginPath();
		ctx.rect(cell_x*cell_width, cell_y*cell_height, cell_width, cell_height);
		if (event.shiftKey){
			if (cells[cell_x][cell_y] < 1){
				fill_cell('black');
				cells[cell_x][cell_y] = 1;
			}
			return;
		}
		if (event.ctrlKey){
			if (cells[cell_x][cell_y] > 0){
				fill_cell('green');
				ctx.stroke();
				cells[cell_x][cell_y] = -1;
			}
			return;
		}
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
			if (get_cell(x,y) == 1){
				alive++;
			}
		}
		console.log(alive, cell);
		return determine_status(cell, alive);
	}

	function determine_status(cell, alive){
		var cell_status = cells[cell[0]][cell[1]];
		if (cell_status == 1){
			if (alive < loneliness || alive > overpopulation){
				return -1;
			}
			else{
				return 1;
			}
		}
		else{
			if (alive >= g_min && alive <= g_max){
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
	
