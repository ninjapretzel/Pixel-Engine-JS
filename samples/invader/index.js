
const canvas = document.getElementById("main");
let bgColor = [ 10, 40, 20 ]
const sz = 12;
const w = Math.floor(canvas.width / sz / 2);
const h = Math.floor(canvas.height / sz / 2);
const invaders = []

const vibrant = new InvaderRenderSettings();
vibrant.minFrames = 2; vibrant.maxFrames = 5;
vibrant.minLayers = 2; vibrant.maxLayers = 10;
vibrant.hueChange = .3;
vibrant.minSatChange = 0; vibrant.maxSatChange = 1;
vibrant.minValChange = 0; vibrant.maxValChange = .5;
vibrant.minDeco = 1; vibrant.maxDeco = 1;
vibrant.minAnim = 1; vibrant.maxAnim = 1;

const simple = new InvaderRenderSettings();
simple.minFrames = 2; simple.maxFrames = 4;
simple.minLayers = 1; simple.maxLayers = 2;
simple.minDeco = 1; simple.maxDeco = 2;
simple.minAnim = 1; simple.maxAnim = 4;

const spaz = new InvaderRenderSettings();
spaz.minFrames = 20; spaz.maxFrames = 40;

const vibrantSpaz = new InvaderRenderSettings(vibrant);
vibrantSpaz.minFrames = 20; vibrantSpaz.maxFrames = 40;

const simpleSpaz = new InvaderRenderSettings(simple);
simpleSpaz.minFrames = 20; simpleSpaz.maxFrames = 40;

const setArr = [
	vibrant,
	simple,
	spaz,
	vibrantSpaz,
	simpleSpaz,
	new InvaderRenderSettings()
];

/** @abstract */
class Entity {
	/** @type {Point} */
	position = [0,0]
	/** @type {Sprite} */
	sprite = null
	update(game, delta) { }
	draw(game) {
		if (this.sprite != null) {
			game.drawSprite(this.position, this.sprite);
		}
	}
}

class Invader extends Entity {
	constructor(seed, sets = null) {
		super();
		this.seed = seed;
		this.poses = renderInvaderPoses(seed, sets);
		this.sprite = this.poses[0];
		this.speed = randomInt(1, 3);
		if (Math.random() < .5) { this.speed *= -1; }
		this.framesPerTick = randomInt(5,10);
		this.framesSinceTick = 0;
		this.frame = 0;
	}
	
	update(game, delta) {
		this.framesSinceTick++;
		if (this.framesSinceTick == this.framesPerTick) {
			this.framesSinceTick = 0;
			
			this.frame = (this.frame + 1) % this.poses.length;
			this.sprite = this.poses[this.frame];
			
			this.position.x += this.speed;
			if (this.speed > 0) {
				if (this.position.x > game.width - this.sprite.width) {
					this.position.x = game.width - this.sprite.width;
					this.position.y += 1;
					this.speed *= -1;
				}
			} else {
				if (this.position.x <= 0) {
					this.position.x = 0;
					this.position.y += 1;
					this.speed *= -1;
				}
			}
			
			if (this.position.y > game.height / 2) {
				this.position.y = Math.floor(game.height / 2)
			}
			
		}
		
	}
}

const anim = renderInvaderPoses(12341);
let frame = 0;
let pose = 0;
let delay = 5;
let first = true;


const INTMAX = 2147483647;
class Demo extends Game {
	reset() {
		this.entities = []
		const numInvaders = randomInt(40, 60);
		const seeds = []
		const which = []
		const playerSeed = randomInt(0, INTMAX);
		for (let i = 0; i < numInvaders; i++) {
			seeds[i] = randomInt(0, INTMAX);
			which[i] = randomInt(0, setArr.length);
		}
		for (let i = 0; i < numInvaders; i++) {
			const seed = seeds[i];
			const sets = setArr[which[i]];
			const invader = new Invader(seed, sets);
			invader.position.x = randomInt(0, this.width);
			invader.position.y = randomInt(0, this.height/2);
			this.entities[i] = invader;
		}
		
		
	}
	update() {
		first = false;
		clear(bgColor)
		
		if (this.keyPressed("r")) {
			this.reset();
		}
		
		let pos = mousePos();
		pos.x -= Math.floor(anim[0].width/2)
		pos.y -= Math.floor(anim[0].height/2)
		drawSprite(pos, anim[pose % anim.length]);
		frame++;
		if (frame % delay == 0) {
			pose++;
		}
		
		for (let entity of this.entities) {
			entity.update(this, 1);
		}
		this.entities.sort((a,b)=> {
			if (a.sprite == null) { return -1; }
			if (b.sprite == null) { return 1; }
			const ay = Math.floor(a.position.y + a.sprite.height);
			const by = Math.floor(b.position.y + b.sprite.height);
			return ay - by;
		});
		
		for (let entity of this.entities) {
			entity.draw(this);
		}
		
		this.drawTextCentered([this.width/2, this.height-10], "Press 'R' to generate\n    new invaders", WHITE);
	}
}
	
const game = new Demo(canvas, 3);
game.reset();
