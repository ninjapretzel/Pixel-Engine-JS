/** pixel-engine.js
 * single-file include for the JS version of the Pixel Game Engine (PGE)
 * Loosely based off the One-Lone-Coder Pixel Game Engine */
function pixelate(context){
	context['imageSmoothingEnabled'] = false;       /* standard */
	context['mozImageSmoothingEnabled'] = false;    /* Firefox */
	context['oImageSmoothingEnabled'] = false;      /* Opera */
	context['webkitImageSmoothingEnabled'] = false; /* Safari */
	context['msImageSmoothingEnabled'] = false;     /* IE */
}

/** @typedef {[Number, Number, Number]} Color Colors are specifically an array of [R,G,B] */
/** constant for position of Red component in vector colors */   const R = 0;
/** constant for position of Green component in vector colors */ const G = 1;
/** constant for position of Blue component in vector colors */  const B = 2;
/** Constant for white */   const WHITE = [255,255,255];
/** Constant for black */   const BLACK = [0,0,0];
/** Constant for red */     const RED = [255,0,0];
/** Constant for green */   const GREEN = [0,255,0];
/** Constant for blue */    const BLUE = [0,0,255];
/** Constant for cyan */    const CYAN = [0,255,255];
/** Constant for magenta */ const MAGENTA = [255,0,255];
/** Constant for yellow */  const YELLOW = [255,255,0];
/** @typedef {[Number, Number]} Point Points are specifically an array of [X,Y] */
/** constant for position of X-coord in vectors */ const X = 0;
/** constant for position of Y-coord in vectors */ const Y = 1;

/** TAU > PI. Specifically, TAU = 2 * PI */
const TAU = 2 * Math.PI;
/** Floors the given number or vector
 * @param {Array|number} v number or vector to floor
 * @returns {Array|number} array with all components floored, or floored number */
function floor(v) {
	if (Array.isArray(v)) {
		const result = [];
		for (let i = 0; i < v.length; i++) {
			result[i] = Math.floor(v[i]);
		}
		return result;
	}
	return Math.floor(v); 
}
/** Ceils the given number or vector
 * @param {Array|number} v number or vector to ceil
 * @returns {Array|number} array with all components ceil, or ceil number */
function ceil(v) {
	if (Array.isArray(v)) {
		const result = [];
		for (let i = 0; i < v.length; i++) {
			result[i] = Math.ceil(v[i]);
		}
		return result;
	}
	return Math.ceil(v); 
}
/** Rounds the given number or vector
 * @param {Array|number} v number or vector to round
 * @returns {Array|number} array with all components rounded, or rounded number */
function round(v) {
	if (Array.isArray(v)) {
		const result = [];
		for (let i = 0; i < v.length; i++) {
			result[i] = Math.round(v[i]);
		}
		return result;
	}
	return Math.round(v); 
}
/** Clamps the given number or vector
 * @param {Array|number} v number or vector to clamp
 * @param {Array|number} min minimum of clamp. Must be same type as v
 * @param {Array|number} max maximum of clamp. Must be same type as v
 * @returns {Array|number} array with all components clamped, or clamped number */
function clamp(v,min=0,max=1) { 
	if (Array.isArray(v)) {
		const result = [];
		for (let i = 0; i < v.length; i++) {
			result[i] = clamp(v[i], min[i], max[i]);
		}
		return result;
	}
	return (v < min) ? min : ((v > max) ? max : v); 
}
/** Takes the fractional part of the given number or vector
 * @param {Array|number} v number or vector to frac
 * @returns {Array|number} array with all components frac'd, or frac'd number */
function frac(v) {
	if (Array.isArray(v)) {
		const result = [];
		for (let i = 0; i < v.length; i++) {
			result[i] = v[i]-Math.floor(v[i]);
		}
		return result;
	}
	return v-Math.floor(v); 
}
/** Absolute value's the given number or vector
 * @param {Array|number} v number or vector to abs
 * @returns {Array|number} array with all components abs'd, or abs'd number */
function abs(v) { 
	if (Array.isArray(v)) {
		const result = [];
		for (let i = 0; i < v.length; i++) {
			result[i] = v[i] < 0 ? -v[i] : v[i];
		}
		return result;
	}
	return v < 0 ? -v : v; 
}
/** Returns a random integer
 * @param {number} a First endpoint (required)
 * @param {number} b Second endpoint (defaults to zero)
 * @returns {number} integer in range [a, b) or [0, a)*/
function random(a,b=0) {
	return Math.floor(a + (b-a) * Math.random());
}
/** Helper function that returns the style for a given color
 * @param {Color|number} r Either a packed {Color} or just the red component
 * @param {?number} g green component
 * @param {?number} b blue component */
function style(r,g,b) { 
	if (Array.isArray(r)) { b = r[2]; g = r[1]; r = r[0]; }
	r = floor(r); g = floor(g); b = floor(b);
	return `rgb(${r},${g},${b})`; 
}
/** Helper function to get a style from floating-point RGB colors [0,1] 
 * @param {number} r RED component in [0, 1]
 * @param {number} g GRN component in [0, 1]
 * @param {number} b BLU component in [0, 1]
 * @returns {string} style representing RGB color */
