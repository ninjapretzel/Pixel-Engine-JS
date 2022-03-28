
let bgColor = [ 5, 10, 7 ]


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

class Stars {
	stars = []
	update(game) {
	//	console.log("Drawing " + this.stars.length + " stars");
		for (let i = 0; i < this.stars.length; i++) {
			//console.log("star # " + i + " at " + this.stars[i]);
			this.stars[i].y += this.stars[i][2]
			if (this.stars[i].y > game.height) {
				this.stars.remove(this.stars[i]);
				i--;
				//console.log("Removed star");
			}
		}
		if (randomFloat(1) < .4) {
			//console.log("new star");
			this.stars.push([randomInt(0, game.width), 0, randomInt(1, 4)])
		}
	}
	draw(game) {
		for (let i = 0; i < this.stars.length; i++) {
			game.draw(this.stars[i], WHITE);
		}
	}
}

class Invader extends Entity {
	basePos = [ 0, 0 ]
	shake = 0;
	constructor(seed, sets = null) {
		super();
		this.seed = seed;
		this.poses = renderInvaderPoses(seed, sets);
		this.sprite = this.poses[0];
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
		}
		this.position = [...this.basePos]
		if (this.shake > 0) {
			this.shake -= delta;
			this.position.x += Math.floor(6 * this.shake * randomFloat(-1, 1))
			this.position.y += Math.floor(6 * this.shake * randomFloat(-1, 1))
		}
	}
	damaged(dmg) {
		this.shake = .3;
		const text = new DamageText(""+dmg, WHITE);
		text.position = [ game.width/2, game.height/2 ]
		entities.push(text);
		
	}
	dead() {
		player.kills += 1;
		player.awardExp(this.exp);
		spawnNext();
	}
}
class DamageText extends Entity {
	constructor(text, color, outline) {
		super();
		this.text = text;
		this.color = color ?? WHITE;
		this.outline = outline ?? BLACK;
		this.velocity = [ randomFloat(-2, 2), -8 ]
		this.lifeTime = 33;
	}
	draw(game) {
		this.position = this.position.add(this.velocity);
		this.velocity.y += 1;
		game.drawTextCenteredOutline(this.position, this.text, this.color, BLACK);
		this.lifeTime -= 1;
		if (this.lifeTime <= 0) {
			entities.remove(this);
		}
	}
}

let game;
const MAX_SEED = 65535
const RATE = 1;
const ACTION_TIME = 3;
const ACTION_COLOR = [ 200, 150, 100 ]
const EXP_COLOR = [ 200, 100, 200 ]
const HULL_COLOR = [ 200, 100, 100 ]
const SHIELD_COLOR = [ 100, 100, 200 ]

let enemy = new Invader(randomInt(0, MAX_SEED))
let entities = [ enemy ]
let player = {
	mhp: 100, chp: 100, rhp: 0,
	msp: 100, csp: 100, rsp: .5,
	aspd:100,
	atk: 10,
	def: 5,
	action: 0,
	kills: 0,
	level: 1,
	exp: 0,
	tnl: 1000,
	dead() { playerDeath() },
	damaged(dmg) {
		
		const text = new DamageText(""+dmg, RED);
		text.position = floor([ game.width/2, game.height*3/4 ])
		entities.push(text);
	},
	awardExp(exp) {
		this.exp += exp;
		if (this.exp >= this.tnl) {
			this.exp -= this.tnl;
			this.levelUp();
		}
	},
	levelUp() {
		this.level += 1;
		this.tnl += 1000 * this.level;
		this.atk += 4;
		this.def += 2;
		this.msp += 20;
		this.rsp += .5;
		this.aspd += 5
	}
}

function hex(num) {
	let str = "";
	const HEX = "ABCDEF"
	num = Math.floor(num);
	while (num > 0) {
		const d = num % 16;
		num = Math.floor(num / 16);
		if (d < 10) {
			str = d + str;
		} else {
			str = HEX[d-10] + str;
		}
	}
	while (str.length < 4) { str = "0" + str; }
	
	return "0x"+str;
}

function attack(src, target) {
	let damage = src.atk * randomFloat(1, 1.1)
	let minDmg = Math.floor(damage / 10);
	if (minDmg < 1) { minDmg = 1; }
	damage -= target.def;
	damage = floor(damage);
	if (damage < minDmg) { damage = minDmg; }
	const totalDamage = damage;
	
	if (target.csp > 0) {
		if (damage > target.csp) {
			damage -= target.csp;
			target.csp = 0;
			target.chp -= damage;
		} else {
			target.csp -= damage;
		}
	} else {
		target.chp -= damage;
	}
	
	if (target.chp < 0) {
		target.dead();
	}
	target.damaged(totalDamage)
}

