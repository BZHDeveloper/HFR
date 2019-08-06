// ==UserScript==
// @author        PetitJean
// @name          [HFR] Liste des modérateurs
// @version       0.0.4.2
// @namespace     forum.hardware.fr
// @description   affiche la liste des modérateurs HFR. noir si ils sont absents, vert si ils sont connectés.
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @downloadURL   https://gitlab.com/BZHDeveloper/HFR/raw/master/hfr-liste-moderateurs.user.js
// @downloadURL   https://gitlab.com/BZHDeveloper/HFR/raw/master/hfr-liste-moderateurs.user.js
// @updateURL     https://gitlab.com/BZHDeveloper/HFR/raw/master/hfr-liste-moderateurs.user.js
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/forum1f.php*
// @include       https://forum.hardware.fr/forum1.php*
// @include       https://forum.hardware.fr/hfr/*
// @noframes
// @grant         GM_info
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM.info
// @grant         GM.xmlHttpRequest
// ==/UserScript==

// Historique
// 0.0.2 : affichage de la liste des modérateurs en cliquant sur le texte "Liste des modérateurs"

function isGM4() {
	if (typeof (GM) !== "object")
		return false;
	if (typeof (GM.info) !== "object")
		return false;
	return GM.info.scriptHandler == "Greasemonkey" && parseFloat(GM.info.version) >= 4;
}

var HFR = {
	setValue : function (key, data) {
		if (!isGM4()) {
			GM_setValue (key, data);
			return;
		}
		if (typeof (data) === "object")
			localStorage.setItem (GM.info.script.name + " :: " + key, JSON.stringify (data));
		else
			localStorage.setItem (GM.info.script.name + " :: " + key, data);
	},
	getValue : function (key, default_value) {
		if (!isGM4())
			return GM_getValue (key, default_value);
		var rk = GM.info.script.name + " :: " + key;
		if (!localStorage.hasOwnProperty (key))
			return default_value;
		return localStorage.getItem (rk);
	}
};

function strReplaceAll (s, o, n) {
	var str = s;
	while (true) {
		if (str == str.replace (o, n))
			break;
		str = str.replace (o, n);
	}
	return str;
}

function array_contains (array, val) {
	for (var i = 0; i < array.length; i++)
		if (array[i].textContent == val.textContent)
			return true;
	return false;
}

function get_modo (handler) {
	fetch ("https://forum.hardware.fr/").then (function (response) {
		return response.text();
	}).then (function (text) {
		var doc = new DOMParser().parseFromString (text, "text/html");
		var modos = doc.querySelectorAll (".catCase4 > a");
		fetch ("https://forum.hardware.fr/hfr/online.htm").then (function (r) {
			return r.text();
		}).then (function (t) {
			var array = [];
			var d = new DOMParser().parseFromString (t, "text/html");
			var cnx = d.querySelectorAll (".cBackTab1 > .cLink");
			for (var i = 0; i < modos.length; i++) {
				var name = modos.item (i).textContent;
				if (array.includes (name))
					continue;
				array.push (name);
				var connected = array_contains (cnx, modos.item (i));
				handler (name, connected);
			}
		});
	});
}

var table = document.querySelector (".hfrheadmenu > tbody > tr > td > table > tbody > tr > td > table");
var tr = table.parentElement.parentElement;

var trh = document.createElement ("tr");
var tdh = document.createElement ("td");
tdh.appendChild (document.createElement ("hr"));
trh.appendChild (tdh);
tr.parentElement.appendChild (trh);

var tr1 = document.createElement ("tr");
var td = document.createElement ("td");
td.setAttribute ("style", "background-color:#006699");
var p = document.createElement ("p");
p.setAttribute ("style", "cursor : grabbing");
p.setAttribute ("class", "cHeader");
p.appendChild (document.createTextNode ("Liste des modérateurs ⇩"));
td.appendChild (p);
tr1.appendChild (td);
tr.parentElement.appendChild (tr1);

var tr2 = document.createElement ("tr");
td = document.createElement ("td");
td.setAttribute ("style", "display : none; background-color:#006699");
tr2.appendChild (td);
tr.parentElement.appendChild (tr2);

p.onclick = function() {
	if (td.style.display == "none") {
		td.style.display = "table";
		p.textContent = "Liste des modérateurs ⇧";
	}
	else {
		td.style.display = "none";
		p.textContent = "Liste des modérateurs ⇩";
	}
};

var count = 0;

get_modo (function (modo, connected) {
	if (count > 0)
		td.appendChild (document.createTextNode (", "));
	var link = document.createElement ("a");
	link.setAttribute ("target", "_blank");
	link.setAttribute ("style", "font-weight : bold; color : " + (connected ? "#22C61E" : "rgba(0, 0, 0, 0.6)"));
	link.setAttribute ("href", "http://forum.hardware.fr/profilebdd.php?config=hfr.inc&pseudo=" + encodeURIComponent (modo));
	link.appendChild (document.createTextNode (modo));
	td.appendChild (link);
	count++;
});