function rgb(r,g,b) { return style(r*255,g*255,b*255); }
/** Helper function to get a style from floating-point HSV colors [0,1]
 * @param {number} h HUE component in [0, 1]
 * @param {number} s SAT component in [0, 1]
 * @param {number} v VAL component in [0, 1]
 * @returns {string} style representing HSV color */
function hsv(h,s,v) {
	h = fmod(h, 1.0);
	if (h < 0) { h += 1.0; }
	if (s == 0) { return rgb(v,v,v); }
	h *= 6.0;
	const i = Math.floor(h);
	const f = h - i;
	const p = v * (1.0-s);
	const q = v * (1.0-s*f);
	const t = v * (1.0 - s * (1.0-f));
	if (i == 0) { return rgb(v,t,p); }
	else if (i == 1) { return rgb(q,v,p); }
	else if (i == 2) { return rgb(p,v,t); }
	else if (i == 3) { return rgb(p,q,v); }
	else if (i == 4) { return rgb(t,p,v); }
	return rgb(v,p,q);
}
/** Variable holding primary game for 'static' functions 
	(so that 'this' can be dropped in more places) */
let mainGame = undefined;

/** Get whether a key has been pressed this frame 
	@param {string} key name of key to check
	@returns {boolean} true if pressed this frame, false otherwise */
function keyPressed(key) { return mainGame.keyPressed(key); }
/** Get whether a key has been held this frame 
	@param {string} key name of key to check
	@returns {boolean} true if held this frame, false otherwise */
function keyHeld(key) { return mainGame.keyHeld(key); }
/** Get whether a key has been released this frame 
	@param {string} key name of key to check
	@returns {boolean} true if released this frame, false otherwise */
function keyReleased(key) { return mainGame.keyReleased(key); }
/** function to clear the canvas with a given color
	@param {Color} c color to clear with*/
function clear(c) { return mainGame.clear(c); }
/** Draws a single pixel in the given color
	can be called with either:
	- `draw(point, color)`
	- `draw(x, y, color)` */
function draw(x,y,c) { return mainGame.draw(x,y,c); }
/** Draws a line between two points, in the given color
	@param {Point} p1 first point
	@param {Point} p2 second point
	@param {Color} c color to draw with */
function drawLine(p1, p2, c) { return mainGame.drawLine(p1, p2, c); }
/** Draws a circle centered on the given point, with the given radius, in the given color
		@param {Point} p point to draw at
		@param {number} r radius to draw with
		@param {Color} c color to draw with */
function drawCircle(p, r, c) { return mainGame.drawCircle(p, r, c); }
/** Draw an empty ellipse centered at a point
	@param {Point} p point to draw around
	@param {number} w width of ellipse
	@param {number} h height of ellipse
	@param {Color} c color to draw with */
function drawEllipse(p, w, h, c) { return mainGame.drawEllipse(p, w, h, c); }


/** Primary class for override when creating a PGE game */
class Game {
	constructor(canvas, pixelScale = 2, fps = 60) {
		if (!canvas.getContext) { return; }
		mainGame = this;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		pixelate(this.ctx);
		pixelScale = floor(pixelScale);
		this.pixelScale = pixelScale;
		this.width = canvas.width / pixelScale;
		this.height = canvas.height / pixelScale;
		console.log("Initialized game", this.width, "x", this.height, "@",pixelScale,"px");
		this.buffer = this.ctx.createImageData(this.canvas.width, this.canvas.height);
		this.keys = {}
		this.lastKeys = {}
		canvas.addEventListener("keydown", (e) => {
			if (this.keys[e.key]) { return; }
			this.keys[e.key] = true;
			// console.log("keydown", e);
		});
		canvas.addEventListener("keyup", (e) => {
			delete this.keys[e.key];
			// console.log("keyup", e);
		});
		
		this.clear([40,80,160]);
		this.refresh = setInterval( ()=>{
			this.tick();
		}, (1000/fps));
		
	}
	/** Get whether a key has been pressed this frame 
		@param {string} key name of key to check
		@returns {boolean} true if pressed this frame, false otherwise */
	keyPressed(key) { return this.keys[key] && !this.lastKeys[key]; }
	/** Get whether a key has been held this frame 
		@param {string} key name of key to check
		@returns {boolean} true if held this frame, false otherwise */
	keyHeld(key) { return this.keys[key]; }
	/** Get whether a key has been released this frame 
		@param {string} key name of key to check
		@returns {boolean} true if released this frame, false otherwise */
	keyReleased(key) { return !this.keys[key] && this.lastKeys[key]; }
	
	/** internal function to run updates with event handling logic */
	tick() {
		// console.log("tick");
		mainGame = this;
		this.update();
		this.lastKeys = this.keys;
		this.keys = {...this.lastKeys};
	}
	/** overridable function for game update logic */
	update() {}
	
