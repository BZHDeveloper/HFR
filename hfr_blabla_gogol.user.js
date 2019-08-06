// ==UserScript==
// @author        PetitJean
// @name          [HFR] blabla-gogol
// @version       0.0.96
// @namespace     forum.hardware.fr
// @description   remplace chaque post de gogols par un chaton kawaii
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @downloadURL   https://gitlab.com/BZHDeveloper/HFR/raw/master/hfr_blabla_gogol.user.js
// @updateURL     https://gitlab.com/BZHDeveloper/HFR/raw/master/hfr_blabla_gogol.user.js
// @require       https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/forum1.php*
// @include       https://forum.hardware.fr/hfr/*
// @include       https://forum.hardware.fr/
// @noframes
// @grant         GM_info
// @grant         GM_deleteValue
// @grant         GM_getValue
// @grant         GM_listValues
// @grant         GM_setValue
// @grant         GM_getResourceText
// @grant         GM_getResourceURL
// @grant         GM_addStyle
// @grant         GM_log
// @grant         GM_openInTab
// @grant         GM_registerMenuCommand
// @grant         GM_setClipboard
// @grant         GM_xmlhttpRequest
// ==/UserScript==

// Historique
// 0.0.92 : Mise en place d'une liste des pseudos définis par l'utilisateur. Suppression du status associé au pseudo.
// 0.0.93 : problème des citations réglé.
// 0.0.94 : Compatibilité affichage traditionnel des citations (ou non).
// 0.0.95 : La compatibilité GM4 serait mieux avec le polyfill, hein.
// 0.0.96 : Ajout des pages des catégories.

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
		if (!localStorage.hasOwnProperty (rk))
			return default_value;
		var data = localStorage.getItem (rk);
		try {
			var obj = JSON.parse (data);
			return obj;
		}
		catch(e) {}
		return data;	
	}
};

GM_registerMenuCommand("[HFR] blabla-gogol -> Liste des pseudos", function() {
	var param = prompt ("Entrez ici la liste des pseudos indésirables (séparés par le symbole | . exemple : 'un|deux|trois')", HFR.getValue ("hfr-blabla-gogol-liste", ""));
	HFR.setValue ("hfr-blabla-gogol-liste", param);
});

var arr = HFR.getValue ("hfr-blabla-gogol-liste", "").split ("|");
var list = [];
for (var i = 0; i < arr.length; i++)
	if (arr[i].length > 0)
		list.push (arr[i].trim().toLowerCase());

var cases = document.querySelectorAll (".sujetCase9 > a > b");
for (var i = 0; i < cases.length; i++) {
	var pseudo = cases.item (i).textContent.replace ("\u200B", "").toLowerCase();
	if (list.includes (pseudo))
		cases.item (i).textContent = "kawaii";
}

cases = document.querySelectorAll (".catCase3 > b");
for (var i = 0; i < cases.length; i++) {
	var pseudo = cases.item (i).textContent.replace ("\u200B", "").toLowerCase().substring (3).trim();
	if (list.includes (pseudo))
		cases.item (i).textContent = "par kawaii";
}	
		
var messages = document.querySelectorAll (".message");
for (var i = 0; i < messages.length; i++) {
	var message = messages.item (i);
	var pseudo = message.querySelector(".s2").textContent.replace ("\u200B", "").toLowerCase();
	if (list.includes (pseudo)) {
		message.querySelector(".s2").textContent = "kawaii !!!";
		var ac = message.querySelector(".avatar_center");
		if (ac != null)
			ac.querySelector ("img").setAttribute ("src", "http://reho.st/self/c5dda7045660dc87126590ddc0d646025f0f423c.png");
		var status = message.querySelector (".MoodStatus");
		if (status != null)
			status.parentElement.removeChild (status);
		message.querySelector (".messCase2").querySelector("p").parentElement.innerHTML = "<img src=\"http://forum-images.hardware.fr/images/perso/killall-9.gif\" />";
	}
}
var q = document.querySelectorAll (".s1");
for (var i = 0; i < q.length; i++) {
	var qt = q.item (i);
	if (qt.querySelector ("a") == null)
		continue;
	var text = qt.querySelector("a").textContent.toLowerCase();
	if (text.indexOf ("a écrit :") < 0)
		continue;
	var old = qt.parentElement.parentElement.parentElement.parentElement.classList.contains ("oldcitation");
	var pseudo = qt.querySelector("a").textContent.replace ("\u200B", "").split ("a écrit")[0].trim().toLowerCase();
	if (list.includes (pseudo)) {
		qt.querySelector("a").textContent = "kawaii a écrit :";
		var td = qt.parentElement;
		while (td.firstChild != null)
			td.removeChild (td.firstChild);
		td.appendChild (qt);
		if (old) {
			var hr = document.createElement ("hr");
			hr.setAttribute ("size", "1");
			td.appendChild (hr);
		} else {
			td.appendChild (document.createElement ("br"));
			td.appendChild (document.createElement ("br"));
		}
		var img = document.createElement ("img");
		img.setAttribute ("src", "http://forum-images.hardware.fr/images/perso/killall-9.gif");
		td.appendChild (img);
		if (old) {
			hr = document.createElement ("hr");
			hr.setAttribute ("size", "1");
			td.appendChild (hr);
		}
	}
}
