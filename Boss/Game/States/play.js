var play = {

	preload: function(){},

	create: function(){
		this.createMap();
		this.createBogdan();
		this.createEnemies();
		this.showLife();

		game.camera.follow(bogdan);
	},

	update: function(){
		this.checkCollitions();
		this.processInput();
		this.processEnemyMovement();
		this.checkLose();
	},

	render: function(){
		game.debug.body(bogdan);
	},

	//-----------------------------------------

	createMap: function(){
		//var background =  game.add.tilemap('background');
		game.add.sprite(80, 0, 'background');

		map = game.add.tilemap('map');
		map.addTilesetImage('Tiles_32x32');
		map.setCollisionBetween(1, 12);
		
		layer = map.createLayer(0);
  		layer.resizeWorld();
  		layer.debugSettings.forceFullRedraw = true;
	},	

	createBogdan: function(){
		bogdan = new Knight(game, 50, 500, 'knight');	  
	},

	createEnemies: function(){
		enemies = game.add.group();

		var data = game.cache.getJSON('level_0');

		data.forEach(function(e){
			switch(e.type){
				case 'mummy'   : enemies.add(new Mummy(game, e.x, e.y, 'mummy'));       break;
				case 'zombie'  : enemies.add(new Zombie(game, e.x, e.y, 'zombie'));     break;
				case 'skeleton': enemies.add(new Skeleton(game, e.x, e.y, 'skeleton')); break;
				case 'dragon'  : enemies.add(new Dragon(game, e.x, e.y, 'dragon'));     break;
				case 'slime'   : enemies.add(new Slime(game, e.x, e.y, 'slime'));
			}
  		});
	},

	//-------------------------------------

	checkCollitions: function(){
		game.physics.arcade.collide(bogdan, layer);
		game.physics.arcade.collide(enemies, layer);
		game.physics.arcade.overlap(bogdan, enemies, this.processOverlap);
	},

	processInput: function(){
		bogdan.processInput(cursors, spacebar, ctrl);
	},

	processEnemyMovement: function(){
		enemies.forEach(function(e){ e.processMovement(); });
	},

	processOverlap: function(bodgan, e){
		text.setText('Life: ' + bogdan.getLife());

		var emitter = game.add.emitter(0, 0, 100);
		emitter.makeParticles('pixel');
		emitter.gravity = 200;
		emitter.x = e.x;
		emitter.y = e.y;

		if (bogdan.body.velocity.y > 0) {
			bogdan.bounce();
      		e.kill();
      		emitter.start(true, 2000, null, 10);
    	}else{
    		bogdan.life -= 1;
    		//game.plugins.screenShake.shake(5);
    		bogdan.bounceBack();
    	}
	},

	checkLose: function(){
		if(bogdan.isDead()){
            game.state.start('gameover');
		}
	},

	showLife: function(){
    	text = game.add.text(2, 1, "Life: " + bogdan.getLife(), { font: "32px Courier", fill: "#ffffff" });
    	text.fixedToCamera = true;
  	}

};