// ==UserScript==
// @name [HFR] Alerte Qualitaÿ - mod chrome
// @version 0.1.5.3
// @namespace http://toyonos.info
// @description Permet de signaler une alerte qualitaÿ à la communauté
// @downloadURL   https://gitlab.com/BZHDeveloper/HFR/raw/master/hfr_alerte_qualitay_mod_chrome.user.js
// @updateURL     https://gitlab.com/BZHDeveloper/HFR/raw/master/hfr_alerte_qualitay_mod_chrome.user.js
// @include https://forum.hardware.fr/*
// @exclude https://forum.hardware.fr/message.php*
// @exclude https://forum.hardware.fr/forum*cat=prive*
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
// @grant GM_registerMenuCommand
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// ==/UserScript==


// 0.1.5.3 (26/05/2019) :
// Fork du script original pour une compatibilité chrome
// historique modifs r21 :
// 0.1.5.2 (10/12/2017) :
// - commentage des alert XML
// 0.1.5.1 (03/12/2017) :
// - passage au https


var cssManager = 
{
	cssContent : '',
	
	addCssProperties : function (properties)
	{
		cssManager.cssContent += properties;
	},
	
	insertStyle : function()
	{
		GM_addStyle(cssManager.cssContent);
		cssManager.cssContent = '';
	}
};

