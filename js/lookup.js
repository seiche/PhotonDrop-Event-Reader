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

const lookup = {

	"forest01" : {
		"filename" : "nm_forest_01.json",
		"stage" : "forest_01.njp",
		"sections" : "map_forest01d.rel",
		"objects" : "map_forest01_00o.dat",
		"enemies" : "map_forest01_00_offe.dat"
	},

	"forest02" : {
		"filename" : "nm_forest_02.json",
		"stage" : "forest_02.njp",
		"sections" : "map_forest02d.rel",
		"objects" : "map_forest02_00o.dat",
		"enemies" : "map_forest02_00_offe.dat"
	},

	"caves01" : {
		"filename" : "nm_caves_01.json",
		"stage" : "caves_01_00.njp",
		"sections" : "map_cave01_00d.rel",
		"objects" : "map_cave01_00_00o.dat",
		"enemies" : "map_cave01_00_00_offe.dat"
	},

	"caves02" : {
		"filename" : "nm_caves_02.json",
		"stage" : "caves_02_00.njp",
		"sections" : "map_cave02_00d.rel",
		"objects" : "map_cave02_00_00o.dat",
		"enemies" : "map_cave02_00_00_offe.dat"
	},

	"caves03" : {
		"filename" : "nm_caves_03.json",
		"stage" : "caves_03_00.njp",
		"sections" : "map_cave03_00d.rel",
		"objects" : "map_cave03_00_00o.dat",
		"enemies" : "map_cave03_00_00_offe.dat"
	},

	"mines01" : {
		"filename" : "nm_mines_01.json",
		"stage" : "mines_01_00.njp",
		"sections" : "map_machine01_00d.rel",
		"objects" : "map_machine01_00_00o.dat",
		"enemies" : "map_machine01_00_00e.dat"
	},

	"mines02" : {
		"filename" : "nm_mines_02.json",
		"stage" : "mines_02_00.njp",
		"sections" : "map_machine02_00d.rel",
		"objects" : "map_machine02_00_00o.dat",
		"enemies" : "map_machine02_00_00e.dat"
	},

	"ruins01" : {
		"filename" : "nm_ruins_01.json",
		"stage" : "ruins_01_00.njp",
		"sections" : "map_ancient01_00d.rel",
		"objects" : "map_ancient01_00_00o.dat",
		"enemies" : "map_ancient01_00_00e.dat"
	},

	"ruins02" : {
		"filename" : "nm_ruins_02.json",
		"stage" : "ruins_02_00.njp",
		"sections" : "map_ancient02_00d.rel",
		"objects" : "map_ancient02_00_00o.dat",
		"enemies" : "map_ancient02_00_00e.dat"
	},

	"ruins03" : {
		"filename" : "nm_ruins_03.json",
		"stage" : "ruins_03_00.njp",
		"sections" : "map_ancient03_00d.rel",
		"objects" : "map_ancient03_00_00o.dat",
		"enemies" : "map_ancient03_00_00e.dat"
	}

}
