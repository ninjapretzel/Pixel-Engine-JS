const defaultMenuSkin = Sprite.fromData(48, 24, [
	0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,
	0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,1,0,0,0,0,0,0,
	0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,3,3,3,3,1,1,1,0,0,
	0,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,1,0,0,0,0,6,6,0,0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,1,0,
	0,1,2,2,2,3,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,1,0,0,0,6,6,6,6,0,0,1,2,3,2,2,2,2,2,2,2,2,2,2,2,3,1,
	1,2,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,2,3,1,0,6,6,6,6,6,6,0,1,2,2,2,2,2,2,2,2,2,2,3,3,3,1,0,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,7,7,7,7,7,7,0,1,2,3,2,2,2,2,2,2,2,3,1,1,1,0,0,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,0,0,0,0,0,0,0,1,2,3,2,2,2,2,2,2,2,3,1,0,0,0,0,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,0,0,0,0,0,0,0,1,2,3,2,2,2,2,2,2,3,3,1,0,0,0,0,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,6,6,0,0,0,0,0,1,2,3,3,2,2,2,2,2,3,1,0,0,0,0,0,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,6,6,6,0,0,0,0,1,2,1,3,3,2,2,2,3,3,1,0,0,0,0,0,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,6,6,6,6,0,0,0,0,1,1,1,3,3,3,3,3,1,0,0,0,0,0,0,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,6,6,6,7,0,0,0,0,0,0,1,1,1,1,1,1,4,4,4,4,4,0,0,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,6,6,7,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,7,7,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,0,0,0,0,0,0,0,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
	1,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,3,1,0,6,6,6,6,6,6,0,5,5,1,1,1,1,5,5,5,5,1,1,1,1,5,5,
	1,2,2,2,3,1,5,5,5,5,5,5,5,5,5,5,5,5,1,2,2,2,3,1,0,6,6,6,6,6,7,0,5,1,1,1,1,1,1,5,5,1,1,2,2,1,1,5,
	0,1,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,3,1,0,0,0,6,6,6,7,0,0,5,1,1,1,1,1,1,5,5,1,2,2,2,2,1,5,
	0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,0,0,0,0,6,6,0,0,0,5,1,1,1,1,1,1,5,5,1,2,2,2,2,1,5,
	0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,1,0,0,0,0,0,0,0,0,0,0,5,1,1,1,1,1,1,5,5,1,1,2,2,1,1,5,
	0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,5,5,1,1,1,1,5,5,5,5,1,1,1,1,5,5,
	0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
], [
	TRANSPARENT,      // 0 Empty
	ARGB(0xFF4E4E4E), // 1 Dark Gray
	ARGB(0xFFFFFFFF), // 2 White
	ARGB(0xFFB6B6B6), // 3 Light Gray
	ARGB(0xFF363636), // 4 Shadow Gray
	ARGB(0xFF1427FF), // 5 Blue 
	ARGB(0xFFFF2600), // 6 Red1
	ARGB(0xFFA42600), // 7 Red2
	RED,              // 8 plain red
]);

const NPATCH = 8;

function isObject(v) { return v && (typeof(v)==="object"); }
function isNumber(v) { return (typeof(v)==="number" && isFinite(v)); }

const HAND = [ NPATCH * 4, 0, NPATCH * 2, NPATCH * 2 ];
class MenuManager {
	panels = [];
	_OFFSET = [ 10, 10 ]
	
	open(panel) {
		this.close();
		this.panels.push(panel);
	}
	close() {
		this.panels = [];
	}
	top() { return this.panels[this.panels.length-1]; }
	onUp() { if (this.top()) { this.top().$onUp(); } }
	onDown() { if (this.top()) { this.top().$onDown(); } }
	onLeft() { if (this.top()) { this.top().$onLeft(); } }
	onRight() { if (this.top()) { this.top().$onRight(); } }
	onBack() { if (this.top()) { this.panels.pop(); } }
	onConfirm() {
		if (!this.top()) { return null; }
		let next = this.top().$onConfirm();
		if (next == this.top()) {
			if (this.top().$getSelected().$enabled) {
				return this.top().$getSelected();
			}
		} else {
			if (next.$enabled) {
				this.panels.push(next);
			}
		}
		
		
	}
	
