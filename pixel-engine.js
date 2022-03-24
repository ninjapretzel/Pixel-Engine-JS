/** pixel-engine.js
	single-file include for the JS version of the Pixel Game Engine (PGE)
	Loosely based off the One-Lone-Coder Pixel Game Engine */
function pixelate(context){
	context['imageSmoothingEnabled'] = false;       /* standard */
	// context['mozImageSmoothingEnabled'] = false;    /* Firefox */
	context['oImageSmoothingEnabled'] = false;      /* Opera */
	context['webkitImageSmoothingEnabled'] = false; /* Safari */
	context['msImageSmoothingEnabled'] = false;     /* IE */
}

/** Constant for white */       const WHITE = [255,255,255];
/** Constant for black */       const BLACK = [0,0,0];
/** Constant for red */         const RED = [255,0,0];
/** Constant for green */       const GREEN = [0,255,0];
/** Constant for blue */        const BLUE = [0,0,255];
/** Constant for cyan */        const CYAN = [0,255,255];
/** Constant for magenta */     const MAGENTA = [255,0,255];
/** Constant for yellow */      const YELLOW = [255,255,0];
/** Constant for transparent */ const TRANSPARENT = [0,0,0,0];
/** Constant for dark gray */   const DARK_GRAY = [80,80,80];
/** Constant for light gray */  const LIGHT_GRAY = [180,180,180];

/** @typedef {[Number, Number, Number, Number?]} Color Colors are specifically an array of [R,G,B,A?] */
/** @typedef {[Number, Number]} Point Points are specifically an array of [X,Y] */
/** @typedef {[number, number, number, number]} Rect rectangle in [X,Y,W,H] form */
Object.defineProperty(Array.prototype, "x", {
	get() { return this[0]; }, set(v) { this[0] = v; }, enumerable: false,	
});
Object.defineProperty(Array.prototype, "y", {
	get() { return this[1]; }, set(v) { this[1] = v; }, enumerable: false,	
});
Object.defineProperty(Array.prototype, "w", {
	get() { return this[2]; }, set(v) { this[2] = v; }, enumerable: false,	
});
Object.defineProperty(Array.prototype, "h", {
	get() { return this[3]; }, set(v) { this[3] = v; }, enumerable: false,	
});

Object.defineProperty(Array.prototype, "r", {
	get() { return this[0]; }, set(v) { this[0] = v; }, enumerable: false,	
});
Object.defineProperty(Array.prototype, "g", {
	get() { return this[1]; }, set(v) { this[1] = v; }, enumerable: false,	
});
Object.defineProperty(Array.prototype, "b", {
	get() { return this[2]; }, set(v) { this[2] = v; }, enumerable: false,	
});
Object.defineProperty(Array.prototype, "a", {
	get() { return this[3] ?? 255; }, set(v) { this[3] = v; }, enumerable: false,	
});

/** Retro font pixel data */
const RETRO_DATA= [
	0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,
	0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,
	0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,0,1,1,0,0,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,
	0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,1,1,1,1,1,0,0,0,0,1,1,0,0,1,1,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,
	0,1,0,0,1,1,0,0,0,0,1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,
	1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,
	1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,
	1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,
	0,1,1,0,0,1,0,0,0,0,0,1,1,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,1,1,1,0,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,1,0,0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,1,1,1,1,1,0,0,
	1,1,0,0,0,1,1,0,0,1,1,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1,1,0,1,1,0,0,0,1,1,0,
	1,1,0,1,1,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,1,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,0,0,0,1,1,0,
	1,1,0,1,1,1,1,0,1,1,0,0,0,1,1,0,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,0,0,1,1,0,
	1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1,0,1,1,0,1,1,0,1,1,1,1,0,1,1,0,0,0,1,1,0,
	1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,1,1,0,0,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,0,1,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,0,
	0,1,1,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,0,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,0,0,1,1,1,1,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,1,1,1,1,1,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,1,1,0,0,1,1,0,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
	1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,1,0,1,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,1,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,
	1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,1,0,1,1,0,0,1,1,1,1,1,0,0,0,1,1,0,0,1,1,0,0,0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,
	1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,0,0,1,1,0,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,1,1,1,0,0,1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	1,1,0,0,0,0,0,0,0,1,1,1,1,0,1,0,1,1,0,0,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,
	0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,1,1,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,1,1,1,0,1,1,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,
	0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,0,0,0,0,0,1,1,0,0,0,0,1,1,0,1,0,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,
	0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,1,0,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,
	0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,0,1,0,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,
	0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,1,0,1,1,0,1,1,0,0,1,1,0,0,0,1,1,1,1,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,0,1,1,1,0,0,0,0,0,1,0,0,0,0,
	0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,1,1,0,1,1,1,0,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,
	0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,1,0,1,1,0,0,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,
	0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,1,0,1,1,0,0,0,1,1,1,0,0,0,0,1,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,
	0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,0,0,1,0,0,1,0,0,0,1,1,0,1,0,1,1,0,0,1,1,0,1,1,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,
	0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,
	0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
]
/* Retro font palette data */
const RETRO_PALETTE = [ TRANSPARENT, WHITE ]


