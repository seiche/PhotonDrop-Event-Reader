/**
 * Photon Drop Binary Event File Reader
 *
 * Copyright (c) 2018 Benjamin Collins
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

"use strict";

const Objects = {
	"2" : "Teleport",
	"3" : "Warp",
	"8" : "Forest Plant",
	"e" : "RoomTrigger",
	"13" : "HealRing",
	"19" : "BossTeleport",
	"40" : "ShopCounter",
	"41" : "Telepipe",
	"43" : "StageSelect",
	"44" : "LobbyTeleport",
	"45" : "CityWarp",
	"46" : "ItemShopDoor",
	"47" : "HunterGuildDoor",
	"48" : "StageDoor",
	"49" : "MedicalCenter",
	"80" : "ForestDoor",
	"81" : "DoorSwitch",
	"82" : "LaserFence",
	"83" : "SquareLaserFence",
	"84" : "FenceSwitch",
	"87" : "Broken Speed Bike",
	"8d" : "MessageLog",
	"8e" : "LaserDoor",
	"88" : "Box",
	"92" : "HighBox",
	"c0" : "FloorSwitch",
	"c1" : "SwitchDoor",
	"c2" : "CavesDoor",
	"c3" : "CavesCrusher",
	"c4" : "CavesSign",
	"ce" : "CavesSwitchDoor",
	"d3" : "Caves01Rocks",
	"d5" : "Caves02Rocks",
	"dc" : "Caves03Rocks",
	"100" : "MinesDoor",
	"101" : "MinesFloorSwitch",
	"102" : "MinesSwitchDoor",
	"10c" : "MinesCargo",
	"140" : "RuinsTeleport",
	"156" : "Monument"
};

const Teleports = {
	// Forest
	"8cfbdf00" : "nm_pioneer2.json",  // Forest 01 -> Pioneer 2
	"8cfa4e30" : "nm_forest_02.json", // Forest 01 -> Forest 02
	"8cfa2b40" : "nm_forest_01.json", // Forest 02 -> Forest 01
	"8cfaa190" : "nm_boss_01.json",   // Forest 02 -> Forest Boss
	"8cfa37d0" : "nm_pioneer2.json",  // Forest Boss -> Pioneer 2
	// Caves
	"8cfa45c0" : "nm_pioneer2.json",  // Caves 01 -> Pioneer 2
	"8cfb5da0" : "nm_caves_02.json",  // Caves 01 -> Caves 02,
	"8cfa2fb0" : "nm_caves_03.json",  // Caves 02 -> Caves 03
	"8cfa4a10" : "nm_caves_01.json",  // Caves 02 -> Caves 03
	"8cfa67d0" : "nm_caves_02.json",  // Caves 03 -> Caves 02
	"8cfc0510" : "nm_boss_02.json",   // Caves 03 -> Boss 02
	"8cfac040" : "nm_pioneer2.json",  // Boss 02 -> Pioneer 2
	// Mines
	"8cfa3a30" : "nm_pioneer2.json",  // Mines 01 -> Pioneer 2
	"8cfa41b0" : "nm_mines_02.json",  // Mines 01 -> Mines 02
	"8cfa78f0" : "nm_mines_01.json",  // Mines 02 -> Mines 01
	"8cfc2d90" : "nm_boss_03.json",   // Mines 02 -> Boss 03
	"8cfa36b0" : "nm_pioneer2.json",  // Boss 03 -> Pioneer 2
	"8cfa3050" : "nm_pioneer2.json",  // Boss 03 -> Pioneer 2
	// Ruins
	"8cfa33f0" : "nm_pioneer2.json",  // Ruins 01 -> Pioneer2
	"8cfab140" : "nm_ruins_02.json",  // Ruins 01 -> Ruins 02
	"8cfa55f0" : "nm_ruins_01.json",  // Ruins 02 -> Ruins 01
	"8cfa65c0" : "nm_ruins_03.json",  // Ruins 02 -> Ruins 03
	"8cfa3850" : "nm_ruins_02.json",  // Ruins 03 -> Ruins 02
	"8cfa60b0" : "nm_boss_04.json",   // Ruins 03 -> Boss 04,
	// Dark Falz
	"8cfa5c60" : "nm_pioneer2.json",  // Boss 04 -> Pioneer 2
	"8cf969d0" : "nm_pioneer2.json",  // Boss 04 -> Pioneer 2
	"8cfa7fe0" : "nm_pioneer2.json"   // Boss 04 -> Pioneer 2
};

const Enemies = {
	"41" : "Rappy",
	"42" : "Monest",
	"43" : "SavageWolf",
	"44" : "Booma",
}

Array.prototype.sortOn = function(key){
	this.sort(function(a, b){
		if(a[key] < b[key]){
			return -1;
		}else if(a[key] > b[key]){
			return 1;
		}
		return 0;
	});
}

const EventReader = function() {

	this.sections = {};
	this.output = {
		meta : {},
		sections : [],
		objects : [],
		enemies : []
	};

}

EventReader.prototype = {

	constructor : EventReader,

	setStage : function(url) {

		this.output.meta.stage = url;

	},

	readSections : function(buffer) {

		this.view = new DataView(buffer);
		this.len = buffer.byteLength;

		let headerOfs = this.view.getUint32(this.len - 16, true);
		let nbSections = this.view.getUint32(headerOfs + 0, true);
		let sectionOfs = this.view.getUint32(headerOfs + 8, true);

		let ofs = sectionOfs;
		for(let i = 0; i < nbSections; i++) {

			let id = this.view.getInt32(ofs + 0, true);
			if(id === -1) {
				ofs += 0x3c;
				continue;
			}

			let pos = {
				x : this.view.getFloat32(ofs + 4, true),
				y : this.view.getFloat32(ofs + 8, true),
				z : this.view.getFloat32(ofs + 12, true)
			};

			let rot = {
				x : this.view.getInt32(ofs + 16, true) * (2 * Math.PI / 0xFFFF),
				y : this.view.getInt32(ofs + 20, true) * (2 * Math.PI / 0xFFFF),
				z : this.view.getInt32(ofs + 24, true) * (2 * Math.PI / 0xFFFF)
			};

			let bone = new THREE.Bone();

			var xRotMatrix = new THREE.Matrix4();
			xRotMatrix.makeRotationX(rot.x);
			bone.applyMatrix(xRotMatrix);

			var yRotMatrix = new THREE.Matrix4();
			yRotMatrix.makeRotationY(rot.y);
			bone.applyMatrix(yRotMatrix);

			var zRotMatrix = new THREE.Matrix4();
			zRotMatrix.makeRotationZ(rot.z);
			bone.applyMatrix(zRotMatrix);

			bone.position.x = pos.x;
			bone.position.y = pos.y;
			bone.position.z = pos.z;

			bone.updateMatrix();
			bone.updateMatrixWorld();

			this.sections[id.toString(16)] = bone;

			ofs += 0x3c;

			this.output.sections.push({
				id : id,
				pos : pos
			});

		}

	},

	readSpawns : function(buffer) {
		
		this.view = new DataView(buffer);
		this.len = buffer.byteLength;

		this.output.meta.spawn = {};
		this.output.meta.spawn.start = [];
		this.output.meta.spawn.end = [];

		for(let ofs = 0; ofs < this.len; ofs += 0x44) {

			let resource = this.view.getUint16(ofs, true);

			if(resource) {
				continue;
			}

			let section = this.view.getInt16(ofs + 12, true);
			let bone = this.sections[section.toString(16)];

			let direction = this.view.getUint32(ofs + 52, true);
			let ptr = this.output.meta.spawn.start;
			if(direction !== 0) {
				ptr = this.output.meta.spawn.end;
			}

			let pos = {
				x : this.view.getFloat32(ofs + 16, true),
				y : this.view.getFloat32(ofs + 20, true),
				z : this.view.getFloat32(ofs + 24, true)
			};

			let rot = {
				x : this.view.getInt32(ofs + 28, true) * (2 * Math.PI / 0xFFFF),
				y : this.view.getInt32(ofs + 32, true) * (2 * Math.PI / 0xFFFF),
				z : this.view.getInt32(ofs + 36, true) * (2 * Math.PI / 0xFFFF)
			};

			let player = this.view.getFloat32(ofs + 40, true);
			let slot = parseInt(player);

			let spawn = this.transformPoint(pos, rot, bone);
			spawn.sectionId = section;
			ptr[slot] = spawn;
			
		}

	},

	readObjects : function(buffer) {
		
		this.view = new DataView(buffer);
		this.len = buffer.byteLength;

		let locked_doors = [];

		for(let ofs = 0; ofs < this.len; ofs += 0x44) {

			let resource = this.view.getUint16(ofs, true);

			if(resource === 0) {
				continue;
			}

			let type = Objects[resource.toString(16)];

			if(!type) {
				console.log(resource.toString(16));
				continue;
			}

			let section = this.view.getInt16(ofs + 12, true);
			let bone = this.sections[section.toString(16)];

			let pos = {
				x : this.view.getFloat32(ofs + 16, true),
				y : this.view.getFloat32(ofs + 20, true),
				z : this.view.getFloat32(ofs + 24, true)
			};

			let rot = {
				x : this.view.getInt32(ofs + 28, true) * (2 * Math.PI / 0xFFFF),
				y : this.view.getInt32(ofs + 32, true) * (2 * Math.PI / 0xFFFF),
				z : this.view.getInt32(ofs + 36, true) * (2 * Math.PI / 0xFFFF)
			};

			let obj = this.transformPoint(pos, rot, bone);
			obj.type = type;
			obj.sectionId = section;

			let serial = this.view.getUint32(ofs + 4, true);
			let number = this.view.getUint32(ofs + 52, true);
			let zero = this.view.getUint32(ofs + 56, true);
			let symbol = this.view.getUint32(ofs + 60, true);
			let point = {
				x : this.view.getFloat32(ofs + 40, true),
				y : this.view.getFloat32(ofs + 44, true),
				z : this.view.getFloat32(ofs + 48, true)
			}
			let uuid = this.view.getUint32(ofs + 64, true).toString(16);
			
			switch(type) {
			case "ShopCounter":

				obj.param = {
					serial : serial
				};

				break;
			case "DoorSwitch":
				
				obj.params = {
					symbol : symbol,
					id : number & 0xff
				};
				
				locked_doors.push(obj.params.id);


				break;
			case "FenceSwitch":
				
				obj.params = {
					color : number % 4,
					number : number,
					id : number
				};

				break;
			case "LaserFence":
			case "SquareLaserFence":
				
				if(symbol === 0) {
					obj.type = "4m" + type;
				} else {
					obj.type = "6m" + type;
				}
				obj.params = {
					color : number % 4,
					id : number
				};

				break;
			case "FloorSwitch":
			case "MinesFloorSwitch":
					
					obj.params = {
						id : parseInt(number/10)*10,
						index : number % 10
					};

				break;
			case "SwitchDoor":

				obj.params = {
					keys : zero,
					id : number
				};
				
				break;
			case "LaserDoor":
			case "ForestDoor":
			case "CavesDoor":
			case "CavesSwitchDoor":
				
				obj.params = {
					symbol : (number >> 8) % 10,
					id : number & 0xff,
					isDoor : true
				};

				break;
			case "CityWarp":
			case "Warp":

				obj.params = {
					coords : point
				}

				break;
			case "RuinsTeleport":
			case "Teleport":

				obj.params = {
					direction : symbol === 0 ? "prev" : "next",
					set : Teleports[uuid]
				}

				break;
			case "RoomTrigger":
				
				continue;

				break;
			}

			this.output.objects.push(obj);
				

		}

		locked_doors.forEach( id => {
			
			for(let i = 0; i < this.output.objects.length; i++) {
				
				if(!this.output.objects[i].params) {
					continue;
				}

				if(!this.output.objects[i].params.isDoor) {
					continue;
				}

				if(this.output.objects[i].params.id !== id) {
					continue;
				}

				this.output.objects[i].params.locked = true;

			}

		});

		this.output.objects.sortOn("class");

	},

	readEnemies : function(buffer) {

		this.view = new DataView(buffer);
		this.len = buffer.byteLength;

		for(let ofs = 0; ofs < this.len; ofs += 0x48) {

			const enemy = {
				resource : this.view.getUint32(ofs + 0, true),
				zero : this.view.getInt32(ofs + 4, true),
				nums : [
					this.view.getUint16(ofs + 8, true),
					this.view.getUint16(ofs + 10, true),
				],
				section : this.view.getUint16(ofs + 12, true),
				wave : this.view.getUint16(ofs + 14, true),
				one : this.view.getUint32(ofs + 16, true),
				pos : {
					x : this.view.getFloat32(ofs + 20, true),
					y : this.view.getFloat32(ofs + 24, true),
					z : this.view.getFloat32(ofs + 28, true),
				},
				rot : {
					x : this.view.getInt32(ofs + 32, true) * (2 * Math.PI / 0xFFFF),
					y : this.view.getInt32(ofs + 36, true) * (2 * Math.PI / 0xFFFF),
					z : this.view.getInt32(ofs + 40, true) * (2 * Math.PI / 0xFFFF),
				},
				scl : {
					x : this.view.getFloat32(ofs + 44, true),
					y : this.view.getFloat32(ofs + 48, true),
					z : this.view.getFloat32(ofs + 52, true),
				},
				a : this.view.getUint32(ofs + 56, true),
				b : this.view.getUint32(ofs + 60, true),
				level : this.view.getUint32(ofs + 64, true),
				unknown : this.view.getFloat32(ofs + 68, true)
			};
			
			let key = enemy.resource.toString(16);
			if(!Enemies[key]) {
				console.log("Unknown enemy type: 0x%s", key);
			}
			
			let bone = this.sections[enemy.section.toString(16)];
			let obj = this.transformPoint(enemy.pos, enemy.rot, bone);
			obj.type = Enemies[key];
			obj.sectionId = enemy.section;
			obj.wave = enemy.wave;
			
			if(obj.type === "Booma") {
				switch(enemy.level) {
				case 1:
					obj.type = "Gobooma";
					break;
				case 2:
					obj.type = "Gigabooma";
					break;
				}
			} else if(obj.type === "SavageWolf") {
				switch(enemy.level) {
				case 1:
					obj.type = "BarbarousWolf";
					break;
				}
			}

			this.output.enemies.push(obj);

		}

	},

	getOutput : function() {

		let str = JSON.stringify(this.output, null, "\t");
		return str;

	},

	transformPoint(pos, rot, bone) {

		let obj = new THREE.Object3D();

		var xRotMatrix = new THREE.Matrix4();
		xRotMatrix.makeRotationX(rot.x);
		obj.applyMatrix(xRotMatrix);

		var yRotMatrix = new THREE.Matrix4();
		yRotMatrix.makeRotationY(rot.y);
		obj.applyMatrix(yRotMatrix);

		var zRotMatrix = new THREE.Matrix4();
		zRotMatrix.makeRotationZ(rot.z);
		obj.applyMatrix(zRotMatrix);

		obj.position.x = pos.x;
		obj.position.y = pos.y;
		obj.position.z = pos.z;
			
		obj.updateMatrix();
		obj.updateMatrixWorld();
			
		obj.applyMatrix(bone.matrix);
		obj.updateMatrix();
		obj.updateMatrixWorld();

		return {
			pos : {
				x : obj.position.x,
				y : obj.position.y,
				z : obj.position.z
			},
			rot : {
				x : obj.rotation.x,
				y : obj.rotation.y,
				z : obj.rotation.z
			}
		};

	}

}