let combo = 0;
let base = 1;
function playerDeath() {
	combo = 0;
	spawnNext();
	player.chp = player.mhp;
	player.csp = player.msp;
}
function spawnNext() {
	combo++;
	base = player.level;
	spawn(base + Math.floor(combo / 2));
	
}

function spawn(level = 1) {
	const id = randomInt(0, MAX_SEED);
	entities.remove(enemy);
	enemy = new Invader(id);
	entities.push(enemy);
	enemy.id = hex(id);
	enemy.position = floor([ game.width/2 - enemy.sprite.width/2, game.height/2 - enemy.sprite.height/2 ])
	enemy.basePos = enemy.position
	enemy.level = level;
	enemy.mhp = randomInt(level *  2, level * 4); enemy.chp = enemy.mhp;
	enemy.rhp = 0;
	enemy.msp = randomInt(level * 4, level * 6); enemy.csp = enemy.msp;
	enemy.rsp = randomFloat(level * .1, level * .2);
	enemy.aspd = 75 + randomInt(0, level);
	enemy.atk = randomInt(level * 3, level * 3.5);
	enemy.def = randomInt(level * .2, level * .6);
	enemy.action = 0;
	
	enemy.exp = enemy.mhp 
				+ enemy.msp * 3
				+ enemy.atk * 10
				+ enemy.def * 20
}

function update(unit, delta) {
	delta *= RATE;
	unit.action += unit.aspd / 100 * delta;
	unit.chp += delta * unit.rhp;
	if (unit.chp > unit.mhp) { unit.chp = unit.mhp; }
	unit.csp += delta * unit.rsp;
	if (unit.csp > unit.msp) { unit.csp = unit.msp; }
	
	if (unit.action >= ACTION_TIME) {
		unit.action -= ACTION_TIME;
		return true;
	}
	return false;
}

let stars = new Stars();
class Demo extends Game {
	lastTick = new Date().getTime();
	drawBar(rect, text, fill, fillColor, backColor) {
		backColor ??= BLACK;
		this.fillRect(rect, backColor);
		const f = [ rect.x, rect.y, Math.floor(rect.width * fill), rect.height ]
		this.fillRect(f, fillColor);
		this.drawText([rect.x+1, rect.y+2], text, WHITE);
	}
	
	update() {
		this.clear(bgColor);
		const time = new Date().getTime();
		const delta = (time - this.lastTick) / 1000;
		
		stars.update(this);
		stars.draw(this);
		
		if (update(player, delta)) {
			attack(player, enemy);
		}
		
		if (update(enemy, delta)) {
			attack(enemy, player);
		}
		for (let entity of entities) {
			entity.update(this, delta);
		}
		entities.sort((a,b)=> {
			if (a.sprite == null) { return -1; }
			if (b.sprite == null) { return 1; }
			const ay = Math.floor(a.position.y + a.sprite.height);
			const by = Math.floor(b.position.y + b.sprite.height);
			return ay - by;
		});
		
		const half =  floor( [ this.width/2, this.height/2 ] );
		this.drawTextCentered( [half.x, half.y - 30],  `${enemy.id} Lv.${enemy.level}`, WHITE);
		this.drawBar([0, half.y - 20, half.x, 10], "Hull", enemy.chp/enemy.mhp, HULL_COLOR)
		this.drawBar([half.x, half.y - 20, half.x, 10], "Shield", enemy.csp/enemy.msp, SHIELD_COLOR)
		
		this.drawText([1, 1], "Kills: " + player.kills, WHITE);
		
		this.drawTextCentered( [half.x, this.height-40], `Player Lv.${player.level}`, WHITE);
		this.drawBar([0, this.height-30, half.x, 10], "Hull", player.chp/player.mhp, HULL_COLOR);
		this.drawBar([half.x, this.height-30, half.x, 10], "Shield", player.csp/player.msp, SHIELD_COLOR);
		this.drawBar([0, this.height-20, this.width, 10], "EXP", player.exp/player.tnl, EXP_COLOR);
		this.drawBar([0, this.height-10, this.width, 10], "Action", player.action/ACTION_TIME, ACTION_COLOR);
		
		for (let entity of entities) {
			entity.draw(this);
		}
		
		
		
		this.lastTick = time;
	}
}

const canvas = document.getElementById("main");
game = new Demo(canvas, 4);
spawn();