/** Class for representing sprite data */
class Sprite {
	/** sets up a new w x h sprite with _the same_ transparent Color in every spot
		@param {number} w width of sprite
		@param {number} h height of sprite */
	constructor(w, h) {
		this.width = w;
		this.height = h;
		this.pixels = [];
		const transparent = [0,0,0,0];
		for (let i = 0; i < w*h; i++) {
			this.pixels[i] = transparent;
		}
	}
	/** Create a sprite from raw sprite data in the form of arrays of ids and pixels 
		@param {number} w width of sprite
		@param {number} h height of sprite 
		@param {number[]} data sprite color ids 
		@param {Color[]} palette color information */
	static fromData(w, h, data, palette) {
		const result = new Sprite(w,h);
		const stop = w * h;
		if (stop != data.length) {
			throw new Error(`Wrong amount of data to initialize sprite. Expected ${stop}, had ${data.length}.`);
		}
		const size = palette.length;
		for (let i = 0; i < stop; i++) {
			result.pixels[i] = palette[data[i] % size];
		}
		return result
	}
	/** Gets the size of this sprite as a Point */
	get size() { return [this.w,this.h]; }
	/** Gets the number of pixels in this sprite */
	get length() { return this.w * this.h; }
	/** Gets the color at position (x,y) 
		@param {number} x 
		@param {number} y */
	pixel(x, y) {
		const i = x + y * this.width;
		if (i < 0 || i >= this.length) {
			throw new Error(`Pixel at ${x},${y} is out of bounds for size ${this.length}`);
		}
		return this.pixels[i]; 
	}
	/** sets the color at (x,y) to be color c 
		@param {number} x
		@param {number} y
		@param {Color} c */
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
			const c = text[i];
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
/** Loads an ASCII font where all glyphs are the same size 
 @param {string} spr sprite data to use for loading glyphs
 @param {number} w width of font glyphs
 @param {number} h height of font glyphs
 @returns {Font} loaded font object */
function loadAsciiFont(spr, w, h) {
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
function loadRetroFont() {
	const spr = Sprite.fromData(128, 48, RETRO_DATA, RETRO_PALETTE);
	return loadAsciiFont(spr, 8, 8); 
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
	@param {Array|number} v number or vector to clamp
	@param {Array|number} min minimum of clamp. Must be same type as v
	@param {Array|number} max maximum of clamp. Must be same type as v
	@returns {Array|number} array with all components clamped, or clamped number */
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
	@param {Array|number} v number or vector to frac
	@returns {Array|number} array with all components frac'd, or frac'd number */
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
	@param {Array|number} v number or vector to abs
	@returns {Array|number} array with all components abs'd, or abs'd number */
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
	@param {number} a First endpoint (required)
	@param {number} b Second endpoint (defaults to zero)
	@returns {number} integer in range [a, b) or [0, a)*/
function random(a,b=0) { return Math.floor(a + (b-a) * Math.random()); }
/** Helper to make a {Color} from a hex number in ARGB form
	@param {number} n Hex number to convert to {Color}
	@returns {Color} color of specified number */
function ARGB(n) {
	const b = n % 256; n = Math.floor(n / 256);
	const g = n % 256; n = Math.floor(n / 256);
	const r = n % 256; n = Math.floor(n / 256);
	const a = n % 256;
	return [ r, g, b, a ]
}
/** Helper to make a {Color} from a hex number in RGBA form
	@param {number} n Hex number to convert to {Color}
	@returns {Color} color of specified number */
function RGBA(n) {
	const a = n % 256; n = Math.floor(n / 256);
	const b = n % 256; n = Math.floor(n / 256);
	const g = n % 256; n = Math.floor(n / 256);
	const r = n % 256;
	return [ r, g, b, a ]
}
/** Helper function to get a {Color} from floating-point RGB colors [0,1] 
	@param {number} r RED component in [0, 1]
	@param {number} g GRN component in [0, 1]
	@param {number} b BLU component in [0, 1]
	@returns {string} style representing RGB color */
function rgb(r,g,b,a=1.0) { 
	const rr = Math.floor(r*255);
	const gg = Math.floor(g*255);
	const bb = Math.floor(b*255);
	const aa = Math.floor(a*255);
	return [ rr, gg, bb, aa ]; 
}
/** Helper function to get a style from floating-point HSV colors [0,1]
	@param {number} h HUE component in [0, 1]
	@param {number} s SAT component in [0, 1]
	@param {number} v VAL component in [0, 1]
	@returns {string} style representing HSV color */
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
	let x1 = rect.x;
	let y1 = rect.y;
	let x2 = rect.x + rect.w;
	let y2 = rect.y + rect.h;
	if (x1 > x2) { const t = x1; x1 = x2; x2 = t; }
	if (y1 > y2) { const t = y1; y1 = y2; y2 = t; }
	const x = point.x;
	const y = point.y;
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
/** Draws text centered at the given point 
	@param {Point} p point to draw at 
	@param {string} text text to draw
	@param {Color} color color to draw with */
function drawTextCentered(p, text, color) { return mainGame.drawTextCentered(p, text, color); }
/** Draws text with an outline
	@param {Point} p point to draw at
	@param {string} text text to draw
	@param {Color} col color inside text
	@param {Color} outlineCol color for outline */
function drawTextOutline(p, text, col, outlineCol) { return mainGame.drawTextOutline(p, text, col, outlineCol); }
/** Draws text centered at the given point, with an outline 
	@param {Point} p point to draw at 
	@param {string} text text to draw
	@param {Color} col color to draw with 
	@param {Color} outlineCol color to draw with */
function drawTextCenteredOutline(p, text, col, outlineCol) { return mainGame.drawTextCenteredOutline(p, text, col, outlineCol); }

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
		this.font = loadRetroFont();
		this.load();
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
		for (let y = 0; y < this.fullHeight; y++) {
			for (let x = 0; x < this.fullWidth; x++) {
				let i = y * this.fullWidth * 4 + x * 4;
				this.buffer.data[i+0] = c.r
				this.buffer.data[i+1] = c.g
				this.buffer.data[i+2] = c.b
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
		for (let yy = 0; yy < ps; yy++) {
			for (let xx = 0; xx < ps; xx++) {
				if (x*ps + xx < 0) { continue; }
				if (x*ps + xx >= this.fullWidth) { continue; }
				if (y*ps + yy < 0) { continue; }
				if (y*ps + yy >= this.fullHeight) { break; }
				let i = coord(x*ps + xx, y*ps+yy, this.fullWidth);
				this.buffer.data[i+0] = c.r;
				this.buffer.data[i+1] = c.g;
				this.buffer.data[i+2] = c.b;
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
			this.scanLine(p.x - x0, p.x + x0, p.y - y0, c);
			this.scanLine(p.x - y0, p.x + y0, p.y - x0, c);
			this.scanLine(p.x - x0, p.x + x0, p.y + y0, c);
			this.scanLine(p.x - y0, p.x + y0, p.y + x0, c);
			
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
			this.draw(p.x + x, p.y + y, c);
			this.draw(p.x - x, p.y + y, c);
			this.draw(p.x + x, p.y - y, c);
			this.draw(p.x - x, p.y - y, c);
			if (sigma >= 0) { sigma += fa2 * (1 - y); y--; }
			sigma += b2 * ((4 * x) + 6);
		}
		
		sigma = 2 * a2 + b2 * (1 - 2 * w);
		x = w; y = 0;
		for (; a2 * y < b2 * x; y++) {
			this.draw(p.x + x, p.y + y, c);
			this.draw(p.x - x, p.y + y, c);
			this.draw(p.x + x, p.y - y, c);
			this.draw(p.x - x, p.y - y, c);
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
			this.scanLine(p.x - x, p.x + x, p.y - y, c);
			this.scanLine(p.x - x, p.x + x, p.y + y, c);
			
			if (sigma >= 0) { sigma += fa2 * (1 - y); y--; }
			sigma += b2 * ((4 * x) + 6);
		}
		
		sigma = 2 * a2 + b2 * (1 - 2 * w);
		x = w; 
		y = 0;
		for (;a2 * y <= b2 * x; y++) {
			this.scanLine(p.x - x, p.x + x, p.y - y, c);
			this.scanLine(p.x - x, p.x + x, p.y + y, c);
			
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
			w = p.w;
			h = p.h;
		} else if (!c) {
			let p2 = w;
			c = h;
			if (p.x > p2.x) { const t = p.x; p.x = p2.x; p2.x = t; }
			if (p.y > p2.y) { const t = p.y; p.y = p2.y; p2.y = t; }
			w = p2.x - p.x;
			h = p2.y - p.y;
		}
		const pa = [p.x+w, p.y];
		const pb = [p.x,p.y+h];
		const pc = [pa.x, pb.y];
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
			w = p.w;
			h = p.h;
		} else if (!c) { 
			let p2 = w;
			c = h;
			if (p.x > p2.x) { const t = p.x; p.x = p2.x; p2.x = t; }
			if (p.y > p2.y) { const t = p.y; p.y = p2.y; p2.y = t; }
			w = p2.x - p.x;
			h = p2.y - p.y;
		}
		
		let x1 = p.x; if (x1 < 0) { x1 = 0; }
		let y1 = p.y; if (y1 < 0) { y1 = 0; }
		let x2 = p.x + w; if (x2 >= this.width) { x2 = this.width; }
		let y2 = p.y + h; if (y2 >= this.height) { y2 = this.height; }
		
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
		const px = p.x;
		const py = p.y;
		
		for (let y = 0; y < sh; y++) {
			for (let x = 0; x < sw; x++) {
				const pixel =  spr.pixel(x,y);
				
				if (!pixel.a || pixel.a > .5) {
					if (pixel.a === 0) { continue; }
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
		const ox = rect.x;
		const oy = rect.y;
		const w = rect.w;
		const h = rect.h;
		const sw = spr.width;
		const sh = spr.height;
		const px = p.x;
		const py = p.y;
		
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
		const px = p.x;
		const py = p.y;
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
						if (pixel && pixel.r > 0) {
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
	
	/** Draws text centered at the given point 
		@param {Point} p point to draw at 
		@param {string} text text to draw
		@param {Color} color color to draw with */
	drawTextCentered(p, text, color) {
		const len = this.font.measure(text);
		drawText([p.x - len.x/2, p.y - len.y/2], text, color);
	}
	
	/** Draws text with an outline
		@param {Point} p point to draw at
		@param {string} text text to draw
		@param {Color} col color inside text
		@param {Color} outlineCol color for outline */
	drawTextOutline(p, text, col, outlineCol) {
		if (text == null || text == "") { return; }
		let overdraw = []
		const OUTLINE_HEIGHT = 2 + this.font.charHeight;
		function alreadyDrawn(x, y) {
			if (overdraw) {
				const xa = x+1;
				const ya = y+1;
				const index = xa + OUTLINE_HEIGHT * ya;
				return overdraw[index];
			}
			return false;
		}
		function drawn(x, y) {
			if (overdraw) {
				const xa = x+1;
				const ya = y+1;
				const index = xa + OUTLINE_HEIGHT * ya;
				overdraw[index] = true;
			}
		}
		
		let sx = 0;
		let sy = 0;
		const px = p.x;
		const py = p.y;
		for (let c of text) {
			if (c == '\n') {
				sx = 0;
				sy += this.font.charHeight;
			} else {
				const glyph = this.font.glyphs[c];
				function hasPixel(x,y) {
					const pix = glyph.pixel(x,y);
					return pix && pix.r > 0;
				}
				if (glyph) {
					const w = glyph.width;
					const h = glyph.height;
					overdraw = [];
					
					for (let i = 0; i < w; i++) {
						for (let j = 0; j < h; j++) {
							const pixel = glyph.pixel(i,j);
							if (pixel && pixel.r > 0) {
								this.draw(px+sx+i, py+sy+j, col);
								if (!alreadyDrawn(i-1, j) && (i == 0 || !hasPixel(i-1, j))) { this.draw(px + sx + i - 1, py + sy + j, outlineCol); drawn(i-1, j); }
								if (!alreadyDrawn(i, j-1) && (j == 0 || !hasPixel(i, j-1))) { this.draw(px + sx + i, py + sy + j - 1, outlineCol); drawn(i, j-1); }
								if (!alreadyDrawn(i+1, j) && (i == w-1 || !hasPixel(i+1, j))) { this.draw(px + sx + i + 1, py + sy + j, outlineCol); drawn(i+1, j); }
								if (!alreadyDrawn(i, j+1) && (i == h-1 || !hasPixel(i, j+1))) { this.draw(px + sx + i, py + sy + j + 1, outlineCol); drawn(i, j+1); }
							}
						}
					}
					
					sx += w;
					
				} else {
					sx += 8;
				}
			}
			
		}
		
	}
	
	/** Draws text centered at the given point with an outline
		@param {Point} p point to draw at 
		@param {string} text text to draw
		@param {Color} col color to draw with 
		@param {Color} outlineCol color to draw with */
	drawTextCenteredOutline(p, text, col, outlineCol) {
		const len = this.font.measure(text);
		drawTextOutline([p.x - len.x/2, p.y - len.y/2], text, col, outlineCol);
	}
	
}
