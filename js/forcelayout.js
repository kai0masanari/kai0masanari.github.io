var main = function (){
	'use strict'
	var init_dom_action, draw_function;
	var get_distance;
	
	
	
	init_dom_action = function(){
		$( '#myCanvas' ).get( 0 ).width = $( window ).width();
		$( '#myCanvas' ).get( 0 ).height = $( window ).height();
	}
	
	draw_function = function(){
		'use strict'
		var	dras_nodes, draw_stroke, node_relax;
		
		var node_width = 100;
		var distance = 300;
		var bounce = 0.08;
		var attenuation = 0.7;
		var coulomb = 680;
		var gravity = 0.04;
	
		
	}
	
	
	//get distance between two points
	get_distance = function(c_position_x, c_position_y, b_position_x, b_position_y){
		var distance = Math.sqrt(Math.pow(c_position_x - b_position_x, 2)+Math.pow(c_position_y - b_position_y, 2));
		return distance; 
	}
	
	
	
	init_dom_action();
}


$(function(){
	main();
});