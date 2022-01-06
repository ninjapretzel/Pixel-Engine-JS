/** pixel-engine.js
 * single-file include for the JS version of the Pixel Game Engine
*/
function pixelate(context){
	context['imageSmoothingEnabled'] = false;       /* standard */
	context['mozImageSmoothingEnabled'] = false;    /* Firefox */
	context['oImageSmoothingEnabled'] = false;      /* Opera */
	context['webkitImageSmoothingEnabled'] = false; /* Safari */
	context['msImageSmoothingEnabled'] = false;     /* IE */
}
const TAU = 2 * Math.PI;
function floor(v) { return Math.floor(v); }
function clamp(v,min=0,max=1) { return (v < min) ? min : ((v > max) ? max : v); }
function frac(v) { return v-Math.floor(v); }
function abs(v) { return v < 0 ? -v : v; }
function fmod(a,b) { 
	const c = frac(abs(a/b)) * abs(b);
	return (a < 0) ? -c : c 
}
function random(a,b=0) {
	return Math.floor(a + (b-a) * Math.random());
}
function style(r,g,b) { 
	if (Array.isArray(r)) { return style(r[0], r[1], r[2]); }
	r = floor(r); g = floor(g); b = floor(b);
	return `rgb(${r},${g},${b})`; 
}
function rgb(r,g,b) { return style(r*256,g*256,b*256); }
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

const WHITE = [255,255,255];
const BLACK = [0,0,0];
const RED = [255,0,0];
const GREEN = [0,255,0];
const BLUE = [0,0,255];
const CYAN = [0,255,255];
const MAGENTA = [255,0,255];
const YELLOW = [255,255,0];

class Game {
	constructor(canvas, pixelScale = 2, fps = 60) {
		if (!canvas.getContext) { return; }
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		pixelate(this.ctx);
		pixelScale = floor(pixelScale);
		this.pixelScale = pixelScale;
		this.width = canvas.width / pixelScale;
		this.height = canvas.height / pixelScale;
		console.log("Initialized game", this.width, "x", this.height, "@",pixelScale,"px");
		this.buffer = this.ctx.createImageData(this.canvas.width, this.canvas.height);
		
		this.clear([40,80,160]);
		this.refresh = setInterval( ()=>{
			this.update();
			console.log("tick");
		}, (1000/fps));
		
	}
	
	update() {}
	
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
	
	draw() {
		let px = arguments[0];
		let py = arguments[1];
		let c = arguments[2];
		if (arguments.length == 2) {
			px = arguments[0][0];
			py = arguments[0][1];
			c = arguments[1];
		} 
		px = floor(px);
		py = floor(py);
		this.ctx.fillStyle = style(c);
		const ps = this.pixelScale;
		this.ctx.fillRect(px * ps, py * ps, ps,ps);
	}
	
	line(p1,p2,c) {
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
	
	
}
