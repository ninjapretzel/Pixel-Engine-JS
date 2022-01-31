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

/** @typedef {[Number, Number, Number, Number?]} Color Colors are specifically an array of [R,G,B,A?] */
/** constant for position of Red component in vector colors */   const R = 0;
/** constant for position of Green component in vector colors */ const G = 1;
/** constant for position of Blue component in vector colors */  const B = 2;
/** constant for position of Alpha component in vector colors */  const A = 3;
/** Constant for white */   const WHITE = [255,255,255];
/** Constant for black */   const BLACK = [0,0,0];
/** Constant for red */     const RED = [255,0,0];
/** Constant for green */   const GREEN = [0,255,0];
/** Constant for blue */    const BLUE = [0,0,255];
/** Constant for cyan */    const CYAN = [0,255,255];
/** Constant for magenta */ const MAGENTA = [255,0,255];
/** Constant for yellow */  const YELLOW = [255,255,0];
/** Constant for transparent */ const TRANSPARENT = [0,0,0,0];
/** @typedef {[Number, Number]} Point Points are specifically an array of [X,Y] */
/** constant for position of X-coord in vectors */ const X = 0;
/** constant for position of Y-coord in vectors */ const Y = 1;
/** @typedef {[number, number, number, number]} Rect rectangle in [X,Y,W,H] form */
/** constant for position of width in rectangle  */ const W = 2;
/** constant for position of height in rectangle */ const H = 3;

/** Class for representing sprite data */
class Sprite {
	/** sets up a new w x h sprite with _the same_ transparent Color in every spot */
	constructor(w, h) {
		this.width = w;
		this.height = h;
		this.pixels = [];
		const transparent = [0,0,0,0];
		for (let i = 0; i < w*h; i++) {
			this.pixels[i] = transparent;
		}
	}
	/** Gets the size of this sprite as a Point */
	get size() { return [this.w,this.h]; }
	/** Gets the number of pixels in this sprite */
	get length() { return this.w * this.h; }
	/** Gets the color at position (x,y) */
	pixel(x, y) {
		const i = x + y * this.width;
		if (i < 0 || i >= this.length) {
			throw new Error(`Pixel at ${x},${y} is out of bounds for size ${this.length}`);
		}
		return this.pixels[i]; 
	}
	/** sets the color at (x,y) to be color c */
	setPixel(x, y, c) {
		const i = x + y * this.width;
		if (i < 0 || i >= this.length) {
			throw new Error(`Pixel at ${x},${y} is out of bounds for size ${this.length}`);
		}
		this.pixels[i] = c;
	}
}

/** Class for representing 'paletted' sprite data */
class PalettedSprite {
	/** sets up a new w x h sprite with the given palette */
	constructor(w, h, palette, data = null) {
		this.width = w;
		this.height = h;
		if (data) {
			if (data.length != w*h) { throw new Error("PaletteSprite data must be w*h in length!"); }
			this.data = data;
		} else {
			this.data = []
			for (let i = 0; i < this.length; i++) { this.data[i] = 0; }
		}
		this.palette = palette;
	}
	/** Gets the size of this sprite as a Point */
	get size() { return [this.w,this.h]; }
	/** Gets the number of pixels in this sprite */
	get length() { return this.w * this.h; }
	/** Gets the color at position (x,y) */
	pixel(x, y) {
		const i = x + y * this.width;
		if (i < 0 || i >= this.length) {
			throw new Error(`Pixel at ${x},${y} is out of bounds for size ${this.length}`);
		}
		const b = this.data[i];
		if (!b) { return TRANSPARENT; }
		return this.palette[b];
	}
	/** Sets the pixel at (x,y) to use color index ci */
	setIndex(x, y, ci) {
		const i = x + y * this.width;
		if (i < 0 || i >= this.length) {
			throw new Error(`Pixel at ${x},${y} is out of bounds for size ${this.length}`);
		}
		this.data[i] = (Math.floor(ci) % 255);
	}
	
}
/** Loads a PNG from a URL into a single Sprite 
	@param {string} url URL to load
	@returns {Sprite} sprite loaded from URL */
