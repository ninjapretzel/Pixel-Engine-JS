
let whiteMag = 4001;
let blackMag = 5001;
let items = 3001;
const menu = {
	$cellTable: [ 1,4 ], 
	Attack: 1000,
	Magic: {
		$cellTable: [ 1, 2 ],
		White: {
			$cellTable: [ 3, 4 ],
			Cure: whiteMag++,
			Cura: whiteMag++,
			Curaga: whiteMag++,
			Life: whiteMag++,
			Holy: whiteMag++,
			Ultima: whiteMag++,
			Esuna: whiteMag++,
			Basuna: whiteMag++,
			Haste: whiteMag++,
			Slow: whiteMag++,
			Blink: whiteMag++,
			Mini: whiteMag++,
			Shell: whiteMag++,
			Wall: whiteMag++,
			Sap: whiteMag++,
			Fog: whiteMag++,
			Fear: whiteMag++,
			Warp: whiteMag++,
			
		},
		Black: { 
			$cellTable: [ 3, 6 ],
			Fire: blackMag++,
			Fira: blackMag++,
			Firaga: blackMag++,
			Thunder: blackMag++,
			Thundara: blackMag++,
			Thundaga: blackMag++,
			Blizzard: blackMag++,
			Blizzara: blackMag++,
			Blizzaga: blackMag++,
			Quake: blackMag++,
			Quake2: blackMag++,
			Quake3: blackMag++,
			HalfLife: blackMag++,
			HalfLife2: blackMag++,
			HalfLife3: { $enabled:false, $id: blackMag++},
			Bio: blackMag++,
			Bio2: blackMag++,
			Bio3: blackMag++,
			Demi: blackMag++,
			Demi2: blackMag++,
			Demi3: blackMag++,
			Drain: blackMag++,
			Osmose: blackMag++,
			Sleep: blackMag++,
			Stun: blackMag++,
			Stop: blackMag++,
			Confuse: blackMag++,
			Blind: blackMag++,
			Curse: blackMag++,
			Toad: blackMag++,
			Break: blackMag++,
			Death: blackMag++,
			Berserk: blackMag++,
			Aura: blackMag++,
			Flare: blackMag++,
			
		}
	},
	Defend: 1002,
	Items: {
		$cellTable: [ 2, 4],
		Potion: items++,
		Ether: items++,
		"Hi-Potion": items++,
		Elixir: items++,
		SleepingBag: { $enabled: false, $id:items++ },
		Tent: { $enabled: false, $id:items++ },
		Cottage: { $enabled: false, $id:items++ },
		
	},
	Escape: 1004,
}
buildMenu(menu);
console.log(menu);


const canvas = document.getElementById("main");
const mm = new MenuManager();

class MenuGame extends Game {
	update() {
		this.clear(BLACK);
		// this.drawText([1,1], "the quick brown fox\njumps over the\nlazy dog", WHITE);
		// this.drawText(mousePos(), "the quick brown fox\njumps over the\nlazy dog", WHITE);
		// this.drawSprite([0,0], skin);
		if (this.keyPressed('c')) { mm.open(menu); }
		
		if (this.keyPressed('ArrowUp')) { mm.onUp(); }
		if (this.keyPressed('ArrowDown')) { mm.onDown(); }
		if (this.keyPressed('ArrowLeft')) { mm.onLeft(); }
		if (this.keyPressed('ArrowRight')) { mm.onRight(); }
		let command = null;
		if (this.keyPressed('z')) { command = mm.onConfirm(); }
		if (this.keyPressed('x')) { mm.onBack(); }
		
		if (command != null) {
			this.lastAction = `Selected: ${command.$name} ID:${command.$id}`
			mm.close();
		}
		
		mm.draw(this, defaultMenuSkin, [ 10, 10 ] );
		if (this.lastAction) {
			this.drawText([10,160], this.lastAction, WHITE);
		}
		this.drawText([10, 200], `Press 'C' to open the menu
Press 'Z' to confirm
Press 'X' to cancel
Use arrow keys to navigate`, WHITE);
		
		
		//this.drawPartialSprite([64, 64], skin, [0,0,24,24]);
		
		//main.$drawSelf(this, skin, [10,64]);
	}
}
const game = new MenuGame(canvas, 2);
