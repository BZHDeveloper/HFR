// ==UserScript==
// @author        BZHDeveloper, roger21
// @name          [HFR] Copié/Collé
// @version       0.9.5.1
// @namespace     forum.hardware.fr
// @description   Colle les données du presse-papiers et les traite si elles sont reconnues.
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @downloadURL   https://gitlab.com/BZHDeveloper/HFR/raw/master/hfr_cc.user.js
// @updateURL     https://gitlab.com/BZHDeveloper/HFR/raw/master/hfr_cc.user.js
// @include       https://forum.hardware.fr/message.php*
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/hfr/*
// @noframes
// @grant         GM.info
// @grant         GM.xmlHttpRequest
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// ==/UserScript==

// Historique
// 0.0.3   - [roger21] ajout d'une icône de chargement
// 0.0.6.3 - insertion des données au curseur
// 0.0.7   - [roger21] possibilité de copié/collé dans une réponse rapide
// 0.0.8   - Glisser/déposer les fichiers depuis un explorateur de fichiers vers la zone de texte
// 0.1.1   - Maintenant que tout est bon, on vire imgur et on met reho.st
// 0.1.2   - Ajout d'une balise [url] vers l'image originale
// 0.2.0   - Réintégration d'imgur, si l'image fait > 2 Mo, basculement vers imgur, sinon rester sur reho.st
// 0.2.1   - Possibilité d'envoi de plusieurs images
// 0.2.2   - [roger21] envoi des images dans l'ordre.
// 0.2.3   - compatibilité ViolentMonkey
// 0.3.0   - si les données glisées sont du type "text/uri-list", les télécharger et passer à la fonction "process".
// 0.3.2   - correction du glisser/déposer des images 
// 0.3.3   - conversion des URI base64 en Blob
// 0.3.4   - certaines images ont une balise "data-src", et non "src". Allez comprendre
// 0.3.9   - ajout d'un bouton type "image/file" à chaque zone de texte, fixant le problème de glisser/déposer de certains explorateurs de fichiers.
// 0.4.0.1 - compatibilité HTTPS.
// 0.4.2   - correction du bouton d'envoi d'images (taille / position)
// 0.4.3   - Compatibilité TamperMonkey / GreaseMonkey
// 0.4.3.1 - taille du bouton d'envoi d'image à 24px (fixe le conflit avec des scripts comme "smileys favoris")
// 0.5     - ton navigateur ne respecte pas les dernières normes & innovations ? Tant pis pour toi.
// 0.5.2.1 - On est bien là.
// 0.5.3   - On vérifie si reho.st répond et n'est pas proxytaffé :o
// 0.6.0   - Sur une proposition de DaddyFatSa​x, reconnaissance des liens Twitter et coller le message formaté
// 0.6.2   - lien vers la vidéo .mp4 du GIF Twitter (si existant)
// 0.6.3   - Medias Twitter à l'intérieur de la citation.
// 0.6.4   - Ajout des citations Twitter (tweets imbriqués).
// 0.6.5   - Remplacement des liens GIF/vidéo Twitter par des lecteurs adaptés.
// 0.6.5.1 - Changement de nom.
// 0.7.0   - "génial ton truc ! Et Instagram c'est possible ?" ouais.
// 0.7.2   - copie du texte original si erreur.
// 0.7.2.1 - vérifie si la valeur des liens est bien une chaîne de caractères.
// 0.8.0   - Compatibilité GreaseMonkey 4 : création d'une pile pour remplacer le contexte des requêtes.
// 0.8.1   - Inversion de l'ordre des types de données du presse-papier. Analyser le texte d'abord, puis le code HTML si existant.
// 0.8.2   - Changement dans l'ordre des types de données : Préférer "Files" plutôt que "text/html".
// 0.8.3   - Compatibilité TamperMonkey : Cette extension ne gère pas correctement les réponses Blob. On doit donc créer un nouveau blob à partir de l'ancien, avec le bon mime-type.
// 0.8.4   - Formate les caractères Unicode lors d'un simple copié/collé ou d'un glissé/déposé.
// 0.8.4.3 - Limitation du nombre de caractères avant formatage du texte.
// 0.8.5   - Vérifier si le texte est formatable avant de le formater (consomme moins de ressources).
// 0.8.6   - affichage du nom enrichi pour Twitter.
// 0.8.7   - [roger21] affichage du logo du site et lien vers le message dans le nom de la citation.
// 0.8.8   - formatage correct du nom et du texte pour Instagram.
// 0.8.8.4 - mode anonyme pour Twitter et Instagram.
// 0.8.9   - Twitter : ajout des hashtags évènementiels. rehost automatique des icônes Unicode.
// 0.9.0   - Méthodes asynchrones pour Twitter et Instagram.
// 0.9.0.4 - Instagram : vérification si la photo est jointe avec du texte.
// 0.9.0.5 - Twitter : correction du code pour la copie du tweet.
// 0.9.0.6 - Twitter : Certains caractères Unicode ne passent toujours pas avec HFR, remplacement de ces caractères par d'autres leur ressemblant (je sais, c'est moche).
// 0.9.1   - Conversion d'un PDF en plusieurs images.
// 0.9.1.1 - Affichage des smileys en taille "micro" (la taille "mini" est trop grande par rapport au texte affiché)
// 0.9.2   - [Instagram] Compatibilité avec les pages contenant plusieurs médias (vidéo/image)
// 0.9.2.1 - [Twitter] Ajout de l'en-tête "Referer" pour les requêtes.
// 0.9.2.2 - [Twitter] modification de l'attribut "href" des liens au format t.co pour donner l'adresse finale sans redirection (utile pour les autres scripts HFR)
// 0.9.2.9 - La compatibilité GM4 serait mieux avec le polyfill, hein.
// 0.9.3.2 - Correction compatibilité GM4
// 0.9.4   - Réintroduction du bouton de sélection de fichier, maintenant que c'est fonctionnel
// 0.9.4.2 - Fenêtre de choix de l'image.
// 0.9.4.3 - imgur : correction du titre pour la miniature
// 0.9.4.4 - Option d'affichage ou non de la fenêtre de sélection. Correction de compatibilité
// 0.9.4.5 - reho.st : Il n'y a qu'un seul format pour les GIF.
// 0.9.5   - les emojis sont désormais dans le dépôt gitlab, avec le script. ajouts des emojis jusqu'à la v12
// 0.9.5.1 - Twitter : Application d'un user-agent spécifique pour avoir la vieille version de Twitter

(() => {
	if (typeof GM_registerMenuCommand == 'undefined') {
	  GM_registerMenuCommand = (caption, commandFunc, accessKey) => {
		if (!document.body) {
		  if (document.readyState === 'loading'
			&& document.documentElement && document.documentElement.localName === 'html') {
			new MutationObserver((mutations, observer) => {
			  if (document.body) {
				observer.disconnect();
				GM_registerMenuCommand(caption, commandFunc, accessKey);
			  }
			}).observe(document.documentElement, {childList: true});
		  } else {
			console.error('GM_registerMenuCommand got no body.');
		  }
		  return;
		}
		let contextMenu = document.body.getAttribute('contextmenu');
		let menu = (contextMenu ? document.querySelector('menu#' + contextMenu) : null);
		if (!menu) {
		  menu = document.createElement('menu');
		  menu.setAttribute('id', 'gm-registered-menu');
		  menu.setAttribute('type', 'context');
		  document.body.appendChild(menu);
		  document.body.setAttribute('contextmenu', 'gm-registered-menu');
		}
		let menuItem = document.createElement('menuitem');
		menuItem.textContent = caption;
		menuItem.addEventListener('click', commandFunc, true);
		menu.appendChild(menuItem);
	  };
	}
	
	function isGM4() {
		if (typeof (GM) !== "object")
			return false;
		if (typeof (GM.info) !== "object")
			return false;
		return GM.info.scriptHandler == "Greasemonkey" && parseFloat(GM.info.version) >= 4;
	}

	var HFR = {
		unicode_table : ["1f600","1f603","1f604","1f601","1f606","1f605","1f923","1f602","1f642","1f643","1f609","1f60a","1f607","1f970","1f60d","1f929","1f618","1f617","263a-fe0f","263a","1f61a","1f619","1f60b","1f61b","1f61c","1f92a","1f61d","1f911","1f917","1f92d","1f92b","1f914","1f910","1f928","1f610","1f611","1f636","1f60f","1f612","1f644","1f62c","1f925","1f60c","1f614","1f62a","1f924","1f634","1f637","1f912","1f915","1f922","1f92e","1f927","1f975","1f976","1f974","1f635","1f92f","1f920","1f973","1f60e","1f913","1f9d0","1f615","1f61f","1f641","2639-fe0f","2639","1f62e","1f62f","1f632","1f633","1f97a","1f626","1f627","1f628","1f630","1f625","1f622","1f62d","1f631","1f616","1f623","1f61e","1f613","1f629","1f62b","1f971","1f624","1f621","1f620","1f92c","1f608","1f47f","1f480","2620-fe0f","2620","1f4a9","1f921","1f479","1f47a","1f47b","1f47d","1f47e","1f916","1f63a","1f638","1f639","1f63b","1f63c","1f63d","1f640","1f63f","1f63e","1f648","1f649","1f64a","1f48b","1f48c","1f498","1f49d","1f496","1f497","1f493","1f49e","1f495","1f49f","2763-fe0f","2763","1f494","2764-fe0f","2764","1f9e1","1f49b","1f49a","1f499","1f49c","1f90e","1f5a4","1f90d","1f4af","1f4a2","1f4a5","1f4ab","1f4a6","1f4a8","1f573-fe0f","1f573","1f4a3","1f4ac","1f441-fe0f-200d-1f5e8-fe0f","1f441-200d-1f5e8-fe0f","1f441-fe0f-200d-1f5e8","1f441-200d-1f5e8","1f5e8-fe0f","1f5e8","1f5ef-fe0f","1f5ef","1f4ad","1f4a4","1f44b","1f44b-1f3fb","1f44b-1f3fc","1f44b-1f3fd","1f44b-1f3fe","1f44b-1f3ff","1f91a","1f91a-1f3fb","1f91a-1f3fc","1f91a-1f3fd","1f91a-1f3fe","1f91a-1f3ff","1f590-fe0f","1f590","1f590-1f3fb","1f590-1f3fc","1f590-1f3fd","1f590-1f3fe","1f590-1f3ff","270b","270b-1f3fb","270b-1f3fc","270b-1f3fd","270b-1f3fe","270b-1f3ff","1f596","1f596-1f3fb","1f596-1f3fc","1f596-1f3fd","1f596-1f3fe","1f596-1f3ff","1f44c","1f44c-1f3fb","1f44c-1f3fc","1f44c-1f3fd","1f44c-1f3fe","1f44c-1f3ff","1f90f","1f90f-1f3fb","1f90f-1f3fc","1f90f-1f3fd","1f90f-1f3fe","1f90f-1f3ff","270c-fe0f","270c","270c-1f3fb","270c-1f3fc","270c-1f3fd","270c-1f3fe","270c-1f3ff","1f91e","1f91e-1f3fb","1f91e-1f3fc","1f91e-1f3fd","1f91e-1f3fe","1f91e-1f3ff","1f91f","1f91f-1f3fb","1f91f-1f3fc","1f91f-1f3fd","1f91f-1f3fe","1f91f-1f3ff","1f918","1f918-1f3fb","1f918-1f3fc","1f918-1f3fd","1f918-1f3fe","1f918-1f3ff","1f919","1f919-1f3fb","1f919-1f3fc","1f919-1f3fd","1f919-1f3fe","1f919-1f3ff","1f448","1f448-1f3fb","1f448-1f3fc","1f448-1f3fd","1f448-1f3fe","1f448-1f3ff","1f449","1f449-1f3fb","1f449-1f3fc","1f449-1f3fd","1f449-1f3fe","1f449-1f3ff","1f446","1f446-1f3fb","1f446-1f3fc","1f446-1f3fd","1f446-1f3fe","1f446-1f3ff","1f595","1f595-1f3fb","1f595-1f3fc","1f595-1f3fd","1f595-1f3fe","1f595-1f3ff","1f447","1f447-1f3fb","1f447-1f3fc","1f447-1f3fd","1f447-1f3fe","1f447-1f3ff","261d-fe0f","261d","261d-1f3fb","261d-1f3fc","261d-1f3fd","261d-1f3fe","261d-1f3ff","1f44d","1f44d-1f3fb","1f44d-1f3fc","1f44d-1f3fd","1f44d-1f3fe","1f44d-1f3ff","1f44e","1f44e-1f3fb","1f44e-1f3fc","1f44e-1f3fd","1f44e-1f3fe","1f44e-1f3ff","270a","270a-1f3fb","270a-1f3fc","270a-1f3fd","270a-1f3fe","270a-1f3ff","1f44a","1f44a-1f3fb","1f44a-1f3fc","1f44a-1f3fd","1f44a-1f3fe","1f44a-1f3ff","1f91b","1f91b-1f3fb","1f91b-1f3fc","1f91b-1f3fd","1f91b-1f3fe","1f91b-1f3ff","1f91c","1f91c-1f3fb","1f91c-1f3fc","1f91c-1f3fd","1f91c-1f3fe","1f91c-1f3ff","1f44f","1f44f-1f3fb","1f44f-1f3fc","1f44f-1f3fd","1f44f-1f3fe","1f44f-1f3ff","1f64c","1f64c-1f3fb","1f64c-1f3fc","1f64c-1f3fd","1f64c-1f3fe","1f64c-1f3ff","1f450","1f450-1f3fb","1f450-1f3fc","1f450-1f3fd","1f450-1f3fe","1f450-1f3ff","1f932","1f932-1f3fb","1f932-1f3fc","1f932-1f3fd","1f932-1f3fe","1f932-1f3ff","1f91d","1f64f","1f64f-1f3fb","1f64f-1f3fc","1f64f-1f3fd","1f64f-1f3fe","1f64f-1f3ff","270d-fe0f","270d","270d-1f3fb","270d-1f3fc","270d-1f3fd","270d-1f3fe","270d-1f3ff","1f485","1f485-1f3fb","1f485-1f3fc","1f485-1f3fd","1f485-1f3fe","1f485-1f3ff","1f933","1f933-1f3fb","1f933-1f3fc","1f933-1f3fd","1f933-1f3fe","1f933-1f3ff","1f4aa","1f4aa-1f3fb","1f4aa-1f3fc","1f4aa-1f3fd","1f4aa-1f3fe","1f4aa-1f3ff","1f9be","1f9bf","1f9b5","1f9b5-1f3fb","1f9b5-1f3fc","1f9b5-1f3fd","1f9b5-1f3fe","1f9b5-1f3ff","1f9b6","1f9b6-1f3fb","1f9b6-1f3fc","1f9b6-1f3fd","1f9b6-1f3fe","1f9b6-1f3ff","1f442","1f442-1f3fb","1f442-1f3fc","1f442-1f3fd","1f442-1f3fe","1f442-1f3ff","1f9bb","1f9bb-1f3fb","1f9bb-1f3fc","1f9bb-1f3fd","1f9bb-1f3fe","1f9bb-1f3ff","1f443","1f443-1f3fb","1f443-1f3fc","1f443-1f3fd","1f443-1f3fe","1f443-1f3ff","1f9e0","1f9b7","1f9b4","1f440","1f441-fe0f","1f441","1f445","1f444","1f476","1f476-1f3fb","1f476-1f3fc","1f476-1f3fd","1f476-1f3fe","1f476-1f3ff","1f9d2","1f9d2-1f3fb","1f9d2-1f3fc","1f9d2-1f3fd","1f9d2-1f3fe","1f9d2-1f3ff","1f466","1f466-1f3fb","1f466-1f3fc","1f466-1f3fd","1f466-1f3fe","1f466-1f3ff","1f467","1f467-1f3fb","1f467-1f3fc","1f467-1f3fd","1f467-1f3fe","1f467-1f3ff","1f9d1","1f9d1-1f3fb","1f9d1-1f3fc","1f9d1-1f3fd","1f9d1-1f3fe","1f9d1-1f3ff","1f471","1f471-1f3fb","1f471-1f3fc","1f471-1f3fd","1f471-1f3fe","1f471-1f3ff","1f468","1f468-1f3fb","1f468-1f3fc","1f468-1f3fd","1f468-1f3fe","1f468-1f3ff","1f9d4","1f9d4-1f3fb","1f9d4-1f3fc","1f9d4-1f3fd","1f9d4-1f3fe","1f9d4-1f3ff","1f471-200d-2642-fe0f","1f471-200d-2642","1f471-1f3fb-200d-2642-fe0f","1f471-1f3fb-200d-2642","1f471-1f3fc-200d-2642-fe0f","1f471-1f3fc-200d-2642","1f471-1f3fd-200d-2642-fe0f","1f471-1f3fd-200d-2642","1f471-1f3fe-200d-2642-fe0f","1f471-1f3fe-200d-2642","1f471-1f3ff-200d-2642-fe0f","1f471-1f3ff-200d-2642","1f468-200d-1f9b0","1f468-1f3fb-200d-1f9b0","1f468-1f3fc-200d-1f9b0","1f468-1f3fd-200d-1f9b0","1f468-1f3fe-200d-1f9b0","1f468-1f3ff-200d-1f9b0","1f468-200d-1f9b1","1f468-1f3fb-200d-1f9b1","1f468-1f3fc-200d-1f9b1","1f468-1f3fd-200d-1f9b1","1f468-1f3fe-200d-1f9b1","1f468-1f3ff-200d-1f9b1","1f468-200d-1f9b3","1f468-1f3fb-200d-1f9b3","1f468-1f3fc-200d-1f9b3","1f468-1f3fd-200d-1f9b3","1f468-1f3fe-200d-1f9b3","1f468-1f3ff-200d-1f9b3","1f468-200d-1f9b2","1f468-1f3fb-200d-1f9b2","1f468-1f3fc-200d-1f9b2","1f468-1f3fd-200d-1f9b2","1f468-1f3fe-200d-1f9b2","1f468-1f3ff-200d-1f9b2","1f469","1f469-1f3fb","1f469-1f3fc","1f469-1f3fd","1f469-1f3fe","1f469-1f3ff","1f471-200d-2640-fe0f","1f471-200d-2640","1f471-1f3fb-200d-2640-fe0f","1f471-1f3fb-200d-2640","1f471-1f3fc-200d-2640-fe0f","1f471-1f3fc-200d-2640","1f471-1f3fd-200d-2640-fe0f","1f471-1f3fd-200d-2640","1f471-1f3fe-200d-2640-fe0f","1f471-1f3fe-200d-2640","1f471-1f3ff-200d-2640-fe0f","1f471-1f3ff-200d-2640","1f469-200d-1f9b0","1f469-1f3fb-200d-1f9b0","1f469-1f3fc-200d-1f9b0","1f469-1f3fd-200d-1f9b0","1f469-1f3fe-200d-1f9b0","1f469-1f3ff-200d-1f9b0","1f469-200d-1f9b1","1f469-1f3fb-200d-1f9b1","1f469-1f3fc-200d-1f9b1","1f469-1f3fd-200d-1f9b1","1f469-1f3fe-200d-1f9b1","1f469-1f3ff-200d-1f9b1","1f469-200d-1f9b3","1f469-1f3fb-200d-1f9b3","1f469-1f3fc-200d-1f9b3","1f469-1f3fd-200d-1f9b3","1f469-1f3fe-200d-1f9b3","1f469-1f3ff-200d-1f9b3","1f469-200d-1f9b2","1f469-1f3fb-200d-1f9b2","1f469-1f3fc-200d-1f9b2","1f469-1f3fd-200d-1f9b2","1f469-1f3fe-200d-1f9b2","1f469-1f3ff-200d-1f9b2","1f9d3","1f9d3-1f3fb","1f9d3-1f3fc","1f9d3-1f3fd","1f9d3-1f3fe","1f9d3-1f3ff","1f474","1f474-1f3fb","1f474-1f3fc","1f474-1f3fd","1f474-1f3fe","1f474-1f3ff","1f475","1f475-1f3fb","1f475-1f3fc","1f475-1f3fd","1f475-1f3fe","1f475-1f3ff","1f64d","1f64d-1f3fb","1f64d-1f3fc","1f64d-1f3fd","1f64d-1f3fe","1f64d-1f3ff","1f64d-200d-2642-fe0f","1f64d-200d-2642","1f64d-1f3fb-200d-2642-fe0f","1f64d-1f3fb-200d-2642","1f64d-1f3fc-200d-2642-fe0f","1f64d-1f3fc-200d-2642","1f64d-1f3fd-200d-2642-fe0f","1f64d-1f3fd-200d-2642","1f64d-1f3fe-200d-2642-fe0f","1f64d-1f3fe-200d-2642","1f64d-1f3ff-200d-2642-fe0f","1f64d-1f3ff-200d-2642","1f64d-200d-2640-fe0f","1f64d-200d-2640","1f64d-1f3fb-200d-2640-fe0f","1f64d-1f3fb-200d-2640","1f64d-1f3fc-200d-2640-fe0f","1f64d-1f3fc-200d-2640","1f64d-1f3fd-200d-2640-fe0f","1f64d-1f3fd-200d-2640","1f64d-1f3fe-200d-2640-fe0f","1f64d-1f3fe-200d-2640","1f64d-1f3ff-200d-2640-fe0f","1f64d-1f3ff-200d-2640","1f64e","1f64e-1f3fb","1f64e-1f3fc","1f64e-1f3fd","1f64e-1f3fe","1f64e-1f3ff","1f64e-200d-2642-fe0f","1f64e-200d-2642","1f64e-1f3fb-200d-2642-fe0f","1f64e-1f3fb-200d-2642","1f64e-1f3fc-200d-2642-fe0f","1f64e-1f3fc-200d-2642","1f64e-1f3fd-200d-2642-fe0f","1f64e-1f3fd-200d-2642","1f64e-1f3fe-200d-2642-fe0f","1f64e-1f3fe-200d-2642","1f64e-1f3ff-200d-2642-fe0f","1f64e-1f3ff-200d-2642","1f64e-200d-2640-fe0f","1f64e-200d-2640","1f64e-1f3fb-200d-2640-fe0f","1f64e-1f3fb-200d-2640","1f64e-1f3fc-200d-2640-fe0f","1f64e-1f3fc-200d-2640","1f64e-1f3fd-200d-2640-fe0f","1f64e-1f3fd-200d-2640","1f64e-1f3fe-200d-2640-fe0f","1f64e-1f3fe-200d-2640","1f64e-1f3ff-200d-2640-fe0f","1f64e-1f3ff-200d-2640","1f645","1f645-1f3fb","1f645-1f3fc","1f645-1f3fd","1f645-1f3fe","1f645-1f3ff","1f645-200d-2642-fe0f","1f645-200d-2642","1f645-1f3fb-200d-2642-fe0f","1f645-1f3fb-200d-2642","1f645-1f3fc-200d-2642-fe0f","1f645-1f3fc-200d-2642","1f645-1f3fd-200d-2642-fe0f","1f645-1f3fd-200d-2642","1f645-1f3fe-200d-2642-fe0f","1f645-1f3fe-200d-2642","1f645-1f3ff-200d-2642-fe0f","1f645-1f3ff-200d-2642","1f645-200d-2640-fe0f","1f645-200d-2640","1f645-1f3fb-200d-2640-fe0f","1f645-1f3fb-200d-2640","1f645-1f3fc-200d-2640-fe0f","1f645-1f3fc-200d-2640","1f645-1f3fd-200d-2640-fe0f","1f645-1f3fd-200d-2640","1f645-1f3fe-200d-2640-fe0f","1f645-1f3fe-200d-2640","1f645-1f3ff-200d-2640-fe0f","1f645-1f3ff-200d-2640","1f646","1f646-1f3fb","1f646-1f3fc","1f646-1f3fd","1f646-1f3fe","1f646-1f3ff","1f646-200d-2642-fe0f","1f646-200d-2642","1f646-1f3fb-200d-2642-fe0f","1f646-1f3fb-200d-2642","1f646-1f3fc-200d-2642-fe0f","1f646-1f3fc-200d-2642","1f646-1f3fd-200d-2642-fe0f","1f646-1f3fd-200d-2642","1f646-1f3fe-200d-2642-fe0f","1f646-1f3fe-200d-2642","1f646-1f3ff-200d-2642-fe0f","1f646-1f3ff-200d-2642","1f646-200d-2640-fe0f","1f646-200d-2640","1f646-1f3fb-200d-2640-fe0f","1f646-1f3fb-200d-2640","1f646-1f3fc-200d-2640-fe0f","1f646-1f3fc-200d-2640","1f646-1f3fd-200d-2640-fe0f","1f646-1f3fd-200d-2640","1f646-1f3fe-200d-2640-fe0f","1f646-1f3fe-200d-2640","1f646-1f3ff-200d-2640-fe0f","1f646-1f3ff-200d-2640","1f481","1f481-1f3fb","1f481-1f3fc","1f481-1f3fd","1f481-1f3fe","1f481-1f3ff","1f481-200d-2642-fe0f","1f481-200d-2642","1f481-1f3fb-200d-2642-fe0f","1f481-1f3fb-200d-2642","1f481-1f3fc-200d-2642-fe0f","1f481-1f3fc-200d-2642","1f481-1f3fd-200d-2642-fe0f","1f481-1f3fd-200d-2642","1f481-1f3fe-200d-2642-fe0f","1f481-1f3fe-200d-2642","1f481-1f3ff-200d-2642-fe0f","1f481-1f3ff-200d-2642","1f481-200d-2640-fe0f","1f481-200d-2640","1f481-1f3fb-200d-2640-fe0f","1f481-1f3fb-200d-2640","1f481-1f3fc-200d-2640-fe0f","1f481-1f3fc-200d-2640","1f481-1f3fd-200d-2640-fe0f","1f481-1f3fd-200d-2640","1f481-1f3fe-200d-2640-fe0f","1f481-1f3fe-200d-2640","1f481-1f3ff-200d-2640-fe0f","1f481-1f3ff-200d-2640","1f64b","1f64b-1f3fb","1f64b-1f3fc","1f64b-1f3fd","1f64b-1f3fe","1f64b-1f3ff","1f64b-200d-2642-fe0f","1f64b-200d-2642","1f64b-1f3fb-200d-2642-fe0f","1f64b-1f3fb-200d-2642","1f64b-1f3fc-200d-2642-fe0f","1f64b-1f3fc-200d-2642","1f64b-1f3fd-200d-2642-fe0f","1f64b-1f3fd-200d-2642","1f64b-1f3fe-200d-2642-fe0f","1f64b-1f3fe-200d-2642","1f64b-1f3ff-200d-2642-fe0f","1f64b-1f3ff-200d-2642","1f64b-200d-2640-fe0f","1f64b-200d-2640","1f64b-1f3fb-200d-2640-fe0f","1f64b-1f3fb-200d-2640","1f64b-1f3fc-200d-2640-fe0f","1f64b-1f3fc-200d-2640","1f64b-1f3fd-200d-2640-fe0f","1f64b-1f3fd-200d-2640","1f64b-1f3fe-200d-2640-fe0f","1f64b-1f3fe-200d-2640","1f64b-1f3ff-200d-2640-fe0f","1f64b-1f3ff-200d-2640","1f9cf","1f9cf-1f3fb","1f9cf-1f3fc","1f9cf-1f3fd","1f9cf-1f3fe","1f9cf-1f3ff","1f9cf-200d-2642-fe0f","1f9cf-200d-2642","1f9cf-1f3fb-200d-2642-fe0f","1f9cf-1f3fb-200d-2642","1f9cf-1f3fc-200d-2642-fe0f","1f9cf-1f3fc-200d-2642","1f9cf-1f3fd-200d-2642-fe0f","1f9cf-1f3fd-200d-2642","1f9cf-1f3fe-200d-2642-fe0f","1f9cf-1f3fe-200d-2642","1f9cf-1f3ff-200d-2642-fe0f","1f9cf-1f3ff-200d-2642","1f9cf-200d-2640-fe0f","1f9cf-200d-2640","1f9cf-1f3fb-200d-2640-fe0f","1f9cf-1f3fb-200d-2640","1f9cf-1f3fc-200d-2640-fe0f","1f9cf-1f3fc-200d-2640","1f9cf-1f3fd-200d-2640-fe0f","1f9cf-1f3fd-200d-2640","1f9cf-1f3fe-200d-2640-fe0f","1f9cf-1f3fe-200d-2640","1f9cf-1f3ff-200d-2640-fe0f","1f9cf-1f3ff-200d-2640","1f647","1f647-1f3fb","1f647-1f3fc","1f647-1f3fd","1f647-1f3fe","1f647-1f3ff","1f647-200d-2642-fe0f","1f647-200d-2642","1f647-1f3fb-200d-2642-fe0f","1f647-1f3fb-200d-2642","1f647-1f3fc-200d-2642-fe0f","1f647-1f3fc-200d-2642","1f647-1f3fd-200d-2642-fe0f","1f647-1f3fd-200d-2642","1f647-1f3fe-200d-2642-fe0f","1f647-1f3fe-200d-2642","1f647-1f3ff-200d-2642-fe0f","1f647-1f3ff-200d-2642","1f647-200d-2640-fe0f","1f647-200d-2640","1f647-1f3fb-200d-2640-fe0f","1f647-1f3fb-200d-2640","1f647-1f3fc-200d-2640-fe0f","1f647-1f3fc-200d-2640","1f647-1f3fd-200d-2640-fe0f","1f647-1f3fd-200d-2640","1f647-1f3fe-200d-2640-fe0f","1f647-1f3fe-200d-2640","1f647-1f3ff-200d-2640-fe0f","1f647-1f3ff-200d-2640","1f926","1f926-1f3fb","1f926-1f3fc","1f926-1f3fd","1f926-1f3fe","1f926-1f3ff","1f926-200d-2642-fe0f","1f926-200d-2642","1f926-1f3fb-200d-2642-fe0f","1f926-1f3fb-200d-2642","1f926-1f3fc-200d-2642-fe0f","1f926-1f3fc-200d-2642","1f926-1f3fd-200d-2642-fe0f","1f926-1f3fd-200d-2642","1f926-1f3fe-200d-2642-fe0f","1f926-1f3fe-200d-2642","1f926-1f3ff-200d-2642-fe0f","1f926-1f3ff-200d-2642","1f926-200d-2640-fe0f","1f926-200d-2640","1f926-1f3fb-200d-2640-fe0f","1f926-1f3fb-200d-2640","1f926-1f3fc-200d-2640-fe0f","1f926-1f3fc-200d-2640","1f926-1f3fd-200d-2640-fe0f","1f926-1f3fd-200d-2640","1f926-1f3fe-200d-2640-fe0f","1f926-1f3fe-200d-2640","1f926-1f3ff-200d-2640-fe0f","1f926-1f3ff-200d-2640","1f937","1f937-1f3fb","1f937-1f3fc","1f937-1f3fd","1f937-1f3fe","1f937-1f3ff","1f937-200d-2642-fe0f","1f937-200d-2642","1f937-1f3fb-200d-2642-fe0f","1f937-1f3fb-200d-2642","1f937-1f3fc-200d-2642-fe0f","1f937-1f3fc-200d-2642","1f937-1f3fd-200d-2642-fe0f","1f937-1f3fd-200d-2642","1f937-1f3fe-200d-2642-fe0f","1f937-1f3fe-200d-2642","1f937-1f3ff-200d-2642-fe0f","1f937-1f3ff-200d-2642","1f937-200d-2640-fe0f","1f937-200d-2640","1f937-1f3fb-200d-2640-fe0f","1f937-1f3fb-200d-2640","1f937-1f3fc-200d-2640-fe0f","1f937-1f3fc-200d-2640","1f937-1f3fd-200d-2640-fe0f","1f937-1f3fd-200d-2640","1f937-1f3fe-200d-2640-fe0f","1f937-1f3fe-200d-2640","1f937-1f3ff-200d-2640-fe0f","1f937-1f3ff-200d-2640","1f468-200d-2695-fe0f","1f468-200d-2695","1f468-1f3fb-200d-2695-fe0f","1f468-1f3fb-200d-2695","1f468-1f3fc-200d-2695-fe0f","1f468-1f3fc-200d-2695","1f468-1f3fd-200d-2695-fe0f","1f468-1f3fd-200d-2695","1f468-1f3fe-200d-2695-fe0f","1f468-1f3fe-200d-2695","1f468-1f3ff-200d-2695-fe0f","1f468-1f3ff-200d-2695","1f469-200d-2695-fe0f","1f469-200d-2695","1f469-1f3fb-200d-2695-fe0f","1f469-1f3fb-200d-2695","1f469-1f3fc-200d-2695-fe0f","1f469-1f3fc-200d-2695","1f469-1f3fd-200d-2695-fe0f","1f469-1f3fd-200d-2695","1f469-1f3fe-200d-2695-fe0f","1f469-1f3fe-200d-2695","1f469-1f3ff-200d-2695-fe0f","1f469-1f3ff-200d-2695","1f468-200d-1f393","1f468-1f3fb-200d-1f393","1f468-1f3fc-200d-1f393","1f468-1f3fd-200d-1f393","1f468-1f3fe-200d-1f393","1f468-1f3ff-200d-1f393","1f469-200d-1f393","1f469-1f3fb-200d-1f393","1f469-1f3fc-200d-1f393","1f469-1f3fd-200d-1f393","1f469-1f3fe-200d-1f393","1f469-1f3ff-200d-1f393","1f468-200d-1f3eb","1f468-1f3fb-200d-1f3eb","1f468-1f3fc-200d-1f3eb","1f468-1f3fd-200d-1f3eb","1f468-1f3fe-200d-1f3eb","1f468-1f3ff-200d-1f3eb","1f469-200d-1f3eb","1f469-1f3fb-200d-1f3eb","1f469-1f3fc-200d-1f3eb","1f469-1f3fd-200d-1f3eb","1f469-1f3fe-200d-1f3eb","1f469-1f3ff-200d-1f3eb","1f468-200d-2696-fe0f","1f468-200d-2696","1f468-1f3fb-200d-2696-fe0f","1f468-1f3fb-200d-2696","1f468-1f3fc-200d-2696-fe0f","1f468-1f3fc-200d-2696","1f468-1f3fd-200d-2696-fe0f","1f468-1f3fd-200d-2696","1f468-1f3fe-200d-2696-fe0f","1f468-1f3fe-200d-2696","1f468-1f3ff-200d-2696-fe0f","1f468-1f3ff-200d-2696","1f469-200d-2696-fe0f","1f469-200d-2696","1f469-1f3fb-200d-2696-fe0f","1f469-1f3fb-200d-2696","1f469-1f3fc-200d-2696-fe0f","1f469-1f3fc-200d-2696","1f469-1f3fd-200d-2696-fe0f","1f469-1f3fd-200d-2696","1f469-1f3fe-200d-2696-fe0f","1f469-1f3fe-200d-2696","1f469-1f3ff-200d-2696-fe0f","1f469-1f3ff-200d-2696","1f468-200d-1f33e","1f468-1f3fb-200d-1f33e","1f468-1f3fc-200d-1f33e","1f468-1f3fd-200d-1f33e","1f468-1f3fe-200d-1f33e","1f468-1f3ff-200d-1f33e","1f469-200d-1f33e","1f469-1f3fb-200d-1f33e","1f469-1f3fc-200d-1f33e","1f469-1f3fd-200d-1f33e","1f469-1f3fe-200d-1f33e","1f469-1f3ff-200d-1f33e","1f468-200d-1f373","1f468-1f3fb-200d-1f373","1f468-1f3fc-200d-1f373","1f468-1f3fd-200d-1f373","1f468-1f3fe-200d-1f373","1f468-1f3ff-200d-1f373","1f469-200d-1f373","1f469-1f3fb-200d-1f373","1f469-1f3fc-200d-1f373","1f469-1f3fd-200d-1f373","1f469-1f3fe-200d-1f373","1f469-1f3ff-200d-1f373","1f468-200d-1f527","1f468-1f3fb-200d-1f527","1f468-1f3fc-200d-1f527","1f468-1f3fd-200d-1f527","1f468-1f3fe-200d-1f527","1f468-1f3ff-200d-1f527","1f469-200d-1f527","1f469-1f3fb-200d-1f527","1f469-1f3fc-200d-1f527","1f469-1f3fd-200d-1f527","1f469-1f3fe-200d-1f527","1f469-1f3ff-200d-1f527","1f468-200d-1f3ed","1f468-1f3fb-200d-1f3ed","1f468-1f3fc-200d-1f3ed","1f468-1f3fd-200d-1f3ed","1f468-1f3fe-200d-1f3ed","1f468-1f3ff-200d-1f3ed","1f469-200d-1f3ed","1f469-1f3fb-200d-1f3ed","1f469-1f3fc-200d-1f3ed","1f469-1f3fd-200d-1f3ed","1f469-1f3fe-200d-1f3ed","1f469-1f3ff-200d-1f3ed","1f468-200d-1f4bc","1f468-1f3fb-200d-1f4bc","1f468-1f3fc-200d-1f4bc","1f468-1f3fd-200d-1f4bc","1f468-1f3fe-200d-1f4bc","1f468-1f3ff-200d-1f4bc","1f469-200d-1f4bc","1f469-1f3fb-200d-1f4bc","1f469-1f3fc-200d-1f4bc","1f469-1f3fd-200d-1f4bc","1f469-1f3fe-200d-1f4bc","1f469-1f3ff-200d-1f4bc","1f468-200d-1f52c","1f468-1f3fb-200d-1f52c","1f468-1f3fc-200d-1f52c","1f468-1f3fd-200d-1f52c","1f468-1f3fe-200d-1f52c","1f468-1f3ff-200d-1f52c","1f469-200d-1f52c","1f469-1f3fb-200d-1f52c","1f469-1f3fc-200d-1f52c","1f469-1f3fd-200d-1f52c","1f469-1f3fe-200d-1f52c","1f469-1f3ff-200d-1f52c","1f468-200d-1f4bb","1f468-1f3fb-200d-1f4bb","1f468-1f3fc-200d-1f4bb","1f468-1f3fd-200d-1f4bb","1f468-1f3fe-200d-1f4bb","1f468-1f3ff-200d-1f4bb","1f469-200d-1f4bb","1f469-1f3fb-200d-1f4bb","1f469-1f3fc-200d-1f4bb","1f469-1f3fd-200d-1f4bb","1f469-1f3fe-200d-1f4bb","1f469-1f3ff-200d-1f4bb","1f468-200d-1f3a4","1f468-1f3fb-200d-1f3a4","1f468-1f3fc-200d-1f3a4","1f468-1f3fd-200d-1f3a4","1f468-1f3fe-200d-1f3a4","1f468-1f3ff-200d-1f3a4","1f469-200d-1f3a4","1f469-1f3fb-200d-1f3a4","1f469-1f3fc-200d-1f3a4","1f469-1f3fd-200d-1f3a4","1f469-1f3fe-200d-1f3a4","1f469-1f3ff-200d-1f3a4","1f468-200d-1f3a8","1f468-1f3fb-200d-1f3a8","1f468-1f3fc-200d-1f3a8","1f468-1f3fd-200d-1f3a8","1f468-1f3fe-200d-1f3a8","1f468-1f3ff-200d-1f3a8","1f469-200d-1f3a8","1f469-1f3fb-200d-1f3a8","1f469-1f3fc-200d-1f3a8","1f469-1f3fd-200d-1f3a8","1f469-1f3fe-200d-1f3a8","1f469-1f3ff-200d-1f3a8","1f468-200d-2708-fe0f","1f468-200d-2708","1f468-1f3fb-200d-2708-fe0f","1f468-1f3fb-200d-2708","1f468-1f3fc-200d-2708-fe0f","1f468-1f3fc-200d-2708","1f468-1f3fd-200d-2708-fe0f","1f468-1f3fd-200d-2708","1f468-1f3fe-200d-2708-fe0f","1f468-1f3fe-200d-2708","1f468-1f3ff-200d-2708-fe0f","1f468-1f3ff-200d-2708","1f469-200d-2708-fe0f","1f469-200d-2708","1f469-1f3fb-200d-2708-fe0f","1f469-1f3fb-200d-2708","1f469-1f3fc-200d-2708-fe0f","1f469-1f3fc-200d-2708","1f469-1f3fd-200d-2708-fe0f","1f469-1f3fd-200d-2708","1f469-1f3fe-200d-2708-fe0f","1f469-1f3fe-200d-2708","1f469-1f3ff-200d-2708-fe0f","1f469-1f3ff-200d-2708","1f468-200d-1f680","1f468-1f3fb-200d-1f680","1f468-1f3fc-200d-1f680","1f468-1f3fd-200d-1f680","1f468-1f3fe-200d-1f680","1f468-1f3ff-200d-1f680","1f469-200d-1f680","1f469-1f3fb-200d-1f680","1f469-1f3fc-200d-1f680","1f469-1f3fd-200d-1f680","1f469-1f3fe-200d-1f680","1f469-1f3ff-200d-1f680","1f468-200d-1f692","1f468-1f3fb-200d-1f692","1f468-1f3fc-200d-1f692","1f468-1f3fd-200d-1f692","1f468-1f3fe-200d-1f692","1f468-1f3ff-200d-1f692","1f469-200d-1f692","1f469-1f3fb-200d-1f692","1f469-1f3fc-200d-1f692","1f469-1f3fd-200d-1f692","1f469-1f3fe-200d-1f692","1f469-1f3ff-200d-1f692","1f46e","1f46e-1f3fb","1f46e-1f3fc","1f46e-1f3fd","1f46e-1f3fe","1f46e-1f3ff","1f46e-200d-2642-fe0f","1f46e-200d-2642","1f46e-1f3fb-200d-2642-fe0f","1f46e-1f3fb-200d-2642","1f46e-1f3fc-200d-2642-fe0f","1f46e-1f3fc-200d-2642","1f46e-1f3fd-200d-2642-fe0f","1f46e-1f3fd-200d-2642","1f46e-1f3fe-200d-2642-fe0f","1f46e-1f3fe-200d-2642","1f46e-1f3ff-200d-2642-fe0f","1f46e-1f3ff-200d-2642","1f46e-200d-2640-fe0f","1f46e-200d-2640","1f46e-1f3fb-200d-2640-fe0f","1f46e-1f3fb-200d-2640","1f46e-1f3fc-200d-2640-fe0f","1f46e-1f3fc-200d-2640","1f46e-1f3fd-200d-2640-fe0f","1f46e-1f3fd-200d-2640","1f46e-1f3fe-200d-2640-fe0f","1f46e-1f3fe-200d-2640","1f46e-1f3ff-200d-2640-fe0f","1f46e-1f3ff-200d-2640","1f575-fe0f","1f575","1f575-1f3fb","1f575-1f3fc","1f575-1f3fd","1f575-1f3fe","1f575-1f3ff","1f575-fe0f-200d-2642-fe0f","1f575-200d-2642-fe0f","1f575-fe0f-200d-2642","1f575-200d-2642","1f575-1f3fb-200d-2642-fe0f","1f575-1f3fb-200d-2642","1f575-1f3fc-200d-2642-fe0f","1f575-1f3fc-200d-2642","1f575-1f3fd-200d-2642-fe0f","1f575-1f3fd-200d-2642","1f575-1f3fe-200d-2642-fe0f","1f575-1f3fe-200d-2642","1f575-1f3ff-200d-2642-fe0f","1f575-1f3ff-200d-2642","1f575-fe0f-200d-2640-fe0f","1f575-200d-2640-fe0f","1f575-fe0f-200d-2640","1f575-200d-2640","1f575-1f3fb-200d-2640-fe0f","1f575-1f3fb-200d-2640","1f575-1f3fc-200d-2640-fe0f","1f575-1f3fc-200d-2640","1f575-1f3fd-200d-2640-fe0f","1f575-1f3fd-200d-2640","1f575-1f3fe-200d-2640-fe0f","1f575-1f3fe-200d-2640","1f575-1f3ff-200d-2640-fe0f","1f575-1f3ff-200d-2640","1f482","1f482-1f3fb","1f482-1f3fc","1f482-1f3fd","1f482-1f3fe","1f482-1f3ff","1f482-200d-2642-fe0f","1f482-200d-2642","1f482-1f3fb-200d-2642-fe0f","1f482-1f3fb-200d-2642","1f482-1f3fc-200d-2642-fe0f","1f482-1f3fc-200d-2642","1f482-1f3fd-200d-2642-fe0f","1f482-1f3fd-200d-2642","1f482-1f3fe-200d-2642-fe0f","1f482-1f3fe-200d-2642","1f482-1f3ff-200d-2642-fe0f","1f482-1f3ff-200d-2642","1f482-200d-2640-fe0f","1f482-200d-2640","1f482-1f3fb-200d-2640-fe0f","1f482-1f3fb-200d-2640","1f482-1f3fc-200d-2640-fe0f","1f482-1f3fc-200d-2640","1f482-1f3fd-200d-2640-fe0f","1f482-1f3fd-200d-2640","1f482-1f3fe-200d-2640-fe0f","1f482-1f3fe-200d-2640","1f482-1f3ff-200d-2640-fe0f","1f482-1f3ff-200d-2640","1f477","1f477-1f3fb","1f477-1f3fc","1f477-1f3fd","1f477-1f3fe","1f477-1f3ff","1f477-200d-2642-fe0f","1f477-200d-2642","1f477-1f3fb-200d-2642-fe0f","1f477-1f3fb-200d-2642","1f477-1f3fc-200d-2642-fe0f","1f477-1f3fc-200d-2642","1f477-1f3fd-200d-2642-fe0f","1f477-1f3fd-200d-2642","1f477-1f3fe-200d-2642-fe0f","1f477-1f3fe-200d-2642","1f477-1f3ff-200d-2642-fe0f","1f477-1f3ff-200d-2642","1f477-200d-2640-fe0f","1f477-200d-2640","1f477-1f3fb-200d-2640-fe0f","1f477-1f3fb-200d-2640","1f477-1f3fc-200d-2640-fe0f","1f477-1f3fc-200d-2640","1f477-1f3fd-200d-2640-fe0f","1f477-1f3fd-200d-2640","1f477-1f3fe-200d-2640-fe0f","1f477-1f3fe-200d-2640","1f477-1f3ff-200d-2640-fe0f","1f477-1f3ff-200d-2640","1f934","1f934-1f3fb","1f934-1f3fc","1f934-1f3fd","1f934-1f3fe","1f934-1f3ff","1f478","1f478-1f3fb","1f478-1f3fc","1f478-1f3fd","1f478-1f3fe","1f478-1f3ff","1f473","1f473-1f3fb","1f473-1f3fc","1f473-1f3fd","1f473-1f3fe","1f473-1f3ff","1f473-200d-2642-fe0f","1f473-200d-2642","1f473-1f3fb-200d-2642-fe0f","1f473-1f3fb-200d-2642","1f473-1f3fc-200d-2642-fe0f","1f473-1f3fc-200d-2642","1f473-1f3fd-200d-2642-fe0f","1f473-1f3fd-200d-2642","1f473-1f3fe-200d-2642-fe0f","1f473-1f3fe-200d-2642","1f473-1f3ff-200d-2642-fe0f","1f473-1f3ff-200d-2642","1f473-200d-2640-fe0f","1f473-200d-2640","1f473-1f3fb-200d-2640-fe0f","1f473-1f3fb-200d-2640","1f473-1f3fc-200d-2640-fe0f","1f473-1f3fc-200d-2640","1f473-1f3fd-200d-2640-fe0f","1f473-1f3fd-200d-2640","1f473-1f3fe-200d-2640-fe0f","1f473-1f3fe-200d-2640","1f473-1f3ff-200d-2640-fe0f","1f473-1f3ff-200d-2640","1f472","1f472-1f3fb","1f472-1f3fc","1f472-1f3fd","1f472-1f3fe","1f472-1f3ff","1f9d5","1f9d5-1f3fb","1f9d5-1f3fc","1f9d5-1f3fd","1f9d5-1f3fe","1f9d5-1f3ff","1f935","1f935-1f3fb","1f935-1f3fc","1f935-1f3fd","1f935-1f3fe","1f935-1f3ff","1f470","1f470-1f3fb","1f470-1f3fc","1f470-1f3fd","1f470-1f3fe","1f470-1f3ff","1f930","1f930-1f3fb","1f930-1f3fc","1f930-1f3fd","1f930-1f3fe","1f930-1f3ff","1f931","1f931-1f3fb","1f931-1f3fc","1f931-1f3fd","1f931-1f3fe","1f931-1f3ff","1f47c","1f47c-1f3fb","1f47c-1f3fc","1f47c-1f3fd","1f47c-1f3fe","1f47c-1f3ff","1f385","1f385-1f3fb","1f385-1f3fc","1f385-1f3fd","1f385-1f3fe","1f385-1f3ff","1f936","1f936-1f3fb","1f936-1f3fc","1f936-1f3fd","1f936-1f3fe","1f936-1f3ff","1f9b8","1f9b8-1f3fb","1f9b8-1f3fc","1f9b8-1f3fd","1f9b8-1f3fe","1f9b8-1f3ff","1f9b8-200d-2642-fe0f","1f9b8-200d-2642","1f9b8-1f3fb-200d-2642-fe0f","1f9b8-1f3fb-200d-2642","1f9b8-1f3fc-200d-2642-fe0f","1f9b8-1f3fc-200d-2642","1f9b8-1f3fd-200d-2642-fe0f","1f9b8-1f3fd-200d-2642","1f9b8-1f3fe-200d-2642-fe0f","1f9b8-1f3fe-200d-2642","1f9b8-1f3ff-200d-2642-fe0f","1f9b8-1f3ff-200d-2642","1f9b8-200d-2640-fe0f","1f9b8-200d-2640","1f9b8-1f3fb-200d-2640-fe0f","1f9b8-1f3fb-200d-2640","1f9b8-1f3fc-200d-2640-fe0f","1f9b8-1f3fc-200d-2640","1f9b8-1f3fd-200d-2640-fe0f","1f9b8-1f3fd-200d-2640","1f9b8-1f3fe-200d-2640-fe0f","1f9b8-1f3fe-200d-2640","1f9b8-1f3ff-200d-2640-fe0f","1f9b8-1f3ff-200d-2640","1f9b9","1f9b9-1f3fb","1f9b9-1f3fc","1f9b9-1f3fd","1f9b9-1f3fe","1f9b9-1f3ff","1f9b9-200d-2642-fe0f","1f9b9-200d-2642","1f9b9-1f3fb-200d-2642-fe0f","1f9b9-1f3fb-200d-2642","1f9b9-1f3fc-200d-2642-fe0f","1f9b9-1f3fc-200d-2642","1f9b9-1f3fd-200d-2642-fe0f","1f9b9-1f3fd-200d-2642","1f9b9-1f3fe-200d-2642-fe0f","1f9b9-1f3fe-200d-2642","1f9b9-1f3ff-200d-2642-fe0f","1f9b9-1f3ff-200d-2642","1f9b9-200d-2640-fe0f","1f9b9-200d-2640","1f9b9-1f3fb-200d-2640-fe0f","1f9b9-1f3fb-200d-2640","1f9b9-1f3fc-200d-2640-fe0f","1f9b9-1f3fc-200d-2640","1f9b9-1f3fd-200d-2640-fe0f","1f9b9-1f3fd-200d-2640","1f9b9-1f3fe-200d-2640-fe0f","1f9b9-1f3fe-200d-2640","1f9b9-1f3ff-200d-2640-fe0f","1f9b9-1f3ff-200d-2640","1f9d9","1f9d9-1f3fb","1f9d9-1f3fc","1f9d9-1f3fd","1f9d9-1f3fe","1f9d9-1f3ff","1f9d9-200d-2642-fe0f","1f9d9-200d-2642","1f9d9-1f3fb-200d-2642-fe0f","1f9d9-1f3fb-200d-2642","1f9d9-1f3fc-200d-2642-fe0f","1f9d9-1f3fc-200d-2642","1f9d9-1f3fd-200d-2642-fe0f","1f9d9-1f3fd-200d-2642","1f9d9-1f3fe-200d-2642-fe0f","1f9d9-1f3fe-200d-2642","1f9d9-1f3ff-200d-2642-fe0f","1f9d9-1f3ff-200d-2642","1f9d9-200d-2640-fe0f","1f9d9-200d-2640","1f9d9-1f3fb-200d-2640-fe0f","1f9d9-1f3fb-200d-2640","1f9d9-1f3fc-200d-2640-fe0f","1f9d9-1f3fc-200d-2640","1f9d9-1f3fd-200d-2640-fe0f","1f9d9-1f3fd-200d-2640","1f9d9-1f3fe-200d-2640-fe0f","1f9d9-1f3fe-200d-2640","1f9d9-1f3ff-200d-2640-fe0f","1f9d9-1f3ff-200d-2640","1f9da","1f9da-1f3fb","1f9da-1f3fc","1f9da-1f3fd","1f9da-1f3fe","1f9da-1f3ff","1f9da-200d-2642-fe0f","1f9da-200d-2642","1f9da-1f3fb-200d-2642-fe0f","1f9da-1f3fb-200d-2642","1f9da-1f3fc-200d-2642-fe0f","1f9da-1f3fc-200d-2642","1f9da-1f3fd-200d-2642-fe0f","1f9da-1f3fd-200d-2642","1f9da-1f3fe-200d-2642-fe0f","1f9da-1f3fe-200d-2642","1f9da-1f3ff-200d-2642-fe0f","1f9da-1f3ff-200d-2642","1f9da-200d-2640-fe0f","1f9da-200d-2640","1f9da-1f3fb-200d-2640-fe0f","1f9da-1f3fb-200d-2640","1f9da-1f3fc-200d-2640-fe0f","1f9da-1f3fc-200d-2640","1f9da-1f3fd-200d-2640-fe0f","1f9da-1f3fd-200d-2640","1f9da-1f3fe-200d-2640-fe0f","1f9da-1f3fe-200d-2640","1f9da-1f3ff-200d-2640-fe0f","1f9da-1f3ff-200d-2640","1f9db","1f9db-1f3fb","1f9db-1f3fc","1f9db-1f3fd","1f9db-1f3fe","1f9db-1f3ff","1f9db-200d-2642-fe0f","1f9db-200d-2642","1f9db-1f3fb-200d-2642-fe0f","1f9db-1f3fb-200d-2642","1f9db-1f3fc-200d-2642-fe0f","1f9db-1f3fc-200d-2642","1f9db-1f3fd-200d-2642-fe0f","1f9db-1f3fd-200d-2642","1f9db-1f3fe-200d-2642-fe0f","1f9db-1f3fe-200d-2642","1f9db-1f3ff-200d-2642-fe0f","1f9db-1f3ff-200d-2642","1f9db-200d-2640-fe0f","1f9db-200d-2640","1f9db-1f3fb-200d-2640-fe0f","1f9db-1f3fb-200d-2640","1f9db-1f3fc-200d-2640-fe0f","1f9db-1f3fc-200d-2640","1f9db-1f3fd-200d-2640-fe0f","1f9db-1f3fd-200d-2640","1f9db-1f3fe-200d-2640-fe0f","1f9db-1f3fe-200d-2640","1f9db-1f3ff-200d-2640-fe0f","1f9db-1f3ff-200d-2640","1f9dc","1f9dc-1f3fb","1f9dc-1f3fc","1f9dc-1f3fd","1f9dc-1f3fe","1f9dc-1f3ff","1f9dc-200d-2642-fe0f","1f9dc-200d-2642","1f9dc-1f3fb-200d-2642-fe0f","1f9dc-1f3fb-200d-2642","1f9dc-1f3fc-200d-2642-fe0f","1f9dc-1f3fc-200d-2642","1f9dc-1f3fd-200d-2642-fe0f","1f9dc-1f3fd-200d-2642","1f9dc-1f3fe-200d-2642-fe0f","1f9dc-1f3fe-200d-2642","1f9dc-1f3ff-200d-2642-fe0f","1f9dc-1f3ff-200d-2642","1f9dc-200d-2640-fe0f","1f9dc-200d-2640","1f9dc-1f3fb-200d-2640-fe0f","1f9dc-1f3fb-200d-2640","1f9dc-1f3fc-200d-2640-fe0f","1f9dc-1f3fc-200d-2640","1f9dc-1f3fd-200d-2640-fe0f","1f9dc-1f3fd-200d-2640","1f9dc-1f3fe-200d-2640-fe0f","1f9dc-1f3fe-200d-2640","1f9dc-1f3ff-200d-2640-fe0f","1f9dc-1f3ff-200d-2640","1f9dd","1f9dd-1f3fb","1f9dd-1f3fc","1f9dd-1f3fd","1f9dd-1f3fe","1f9dd-1f3ff","1f9dd-200d-2642-fe0f","1f9dd-200d-2642","1f9dd-1f3fb-200d-2642-fe0f","1f9dd-1f3fb-200d-2642","1f9dd-1f3fc-200d-2642-fe0f","1f9dd-1f3fc-200d-2642","1f9dd-1f3fd-200d-2642-fe0f","1f9dd-1f3fd-200d-2642","1f9dd-1f3fe-200d-2642-fe0f","1f9dd-1f3fe-200d-2642","1f9dd-1f3ff-200d-2642-fe0f","1f9dd-1f3ff-200d-2642","1f9dd-200d-2640-fe0f","1f9dd-200d-2640","1f9dd-1f3fb-200d-2640-fe0f","1f9dd-1f3fb-200d-2640","1f9dd-1f3fc-200d-2640-fe0f","1f9dd-1f3fc-200d-2640","1f9dd-1f3fd-200d-2640-fe0f","1f9dd-1f3fd-200d-2640","1f9dd-1f3fe-200d-2640-fe0f","1f9dd-1f3fe-200d-2640","1f9dd-1f3ff-200d-2640-fe0f","1f9dd-1f3ff-200d-2640","1f9de","1f9de-200d-2642-fe0f","1f9de-200d-2642","1f9de-200d-2640-fe0f","1f9de-200d-2640","1f9df","1f9df-200d-2642-fe0f","1f9df-200d-2642","1f9df-200d-2640-fe0f","1f9df-200d-2640","1f486","1f486-1f3fb","1f486-1f3fc","1f486-1f3fd","1f486-1f3fe","1f486-1f3ff","1f486-200d-2642-fe0f","1f486-200d-2642","1f486-1f3fb-200d-2642-fe0f","1f486-1f3fb-200d-2642","1f486-1f3fc-200d-2642-fe0f","1f486-1f3fc-200d-2642","1f486-1f3fd-200d-2642-fe0f","1f486-1f3fd-200d-2642","1f486-1f3fe-200d-2642-fe0f","1f486-1f3fe-200d-2642","1f486-1f3ff-200d-2642-fe0f","1f486-1f3ff-200d-2642","1f486-200d-2640-fe0f","1f486-200d-2640","1f486-1f3fb-200d-2640-fe0f","1f486-1f3fb-200d-2640","1f486-1f3fc-200d-2640-fe0f","1f486-1f3fc-200d-2640","1f486-1f3fd-200d-2640-fe0f","1f486-1f3fd-200d-2640","1f486-1f3fe-200d-2640-fe0f","1f486-1f3fe-200d-2640","1f486-1f3ff-200d-2640-fe0f","1f486-1f3ff-200d-2640","1f487","1f487-1f3fb","1f487-1f3fc","1f487-1f3fd","1f487-1f3fe","1f487-1f3ff","1f487-200d-2642-fe0f","1f487-200d-2642","1f487-1f3fb-200d-2642-fe0f","1f487-1f3fb-200d-2642","1f487-1f3fc-200d-2642-fe0f","1f487-1f3fc-200d-2642","1f487-1f3fd-200d-2642-fe0f","1f487-1f3fd-200d-2642","1f487-1f3fe-200d-2642-fe0f","1f487-1f3fe-200d-2642","1f487-1f3ff-200d-2642-fe0f","1f487-1f3ff-200d-2642","1f487-200d-2640-fe0f","1f487-200d-2640","1f487-1f3fb-200d-2640-fe0f","1f487-1f3fb-200d-2640","1f487-1f3fc-200d-2640-fe0f","1f487-1f3fc-200d-2640","1f487-1f3fd-200d-2640-fe0f","1f487-1f3fd-200d-2640","1f487-1f3fe-200d-2640-fe0f","1f487-1f3fe-200d-2640","1f487-1f3ff-200d-2640-fe0f","1f487-1f3ff-200d-2640","1f6b6","1f6b6-1f3fb","1f6b6-1f3fc","1f6b6-1f3fd","1f6b6-1f3fe","1f6b6-1f3ff","1f6b6-200d-2642-fe0f","1f6b6-200d-2642","1f6b6-1f3fb-200d-2642-fe0f","1f6b6-1f3fb-200d-2642","1f6b6-1f3fc-200d-2642-fe0f","1f6b6-1f3fc-200d-2642","1f6b6-1f3fd-200d-2642-fe0f","1f6b6-1f3fd-200d-2642","1f6b6-1f3fe-200d-2642-fe0f","1f6b6-1f3fe-200d-2642","1f6b6-1f3ff-200d-2642-fe0f","1f6b6-1f3ff-200d-2642","1f6b6-200d-2640-fe0f","1f6b6-200d-2640","1f6b6-1f3fb-200d-2640-fe0f","1f6b6-1f3fb-200d-2640","1f6b6-1f3fc-200d-2640-fe0f","1f6b6-1f3fc-200d-2640","1f6b6-1f3fd-200d-2640-fe0f","1f6b6-1f3fd-200d-2640","1f6b6-1f3fe-200d-2640-fe0f","1f6b6-1f3fe-200d-2640","1f6b6-1f3ff-200d-2640-fe0f","1f6b6-1f3ff-200d-2640","1f9cd","1f9cd-1f3fb","1f9cd-1f3fc","1f9cd-1f3fd","1f9cd-1f3fe","1f9cd-1f3ff","1f9cd-200d-2642-fe0f","1f9cd-200d-2642","1f9cd-1f3fb-200d-2642-fe0f","1f9cd-1f3fb-200d-2642","1f9cd-1f3fc-200d-2642-fe0f","1f9cd-1f3fc-200d-2642","1f9cd-1f3fd-200d-2642-fe0f","1f9cd-1f3fd-200d-2642","1f9cd-1f3fe-200d-2642-fe0f","1f9cd-1f3fe-200d-2642","1f9cd-1f3ff-200d-2642-fe0f","1f9cd-1f3ff-200d-2642","1f9cd-200d-2640-fe0f","1f9cd-200d-2640","1f9cd-1f3fb-200d-2640-fe0f","1f9cd-1f3fb-200d-2640","1f9cd-1f3fc-200d-2640-fe0f","1f9cd-1f3fc-200d-2640","1f9cd-1f3fd-200d-2640-fe0f","1f9cd-1f3fd-200d-2640","1f9cd-1f3fe-200d-2640-fe0f","1f9cd-1f3fe-200d-2640","1f9cd-1f3ff-200d-2640-fe0f","1f9cd-1f3ff-200d-2640","1f9ce","1f9ce-1f3fb","1f9ce-1f3fc","1f9ce-1f3fd","1f9ce-1f3fe","1f9ce-1f3ff","1f9ce-200d-2642-fe0f","1f9ce-200d-2642","1f9ce-1f3fb-200d-2642-fe0f","1f9ce-1f3fb-200d-2642","1f9ce-1f3fc-200d-2642-fe0f","1f9ce-1f3fc-200d-2642","1f9ce-1f3fd-200d-2642-fe0f","1f9ce-1f3fd-200d-2642","1f9ce-1f3fe-200d-2642-fe0f","1f9ce-1f3fe-200d-2642","1f9ce-1f3ff-200d-2642-fe0f","1f9ce-1f3ff-200d-2642","1f9ce-200d-2640-fe0f","1f9ce-200d-2640","1f9ce-1f3fb-200d-2640-fe0f","1f9ce-1f3fb-200d-2640","1f9ce-1f3fc-200d-2640-fe0f","1f9ce-1f3fc-200d-2640","1f9ce-1f3fd-200d-2640-fe0f","1f9ce-1f3fd-200d-2640","1f9ce-1f3fe-200d-2640-fe0f","1f9ce-1f3fe-200d-2640","1f9ce-1f3ff-200d-2640-fe0f","1f9ce-1f3ff-200d-2640","1f468-200d-1f9af","1f468-1f3fb-200d-1f9af","1f468-1f3fc-200d-1f9af","1f468-1f3fd-200d-1f9af","1f468-1f3fe-200d-1f9af","1f468-1f3ff-200d-1f9af","1f469-200d-1f9af","1f469-1f3fb-200d-1f9af","1f469-1f3fc-200d-1f9af","1f469-1f3fd-200d-1f9af","1f469-1f3fe-200d-1f9af","1f469-1f3ff-200d-1f9af","1f468-200d-1f9bc","1f468-1f3fb-200d-1f9bc","1f468-1f3fc-200d-1f9bc","1f468-1f3fd-200d-1f9bc","1f468-1f3fe-200d-1f9bc","1f468-1f3ff-200d-1f9bc","1f469-200d-1f9bc","1f469-1f3fb-200d-1f9bc","1f469-1f3fc-200d-1f9bc","1f469-1f3fd-200d-1f9bc","1f469-1f3fe-200d-1f9bc","1f469-1f3ff-200d-1f9bc","1f468-200d-1f9bd","1f468-1f3fb-200d-1f9bd","1f468-1f3fc-200d-1f9bd","1f468-1f3fd-200d-1f9bd","1f468-1f3fe-200d-1f9bd","1f468-1f3ff-200d-1f9bd","1f469-200d-1f9bd","1f469-1f3fb-200d-1f9bd","1f469-1f3fc-200d-1f9bd","1f469-1f3fd-200d-1f9bd","1f469-1f3fe-200d-1f9bd","1f469-1f3ff-200d-1f9bd","1f3c3","1f3c3-1f3fb","1f3c3-1f3fc","1f3c3-1f3fd","1f3c3-1f3fe","1f3c3-1f3ff","1f3c3-200d-2642-fe0f","1f3c3-200d-2642","1f3c3-1f3fb-200d-2642-fe0f","1f3c3-1f3fb-200d-2642","1f3c3-1f3fc-200d-2642-fe0f","1f3c3-1f3fc-200d-2642","1f3c3-1f3fd-200d-2642-fe0f","1f3c3-1f3fd-200d-2642","1f3c3-1f3fe-200d-2642-fe0f","1f3c3-1f3fe-200d-2642","1f3c3-1f3ff-200d-2642-fe0f","1f3c3-1f3ff-200d-2642","1f3c3-200d-2640-fe0f","1f3c3-200d-2640","1f3c3-1f3fb-200d-2640-fe0f","1f3c3-1f3fb-200d-2640","1f3c3-1f3fc-200d-2640-fe0f","1f3c3-1f3fc-200d-2640","1f3c3-1f3fd-200d-2640-fe0f","1f3c3-1f3fd-200d-2640","1f3c3-1f3fe-200d-2640-fe0f","1f3c3-1f3fe-200d-2640","1f3c3-1f3ff-200d-2640-fe0f","1f3c3-1f3ff-200d-2640","1f483","1f483-1f3fb","1f483-1f3fc","1f483-1f3fd","1f483-1f3fe","1f483-1f3ff","1f57a","1f57a-1f3fb","1f57a-1f3fc","1f57a-1f3fd","1f57a-1f3fe","1f57a-1f3ff","1f574-fe0f","1f574","1f574-1f3fb","1f574-1f3fc","1f574-1f3fd","1f574-1f3fe","1f574-1f3ff","1f46f","1f46f-200d-2642-fe0f","1f46f-200d-2642","1f46f-200d-2640-fe0f","1f46f-200d-2640","1f9d6","1f9d6-1f3fb","1f9d6-1f3fc","1f9d6-1f3fd","1f9d6-1f3fe","1f9d6-1f3ff","1f9d6-200d-2642-fe0f","1f9d6-200d-2642","1f9d6-1f3fb-200d-2642-fe0f","1f9d6-1f3fb-200d-2642","1f9d6-1f3fc-200d-2642-fe0f","1f9d6-1f3fc-200d-2642","1f9d6-1f3fd-200d-2642-fe0f","1f9d6-1f3fd-200d-2642","1f9d6-1f3fe-200d-2642-fe0f","1f9d6-1f3fe-200d-2642","1f9d6-1f3ff-200d-2642-fe0f","1f9d6-1f3ff-200d-2642","1f9d6-200d-2640-fe0f","1f9d6-200d-2640","1f9d6-1f3fb-200d-2640-fe0f","1f9d6-1f3fb-200d-2640","1f9d6-1f3fc-200d-2640-fe0f","1f9d6-1f3fc-200d-2640","1f9d6-1f3fd-200d-2640-fe0f","1f9d6-1f3fd-200d-2640","1f9d6-1f3fe-200d-2640-fe0f","1f9d6-1f3fe-200d-2640","1f9d6-1f3ff-200d-2640-fe0f","1f9d6-1f3ff-200d-2640","1f9d7","1f9d7-1f3fb","1f9d7-1f3fc","1f9d7-1f3fd","1f9d7-1f3fe","1f9d7-1f3ff","1f9d7-200d-2642-fe0f","1f9d7-200d-2642","1f9d7-1f3fb-200d-2642-fe0f","1f9d7-1f3fb-200d-2642","1f9d7-1f3fc-200d-2642-fe0f","1f9d7-1f3fc-200d-2642","1f9d7-1f3fd-200d-2642-fe0f","1f9d7-1f3fd-200d-2642","1f9d7-1f3fe-200d-2642-fe0f","1f9d7-1f3fe-200d-2642","1f9d7-1f3ff-200d-2642-fe0f","1f9d7-1f3ff-200d-2642","1f9d7-200d-2640-fe0f","1f9d7-200d-2640","1f9d7-1f3fb-200d-2640-fe0f","1f9d7-1f3fb-200d-2640","1f9d7-1f3fc-200d-2640-fe0f","1f9d7-1f3fc-200d-2640","1f9d7-1f3fd-200d-2640-fe0f","1f9d7-1f3fd-200d-2640","1f9d7-1f3fe-200d-2640-fe0f","1f9d7-1f3fe-200d-2640","1f9d7-1f3ff-200d-2640-fe0f","1f9d7-1f3ff-200d-2640","1f93a","1f3c7","1f3c7-1f3fb","1f3c7-1f3fc","1f3c7-1f3fd","1f3c7-1f3fe","1f3c7-1f3ff","26f7-fe0f","26f7","1f3c2","1f3c2-1f3fb","1f3c2-1f3fc","1f3c2-1f3fd","1f3c2-1f3fe","1f3c2-1f3ff","1f3cc-fe0f","1f3cc","1f3cc-1f3fb","1f3cc-1f3fc","1f3cc-1f3fd","1f3cc-1f3fe","1f3cc-1f3ff","1f3cc-fe0f-200d-2642-fe0f","1f3cc-200d-2642-fe0f","1f3cc-fe0f-200d-2642","1f3cc-200d-2642","1f3cc-1f3fb-200d-2642-fe0f","1f3cc-1f3fb-200d-2642","1f3cc-1f3fc-200d-2642-fe0f","1f3cc-1f3fc-200d-2642","1f3cc-1f3fd-200d-2642-fe0f","1f3cc-1f3fd-200d-2642","1f3cc-1f3fe-200d-2642-fe0f","1f3cc-1f3fe-200d-2642","1f3cc-1f3ff-200d-2642-fe0f","1f3cc-1f3ff-200d-2642","1f3cc-fe0f-200d-2640-fe0f","1f3cc-200d-2640-fe0f","1f3cc-fe0f-200d-2640","1f3cc-200d-2640","1f3cc-1f3fb-200d-2640-fe0f","1f3cc-1f3fb-200d-2640","1f3cc-1f3fc-200d-2640-fe0f","1f3cc-1f3fc-200d-2640","1f3cc-1f3fd-200d-2640-fe0f","1f3cc-1f3fd-200d-2640","1f3cc-1f3fe-200d-2640-fe0f","1f3cc-1f3fe-200d-2640","1f3cc-1f3ff-200d-2640-fe0f","1f3cc-1f3ff-200d-2640","1f3c4","1f3c4-1f3fb","1f3c4-1f3fc","1f3c4-1f3fd","1f3c4-1f3fe","1f3c4-1f3ff","1f3c4-200d-2642-fe0f","1f3c4-200d-2642","1f3c4-1f3fb-200d-2642-fe0f","1f3c4-1f3fb-200d-2642","1f3c4-1f3fc-200d-2642-fe0f","1f3c4-1f3fc-200d-2642","1f3c4-1f3fd-200d-2642-fe0f","1f3c4-1f3fd-200d-2642","1f3c4-1f3fe-200d-2642-fe0f","1f3c4-1f3fe-200d-2642","1f3c4-1f3ff-200d-2642-fe0f","1f3c4-1f3ff-200d-2642","1f3c4-200d-2640-fe0f","1f3c4-200d-2640","1f3c4-1f3fb-200d-2640-fe0f","1f3c4-1f3fb-200d-2640","1f3c4-1f3fc-200d-2640-fe0f","1f3c4-1f3fc-200d-2640","1f3c4-1f3fd-200d-2640-fe0f","1f3c4-1f3fd-200d-2640","1f3c4-1f3fe-200d-2640-fe0f","1f3c4-1f3fe-200d-2640","1f3c4-1f3ff-200d-2640-fe0f","1f3c4-1f3ff-200d-2640","1f6a3","1f6a3-1f3fb","1f6a3-1f3fc","1f6a3-1f3fd","1f6a3-1f3fe","1f6a3-1f3ff","1f6a3-200d-2642-fe0f","1f6a3-200d-2642","1f6a3-1f3fb-200d-2642-fe0f","1f6a3-1f3fb-200d-2642","1f6a3-1f3fc-200d-2642-fe0f","1f6a3-1f3fc-200d-2642","1f6a3-1f3fd-200d-2642-fe0f","1f6a3-1f3fd-200d-2642","1f6a3-1f3fe-200d-2642-fe0f","1f6a3-1f3fe-200d-2642","1f6a3-1f3ff-200d-2642-fe0f","1f6a3-1f3ff-200d-2642","1f6a3-200d-2640-fe0f","1f6a3-200d-2640","1f6a3-1f3fb-200d-2640-fe0f","1f6a3-1f3fb-200d-2640","1f6a3-1f3fc-200d-2640-fe0f","1f6a3-1f3fc-200d-2640","1f6a3-1f3fd-200d-2640-fe0f","1f6a3-1f3fd-200d-2640","1f6a3-1f3fe-200d-2640-fe0f","1f6a3-1f3fe-200d-2640","1f6a3-1f3ff-200d-2640-fe0f","1f6a3-1f3ff-200d-2640","1f3ca","1f3ca-1f3fb","1f3ca-1f3fc","1f3ca-1f3fd","1f3ca-1f3fe","1f3ca-1f3ff","1f3ca-200d-2642-fe0f","1f3ca-200d-2642","1f3ca-1f3fb-200d-2642-fe0f","1f3ca-1f3fb-200d-2642","1f3ca-1f3fc-200d-2642-fe0f","1f3ca-1f3fc-200d-2642","1f3ca-1f3fd-200d-2642-fe0f","1f3ca-1f3fd-200d-2642","1f3ca-1f3fe-200d-2642-fe0f","1f3ca-1f3fe-200d-2642","1f3ca-1f3ff-200d-2642-fe0f","1f3ca-1f3ff-200d-2642","1f3ca-200d-2640-fe0f","1f3ca-200d-2640","1f3ca-1f3fb-200d-2640-fe0f","1f3ca-1f3fb-200d-2640","1f3ca-1f3fc-200d-2640-fe0f","1f3ca-1f3fc-200d-2640","1f3ca-1f3fd-200d-2640-fe0f","1f3ca-1f3fd-200d-2640","1f3ca-1f3fe-200d-2640-fe0f","1f3ca-1f3fe-200d-2640","1f3ca-1f3ff-200d-2640-fe0f","1f3ca-1f3ff-200d-2640","26f9-fe0f","26f9","26f9-1f3fb","26f9-1f3fc","26f9-1f3fd","26f9-1f3fe","26f9-1f3ff","26f9-fe0f-200d-2642-fe0f","26f9-200d-2642-fe0f","26f9-fe0f-200d-2642","26f9-200d-2642","26f9-1f3fb-200d-2642-fe0f","26f9-1f3fb-200d-2642","26f9-1f3fc-200d-2642-fe0f","26f9-1f3fc-200d-2642","26f9-1f3fd-200d-2642-fe0f","26f9-1f3fd-200d-2642","26f9-1f3fe-200d-2642-fe0f","26f9-1f3fe-200d-2642","26f9-1f3ff-200d-2642-fe0f","26f9-1f3ff-200d-2642","26f9-fe0f-200d-2640-fe0f","26f9-200d-2640-fe0f","26f9-fe0f-200d-2640","26f9-200d-2640","26f9-1f3fb-200d-2640-fe0f","26f9-1f3fb-200d-2640","26f9-1f3fc-200d-2640-fe0f","26f9-1f3fc-200d-2640","26f9-1f3fd-200d-2640-fe0f","26f9-1f3fd-200d-2640","26f9-1f3fe-200d-2640-fe0f","26f9-1f3fe-200d-2640","26f9-1f3ff-200d-2640-fe0f","26f9-1f3ff-200d-2640","1f3cb-fe0f","1f3cb","1f3cb-1f3fb","1f3cb-1f3fc","1f3cb-1f3fd","1f3cb-1f3fe","1f3cb-1f3ff","1f3cb-fe0f-200d-2642-fe0f","1f3cb-200d-2642-fe0f","1f3cb-fe0f-200d-2642","1f3cb-200d-2642","1f3cb-1f3fb-200d-2642-fe0f","1f3cb-1f3fb-200d-2642","1f3cb-1f3fc-200d-2642-fe0f","1f3cb-1f3fc-200d-2642","1f3cb-1f3fd-200d-2642-fe0f","1f3cb-1f3fd-200d-2642","1f3cb-1f3fe-200d-2642-fe0f","1f3cb-1f3fe-200d-2642","1f3cb-1f3ff-200d-2642-fe0f","1f3cb-1f3ff-200d-2642","1f3cb-fe0f-200d-2640-fe0f","1f3cb-200d-2640-fe0f","1f3cb-fe0f-200d-2640","1f3cb-200d-2640","1f3cb-1f3fb-200d-2640-fe0f","1f3cb-1f3fb-200d-2640","1f3cb-1f3fc-200d-2640-fe0f","1f3cb-1f3fc-200d-2640","1f3cb-1f3fd-200d-2640-fe0f","1f3cb-1f3fd-200d-2640","1f3cb-1f3fe-200d-2640-fe0f","1f3cb-1f3fe-200d-2640","1f3cb-1f3ff-200d-2640-fe0f","1f3cb-1f3ff-200d-2640","1f6b4","1f6b4-1f3fb","1f6b4-1f3fc","1f6b4-1f3fd","1f6b4-1f3fe","1f6b4-1f3ff","1f6b4-200d-2642-fe0f","1f6b4-200d-2642","1f6b4-1f3fb-200d-2642-fe0f","1f6b4-1f3fb-200d-2642","1f6b4-1f3fc-200d-2642-fe0f","1f6b4-1f3fc-200d-2642","1f6b4-1f3fd-200d-2642-fe0f","1f6b4-1f3fd-200d-2642","1f6b4-1f3fe-200d-2642-fe0f","1f6b4-1f3fe-200d-2642","1f6b4-1f3ff-200d-2642-fe0f","1f6b4-1f3ff-200d-2642","1f6b4-200d-2640-fe0f","1f6b4-200d-2640","1f6b4-1f3fb-200d-2640-fe0f","1f6b4-1f3fb-200d-2640","1f6b4-1f3fc-200d-2640-fe0f","1f6b4-1f3fc-200d-2640","1f6b4-1f3fd-200d-2640-fe0f","1f6b4-1f3fd-200d-2640","1f6b4-1f3fe-200d-2640-fe0f","1f6b4-1f3fe-200d-2640","1f6b4-1f3ff-200d-2640-fe0f","1f6b4-1f3ff-200d-2640","1f6b5","1f6b5-1f3fb","1f6b5-1f3fc","1f6b5-1f3fd","1f6b5-1f3fe","1f6b5-1f3ff","1f6b5-200d-2642-fe0f","1f6b5-200d-2642","1f6b5-1f3fb-200d-2642-fe0f","1f6b5-1f3fb-200d-2642","1f6b5-1f3fc-200d-2642-fe0f","1f6b5-1f3fc-200d-2642","1f6b5-1f3fd-200d-2642-fe0f","1f6b5-1f3fd-200d-2642","1f6b5-1f3fe-200d-2642-fe0f","1f6b5-1f3fe-200d-2642","1f6b5-1f3ff-200d-2642-fe0f","1f6b5-1f3ff-200d-2642","1f6b5-200d-2640-fe0f","1f6b5-200d-2640","1f6b5-1f3fb-200d-2640-fe0f","1f6b5-1f3fb-200d-2640","1f6b5-1f3fc-200d-2640-fe0f","1f6b5-1f3fc-200d-2640","1f6b5-1f3fd-200d-2640-fe0f","1f6b5-1f3fd-200d-2640","1f6b5-1f3fe-200d-2640-fe0f","1f6b5-1f3fe-200d-2640","1f6b5-1f3ff-200d-2640-fe0f","1f6b5-1f3ff-200d-2640","1f938","1f938-1f3fb","1f938-1f3fc","1f938-1f3fd","1f938-1f3fe","1f938-1f3ff","1f938-200d-2642-fe0f","1f938-200d-2642","1f938-1f3fb-200d-2642-fe0f","1f938-1f3fb-200d-2642","1f938-1f3fc-200d-2642-fe0f","1f938-1f3fc-200d-2642","1f938-1f3fd-200d-2642-fe0f","1f938-1f3fd-200d-2642","1f938-1f3fe-200d-2642-fe0f","1f938-1f3fe-200d-2642","1f938-1f3ff-200d-2642-fe0f","1f938-1f3ff-200d-2642","1f938-200d-2640-fe0f","1f938-200d-2640","1f938-1f3fb-200d-2640-fe0f","1f938-1f3fb-200d-2640","1f938-1f3fc-200d-2640-fe0f","1f938-1f3fc-200d-2640","1f938-1f3fd-200d-2640-fe0f","1f938-1f3fd-200d-2640","1f938-1f3fe-200d-2640-fe0f","1f938-1f3fe-200d-2640","1f938-1f3ff-200d-2640-fe0f","1f938-1f3ff-200d-2640","1f93c","1f93c-200d-2642-fe0f","1f93c-200d-2642","1f93c-200d-2640-fe0f","1f93c-200d-2640","1f93d","1f93d-1f3fb","1f93d-1f3fc","1f93d-1f3fd","1f93d-1f3fe","1f93d-1f3ff","1f93d-200d-2642-fe0f","1f93d-200d-2642","1f93d-1f3fb-200d-2642-fe0f","1f93d-1f3fb-200d-2642","1f93d-1f3fc-200d-2642-fe0f","1f93d-1f3fc-200d-2642","1f93d-1f3fd-200d-2642-fe0f","1f93d-1f3fd-200d-2642","1f93d-1f3fe-200d-2642-fe0f","1f93d-1f3fe-200d-2642","1f93d-1f3ff-200d-2642-fe0f","1f93d-1f3ff-200d-2642","1f93d-200d-2640-fe0f","1f93d-200d-2640","1f93d-1f3fb-200d-2640-fe0f","1f93d-1f3fb-200d-2640","1f93d-1f3fc-200d-2640-fe0f","1f93d-1f3fc-200d-2640","1f93d-1f3fd-200d-2640-fe0f","1f93d-1f3fd-200d-2640","1f93d-1f3fe-200d-2640-fe0f","1f93d-1f3fe-200d-2640","1f93d-1f3ff-200d-2640-fe0f","1f93d-1f3ff-200d-2640","1f93e","1f93e-1f3fb","1f93e-1f3fc","1f93e-1f3fd","1f93e-1f3fe","1f93e-1f3ff","1f93e-200d-2642-fe0f","1f93e-200d-2642","1f93e-1f3fb-200d-2642-fe0f","1f93e-1f3fb-200d-2642","1f93e-1f3fc-200d-2642-fe0f","1f93e-1f3fc-200d-2642","1f93e-1f3fd-200d-2642-fe0f","1f93e-1f3fd-200d-2642","1f93e-1f3fe-200d-2642-fe0f","1f93e-1f3fe-200d-2642","1f93e-1f3ff-200d-2642-fe0f","1f93e-1f3ff-200d-2642","1f93e-200d-2640-fe0f","1f93e-200d-2640","1f93e-1f3fb-200d-2640-fe0f","1f93e-1f3fb-200d-2640","1f93e-1f3fc-200d-2640-fe0f","1f93e-1f3fc-200d-2640","1f93e-1f3fd-200d-2640-fe0f","1f93e-1f3fd-200d-2640","1f93e-1f3fe-200d-2640-fe0f","1f93e-1f3fe-200d-2640","1f93e-1f3ff-200d-2640-fe0f","1f93e-1f3ff-200d-2640","1f939","1f939-1f3fb","1f939-1f3fc","1f939-1f3fd","1f939-1f3fe","1f939-1f3ff","1f939-200d-2642-fe0f","1f939-200d-2642","1f939-1f3fb-200d-2642-fe0f","1f939-1f3fb-200d-2642","1f939-1f3fc-200d-2642-fe0f","1f939-1f3fc-200d-2642","1f939-1f3fd-200d-2642-fe0f","1f939-1f3fd-200d-2642","1f939-1f3fe-200d-2642-fe0f","1f939-1f3fe-200d-2642","1f939-1f3ff-200d-2642-fe0f","1f939-1f3ff-200d-2642","1f939-200d-2640-fe0f","1f939-200d-2640","1f939-1f3fb-200d-2640-fe0f","1f939-1f3fb-200d-2640","1f939-1f3fc-200d-2640-fe0f","1f939-1f3fc-200d-2640","1f939-1f3fd-200d-2640-fe0f","1f939-1f3fd-200d-2640","1f939-1f3fe-200d-2640-fe0f","1f939-1f3fe-200d-2640","1f939-1f3ff-200d-2640-fe0f","1f939-1f3ff-200d-2640","1f9d8","1f9d8-1f3fb","1f9d8-1f3fc","1f9d8-1f3fd","1f9d8-1f3fe","1f9d8-1f3ff","1f9d8-200d-2642-fe0f","1f9d8-200d-2642","1f9d8-1f3fb-200d-2642-fe0f","1f9d8-1f3fb-200d-2642","1f9d8-1f3fc-200d-2642-fe0f","1f9d8-1f3fc-200d-2642","1f9d8-1f3fd-200d-2642-fe0f","1f9d8-1f3fd-200d-2642","1f9d8-1f3fe-200d-2642-fe0f","1f9d8-1f3fe-200d-2642","1f9d8-1f3ff-200d-2642-fe0f","1f9d8-1f3ff-200d-2642","1f9d8-200d-2640-fe0f","1f9d8-200d-2640","1f9d8-1f3fb-200d-2640-fe0f","1f9d8-1f3fb-200d-2640","1f9d8-1f3fc-200d-2640-fe0f","1f9d8-1f3fc-200d-2640","1f9d8-1f3fd-200d-2640-fe0f","1f9d8-1f3fd-200d-2640","1f9d8-1f3fe-200d-2640-fe0f","1f9d8-1f3fe-200d-2640","1f9d8-1f3ff-200d-2640-fe0f","1f9d8-1f3ff-200d-2640","1f6c0","1f6c0-1f3fb","1f6c0-1f3fc","1f6c0-1f3fd","1f6c0-1f3fe","1f6c0-1f3ff","1f6cc","1f6cc-1f3fb","1f6cc-1f3fc","1f6cc-1f3fd","1f6cc-1f3fe","1f6cc-1f3ff","1f9d1-200d-1f91d-200d-1f9d1","1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fb","1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fb","1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fc","1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fb","1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fc","1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fd","1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fb","1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fc","1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fd","1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fe","1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fb","1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fc","1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fd","1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fe","1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3ff","1f46d","1f46d-1f3fb","1f469-1f3fc-200d-1f91d-200d-1f469-1f3fb","1f46d-1f3fc","1f469-1f3fd-200d-1f91d-200d-1f469-1f3fb","1f469-1f3fd-200d-1f91d-200d-1f469-1f3fc","1f46d-1f3fd","1f469-1f3fe-200d-1f91d-200d-1f469-1f3fb","1f469-1f3fe-200d-1f91d-200d-1f469-1f3fc","1f469-1f3fe-200d-1f91d-200d-1f469-1f3fd","1f46d-1f3fe","1f469-1f3ff-200d-1f91d-200d-1f469-1f3fb","1f469-1f3ff-200d-1f91d-200d-1f469-1f3fc","1f469-1f3ff-200d-1f91d-200d-1f469-1f3fd","1f469-1f3ff-200d-1f91d-200d-1f469-1f3fe","1f46d-1f3ff","1f46b","1f46b-1f3fb","1f469-1f3fb-200d-1f91d-200d-1f468-1f3fc","1f469-1f3fb-200d-1f91d-200d-1f468-1f3fd","1f469-1f3fb-200d-1f91d-200d-1f468-1f3fe","1f469-1f3fb-200d-1f91d-200d-1f468-1f3ff","1f469-1f3fc-200d-1f91d-200d-1f468-1f3fb","1f46b-1f3fc","1f469-1f3fc-200d-1f91d-200d-1f468-1f3fd","1f469-1f3fc-200d-1f91d-200d-1f468-1f3fe","1f469-1f3fc-200d-1f91d-200d-1f468-1f3ff","1f469-1f3fd-200d-1f91d-200d-1f468-1f3fb","1f469-1f3fd-200d-1f91d-200d-1f468-1f3fc","1f46b-1f3fd","1f469-1f3fd-200d-1f91d-200d-1f468-1f3fe","1f469-1f3fd-200d-1f91d-200d-1f468-1f3ff","1f469-1f3fe-200d-1f91d-200d-1f468-1f3fb","1f469-1f3fe-200d-1f91d-200d-1f468-1f3fc","1f469-1f3fe-200d-1f91d-200d-1f468-1f3fd","1f46b-1f3fe","1f469-1f3fe-200d-1f91d-200d-1f468-1f3ff","1f469-1f3ff-200d-1f91d-200d-1f468-1f3fb","1f469-1f3ff-200d-1f91d-200d-1f468-1f3fc","1f469-1f3ff-200d-1f91d-200d-1f468-1f3fd","1f469-1f3ff-200d-1f91d-200d-1f468-1f3fe","1f46b-1f3ff","1f46c","1f46c-1f3fb","1f468-1f3fc-200d-1f91d-200d-1f468-1f3fb","1f46c-1f3fc","1f468-1f3fd-200d-1f91d-200d-1f468-1f3fb","1f468-1f3fd-200d-1f91d-200d-1f468-1f3fc","1f46c-1f3fd","1f468-1f3fe-200d-1f91d-200d-1f468-1f3fb","1f468-1f3fe-200d-1f91d-200d-1f468-1f3fc","1f468-1f3fe-200d-1f91d-200d-1f468-1f3fd","1f46c-1f3fe","1f468-1f3ff-200d-1f91d-200d-1f468-1f3fb","1f468-1f3ff-200d-1f91d-200d-1f468-1f3fc","1f468-1f3ff-200d-1f91d-200d-1f468-1f3fd","1f468-1f3ff-200d-1f91d-200d-1f468-1f3fe","1f46c-1f3ff","1f48f","1f469-200d-2764-fe0f-200d-1f48b-200d-1f468","1f469-200d-2764-200d-1f48b-200d-1f468","1f468-200d-2764-fe0f-200d-1f48b-200d-1f468","1f468-200d-2764-200d-1f48b-200d-1f468","1f469-200d-2764-fe0f-200d-1f48b-200d-1f469","1f469-200d-2764-200d-1f48b-200d-1f469","1f491","1f469-200d-2764-fe0f-200d-1f468","1f469-200d-2764-200d-1f468","1f468-200d-2764-fe0f-200d-1f468","1f468-200d-2764-200d-1f468","1f469-200d-2764-fe0f-200d-1f469","1f469-200d-2764-200d-1f469","1f46a","1f468-200d-1f469-200d-1f466","1f468-200d-1f469-200d-1f467","1f468-200d-1f469-200d-1f467-200d-1f466","1f468-200d-1f469-200d-1f466-200d-1f466","1f468-200d-1f469-200d-1f467-200d-1f467","1f468-200d-1f468-200d-1f466","1f468-200d-1f468-200d-1f467","1f468-200d-1f468-200d-1f467-200d-1f466","1f468-200d-1f468-200d-1f466-200d-1f466","1f468-200d-1f468-200d-1f467-200d-1f467","1f469-200d-1f469-200d-1f466","1f469-200d-1f469-200d-1f467","1f469-200d-1f469-200d-1f467-200d-1f466","1f469-200d-1f469-200d-1f466-200d-1f466","1f469-200d-1f469-200d-1f467-200d-1f467","1f468-200d-1f466","1f468-200d-1f466-200d-1f466","1f468-200d-1f467","1f468-200d-1f467-200d-1f466","1f468-200d-1f467-200d-1f467","1f469-200d-1f466","1f469-200d-1f466-200d-1f466","1f469-200d-1f467","1f469-200d-1f467-200d-1f466","1f469-200d-1f467-200d-1f467","1f5e3-fe0f","1f5e3","1f464","1f465","1f463","1f3fb","1f3fc","1f3fd","1f3fe","1f3ff","1f9b0","1f9b1","1f9b3","1f9b2","1f435","1f412","1f98d","1f9a7","1f436","1f415","1f9ae","1f415-200d-1f9ba","1f429","1f43a","1f98a","1f99d","1f431","1f408","1f981","1f42f","1f405","1f406","1f434","1f40e","1f984","1f993","1f98c","1f42e","1f402","1f403","1f404","1f437","1f416","1f417","1f43d","1f40f","1f411","1f410","1f42a","1f42b","1f999","1f992","1f418","1f98f","1f99b","1f42d","1f401","1f400","1f439","1f430","1f407","1f43f-fe0f","1f43f","1f994","1f987","1f43b","1f428","1f43c","1f9a5","1f9a6","1f9a8","1f998","1f9a1","1f43e","1f983","1f414","1f413","1f423","1f424","1f425","1f426","1f427","1f54a-fe0f","1f54a","1f985","1f986","1f9a2","1f989","1f9a9","1f99a","1f99c","1f438","1f40a","1f422","1f98e","1f40d","1f432","1f409","1f995","1f996","1f433","1f40b","1f42c","1f41f","1f420","1f421","1f988","1f419","1f41a","1f40c","1f98b","1f41b","1f41c","1f41d","1f41e","1f997","1f577-fe0f","1f577","1f578-fe0f","1f578","1f982","1f99f","1f9a0","1f490","1f338","1f4ae","1f3f5-fe0f","1f3f5","1f339","1f940","1f33a","1f33b","1f33c","1f337","1f331","1f332","1f333","1f334","1f335","1f33e","1f33f","2618-fe0f","2618","1f340","1f341","1f342","1f343","1f347","1f348","1f349","1f34a","1f34b","1f34c","1f34d","1f96d","1f34e","1f34f","1f350","1f351","1f352","1f353","1f95d","1f345","1f965","1f951","1f346","1f954","1f955","1f33d","1f336-fe0f","1f336","1f952","1f96c","1f966","1f9c4","1f9c5","1f344","1f95c","1f330","1f35e","1f950","1f956","1f968","1f96f","1f95e","1f9c7","1f9c0","1f356","1f357","1f969","1f953","1f354","1f35f","1f355","1f32d","1f96a","1f32e","1f32f","1f959","1f9c6","1f95a","1f373","1f958","1f372","1f963","1f957","1f37f","1f9c8","1f9c2","1f96b","1f371","1f358","1f359","1f35a","1f35b","1f35c","1f35d","1f360","1f362","1f363","1f364","1f365","1f96e","1f361","1f95f","1f960","1f961","1f980","1f99e","1f990","1f991","1f9aa","1f366","1f367","1f368","1f369","1f36a","1f382","1f370","1f9c1","1f967","1f36b","1f36c","1f36d","1f36e","1f36f","1f37c","1f95b","2615","1f375","1f376","1f37e","1f377","1f378","1f379","1f37a","1f37b","1f942","1f943","1f964","1f9c3","1f9c9","1f9ca","1f962","1f37d-fe0f","1f37d","1f374","1f944","1f52a","1f3fa","1f30d","1f30e","1f30f","1f310","1f5fa-fe0f","1f5fa","1f5fe","1f9ed","1f3d4-fe0f","1f3d4","26f0-fe0f","26f0","1f30b","1f5fb","1f3d5-fe0f","1f3d5","1f3d6-fe0f","1f3d6","1f3dc-fe0f","1f3dc","1f3dd-fe0f","1f3dd","1f3de-fe0f","1f3de","1f3df-fe0f","1f3df","1f3db-fe0f","1f3db","1f3d7-fe0f","1f3d7","1f9f1","1f3d8-fe0f","1f3d8","1f3da-fe0f","1f3da","1f3e0","1f3e1","1f3e2","1f3e3","1f3e4","1f3e5","1f3e6","1f3e8","1f3e9","1f3ea","1f3eb","1f3ec","1f3ed","1f3ef","1f3f0","1f492","1f5fc","1f5fd","26ea","1f54c","1f6d5","1f54d","26e9-fe0f","26e9","1f54b","26f2","26fa","1f301","1f303","1f3d9-fe0f","1f3d9","1f304","1f305","1f306","1f307","1f309","2668-fe0f","2668","1f3a0","1f3a1","1f3a2","1f488","1f3aa","1f682","1f683","1f684","1f685","1f686","1f687","1f688","1f689","1f68a","1f69d","1f69e","1f68b","1f68c","1f68d","1f68e","1f690","1f691","1f692","1f693","1f694","1f695","1f696","1f697","1f698","1f699","1f69a","1f69b","1f69c","1f3ce-fe0f","1f3ce","1f3cd-fe0f","1f3cd","1f6f5","1f9bd","1f9bc","1f6fa","1f6b2","1f6f4","1f6f9","1f68f","1f6e3-fe0f","1f6e3","1f6e4-fe0f","1f6e4","1f6e2-fe0f","1f6e2","26fd","1f6a8","1f6a5","1f6a6","1f6d1","1f6a7","2693","26f5","1f6f6","1f6a4","1f6f3-fe0f","1f6f3","26f4-fe0f","26f4","1f6e5-fe0f","1f6e5","1f6a2","2708-fe0f","2708","1f6e9-fe0f","1f6e9","1f6eb","1f6ec","1fa82","1f4ba","1f681","1f69f","1f6a0","1f6a1","1f6f0-fe0f","1f6f0","1f680","1f6f8","1f6ce-fe0f","1f6ce","1f9f3","231b","23f3","231a","23f0","23f1-fe0f","23f1","23f2-fe0f","23f2","1f570-fe0f","1f570","1f55b","1f567","1f550","1f55c","1f551","1f55d","1f552","1f55e","1f553","1f55f","1f554","1f560","1f555","1f561","1f556","1f562","1f557","1f563","1f558","1f564","1f559","1f565","1f55a","1f566","1f311","1f312","1f313","1f314","1f315","1f316","1f317","1f318","1f319","1f31a","1f31b","1f31c","1f321-fe0f","1f321","2600-fe0f","2600","1f31d","1f31e","1fa90","2b50","1f31f","1f320","1f30c","2601-fe0f","2601","26c5","26c8-fe0f","26c8","1f324-fe0f","1f324","1f325-fe0f","1f325","1f326-fe0f","1f326","1f327-fe0f","1f327","1f328-fe0f","1f328","1f329-fe0f","1f329","1f32a-fe0f","1f32a","1f32b-fe0f","1f32b","1f32c-fe0f","1f32c","1f300","1f308","1f302","2602-fe0f","2602","2614","26f1-fe0f","26f1","26a1","2744-fe0f","2744","2603-fe0f","2603","26c4","2604-fe0f","2604","1f525","1f4a7","1f30a","1f383","1f384","1f386","1f387","1f9e8","2728","1f388","1f389","1f38a","1f38b","1f38d","1f38e","1f38f","1f390","1f391","1f9e7","1f380","1f381","1f397-fe0f","1f397","1f39f-fe0f","1f39f","1f3ab","1f396-fe0f","1f396","1f3c6","1f3c5","1f947","1f948","1f949","26bd","26be","1f94e","1f3c0","1f3d0","1f3c8","1f3c9","1f3be","1f94f","1f3b3","1f3cf","1f3d1","1f3d2","1f94d","1f3d3","1f3f8","1f94a","1f94b","1f945","26f3","26f8-fe0f","26f8","1f3a3","1f93f","1f3bd","1f3bf","1f6f7","1f94c","1f3af","1fa80","1fa81","1f3b1","1f52e","1f9ff","1f3ae","1f579-fe0f","1f579","1f3b0","1f3b2","1f9e9","1f9f8","2660-fe0f","2660","2665-fe0f","2665","2666-fe0f","2666","2663-fe0f","2663","265f-fe0f","265f","1f0cf","1f004","1f3b4","1f3ad","1f5bc-fe0f","1f5bc","1f3a8","1f9f5","1f9f6","1f453","1f576-fe0f","1f576","1f97d","1f97c","1f9ba","1f454","1f455","1f456","1f9e3","1f9e4","1f9e5","1f9e6","1f457","1f458","1f97b","1fa71","1fa72","1fa73","1f459","1f45a","1f45b","1f45c","1f45d","1f6cd-fe0f","1f6cd","1f392","1f45e","1f45f","1f97e","1f97f","1f460","1f461","1fa70","1f462","1f451","1f452","1f3a9","1f393","1f9e2","26d1-fe0f","26d1","1f4ff","1f484","1f48d","1f48e","1f507","1f508","1f509","1f50a","1f4e2","1f4e3","1f4ef","1f514","1f515","1f3bc","1f3b5","1f3b6","1f399-fe0f","1f399","1f39a-fe0f","1f39a","1f39b-fe0f","1f39b","1f3a4","1f3a7","1f4fb","1f3b7","1f3b8","1f3b9","1f3ba","1f3bb","1fa95","1f941","1f4f1","1f4f2","260e-fe0f","260e","1f4de","1f4df","1f4e0","1f50b","1f50c","1f4bb","1f5a5-fe0f","1f5a5","1f5a8-fe0f","1f5a8","2328-fe0f","2328","1f5b1-fe0f","1f5b1","1f5b2-fe0f","1f5b2","1f4bd","1f4be","1f4bf","1f4c0","1f9ee","1f3a5","1f39e-fe0f","1f39e","1f4fd-fe0f","1f4fd","1f3ac","1f4fa","1f4f7","1f4f8","1f4f9","1f4fc","1f50d","1f50e","1f56f-fe0f","1f56f","1f4a1","1f526","1f3ee","1fa94","1f4d4","1f4d5","1f4d6","1f4d7","1f4d8","1f4d9","1f4da","1f4d3","1f4d2","1f4c3","1f4dc","1f4c4","1f4f0","1f5de-fe0f","1f5de","1f4d1","1f516","1f3f7-fe0f","1f3f7","1f4b0","1f4b4","1f4b5","1f4b6","1f4b7","1f4b8","1f4b3","1f9fe","1f4b9","1f4b1","1f4b2","2709-fe0f","2709","1f4e7","1f4e8","1f4e9","1f4e4","1f4e5","1f4e6","1f4eb","1f4ea","1f4ec","1f4ed","1f4ee","1f5f3-fe0f","1f5f3","270f-fe0f","270f","2712-fe0f","2712","1f58b-fe0f","1f58b","1f58a-fe0f","1f58a","1f58c-fe0f","1f58c","1f58d-fe0f","1f58d","1f4dd","1f4bc","1f4c1","1f4c2","1f5c2-fe0f","1f5c2","1f4c5","1f4c6","1f5d2-fe0f","1f5d2","1f5d3-fe0f","1f5d3","1f4c7","1f4c8","1f4c9","1f4ca","1f4cb","1f4cc","1f4cd","1f4ce","1f587-fe0f","1f587","1f4cf","1f4d0","2702-fe0f","2702","1f5c3-fe0f","1f5c3","1f5c4-fe0f","1f5c4","1f5d1-fe0f","1f5d1","1f512","1f513","1f50f","1f510","1f511","1f5dd-fe0f","1f5dd","1f528","1fa93","26cf-fe0f","26cf","2692-fe0f","2692","1f6e0-fe0f","1f6e0","1f5e1-fe0f","1f5e1","2694-fe0f","2694","1f52b","1f3f9","1f6e1-fe0f","1f6e1","1f527","1f529","2699-fe0f","2699","1f5dc-fe0f","1f5dc","2696-fe0f","2696","1f9af","1f517","26d3-fe0f","26d3","1f9f0","1f9f2","2697-fe0f","2697","1f9ea","1f9eb","1f9ec","1f52c","1f52d","1f4e1","1f489","1fa78","1f48a","1fa79","1fa7a","1f6aa","1f6cf-fe0f","1f6cf","1f6cb-fe0f","1f6cb","1fa91","1f6bd","1f6bf","1f6c1","1fa92","1f9f4","1f9f7","1f9f9","1f9fa","1f9fb","1f9fc","1f9fd","1f9ef","1f6d2","1f6ac","26b0-fe0f","26b0","26b1-fe0f","26b1","1f5ff","1f3e7","1f6ae","1f6b0","267f","1f6b9","1f6ba","1f6bb","1f6bc","1f6be","1f6c2","1f6c3","1f6c4","1f6c5","26a0-fe0f","26a0","1f6b8","26d4","1f6ab","1f6b3","1f6ad","1f6af","1f6b1","1f6b7","1f4f5","1f51e","2622-fe0f","2622","2623-fe0f","2623","2b06-fe0f","2b06","2197-fe0f","2197","27a1-fe0f","27a1","2198-fe0f","2198","2b07-fe0f","2b07","2199-fe0f","2199","2b05-fe0f","2b05","2196-fe0f","2196","2195-fe0f","2195","2194-fe0f","2194","21a9-fe0f","21a9","21aa-fe0f","21aa","2934-fe0f","2934","2935-fe0f","2935","1f503","1f504","1f519","1f51a","1f51b","1f51c","1f51d","1f6d0","269b-fe0f","269b","1f549-fe0f","1f549","2721-fe0f","2721","2638-fe0f","2638","262f-fe0f","262f","271d-fe0f","271d","2626-fe0f","2626","262a-fe0f","262a","262e-fe0f","262e","1f54e","1f52f","2648","2649","264a","264b","264c","264d","264e","264f","2650","2651","2652","2653","26ce","1f500","1f501","1f502","25b6-fe0f","25b6","23e9","23ed-fe0f","23ed","23ef-fe0f","23ef","25c0-fe0f","25c0","23ea","23ee-fe0f","23ee","1f53c","23eb","1f53d","23ec","23f8-fe0f","23f8","23f9-fe0f","23f9","23fa-fe0f","23fa","23cf-fe0f","23cf","1f3a6","1f505","1f506","1f4f6","1f4f3","1f4f4","2640-fe0f","2640","2642-fe0f","2642","2695-fe0f","2695","267e-fe0f","267e","267b-fe0f","267b","269c-fe0f","269c","1f531","1f4db","1f530","2b55","2705","2611-fe0f","2611","2714-fe0f","2714","2716-fe0f","2716","274c","274e","2795","2796","2797","27b0","27bf","303d-fe0f","303d","2733-fe0f","2733","2734-fe0f","2734","2747-fe0f","2747","203c-fe0f","203c","2049-fe0f","2049","2753","2754","2755","2757","3030-fe0f","3030","00a9-fe0f","00a9","00ae-fe0f","00ae","2122-fe0f","2122","0023-fe0f-20e3","0023-20e3","002a-fe0f-20e3","002a-20e3","0030-fe0f-20e3","0030-20e3","0031-fe0f-20e3","0031-20e3","0032-fe0f-20e3","0032-20e3","0033-fe0f-20e3","0033-20e3","0034-fe0f-20e3","0034-20e3","0035-fe0f-20e3","0035-20e3","0036-fe0f-20e3","0036-20e3","0037-fe0f-20e3","0037-20e3","0038-fe0f-20e3","0038-20e3","0039-fe0f-20e3","0039-20e3","1f51f","1f520","1f521","1f522","1f523","1f524","1f170-fe0f","1f170","1f18e","1f171-fe0f","1f171","1f191","1f192","1f193","2139-fe0f","2139","1f194","24c2-fe0f","24c2","1f195","1f196","1f17e-fe0f","1f17e","1f197","1f17f-fe0f","1f17f","1f198","1f199","1f19a","1f201","1f202-fe0f","1f202","1f237-fe0f","1f237","1f236","1f22f","1f250","1f239","1f21a","1f232","1f251","1f238","1f234","1f233","3297-fe0f","3297","3299-fe0f","3299","1f23a","1f235","1f534","1f7e0","1f7e1","1f7e2","1f535","1f7e3","1f7e4","26ab","26aa","1f7e5","1f7e7","1f7e8","1f7e9","1f7e6","1f7ea","1f7eb","2b1b","2b1c","25fc-fe0f","25fc","25fb-fe0f","25fb","25fe","25fd","25aa-fe0f","25aa","25ab-fe0f","25ab","1f536","1f537","1f538","1f539","1f53a","1f53b","1f4a0","1f518","1f533","1f532","1f3c1","1f6a9","1f38c","1f3f4","1f3f3-fe0f","1f3f3","1f3f3-fe0f-200d-1f308","1f3f3-200d-1f308","1f3f4-200d-2620-fe0f","1f3f4-200d-2620","1f1e6-1f1e8","1f1e6-1f1e9","1f1e6-1f1ea","1f1e6-1f1eb","1f1e6-1f1ec","1f1e6-1f1ee","1f1e6-1f1f1","1f1e6-1f1f2","1f1e6-1f1f4","1f1e6-1f1f6","1f1e6-1f1f7","1f1e6-1f1f8","1f1e6-1f1f9","1f1e6-1f1fa","1f1e6-1f1fc","1f1e6-1f1fd","1f1e6-1f1ff","1f1e7-1f1e6","1f1e7-1f1e7","1f1e7-1f1e9","1f1e7-1f1ea","1f1e7-1f1eb","1f1e7-1f1ec","1f1e7-1f1ed","1f1e7-1f1ee","1f1e7-1f1ef","1f1e7-1f1f1","1f1e7-1f1f2","1f1e7-1f1f3","1f1e7-1f1f4","1f1e7-1f1f6","1f1e7-1f1f7","1f1e7-1f1f8","1f1e7-1f1f9","1f1e7-1f1fb","1f1e7-1f1fc","1f1e7-1f1fe","1f1e7-1f1ff","1f1e8-1f1e6","1f1e8-1f1e8","1f1e8-1f1e9","1f1e8-1f1eb","1f1e8-1f1ec","1f1e8-1f1ed","1f1e8-1f1ee","1f1e8-1f1f0","1f1e8-1f1f1","1f1e8-1f1f2","1f1e8-1f1f3","1f1e8-1f1f4","1f1e8-1f1f5","1f1e8-1f1f7","1f1e8-1f1fa","1f1e8-1f1fb","1f1e8-1f1fc","1f1e8-1f1fd","1f1e8-1f1fe","1f1e8-1f1ff","1f1e9-1f1ea","1f1e9-1f1ec","1f1e9-1f1ef","1f1e9-1f1f0","1f1e9-1f1f2","1f1e9-1f1f4","1f1e9-1f1ff","1f1ea-1f1e6","1f1ea-1f1e8","1f1ea-1f1ea","1f1ea-1f1ec","1f1ea-1f1ed","1f1ea-1f1f7","1f1ea-1f1f8","1f1ea-1f1f9","1f1ea-1f1fa","1f1eb-1f1ee","1f1eb-1f1ef","1f1eb-1f1f0","1f1eb-1f1f2","1f1eb-1f1f4","1f1eb-1f1f7","1f1ec-1f1e6","1f1ec-1f1e7","1f1ec-1f1e9","1f1ec-1f1ea","1f1ec-1f1eb","1f1ec-1f1ec","1f1ec-1f1ed","1f1ec-1f1ee","1f1ec-1f1f1","1f1ec-1f1f2","1f1ec-1f1f3","1f1ec-1f1f5","1f1ec-1f1f6","1f1ec-1f1f7","1f1ec-1f1f8","1f1ec-1f1f9","1f1ec-1f1fa","1f1ec-1f1fc","1f1ec-1f1fe","1f1ed-1f1f0","1f1ed-1f1f2","1f1ed-1f1f3","1f1ed-1f1f7","1f1ed-1f1f9","1f1ed-1f1fa","1f1ee-1f1e8","1f1ee-1f1e9","1f1ee-1f1ea","1f1ee-1f1f1","1f1ee-1f1f2","1f1ee-1f1f3","1f1ee-1f1f4","1f1ee-1f1f6","1f1ee-1f1f7","1f1ee-1f1f8","1f1ee-1f1f9","1f1ef-1f1ea","1f1ef-1f1f2","1f1ef-1f1f4","1f1ef-1f1f5","1f1f0-1f1ea","1f1f0-1f1ec","1f1f0-1f1ed","1f1f0-1f1ee","1f1f0-1f1f2","1f1f0-1f1f3","1f1f0-1f1f5","1f1f0-1f1f7","1f1f0-1f1fc","1f1f0-1f1fe","1f1f0-1f1ff","1f1f1-1f1e6","1f1f1-1f1e7","1f1f1-1f1e8","1f1f1-1f1ee","1f1f1-1f1f0","1f1f1-1f1f7","1f1f1-1f1f8","1f1f1-1f1f9","1f1f1-1f1fa","1f1f1-1f1fb","1f1f1-1f1fe","1f1f2-1f1e6","1f1f2-1f1e8","1f1f2-1f1e9","1f1f2-1f1ea","1f1f2-1f1eb","1f1f2-1f1ec","1f1f2-1f1ed","1f1f2-1f1f0","1f1f2-1f1f1","1f1f2-1f1f2","1f1f2-1f1f3","1f1f2-1f1f4","1f1f2-1f1f5","1f1f2-1f1f6","1f1f2-1f1f7","1f1f2-1f1f8","1f1f2-1f1f9","1f1f2-1f1fa","1f1f2-1f1fb","1f1f2-1f1fc","1f1f2-1f1fd","1f1f2-1f1fe","1f1f2-1f1ff","1f1f3-1f1e6","1f1f3-1f1e8","1f1f3-1f1ea","1f1f3-1f1eb","1f1f3-1f1ec","1f1f3-1f1ee","1f1f3-1f1f1","1f1f3-1f1f4","1f1f3-1f1f5","1f1f3-1f1f7","1f1f3-1f1fa","1f1f3-1f1ff","1f1f4-1f1f2","1f1f5-1f1e6","1f1f5-1f1ea","1f1f5-1f1eb","1f1f5-1f1ec","1f1f5-1f1ed","1f1f5-1f1f0","1f1f5-1f1f1","1f1f5-1f1f2","1f1f5-1f1f3","1f1f5-1f1f7","1f1f5-1f1f8","1f1f5-1f1f9","1f1f5-1f1fc","1f1f5-1f1fe","1f1f6-1f1e6","1f1f7-1f1ea","1f1f7-1f1f4","1f1f7-1f1f8","1f1f7-1f1fa","1f1f7-1f1fc","1f1f8-1f1e6","1f1f8-1f1e7","1f1f8-1f1e8","1f1f8-1f1e9","1f1f8-1f1ea","1f1f8-1f1ec","1f1f8-1f1ed","1f1f8-1f1ee","1f1f8-1f1ef","1f1f8-1f1f0","1f1f8-1f1f1","1f1f8-1f1f2","1f1f8-1f1f3","1f1f8-1f1f4","1f1f8-1f1f7","1f1f8-1f1f8","1f1f8-1f1f9","1f1f8-1f1fb","1f1f8-1f1fd","1f1f8-1f1fe","1f1f8-1f1ff","1f1f9-1f1e6","1f1f9-1f1e8","1f1f9-1f1e9","1f1f9-1f1eb","1f1f9-1f1ec","1f1f9-1f1ed","1f1f9-1f1ef","1f1f9-1f1f0","1f1f9-1f1f1","1f1f9-1f1f2","1f1f9-1f1f3","1f1f9-1f1f4","1f1f9-1f1f7","1f1f9-1f1f9","1f1f9-1f1fb","1f1f9-1f1fc","1f1f9-1f1ff","1f1fa-1f1e6","1f1fa-1f1ec","1f1fa-1f1f2","1f1fa-1f1f3","1f1fa-1f1f8","1f1fa-1f1fe","1f1fa-1f1ff","1f1fb-1f1e6","1f1fb-1f1e8","1f1fb-1f1ea","1f1fb-1f1ec","1f1fb-1f1ee","1f1fb-1f1f3","1f1fb-1f1fa","1f1fc-1f1eb","1f1fc-1f1f8","1f1fd-1f1f0","1f1fe-1f1ea","1f1fe-1f1f9","1f1ff-1f1e6","1f1ff-1f1f2","1f1ff-1f1fc","1f3f4-e0067-e0062-e0065-e006e-e0067-e007f","1f3f4-e0067-e0062-e0073-e0063-e0074-e007f","1f3f4-e0067-e0062-e0077-e006c-e0073-e007f"],
		request : function (object) {
			if (isGM4())
				return GM.xmlHttpRequest (object);
			else
				return GM_xmlhttpRequest (object);
		},
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
			if (!localStorage.hasOwnProperty(rk))
				return default_value;
			var data = localStorage.getItem (rk);
			try {
				var obj = JSON.parse (data);
				return obj;
			}
			catch(e) {
				return default_value;
			}
			return data;	
		},
		Image : function (title, source, link) {
			this.title = title;
			this.source = source;
			this.link = link;
			
			this.getBBCode = function (b) {
				var str = "[img]" + this.source + "[/img]";
				if (b == true)
					str = "[url=" + this.link + "]" + str + "[/url]";
				return str;
			};
		},
		Window : function (ta) {
			var textarea = ta;
			var background = null;
			var win = null;
			var images = [];
			var oon = HFR.getValue ("hfr-copie-colle-window", "oui") == "oui" ? true : false;
			
			this.addImage = function (img) {
				images.push (img);
			}
			
			this.hide = function() {
				if (document.querySelector("div#apercu_reponse")) 
					document.querySelector("div#apercu_reponse").classList.remove ("hfr_apercu_nope");
				if (background && background.parentElement)
					background.parentElement.removeChild (background);
			}
			
			this.display = function() {
				if (!oon)
					if (images.length > 0) {
						var image = images[0];
						insert_text_at_cursor (textarea, image.getBBCode (true));
						if (textarea.files != null && textarea.files_index < textarea.files.length)
							process (textarea, textarea.files.item (textarea.files_index++));
						return;
					}
				for (var i = 0; i < images.length; i++) {
					var image = images[i];
					var button = document.createElement ("button");
					button.textContent = image.title;
					button.image = image;
					var hw = this;
					button.style = "margin-left : 2px; margin-right: 2px;";
					button.onclick = e => {
						insert_text_at_cursor (textarea, e.target.image.getBBCode (true));
						hw.hide();
						if (textarea.files != null && textarea.files_index < textarea.files.length)
							process (textarea, textarea.files.item (textarea.files_index++));
					};
					button.oncontextmenu = e => {
						insert_text_at_cursor (textarea, e.target.image.getBBCode (false));
						hw.hide();
						e.preventDefault();
						if (textarea.files != null && textarea.files_index < textarea.files.length)
							process (textarea, textarea.files.item (textarea.files_index++));
					};
					win.appendChild (button);
				}
				
				if (background.parentElement == null)
					document.body.appendChild (background);
				if(document.querySelector("div#apercu_reponse"))
					document.querySelector("div#apercu_reponse").classList.add("hfr_apercu_nope");
				background.style.display = "block";
				win.style.display = "block";
				background.style.width = document.documentElement.scrollWidth + "px";
				background.style.height = document.documentElement.scrollHeight + "px";
				win.style.left = ((document.documentElement.clientWidth - win.offsetWidth) / 2) + "px";
				win.style.top = ((document.documentElement.clientHeight - win.offsetHeight) / 2) + "px";
				background.style.opacity = "0.8";
			}
			
			var count = 0;
			while (document.querySelector("#hfr_cc_" + count + "_window") != null)
				count++;
			
			var style = document.createElement ("style");
			style.textContent = "#hfr_cc_" + count + "_background {position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
					  "display:none;opacity:0;transition:opacity 0.7s ease 0s;}" +
					  "#hfr_cc_" + count + "_window {position:fixed;z-index:1002;display:none;background:rgba(255,255,255,1);padding:5px;text-align : center;}" +
					  ".hfr_apercu_nope{display:none !important;}";
			document.head.appendChild (style);
			
			win = document.createElement ("div");
			win.appendChild (document.createTextNode ("Images disponibles :"));
			win.appendChild (document.createElement ("br"));
			win.appendChild (document.createTextNode ("(clic droit sur un des bouton pour une insertion sans lien, clic en dehors de la fenêtre pour annuler l'action)"));
			win.appendChild (document.createElement ("br"));
			win.setAttribute ("id", "hfr_cc_" + count + "_window");
			background = document.createElement ("div");
			background.onclick = this.hide;
			background.setAttribute ("id", "hfr_cc_" + count + "_background");
			background.appendChild (win);
			background.addEventListener("transitionend", function() {
				console.log (background.style.opacity);
				if(background.style.opacity === "0") {
					background.style.display = "none";
					win.style.display = "none";
					if(document.querySelector("div#apercu_reponse"))
						document.querySelector("div#apercu_reponse").classList.remove("hfr_apercu_nope");
				}
			}, false);
			document.body.appendChild(background);
		}
	};

	GM_registerMenuCommand("[HFR] Copié/Collé -> prévisualisation des liens", function() {
		var param = prompt ("Afficher le contenu des liens ? (tapez \"non\" ou \"oui\")", HFR.getValue ("hfr-copie-colle-preview", "non"));
		var val = "non";
		if (param == "oui")
			val = "oui";
		HFR.setValue ("hfr-copie-colle-preview", val);
	});
	
	GM_registerMenuCommand("[HFR] Copié/Collé -> fenêtre de sélection", function() {
		var param = prompt ("Si \"oui\", une fenêtre sera affiché après réception du BBCode", HFR.getValue ("hfr-copie-colle-window", "oui"));
		var val = "non";
		if (param == "oui")
			val = "oui";
		HFR.setValue ("hfr-copie-colle-window", val);
	});

	function dataURItoBlob(dataURI) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], {type:mimeString});
	}

	function HfrThrobber() {
		var throbber = null;
		var throbber_img = null;
		
		this.hide = function() {
			throbber_img.style.opacity = "0";
			throbber.style.opacity = "0";
			if (document.querySelector("div#apercu_reponse")) 
				document.querySelector("div#apercu_reponse").classList.remove ("hfr_apercu_nope");
		}
		
		this.destroy = function() {
			this.hide();
			throbber.parentElement.removeChild (throbber);
		}
		
		this.display = function() {
			if (throbber.parentElement == null)
				document.body.appendChild (throbber);
			if(document.querySelector("div#apercu_reponse"))
				document.querySelector("div#apercu_reponse").classList.add("hfr_apercu_nope");
			throbber_img.style.display = "block";
			throbber.style.display = "block";
			throbber.style.width = document.documentElement.scrollWidth + "px";
			throbber.style.height = document.documentElement.scrollHeight + "px";
			throbber_img.style.opacity = "1";
			throbber.style.opacity = "0.8";
		}
		
		var count = 0;
		while (document.querySelector("#hfr_" + count + "_throbber") != null)
			count++;
		/*
		GM_addStyle("#hfr_" + count + "_throbber{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
				  "display:none;opacity:0;transition:opacity 0.7s ease 0s;}");
		GM_addStyle("#hfr_" + count + "_throbber_img{position:fixed;left:calc(50% - 64px);top:calc(50% - 64px);width:128px;height:128px;z-index:1002;" +
				  "display:none;opacity:0;transition:opacity 0.7s ease 0s;border:0;padding:0;}");
		GM_addStyle(".hfr_apercu_nope{display:none !important;}");
		*/
		
		var style = document.createElement ("style");
		style.textContent = "#hfr_" + count + "_throbber{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
				  "display:none;opacity:0;transition:opacity 0.7s ease 0s;}" +
				  "#hfr_" + count + "_throbber_img{position:fixed;left:calc(50% - 64px);top:calc(50% - 64px);width:128px;height:128px;z-index:1002;" +
				  "display:none;opacity:0;transition:opacity 0.7s ease 0s;border:0;padding:0;}" +
				  ".hfr_apercu_nope{display:none !important;}";
		document.head.appendChild (style);
		
		var throbber_image_url = "https://reho.st/self/30271dc1b7cac925aeabb89fa70e1e17cf5e1840.png";
		throbber_img = new Image();
		throbber_img.src = throbber_image_url;
		throbber_img.setAttribute("id", "hfr_" + count + "_throbber_img");
		throbber = document.createElement("div");
		throbber.setAttribute("id", "hfr_" + count + "_throbber");
		throbber.appendChild(throbber_img);
		throbber.addEventListener("transitionend", function() {
			if(throbber.style.opacity === "0") {
				throbber_img.style.display = "none";
				throbber.style.display = "none";
				if(document.querySelector("div#apercu_reponse"))
					document.querySelector("div#apercu_reponse").classList.remove("hfr_apercu_nope");
			}
		}, false);
		document.body.appendChild(throbber);
	}

	function insert_text_at_cursor (textarea, text) {
		var start = textarea.selectionStart;
		var end = textarea.selectionEnd;
		textarea.value = textarea.value.substr (0, start) + text + textarea.value.substr (end);
		textarea.setSelectionRange (start + text.length, start + text.length);
	}

	function Stack() {
		var counter = -1;
		this.objects = {};
		this.add = function (data) {
			counter++;
			this.objects[counter.toString()] = data;
			return counter;
		};
		this.getData = function (index) {
			return this.objects[index.toString()];
		}
	}

	let stack = new Stack();

	function checkRehost (options) {
		// des fois que ça soit proxytaffé :o
		var img = new Image();
		img.onerror = function() {
			options.use = "imgur";
		};
		img.src = "https://reho.st/self/c6c4df042a8891be61ad47efdbbe34ab40fa3d51.png";
	}

	function insert (textarea, link, src) {
		insert_text_at_cursor (textarea, `[url=${link}][img]${src}[/img][/url]`);
		if (textarea.files != null && textarea.files_index < textarea.files.length)
			process (textarea, textarea.files.item (textarea.files_index++));
	}

	function textToUnicode (text) {
		var array = Array.from (text);
		var result = [];
		for (var i = 0; i < array.length; i++)
			result.push (array[i].codePointAt (0).toString (16));
		return result.join ("-");
	}

	function isFormattable (text) {
		var array = Array.from (text);
		var uarray = [];
		for (var i = 0; i < array.length; i++) {
			uarray.push (array[i].codePointAt (0).toString (16));
		}
		var tmp = uarray.join ("-");
		var found = false;
		for (var i = 0; i < HFR.unicode_table.length; i++) {
			if (tmp.indexOf (HFR.unicode_table[i]) > -1) {
				found = true;
				break;
			}
		}
		return found;
	}

	function formatName (text) {
		var table = [ "1D54B", "2297", "4F3", "1D560" ];
		var array = Array.from (text);
		var uarray = [];
		for (var i = 0; i < array.length; i++) {
			uarray.push (array[i].codePointAt (0).toString (16).toUpperCase());
		}
		var str = "";
		for (var i = 0; i < array.length; i++)
			if (uarray[i] == "1D54B")
				str += "T";
			else if (uarray[i] == "2297" || uarray[i] == "1D560")
				str += "o";
			else str += array[i];
		return str;
	}

	function formatText (text) {
		console.log (text);
		if (!isFormattable (text))
			return text;
		var array = Array.from (text);
		var uarray = [];
		for (var i = 0; i < array.length; i++) {
			uarray.push (array[i].codePointAt (0).toString (16));
		}
		var tmp = uarray.join ("-");
		var result = "";
		while (tmp.length > 0) {
			var found = false;
			for (var i = 0; i < HFR.unicode_table.length; i++) {
				if (tmp.indexOf (HFR.unicode_table[i]) == 0) {
					result  = result + "[img]https://gitlab.com/BZHDeveloper/HFR/raw/master/emojis-micro/" + HFR.unicode_table[i] + ".png[/img]";
					tmp = tmp.substring (1 + HFR.unicode_table[i].length);
					found = true;
					break;
				}
			}
			if (!found) {
				var code_str = tmp.substring (0, (tmp.indexOf ("-") < 0 ? tmp.length : tmp.indexOf ("-")));
				tmp = (tmp.indexOf ("-") < 0 ? "" : tmp.substring (1 + tmp.indexOf ("-")));
				var code = parseInt ("0x" + code_str);
				result += String.fromCodePoint (code);
			}
		}
		return result;
	}

	function Builder (data) {
		var txt = "";
		if (data != null)
			txt += data;
			
		this.append = function (str) {
			txt += str;
		};
		this.prepend = function (str) {
			txt = str + txt;
		}	
		this.toString = function() {
			return txt;
		};
	}

	function tweet_to_quote (tweet, uri) {
		var content = tweet.querySelector (".tweet-text");
		var photos = tweet.querySelectorAll (".AdaptiveMedia-photoContainer");
		var gif = tweet.querySelector (".PlayableMedia--gif");
		var video = tweet.querySelector (".PlayableMedia--video");
		var preview = tweet.querySelector ("QuoteMedia-videoPreview");
		var qt = tweet.querySelector (".QuoteTweet-container");
		var card = tweet.querySelector ("[data-card-url]");
		var builder = new Builder("");
		for (var i = 0; i < content.childNodes.length; i++) {
			var child = content.childNodes.item (i);
		//	if (child.previousSibling != null && child.previousSibling
			if (child.nodeType == Node.TEXT_NODE)
				builder.append (child.textContent);
			else if (child.nodeName == "br")
				builder.append ("\n");
			else if (child.classList.contains ("twitter-hashflag-container")) {
				var href = child.querySelector (".twitter-hashtag");
				builder.append (`[url=https://twitter.com${href.getAttribute ("href")}][b]#${child.querySelector ("b").textContent}[/b]`);
				builder.append (`[img]${child.querySelector (".twitter-hashflag").getAttribute ("src")}[/img][/url]`);
			}
			else if (child.classList.contains ("twitter-atreply"))
				builder.append (`[url=https://twitter.com${child.getAttribute ("href")}][b]@${child.querySelector ("b").textContent}[/b][/url]`);
			else if (child.classList.contains ("twitter-hashtag"))
				builder.append (`[url=https://twitter.com${child.getAttribute ("href")}][b]#${child.querySelector ("b").textContent}[/b][/url]`);
			else if (child.classList.contains ("twitter-timeline-link") && !child.classList.contains ("u-hidden")) {
				var url = child.getAttribute ("href");
				if (child.getAttribute ("data-expanded-url") != null)
					url = child.getAttribute ("data-expanded-url");
				builder.append (`[url=${url}][b]${url}[/b][/url]`);
			}
			else if (child.classList.contains ("Emoji")) {
				var src = child.getAttribute ("src");
				builder.append (`[img]https://gitlab.com/BZHDeveloper/HFR/raw/master/emojis-micro/${src.substring (1 + src.lastIndexOf("/")) }[/img]`);
			}
		}
		var url = "";
		if (uri != null)
			url += uri;
		var data_name = formatName (tweet.getAttribute ("data-name"));
		builder.prepend (`[citation=1,1,1][nom][url=${url}][img]https://reho.st/preview/self/65a37575404c3ff860d0ce3981fcf8b0e0387ae7.png[/img] ${data_name}${tweet.getAttribute ("data-verified") == "true" ? " [:yoann riou:9]" : ""} (@${tweet.getAttribute ("data-screen-name")})[/url][/nom]`);
		builder.append ("\n\n");
		for (var i = 0; i < photos.length; i++)
			builder.append (`[url=https://reho.st/${photos.item (i).getAttribute ("data-image-url")}][img]https://reho.st/thumb/${photos.item (i).getAttribute ("data-image-url")}[/img][/url]`);
		if (gif != null) {
			var thumb = tweet.ownerDocument.querySelector ("[property='og:image']").getAttribute ("content");
			var url = "https://video.twimg.com/tweet_video/" + thumb.slice (1 + thumb.lastIndexOf ("/"), thumb.lastIndexOf (".")) + ".mp4";
			builder.append (`[url=${url}][img]https://reho.st/thumb/${thumb}[/img][/url]`);
		}
		if (video != null) {
			var thumb = tweet.ownerDocument.querySelector ("[property='og:image']").getAttribute ("content");
			var id = url.substring (1 + url.lastIndexOf ("/"));
			builder.append (`[url=https://twitter.com/i/videos/tweet/${id}][img]https://reho.st/thumb/${thumb}[/img][/url]`);
		}
		if (qt != null) {
			var fullname = "";
			var verified = qt.querySelector (".QuoteTweet-originalAuthor").querySelector (".Icon--verified") != null;
			qt.querySelector (".QuoteTweet-fullname").childNodes.forEach (function (node) {
				if (node.classList != null && node.classList.contains ("Emoji")) {
					var code = node.style.backgroundImage.split ("/72x72/")[1].split (".png")[0];
					fullname += "[img]http://breizhodrome.free.fr/smileys-micro/" + code + ".png[/img]";
				}
				else if (node.nodeType == Node.TEXT_NODE)
					fullname += node.textContent;
			});
			fullname = formatText (fullname);
			qt.setAttribute ("data-name", fullname);
			qt.setAttribute ("data-verified", verified ? "true" : "false");
			qt.setAttribute ("data-screen-name", qt.querySelector (".QuoteTweet-originalAuthor").querySelector (".username > b").textContent);
			builder.append (tweet_to_quote (qt, null));
		}
		if (card != null)
			builder.append (`[url=${card.getAttribute ("data-card-url")}]${card.getAttribute ("data-card-url")}[/url]`);
		builder.append ("[/citation]");
		return builder.toString();
	}

	async function tweet_to_quote_async (tweet, uri) {
		return tweet_to_quote (tweet, uri);
	}

	function twitter_async (uri, text) {
		return new Promise ((resolve, reject) => {
			var doc = new DOMParser().parseFromString (text, "text/html");
			var tweet = doc.querySelector (".js-original-tweet");
			if (tweet == null || tweet.querySelector (".permalink-header") == null)
				reject (uri);
			else {
				var fullname = "";
				var verified = tweet.querySelector (".permalink-header").querySelector (".Icon--verified") != null;
				tweet.querySelector (".permalink-header").querySelector (".fullname").childNodes.forEach (function (node) {
					if (node.classList != null && node.classList.contains ("Emoji")) {
						var code = node.style.backgroundImage.split ("/72x72/")[1].split (".png")[0];
						fullname += "[img]https://gitlab.com/BZHDeveloper/HFR/raw/master/emojis-micro/" + code + ".png[/img]";
					}
					else if (node.nodeType == Node.TEXT_NODE)
						fullname += node.textContent;
				});
				fullname = formatText (fullname);
				tweet.setAttribute ("data-name", fullname);
				tweet.setAttribute ("data-verified", verified ? "true" : "false");
				tweet.setAttribute ("data-screen-name", tweet.querySelector (".permalink-header").querySelector (".username > b").textContent);
				resolve (tweet_to_quote (tweet, uri));
			}
		});
	}

	function twitter (area, uri) {
		var throbber = new HfrThrobber();
		throbber.display();
		var context = {
			textarea : area,
			uri : uri,
			throbber : throbber
		};
		var id = stack.add (context);
		HFR.request({
			method : "GET",
			url : uri,
			context : { id : id },
			headers : { 
				"Cookie" : "",
				"Referer" : uri,
				"User-Agent" : "Mozilla/5.0 (Windows NT 9.0; WOW64; Trident/7.0; rv:11.0) like Gecko"
			},
			anonymous : true,
			onabort : throbber.hide,
			onerror : throbber.hide,
			ontimeout : throbber.hide,
			onload : function (response) {
				console.log (response.responseText);
				var context = stack.getData (id);
				if (response.context != null)
					context = stack.getData (response.context.id);
				twitter_async (context.uri, response.responseText).then (text => {
					context.throbber.destroy();
					insert_text_at_cursor (context.textarea, text);
				}).catch (err => {
					console.log (err);
					context.throbber.destroy();
					insert_text_at_cursor (context.textarea, context.uri);
				});
			}
		});
	}

	function instagram_async (json, turi) {
		return new Promise ((resolve, reject) => {
			var object = JSON.parse (json);
			if (typeof (object.entry_data.PostPage) === "undefined")
				reject();
			else {
				var text = "";
				if (object.entry_data.PostPage[0].graphql.shortcode_media.edge_media_to_caption.edges != null && object.entry_data.PostPage[0].graphql.shortcode_media.edge_media_to_caption.edges.length > 0)
					text = formatText (object.entry_data.PostPage[0].graphql.shortcode_media.edge_media_to_caption.edges[0].node.text);
				var tarray = text.split (" ");
				var narray = [];
				for (var i = 0; tarray.length; i++) {
				if (tarray.length == narray.length)
					break;
					if (tarray[i].indexOf("@") == 0)
						narray.push (`[url=https://www.instagram.com/${tarray[i].substring (1)}/][b]@${tarray[i].substring (1)}[/b][/url]`);
					else if (tarray[i].indexOf("#") == 0)
						narray.push (`[url=https://www.instagram.com/explore/tags/${tarray[i].substring (1)}/][b]#${tarray[i].substring (1)}[/b][/url]`);
					else
						narray.push (tarray[i]);
				}
				text = narray.join (" ");
				var have_medias = object.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children != null;
				var owner = object.entry_data.PostPage[0].graphql.shortcode_media.owner.username;
				var full_name = formatText (object.entry_data.PostPage[0].graphql.shortcode_media.owner.full_name);
				var verified = object.entry_data.PostPage[0].graphql.shortcode_media.owner.is_verified;
				var location = object.entry_data.PostPage[0].graphql.shortcode_media.location;
				var is_video = object.entry_data.PostPage[0].graphql.shortcode_media.is_video;
				var display_url = object.entry_data.PostPage[0].graphql.shortcode_media.display_url;
				var video_url = object.entry_data.PostPage[0].graphql.shortcode_media.video_url;
				var nodes = object.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children;
				var builder = new Builder (`[citation=1,1,1][nom][url=${turi}][img]https://reho.st/preview/self/71480f75c7050d4d3b3c32787130e1a6b37064b2.png[/img] ${full_name}`);
				if (verified)
					builder.append (" [:yoann riou:9]");
				builder.append (` (${owner})`);
				if (location != null)
					builder.append (` (${location.name})`);
				builder.append (`[/url][/nom]${text}\n`);
				if (have_medias) {
					var edges = object.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges;
					for (var i = 0; i < edges.length; i++) {
						var disp_url = edges[i].node.display_url;
						var video_url = edges[i].node.video_url;
						if (edges[i].node.is_video)
							builder.append (`[url=${video_url}][img]https://reho.st/thumb/${disp_url}[/img][/url]`);
						else
							builder.append (`[url=https://reho.st/${disp_url}][img]https://reho.st/thumb/${disp_url}[/img][/url]`);
							
					}
				}
				else if (nodes != null) {
					builder.append ("\n\n");
					for (var i = 0; i < nodes.edges.length; i++)
						builder.append (`[url=https://reho.st/${nodes.edges[i].node.display_url}][img]https://reho.st/thumb/${nodes.edges[i].node.display_url}[/img][/url]`);
				}
				else if (is_video != true)
					builder.append (`\n\n[url=https://reho.st/${display_url}][img]https://reho.st/thumb/${display_url}[/img][/url]`);
				else
					builder.append (`\n\n[url=${video_url}][img]https://reho.st/thumb/${display_url}[/img][/url]`);
				builder.append ("[/citation]");
				resolve (builder.toString());
			}
		});
	}

	function instagram (area, uri) {
		var throbber = new HfrThrobber();
		throbber.display();
		var context = {
			textarea : area,
			uri : uri,
			throbber : throbber
		};
		var id = stack.add (context);
		HFR.request({
			method : "GET",
			url : uri,
			context : { id : id },
			onabort : throbber.hide,
			onerror : throbber.hide,
			ontimeout : throbber.hide,
			headers : { "Cookie" : "" },
			anonymous : true,
			onload : function (response) {
				var context = stack.getData (id);
				if (response.context != null)
					context = stack.getData (response.context.id);
				var textarea = context.textarea;
				var turi = context.uri;
				var tb = context.throbber;
				var json = response.responseText.split ("window._sharedData = ")[1];
				json = json.substring (0, 1 + json.indexOf ("};"));
				instagram_async (json, turi).then (text => {
					tb.destroy();
					insert_text_at_cursor (textarea, text);
				}).catch (err => {
					console.log (err);
					tb.destroy();
					insert_text_at_cursor (textarea, turi);
				});
			}
		});
	}

	function loadPDFFile (area, file) {
		var throbber = new HfrThrobber();
		throbber.display();
		var form = new FormData();
		form.append ("file", file, "document.pdf");
		var context = {
			textarea : area,
			throbber : throbber
		};
		var id = stack.add (context);
		HFR.request({
			method : "POST",
			data : form,
			url : "http://bzhdeveloper.alwaysdata.net/pdf-to-images.php",
			onabort : context.throbber.hide,
			onerror : context.throbber.hide,
			ontimeout : context.throbber.hide,
			context : { id : id },
			onload : function (response) {
				var context = stack.getData (id);
				if (response.context != null)
					context = stack.getData (response.context.id);
				context.throbber.destroy();
				var data = JSON.parse (response.responseText);
				console.log (data);
				if (data.succes == "oui")
					for (var i = 0; i < data.images.length; i++) {
						var data_url = data.images[i];
						process (context.textarea, dataURItoBlob (data_url));
					}
			}
		});
	}

	function loadPDF (area, uri) {
		console.log ("uri : " + uri);
		var throbber = new HfrThrobber();
		throbber.display();
		var context = {
			textarea : area,
			uri : uri,
			throbber : throbber
		};
		var id = stack.add (context);
		HFR.request({
			method : "GET",
			url : uri,
			responseType : "blob",
			context : { id : id },
			onload : function (response) {
				console.log ("taille du fichier : " + response.response.size);
				var context = stack.getData (id);
				if (response.context != null)
					context = stack.getData (response.context.id);
				context.throbber.destroy();
				loadPDFFile (context.textarea, response.response);
			}
		});
	}

	function process (area, file) {
		if (file.type == "application/pdf") {
			loadPDFFile (area, file);
			return event.preventDefault();
		}
		
		var form = new FormData();
		var options = {
			use : "rehost",
			"imgur" : {
				"form" : "image",
				"url" : "https://api.imgur.com/3/image"
			},
			"rehost" : {
				"form" : "fichier",
				"url" : "https://reho.st/upload"
			},
			"noelshack" : {
				"form": "fichier[]",
				"url" : "https://www.noelshack.com/envoi.json"
			}
		};
		
		checkRehost (options);
	  
		var host = options.use;
		if (file.size >= 2000000)
			host = "imgur";
		
		form.append (options[host].form, file);
		
		// chargement
		var throbber = new HfrThrobber();
		throbber.display();
		
		var context = {
			throbber : throbber,
			textarea : area,
			host : host
		};
		var id = stack.add (context);
		HFR.request({
			method : "POST",
			data : form,
			headers : {		
				"Authorization" : "Client-ID d1619618d2ac442"
			},
			url : options[host].url,
			onabort : throbber.hide,
			ontimeout : throbber.hide,
			onerror : throbber.hide,
			context : { id : id },
			onload : function (response) {
				var context = stack.getData (id);
				if (response.context != null)
					context = stack.getData (response.context.id);
				var tb = context.throbber;
				var textarea = context.textarea;
				tb.destroy();		
				if (context.host == "imgur") {	
					var object = JSON.parse (response.responseText);
					if (object.success) {
						var win = new HFR.Window (textarea);
						win.addImage (new HFR.Image ("Taille réelle", object.data.link, object.data.link));
						if (object.data.type != "image/gif") {
							var src = object.data.link.replace (object.data.id, object.data.id + "l");
							win.addImage (new HFR.Image ("Taille réduite", src, object.data.link));
						}
						win.display();
					}
				}
				else if (context.host == "noelshack") {
					var object = JSON.parse (response.responseText);
					if (object.erreurs == "null") {
						var win = new HFR.Window (textarea);
						win.addImage (new HFR.Image ("Image", object.chats, object.url));
						win.display();
					}
				}
				else {
					var doc = new DOMParser().parseFromString (response.responseText, "text/html");
					if (doc.querySelector ("#maincontent > img")) {
						success = true;
						var src = doc.querySelector ("#maincontent > img").getAttribute ("src");
						var link = src.replace ("/thumb/", "/");
						var win = new HFR.Window (textarea);
						win.addImage (new HFR.Image ("Taille réelle", link, link));
						if (file.type != "image/gif") {
							win.addImage (new HFR.Image ("Medium", src.replace ("/thumb/", "/medium/"), link));
							win.addImage (new HFR.Image ("Prévisualisation", src.replace ("/thumb/", "/preview/"), link));
							win.addImage (new HFR.Image ("Miniature", src, link));
						}
						win.display();
					}
				}
			}
		});
	}

	function download (area, uri) {
		var ext = uri.substring (1 + uri.lastIndexOf(".")).toLowerCase();
		var mime = "image/bmp";
		if (ext == "jpg" || ext == "jpeg")
			mime = "image/jpg";
		if (ext == "png")
			mime = "image/png";
		if (ext == "gif")
			mime = "image/gif";
		var context = {
			textarea : area,
			mime : mime
		};
		var id = stack.add (context);
		HFR.request({
			method : "GET",
			url : uri,
			responseType : "blob",
			context : { id : id },
			onload : function (response) {
				var context = stack.getData (id);
				if (response.context != null)
					context = stack.getData (response.context.id);
				process (context.textarea, response.response.slice (0, response.response.size, context.mime));
			}
		});
	}

	function drop (event) {
		event.preventDefault();
		var dt = event.dataTransfer;
		console.log (dt.types);
		if (dt.types.includes ("text/plain")) {
			var url = dt.getData ("text");
			var len = url.split ("\n").length;
			var id = parseInt (url.substring (1 + url.lastIndexOf ("/")));
			if (!isNaN (id) && len == 1 && url.indexOf ("https://twitter.com/") == 0 && url.indexOf ("/status/") > 0) {
				twitter (this, url);
				return event.preventDefault();
			}
			else if (len == 1 && url.indexOf ("https://instagram.com/p/") == 0 || url.indexOf ("https://www.instagram.com/p/") == 0) {
				instagram (this, url);
				return event.preventDefault();
			}
		}
		if (dt.types.includes ("text/uri-list")) {
			if (dt.types.includes ("text/html")) {
				var doc = new DOMParser().parseFromString (dt.getData ("text/html"), "text/html");
				var img = doc.querySelector("img");
				if (img != null) {
					var src = img.getAttribute ("src");
					if (img.getAttribute ("data-src") != null)
						src = img.getAttribute ("data-src");
					if (src.indexOf ("data:image") == 0) {
						var blob = dataURItoBlob (src);
						process (this, blob);
					}
					else
						download (this, src);
					return 0;
				}
			}
			download (this, dt.getData ("URL"));
			return 0;
		}
		this.files = dt.files;
		this.files_index = 0;
		console.log (dt.files[0].type);
		if (this.files.length > 0) {
			process (this, this.files.item (this.files_index++));
		}
		var text = dt.getData ("text");
		if (text.length < 700) {
			text = formatText (text);
			insert_text_at_cursor (this, text);
			return event.preventDefault();
		}
	}

	function pasting (event) {
		console.log (event.clipboardData.types);
		if (event.clipboardData.types.includes ("text/plain")) {
			var url = event.clipboardData.getData ("text");
			var len = url.split ("\n").length;
			var id = parseInt (url.substring (1 + url.lastIndexOf ("/")));
			if (!isNaN (id) && len == 1 && url.indexOf ("https://twitter.com/") == 0 && url.indexOf ("/status/") > 0) {
				twitter (this, url);
				return event.preventDefault();
			}
			else if (len == 1 && (url.indexOf ("https://instagram.com/p/") == 0 || url.indexOf ("https://www.instagram.com/p/") == 0)) {
				instagram (this, url);
				return event.preventDefault();
			}
			var text = event.clipboardData.getData ("text");
			if (text.length < 700) {
				text = formatText (text);
				insert_text_at_cursor (this, text);
				return event.preventDefault();
			}
		}
		else if (event.clipboardData.types.includes ("Files")) {
			var files = event.clipboardData.files;
			this.files = files;
			this.files_index = 0;
			if (files.length > 0) {
				process (this, this.files.item (this.files_index++));
				return event.preventDefault();
			}
		}
		else if (event.clipboardData.types.includes ("text/html")) {
			var doc = new DOMParser().parseFromString (event.clipboardData.getData ("text/html"), "text/html");
			var img = doc.querySelector("img");
			if (img != null) {
				var src = img.getAttribute ("src");
				if (img.getAttribute ("data-src") != null)
					src = img.getAttribute ("data-src");
				if (src.indexOf ("data:image") == 0) {
					var blob = dataURItoBlob (src);
					process (this, blob);
				}
				else
					download (this, src);
				return 0;
			}
		}
		else if (event.clipboardData.types.includes ("text/uri-list")) {
			var url = event.clipboardData.getData ("URL");
			if (url.indexOf ("https://twitter.com/") == 0 && url.indexOf ("/status/") > 0) {
				twitter (this, url);
				return event.preventDefault();
			}
			else if (url.indexOf ("https://instagram.com/p/") == 0 || url.indexOf ("https://www.instagram.com/p/") == 0) {
				instagram (this, url);
				return event.preventDefault();
			}
			else {
				download (this, url);
				return event.preventDefault();
			}
		}
	}

	function allow_drop (event) {
		event.preventDefault();
	}

	function file_send_images (event) {
		var ta = document.getElementById (event.target.getAttribute ("data-textarea"));
		if (ta == null)
			return;
		ta.files = this.files;
		ta.files_index = 0;
		if (ta.files.length > 0)
			process (ta, ta.files.item (ta.files_index++));
	}

	function add_button_to_textarea (event) {
		var num = -1;
		if (event.target.id.indexOf ("rep_editin_") == 0) {
			num = parseInt(event.target.id.split ("rep_editin_")[1]);
		}
		var file_id = "hfr-cc-file" + (num == -1 ? "" : "-" + num);
		var btn = event.target.parentElement.querySelector("input[type=\"button\"], input[type=\"submit\"]");
		if (btn.parentElement.querySelector (".hfr-cc-button"))
			return;
		var button = document.createElement ("img");
		button.setAttribute ("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEg0lEQVR42mKAgVFgYmLyxtjY+D+l2MzM7ApZDgBq/rtx48b/s2fPBhu0/uRNYjFY/fz58/9v3rwZQHo1wMiWBdE14rVtc2zbtm3btm0b0dqKs+HaCr7tX1unkq9pvZ5JclqvcAq3bjU+X9w1gZSUFAJgsGb1S8WAfFZWFmVnZxPsaPJhYGBwPz+3YbhZW1vfpEJgdXWVhoaGdkUAmdvc3BQCb7755gsMH/5cwk7Xubw/ME4ZGRmdtLKyOmxubn6Mfx9UIZCbm0s5OTl6ESibeU/kHRwcyMzMTD6bmJgctbOzO+Lm5nYuMDCQYmNjKT09nVJTUykyMpL4d2IC+1UIzM3NUV9fnxipXPpcEew9fMnV1ZVCQkIoPj6eMjIyxFlycrI4Dg8PJ39/f/Lw8LgEkeeMHFAhUFZWRsXFxUKgdP4TRXjbwIDy8vLEkZ+fHxxogAICExMT1NXVJQQKZz5SAhAAaRhWBHd3d80EGhoaqKqqSgjkTn2gBCAAHRUnzs7OZG9vTzY2NhfQdNyAh9npae6P0yiTWgI4Ae3t7UIga/xdRTAwNKTKykriY0WWlpYwDP2z3GS/8+f3+b2ZT0Q0v5syXmICJ1EytQQ6OjqosbFR38lH5eXlxBESekjbHGCZ+7QS6O7upqamJjE8+dG3inDJMRum4eFhmYS7JjAwMEBtbW1CIL5vWxEMmUBpaakQQBPrImBqaqqZQGtrK9XV1QmB6O5NRTAyNhYCxvze29uriEB+fr7mY9jT0yMEwjvWFQEESkpKJAMLCwt7I4DoLx3D4NYVRTBmx5gDyEBnZ+feCCCCwcFBIRDQtKQIJqamVFRUJBnY2NjYGwEcJ9QTBHzqFxTB1NSMCgsLJQPNzc06CfCFpZkAIri0kHjWzinCJQIcmdqFhB29wZjgIfQ9v//KU/GURgIFBQUEKCXgUTUlBKCDDFRXV19N4Hp20s+OT/j6+l6Ijo6moKAgcnFxwaWlQuBmKCKC6elprQRcC3vIwj2IR7AR3wOGvAOYEyJCBj744APRhT120MLpPo5TNTk5ifkizRoXFyf7wNUEbmc8y4o/6xi7UMIiQd7e3nLnJyQkIBrc93h2Sea/e++914zfT2BCrq2t0fz8PGaEnLC0tDToqCwkNzLuZDzCeFIdnnjiCU82ehJGYBSnBSnHluPj4wPnx6APO2+88UakhYXF0ZqaGsgJMOTQ4Ng5uSQg8LdeSysrfMCKFzGsEBGMYm5gGcU2xOQOX9VPKXwNy8itra0VOZwwLK0xMTG4ps+z/Iy+/xuOIVrUEnVFRDDKpbhUgj8vyfL1+xbfksfQeJmZmXAMOdRfokd5WOZpfdf2s9jx0Ei4/5FOGIZRW1vb02y0awfhLW7CE1hKsa4FBweTk5PTRTjnbAZBRt8SfMab7zk0HjKBpRPp5A0IRg+9+uqr914t/9JLL93CpJvQN6x7nN+xpHyD7IjALgg8wjjItT3t5eVFnp6exDv+Kfymw+j13JT/TwrYYuLAJklqNIgALZwJxLeA+DyQ3wisA4QYhjIAACqkfZkBRe3AAAAAAElFTkSuQmCC");
		button.setAttribute ("title", "Sélectionnez une image");
		button.setAttribute ("height", "20");
		button.setAttribute ("class", "hfr-cc-button");
		button.setAttribute ("style", "vertical-align : middle");
		var label = document.createElement ("label");
		label.setAttribute ("for", file_id);
		label.appendChild (button);
		var file = document.createElement ("input");
		file.setAttribute ("data-textarea", event.target.id);
		file.setAttribute ("type", "file");
		file.setAttribute ("multiple", "true");
		file.setAttribute ("accept", "image/png,image/jpeg,image/bmp,image/gif");
		file.setAttribute ("id", file_id);
		file.setAttribute ("style", "display : none");
		file.onchange = file_send_images;
		var span = document.createElement ("span");
		span.appendChild (label);
		span.appendChild (file);
		btn.parentElement.insertBefore (span, btn.nextElementSibling);
	}

	var content_form = document.querySelector("#content_form");
	if (content_form != null) {
		content_form.addEventListener('paste', pasting);
		content_form.addEventListener('drop', drop);
		content_form.addEventListener('dragover', allow_drop);
		content_form.addEventListener('focus', add_button_to_textarea);
	}

	var observer=new MutationObserver(function(mutations, observer){
		var textareas=document.querySelectorAll("textarea[id^=\"rep_editin_\"]" ); 
		if(textareas.length){
			for(var textarea of textareas) {
				textarea.removeEventListener('paste', pasting, false); 
				textarea.addEventListener('paste', pasting, false); 
				textarea.removeEventListener('drop', drop, false); 
				textarea.addEventListener('drop', drop, false); 
				textarea.removeEventListener('dragover', allow_drop, false); 
				textarea.addEventListener('dragover', allow_drop, false); 
				textarea.removeEventListener('focus', add_button_to_textarea, false);
				textarea.addEventListener('focus', add_button_to_textarea, false);
			}
		} 
	}); 
	observer.observe(document, {attributes: false, childList: true, characterData: false, subtree: true}); 

	document.querySelectorAll (".cLink").forEach (function (link) {
		if (typeof (link.getAttribute ("href")) !== "string")
			return;
		else if (link.getAttribute ("href").indexOf ("cdninstagram.com/vp/") > 0 && link.getAttribute ("href").indexOf (".mp4") > 0) {
			var video = document.createElement ("video");
			video.setAttribute ("controls", "");
			video.setAttribute ("height", "200");
			video.setAttribute ("src", link.getAttribute ("href"));
			link.parentNode.replaceChild(video, link);
		}
		else if (link.getAttribute ("href").indexOf ("https://video.twimg.com/tweet_video/") == 0) {
			var video = document.createElement ("video");
			video.setAttribute ("autoplay", "");
			video.setAttribute ("loop", "");
			video.setAttribute ("height", "200");
			video.setAttribute ("src", link.getAttribute ("href"));
			link.parentNode.replaceChild(video, link);
		}
		else if (link.getAttribute ("href").indexOf ("https://twitter.com/i/videos/tweet/") == 0) {
			var iframe = document.createElement ("iframe");
			iframe.setAttribute ("src", link.getAttribute ("href"));
			iframe.setAttribute("frameborder", "0");
			iframe.setAttribute("allowfullscreen", "");
			iframe.setAttribute("webkitAllowFullScreen", "");
			iframe.setAttribute("mozallowfullscreen", "");
			link.parentNode.replaceChild(iframe, link);
		}
	});

	var obs=new MutationObserver(function (mutations, observer) {
		document.querySelectorAll ("img").forEach (function (img) {
			if (img.getAttribute ("src").indexOf ("https://abs.twimg.com/hashflags/") == 0) {
				img.setAttribute ("width", "24");
				img.setAttribute ("height", "24");
			}
		});
		
		document.querySelectorAll (".cLink").forEach (function (link) {
			if (typeof (link.getAttribute ("href")) !== "string")
				return;
			else if (link.getAttribute ("href").indexOf ("cdninstagram.com/vp/") > 0 && link.getAttribute ("href").indexOf (".mp4") > 0) {
				var video = document.createElement ("video");
				video.setAttribute ("controls", "");
				video.setAttribute ("height", "200");
				video.setAttribute ("src", link.getAttribute ("href"));
				link.parentNode.replaceChild(video, link);
			}
			else if (link.getAttribute ("href").indexOf ("https://video.twimg.com/tweet_video/") == 0) {
				var video = document.createElement ("video");
				video.setAttribute ("autoplay", "");
				video.setAttribute ("loop", "");
				video.setAttribute ("height", "200");
				video.setAttribute ("src", link.getAttribute ("href"));
				link.parentNode.replaceChild(video, link);
			}
			else if (link.getAttribute ("href").indexOf ("https://twitter.com/i/videos/tweet/") == 0) {
				var iframe = document.createElement ("iframe");
				iframe.setAttribute ("src", link.getAttribute ("href"));
				iframe.setAttribute("frameborder", "0");
				iframe.setAttribute("allowfullscreen", "");
				iframe.setAttribute("webkitAllowFullScreen", "");
				iframe.setAttribute("mozallowfullscreen", "");
				link.parentNode.replaceChild(iframe, link);
			}
			else if (link.getAttribute ("href").indexOf ("https://t.co") == 0 && HFR.getValue ("hfr-copie-colle-preview") == "oui") {
				var context = { link : link };
				var id = stack.add (context);
				HFR.request({
					method : "GET",
					url : link.href,
					context : { id : id },
					onload : function (response) {
						console.log (response.responseText);
						var context = stack.getData (id);
						if (response.context != null)
							context = stack.getData (response.context.id);
						var doc = new DOMParser().parseFromString (response.responseText, "text/html");
						context.link.href = doc.querySelector ("[http-equiv='refresh']").getAttribute ("content").split ("URL=")[1].split (";")[0];
						console.log (context.link.href);
					}
				});
			}
		});
	}); 
	obs.observe(document, {attributes: false, childList: true, characterData: false, subtree: true});
})();
