
function sfc32(a, b, c, d) {
	return function() {
		a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
		var t = (a + b) | 0;
		a = b ^ b >>> 9;
		b = c + (c << 3) | 0;
		c = (c << 21 | c >>> 11);
		d = d + 1 | 0;
		t = t + d | 0;
		c = c + t | 0;
		return (t >>> 0) / 4294967296;
	}
}
function rng(seed) { return sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed); }
let rand = rng( 31337 ^ 0xDEADBEEF );
function nextInt(a, b=0) { return Math.floor(a + (b-a) * rand()); }
function nextFloat(a, b=0) { return a + (b-a) * rand(); }
function nextColor() { return [ nextInt(255), nextInt(255), nextInt(255), 255 ]; }

function randomBits(chance=.5) {
	const bits = []
	for (let i = 0; i < 64; i++) { bits[i] = rand() < chance ? 1 : 0; }
	return bits;
}
function and(bits, mask) {
	const result = [];
	for (let i = 0; i < 64; i++) {
		result[i] = bits[i] && mask[i];
	}
	return result;
}
function or(bits, mask) {
	const result = [];
	for (let i = 0; i < 64; i++) {
		result[i] = bits[i] || mask[i];
	}
	return result;
}
function xor(bits, mask) {
	const result = [];
	for (let i = 0; i < 64; i++) {
		result[i] = !!(bits[i] ^ mask[i]);
	}
	return result;
}
function countBits(bits) { 
	let cnt = 0;
	for (let i = 0; i < 64; i++) { cnt += (bits[i] ? 1 : 0); }
	return cnt;
}

function pickBits(mask, numBits) {
	bits = []
	for (let i = 0; i < numBits; i++) {
		const pos = randomInt(0, 63);
		if (!mask[pos]) { i--; continue; }
		if (bits[pos]) { continue; }
		bits[pos] = true;
	}
	return bits;
}
function splatBits(mask, minBits) {
	if (minBits >= countBits(mask)) { return randomBits(); }
	let bits = randomBits();
	while (countBits(bits) < minBits) {
		bits = randomBits();
	}
	return bits;
}



/** Settings used to render an invader */
class InvaderRenderSettings {
	/** Control number of pose frames to render*/
	minFrames = 2; maxFrames = 5;
	/** Get number of pose frames to render */
	get nextFrames() { return nextInt(this.minFrames, this.maxFrames+1); }
	/** Control number of layers to create. Any after 1 are considered 'decoration' layers */
	minLayers = 2; maxLayers = 5;
	/** Get number of layers to render */
	get nextLayers() { return nextInt(this.minLayers, this.maxLayers+1); }
	/** Control of sprite dimension for both width and height */
	minSize = 4; maxSize = 10;
	/** get dimensional size */
	get nextSize() { return nextInt(this.minSize, this.maxSize+1); }
	/** Control how much 'decoration' layers vary from base color */
	hueChange = .2;
	minSatChange = -.2; maxSatChange = .2;
	minValChange = -.2; maxValChange = .2;
	/** Get the change do 'decoration' for one layer */
	get nextHsvChange() {
		const h = nextFloat(-this.hueChange, this.hueChange);
		const s = nextFloat(this.minSatChange, this.maxSatChange);
		const v = nextFloat(this.minValChange, this.maxValChange);
		return [h,s,v,0]
	}
	/** Control of 'decoration' pixels per layer  */
	minDeco = 1; maxDeco = 5;
	/** Get the number of 'deco' pixels on a decoration layer */
	get nextDeco() { return nextInt(this.minDeco, this.maxDeco+1); }
	/** Control of 'animation' changes per layer per pose */
	minAnim = 1; maxAnim = 5;
	/** Get the number of pixels to change on a pose */
	get nextAnim() { return nextInt(this.minAnim, this.maxAnim+1); }
}

function renderInvader(spr, bits, index) {
	const w = spr.width;
	const h = spr.height;
	const oddW = w % 2 === 1;
	const wBits = (oddW ? 1 : 0) + Math.floor(w / 2);
	for (let yy = 0; yy < h; yy++) {
		for (let xx = 0; xx < wBits; xx++) {
			let i = yy * wBits + xx;
			if (i >= 64) { return; }
			
			if (bits[i]) {
				spr.setIndex(xx,yy, index);
				spr.setIndex(w-1-xx, yy, index); // Mirroring
			}
		}
	}
}

function makeInvader(w, h, colors) {
	const spr = new PalettedSprite(w,h,colors);
	for (let i = 1; i < colors.length; i++) {
		const bits = randomBits(.3);
		renderInvader(spr, bits, i);
	}
	return spr;
}

/** Create an invader from a seed value and settings 
	@param {number} seed
	@param {InvaderRenderSettings} sets */
function renderInvaderPoses(seed, sets) {
	if (!sets) { sets = new InvaderRenderSettings(); }
	rand = rng(seed);
	const poses = []
	const numFrames = sets.nextFrames;
	const numLayers = sets.nextLayers;
	
	const baseFrame = []
	const colors = [];
	
	const width = sets.nextSize;
	const height = sets.nextSize;
	const fill = Math.floor(Math.sqrt(width*height));
	
	const maxBits = Math.floor(height * width - (height*(width/2)))
	const bitMask = []
	for (let i = 0; i < maxBits; i++) { bitMask[i] = 1; }
	const baseColor = toHsv(nextColor());
	baseColor.a = 1;
	baseFrame[0] = pickBits(bitMask, fill);
	colors[0] = TRANSPARENT;
	colors[1] = hsv(baseColor);
	
	for (let i = 1; i < numLayers; i++) {
		const numDeco = sets.nextDeco;
		baseFrame[i] = pickBits(bitMask, numDeco);
		const colorMod = sets.nextHsvChange;
		colors[i+1] = hsv(baseColor.r + colorMod.r, baseColor.g + colorMod.g, baseColor.b + colorMod.b);
	}
	for (let k = 0; k < numFrames; k++) {
		const spr = new PalettedSprite(width, height, colors);
		for (let i = 0; i < numLayers; i++) {
			let bits = baseFrame[i];
			if (k != 0) {
				const numFlips = sets.nextAnim;
				const mask = pickBits(bitMask, numFlips);
				bits = xor(bits, mask);
			}
			renderInvader(spr, bits, i+1);
		}
		poses[k] = spr;
	}
	
	return poses;
}