	/** function to clear the canvas with a given color
		@param {Color} c color to clear with*/
	clear(c) {
		// for (let y = 0; y < this.canvas.height; y++) {
		// 	for (let x = 0; x < this.canvas.width; x++) {
		// 		const i = (y * this.canvas.width + x) * 4;
		// 		this.buffer.data[i + 0] = c[0];
		// 		this.buffer.data[i + 1] = c[1];
		// 		this.buffer.data[i + 2] = c[2];
		// 		this.buffer.data[i + 3] = 255;
		// 	}
		// }
		this.ctx.fillStyle = style(c);
		this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
	}
	
	/** Draws a single pixel in the given color
		can be called with either:
		draw(point, color)
		- or -
		draw(x, y, color) */
	draw(x, y, c) {
		if (!c) { this.draw(x[0], x[1], y); return; }
		x = Math.floor(x);
		y = Math.floor(y);
		this.ctx.fillStyle = style(c);
		const ps = this.pixelScale;
		this.ctx.fillRect(x * ps, y * ps, ps,ps);
	}
	
	/** Draws a line between two points, in the given color
		@param {Point} p1 first point
		@param {Point} p2 second point
		@param {Color} c color to draw with */
	drawLine(p1,p2,c) {
		p1 = floor(p1);
		p2 = floor(p2);
		let x, y, xe, ye, i;
		const dx = p2[0] - p1[0]; 
		const dy = p2[1] - p1[1];
		const dx1 = abs(dx); 
		const dy1 = abs(dy);
		let px = 2 * dy1 - dx1;
		let py = 2 * dx1 - dy1;
		if (dy1 <= dx1) { 
			if (dx >= 0) { x = p1[0]; y = p1[1]; xe = p2[0]; } 
			else { x = p2[0]; y = p2[1]; xe = p1[0]; }
			
			this.draw(x,y,c);
			
			for (i = 0; x < xe; i++) {
				x += 1;
				if (px < 0) { px += 2 * dy1; }
				else {
					if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) { y += 1; }
					else { y -= 1; }
					px += 2 * (dy1 - dx1);
				}
				this.draw(x, y, c);
			}
		} else {
			if (dy >= 0) { x = p1[0]; y = p1[1]; ye = p2[1]; }
			else { x = p2[1]; y = p2[1]; ye = p1[1]; }
			
			this.draw(x, y, c);
			for (i = 0; y < ye; i++) {
				y += 1;
				if (py <= 0) { py += 2 * dx1; }
				else {
					if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) { x += 1; }
					else { x -= 1; }
					py += 2 * (dx1 - dy1);
				}
				this.draw(x, y, c);
			}
		}
			
	}
	
	/** Draws a circle centered on the given point, with the given radius, in the given color
		@param {Point} p point to draw at
		@param {number} r radius to draw with
		@param {Color} c color to draw with */
	drawCircle(p, r, c) {
		p = floor(p);
		r = floor(r);
		let x0 = 0;
		let y0 = r;
		let d = 3 - 2 * r;
		
		if (r == 0) { return; }
		
		while (y0 >= x0) {
			this.draw(p[0] - x0, p[1] - y0, c);
			this.draw(p[0] - y0, p[1] - x0, c);
			this.draw(p[0] + y0, p[1] - x0, c);
			this.draw(p[0] + x0, p[1] - y0, c);
			this.draw(p[0] - x0, p[1] + y0, c);
			this.draw(p[0] - y0, p[1] + x0, c);
			this.draw(p[0] + y0, p[1] + x0, c);
			this.draw(p[0] + x0, p[1] + y0, c);
			
			if (d < 0) { d += 4 * x0 + 6; x0++}
			else { d += 4 * (x0 - y0) + 10; x0++; y0--; }
		}
	}
	
	/** Draw an empty ellipse centered at a point
		@param {Point} p point to draw around
		@param {number} w width of ellipse
		@param {number} h height of ellipse
		@param {Color} c color to draw with */
	drawEllipse(p, w, h, c) {
		p = floor(p);
		if (w == 0 || h == 0) { return; }
		let a2 = w*w;
		let b2 = h*h;
		let fa2 = 4 * a2;
		let fb2 = 4 * b2;
		let sigma = 2 * b2 + a2 * (1 - 2 * h);
		let x,y;
		x = 0; y = h;
		for (; b2 * x <= a2 * y; x ++) {
			this.draw(p[X] + x, p[Y] + y, c);
			this.draw(p[X] - x, p[Y] + y, c);
			this.draw(p[X] + x, p[Y] - y, c);
			this.draw(p[X] - x, p[Y] - y, c);
			if (sigma >= 0) { sigma += fa2 * (1 - y); y--; }
			sigma += b2 * ((4 * x) + 6);
		}
		
		sigma = 2 * a2 + b2 * (1 - 2 * w);
		x = w; y = 0;
		for (; a2 * y < b2 * x; y++) {
			this.draw(p[X] + x, p[Y] + y, c);
			this.draw(p[X] - x, p[Y] + y, c);
			this.draw(p[X] + x, p[Y] - y, c);
			this.draw(p[X] - x, p[Y] - y, c);
			if (sigma >= 0) { sigma += fb2 * (1 - x); x-- }
			sigma += a2 * ((4 * y) + 6);
		}
	}
	
}
