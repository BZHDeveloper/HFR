// ==UserScript==
// @author PetitJean
// @name [HFR] auto reho.st
// @version 0.0.2
// @namespace http://breizhodrome.wordpress.com
// @description auto rehost des images.
// @downloadURL   https://gist.github.com/raw/369bfeaaa9b561754997820f5a5bdf42/hfr_auto_rehost.user.js
// @updateURL     https://gist.github.com/raw/369bfeaaa9b561754997820f5a5bdf42/hfr_auto_rehost.user.js
// @include https://forum.hardware.fr/*
// @exclude https://forum.hardware.fr/message.php*
// @exclude https://forum.hardware.fr/forum1.php*
// @exclude https://forum.hardware.fr/forum1f.php*
// @grant GM_info
// @grant GM_deleteValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_addStyle
// @grant GM_log
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// ==/UserScript==

var imgs = document.getElementsByTagName ("img");
for (var i = 0; i < imgs.length; i++) {
	if (imgs[i].src.indexOf ("https://forum-images.hardware.fr") != 0 &&
		imgs[i].src.indexOf ("https://forum.hardware.fr") != 0 &&
		imgs[i].src.indexOf ("https://reho.st") != 0 &&
		imgs[i].src.indexOf ("data:image") != 0 &&
		imgs[i].src.indexOf ("xiti.com") < 0) {
			imgs[i].src = "https://reho.st/preview/" + imgs[i].src;
		}
}