({
	getElementByXpath : function (path, element)
	{
		var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
		for (;item = xpr.iterateNext();) arr.push(item);
		return arr;
	},
	
	readCookie : function (name)
	{
		var begin = document.cookie.indexOf(name + '=');
		if (begin >= 0)
		{
			begin += name.length + 1;
			var end = document.cookie.indexOf(';', begin);
			return decodeURIComponent(document.cookie.substring(begin, end == -1 ? document.cookie.length : end));
		}
		else return null;
	},
	
	get imgUrl()
	{
		return GM_getValue('hfr_aq_imgUrl', '');	
	},
	
	setImgUrl : function()
	{
		var imgUrl = prompt("Url de l'image ? (vide = image par défault)", this.imgUrl);
		if (imgUrl == null) imgUrl = '';
		GM_setValue('hfr_aq_imgUrl', imgUrl);	
	},
	
	getAlertesUrl : 'http://alerte-qualitay.toyonos.info/api/getAlertesByTopic.php5',
	
	addAlertesUrl : 'http://alerte-qualitay.toyonos.info/api/addAlerte.php5',
	
	nomAlerteDV : "Nom de l'alerte",
	
	comAlerteDV : "Commentaire (facultatif)",
	
	currentPostId : null,
	
	currentPostUrl : null,

	generateStyle : function()
	{
		cssManager.addCssProperties("#alerte_qualitay {position: absolute; border: 1px solid black; background: white; z-index: 1001; text-align: left; padding-bottom: 5px;}");
		cssManager.addCssProperties("#alerte_qualitay select, #alerte_qualitay input[type=text], #alerte_qualitay textarea {display: block; margin: 5px; font-size: 1.1em;}");
		cssManager.addCssProperties("#alerte_qualitay select {font-weight: bold;}");
		cssManager.addCssProperties("#alerte_qualitay input[type=text], #alerte_qualitay textarea {margin-top: 0;}");
		cssManager.addCssProperties("#alerte_qualitay input[type=image] {margin-right: 5px; float: right;}");
		cssManager.addCssProperties("#alerte_qualitay p {font-size: 0.95em; margin: 0; margin-left: 5px; margin-right: 5px; text-align: justify; width: 100%;}");
	},
	
	generatePopup : function(topicId)
	{
		var self = this;
		
		var newDiv = document.createElement('div');
		newDiv.setAttribute('id', 'alerte_qualitay');
		newDiv.className = 'signature';
		
		var inputNom = document.createElement('input');
		inputNom.type = 'text';
		inputNom.tabIndex = 2;
		inputNom.value = self.nomAlerteDV;
		inputNom.addEventListener('focus', function(){ if (this.value == self.nomAlerteDV) this.value = ''; }, false);
		inputNom.style.width = '300px';
		
		var inputCom = document.createElement('textarea');
		inputCom.tabIndex = 3;
		inputCom.rows = 3;
		inputCom.value = self.comAlerteDV;
		inputCom.addEventListener('focus', function(){ if (this.value == self.comAlerteDV) this.value = ''; }, false);
		inputCom.style.width = '300px';
		
		var inputOk = document.createElement('input');
		inputOk.type = 'image';
		inputOk.tabIndex = 4;
		inputOk.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%9FIDAT8%CB%A5%93%EBKSa%1C%C7%FD%3Bv%CEvl%03%09dD!%82%84P%7B%15%24%12%3B%9A%0D%C5%BC%2CK%D3%DD%BD%D26c%D8L%8B2r%5E%C6H)-%B3%D4jsNm%EA%D4%E6%D6%942q%D9QB%CC%BD%E9B%B5at%B1o%E7%EC%C5L%12%23z%E0%0B%0F%0F%CF%E7%F3%7B%AEq%00%E2%FE'%7F%0C%14%F8%0E%89r%A7%0F%EA%B3%3D)L%C6%E3%FDa%E9%888%2Cu%252Rg%A2%3E%DD%BEW%B4%AB%20%CF%9BJ%CB%3C%C9!%9DG%86%9BA%0B%FA%96%BB%A2%E9%5ClF%89%EB%18%24%BDTH%D2C%D1%3B%0A%D8%AAt%E6xR%E4%EA%9C%11%CE%D5~%D8%5E%5E%83i%AE2%1A%AE%EFX%EDC%E3L%15%0E%D8%F8%91d%1B%9F%DE%26%C8%F1%A4%083%DDI%EB%1C%CCM%AC%09%94%A1%C2_%02%CD%CC%19%E8%D8%94%B3%A9%F6%9D%85%FD%F5%3D%5C%9C%AA%80%D8B%AE%8B%AF%93%C2%98%40%E6N2%A8%C6%B2%A2%959%98%03U%DESPL%17B1U%00%F5T!%DCk%830x%95p%B0%92%DC%9E%23H%B8B%1Ab%82%8C%111%D3%19l%865%D8%84%0A_1%94O%E4%2C%98%0F%E5%24%1BO%3E%C6%DF%B8%C0%B5Pd%0Dm%CF%1Ba%9BkD%7C%3D%C9%C4%04G%ED%09%1B%0FVn%A36%A0%81%D6%5B%C4%AEd%00%8B%1F%E6%A1%9A(%C4%D8%DAP%14%FE%B1%F9%1Dm%CF.%C10Q%8C%BE%60'%04Fb%23%26%90%DC%A76%FA%97%BBa%F4%ABP%EB%D7%E2%D3%D7%8FQ%E8%FD%97%B71%D82%5B%0F%B5%2B%1Bz%F7i%F4%07%3B%20%A8%F9%5D%D0C17%E6%9B%D0%BEp%19%BAI9%CC%BEjD%BE%7D%8E%C2%9B%3F7ayz%01e%CE%2ChXAK%A0%0E%ED%5E3%A8*bk%0B%A9%B7%04%06%F9%40%1A%EC%2BwQ%3D!%87%DA%7D%12u%D3%E5Xz%B7%80%B6%D9%06%94%0E%1E%87%C2q%02%3Ag%0E%EC%AF%BA%91n%3D%0C%AA%92%D8%3A%C4d%2B_%B8%8F%BD%1A%B3G%83%87%CC%1DT%8E%E6A%3B%9C%03%D5%90%0CJ%07%17%0E%CE%C6%A3%A5.%18%87%8A!P%F3%D6)5!%DC%F6%90%12%9BH%3A%BE%81%88%98%DCep%B0%92%D6%80%19%FA%D1%22%9C%1B%96%A3%95%DD%82%9D%85%F5%CE%22%F0Ky%11%16%A6w%7C%CA%7B%1AH%9A2%11!i%87%04%ED~3z_X%D1%3Bo%85%C5kBZK*%04%0A%5E%88R%11%F4%AE%9F%89%3AO%8A(%03%A1%A7j%08F%A0%E5%85%05*%5E%98%AD%C8%B0%D1S%A5%84%E8%AF%BF%F1_%F3%0Bg%D0%AC%E5y%BA%D4c%00%00%00%00IEND%AEB%60%82";
		inputOk.addEventListener('click', function()
		{
			if (confirm('Signaler ce post ?'))
			{
				// Préparation des paramètres
				var parameters = '';
				var alerteId = newDiv.firstChild.value;
				parameters += 'alerte_qualitay_id=' + encodeURIComponent(alerteId);
				if (alerteId == '-1')
				{
					if (inputNom.value == '' || inputNom.value == self.nomAlerteDV)
					{
						alert("Le nom de l'alerte est obligatoire !");
						inputNom.value = '';
						inputNom.focus();
						return;
					}
					parameters += '&nom=' + encodeURIComponent(inputNom.value);
					parameters += '&topic_id=' + encodeURIComponent(topicId);
					parameters += '&topic_titre=' + encodeURIComponent(self.getElementByXpath('.//table[@class="main"]//h3', document).pop().innerHTML);
				}
				parameters += '&pseudo=' + encodeURIComponent(self.readCookie('md_user'));
				parameters += '&post_id=' + encodeURIComponent(self.currentPostId);
				parameters += '&post_url=' + encodeURIComponent(self.currentPostUrl);
				if (inputCom.value != '' && inputCom.value != self.comAlerteDV) parameters += '&commentaire=' + encodeURIComponent(inputCom.value);

				// Envoie de la requête
				GM_xmlhttpRequest({
					method: "POST",
					headers:{'Content-type':'application/x-www-form-urlencoded'},
					url: self.addAlertesUrl,
					data: parameters,
					onload: function(response)
					{
						var newP = document.createElement('p');
						switch(response.responseText)
						{
							case "1" :
								newP.innerHTML = 'Ce post a été signalé avec succès !';
								break;
							case "-2" :
								newP.innerHTML = 'L\'alerte spécifiée est inexistante !';
								break;
							case "-3" :
								newP.innerHTML = 'Un ou plusieurs paramètres d\'appel sont manquants !';
								break;
							case "-4" :
								newP.innerHTML = 'Vous avez déjà signalé cette qualitaÿ !';
								break;								
							default :
								newP.innerHTML = 'Une erreur imprévue est survenue durant la signalisation de ce post !';
						} 

						newDiv.insertBefore(newP, inputCancel);
						inputOk.style.display = 'none';
						inputCancel.style.display = 'none';
						setTimeout(function()
						{
							newDiv.style.display = 'none';
							inputOk.style.display = 'inline';
							inputCancel.style.display = 'inline';
							newDiv.removeChild(newP);
							// Vidage des champs avec valeurs initiales
							inputNom.value = self.nomAlerteDV;
							inputCom.value = self.comAlerteDV;
						}
						, 3000);
					}
				});				
			}
		}
		, false);
		
		var inputCancel = document.createElement('input');
		inputCancel.type = 'image';
		inputCancel.tabIndex = 5;
		inputCancel.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02!IDAT8%CB%95%93%EBN%13Q%14%85%89%89%C9%89%CF%A0V%89%86%C8%91%80%C4%1BB%5B%06(%AD%0D%08%26%D0%FB%85%5E%A4%80%B4%A5%ED%A4M%A16%EA%0FM%7C%12%9F%0BD%C5%DE%B0%D2%99v%3A%D3%E5%AE%98J-%25%E1%C7N%CEd%CE%FA%F6%AC%B5%F7%0C%00%18%B8L%D5%D7B%D7%CE%3Ew_%103%3A*%DEW%EC%0Fr%D9%ED%8D%D7lNC%2F%A0-%CE%EC%A2%95%CEB%8B'%7B%20u_%80%D7%03a46%B6%F0%EB%E5%CA%E7%EA%E2%D2%BD%7F%80%BFb%E4%DF%A1E%A5%25D47%B7%3B%10%D9%BB%C6%A9%3B%9A%D18%90%CB%A3%7D%3E6%5B%E3%E5%19%D3%95S%40*%CDZ%09Qk%ED%BE%01%3E~%82%96%CD%B5%01h%04B%5C%F6%F89u%87%B2%1D%03%E8%BD%EC%0F%E0x%FE%B9Z%16%E6%AEvY%D0b%09%A6%BE%8E%A9%9A%98%01%DE%7F%80%9AJ%A3%1E%0C%83%BAC%D9%8A%02%D9%BD%3F%E7%8A%C9B%E2Yvn%88%CD%C8%26k%84%D6%D5ft%87%EC%BC%05%F6%F2%24%CC%01%99%2Cd%8F%0F%959%B3Z%9E%9Ea%FD%A7p%1A%16%93%5C%5E%0DY%B2%E3%F6%01%0E7%20%A6Q%99%9D%D7JF%81%FD%7F%BF%07%209%3D%EDQ%014%0D%D8%9C%C0%8A%1D%D8I%92o%0B%0A%13S%FCB%80%E4ps%C9%E5%81%12%8E%00I%91%84)%20Fv(%40y%D5%8E%B2%DE%88%EFc%E3%FC%5C%40%CD%EE%E2%92%D3%0D%25%B4%0E%D0%18%25%87%0B%14%96Z%9C2h'%8B%CB%40d%03%B5%17%CB(%3C%7C%8C%C3%A1a%DE%05%A0%CD%E2%D4%1DJ%F0%15uM%40%A2O%A7%B0%D4%E2%A4%81%15%9EL%B0%A3%F1Gj%D5d%06%82!%9CX%AC8%1A%19%C5%C1%ADA%DE%01%D0f%095%9B%03J%20%04i%D5%01%0AK-%3E%D3w%02%FB62%C6%BE%0E%DFW%7F%1A%05H%D6%05%FC%18%7D%80%FD%1B%3A%A1%CB%02m%96P%5DXB%C90%ADQX%3Di%1F%DE%1Db_%06%EF%A8g%C5%3D!%96%F4F%A1%F0t%92%F5%FB%99%0Et%B7%D9%FE%F5%9B%C2%85c%BCl%FD%06r%BB%A4%C7%DB%ED%BE%14%00%00%00%00IEND%AEB%60%82";
		inputCancel.addEventListener('click', function()
		{
			newDiv.style.display = 'none';
		}
		, false);

		newDiv.appendChild(inputNom);
		newDiv.appendChild(inputCom);
		newDiv.appendChild(inputCancel);
		newDiv.appendChild(inputOk);
		
		return newDiv;
	},
	
	launch : function ()
	{
		var self = this;
		var root = document.getElementById('mesdiscussions');
		var tmp, topicId = (tmp = self.getElementByXpath('.//input[@name="post"]', document)).length > 0 ? tmp.pop().value : null;

		GM_registerMenuCommand("[HFR] Alerte Qualitaÿ -> Url de l'image (vide = image par défault)", function () { self.setImgUrl(); });
		
		GM_xmlhttpRequest({
			method: "GET",
			url: self.getAlertesUrl + '?topic_id=' + topicId,
			onload: function(response)
			{
				var alerteNodes = new DOMParser().parseFromString(response.responseText, 'text/xml').documentElement.querySelectorAll('alerte');

				var postsIds = new Array();
				alerteNodes.forEach (function(alerteNode)
				{
					var ids = alerteNode.getAttribute('postsIds').split(/,/);
					postsIds = postsIds.concat(ids);
				}
				);
				
				self.getElementByXpath('.//table//tr[starts-with(@class, "message")]//div[@class="toolbar"]', root).forEach(function(toolbar)
				{
					if (postsIds.indexOf(self.getElementByXpath('.//a[starts-with(@name, "t")]', toolbar.parentNode.previousSibling).pop().name.substring(1)) != -1)
					{
						toolbar.parentNode.parentNode.style.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcwAAACZCAYAAACi7wp2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAASGhJREFUeNrsffl3FEeWbpQkFgmJRSDWBrPZgMDtBdvttb223ca7sekzM2%2BWc6bf9Pgfem7Pcs5s74dnGxobD97Aa7vd4%2FbegMHGGLODBAgkJBYtL7%2BoiKxbURGRkVmZWVVSfOdoK1VlRsZyv3tv3HujMDY2xjw8PDw8PDzsaPJd4OHh4eHh4QnTw8PDw8MjFbT4LvDw8PAo4fnnn58V%2FGgPvgaee%2B65s75HPCQKfg%2FTw8PDo4wsl5OXDnjS9JDwLlkPDw%2BPEjrw7aa168r%2B9vDwhOnh4eFRDrhi2fK13WV%2Fe3h4wvTw8PDw8PCE6eHh4REbPKhjZGRE%2Ft3qu8TDE6aHh4dHJdrwbc6cOawg4iGff%2F75Zt8tHp4wPTw8PHSCsamJdc2cKf9c5HvEwxOmh4eHhwajo6PsnocelH%2F6wB8PT5geHh4eOpA9TA%2BPEL7SD4FIWkbe1dQEHx9iKVcGCdqz0EG7vSJ%2BTiJKENpxJMN%2B6hTtmprzEA0r89b6rEE7EbAxW7R1tIr7XiH9eyn4miJ%2BHwi%2Bjgf3H0uxbxeL9l4k98wS9HmuiH7C382ibw8b2jcixiMPGXJFtGmUjMWgaF9fFjc8f%2F48JU1f3cWDw1f6KSfL5SlcKpXKIEF7VgQ%2FZlaz5oN2fJcRWS6rs%2BHrC571ew1ZdufYBgjwgiBRtOd8gr69Ovgxvc76tjd4lh9F%2B64Kfsyps%2FZ9byLNoL1LBLmPibGhP0NlIHgfVUxWBl9tGzduZHPnzmX%2F9s%2F%2FwoaGuU7aI%2F6vu55HOqD9ifE55AmzfgmTC4Nb1q1jrbNnx%2F78hd7T7NPdu%2BRA70uDvFsKTeyOn99lN2v7B%2FjP1o6iITqtrY29%2B%2FYOuch3B225mHI%2FQQh13bLup0E%2Fzcp1jC5duMB%2FTpk2LXzWt994k10Z48bj18GzXiHtXAXhtmLhIrbqup%2ByC4ODie%2BLPpb9e66vj80QwSAfvv%2B%2BzWztDb7OBG3qj9OvrS2T2EOPPsKOHToc3jNL0OfBc14eGeZ%2Fz5o1i23dulW%2B7fPga5ZUlJ588kl29uxZPh5yLLJEf38%2Fmz9vHh9D%2FN7R0cHOnTjJvty3F%2F8%2BpVrBoj%2FR1s6IS58RXooKxXTTpk28D%2FCcL774ovQg%2BRSTfNFTb6TpXbIlgpqDMPKFK1eyBQsW8Nex8Y9ouSjI9wnCTEPK8XJcN67tZt3dbkbSlStX2KRJRUX5YvC70NMuZ9Bd%2FPmWdq9msxMoFnFBn0s3Hs3NTezKMKetJl07H3zi8czaRsfm%2BPHjbPLkyeybL75kf%2F7uWyYssTnB3IJQPhEs%2FCGXfn3s6afY9OnT%2BRx0nX%2FVQt4HP3lHKveEyzl4Dt4%2BKEpIucirffIe6jzoDdogCLPdoHx0NgeLYOOmZ7lrtbm5uezn1s2b4VPmhDpZ8wymuQ0ilde5fPkyH3OPdED7UygpXcGXJ8w6BCeom69dVyYI4pBl0VxnbKzAF2xTIGSq2TMTpOTuUcQClgJvrBAKutEM%2BqrVJlDShhSSUpCrQvri8HC43moxcaQgl0rWnQ%2Fcz9bccD3b9elnbN%2BBA4FQHoNQ7gzmhLOrXj5zHmRJIe%2BHPj558qR8eVBVlPJsnxxzdR64rB%2BQJeZpFLE%2F%2BcwzxvmM1%2FHJUTHvv923j912%2B%2B1lBO6RLk6dOqXOvbrBhI%2BSFUnJXXEJSidkppYWUK55W1QgwIUkMJRBX%2FGb5L1pIxUBFadPnw6flQbeBO3kClBzDi2FoqITsnc%2F9CAX2HAJCywXngwnRcT0zFkSJQWxnApxxiRrIpf4aOc78teBtOaTCTeWCrGzL7%2F6is47j4zWdr3Cp5UIcps7Y2YorHQL1AUbSu6%2Fat2yiay4HDR%2B3lcdrW01m%2Bj0GS1RjJyYVi1fnlt7YHHoiBMuYXLyhZY0g9cK1GLNyxUbU3ipJeNqKmR7%2BsI4n%2BNRbaV9KZ%2BxUGiyPjv9mxRi53j5xRe5dakbc4%2FqlTWihNZdQJUnTEFuMkmZLpQ4QgvvreeBTrOvfrHh4Vy1Q9M4WPqbt3PdTetzIxlqaeI12jfX33ZrFGnyoJPpra1cECdV2KolSXlf%2FPzs9x%2BpFhwvGYfI0ZyUM%2BM8ABGOlHQkHYOH5e1Mz9lEZszWl1%2B29g8Un%2Buvu06%2BNIgrwW3oXbLZzMeP33svsffAE2aGEMEBrVObWyqsyyQCK428rdDtOZZMYL6xbVuWk60gySEvganrA%2FlaPeTJUZIpE8jkbwhWhTSn6wj%2BmuUrclVEbDhw9Kj8tUd1xdeyfereoZoDS6113RylwU02pYyOK95%2FzapVZWTskZ3SdqS0h3nSE2YdWkyPb3xaO4BxSSEld9VP8K2VWBpxLLD%2BoXDrMovCBUZXV9aEJMeEuitf3fI7k3JQM%2FchXfz0dwh5uPZEQe85ipXJ5%2BFVq1c5WdZZWu%2BawDFMKO6Kn9LSUjPrkoLuXWv%2Bza11pOfEXcs2RQAKdbdQaIDNmzfzyGiPdBVi%2FD1WUoYuecKsH%2BsSAqu1iZX2CuWeRBKXGN4rIyWr1EK58Hz06acSTbwxhTRSRplbLk%2BoJI3nFfmXOuUg13aa5okqpJHXt35daGV26Cx3NcWjFhazhpD4nPzlo48m9r6kBSgeEZ4F3ta1gUWI9WzyGCEy1uVZqIKG6GeKy5cuMY%2Fq5xtd01kGLXrCrA5cYN0UCDC5YNQ9CVtAh2mxNZUIueojgeIIJdWaSrNcm3ieighZ1%2FaZ3pdE6OosBiVCNmxnkvZFfUanEavuWJu7iQSQtLu0i1rW1fady30M4MMuI2fVZ44iHNMaivMM8vODFy5ExQqE1jpdz7TNyhgNDQurVaeoyNfwBQXs7rvvDv%2B3%2FfXX%2BefoZ%2BhzNloEaC2hKjf1igmZhymsS55KsjjQRNXFr1qYus19uZdCAxHwe3trKztfdIuiDuzharUvF2GH96EtGecvcRdi57R2rdC0LQTZNl0KhosiQD8nk5sH%2BsMCOheUj6Df2ZTmllgubR552dPDBvvOsYHLRcuhffKUsvdNnd7B3ztv3ryK8Y%2B6tvwd3gxRU61VzEOEe4ZR0apCIIU1Vd7kfV1yAXXzWV4fn5f70SZits1LXb6yOi9gMaiFA3TjGmcOfPDW2%2FLXARO5y%2FfrFCwZyCPA%2B%2F69N99iG%2F%2FyL0JSblMqGMnPY%2BwpEDPwy8ceC8dORs9OirGl4sHK5kWGHjJPmNVYlyiDR912LtaCfE2NipSC676HHpIlxZKmlrRK910cYZ9DlC5%2FnqtXrIjtQoMWjj2fjDCga%2Bd9D%2F4iloWF%2Ftu6ZYtThXZ07kP33c%2BWrbomtvKDe61fu05WhcI8PMevOVZK2B4SZfxQCg7l%2F%2FikCH4e%2FuEgW7xsKZ%2BzajK%2F7b4Q4CgmjmIEEPhE2eCYPGUKdy%2FiHphD2yr3hp3mpM7yFBVbMjFKgq9jcdqjEtmGhx%2FmVmKoZQqibNOU%2B5PKBYjxtuuuYx9%2F9RX%2FSKAct6G60%2B333RteF%2FeoVWpQI4L21Yc7dtqUIU%2BYNULsSjoqgapatvw9iRVFLF%2F%2B4SaWLLACCzfDycYl96KrV5bts0W1E%2B95Y9trofsrwX3VAtfyb3Cb7qQS3qD2jg6n9kkhyvMfSy%2BfMygezaIB0954Zyf7ZfC7C2mquaNwy8oyiqjGFIx771iBzXFRKj75%2FDP261%2F%2F2jmlQRIrLKHzQ7G6H8X7D9GoU%2BlFoZalxdWp24%2BiYxmncLn6XszvY0H7hk0KJ4hNuvkkEUoik23FHJEYvjIcEqWuVCB9NpTPZEXC5GsCpRCnTJ7M1q6%2FMbyG7CuPeDhzPjyz4IQnzDqATCVBzptaVUXnWtK5yOjfqtCo0srjq21mW3ssDVW2Yf8PP8iX%2BrLsw7j5qQNDoYd4XyDk6uqgQUk8Z86ckS9dCNq4P2IOIbprIUjz6ZkzKtx0NitHR3Q4DSS45ijxSkh31CgrbYsXpIC21dY1WpglshxilUed0ZM3Cqz8pAhuVk4J5jUtiaezJm1tCa63J4e13UEXnmwvSEznPoZ7PxTUgwPcEwIr2qQMSisTFj5qylLrWShAPH2oWfSVtzLjY7gUyDfsCbOOrEvsO5i0Y5vWrFsAUpuUe1RU042JGdyKW7QwUUqLOKEE6M%2Bg38oiT%2BPU0hzV%2FpoZQvdhVsIqEP7HA%2BGMsZqm7jGaCCuqr3QnbmgIYX1cxQVtO1%2FS2ocSEBdfL9etWasdd1sbarAfxdu6ZvmKCi%2BIzuJTC6fDZW3Kx5ZxAuEkmzqV59UKokQHT%2F88%2BB3eA2nd%2BsIG8RRwU6lLT5i1sy55Kgn2i0wCVQ2wsGn0clGo%2B5nVLvhrfnqtswWhW8wZRMgWTJZZFEiu2mDWi0DXTlckGDf%2BLMPD0YqwGoCSRKkKnm1KlPVarTfANidRdD3udbe%2F8qr8Na%2F9KC7P2lpb2T%2B%2F8EKZdoY1v%2B6aa%2FjawnjgRBiMw7VXXyNPl2Fnjh3HETTGE3Lo77BaQY679%2B2DoopCFKeD%2B81GlZpb7rqrJqlXHjmQ%2BwR7Xl5hBaeSuOxtffLOe%2By1lzcbQ%2BJVt4vcMymUhFzcw4DLIvxctTO0ISKZOxWrTa304lJLM6qId8pYzAc5EJhxieKjd97NzDqn3gpDnqMLuN93MRHErs9IXI9JFJayIhBqDVVTugt%2BXip5PI7ltL45McPqU9UfFGIAMWKfGK5UaXVPnVLSQ%2FB%2FWfJOt01DU0z4PAtI97FSvjS0oNHDwee%2F%2FPiPNGLdwxNmQ1qX2N%2BYU9SWu7U1NGkuUG9vL%2Fv6wH52ou8sP7TWtKdJtU%2Bpla67OgwEmZmEmFyOJIpjZaQA3m8rF%2F0ktpWZs1uuzN0ex7I8W4ocdZV0YW6irf8pgcjfExIYf7bb7rkntlVcTSCaOo40sI2eVand2mC6X7ODOD7tgBhDHKf2mfwK%2Fv5OvF6mpCzrXsMVLIlvv%2F5z5Jqi0bDwVJGSh%2Fwf3x87yn7cu6%2FsVJM4ub4TFfWeUhK6MCYIePACyluZgn1oDhUWjmYgKya9TlCgIohw8yQ%2BtcQ1ClX%2Bv0orwklY33DH7UYXlYOwLgRKyxqlfQWH9uoCUVLtP7wvTrBB8BzzmQjQimNdpm11uypUr5hLCLqA713LKlY6i4taZFgrmhzEVUGfJbYaNZHQUaR5VvM6TMrzYg6G6wWygKSC8cC5NWevD1NoZJTtpGDMdAoi%2Fo9AH2nZSsjfR1av4kXgpWKhyhmPEqqcp97CzELo4wQLXQk8%2BYVJjH23PQe%2BLxP6quBzPWA6hgXMV2hLIVlZtHfefDOXyWbLU9Vh%2F%2F791HpuE0Qjv9S%2FdV9t4rNdIsLZhti1blVSjdpnFWTJa6veeeed1ghZ6bVQgcOlqx0r1zmCZxs2lxCMmpPGouuqwiiDarBW5BFlBNOq%2BJoXtOOaFKcw7%2FPtr24L20gUmCEEziE9SwYK4VlkSoq0pHWVkW7%2B%2BV18P5QCpAlLU6bX4BpSufBkWT6XFaX1SL22dUJYmLpUEp3QD91zpfwx%2BOk6Tpw4wTo7O7X5h7rfE1p7PCT%2BxrXdiZ7xwtBF%2BWsW%2B0VlRBRHO165ciXr6OjgCfgyQT60tJS%2FdcB7INBECH%2BUxc6tIdeiDzpSDebKKlaeZqEKfo7VS5c5BXbo9sO%2B%2Bf57eeWzMcYg0RmpipUV1%2FtgLLpO14G6vSHJU5aRk8UXkuDdt3cgqKYjGJepQfsvpjCXcQzL3CskpxTzpbOtHaklvI9lENCdD9xfpvhIZYCOKSU%2F%2BX75eUmaJ3tO8UAgaWnG8dBMBKh9UK8RshOGMJkhlUQlQOk2%2BeD996k22vH5J5%2BwblLkwGRlyd8TFmEPiym4uhPpM8jzATPKcyxLKYmjHUMYUSGvK%2FMWZaGRtAibUlSgJFWFtWYl5Y5A6bpu%2FXp27bXXxrLyJLCvJU4CQei8U4CRLvrXVdBWWS6R98UjTzyhnXOULGmfS2Lp7u6ueuKRwKFUTmsWhSKGgjFoxVjIuTlr5gyeiynWfDtID8QPjxTeI71MNE1I%2FSlJE0UMiHsWgUBNx7f8jj397DPa8oceLOuynp4wY1iXsNzKTiVRtWQqCBDgI9QbBAcgJ2LBwNCQlcBs%2B3oQdllqTFVEXbr2X1h9KK51aRIKulQYm4VGSrnZGKqgug%2Fj1Lp98skn%2Bd9IE4FFK2vWUsDLgPdiTysOGdN2HNi9p8w16NqNdAxyREVdVnUrwlQ%2BMi0yGC0RXSYFL2R7H3jsUXb0X%2F6VXRwZhpLQE3x1YVumN1hbOFyexj2oblXVi6DsaaIj%2BobHRmfCSwK3rbREvYXZgNbwBHjGTu5CW76iYqHoFvcrm7eEAk0SXRy2C%2FfP4vdx7mdNxnHLzRJF1%2BNGXKpRolRLd7XQdr71lgvJ8HZObYlXYUVaCPAK4GvRokV8X3Lx4sX8J766urr4F60c43q6At3zgmJDLI%2F%2BuGOAwv4OJ4uUIcv6wnTvnxJGnLQj27UzVAT5PCJ7ybzd5FxcHMyAqNrLp871sc0vvlQW8UrXqS7aXnNgOKLle%2FELLNff79gZno7ikf089YQZz7rkKRFwraiCTA366evrYxeLLqChuBGZqvbZVAi7doHjZUK3Z9xzODMOx%2BZMef8jG8rSCOL2DXXhyX5yFRhXSs93PKqdG554PNZ5ktRS0D2f6n6kkY4u95CfR5oSktoFekQ0Z6wxwJZCXOstoUUrUZHmpJIj%2FVJJ0%2BRBiHMiSkbgfb%2FvwIGydiOvkgTuYCMcnXcG2x1bX97M3YZh1KySg6074Wj9nXdw0pSHhkuDGaQJa%2FNPH3xYQcQTEeizKuepJ8yUUJZKYsqFkgsewT0CNLWAa7cgU9ViMgkBXOvBXz5UJuwiiJ1LFhkhG%2BcAa7wXkXh5TDa1Xq6ufVFtTuKuc8znC92Hcc7Wo5aCLk1CdT%2FqysK55NhhjA4X92nwhpNZCB3d71%2Fs3p3Eog2LbkDY0%2BhQ3fjFjeo2uelVqzWhkjwt%2BEJkrTHtR%2BwdD4EI6TmYGFtZZUsQ3LTgvSjQfO7y6AhPe8D7bR4GmoKG3xE9%2B%2FQzG2XBCfkBbm3C2wDrFcQJMlZli2lMXXM6GyXfE%2F34WTLPiyfMFK1LSPUZ0rq0Hd2FyY%2Fi2%2B%2BXB%2FuUCWkEnthqzKqvkZMQXPp4Pjcxp04p0%2BJdg36%2B3JOPdmbLPVXbnNZiTVJfUpKaiyUs30sFXdy9JfleWB7UQpV9AIFIXLEHg%2Be4lBY56uZe2ekopWCwszFvw4turF250mhN6w5bpr%2B7WuC6z%2BJrW8y8PEGSqOGHChurbaTJNG5Z6eEhVuYKlCQUxfixDxm6Z9XDqannRM4F2W%2F8muvXUxctyHhQWq%2BYG1s3b2Gf%2Ff4jntJG1xdNgaO5ri6WuC5%2FvB6BZxwrKTNn67mt49nCxL7P5LkzZlZEaaoTHRObTC4I5mNqH8Fdow6ybQIkcXv%2BYsOGcKLHOamE5C9lcUqJNZ2BLug4rtCs2klTSlz2W9Uoz6QBKzJfj94X6UkQgoQsDyQUCE4pJercrnIPkM%2FJ7vU3GqM6deOtumxdlQ2dknixtI5c8%2FJ4B13zk8VlfxvAx2Hvge95P2HNyTYgKIdYhAuEIP9eEtyO17aXuVJ1bml6QgqweMkS7qLFKSeishC2YBBfcbqMOLduZa9t3syvT4mZXktH1vRvtQZ2vQPbFQKD9d7W8UyYfMEjws1kGdJJ%2FqpZm%2BV%2Fv%2FvGm9q9Sl2wA%2F4Xs8B26E6kWmpc4s2y6Dp1y%2BksNJv1WQ1c9meDdrbqJnMcga0TQHEsJFWwQdhh36taspRHVjVZrN%2BM0hTGqPKmEhtti%2B3sSJf%2BU129Mgp5rMAix1635q%2B%2F%2Fbayvy1u2cFRVl6dSFp1KEEobj9buqeFe3YI6Sfk7NmQpHR5qXTt4AsK3V%2F93d9xK7apROqdQqlBdC533WOPE1%2B%2F%2FT%2FPs3994Z%2FYjm2vcetTEim%2B4MbFCSt79%2B5l%2F%2Fff%2Fo1%2FybkYJ6iu1si53nRVGJdpJfJUkuag%2F%2BmpJKaUCOxPYo9CTNojSt4bAk265MGmMshGFRRphYhHnZ2oIuP8JV48dmpLi7Utar%2FKPkrjTMDD%2B76Tv9pyORDVyJYtXKSt9xvHLRi3khHd25M5o7BARE4fgMOoT1fhauImsxrlHaUYpDAXKw4CsClFugIGceY7nSdTAwss4VFPY65KFlGG297evp2TGF13OL5rXekkk6sDmfCdKK8Ha%2FdqWZzgZ3f%2FvCKATc2jlgRGK4bBikUJTRDvj0cO47zSVqJcD8r%2BR74oZBPq036%2F9ahdmBeayuIMGiEKt9Hq6o7XPEyuEa5ft9ZoDdEFfqlUbQYT9gatpTNWLlTVBaAVwKy4AQoCjxCYFe7EerLS1cR1lSRVKxMCC8QhBVc1xb%2F%2F9Oevpd45ENVOuLySkEWcQgqmfpDnTpJDhaF8xap%2Fa3s2GeUdp0rMG9u2mbwmid3AtgpX9FxDXR5rlCeBzpM%2Fvv9BkrarJN8W4ZE5DAseZIU2gySlWx0%2Fb7%2FvXv67Spr4KUkTpIftGuoVUucQfU3KDbneQZy3B%2F0H9z0iRT8vnrQSuzQSXMiwimGdo%2B2NlLJS5Tz1hJmCdclTSRavWmXVbOSkmjJlitUXADV1jdDwqfUUJYBvLB0wC7fa2Si3p85CqzEqrAzTPopqeSBggxxoXWULWG8gqM64WBZJ3JNSoJmiY22ge5%2BkJCLO%2Fvwmy4ExVaui8xoFNwSOxlxDhah7qvvs1BVNlIZqgXFNdE7WJCi1QZuCZ5kdjMXpCCuzFe7zJ5%2FZGBKmJB6l3B0lTV7c4NXNW3j%2BpiRNdV3IyGpdsQ461%2FB5RNTiC65XKBsg0ENHjjDkgmqXRtA7P5lXJEpK2kmVv1oAz95fmqdH6r2949HC5Hs%2Bt6xbV1brU3W7UVcAap3%2B43PPaYWl7lgvNRKUvkYtDhwwKwjTllrCoxFbWyYlKuz%2ByYcf5q6d6awb9fl5wEah3L2UEC5WWhmxu1phEO6IehzReO7gzt%2B46Vnn2q24V0Z7Maqb0dr%2FZW3S%2Fuomx8JvDmvAEMEZd9zV2r2Yz6di1o8N%2B2r9umvZH7%2F%2BSsqD0xYr81BAfpMvj47MgHsUViWeR6aOYC7DitSQJj435eLI8HR8DsSqxkrQ%2FVmqYKhxD5RI8TcKaOAnJ1CDpeqqyDUCSIRs3ftnxyNh8v2spUodS5uAoVaCSat23SeyXctG8NeuXlUhCG3WjvzfkdIe5qms5rK0nNQgDzX8nWrYJGBjbw7FlEOXdtQepNrHI4ZtrhHHOBN6vZiBXq4oq%2BOrPpduvmhIIW7%2FL%2BT9Kao7uQRyqTm6IL%2Fgvnty8irNFusoVJzmL1%2FGWJEwXcYCa2eGdLHKcZRzGfNKR5qsmE87Ha8hf1MWHaHrIYrAdMr5eCBBV2R88H36FvE4c8fy459w8gAmfTWluXJEWdF1k%2BVqspSJdnYp5b4sMMtZiLItuuLbVQrrVCxgXfqQan0SDCmHDQ%2BqVp2NKKigm9zUXDYXUxgDp%2BdV50saRdfvKRXfiHx%2BiW%2B%2F%2BjpXj4cgy6WsGG3aKhU8zNnmIn%2B2RY2FCObhuQ2oxkT6LhxbyBOQJsnRvFr85JGtH%2B7YWTa%2FaKSqrnwgHTddDvNEKZvXCIdGj1vClAv9gUc31IVGFtficLEo6f8yjpBtLn4rVCxuKpx16QZ5njwgU0rQTpOQURUPB4FUPDPxlVcjx0p9DftgdC5WiZ%2FoxiDK04H3VVmbs2LvOgpSOf1631750vmclhn30Nz60%2BvCF44fK6ZRw6UeYyxQ5gsni9DKWWV9i6AgDWmir3jN2beC%2BSLnvixcoFrnNN3DtAVT43zmXNEoNWTHHWHKVBJo%2BJjYddi%2ByAmh0zxtgjJjcLfcNFHwW1fVR9UU5ULPeREUXfALFzqlNdBn2fLSyyZriAcf2IKWjJV10tWYuaB%2F7MknrM%2BUAcZcLeyKPbiS1daXU1u5wrTo6pVsRlsxYOd%2FPvmE%2F4Qrta3YrlbVysTh2Hgt%2BOrGT%2BGhOYj%2FIe4A1Znk80llAPuauCZSSUCapEYsvwlSP1A%2BD6Q5dPGisZ%2FUOArqCVMPtx%2FvaJQasuPRwuSpJNd3rwkj3erBJVvQ%2FlpGosYqLrr6nZSsMiYmUfD7UW2xB6oxU2seQvbgnr15LoIwpSSqxqlK%2FLJCkhpUJNzIfE9F7rFE1TfNyI3GxzVOeoYEKfSeZAwq9k1dPCM1QtjWhx59pGL9PPrUU6FiFay3GWLdYbF1C2WrVfxviUj9OkBJU5IclSX4G0E%2Bz%2F5qE1s2fwFdf5d5%2BbzNm3mk8D%2F%2F9gX248GDPGUEX5J85bVQ4QbzC%2F87Lard0HtNBCtz977Qmu9vhPaOi6AfmkqycOXKUJDXwyY5jpsSlgpK9R3WKSxNisDVWS864vy2NNkuZP0cJnexGiaPv3tPh6WuarKRH3VGoyO5VRy3pu6L6txoENytxTHH3tl0sT%2BW6bjo3M1HTp6SYvxkzLXE3TPNjjqYejh2nuMuCVCuH6RWPHDLrez9T%2F4YpoVAEb125dXsz%2Ft5AYzO4DOQeUu5adjewe7b8LBMg2kXytLZ4D0gzeWyShOiVXWeFFz7wSce54T33ptvIf1jMn3%2BgDxbt7%2F%2BupuZ3NzC%2Fu4f%2Fne4piaKS1Z6ceq9huy4IkxGUklkSHa9AMdNQeNk%2Bn0U7vac0jLJSko6YOGePh6edjUnWORzqmxqjy19wxSNqSONA8ePUa2%2BK8Xu1KWYGN2HpiLxjsKdV4FBMMfGv%2FwLJ9KSwnTlsmUymhICvRrCLHs2UxS19oOF0FqOGwzGzcpF8%2BY5KRY0rYSOAVydaY67GHs1F5cT5tqAEGU7r15%2FA1u0%2BhpeLUhizY03sN0BYY4WS9Dx83Gx57lk9Sp2YFelS1AlzZM9p3iuIwhSHiAuvVgyIOim229jnwQW6dkLA2xEH7MwxAyxDGj53%2Fz678O%2F6fU96gsN75IV1iUXyrJQAU0WrjUi3KZlZziqgtAWWcfr1S5YkGZTu5R9HqurWA1UMOy9tKb81aWJeOQuuTlz5ji7CSW5UVLSKRDcTxQIL91xSraUohVru8vGNw13o%2Bk5dFG%2FaRRdv%2FXun8cuDUjmeurjHnwtC8a%2BU9dWECIlbpVsMIef2bQp%2FPum7nWcLIFP9%2ByqIExi8YA0eSAQtyDFEVyysDrFVUuXso3%2F66%2FYPzz3HC%2Bwjq9bblyvroVKhfrhh9lTGzdqC7ePdzRaSsl4sTBD61IVmqYFj4lPKuRbMa2tjfWePMVaO9rZvEDrlukqadRJZUrRdVPFFtMz3Xb77fwrjYlL3VIy8rQQI2yFumY3EeGUJmgbRTvDc0RNeba6pHuXvW0kzAfXHxoavtIKlxvG3bXoeTWlAMmzcak%2FnVhKUYFMae%2Bjul6P5qFmMfbYE%2F9k19dy7M%2FoLHBbZCleR7BOMKahBYegnJdKFYm0laSEpYlI72vgboWnCEd0oSCJSZHE3JL%2Fw8%2F1P7tFJYcyIjet7fEW9DNeUmXGA2FW5DHqBkjWcITwEy7SRPjNb34TqziBa2qJS%2BWWHCGKmS9M9GHX6jgJtVGK%2BUVSaXOygOS8wPi9%2B%2FqbWsvCZcHT%2FXHdOMEiLBSlOfYxO8TJGHHBrakZpXNVI%2BeO%2FElK9FUVqZtkDqY99uj3zbv%2BbBorY%2BlG3RyQYwgL7j%2F%2B%2FT%2Bk2xqF8X%2B0KE6XgjGE3xaLYS5ctPhClCw8CVCiqRJmqimbxZpoFKI0jctAf7gsGsacbmjCFO651qnNLRUTUmqdagUaEsbsKsQw0tgHQjBEGyxTWtEjZnsLSiJ%2Fhdszb6I0aOVcCbnprjsbQln6%2BYMPxNZo%2B0qniRyLe1M1mEx3L9Qe3nMARyjy00b6kz7bLXfdFfuDH7y1I5YyoCCck%2FVgFXD3eYn3z0a11RTgJf8n5QGpRBU5NsGahf8ehdoHhEerC3vU8sQSBEjdsHYttzwhd%2FC1IN3tkoaFzSvy1htvVjNPPWEmFSoofqwOhnSZUuEGVyw5n7AnTmRWsFjWSCKOS0itpUjZdrlAqdvTFNGbl8CKe7J9LVw5hj1HY9qFKjwrBGm5MDSBF%2BbGcV2%2F%2Btu%2FrhgTU8k4jCdOFxGEmXQf01o8wOaGPT8U1os4EVehqyMvR4VCR5VN5FHK9RPHKyAL9GMfU%2BxfLoX72%2BVUGSEv4KZFjukMMbZt8vBnIlu4a1ot1ThRYYrkHsHYFpIprZ4w41uXvFAB%2Bhvh5Kpw1WmZh0tpGD0JwpgT58QtW7JECs%2BZRKPlgnT5okXaY8fiHsRbjQZIEvQP16uG%2BtHOd2KTus4di9%2BPl6KLoyoRoYBBFyIfXTRm3UkuWfeLbq9W5pcGGI552cXSYqIkU0tgC0VADQxZxAVYc1Nkf9BcSvk86%2B%2B6g7W0NMsC7V0i3eRcxMkmkjgR%2BXxekUUdYk2PcRJVTnPxqASJ5G4Yl2wjjyjf3Ll53bqKRa0ecyMn7qe7djm7YXTji29yfyjOAbmycLNibRTdSZ2zjEIwD9AAGKLBGyNka2VhnCwJzuM6lxx9vy7thSogrqeKiIU8hIWNPVS1MostkhHWhbh4q7SGYqLM3RgVNSmfjRJMgjq%2BfH6ipJzqnalX79Ijjz%2BuHQuaP6uTC3j9uttu5ZagUBBmCWtzqShs4Awo37BQRbH52GUFJyIaMUK2YQmTppKop5KowlYuElgVYkkNJkyS5WbGO2%2B%2BmdZj8ChIpMKY6pLmARx6TCeua8HvvC1Moo0Oq%2B1U028MBdZT61Mdkeju2VGKcF0Uc34XXK6f5VyJu%2FVQAxg9PirZ6%2FpHKtJQbKAgkFq0swVxdovSeXHrbFaczTqRYUuRa0Q0asvDVBI1YMaUVE%2BILuk%2BHa%2BYcvHS5dgfNORihpqoLgezhgKrqd4mhkEb5YXJdSkluvGnf3%2F2%2B4%2FizAX%2BHgSL0fml7o%2Bpr%2BHnLzZs0HkWXMBdo60t9mhsnUCuspZtKOzrJY%2F5g7feNo1VGTHpFAr13ElKljQtDDJEWpuEOGX%2B51pBnrEtT%2B%2BS1edsA2lFcnvCjOGO0VmXukkKgXu%2BeKo33FRJ9%2Bm4JBoeHYmt1RtSS8rcierijtKQTYJT93tMS4tbQ%2B2WVA3bvU3uQzX30ZYzF2cOPPH0U0YLTBWS8rWDx8IYgx6H%2B%2FCyg6j2Qu9DhbB6cLW8XxW1fotF159%2Byjq%2FdS78NOsLxxH41YwnnRvqnD3ZFzqD1MCQsKiDrtaxqa%2BkhyC8%2FuEj7H92vhMS5w133M42btzIyfOqefPpWpWWZxRplrlkTfMxpTWgXVu6%2FjRZfWlakHHm02d%2F%2BEO1BownTEd3FU8lQUK3yx4bF5B7qq%2BIL6MpRxMIEzqBTS5Pm8tNV8eUfpkEgy3RXn5216efqX0TFl13FaoyXN%2BkTer2w6KsQvq8hnwtpyhS1aLgYf9CqQ3G1GX%2FhPfL4VOnjNfXeQhwPxmMxor7mNPzcHltfXlzorlOzz%2BVlYXiCFTV2raNp3o6hxr0Jj%2BH%2F5HzXodJW6veXJf32fbaNvb5t%2FtwTbZ9y%2B%2B4ci3nFE4lkVV7iOXZkeQ%2BNJbC5qGIkgUuskbdq5Wv644VS6Mf6bNRhZn%2Brs4LXuu4iFOsgdCIUbJCoD%2Fm9GYEQXxSXbAPBa8HiUUVJ2QcExiBBUJQ41ihojVAjACdf9%2B0LyddZvR96mtqcr0pAnf%2FwYNhV0Utvii3i%2Bk51EoscarHAO%2B%2BHZ1XqLaVRinKSkp4Td2zdVCUkLgejjtIkJ5zqOtrWQsUryHBXeTrYd5mVohdjv8VuGSL0%2BpIElkwqRBfiFLhTxUYl4L9NNGfCmC8bhmrijMwk%2BLXzz3H5Hr88eQJ9mOp%2Bo8J%2FRalY5pOmZcKo6ngBXUP0wIItupFagSwesyauh6oUmKTMzai1rVHlkRUZZCuWIhsF8ZVxCQMpX3wvSdMvcbf%2BurmLezySHTUfEtTuIB7UqiIz%2B%2BNcxTHxsYCc2cs0u8FimwOhNBo8H7x5tBnj9f%2B6fnfBi%2BM8RcLms8WyO9Fl0Ch7P1jymuqL07%2BH21tChswFrZLpCAMkGo0%2FBlf2by5KHwToCDao%2Fu7INri6i9EG6%2BU0iSOqmOx%2BcWXyq43Znn%2Bgrh%2FAgusYtwZ6X%2Fbvae2TKrqfiPi2QuGOcHbEPzSVCiwaa1TpSAaSBCqzxcT%2BhpzsmjOlz8nNe3HND9t%2Fwvfg2VQKJ%2FT8nNynoyJ95BtgQENac1GSohIC0lLrgwx834zUpD6bWknwf8uoJTe%2BaGhNknCHtHem0ZCAQKgAd2yOOk8josL%2BVX7U7r3ClbMp0yCXlmGK7jOVUwcSVYHk%2FYQdU8GbcMZaTPqbNgrTlMJ2rmMiRJyMXEmuNYPOY47TKX9cdI8qrgfBPthIsQHYtyzXuak6tXRFRWYItrantIaOOrocRiI6EPsdy5JqV3jFUNMf%2FKQJ8wMSXMKc0vMbg4G5nLK957EivtpOsNQa2TCa6Zq%2FSI%2Fz2Sg0NfmiwVYsQhtDjSDidEjNPRzom%2BuGJ4R8fpJTMwlESSGo%2Bi%2FYe5BKXjEYRPZBO1sJv20gtn3mM4I5WAkhXGnBtVKFr23hec%2B4LhvSu83ojgOVCMT6wCKQ2scZcNyz4KYr3QKJTUyo%2BYC5uH%2BMiOz%2BFkEnnXVsfjpiSPsRRrcgogxSqrIdUdcF1bxtznJ5EVC0Y56zl5b%2FV5PmOkMhtTaWhusjyssuGqeeTLSFe5%2FgE2bVTQ%2BbIFPMh3jwtk%2B9vbOHexy%2Bf4DiPMUTuVIeYy64OefOU2vYPcWq%2BZ8m7AgeeS92ydNZlM1uXl9wX2FdvVlUsK0WWWm%2ByrPDa16X8rPjXOq2jvb9P19RtTMDe77WQ3WaxeYd4ambRcvX2KDxQpTu9U5GHyWn4tleqZaIm5%2FCrJcHvU85wYHpGZ0Irj20TjXNl2X9HFP1tacIMv5Uc95NnhOwThfNFKFH4mG2MOUi69B3Q%2BYPcjj2uNKmmLyhRYlBumhXzzISTJO9R16zNDfr1zBCRQRwyIICv2Jg6d7U1xMvL1Pb9qkbedL%2F%2FGfWfcz2%2FDUk9p7%2F%2BsLLyD6QFqsIykKiTkFy33JexlL2U0nrMF2fJO1blWFSRyJNlSjec82GubC%2F%2Fv3%2F5TCvEXTp1zo6p6pliD9GQfc84BjwW7%2BubmQ%2FqH937P%2FfvutuHOkWF5z2VLttUl7UfqvP4UYDtM8RHGHefj9kUBOLVm5IuoZBxqRLBuGMCVZbiKLr17OV4tqx1uvvMq%2BP3ZUTu4hh8kXKgctgnyiLMk4BDr7rrt4%2FuqfPviQ%2FXDieEEsJpbHfkJfqSbrYAaXt3oerowmrq8aTdKBkIgaH%2BlrhBs%2BRWEBdyyb1IAJ8mcHjXOB9%2Bltd9xez82Po%2Fjytbx8bbf1vdJjxErucFfvFT9yTHdGJ%2F4GUYui8CDusxn1B2RWYdn8BUayBHkLspTtbkjU%2FUoTBMKrnsi6mrzhlpDrXDtQhIKb2nLg6FHnSYJqInKBQVOTllraNV1xvV8GFhE57LdLBJmkQlq69mLBSKZK0yUq%2Bi2sTmS6t3ADJamvapuX7S3lws4sECeF7trJKT46T5hcNHee9p8%2F7PmmlgLKOhfIeKgLp5k59mnewNaGgOv8bZdrOYu6zMJi5MU3yLGFZSBE3SVcuGnLZ2xJdLQF8tlkQWO8yWHdPa4uZ0%2BYVWjxqHqiywGqB5jK2%2BEnqYE6ZJl0BUFYs5uEJQ1NzWWRHTt2zPjlQpy41%2BRi22dWQ5oi%2BMbFZZGFe5AfPtg5LZ89L%2BEK5a42k%2FtZBdnfnJv22jAJqt1798pf%2B%2FNcD7L%2BasLy43Ubo%2FDxR%2B7VaaRCVXAkf8whUqw%2FTpUmPrawInWHrEsrU6Aj5XHGM%2FItiUcD%2BWxSjnA8nlCQehsxMpairl2y8ggv%2FK4WCqhXlyz923I0kSp8u7lMDT735DPPRApgkOHR7%2FazL%2Fbstqq6EFg3dK9li65eyRYuXGhcqLjn1pdfRlAQSPOqhBFsfO%2FJFOyTQDuPTRw%2Fu13vxnvnv7enbWmh1uvUOTEI%2Br5HNsj9pNwiWcixbedyXhZcKVgyX3%2BIMrGGBnSeggIRttV4UXTCuxoQN%2FJx1zn5rKNCJa2XkYpfo63MoN9gZXahX2drlCdYmcItm9peJnU3254R614ESg01amRswxAmI0XWKyaX4fDc3E10zcnuITO4FcJGBN3UuR0d7J6HH7YuLhDlju3b2YXyMlNGEgju3v5pQKr4uslCnJI04TYZKwYCjSXQBNslMejwP9nWjrS68cje6dEUBEV4Ug6eVTdeh3Z%2Fw5asXZO1MomJxs%2BDTeD2zMUrZLJ895TOpe1XhP8ogtAwBxME14QgWw1leG3L72SgUTXojepPWb6zrUVfJWv7%2F3uJbfjVsxWvI5pYkMv8mHMV%2FdiV116mGuRjklnKvmXeStuEJMywyLqtvFu9QZaliiqELRLvZ8KytJEliPKLj%2F%2FIDp06SUkHRcERbdZnmdhgkOl8MQWkCYv00SeeMJImNEUhqECaqaacnLkQSztP1Y2X8t6pOIf1Wu14vfnSy2xgcDBzwmSisERry6SGEzo2yxdWCBS2KizxVof7Jt0WiEy2F2TCiz%2Fo3JQ9PT3sxzO9%2FGdXV3ngPwKdEkTK1sLKdAryGS%2F7lg1BmMGgQjC1Tm5qDotY1%2BKA5SjoXLKSKBGJarKqhBbaiQGwuWFBltteeUVmkI%2FEmXyCTPuCe6HSzKzgw52vBNd6wkKaWAQiehZutTjJ7lZrZ5RYESnPk3DvNMINN5TCvUI31LLuSkI8deoUO9Dbo9WO5B7VmDhQOoV%2B4MS9dvVq7T9tcy%2FjdRs5F6Is3yT7XOK%2BNzred0%2BGXTBXkomuHSQQqwIJI2VztTJdg3xgzY%2BXfcsyj2Idt41HdK1curSsoG%2BaR9Ok0oEa8pZW8MHjoTF1yiR4bUEj%2B7%2FZy14pkWUvvFlJNDUQp6ggwiPqcE1TUBBZBF0xToVwTW%2FIIuDHuneahcfD5IY6%2BM1e64dJ%2FzSn1RYdcQNHS96IvE%2BDqFWqy8wa3Zeu69BdryMTWJWf7dkdSZxJkEfErEuQj7y%2FcH33j4d9y7onTGE18Im37qb1ZURUj1YmJUnZLuxfkgjZi3EEryTLt997V%2F6J6h8%2FVlviT2h6fFFtf3WbljTRntuuu66snY5ada3SG6x7p2kF%2FMioxyam3yuFdSmFoWnDenqpmPiCrOcjyTvN%2BzQI61zI0PLlFvdP13QbhXgOFjd3hcGSi7IuD5ROCarwQrD4kbLUyswkYtY1yAfFCYQVy5jbebOeMNOyGubOmJlJ%2FlLW1iaI03Q0kRS82Lc0BamAyAhZHk3T%2Fy9I8yxOpTi0T19icvGqVfJX10Lc1iCPbwxBHnmA7J0eqfJS%2FBmfMQgLYl1ekASqgpB6VeZwzICfvGtfWudChpZvu2JFlWFPxnOQVn3StYFal1yLuXw5SiA3JVjbmViZCYN8TmRVWcgTpmHy3%2FPQgw3TkS4uYpq%2FZ9q3lHuWZNKdyKC5XP38Yu83RiuzXSTay8IR1WDwSigcsoiUsybIp7F3KqMe2yfpaw5Q6zIncAt1VlvjHYhRK8uXBPz0ZSmzTFWfiHXZo7SnDKTubtIDx7OwMp2CfJCaJp9xvAT51D1hymCfwlgx97IhhIA4cZwegmtwBfL8PaSQmLS0j3bsDPcss5p0wXXPSfIaPKc%2F0xi1UV2sIWntNEWT1lAGAT88QX5yhnunNOrRVC%2F2vTfelL%2BezFOhNJWPQ6K4Zu7lsXZrYvnW2uKO8hop1qXVwkVd2JhklqmV6RrkA1e7ONyhbzwF%2BTSChckHcM2KFXWbNqJCRsXSE87PXrgQeqEqLOeHH9ZeB9aeONUijyRffqN3Sq7fpODpDW2TJtei6637ZSkVS7BGPcK6PF0asyOyX3UBQMoeVTWT25p3em4wvbzTJHOhBqkutU6xabd5jah1KQhtcEwQqYXMqnEfpGJlugb5YJ39cIIHOI7VYM5NeMLkEwXBPvUSCWuDDPSR1qVs80gp9GOUTL5WaKEmVywCcaTMy7rdwtU7MCLurVtUTW7CnS%2B47lXXaP%2BZcXqDdb%2Bs2mIJUVGPIEtiXZ6n9zr4o17fSTlSVouR0hiP5LwcxFxYlfdcqNV9w3WN01V06zqOdZni2q7aynQN8lH2LU%2BmmbvtCdNx8jUHejgX2A14CoOcRKzSBRRqoSYgEIcVk6PrQktrcysYHhaX0KGG6Q1pFEvgloupSAEf63LrMhSKpLpQGaqNlBUR5K3NLPu806QKjCnw5tCJ41nNBet9s5qDVKF64FF9lPbO7a%2BH93YJgiFjWm1N3WqtTD73o4J8No%2FD4gSNZGGKM%2FSebZwOFOkk0h2Lvw0l8awLgFiXee47cb8x6tLqQAqG20KVXY%2FVSjXII%2BtiCULD5sXwTUUKXt3yO9W6DD0KphumECnLI8hnNGDAD7F8c7VC5MHpGdzXmkYC6%2FLs4AWpUB0m%2F%2BJr%2FLPff6S9aKE0BxPL52qsTLFvya1mk9tf7luKMT0znvct65IwZbBPKGivXGmojqTuY7Uknow0RZSlyR1bI%2BuSL1xdThhAipm3G8Ys92O1CPhKnha9d5rU0uLP%2FLBBwx7s65Nj1k%2BsSyae88IY06eWpKVUmiyaeg74ycLyreF9I9NIXt28pczaI%2BCWZt95fcAdiX6ekbeVSfctMccc9y2PswmCerIwuYbTvbx4rBUstsFS4EzdW5kUH7%2F3niq0iiHnpcjTcuFbilTNe8%2FJqpU4lOrK9VgtBXyBrzHsW1VTLCEq6hFE%2BMbOnSZhWFOQEzWO5HzrWqW61Oq%2B1jSSwb5z7HJJoTqs%2FpsT5qBevlUbKVuFlRlGhPt9y%2FonzDDYR6Jt2rTG6UhCmkdLloVTmsF7779fE6tAWsBNhUJVY5bjsVoV9zaVhktaLMElVxYRsKROZiztOoVI2aQHM%2BeyfmuQ6pL7fV3SSF7f8bbxvnJsTC6XlCJlna3MzpKygXBzY0S4nGMvTbB9y7ojTHnupXSrNEJ0rA6y1i3ZO7sUtdfGzbyxcI%2FlRM5N5mt2dCyxtzS3Y7XioopiCeFZl6Y0EhL1aLq2dY8qaaRslQczZ41apbrU4r7WNBJYl2JFwbo0neQ%2BKMk1S7hYmcS9z12xtnzL8XQYdCNbmFyjXy%2F86TKQplFIUv5EuzWHRjfZhBxJ6RioQfOrtTDzPFaLEkcmxRLUsy51ICTYYzlarZe%2F4cwZ7T%2BriJS1Hsyc8SHdiecCxmOkNB4jWdzXNA%2FSTrFxSSPZbrEuXb0QLusrTStTFv%2FYYImKBeGOp8OgG5IwgwmI0w1mS1cEJcpGsjQtKTDcr9zZ0VGPzbYGFdgEcJ7HamnAGSODYgnWNBJYlwdPcicAJqbN3X5JsXLLUEWkrDXv9OOPMj2k27aGm6VSmGftZ3rfCAyldL%2FINBKlSMExy%2BVGpDVq1GRZdZGycaxMWMtRUbGkqPqECfKpRwsTfvOmxXPn8lJ46qkfjUaUA%2F3hltkotZ5NwMHQNbQwuQC%2B44H7tf%2BMSPzP81gtbbvvvuce7T%2BTJKq7pJGQIgUQhpcsAop7rfKuek4CfvIWaNZUlwwt37zvG5lGEqNIAR%2Bsj0trrAwpRso6W5m%2F%2Btu%2FNiq%2Fyr7luCuq3kiEWdy0D4Rfo5EltYLlz3feqnDHFK2CW2%2FTfp5EAp%2Br48c8bxq3rI%2FVMsC6b5UwUd2aRsIFR2WRAquBLok2Jeum6oOZs17DJqsrQ8s3t%2FtGpZEAMYsU8El6PuNI2ThWpsmyRFH1ibxvWTeEKYIYeKH16dOnVxBRIxCnSvKXRuTOHTvmItzrGaRSzoUqPptFekOqxRJc0kgMRQoSIWGkbK0OZm5Yyzfl%2B1rTSCxFCkwYo26oCsJMN1LWyco0eWtIUfUJuW9J0VLj%2B%2FMghqULFpRVyqE%2FG0LrEG1FsYWxkkZX1xuwgaCGq6cdbL5w4UKtZhlRKSfzY7UM7U61WIJLGgktUgBFSCE53KOgCkJh1UxDCsrcuXMrrgniE4Ko2SI3K9ZKjQ7prjvLN8%2F7SoWq2aD4qkUKYihBKMLehs93dXVlPlawMoO2wcrsgpU527AXLoHDoCdKUfVGIcwwiAFWGkrKgTilxdYIViZto%2BnQ6DoF7%2Fufrl4T9b4hjQBpdpw8WfTDT%2FAtxWIJ1jQSgBQpALHeEOfiKMJ%2Bi%2BZ1RMqKk2kQwHQozlrRYffevWVWRI6oleWb531Fyc5NUUUKpGIzNw0vhIs3JaGV2QUrE1asL04Q0ziqoYXDcy9bCk1hofVGtDKpdWmoIcv9NIdLifR1RZhLDKeMHNyzx2axWAN%2BMk5vSG3v1CWNRC6SQsKvjnZ9H6VQU7ZcMykdSJz3XrjV8iX7ZQONeF%2BaRmLCN7t2JZ4ftoSuNCNlqZXJIvYyJ8ph0I1mYXI32I2BloPAF1T1abSAH2phguwJKdI9PyzYOd8fOMCuN1TEIYIzF3dasADn436TAmVF544FPt%2B1y2axWEmr2mO1qkHMYgl849x2GgnwD889V9M5FvOA5JoE%2FJgs3z0JKy7Vw33VNBLTHPmloeRltUCkrMh7xPZJ6pGppn1MEOlEOAy6YSxMsf%2FAJ%2BLiVavCEniSLNXI00awMIFP9SRjrdd6w803p2ppxBE299x9t3EhDZcEcOyFmsKxWqZ5w4PEbLmfrsUSaNSjqbxeHaHWByQ3nOWb0n2taSRZI%2B1I2QTKxhlPkXVAmKy4b8Swb4TcS0mO8oQS6dpsOGuz3O1RZmX19usV3bYZYXRwoopncj8xpnU5o6n83mWIcMfG6Ye0NR7uhls8P7JAzpCr0LBVNskSSqRsVKklLjDXrl6t%2FWfGh3RHKb7jMuDHJY0kc8LMJlK2bpWcRkCtXLKhS48G%2BUiClK81EmmarGEs2GDxcRLBQrYI5%2FYEi3pZ8KMT12fFfYnzlnJtZfe5%2F557jdGxn1jcsS7CKgZppaoZu%2B5fyqhHTP5apvtgZo9U%2FGp%2BbpMlXMNDumfWyPLN4741VajGm5LjCTP5gLWqA6YjxUazLjU1ZFWLRxvtBtKaFigIFwLrGlqt6wa70IA7m0uSFi5uHNFzwnQN8ZkZzRbrkgTsDBjcsYXwW77zhgeJmWYFFvrpkiv4cITA4Bbb04aoR1yLkG%2FVwGkuS1auqHh91rR2GSkLqz9xYEVWh3Q7gPdjt%2BGItQwtX%2Bt9qw34kQpVwaJQ4dkO%2FHAwlYeZMb2DK4HqXMwoUrZWSo4nzITge5fLFy4aVx1piJClC7cVi0wXIPDAhg3slVdecbYygwU9UwhZ9ugTTxStjO%2F2s0%2BLZbnmB%2F9HkdWjAeFdNn3GZF1uL4WSD9RZFxcL9FsCdBzzL8M0EhPxIkLwcor752%2Fv3MH%2BXkOYIFIRut9uGes4AT95V%2BPj7Ta5LDO0fK33%2FfqbPUYPSZzrP2tRqEhd1aqBwJ6bDf8riHmNeZCSxZepsuEJM6NFtv7OO%2FiepUwlaVRId%2FInH1q1aQiMroMnjhvdsohYvTI22u5oZfIgkJu614bEh5%2BLrl7JXguIN6DuTrwnuNYeQppd6mdUIMqXlMCqm1ByGq1ocktu%2F93WyIWuppHoxgEWtiBLXOdYCs2%2F5oqBfB0O6AZqdUBy1aiV5Uvu25dgrvE0kjaDBaamXLDqA2OwVo2FBDKIlM1a2fCEmbLga53c1Dxu9gWk6%2FjYqR6jNo2k3%2BDZh8YsbtkNjz8mrUxYiBdMe5HCpciDEUCQ6nVgPaKg%2B6FTJyGEu%2BGiDX7iPKnpcP2qn6GC4OOvvookHbonqwN1I6GtKVk9nFlM6R9o%2B4A4GSQiDL4j6jqvEws7uFZ%2FCnOej3vE%2FnWkgKvBwcxRz1UTyzfL%2B4oo7DncC%2FP0U5EKVRopF8E9J3HC%2FOGgdm8ekbJnitZsB8sgtSRNZWMiIO%2BNQi6wrg%2BshEY9JNpkZY6IZWo5xYILNGinuvwnkB2sP4Glwq2qQ7HKTkE%2FdLjODbfdypYUE7rxXvi%2BZ8GChevX5IrdUn4aQVShySH5OR2Iu3NxCgIFGn9ni8W6pEcqWa6zKMpKxXXErDydh4XtGClbq4OZo1Ary5ffN6M9OERhF5bNX2Ak4wy2LHgkKql7W06YKUbK1rl73xOmxjIKcy8l0YwHsowI%2BKGWz5BtbwzWHyG6bpECol4HqYZnUdsUFumf3v%2BAHkJdRpq%2FuOde%2FjfIEhasiSyxtyryF884as18dZP0kzKQggZdgqiSzpmr5JyxBej8adefXdxIXOA8Yoh6VK5zrgYL0LQWrQEfaR%2BQ3ACWL7%2Fvvffeq%2F1n0kAjqlCZorBhXY6VvA%2BpKChyXzIndspS2fCEmTJmSutjzpw5ZWkkEwh8EcOaM1mZqnWoI5xgkR0IfvCTjBHos%2F3VbVrSXLlmNd7Lfv2PvzHuW0IIkALLroUGODGhGpDpbD0QkwBczEsccg3LhFfwBa2Ku543uUWzGs%2Fpk1GPTRZLzeU61Yy5Kep2Vskan69pt%2FVg5oxTeKJQK8s3i6PdnBSq%2F84uIM7osUk5UjYTZWMiIc89TO6OhU%2F%2Bi48%2BCl9c2t1dYangNQr6f937TYjz3pSuPxChTR6CEAysuU4E2MzWlMrjxBaQ5qpz59nb770rCQcb%2FufF9c%2FBXQINF3udwd%2BdgbU5C9YmLEqQpCtwGkGSAsvi1IOhYcsiRhrFI%2BxBeX1o7h3BZ%2FoF2Z6jEX%2BCTKcIl1i7FA7tkyazDU89adz7A9mLtAy0%2B3CUoHjGQryO10kCKCFd54cGtf%2BMiJS1HpBMrdCgD9dnsGaHWMK9ulpZvtKDE6dYuFBKrWkkJHo099qqKUbKZqVseMLMALxKPkmK51D%2FNr3m8r9q3pvS9V2CREB8nQiw6QwsSV1%2BHifN4Au5kh%2Ft2Alh3ipIZJ5Y4NoLg2BdCVMhyxMJhABPlXk5sJZNRIRn2zRrE7eugmdAQMVU6fYyPYOclA8Fmj4WtuNpCn2mPRcZ9QjyNV2HRNj2Z7B3wwkjYaSs9YBkYhFkhVZWCt76kfRp5F5YFpZvhve1FilQ0kiyiB61pp3BhTpYrL4zWSh1daNseMLMCMIqOcAq6yLqio6369xalvfbFsJAgsWT5Pr9Lq48BNSIaLz5EPggFBMpgDif%2FZu%2F5u5W5Fl%2BsWc3D0qhEh0SpLnQxBZ0dXF3bhTknqVwwyYlS2ktNwXtmY3r6RKvpUsJz4D7Iqjmq%2BAZhoOFOapo0GALlLyT%2B0e2iFJc68XyICVToYYw6tFmqYoI26EsCk2LqOJqI2W1yKroN%2B3nl4J%2BDto%2BJ3iGQ0SZ4Ees1SrgJ837Rh0eDpD92LTd9dSi6zrZ26v957w5c%2BR6hQfmUMLnrImS4wmzStJkOYRG1zuEOxUc0QXB%2F0iENQXixNfNd%2F88lfuTPcuTVbqXsI%2FaGVyvwCykKQlw9l13spuCr2qFuEKWNgESGfVIooNrsm8jI2XH9Gk4rVHKQ9YwRE1aLd%2BsA35SDjTi1zQdHo45IvIghzI8uaOosQ3rz2nAuvqhOE%2Br0RQaNp%2B3ntDku6BmpInFx9MgYGm%2B9%2FrrxjSNtDG5GGzFt2yEFZb0GeC6webOGEgYrtesnoG7xT78vTNZ0iIFtqhHER08UMtjjHSRsnJcJjdgYBxJkTiS8qVTDTSiZ12ayJIUKRjIUBbkESlbl%2Fm8njA94pImrLSLp%2Fr7ORl8%2BYc%2FZEqcEAzQpsWeHtzj3dWkfhDSvIjAGexpYn80rWfgNWKFJUjSPnocCI5XQ3ItUpDxUCeJlLUekJwHLFGTRss34%2BLd1vvGCTRSz7o0KVRpFimIQNaRsvWaz%2BsJ0yMW4RwVhMOtTQQDgTg3%2F9d%2FhWSRhGRAvC88%2Fzz7bfClXgMLEHt6y4rHZMHSnC%2B07WpJ8%2FSosJirJU757NDw0R8yTzT4OhAlvMR%2BzWx8q5MiBfz6Zy%2FoeflnpWjpdtUiMFnHeUAXNUlTXfJEjPu67sHx%2FjWddVlvdZUL5XO7psrGREZhbMwXdKgXBIthtljIc%2BjrcMvB0jAFxEhSgkVw%2BMTx8BBlCl0uIz4HLZpEm6JwwQ9VPsMi8Qyh8MdG%2BczAiiIFDYzPACL7Zt%2B%2BsNQdEYLOWr5IU7mxwMynqhDT50BGgRxqm5BX2m5qj1iFYQCWUGC6CjWcjyRJf5%2FyLOuZpW%2FH3L0AcfswtfsKC3N5Ifr5e2mEcIbzwzreprFIef711HJrwhOmR9LFg3m9mJGcxAToFZrxNOl6shUA2FKy4g46lMZLRJwJkDgPUFQJmmN5C%2FrmVB5kKdqDcVxi6Y8KwezwDFkDfYTo2CGdcLfNvSxIJu37OvRvLmTp2B7tWGQ5%2Fzw8YTYqgSIAZC6Z7K0aYqEkcNEkaEykCReuKL6e%2BsIR7rRFymK1PUN%2FGkQmFA%2BtUl2rw3FNLjVTe6pwwVWNqD6K%2Byy16sMk16rVHDHN2bTaUqsx84Tp0WikG5KmmsaipGqkYmF6eHh4eML0GBekuYwUCRDJ6YDfw%2FDw8PDwhOkhSBOuUeQqFBCMM3XSZBlg4%2FcwPDw8PDxheiikiT1R5JR0ipewZ%2Fit7xkPDw8PT5geeuJEMM4kX2zZw8PDwxOmh4eHh4dHKvCVfjw8PDw8PDxhenh4eHh4eML08PDw8PDwhOnh4eHh4eEJ08PDw8PDwxOmh4eHh4eHJ0wPDw8PDw9PmB4eHh4eHh6eMD08PDw8PDxhenh4eHh4eML08PDw8PDwhOnh4eHh4eEJ08PDw8PDwxOmh4eHh4eHJ0wPDw8PDw8PT5geHh4eHh6eMD08PDw8PDxhenh4eHh4eML08PDw8PDwhOnh4eHh4eEJ08PDw8PDwxOmh4eHh4eHJ0wPDw8PDw8PT5geHh4eHh6eMD08PDw8PDxhenh4eHh41Av%2BvwADAMJaU7uq0SCHAAAAAElFTkSuQmCC")';
					}
				
					var newImg = document.createElement('img');
					newImg.src = self.imgUrl == '' ? "data:image/gif,%FF%D8%FF%E0%00%10JFIF%00%01%01%00%00%01%00%01%00%00%FF%ED%00%1CPhotoshop%203.0%008BIM%04%04%00%00%00%00%00%00%FF%DB%00C%00%02%02%02%02%02%01%02%02%02%02%02%02%02%03%03%06%04%03%03%03%03%07%05%05%04%06%08%07%08%08%08%07%08%08%09%0A%0D%0B%09%09%0C%0A%08%08%0B%0F%0B%0C%0D%0E%0E%0E%0E%09%0B%10%11%0F%0E%11%0D%0E%0E%0E%FF%DB%00C%01%02%02%02%03%03%03%06%04%04%06%0E%09%08%09%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%FF%C0%00%11%08%00%16%00E%03%01%22%00%02%11%01%03%11%01%FF%C4%00%1F%00%00%01%05%01%01%01%01%01%01%00%00%00%00%00%00%00%00%01%02%03%04%05%06%07%08%09%0A%0B%FF%C4%00%B5%10%00%02%01%03%03%02%04%03%05%05%04%04%00%00%01%7D%01%02%03%00%04%11%05%12!1A%06%13Qa%07%22q%142%81%91%A1%08%23B%B1%C1%15R%D1%F0%243br%82%09%0A%16%17%18%19%1A%25%26'()*456789%3ACDEFGHIJSTUVWXYZcdefghijstuvwxyz%83%84%85%86%87%88%89%8A%92%93%94%95%96%97%98%99%9A%A2%A3%A4%A5%A6%A7%A8%A9%AA%B2%B3%B4%B5%B6%B7%B8%B9%BA%C2%C3%C4%C5%C6%C7%C8%C9%CA%D2%D3%D4%D5%D6%D7%D8%D9%DA%E1%E2%E3%E4%E5%E6%E7%E8%E9%EA%F1%F2%F3%F4%F5%F6%F7%F8%F9%FA%FF%C4%00%1F%01%00%03%01%01%01%01%01%01%01%01%01%00%00%00%00%00%00%01%02%03%04%05%06%07%08%09%0A%0B%FF%C4%00%B5%11%00%02%01%02%04%04%03%04%07%05%04%04%00%01%02w%00%01%02%03%11%04%05!1%06%12AQ%07aq%13%222%81%08%14B%91%A1%B1%C1%09%233R%F0%15br%D1%0A%16%244%E1%25%F1%17%18%19%1A%26'()*56789%3ACDEFGHIJSTUVWXYZcdefghijstuvwxyz%82%83%84%85%86%87%88%89%8A%92%93%94%95%96%97%98%99%9A%A2%A3%A4%A5%A6%A7%A8%A9%AA%B2%B3%B4%B5%B6%B7%B8%B9%BA%C2%C3%C4%C5%C6%C7%C8%C9%CA%D2%D3%D4%D5%D6%D7%D8%D9%DA%E2%E3%E4%E5%E6%E7%E8%E9%EA%F2%F3%F4%F5%F6%F7%F8%F9%FA%FF%DA%00%0C%03%01%00%02%11%03%11%00%3F%00%FC%E9%D14-%09%BC%05%A2K%26%89%A4%3B%B6%9F%0B3%1B(%C9c%E5%AEI%E3%93_%A3%9E!%FD%86%FC%1F%A2%FE%C8%BF%08%F5%1B%8F%08%EAV%BF%135%9F%18h%DA%7F%88%E4%B8%B2%09g%F6%7DL%B1X%A0%05p%5E%20%D0%A3%B0%E8%FB%87%D3%C5%7Fb%7F%84%B6%BF%18%3Fi_%01h%FA%C3%B4%3E%18%D2t%A8%B5mbQ%20O%DD%C4%89%E5%A0'%8C%B4%AD%18%FF%00ww%A5~%AD%7Ct%F0O%85%3E%17xP%EB%BE%10%F1O%8D%AE%7CO%AFx%99%BCA%7Bn5%DF%B6%CD%A9O%A6%D9%DDj%01!IU%D67f%85%10l%5C(l%85%24(%AF%92%C1%E1%E5(N%A4%B6%DBs%FA%9F%8A%B3%DA8%7CN%0F%01%86IO%95I%DA*%CFM%14%9FEni%3D%1F%D9%F5%3F%3B%3C%1F%FB1%7C%06%D7%BF%E0%A3%DF%B4%0F%84u%0D%0A%CA%CF%E1O%C3%ED%22%F6%E2%2F%B7j%8Bd%BEt%0D%0C*%26%BC1%B6%C8%CC%86%5C%B6%D3%81%D8%E3%07%D1%FE%16~%C8%3F%B3%BF%C4%AB%3F%11%EB6%DF%0E%B4%7B%8B%0F%F8M%E0%F0%DE%91kc%F1%15%1A%09%22%8A%D1n%2F%AF-%EE%9A%D4%1B%C2%AA%C5%84K%18%24F%DC%80%09%AD%7D%2F%E3%A7%C6%7D%7BI%B5%F8%9B%E2%2B%9DC%C0%FA%ECzN%B4d%D2%ADm%00MsK%B6%D3~%DB%04%C8%93%AB%C9%85%BA%96%05iU%B6%C8%AF%DBcW%9DxO%C5%DF%14%F5%1D%1B%E1W%8D%BCO%E3%2B%DB%3B%CD%1E%F3S%F8%81%AD%5D%5C%DC%DAi%82V%9B%1A%7D%85%B24%A1!%8E%5B%BF%B3%DC*%96%FF%00%96N%EE%01%08%2B%AA%9C%E9%A7%B5%FE_%D6%D7%3C%CCf%0B0%A9%0978%C1%A8%C6%3AI%BFz)%DFd%93s%94u%95%EF%EF%25%BD%CE%5E%3F%81%9F%B2%8A%FE%CB%1E3%F1n%93%E0%1F%12x%D2x%BE'7%82%3C%23%AB%8DqmSVy%CB%3D%BD%CF%92%20%18X%91%A3%0C%B8%CC%85I%F97%60%3B%E3%E7%C0O%D9S%E1%7F%C7%AD%2B%C0%DA7%82%BF%B7%ADm%B5WMz%F3A%F1%B2%EA%1A%AD%A5%B4%16%C5%AE%0D%C5%81%B6%02%D7%12%3A%B6%E3%23%1D%91%3E%06O%1C%F7%C5K%AF%13%7C6%F8m%E2%BD%3FG%D4%AF%20%D2%F4%DF%8D%7F%DA%FE%07%82%DFd%D0Y2%D9%FD%B6%5B%A0B%911%2Bw%60%AA%CEYp%A7%1Fx%E7%D6a%FD%A2%BE%26%D8%FC%60%8A_%17j0x%ABP%F0%97%C2)%3CA%AB%DFj%11%F92%C3%7Fyd%24%F2%D7%C8%F2%D7%125%DD%84%0E%AE%AD%C26%DD%A5%98%9B%8DH%EC%F4zt4%96%5D%88R%8E%22%94%B9%E0%F9%DD%B9%DAoH%F2%F4%B6%8D%D9%AD%174%9D%93I%1E%F5%E1O%F8'%EF%EC%7F%E2%D5%FBT%DA%07%8D%D4%5DK%BA%DEK%0B%A0%F1%AEH%F9%1D%12%161%E0%9F%96C%FB%A9P%A4%88%E41%0B%97%FBB%FF%00%C1%3B%FF%00e%9F%84%7F%B1G%C4%9F%88%FAf%91%E2%A6%D5t%3D%16I%B4%F1s%AA%23%C4nX%88%E1%DC%BEP%DC%BEc%A6Gz%F0%ED%1B%E2%3F%C4%EF%82%FF%00%B1%A6%BD%AB%F8g%5D%83%C3%3E(%B7%BD%D3%7CU%AA%F8gL%D6!xt%AB%0B%99%D2%DC%E9%7Fe%91%E4%B9%802%3D%BC%EE%C7%01%0C%EA%AAA%DD%9E%03%F6%9C%F8%FD%E3%AB%9F%85%F7%9F%0B%AF%BE)x%AB%C7%F6%9E)kMzx%F5%2Bx%AD%D3I%D2%E6D%BB%B0%B0eH%D0%C9rU%E2%92i%0ETm%8DW%AB%9A%DEU%A9(%3B%C7S%C1%C0%F0%FEsW1%A7%C9%8A%BD%25%3DU%DE%AA%3C%AE%5B%26%96%8F%BD%9FC%F2%BF%C7V60%0D%2B%C8%B2%B3%87w%9B%BB%CB%81W%3Fs%D0QV%FE%20t%D2%3F%ED%AF%FE%C9EV%16O%D9%23%93%8D%A8S%8EuY(%A4%BD%DE%9F%DD%89%E8%1A%3F%C4%CD%0A%D7%C2%1AM%B3%5Bk%3EdVQF%E5%22L%12%A8%01%C7%CF%D2%B4%20%F8%B5%A6%D9j%B6%F7%D6%0D%E2%3B%1B%EBy%04%96%F70%15%8EH%9Cr%19Yd%CA%91%EA%0Eh%A2%BC%17B%1C%CD%D8%FDW%0D%9D%E3~%AD%05%CF%A7*%E8%BBz%1B%9A%8F%ED%1F%E2%3DS_%D2u%7B%FF%00%16%FCA%BC%D5%F4%B0%E3M%D4%26%BE-sh%1F%EF%2Cr%F9%BB%D5O%F7A%C7'%8ENy%BDc%E3M%C6%BD%25%EBkz%BF%8C5%86%BC%B8K%8B%B3%7Drf%F3%E5D(%8E%FB%A4%3B%99U%99T%9E%40%24%0C%03E%15%BCi%C6%C6%0B3%C4F%DC%AD%2B%7Fv%3D%EF%DB%BE%BE%A5%DB%7F%DA%1F%C5V%3A4%FAm%8F%8D%3E%23%D9%E9%D3.%D9%AD%60%D5%A5H%A4%1EZ%C5%86Q.%08%F2%D1%13%9F%E1U%1D%00%15%CB%CD%F1a%E6%BB%D4'%97P%F1%3C%93%DF%C2%B1_H%F3e%AEQ%0A%14I%09%93.%AAc%8C%80r%01E%C7AE%15%D0%A9%C4%E7%FE%D3%C4E%DD4%BF%ED%D8%FF%00%91%0C%DF%15%1A%E7Q%D5%EF.5%0F%13Ow%AA%AB.%A94%93n%7B%D0%CE%B2%113%193%20.%AA%C7vyPz%81U%AF~%23%DA%EAZ%8B%5Ej2%EB%B7%F7l%88%8D%3D%C9%129TP%8873%93%85UU%03%B0%00%0E%05%14U%7B(%8Df%F8%A5%B4%BF%05%FEG%01%E2%FF%00%12%D8jCN%F2%22%BC_%2F%CC%DD%E6%22%8E%BB%7D%18%FAQE%15%E9a%E0%954~%3F%C5X%DA%D53J%B2%94%B5%D3%B7%F2%A3%FF%D9" : self.imgUrl;
					newImg.alt = newImg.title = 'Signaler une alerte qualitaÿ';
					newImg.style.cursor = 'pointer';
					newImg.style.verticalAlign = 'text-bottom';
					newImg.style.marginRight = '3px';
					newImg.addEventListener('click', function(event)
					{
						var newDiv;
						self.currentPostId = self.getElementByXpath('.//a[starts-with(@name, "t")]', toolbar.parentNode.previousSibling).pop().name.substring(1);
						self.currentPostUrl = self.getElementByXpath('.//div[@class="right"]//a', toolbar.parentNode.previousSibling).pop().href;
						if (document.getElementById('alerte_qualitay'))
						{
							newDiv = document.getElementById('alerte_qualitay');
						}
						else
						{
							self.generateStyle();
							cssManager.insertStyle();
							newDiv = self.generatePopup(topicId);
							root.appendChild(newDiv);
						}
						
						var defaultAlerte = true;
						newDiv.style.display = 'none';
						newDiv.firstChild.nextSibling.style.display = 'block';
						

						var alerteDiv = document.getElementById('alerte_qualitay');
						var inputAlertes = document.createElement('select');
						inputAlertes.tabIndex = 1;
						inputAlertes.addEventListener('change', function(){ this.nextSibling.style.display = this.value == '-1' ? 'block' : 'none'; }, false);
						
						var newAlerteOpt = document.createElement('option');
						newAlerteOpt.value = '-1';
						newAlerteOpt.innerHTML = '-- Nouvelle alerte --';
						inputAlertes.appendChild(newAlerteOpt);
						
						self.alertes = new Array();
						Array.forEach(alerteNodes, function(alerteNode)
						{
							var alerteOpt = document.createElement('option');
							alerteOpt.value = alerteNode.getAttribute('id');
							var ids = alerteNode.getAttribute('postsIds').split(/,/);
							if (ids.indexOf(self.currentPostId) != -1)
							{
								alerteOpt.selected = 'selected';
								defaultAlerte = false;
							}
							alerteOpt.innerHTML = '[' + alerteNode.getAttribute('date') + '] ' + alerteNode.getAttribute('nom') + ' (' + alerteNode.getAttribute('pseudoInitiateur') + ')';
							inputAlertes.appendChild(alerteOpt);
						}
						);

						if (alerteDiv.firstChild.nodeName.toLowerCase() != 'select')
						{
							alerteDiv.insertBefore(inputAlertes, alerteDiv.firstChild);
						}
						else
						{
							alerteDiv.replaceChild(inputAlertes, alerteDiv.firstChild);
						}
						if (!defaultAlerte) newDiv.firstChild.nextSibling.style.display = 'none';
						
						alerteDiv.style.display = 'block';
						alerteDiv.style.left = (event.clientX - newDiv.offsetWidth) + 'px';
						alerteDiv.style.top = (window.scrollY + event.clientY + 8) + 'px';
					}
					, false);
					
					var lastDiv = toolbar.lastChild.previousSibling;
					if (lastDiv.className == 'right')
					{
						lastDiv.appendChild(newImg);
					}
					else
					{
						var newDiv = document.createElement('div');
						newDiv.className = 'right';
						newDiv.appendChild(newImg);
						toolbar.insertBefore(newDiv, toolbar.lastChild);
					}
				}
				);				
			}
		});
	}
}).launch();

/******************************************************************/

var toyoAjaxLib = (function()
{
	// Private members

	function loadPage(url, method, arguments, responseHandler)
	{
		var req;
		method = method.toUpperCase();
		if (method == 'GET' && arguments != null) url += '?' + arguments;
		// branch for native XMLHttpRequest object
		if (window.XMLHttpRequest)
		{
			req = new XMLHttpRequest();
			req.onreadystatechange = processReqChange(req, responseHandler);
			req.open(method, url, true);
			if (method == 'POST') req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			arguments = method == 'POST' ? arguments : null;
			req.send(arguments);
		}
		else if (window.ActiveXObject)
		{
			// branch for IE/Windows ActiveX version
			req = new ActiveXObject("Microsoft.XMLHTTP");
			if (req)
			{
				req.onreadystatechange = processReqChange(req, responseHandler);
				req.open(method, url, true);
				if (method == 'POST') req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				if (method == 'POST') req.send(arguments);
				else  req.send();
			}
		}
	}

	function processReqChange(req, responseHandler)
	{
		return function ()
		{
			try
			{
				// only if req shows "loaded"
				if (req.readyState == 4)
				{
					// only if "OK"
					if (req.status == 200)
					{
						var content = req.responseXML != null && req.responseXML.documentElement != null  ? req.responseXML.documentElement : req.responseText;
						if (responseHandler != null) responseHandler(content);
					}
					else
					{
						//alert("There was a problem retrieving the XML data:\n" +
						//req.statusText);
					}
				}
			}
			catch(e){}
		}
	}

	// Public members

	return {
		"loadDoc" : function(url, method, arguments, responseHandler)
		{
			try
			{
				loadPage(url, method, arguments, responseHandler);
			}
			catch(e)
			{
				var msg = (typeof e == "string") ? e : ((e.message) ? e.message : "Unknown Error");
				alert("Unable to get data:\n" + msg);
				return;
			}
		}
	};
})();

// ============ Module d'auto update du script ============
({
	check4Update : function()
	{
		var autoUpdate = this;
		var mirrorUrl = GM_getValue('mirrorUrl', 'null');
		if (mirrorUrl == 'null') autoUpdate.retrieveMirrorUrl();

		var currentVersion = GM_getValue('currentVersion', '0.1.5');
		// On met éventuellement la version stockée à jour avec la version courante, si la version courante est plus récente
		if (autoUpdate.isLater('0.1.5', currentVersion))
		{
			GM_setValue('currentVersion', '0.1.5');
			currentVersion = '0.1.5';
		}			
		// Par contre, si la version stockée est plus récente que la version courante -> création un menu d'update pour la dernière version
		else if (autoUpdate.isLater(currentVersion, '0.1.5'))
		{
			GM_registerMenuCommand("[HFR] Alerte Qualitaÿ -> Installer la version " + currentVersion, function()
			{
				GM_openInTab(mirrorUrl + 'hfr_alerte_qualitay.user.js');
			}
			);
		}
		// Si la version courante et la version stockée sont identiques, on ne fait rien

		if (GM_getValue('lastVersionCheck') == undefined || GM_getValue('lastVersionCheck') == '') GM_setValue('lastVersionCheck', new Date().getTime() + '');
		// Pas eu de check depuis 24h, on vérifie...
		if ((new Date().getTime() - GM_getValue('lastVersionCheck')) > 86400000 && mirrorUrl != 'null')
		{
			var checkUrl = mirrorUrl + 'getLastVersion.php5?name=' + encodeURIComponent('[HFR] Alerte Qualitaÿ');
			if (isNaN(currentVersion.substring(currentVersion.length - 1))) checkUrl += '&sversion=' + currentVersion.substring(currentVersion.length - 1);

			GM_xmlhttpRequest({
				method: "GET",
				url: checkUrl,
				onload: function(response)
				{
					var regExpVersion = new RegExp('^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}[a-zA-Z]?$');
					var lastVersion = response.responseText;
					// Pas d'erreur et nouvelle version plus récente
					if (lastVersion != '-1' && regExpVersion.test(lastVersion) && autoUpdate.isLater(lastVersion, currentVersion))
					{
						if (confirm('Une nouvelle version de [HFR] Alerte Qualitaÿ est disponible : ' + lastVersion + '\nVoulez-vous l\'installer ?'))
						{
							GM_openInTab(mirrorUrl + 'hfr_alerte_qualitay.user.js');
						}
						else
						{
							// Mémorisation de la version refusée : elle servira de version de référence
							GM_setValue('currentVersion', lastVersion);
						}
					}
					GM_setValue('lastVersionCheck', new Date().getTime() + '');
				}
			});
		}
	},

	max : function(v1, v2)
	{
		var tabV1 = v1.split('.');
		var tabV2 = v2.split('.');
		
		if (isNaN(tabV1[2].substring(tabV1[2].length - 1))) tabV1[2] = tabV1[2].substring(0, tabV1[2].length - 1);
		if (isNaN(tabV2[2].substring(tabV2[2].length - 1))) tabV2[2] = tabV2[2].substring(0, tabV2[2].length - 1);

		if ((tabV1[0] > tabV2[0])
		|| (tabV1[0] == tabV2[0] && tabV1[1] > tabV2[1])
		|| (tabV1[0] == tabV2[0] && tabV1[1] == tabV2[1] && tabV1[2] > tabV2[2]))
		{
			return v1;
		}
		else
		{
			return v2;
		}		
	},

	isLater : function(v1, v2)
	{
		return v1 != v2 && this.max(v1, v2) == v1;
	},

	retrieveMirrorUrl : function()
	{	
		var mirrors = 'http://hfr.toyonos.info/gm/;http://hfr-mirror.toyonos.info/gm/'.split(';');
		var checkMirror = function (i)
		{
			var mirror = mirrors[i];
			GM_xmlhttpRequest({
				url: mirror + 'getLastVersion.php5',
				method: "HEAD",
				onload: function(response)
				{
					// Dès qu'un miroir répond, on le mémorise.
					if (response.status == 200)
					{
						GM_setValue('mirrorUrl', mirror);
					}
					else
					{
						// Sinon on test le prochain
						if ((i + 1) < mirrors.length)
						{
							checkMirror(i + 1);
						}
						else
						{
							GM_setValue('mirrorUrl', 'null');
						}
					}
				}
			});		
		};
		checkMirror(0);
	},
}).check4Update();