	draw(pge, gfx, offset) {
		if (this.panels.length == 0) { return; }
		for (let panel of this.panels) {
			panel.$drawSelf(pge, gfx, offset);
			offset.x += this._OFFSET.x;
			offset.y += this._OFFSET.y;
		}
		
		const pos = this.top().$cursorPos;
		pge.drawPartialSprite(pos, gfx, HAND);
	}
	
}

/** Hack - turns a structure of objects into menu objects */
function buildMenu(menuObject, name="root") {
	const UP_ARROW = [ NPATCH * 3, 0, NPATCH, NPATCH ];
	const RIGHT_ARROW = [ NPATCH * 3, NPATCH * 1, NPATCH, NPATCH ];
	const DOWN_ARROW = [ NPATCH * 3, NPATCH * 2, NPATCH, NPATCH ];
	menuObject.$name = name;
	menuObject.$id ??= -1;
	menuObject.$enabled ??= true;
	menuObject.$totalRows ??= 0;
	menuObject.$topVisibleRow ??= 0;
	menuObject.$cellTable ??= [ 1, 4 ];
	menuObject.$cellSize ??= [ 0, 0 ];
	menuObject.$cellPadding ??= [ 2, 0 ];
	menuObject.$patchSize ??= [ NPATCH, NPATCH ];
	menuObject.$sizeInPatches ??= [ 0, 0 ];
	menuObject.$cellCursor ??= [ 0, 0 ];
	menuObject.$cursorItem ??= 0;
	menuObject.$cursorPos ??= [ 0, 0 ];
	
	menuObject.$setTable = function(w, h) { this.$cellTable = [ w, h ]; return this; }
	menuObject.$setID = function(id) { this.$id = id; return this; }
	menuObject.$enable = function(b) { this.$enabled = b; return this; }
	
	menuObject.$isEnabled = function() { return this.$enabled; }
	menuObject.$getID = function() { return this.$id; }
	menuObject.$getName = function() { return this.$name; }
	menuObject.$getSize = function() { return [ this.$name.length, 1 ]; }
	
	menuObject.$hasChildren = function() { return this.$items.length > 0; };
	menuObject.$items = [];
	
	menuObject.$onUp = function() {
		this.$cellCursor.y--;
		this.$maybeRowUp();
		this.$clampCursor();
	}
	menuObject.$onDown = function() {
		this.$cellCursor.y++;
		this.$maybeRowDown();
		this.$clampCursor();
	}
	menuObject.$onLeft = function() {
		this.$cellCursor.x--;
		this.$maybeRowUp();
		this.$clampCursor();
	}
	menuObject.$onRight = function() {
		this.$cellCursor.x++;
		this.$maybeRowDown();
		this.$clampCursor();
	}
	
	menuObject.$maybeRowUp = function() {
		if (this.$cellCursor.x < 0) { this.$cellCursor.y--; this.$cellCursor.x = this.$cellTable.x-1; }
		if (this.$cellCursor.y < this.$topVisibleRow) {
			this.$topVisibleRow = clamp(--this.$topVisibleRow, 0, this.$totalRows - this.$cellTable.y);
		}
	}
	menuObject.$maybeRowDown = function() {
		if (this.$cellCursor.x > this.$cellTable.x-1) { this.$cellCursor.y++; this.$cellCursor.x = 0; }
		if (this.$cellCursor.y > (this.$topVisibleRow + this.$cellTable.y - 1)) {
			this.$topVisibleRow = clamp(++this.$topVisibleRow, 0, this.$totalRows - this.$cellTable.y);
		}
	}
	menuObject.$clampCursor = function() {
		this.$cursorItem = this.$cellCursor.y * this.$cellTable.x + this.$cellCursor.x;
		if (this.$cursorItem >= this.$items.length) {
			this.$cursorItem = this.$items.length - 1;
			this.$cellCursor.x = this.$cursorItem % this.$cellTable.x;
			this.$cellCursor.y = Math.floor(this.$cursorItem / this.$cellTable.x);
		}
		if (this.$cursorItem < 0) {
			this.$cellCursor = [0,0]
			this.$cursorItem = 0;
		}
	}
	menuObject.$getSelected = function() {
		return this[this.$items[this.$cursorItem]];
	}
	menuObject.$onConfirm = function() {
		const selected = this.$getSelected();
		if (selected.$hasChildren()) {
			return selected;
		} else {
			return this;
		}
	}
	
	menuObject.$drawSelf = function(pge, gfx, offset) {
		const ox = offset.x;
		const oy = offset.y;
		const w = this.$sizeInPatches.x;
		const h = this.$sizeInPatches.y;
		const pos = [0,0]
		for (let x = 0; x < w; x++) {
			for (let y = 0; y < h; y++) {
				const screenLoc = [ x * NPATCH + ox, y * NPATCH + oy ]
				const srcPatch = [ 0, 0, NPATCH, NPATCH ]
				if (x > 0) { srcPatch.x = NPATCH; }
				if (x == w-1) { srcPatch.x = NPATCH * 2; }
				if (y > 0) { srcPatch.y = NPATCH; }
				if (y == h-1) { srcPatch.y = NPATCH * 2; }
				
				pge.drawPartialSprite(screenLoc, gfx, srcPatch);
			}
		}
		
		const cell = [ 0, 0 ];
		const cw = this.$cellSize.x;
		const ch = this.$cellSize.y;
		const pw = this.$cellPadding.x;
		const ph = this.$cellPadding.y;
		const topLeft = this.$topVisibleRow * this.$cellTable.x;
		const bottomRight = Math.min(this.$cellTable.y * this.$cellTable.x + topLeft, this.$items.length);
		const visibleItems = bottomRight - topLeft;
		
		// Draw scroll markers
		if (this.$topVisibleRow > 0) {
			pos.x = w - 2;
			pos.y = 0
			const screenLoc = [ pos.x * NPATCH + ox, pos.y * NPATCH + oy ];
			pge.drawPartialSprite(screenLoc, gfx, UP_ARROW);
		}
		if ((this.$totalRows - this.$topVisibleRow) > this.$cellTable.y) {
			pos.x = w - 2;
			pos.y = h - 1;
			const screenLoc = [ pos.x * NPATCH + ox, pos.y * NPATCH + oy ];
			pge.drawPartialSprite(screenLoc, gfx, DOWN_ARROW);
		}
		
		// draw visible items
		for (let i = 0; i < visibleItems; i++) {
			let key = this.$items[topLeft + i];
			let item = this[key];
			cell.x = i % this.$cellTable.x;
			cell.y = Math.floor(i / this.$cellTable.x);
			pos.x = cell.x * (cw + pw) + 1;
			pos.y = cell.y * (ch + ph) + 1;
			let screenLoc = [ pos.x * NPATCH + ox, pos.y * NPATCH + oy ];
			pge.drawText(screenLoc, key, item.$enabled ? WHITE : DARK_GRAY);
			
			if (item.$hasChildren()) {
				pos.x = cell.x * (cw + pw) + 1 + cw;
				pos.y = cell.y * (ch + ph) + 1;
				screenLoc = [ pos.x * NPATCH + ox, pos.y * NPATCH + oy ];
				pge.drawPartialSprite(screenLoc, gfx, RIGHT_ARROW);
			}
			
		}
		
		this.$cursorPos.x = (this.$cellCursor.x * (cw + pw)) * NPATCH + ox - NPATCH;
		this.$cursorPos.y = ((this.$cellCursor.y - this.$topVisibleRow) * (ch + ph)) * NPATCH + oy + NPATCH;
		
	}
	let cellW = 0;
	let cellH = 0;
	
	for (let key in menuObject) {
		if (key.startsWith("$")) { continue; }
		menuObject.$items.push(key);
		let v = menuObject[key];
		if (isObject(v)) {
			buildMenu(v, key);
		} else if (isNumber(v)) {
			v = menuObject[key] = { $id: v }
			buildMenu(v, key);
		}
		const sz = v.$getSize();
		cellW = Math.max(cellW, sz.x);
		cellH = Math.max(cellH, sz.y);
	}
	menuObject.$cellSize = [ cellW, cellH ];
	menuObject.$sizeInPatches = [
		menuObject.$cellTable.x * menuObject.$cellSize.x + (menuObject.$cellTable.x-1) * menuObject.$cellPadding.x + 2,
		menuObject.$cellTable.y * menuObject.$cellSize.y + (menuObject.$cellTable.y-1) * menuObject.$cellPadding.y + 2,
	]
	const len = menuObject.$items.length;
	const w = menuObject.$cellTable.x;
	menuObject.$totalRows = Math.floor(len / w) + (((len % w) > 0) ? 1 : 0);
	
}

