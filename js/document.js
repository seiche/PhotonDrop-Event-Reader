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

const filelist = document.getElementById("filelist");
const textarea = document.getElementById("textarea");
const download = document.getElementById("download");
const breadcrumb = document.getElementById("breadcrumb");

const db = {
	
	files : {

		get : function(query) {

			return new Promise( (resolve, reject) => {

				let ajax = new XMLHttpRequest();
				ajax.open("GET", "data/" + query.name.toUpperCase());
				ajax.responseType = 'arraybuffer';
				ajax.send();

				ajax.onload = function() {
					
					resolve({
						name : query.name,
						data : ajax.response
					});

				}

			});

		}

	}

}

document.addEventListener("DOMContentLoaded", function() {

	filelist.children[0].click();

});

filelist.addEventListener("click", async function(evt) {

	let elem = evt.target;
	while(elem && elem.tagName !== "LI") {
		elem = elem.parentNode;
	}

	if(!elem) {
		return;
	}

	let index = -1;

	let inputs = document.getElementsByTagName("input");
	for(let i = 0; i < inputs.length; i++) {
		inputs[i].checked = false;
	}

	let active = document.getElementsByTagName("li");

	for(let i = 0; i < active.length; i++) {
		
		if(active[i] === elem) {
			index = i;
		}
		
		active[i].classList.remove("active");
	}

	if(index !== -1) {
		inputs[index].checked = true;
	}

	elem.classList.add("active");
	breadcrumb.textContent = elem.textContent;

	let url = elem.getAttribute("data-url");
	let files = lookup[url];
	
	if(!files) {
		return;
	}

	download.setAttribute("data-filename", files.filename);

	// Set Stage

	let reader = new EventReader();
	reader.setStage(files.stage);

	// Set Sections

	let sections = await db.files.get({name:files.sections});
	if(!sections) {
		return;
	}
	reader.readSections(sections.data);

	// Set Spawn & Objects
	
	let objects = await db.files.get({name:files.objects});
	let enemies = await db.files.get({name:files.enemies});

	reader.readSpawns(objects.data);
	reader.readObjects(objects.data);
	reader.readEnemies(enemies.data);

	// Set Output

	textarea.textContent = reader.getOutput();

});

download.addEventListener("click", function() {

	let filename = download.getAttribute("data-filename");
	if(!filename) {
		return;
	}

	console.log(filename);
	
	var blob = new Blob([textarea.textContent], {type: "text/plain;charset=utf-8"});
	saveAs(blob, filename);

});

