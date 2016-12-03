var main = function (){
	'use strict'
	
	//functions
	var init_dom_action, init_nodes, draw_function;
	var get_distance;
	
	//const
	var canvas_w = $( window ).width();
	var canvas_h = $( window ).height();
	var node_width = 100;
	
	//varialbes
	/*ばねモデル表示関連*/
	var nodeObj = new Object(),
		linkObj = new Object();
	var nodes = [], //nodeObjを格納する配列
		users = [], //コンテンツリスト
		edges = [], //ノード間のリンク
		nodes_img = []; //ノードのイメージ
	var dragging = false,
		dragging_name = "";
	
	
	
	
	init_dom_action = function(){
		$('#myCanvas').get(0).width = canvas_w;
		$('#myCanvas').get(0).height = canvas_h;
	}
	
	init_nodes = function(){
		users = ["GitHub","About me","工事中"];
		
		nodeObj["GitHub"] =  {id: "GitHub", x: Math.floor(Math.random()*canvas_w), y: Math.floor(Math.random()*canvas_h), url: "https://github.com/kai0masanari", img: "img/hakodock.png", dx:0, dy:0};
		nodeObj["About me"] =  {id: "About me", x: Math.floor(Math.random()*canvas_w), y: Math.floor(Math.random()*canvas_h), url: "", img: "img/hakodock.png", dx:0, dy:0};
		nodeObj["工事中"] =  {id: "工事中", x: Math.floor(Math.random()*canvas_w), y: Math.floor(Math.random()*canvas_h), url: "", img: "img/hakodock.png", dx:0, dy:0};
		
		nodes.push(nodeObj[0]);
		nodes.push(nodeObj[0]);
		nodes.push(nodeObj[0]);
		
		linkObj[0] = {from: "GitHub", to: "About me", len: 0, group: true}
		edges.push(linkObj[0]);
	}
	
	draw_function = function(){
		'use strict'
		
		//functions
		var	draw_nodes, draw_stroke, node_relax;
		
		//const
		var distance = 300;
		var bounce = 0.08;
		var attenuation = 0.7;
		var coulomb = 680;
		var gravity = 0.04;
		
		//varibales
		var canvas = $('#myCanvas').get(0);
		var canvasCtx = canvas.getContext('2d');
		
		var drawGraphics = function(){
			//clean
			canvasCtx.clearRect(0, 0, canvas_w, canvas_h);
		
			//draw forcelayout
			draw_stroke();
			draw_nodes();
			node_relax();
		}
		
		draw_stroke = function(){
			if(edges.length != 0　&& nodes.length != 0){
				for(var i=0; i<edges.length; i=(i+1)|0){
					var x1,x2,y1,y2;
					x1 = nodeObj[edges[i].from].x + node_width/2;
					y1 = nodeObj[edges[i].from].y + node_width/2;
					
					x2 = nodeObj[edges[i].to].x　+ node_width/2;
					y2 = nodeObj[edges[i].to].y + node_width/2;
				
					canvasCtx.beginPath();
					canvasCtx.moveTo(x1, y1);
					canvasCtx.lineTo(x2, y2);
					canvasCtx.closePath();
					canvasCtx.stroke();
				}
			}
		}
	
		draw_nodes = function(){
			if(nodes.length != 0){
				for(var i=0; i<users.length; i=(i+1)|0){
					var width,
						height;
						
					//nodes_img[users[i]].src = "img/hakodock.png";
					var img = new Image();
					img.src = nodeObj[users[i]].img;
					width = node_width;
					height = node_width;
						
					canvasCtx.font = "20px 'Arial'";
					canvasCtx.fillText(nodeObj[users[i]].id, nodeObj[users[i]].x+width,nodeObj[users[i]].y);
					canvasCtx.drawImage(img, nodeObj[users[i]].x, nodeObj[users[i]].y, width, height);
				}
			}
		}
	
		node_relax = function(){
			if(edges.length != 0){
			
				for(var i=0; i<users.length; i=(i+1)|0){
					var fx = 0, fy = 0;
					for(var j=0; j<users.length; j=(j+1)|0){
					
						var distX = (nodeObj[users[i]].x + node_width/2) - (nodeObj[users[j]].x + node_width/2);
						var distY = (nodeObj[users[i]].y + node_width/2) - (nodeObj[users[j]].y + node_width/2);
						var rsq = distX * distX + distY *distY;
					
						if(distX.isNaN || distY.isNaN){
							rsq = 0;
						}
					
						var rsq_round = rsq*100;
						rsq = rsq_round/100;
					
						var coulombdist_x = coulomb * distX;
						var coulombdist_y = coulomb * distY;
						var coulombdist_round_x = coulombdist_x*100;
						var coulombdist_round_y = coulombdist_y*100;
						coulombdist_x = coulombdist_round_x/100;
						coulombdist_y = coulombdist_round_y/100;
					
						if(rsq != 0 && Math.sqrt(rsq) < distance) {
							fx += coulombdist_x / rsq ;
							fy += coulombdist_y / rsq ;
						}
					}
				
					//gravity : node - central
					var distX_c=0,distY_c=0;
					distX_c = canvas_w/2 - (nodeObj[users[i]].x + node_width/2);
					distY_c = canvas_h/2 - (nodeObj[users[i]].y + node_width/2);
					fx += gravity *distX_c;
					fy += gravity *distY_c;
				
					//node in group : from - to
					for(var j=0; j<edges.length; j=(j+1)|0){
						var distX=0,distY=0;
						if(edges[j].group) {
							if (users[i] == edges[j].from) {
								distX = nodeObj[edges[j].to].x - nodeObj[users[i]].x;
								distY = nodeObj[edges[j].to].y - nodeObj[users[i]].y;
							} else if (users[i] == edges[j].to) {
								distX = nodeObj[edges[j].from].x - nodeObj[users[i]].x;
								distY = nodeObj[edges[j].from].y - nodeObj[users[i]].y;
							}
						}
						fx += bounce *distX;
						fy += bounce *distY;
					}
				
					var _dx = (nodeObj[users[i]].dx + fx) * attenuation;
					var _dy = (nodeObj[users[i]].dy + fy) * attenuation;
				
					if(!( _dy.isNaN || _dx.isNaN)){
						nodeObj[users[i]].dx = _dx;
						nodeObj[users[i]].dy = _dy;
					}

					nodeObj[users[i]].x += nodeObj[users[i]].dx;
					nodeObj[users[i]].y += nodeObj[users[i]].dy;
				
				}			
			}
		}
	
		canvas.addEventListener('mousedown', onDown, false);
		canvas.addEventListener('mousemove', onMove, false);
		canvas.addEventListener('mouseup', onUp, false);
		canvas.addEventListener('dblclick', onDouble, false);
		
	
		setInterval(drawGraphics, 50);
	}
	
	function onDouble(e){
		if(users.length != 0){
			for(var i=0; i<users.length; i=(i+1)|0){
				var i_width;
				var i_height;
				if(nodeObj[users[i]].type){
					i_width = hu_width;
					i_height = hu_height;
				}else{
					i_width = en_width;
					i_height = en_height;
				}
				console.log(i_width);
				if((e.pageX > nodeObj[users[i]].x && e.pageX < nodeObj[users[i]].x+i_width) &&
					(e.pageY > nodeObj[users[i]].y && e.pageY < nodeObj[users[i]].y+i_height)){
					/*
					if(nodeObj[users[i]].unchor){
						nodeObj[users[i]].unchor = false;
					}else{
						nodeObj[users[i]].unchor = true;
					}*/
					break;
				}
			}
		}
	}

	//クリックイベント2
	function onDown(e){
		console.log("onDowned");	
	
		if(users.length != 0){
			for(var i=0; i<users.length; i=(i+1)|0){
				var i_width = node_width,
					i_height = node_width;
			
				if((e.offsetX > nodeObj[users[i]].x && e.offsetX < nodeObj[users[i]].x+i_width) &&
					(e.offsetY > nodeObj[users[i]].y && e.offsetY < nodeObj[users[i]].y+i_height)){
					dragging_name = users[i];
					dragging = true;
					console.log("hoge");
					break;
				}
			}
		}
	}

	//ドラッグイベント
	function onMove(e){
		if(dragging){
			var i_width = node_width,
				i_height = node_width;

			nodeObj[dragging_name].x = e.offsetX-i_width/2;
			nodeObj[dragging_name].y = e.offsetY-i_height/2;	
		}
	}

	//ドラッグ終了イベント
	function onUp(e){
		dragging = false;
	}
		
		
	//get distance between two points
	get_distance = function(c_position_x, c_position_y, b_position_x, b_position_y){
		var distance = Math.sqrt(Math.pow(c_position_x - b_position_x, 2)+Math.pow(c_position_y - b_position_y, 2));
		return distance; 
	}

	
	init_nodes();
	init_dom_action();
	draw_function();
}


$(function(){
	main();
});