async function loadPNG(url) {
	if (!UPNG) { 
		throw new Error("You must include UPNG.js to support loading PNG files!");
	}
	const resp = await fetch(url);
	const buffer = await resp.arrayBuffer();
	const img = UPNG.decode(buffer);
	const rgba = UPNG.toRGBA8(img)[0];
	const bytes = new Uint8Array(rgba);
	
	const w = img.width;
	const h = img.height;
	const spr = new Sprite(w, h);
	// console.log(rgba.isView())
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const i = (y * w + x) * 4;
			const r = bytes[i+0];
			const g = bytes[i+1];
			const b = bytes[i+2];
			const a = bytes[i+3];
			const pix = [r,g,b,a];
			spr.setPixel(x, y, pix);
		}
	}
	return spr;
}

/** Class representing a font for rendering text in */
class Font {
	/** Constructs a new font with the given glyph dictionary
	 @param {{string:Sprite}} glyphs sprite glyphs to use for the font */
	constructor(glyphs) {
		this.glyphs = glyphs;
		let max = 0;
		for (let key in glyphs) {
			if (glyphs[key].height > max) { max = glyphs[key].height; }
		}
		this.charHeight = max;
	}
	/** Measures the given text in pixels 
	 @param {string} text Text to measure
	 @returns {Point} point containing size like [width,height] */
	measure(text) {
		let rx = 0;
		let ry = this.charHeight;
		let x = 0;
		for (let i = 0; i < text.length; i++) {
			char = text[i];
			if (c === '\n') {
				x = 0; 
				ry += this.charHeight;
			} else {
				x += this.glyphs[c].width;
				if (x > rx) { rx = x; }
			}
		}
		return [rx, ry];
	}
}
/** Loads a font where all glyphs are the same size 
 @param {string} url location of font asset
 @param {number} w width of font glyphs
 @param {number} h height of font glyphs
 @returns {Font} loaded font object */
async function loadFixedFont(url, w, h) {
	const spr = await loadPNG(url);
	const start = ' '.charCodeAt(0);
	const glyphs = {}
	for (let c = start; c < 128; c++) {
		const fontChar = new Sprite(w,h);
		
		const x = (c - 32) % 16; // 16 chars per line
		const y = Math.floor( (c - 32) / 16);
		
		for (let i = 0; i < w; i++) {
			for (let k = 0; k < h; k++) {
				fontChar.setPixel(i, k, spr.pixel(x*8+i, y*8+k));
			}
		}
		
		glyphs[String.fromCharCode(c)] = fontChar;
	}
	return new Font(glyphs);
}
/** Loads the default "Retro" font 
 @returns {Font} Retro font */
async function loadRetroFont() { 
	return await loadFixedFont("/fonts/Retro.png", 8, 8); 
}

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
function random(a,b=0) { return Math.floor(a + (b-a) * Math.random()); }
/** Helper function that returns the style for a given color
 * @param {Color|number} r Either a packed {Color} or just the red component
 * @param {?number} g green component
 * @param {?number} b blue component */
function style(r,g,b,a=1.0) { 
	if (Array.isArray(r)) { 
		a = (r[3]==undefined ? 1.0 : r[3]);
		b = r[2]; g = r[1]; r = r[0]; 
	}
	if (a > 1.0) { a /= 255; }
	r = floor(r); g = floor(g); b = floor(b);
	return `rgba(${r},${g},${b},${a})`; 
}
/** Helper function to get a style from floating-point RGB colors [0,1] 
 * @param {number} r RED component in [0, 1]
 * @param {number} g GRN component in [0, 1]
 * @param {number} b BLU component in [0, 1]
 * @returns {string} style representing RGB color */
function rgb(r,g,b,a=1.0) { return style(r*255,g*255,b*255,a); }
/** Helper function to get a style from floating-point HSV colors [0,1]
 * @param {number} h HUE component in [0, 1]
 * @param {number} s SAT component in [0, 1]
 * @param {number} v VAL component in [0, 1]
 * @returns {string} style representing HSV color */
function hsv(h,s,v,a=1.0) {
	h = fmod(h, 1.0);
	if (h < 0) { h += 1.0; }
	if (s == 0) { return rgb(v,v,v,a); }
	h *= 6.0;
	const i = Math.floor(h);
	const f = h - i;
	const p = v * (1.0-s);
	const q = v * (1.0-s*f);
	const t = v * (1.0 - s * (1.0-f));
	if (i == 0) { return rgb(v,t,p,a); }
	else if (i == 1) { return rgb(q,v,p,a); }
	else if (i == 2) { return rgb(p,v,t,a); }
	else if (i == 3) { return rgb(p,q,v,a); }
	else if (i == 4) { return rgb(t,p,v,a); }
	return rgb(v,p,q,a);
}
/** Helper function to see if a rectangle contains a point 
	@param {Rect} rect rectangle to check 
	@param {Point} point point to check */
function contains(rect, point) {
	let x1 = rect[X];
	let y1 = rect[Y];
	let x2 = rect[X] + rect[W];
	let y2 = rect[Y] + rect[H];
	if (x1 > x2) { const t = x1; x1 = x2; x2 = t; }
	if (y1 > y2) { const t = y1; y1 = y2; y2 = t; }
	const x = point[X];
	const y = point[Y];
	return (x >= x1 && x <= x2 && y >= y1 && y <= y2);
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

/** Const for left mouse button */   const LEFT_MOUSE = 0;
/** Const for right mouse button */  const RIGHT_MOUSE = 2;
/** Const for middle mouse button */ const MIDDLE_MOUSE = 1;

/** Get whether a mouse button has been pressed this frame 
	@param {string} button name of button to check
	@returns {boolean} true if pressed this frame, false otherwise */
function mousePressed(button) { return mainGame.mousePressed(button); }
/** Get whether a mouse button has been held this frame 
	@param {string} button name of button to check
	@returns {boolean} true if held this frame, false otherwise */
function mouseHeld(button) { return mainGame.mouseHeld(button); }
/** Get whether a mouse button has been released this frame 
	@param {string} button name of button to check
	@returns {boolean} true if released this frame, false otherwise */
function mouseReleased(button) { return mainGame.mouseReleased(button); }
/** Get the mouse position as a Point
	@returns {Point} array containing [mouseX,mouseY] */
function mousePos() { return mainGame.mousePos(); }


/** function to clear the canvas with a given color
	@param {Color} c color to clear with*/
function clear(c) { return mainGame.clear(c); }
/** Draws a single pixel in the given color. Can be called with either:
	- `draw(point, color)`
	- `draw(x, y, color)` */
function draw(x,y,c) { return mainGame.draw(x,y,c); }
/** Draw a line between two points, in the given color
	@param {Point} p1 first point
	@param {Point} p2 second point
	@param {Color} c color to draw with */
function drawLine(p1, p2, c) { return mainGame.drawLine(p1, p2, c); }
/** Draw an empty circle centered on the given point, with the given radius, in the given color
		@param {Point} p point to draw at
		@param {number} r radius to draw with
		@param {Color} c color to draw with */
function drawCircle(p, r, c) { return mainGame.drawCircle(p, r, c); }
/** Draw a filled circle centered on the given point, with the given radius, in the given color
		@param {Point} p point to draw at
		@param {number} r radius to draw with
		@param {Color} c color to draw with */
function fillCircle(p, r, c) { return mainGame.fillCircle(p, r, c); }
/** Draw an empty ellipse centered at a point
	@param {Point} p point to draw around
	@param {number} w width of ellipse
	@param {number} h height of ellipse
	@param {Color} c color to draw with */
function drawEllipse(p, w, h, c) { return mainGame.drawEllipse(p, w, h, c); }
/** Draw a filled ellipse centered at a point
	@param {Point} p point to draw around
	@param {number} w width of ellipse
	@param {number} h height of ellipse
	@param {Color} c color to draw with */
function fillEllipse(p, w, h, c) { return mainGame.fillEllipse(p, w, h, c); }
/** Draws a rectangle in the given color. Can be called with either:
	- `drawRect(p, w, h, color)` where `p` is the top left, and `w`/`h` are width and height
	- `drawRect(p1, p2, color)` where `p1` and `p2` are bounding rectangles*/
function drawRect(p, w, h, c) { return mainGame.drawRect(p, w, h, c); }
/** Draws a filled rectangle in the given color. Can be called with either:
	- `drawRect(p, w, h, color)` where `p` is the top left, and `w`/`h` are width and height
	- `drawRect(p1, p2, color)` where `p1` and `p2` are bounding rectangles*/
function fillRect(p, w, h, c) { return mainGame.fillRect(p, w, h, c); }
/** Draws the given sprite at the given point 
	@param {Point} p point to draw at
	@param {Sprite} spr sprite to draw */
function drawSprite(p, spr) { return mainGame.drawSprite(p, spr); }
/** Draws a partial rectangle of the sprite at the given point 
	@param {Point} p point to draw at
	@param {Sprite} spr sprite to draw
	@param {Rect} rect region of sprite to draw */
function drawPartialSprite(p, spr, rect) { return mainGame.drawSprite(p, spr, rect); }
/** Draws text using the current font at the given position and in the current color 
		@param {Point} p point to draw at 
		@param {string} text text to draw
		@param {Color} color color to draw with */
function drawText(p, text, color) { return mainGame.drawText(p, text, color); }

/** Primary class for override when creating a PGE game */
class Game {
	constructor(canvas, pixelScale = 2, fps = 60) {
		if (!canvas.getContext) { return; }
		canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }
		
		
		mainGame = this;
		this.fps = fps;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		pixelate(this.ctx);
		pixelScale = floor(pixelScale);
		this.pixelScale = pixelScale;
		this.fullWidth = canvas.width;
		this.fullHeight = canvas.height;
		this.width = canvas.width / pixelScale;
		this.height = canvas.height / pixelScale;
		console.log("Initializing game", this.width, "x", this.height, "@",pixelScale,"px");
		
		this.buffer = this.ctx.createImageData(this.canvas.width, this.canvas.height);
		this.keys = {}
		this.lastKeys = {}
		this.mouse = {}
		this.lastMouse = {}
		canvas.addEventListener("keydown", (e) => {
			if (this.keys[e.key]) { return; }
			this.keys[e.key] = true; 
		});
		canvas.addEventListener("keyup", (e) => { delete this.keys[e.key]; });
		canvas.addEventListener("mousedown", (e) => { this.mouse[e.button] = true; });
		canvas.addEventListener("mouseup", (e) => { delete this.mouse[e.button]; });
		const rect = this.rect = canvas.getBoundingClientRect();
		this.rawMouseX = rect.left;
		this.rawMouseY = rect.top;
		canvas.addEventListener("mousemove", (e) => {
			const cx = this.rawMouseX = e.clientX;
			const cy = this.rawMouseY = e.clientY;
			this.mouseX = Math.floor((cx - this.rect.left)/this.pixelScale);
			this.mouseY = Math.floor((cy - this.rect.top)/this.pixelScale);
		});
		this.loaderPromise = this.loader();
	}
	
	async loader() {
		this.load();
		this.font = await loadRetroFont();
		this.loaded = true;	
		this.refresh = setInterval( ()=>{
			this.tick();
		}, (1000/this.fps));
	}
	/** Overridable function for async loading logic  */
	async load() { }
	
	
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
	
	/** Get whether a mouse button has been pressed this frame 
		@param {string} button name of button to check
		@returns {boolean} true if pressed this frame, false otherwise */
	mousePressed(button) { return this.mouse[button] && !this.lastMouse[button]; }
	/** Get whether a mouse button has been held this frame 
		@param {string} button name of button to check
		@returns {boolean} true if held this frame, false otherwise */
	mouseHeld(button) { return this.mouse[button]; }
	/** Get whether a mouse button has been released this frame 
		@param {string} button name of button to check
		@returns {boolean} true if released this frame, false otherwise */
	mouseReleased(button) { return !this.mouse[button] && this.lastMouse[button]; }
	/** Get the mouse position as a Point
		@returns {Point} array containing [mouseX,mouseY] */
	mousePos() { return [ this.mouseX, this.mouseY ]; }
	
	/** internal function to run updates with event handling logic */
	tick() {
		// console.log("tick");
		mainGame = this;
		this.buffer = new ImageData(this.fullWidth, this.fullHeight);
		this.update();
		this.ctx.putImageData(this.buffer,0,0);
		this.lastKeys = this.keys;
		this.lastMouse = this.mouse;
		this.keys = {...this.lastKeys};
		this.mouse = {...this.lastMouse};
	}
	/** overridable function for game update logic */
	update() {
		this.clear([40,80,160]);
	}
	
	/** function to clear the canvas with a given color
		@param {Color} c color to clear with*/
	clear(c) {
		// this.ctx.fillStyle = style(c);
		// this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
		for (let y = 0; y < this.fullHeight; y++) {
			for (let x = 0; x < this.fullWidth; x++) {
				let i = y * this.fullWidth * 4 + x * 4;
				this.buffer.data[i+0] = c[R]
				this.buffer.data[i+1] = c[G]
				this.buffer.data[i+2] = c[B]
				this.buffer.data[i+3] = 255
			}
		}
	}
	
	/** Draws a single pixel in the given color. Can be called with either:
		- `draw(point, color)`
		- `draw(x, y, color)` */
	draw(x, y, c) {
		if (!c) { this.draw(x[0], x[1], y); return; }
		x = Math.floor(x);
		y = Math.floor(y);
		const ps = this.pixelScale;
		function coord(x,y,w) {
			return y * (w * 4) + x * 4;	
		}
		// this.ctx.fillStyle = style(c);
		// this.ctx.fillRect(x * ps, y * ps, ps,ps);
		for (let yy = 0; yy < ps; yy++) {
			for (let xx = 0; xx < ps; xx++) {
				if (x*ps + xx < 0) { continue; }
				if (x*ps + xx >= this.fullWidth) { continue; }
				if (y*ps + yy < 0) { continue; }
				if (y*ps + yy >= this.fullHeight) { continue; }
				let i = coord(x*ps + xx, y*ps+yy, this.fullWidth);
				this.buffer.data[i+0] = c[R];
				this.buffer.data[i+1] = c[G];
				this.buffer.data[i+2] = c[B];
				this.buffer.data[i+3] = 255;
			}
		}
	}
	
	/** Draw a line between two points, in the given color
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
	
	/** Draw an empty circle centered on the given point, with the given radius, in the given color
		@param {Point} p point to draw at
		@param {number} r radius to draw with
		@param {Color} c color to draw with */
	drawCircle(p, r, c) {
		p = floor(p);
		r = Math.floor(r);
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
	
	/** Helper function for filled shapes */
	scanLine (sx, ex, ny, c) {
		for (let i = sx; i <= ex; i++) { this.draw(i, ny, c); }
	}
	
	/** Draw a filled circle centered on the given point, with the given radius, in the given color
		@param {Point} p point to draw at
		@param {number} r radius to draw with
		@param {Color} c color to draw with */
	fillCircle(p, r, c) {
		p = floor(p);
		r = Math.floor(r);
		let x0 = 0;
		let y0 = r;
		let d = 3 - 2 * r;
		
		if (r == 0) { return; }
		while (y0 >= x0) {
			this.scanLine(p[X] - x0, p[X] + x0, p[Y] - y0, c);
			this.scanLine(p[X] - y0, p[X] + y0, p[Y] - x0, c);
			this.scanLine(p[X] - x0, p[X] + x0, p[Y] + y0, c);
			this.scanLine(p[X] - y0, p[X] + y0, p[Y] + x0, c);
			
			if (d < 0) { d += 4 * x0 + 6; x0++; }
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
		w = Math.floor(w);
		h = Math.floor(h);
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
	/** Draw a filled ellipse centered at a point
		@param {Point} p point to draw around
		@param {number} w width of ellipse
		@param {number} h height of ellipse
		@param {Color} c color to draw with */
	fillEllipse(p, w, h, c) {
		p = floor(p);
		w = Math.floor(w);
		h = Math.floor(h);
		if (w == 0 || h == 0) { return; }
		let a2 = w*w;
		let b2 = h*h;
		let fa2 = 4 * a2;
		let fb2 = 4 * b2;
		let sigma;
		let x,y;
		
		sigma = 2 * b2 + a2 * (1 - 2 * h);
		x = 0; 
		y = h;
		for (;b2 * x <= a2*y; x++) {
			this.scanLine(p[X] - x, p[X] + x, p[Y] - y, c);
			this.scanLine(p[X] - x, p[X] + x, p[Y] + y, c);
			
			if (sigma >= 0) { sigma += fa2 * (1 - y); y--; }
			sigma += b2 * ((4 * x) + 6);
		}
		
		sigma = 2 * a2 + b2 * (1 - 2 * w);
		x = w; 
		y = 0;
		for (;a2 * y <= b2 * x; y++) {
			this.scanLine(p[X] - x, p[X] + x, p[Y] - y, c);
			this.scanLine(p[X] - x, p[X] + x, p[Y] + y, c);
			
			if (sigma >= 0) { sigma += fb2 * (1 - x); x--; }
			sigma += a2 * ((4 * y) + 6);
		}
	}
	
	/** Draws an empty rectangle in the given color. Can be called with either:
		- `drawRect(rect, color)` where `rect` is a {Rect}
		- `drawRect(p, w, h, color)` where `p` is the top left, and `w`/`h` are width and height
		- `drawRect(p1, p2, color)` where `p1` and `p2` are bounding rectangles*/
	drawRect(p, w, h, c) {
		if (!h) {
			c = w;
			w = p[W];
			h = p[H];
		} else if (!c) {
			let p2 = w;
			c = h;
			if (p[X] > p2[X]) { const t = p[X]; p[X] = p2[X]; p2[X] = t; }
			if (p[Y] > p2[Y]) { const t = p[Y]; p[Y] = p2[Y]; p2[Y] = t; }
			w = p2[X] - p[X];
			h = p2[Y] - p[Y];
		}
		const pa = [p[X]+w, p[Y]];
		const pb = [p[X],p[Y]+h];
		const pc = [pa[X], pb[Y]];
		this.drawLine(p, pa, c);
		this.drawLine(p, pb, c);
		this.drawLine(pb, pc, c);
		this.drawLine(pa, pc, c);
	}
	
	/** Draws a filled rectangle in the given color. Can be called with either:
		- `drawRect(rect, color)` where `rect` is a {Rect}
		- `drawRect(p, w, h, color)` where `p` is the top left, and `w`/`h` are width and height
		- `drawRect(p1, p2, color)` where `p1` and `p2` are bounding rectangles*/
	fillRect(p, w, h, c) {
		if (!h) {
			c = w;
			w = p[W];
			h = p[H];
		} else if (!c) { 
			let p2 = w;
			c = h;
			if (p[X] > p2[X]) { const t = p[X]; p[X] = p2[X]; p2[X] = t; }
			if (p[Y] > p2[Y]) { const t = p[Y]; p[Y] = p2[Y]; p2[Y] = t; }
			w = p2[X] - p[X];
			h = p2[Y] - p[Y];
		}
		
		let x1 = p[X]; if (x1 < 0) { x1 = 0; }
		let y1 = p[Y]; if (y1 < 0) { y1 = 0; }
		let x2 = p[X] + w; if (x2 >= this.width) { x2 = this.width; }
		let y2 = p[Y] + h; if (y2 >= this.height) { y2 = this.height; }
		
		for (let y = y1; y < y2; y++) {
			for (let x = x1; x < x2; x++) {
				this.draw(x, y, c);
			}
		}
	}
	
	/** Draws the given sprite at the given point 
		@param {Point} p point to draw at
		@param {Sprite} spr sprite to draw */
	drawSprite(p, spr) {
		if (!spr) { return; }
		const sw = spr.width;
		const sh = spr.height;
		const px = p[X];
		const py = p[Y];
		
		for (let y = 0; y < sh; y++) {
			for (let x = 0; x < sw; x++) {
				const pixel =  spr.pixel(x,y);
				
				if (!pixel[A] || pixel[A] > .5) {
					if (pixel[A] === 0) { continue; }
					this.draw(px+x, py+y, pixel);
				}
				
			}
		}
	}
	
	/** Draws a partial rectangle of the sprite at the given point 
		@param {Point} p point to draw at
		@param {Sprite} spr sprite to draw
		@param {Rect} rect region of sprite to draw */
	drawPartialSprite(p, spr, rect) {
		if (!spr) { return; }
		const ox = rect[X];
		const oy = rect[Y];
		const w = rect[W];
		const h = rect[H];
		const sw = spr.width;
		const sh = spr.height;
		const px = p[X];
		const py = p[Y];
		
		for (let y = 0; y < h; y++) {
			if (y+oy < 0 || y+oy >= sh) { continue; }
			for (let x = 0; x < w; x++) {
				if (x+ox < 0 || x+ox >= sw) { continue; }
				
				const pixel = spr.pixel(ox+x, oy+y);
				if (pixel[3] < .01) {continue; }
				this.draw(px+x, py+y, pixel);
			}
		}
	}
	
	/** Draws text using the current font at the given position and in the current color 
		@param {Point} p point to draw at 
		@param {string} text text to draw
		@param {Color} color color to draw with */
	drawText(p, text, color) {
		// scale = Math.floor(scale);
		if (text === null || text === "") { return; }
		
		let sx = 0;
		let sy = 0;
		const px = p[X];
		const py = p[Y];
		for (let char of text) {
			if (char === '\n') {
				sx = 0;
				sy += this.font.charHeight;
				continue;
			}
			let glyph = this.font.glyphs[char];
			if (glyph) {
				const w = glyph.width;
				const h = glyph.height;
				
				for (let xx = 0; xx < w; xx++) {
					for (let yy = 0; yy < h; yy++) {
						const pixel = glyph.pixel(xx,yy);
						if (pixel && pixel[R] > 0) {
							const x = px + sx + xx;
							const y = py + sy + yy;
							this.draw(x, y, color);
						} 
						// console.log("");
					}
				}
				
				sx += w;
				
			} else {
				console.log("Skipping character '", char, "'");
				// forward by constant if glyph does not exist
				sx += 8; 
			}
			
		}
		
		
	}
	
	
	
}
