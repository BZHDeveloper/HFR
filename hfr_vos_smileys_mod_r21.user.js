// ==UserScript==
// @name          [HFR] vos smileys favoris mod_r21 (VM)
// @version       2.3.0
// @namespace     fred.82.free.fr
// @description   Permet d'afficher une liste illimitée de smileys favoris personnels, ainsi que des statistiques sur leur utilisation (historique et les plus utilisés). Documentation : http://fred.82.free.fr/hfr_greasemonkey/VSF/
// @icon          https://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @author        roger21
// @authororig    fred82
// @modifications basé sur la version 1.4.0 - correction de bugs, amélioration du fonctionnement et du design, nettoyage du code, compatibilité ff 30+ / gm 2+ et ajout de fonctionnalités
// @modtype       modifications et évolutions
// @homepageURL   http://roger21.free.fr/hfr/
// @downloadURL   https://gitlab.com/BZHDeveloper/HFR/raw/master/hfr_vos_smileys_mod_r21.user.js
// @updateURL     https://gitlab.com/BZHDeveloper/HFR/raw/master/hfr_vos_smileys_mod_r21.user.js
// @noframes
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @grant         unsafeWindow
// ==/UserScript==

/*

Copyright © 2010-2011, 2014-2017, 2019 fred.82@free.fr, roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// modifications roger21 $Rev: 872 $

// historique :
// 2.3.0 (10/05/2019) :
// - correction du tri des smileys pour les onglets Top et Historique par frankie_flowers
// - ajout d'une option dans les paramètres pour trier les favoris par code de smiley au lieu de par top
// - correction du filtrage des quotes dans le comptage des stats
// - suppression du code relatif aux stickers...
// - check du code dans tm et corrections diverses
// - passage (ou retour) de le remarque en rouge sur l'onglet des paramètres
// - nouveau nom : [HFR] vos smileys favoris mod_r21 -> [HFR] Vos smileys favoris mod_r21
// - ajout de l'avis de licence AGPL v3+ *si Fred82 est d'accord*
// - modification de la metadata @author (roger21)
// - ajout de la metadata @authororig (fred82)
// - maj de la metadata @homepageURL
// - réécriture de la metadata @modtype
// - suppression des @grant inutiles
// 2.2.3 (28/11/2017) :
// - passage au https
// 2.2.2 (08/10/2017) :
// - ajout du nom de la version de base dans la metadata @modifications
// 2.2.1 (11/02/2017) :
// - correction du style font-fammily à Verdana,Arial,Sans-serif,Helvetica (HFR Style)
// 2.2.0 (09/12/2016) :
// - suppression de code mort sur la gestion des fenêtres
// - remise en place de la gestion de la touche echap pour quitter les fenêtres
// - légères modificatons sur la configuration de l'icône "favori"
// - mise à jour d'une image (gif vers png + mieux)
// - compression des images (pngoptimizer)
// 2.1.2 (29/01/2016) :
// - correction du nom du script dans le menu greasemonkey
// 2.1.1 (27/01/2016) :
// - correction de la requete xpath de recherche des smileys pour la fenetre d'ajout des favoris ->
// plus stricte, ne détecte que les smileys (avec l'url hfr) -- problème signalé par heeks
// 2.1.0 (22/11/2015) :
// - nouveau nom : [HFR] Vos smileys favoris 2.0.0 mod_r21 -> [HFR] vos smileys favoris mod_r21
// 2.0.0 (21/11/2015) :
// - modification de la description de modifications
// - nouveau numéro de version : 1.4.0.7 -> 2.0.0
// - nouveau nom : [HFR] Vos smileys favoris 1.4.0 mod r21 -> [HFR] Vos smileys favoris 2.0.0 mod_r21
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.4.0.7 (17/10/2015) :
// - suppression des quotes autour du nom du script quand on l'affiche
// - uniformisation des orthographes : smilies -> smileys
// - modification des tournures "les smileys" -> "vos smileys"
// 1.4.0.6 (07/03/2015) :
// - modification du mode d'affichage des fenetres de conf et d'ajout de favoris pour éviter le redimensionnement ->
// de la page en enlevant la scrollbar
// - transformation des boutons de suppression des favoris par des images (plus joli, plus leger)
// - ajout des zeros dans la date affichée pour les favoris
// 1.4.0.5 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.4.0.4 (09/11/2014) :
// - ajout de l'url vers la documentation de fred82 dans la description
// 1.4.0.3 (14/09/14) :
// - correction de la position du "+" des stickers avec l'affichage des onglets en réponse/édition normale
// - correction de l'affichage des onglets quand les stickers sont activés en réponse/édition normale
// 1.4.0.2 (07/09/2014) :
// - ajout d'une emphase sur la nécéssité de recharger la page pour appliquer les nouveaux paramètres
// - rajout de getLineBreak qui redevient utile
// - suppression de l'ombre sur l'icone toolbox
// - ajout d'un parmetre pour la position du panneau des favoris en réponse rapide
// 1.4.0.1 (31/08/2014) :
// - nouvelle gestion de la sauvegarde avec un nom de fichier et une extension (.json) et avec date et heure et ->
// sans ouverture de nouvel onglet
// - réécriture du message de signalement des nouveaux smileys trouvés
// - suppression du setTimeout 0 dans ReloadIconFavWorld et remplacement de l'event "paste" par un event "input"
// - remplacement des ' par des " autour des strings et remplacement des " par des \" dans les ->
// xpath query, les query selector et les strings (pasque !)
// - modification du reset de l'icône de marquage en favoris dans la fenêtre de configuration, il n'est plus ->
// sauvegardé automatiquement, il doit être validé (comme les autres champs de la fenêtre de configuration)
// - suppression des @infomsg (osef)
// - ajout d'un filtre sur la detection des smileys dans les message pour ne pas détecter le smiley ":/" dans les urls
// - "robustesseisation" de la fonction reloadUserConfig en cas d'accès concurentiel assynchrone (cas du premier lancement)
// - "correction" de config en configuration et perso en personnel dans les commentaires
// - reduction de la taille et positionnement en bas du bouton "gérer vos smiley" sur la réponse rapide
// - reformulation des tooltip sur les boutons favori
// - ajout d'une gestion de "premier lancement" pour proposer l'import et la masquage des smileys favoris et personnels ->
// du forum
// - ajout de la gestion de l'import des smileys favoris et personnels du forum (au premier lancement et via un lien ->
// dans l'onglet "vos smileys")
// - suppression du @require sur editPost.js et ajout des deux fonctions nécéssaire dans le script à la place
// - ajustement de la hauteur max du contenu des onglets à 3 rangées de smileys
// - refresh complet des onglets top, histo et fav à chaque changement le nécéssitant
// - mise à jour du panneau des favoris en réponse rapide en cas de reset ou de chargement d'une sauvagarde
// - mise à jour de smileyStats en cas de reset ou de chargement d'une sauvagarde ->
// en vu d'un reload des panneaux et onglets à la place du reload de la page
// - restylage / réorganisation / homogénéisation / renommage / commentage des constantes et variables globales du script
// - réordonnancement/homogénéisation des parametres width et height (partout)
// - ajout d'une gestion de mémorisation du resize du panneau des favoris (en partie d'après la 1.4.6)
// - ajout d'un effet mouse over distinct sur les smileys du panneau des favoris (mais identique à celui des smileys)
// - homogénéisation des messages de confirmation d'import et de reset et du lien de reset
// - restylage du code de certains blocs if et if / else if
// - ajout de cesures dans le code par endroits
// - clarification et ajout de commentaires par endroits
// - nettoyage d'un paramètre non utilisé sur la fonction putSmiley
// - suppression des reload et demande de reload de page sur les restauration de sauvegarde et reinitialisation de stats ->
// en vu d'un reload des panneaux et onglets à la place
// - rajout des "_" sur les prefix key_prefix_fav, key_prefix_fav_img et key_prefix_smiley_img
// - nettoyage de la variable sm_favmsg_icon non utilisée
// - ajout d'une gestion parametrable de non affichage des espaces autour des smileys insérés
// - ajout d'une gestion parametrable de masquage des smileys favoris et personnels du forum dans l'interface de postage ->
// (inspiré et d'après la 1.4.6)
// - réordonnancement/homogénéisation des blocs de variable "sn_" dans le code
// - ajout d'un effet mouse over sur le bouton étoile (identique à celui des smileys mais ils se cumulent)
// - suppression de la methode contains des tableaux, non utilisée
// - suppression de la fonction getLineBreak plus utilisée (getLineBreakBlankLine only)
// - reconstruction systématique de l'onglet "Vos smileys" lors de son affichage pour refleter les changements de stats ->
// en cas d'edition rapide et pour refleter l'ajout/suppression de favoris dans les onglet top et histo en réponse rapide
// - simplification de la fonction de comptage des occurences des smileys et correction du comptage des smileys multicasses
// - ajout d'une gestion pour fixer la position des fenêtres de conf et de fav malgrés la variation de leur tailles
// - suppression de la hauteur fixe sur les fenêtres de conf et de fav (avec un maxheight pour la fav)
// - restylage de la fenêtre d'ajout de favoris depuis un post
// - homogénéisation du label d'ouverture de la fenêtre de conf avec l'action en réponse normale
// - suppression de la clickabilité/sélectionabilité des smiley en fenêtre de conf
// - réaffichage automatique du "aucun" en cas de suppression totale des smileys d'un onglets
// - correction du probleme de gestion des smileys depuis la fenêtre de configuration en réponse normal ->
// (suppression/ajout/fav x2)
// - choix de l'onglet à l'ouverture de la fenêtre de conf fixé suivant l'origine (params ou smileys uniquement)
// - ajout d'un hack sur le panneau des favoris pour conserver le padding bottom en cas d'averflow
// - restylage du panneau des favoris de la réponse rapide (avec resize css, non mémorisé)
// - commentaires plus détaillés sur les parametres de dimmension des fenêtres (user accessible ?)
// - réorganisation de la fonction AddSmileyToPanel
// - ajout d'un effet mouse over sur les smileys (simplifié à l'extreme parceque rien trouvé de beau)
// - correction de la marge de droite (absente) du dernier onglet
// - léger compactage de l'affichage des smileys dans les onglets
// - centrage horizontale du bouton favori sous les smileys
// - centrage vertical de la stat des smileys top et histo
// - correction de la gestion du tooltip sur la fenêtre de choix des favoris
// - clarification du nom des variables "message" dans ValidateFunction
// - remplacement du curseur texte par le curseur fleche sur les stats des smileys top et histo (inspiré par la 1.4.6)
// - ajout de la limite de taille + scrollbar sur les onglets en réponse normale (et en fenêtre de conf) (d'après la 1.4.6)
// - gestion des smileys de base multicasses :o / :O, :p / :P, et :d / :D
// - prise en compte des [citation][/citation] pour la non recherche de smileys dans les posts
// - ajout de la gestion du smileys de base ":/" et correction de la gestion des smileys de base ":'(" et :??:
// - suppression de l'ombre sur l'image coeur
// - suppression des espaces non-sémantiques dans les chaines de css
// - modifications mineures du code par endroits (!= -> !==, null -> undefined, ...)
// - homogénéisations mineures du code par endroits (ma_var -> maVar, ...)
// - modifications mineures des commentaires par endroits
// - léger restyllage et homogénéisation du style des onglets
// - restylage/réorganisation/relabelisation de la fenêtre de configuration
// - restylage du "aucun" sur les onglets des smileys
// - homogénéisation du message des onglets top et histo sur la fenêtre de configuration
// - renomage des fastReply en fastEdit (erreur sémantique)
// - ajout d'une metadata @infomsg sur la qualité du code (enfin je devrait :o)
// - utilisation du nouveau SDK pour unsafeWindow ou contournement
// - suppression du code mort autour et dans ValidateFunction
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// - untabify
// - suppression des // en double
// - homogénéisation du format des commentaires /* */
// - suppression du commentaire sur la récupération des smileys favoris dans about:config (discontinued)
// - ajout d'une metadata @infomsg pour la conservation des smileys favoris du script original
// - remplacement de l'utilisation de BlobBuilder (discontinued) par Blob pour la sauvegarde
// - correction de la "syntax error" (?) sur les GM_addStyle par compactage du css sur une ligne
// - ajout d'une metadata @infomsg pour la modification du nom
// - ajout de "1.4.0 mod r21" dans le nom pour le distinguer expressément
// - changement du namesapce de http://forum.hardware.fr à fred.82.free.fr
// - indentation des metadata
// - ajout de metadata pour la publication (@author, @modifications, @modtype)
// - ajout d'une icone au script
// - ajout des metadata @grant
// - ajout d'un .1 sur le numero de version
// - suppression du module d'auto-update (code mort)
// - désactivation de l'auto-update pour conserver les modifs

// Création : 15/09/2010
// Dernière MAJ : 10/12/2011
// Auteur : Fred82

/*
  Chaque smiley est mémorisé sous une forme déterminée dont voici un exemple (format "Json") :
  ":love:":{"c":":love:","s":2,"d":"2011/11/22 8:53:10","fav":true}

  c : code du smiley en format entier (string). ex : [:toto:1].
  s : nombre d'utilisations (entier).
  d : date de dernière utilisation (string) ex: 2011/10/5 21:52:33.
  fav : indique le status favoris (bool).
*/

// =============================================================== //
// Constantes et variables et globales
// =============================================================== //

/**********************************************************************************
 *                             /!\ ATTENTION /!\                                  *
 *                                                                                *
 * Redéfinition "temporaire" de exportFunction, n'existant pas sous ViolentMonkey *
 **********************************************************************************/

if (typeof (exportFunction) === "undefined") {
	exportFunction = (func, scope, options) => {
		if (options && options.defineAs) {
			scope[options.defineAs] = func;
		}
		return func;
	};
}

// Réglages utilisateur (modifiables dans la fenêtre de configuration).
// Les valeurs indiquées ci-dessous sont les valeurs par défaut.
var sm_count = 10; // Nombre maximal de smileys affichés sur le panneau
var sm_confirm_delete = true; // Confirmer la suppression de smileys
var sm_include_fav = true; // Inclure les favoris dans les panneaux "Top" et "Historique"
var sm_sort_fav = false; // Trier les favoris par code ou lieu de top
var sm_fast_reply = true; // Afficher le panneau de smileys à côté de la réponse rapide
var sm_fast_reply_position = 0; // Position du panneau des smileys à côté de la réponse rapide
var sm_notify_new = false; // Être notifié quand un nouveau smiley est trouvé dans votre nouveau message
var sm_hide_forum_smileys = false; // Masquer les smileys favoris et personnels du forum
var sm_no_space_insert = false; // Insérer les smileys sans espaces autour
var sm_fav_world = true; // Permettre de définir des favoris sur toutes les pages du forum
var sm_fav_world_icon = null; // Icône affichée à côté de chaque message pour afficher ses smileys
var sm_current_tab = "tab_top"; // Onglet affiché par défaut / dernier onglet affiché
var sm_fav_panel_width = "496px"; // Largeur du panneau des favoris en réponse rapide (defaut : 496px)
var sm_fav_panel_height = "162px"; // Hauteur du panneau des favoris en réponse rapide (defaut : 162px -> 3 rangées)
//var sm_fav_panel_height = "135px"; // Hauteur du panneau des favoris en réponse rapide (defaut : 135px -> 2,5 rangées)
//var sm_fav_panel_height = "108px"; // Hauteur du panneau des favoris en réponse rapide (defaut : 108px -> 2 rangées)
// Premier lancement du script pour proposer l'import et le masquage des smileys favoris et personnels du forum
var sm_first_start = true;

// Réglages système
// Hauteur max du contenu des onglets (defaut : 200px -> 3 rangées)
var panel_max_height = "216px";
// Largeur de la fenêtre de conf (defaut : 720px)
var config_window_width = "720px";
// Largeur de la fenêtre de choix des favoris (défaut : 343px -> 4,5 smileys)
var favorite_window_width = "343px";
// Hauteur max du contenu de le fenêtre de choix des favoris (défaut : 179px -> 2,5 rangées)
var favorite_window_content_max_height = "179px";

// Variables de stockage temporaire
var root = null; // Elément HTML correspondant à la racine du panneau d'édition d'un message sur la page HFR
var smileyStats = {}; // Conteneur des statistiques de smiley (format Json)
var initialText = null; // Stockage du post HFR initial
var resizeTimer = null; // Timer pour l'enregistrement des dimensions du panneau des favoris
var fileReader = null; // Fichier pour la restauration d'une sauvegarde
var staticImgMarginTop = 0 // Marge fixe pour la position du bouton de configuration en réponse rapide

// Clés des variables utilisateur. "sm" pour "smiley".
var key_sm_count = "sm_count";
var key_sm_confirm_delete = "sm_confirm_delete";
var key_sm_include_fav = "sm_include_fav";
var key_sm_sort_fav = "sm_sort_fav";
var key_sm_fast_reply = "sm_fast_reply";
var key_sm_fast_reply_position = "sm_fast_reply_position";
var key_sm_notify_new = "sm_notify_new";
var key_sm_hide_forum_smileys = "sm_hide_forum_smileys";
var key_sm_no_space_insert = "sm_no_space_insert";
var key_sm_fav_world = "sm_fav_world";
var key_sm_fav_world_icon = "sm_fav_world_icon";
var key_sm_current_tab = "sm_current_tab";
var key_sm_fav_panel_width = "sm_fav_panel_width";
var key_sm_fav_panel_height = "sm_fav_panel_height";
var key_sm_first_start = "sm_first_start";
var key_sm_smiley_stats = "sm_smiley_stats";

// Clés des objets HTML
var key_smiley_panel = "vsf_smiley_panel"; // id du panneau des onglets en réponse normale
var key_favorite_panel = "vsf_favorite_panel"; // id du panneau des favoris en réponse rapide
// id du bouton d'accès à la fenêtre de configuration en réponse rapide
var key_favorite_panel_img = "vsf_favorite_panel_img";
var key_config_window_content = "vsf_config_window_content"; // id du contenu de la fenêtre de configuration
var key_favorite_window_content = "vsf_favorite_window_content"; // id du contenu de le fenêtre de choix des favoris

var key_tab_top = "tab_top"; // id de l'onglet top
var key_tab_history = "tab_history"; // id de l'onglet historique
var key_tab_favorite = "tab_favorite"; // id de l'onglet favoris
var key_tab_top_content = "tab_top_content"; // id du contenu de l'onglet top
var key_tab_history_content = "tab_history_content"; // id du contenu de l'onglet historique
var key_tab_favorite_content = "tab_favorite_content"; // id du contenu de l'onglet favoris

var key_tab_parameters = "tab_parameters"; // id de l'onglet parametres (dans la fenêtre de conf)
var key_tab_yoursmileys = "tab_yoursmileys"; // id de l'onglet vos smileys (dans la fenêtre de conf)
var key_tab_yoursmileys_content = "tab_yoursmileys_content"; // id du contenu de l'onglet vos smileys

// id de l'icone de marquage des smileys en favoris dans l'onglet des parametres
var key_fav_world_icon_preview = "fav_world_icon_preview";

var key_prefix_top = "top_"; // prefix pour l'id des smileys dans l'onglet top
var key_prefix_hist = "hist_"; // prefix pour l'id des smileys dans l'onglet historique
var key_prefix_fav = "fav_"; // prefix pour l'id des smileys dans l'onglet favoris
var key_prefix_favwin = "favwin_"; // prefix pour l'id des smileys dans la fenêtre de choix des favoris

// prefix pour l'id des boutons favoris (l'étoile)
var key_prefix_fav_img = "fav_img_";
// prefix pour l'id des images des smileys (dans la fenêtre de choix des favoris)
var key_prefix_smiley_img = "smiley_img_";

// Constantes
var key_window_config = "window_config";
var key_window_favorite = "window_favorite";

var index_tab_parameters = 0; // Indice de l'onglet "Paramètres" dans le système d'onglets de la fenêtre de configuration
var index_tab_yoursmileys = 2; // Indice de l'onglet "Vos smileys" dans le système d'onglets de la fenêtre de configuration

var image_general_url = "https://forum-images.hardware.fr/icones/"; // Url pour les smileys de base généraux (:o)
var image_base_url = "https://forum-images.hardware.fr/icones/smilies/"; // Url pour les smileys de base (:ouch:)
var image_utilisateur_url = "https://forum-images.hardware.fr/images/perso/"; // Url pour les smileys utilisateur

// Textes
var script_name = "[HFR] Vos smileys favoris";
var tab_top_title = "Top";
var tab_history_title = "Historique";
var tab_favorite_title = "Favoris";

// Images incorporées
var icon_fav_active = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAC5UlEQVR42t2U3UtTYRzHB0JXXeXUzWxzp8kkZ0RSUfRCiRc5N8sUSgwqQ7wwKQN7sawgKAwqo4JQnG7O2Va%2BDpfLxVIqLOsgZRCB0UV%2FQSAEg2%2FfxzNRQ7YD7qoHPjwv5%2Fv8vr%2Fn7Wg0KgtC2jqMatsRTE3TJLsgoN2JES3mGU51Jd9gQBtAxAz8Ogi2o%2BjXWpIX3JdWQIAfNoWhDWDfmTwDb3ofBk3AN1sMrqI3PQpfhnn1wXsy8uFOB2YY%2BHOxwle2fVyFN8O5im3RG%2BDV7YZbF8ZTZj%2FNoJ%2BKFaZLgC%2Fsd%2Bui6NUVURt%2FJXBnbodL34LuTD88mVOsoxwDOvXAs1zgox34wKCTNgXRljk2YAW6qOmm1jPPDNshxnqCDv1xDGWlKAaDhjl0GAA%2FJ4zuYpYOcgiYKmVAtt8x2JuSRd7albH3DkUjUyuzDu%2Bh6VYmxtvWkwUEjDWKgd84C%2F9GYIITInalXmCcvLYrRGIs9Mcdy7Xi2ysmMFHIZI0CW%2Bwgs03kJ7x0jjCTEIUvyZhDHUIbijG2n9lnC%2BqWn0OXZCDf0cmVhMv4YmkU5NJfJCBYGtOK%2BgDPRBLUrHzYbWYdmUErb80gJw%2BR4cPxETqBZy84V1Ad%2F0Y9zknDbUnGvQKgjwH6y%2BLznBo%2Fs282Rjn3hLo3cM1kQyMPyXeEkxMgNLe2gHq%2F%2Bkd2wdSA8zyo3nK%2B1hg9%2F%2BBdwoN9QEO2rN6gQXLi6mbuawXgJq7yRZb2RVtourhV56Q%2FuGFZo86gXprEHWbVySDOGN6jvI7VvIYnue9V%2FFahjAuNi%2B163p6LOfmJg1%2B2pKBW%2Bo1HPLg2kR0DBxj47g7g%2BibB3Hw9QiMvjdorFF0tDc6aKxMbXMkzoy6H2R3jLToFPOTDac4ThEkBWUfuExpxGwOn%2BS%2Bi0Rn%2BsxpzWxIbNFmLCDPjCxV1k1UWYyvo1pN2EsXNbUBrodD2JTa4ZF1LgkQmlSr0FuIhs8Sm%2BS%2FLX4noOGmhaGeEAAAAAElFTkSuQmCC";

var icon_fav_inactive = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACX0lEQVR42t2UT2saURTFhUBXXRUChUKgIGSVVaBQ6DYrv0GgUChklVU%2FRlbdCpERMaIMRhditTKIIqJQGRAqohhRREQREUUsCq%2FnPHzDlGoc6Kw68MPnm3P%2FvHfvHY%2FH4VMsFm8LhcJ9Pp8%2F9bj9wOl7IIhhGCHXA%2BRyuZRpmmKz2Qist%2BDcNefZbPYSiPV6LcFVCfzXXAuQyWQeS6WSWC6XFtjbIojXDecX6XRaLBYLMZ%2FPJVyjDgyi%2FcudnyHDD3BusLB0PJ1OJSrI7hRX0HqPZfkOju7wq8PgBw2BYOblclnMZjPpeDKZSFSQarUqNdSyRuAn1t%2Bx50%2BlUh9RqxPV3yuKKpWKaDab1lXYHY%2FHYwt7IGrU9bXbbVGr1dhlEtTtRvX4EzuDxqPR6A9nam8f%2B3TD4VD0%2B32xmxmfDICCvQU9TKkUDQYDCcVOUHrS6XRkA4Dbv4oK2jwagzALu%2BEhqFPwinbXc3NooF6zUMlkUvR6PYndwT6UjlO%2BK%2FTnZzsKHXAaj8dNZtLtdi0Hh6CGmYfD4S1sPzmagUgk4gsGg%2FI%2B6eA5qEFLCuh1x0MWCoW%2BaJomjRXM0o79HT8j0JuOA0Cs4ZosZ61Wy8L%2BX73n7MDkl67rLxwFCAQCVfYxDRW8DjWA7B4GUO%2B4hg3rcHHUeTQaPfH7%2FQt2RaPRkBlyYtnbPBVY8Zd7LDI1BDY8xfXRADiml9nQMaeT3yLsEQNcglfgK1glEgkZiKdjU6A57pwEuKLDer2uHJvc26N7A%2B7BVn0UsX48GiAWi70E34AJrh3oz8EDeAI%2Bz3%2F5%2FAZTjtmr3wx5SwAAAABJRU5ErkJggg%3D%3D";

var icon_del = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs%2B9AAABhklEQVQY0wXBT0iTcRjA8e%2Fz%2FN537%2FvamjVa7lSUhUbsEiQRQf%2BoQ3gL6hSskA5Bt%2FQSXTz0%2F2xBl7okZR6EqEgiAvFgCAW1SPLPlGluilubZsv29PmQe37SAUw2u75Swv%2F%2BeXt7R2ve3I27K8GTzoObf8RTF78kU8e4NtTrAGa9qL9GaFVhfrDzdOvibt23rMGrCtiMyABX3g7JARt3b1KZPX%2FAKoLVnI6VHTMVxJZ8ffb4fHYb514Umi58uxMArBOzNYdVBVsiqFd8yY2dOpra%2Fy6nPBg%2F67%2B%2FetkBTGzhUx3sl9Cogk3HwiMA2Q8PHY8u%2FfQApoOwpwYbNaGxBraAtwrQvbwjlh0eUd04cV8Wo3TX1r%2F12%2F8UJyAIjYiwafYmLQPJUYt3jChTiebjZbAavq2KFuckdq%2BM%2FK56NArivmLmBruGPQoufLkuWMkxlffjhwAWktGZkmq96HS072l3lJlfUT6md%2B3Ma9A%2Fp24vQC6f8TFzk4lN6ddtbS2HbUKvF2%2Fpf4cUlw8oMuVkAAAAAElFTkSuQmCC";

var icon_cancel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACEklEQVR42q1S%2FU9SYRhlbW13%2FQ0V5Woub05zfZkCXhUhpmmb8v3h5ZKoCQjcwVBi1Q%2B19Zf0d2lWxpeR3AuX93J8qGVjgK2tZ3u3d3t2znmecx6D4R%2BrsS5dGdiEnDXS4weCQ2Fe9QUSdafH3B%2Bc3UM7k4OeSPWQNIIi3xAjaG5u48fz1Y%2B1peU7PWAU3qBNT0%2FKaG3tnJOogXWe1NGKJYB8AZ3%2Fic2RqMxaL%2F0iSGe4dlLW23uvgPcfoOfyHQI0RYlX%2FSGe1KHtxAHqqyERJwtPWUWYv9w1oh5PcuxlnOlyFnj7DiydQSMcAalD244Buf2f%2F6rVTuA5rq9JregW15Q2WCu2S%2Bu8BvYLBMwD2RxUfxDVeRurzMxyF8cUFDnFG9CRo3V8QcDtA%2BQMqnMLetkicH%2FNWfH4O1EBlAacHmDVBeymaG87ipPT%2FMVgt49XvH5okSiQkgmYBuK0DhmorrlQMVnwdXyiP0nd5eUVjw%2BatAFQjIrbCzKLlabN%2BunSChDdRP3ZCor3H%2BJoeKSbhC6LJ3Vo4RekmoRCo5NZrDRl5oqPJrnjiQesZrUBYQmndgeOR8dweGPoDwldllB3uqGJEpQ1N8gsVnpiOjfsy%2Bg493nkLvtuEaA4FvFt7B4OrhmFrinosoTa4jLK5hmdzOpx%2B%2Bj2MPdp6BbrC%2F5dZZNFKD6eGhjVofEmd3D1umD4n3UGltFKFDkd60gAAAAASUVORK5CYII%3D";

var icon_validate = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACl0lEQVR42q2T60uTYRiH%2FTv2bnttAwlkRCGChFD7FCQSm2ZDMQ%2FL0nRnj7TNGDbTooychzFSSssstdqc8zB1anNrSpm47FVCzH3pQLVhdLBfzztoJlifvOEHz4fnuu7nGBe311XgOyLMnTmsz%2FakMBljB8OSEVFY4kpkJM5Efbp9v%2FC%2FcJ43VSrzJId0HhluBy3oW%2BmKpnOpGSWuExD30iFxDy3dFSZdpZkTSZHr80Y41%2Fphe3UDpvnKaNixY60PjbNVOGTjRZJtvJ2SHE%2BKINOdtMHC7MSaQBkq%2FCXQzJ6DjqScpNp3HvY3D3B5ugIiC3dDdJMriAlk7iSDajwr2pmFWVDlPQPFTCEU0wVQTxfCvT4Ig1cJB5Hk9hxDwjWuISbIGBExncFmWINNqPAVQ%2FlUTsB8KKdIPPmYeOsCW6HIOtpeNMI234j4ei4TExy3J2w%2BWr2L2oAGWm8RWckAlj4uQDVZiPH1oSj8c%2BsH2p5fgWGyGH3BTvCN1GZMIH5Ib%2FavdMPoV6HWr8Xnb5%2Bi0Iev72KwZa4ealc29O6z6A92gF%2Fzt6CHZm4tNKF98Sp0U3KYfdWIfP8Shbd%2BbcHy7BLKnFnQEEFLoA7tXjPoKmp7C6l3%2BAb5QBrsq%2FdRPSmH2n0adTPlWH6%2FiLa5BpQOnoTCcQo6Zw7sr7uRbj0KupLaPsRkK09wgFyN2aPBY%2BYeKkfzoB3OgWpIBqWDDQtn48lyF4xDxeCrORu0mhLseAuJTVxpfAMVMbnL4CCS1oAZ%2BtEiXBiWo5VswU5gvbMIvFJOhMC7v8Z9DVwpbaJCkg4x2v1m9L60onfBCovXhLSWVPAVnBCt%2Bgf8p%2BiLXCFtoPR0DcXwtZwwX8UJk44MiZ4upYR7%2Fnt%2FA%2Bw9sdKFchsrAAAAAElFTkSuQmCC";

var icon_toolbox = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAD70lEQVR42r1Vf1CTdRx%2BB0iAHsmPbbANGN0S2dlBENZxaVYkFeDM658IT9SjiMGUEQXHjd%2BEXUrHEpZDL9pElnUsx0aTQuIQjFNPxgIE7K6NEcG4CW3CWtw9vdjplTIG6vW5e%2F94v9%2Fn%2FTzv8%2Fk%2Bn8%2BXIB4yMt%2FlU%2B48TkFlJaW7ent6sTUmdsdakgtyDhfKZDKjXC6DXCZXfS6RhiwL3MPj7Z2fv4Xh69cRv%2FXZVFeJ%2Ff382MJDwuMjJN5g%2BBU9F7txStpgkzXK%2FJyrKC45MTc3B0XzVzgurvVxQZBisVhgmTGjs%2BMH7E%2Ff17e0XiEqpgoPC5ucfnggba9wanIS36k10KrVns5w2VkC%2FuLiIhwOBwb1OohrjqH6o2qOpE4CqURiWFF%2BOJWabDIaoVIq4QzzYX5BBciw2WwYHRlGk7wJJ6UnodcPorS0ROjy8J4OD91pMhpIkpZlSSrLyk5brVaUl1aAdA%2BM4yYM6PRoVan3k%2B9vrcoh0WxmvMlggPKbrx337omKP8PV3isYGh5DRdVRTJstME1MQpibf3BNHudnvJO1pER5VmG%2BuxjbZfJNH8InjRehbVOhqOxIh6i4vPbIxzVHH6iR8gWCtJmpCUwVFlnKkwUTujAWPNJvgHh1AEk8Qd6qS7JSiDdFvrdot2O26Uv0hTMwGB4GIqbjReJRBf%2BlopumPbvwe042pt7Pw2B0FB5ZclrBkPW5gAS0MBi4GsnBH6SzxpOTcI7JQCOd7vNQyV%2BoHrhJxKtAvDaCD3g16GKxoAmiY7qgAGaRCM3BwZDS6acfKHnKsWs279e1IJ7qRITYDtoXDrzCTlzfHhyc%2BS2pxtbeDkt9PRrodFQFBKCBFhi4%2Bj8v6vnNP6UNBKcF7OoFRNfNg9jdl3RnXx4UZFaSJAv9%2FZhTKHCCRkPlPyQxrhss78KwP%2B88CHYz6IWz2Na4gHVvdkvuxZH1RyeHAzs5Ua2attskS0rOcUOcK4nMvqChp14CwTqDjZkTSGiyw3ff5WWHl5hK3X0mKAiXuFzYR0dh1Z6%2FTbJUsu6XufdfPk8K%2Bqu2fzqLkIwboB4wYMcpO5hZQyvasZZKfVvDZOLyli34c2wMVlUryPLhLHn4%2F7Vialdg2CEDvNLGf9pcecuQ0uxAaP4M3N7Qx7lsQio1tyc0FANRUVjQ6WCpq8e1mFj8vDM%2B8S7Ia3MuLZCcL88o%2FrLwf1kEPWcaFL%2Fn41ZriowNG1K%2FJ5VciYiAg7xPrK3q%2B5WvZyQ%2BEX6wF5z0H%2BHtH7ft33sbfQj3x33d3VciCXNzY2lJEmNCArZ7enKd4SLILJu8CGLNHbqO4ubhQaF4u1MojxH%2FZ%2FwNeMgFpABqKTEAAAAASUVORK5CYII%3D";

var icon_scan_smileys = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAABcklEQVR42mNgGDTghost4y1THb87Ztor71rpz7xlpmMKk7tlrmd810pvBlBuxS1jbf8bDpZMGAZcszOdf8VY%2Ff9FbaX%2FF7UU%2F18xUvt%2F09cl5pa%2Fe9QVQzWw2CVtoDhQzTUbo0Uoms%2FZmged1lH6f1xR%2Bv9xJShWkPp%2FxkDtIwiD2HBxoBqQ2nPWJqFwAw5qKXbuV5H5v09ZGhUrQTGaOEjtAU2FbrgBu%2FQ0qrcqSP7fBlRMDAap3aWrVgc3YLeLvdk6ecn%2F64DOIwavBard5WhrhRIOa031Fy%2BRFfu%2FTFEKLwapWWOkswwjFnbFRQovUFe8MUdO4v9cYKBhwyC5BRpKt3bGRohiTQt74qKUpipIvZ0iJ%2Fl%2FirwUGpb8P1Ve6vWe2AgVvAlqlpmhxnQV%2BXsTgBp6oHgC0PbpqvIPphloqxGVKl3FRfhL5CS3dgM1gnCJrOR2L2kJAZKSNlCDvLewwHIgXgFik5U%2FQBrJ1kwsAAC8lOiuvmntngAAAABJRU5ErkJggg%3D%3D";

// Liste des smileys HFR de base
var base_smileys = [":whistle:", ":wahoo:", ":vomi:", ":sweat:", ":sum:", ":spookie:", ":spamafote:", ":sol:", ":sleep:", ":sarcastic:", ":pt1cable:", ":pouah:", ":pfff:", ":ouimaitre:", ":ouch:", ":non:", ":na:", ":mouais:", ":mmmfff:", ":miam:", ":mad:", ":love:", ":lol:", ":kaola:", ":jap:", ":int:", ":hot:", ":hello:", ":heink:", ":hebe:", ":hap:", ":gun:", ":gratgrat:", ":fuck:", ":fouyaya:", ":foudtag:", ":fou:", ":evil:", ":eek2:", ":eek:", ":dtc:", ":cry:", ":crazy:", ":calimero:", ":bug:", ":bounce:", ":bic:", ":benetton:", ":ange:", ":24:", ":)", ":(", ":o", ":D", ";)", ":p", ":'(", ":??:", ":/"];

// =============================================================== //
// Traitement des smileys
// =============================================================== //

/*
  Obtient la liste des smileys contenus dans le message HFR

  Input : message à analyser (string)

  Output : liste des smileys trouvés.
  Pour obtenir le nombre de smileys : .length
  pour obtenir chacun d'entre eux. : .[0] .[1]  (etc...)
*/
function GetSmileysList(message) {
  // 1) Smileys utilisateur => de la forme [:toto] ou [:toto:1]
  var regExp1 = /\[:[\w\s-@:]+\]/g;
  var smileysList1 = message.match(regExp1);
  // Suppression des smileys utilisateur du message
  message = message.replace(regExp1, "");

  // 2) Smileys de base => de la forme :toto:
  var smileysList2 = null;
  // Suppression des https?:// pour eviter une fausse détection du smiley ":/"
  message = message.replace(/https?:\/\//gi, "");
  // Remplacement des smileys de base à code multicasse
  message = message.replace(/:O/g, ":o").replace(/:P/g, ":p").replace(/:d/g, ":D");
  base_smileys.forEach(function(pattern) {
    pattern = ParseSpecialCharFromSmileyCode(pattern);
    var regExp = new RegExp(pattern, "g");
    var smileysList = message.match(regExp);
    if(smileysList != null) {
      if(smileysList2 === null) {
        smileysList2 = smileysList;
      } else {
        smileysList2 = smileysList2.concat(smileysList);
      }
      // Suppression des smileys de base du message
      message = message.replace(regExp, "");
    }
  });

  // 3) Résultat
  if(smileysList2 === null) {
    return smileysList1;
  } else if(smileysList1 === null) {
    return smileysList2;
  } else {
    return smileysList1.concat(smileysList2);
  }
}

/*
  Obtient les statistiques de smileys à partir de la configuration GreaseMonkey, si existante.
*/
function LoadSmileyStats(forceRefresh) {
  if(forceRefresh || isEmptyObject(smileyStats)) {
    var smileyStatsString = GM_getValue(key_sm_smiley_stats, "");
    if(smileyStatsString !== undefined && smileyStatsString !== "") {
      // Convertit la string en objet Json
      smileyStats = BuildJsonObjectFromString(smileyStatsString);
    } else {
      smileyStats = {};
    }
  }
}

/*
  Convertit le code entier d'un smiley en code réduit

  Ne fonctionne que pour les smileys utilisateurs
  exemple :
  full_code : [:xxx]
  tiny_code : xxx ou xxx:1
*/
function ConvertFullCodeToTinyCode(full_code) {
  var tiny_code = null;

  if(IsBaseSmiley(full_code)) {
    // Smiley de base
    tiny_code = ConvertBaseSmileyCodeToString(full_code);
  } else {
    // Smiley utilisateur
    tiny_code = full_code.substring(2, full_code.length - 1);
  }

  return tiny_code;
}

/*
  Supprime ce smiley du dictionnaire des statistiques
*/
function RemoveSmileyStat() {
  var full_code = this.alt;
  var smiley_tiny_code = ConvertFullCodeToTinyCode(full_code); // Tiny code

  if(sm_confirm_delete) {
    if(confirm("Etes-vous sûr de vouloir supprimer le smiley " + full_code + " ?") == false) {
      return;
    }
  }

  delete smileyStats[full_code];

  saveUserStats(); // Sauve et recharge les stats triées et recharge le panneau des favoris de la réponse rapide

  // Mise à jour complete de l'onglet top
  RefreshTab_FromUI(sortSmileysByStat(smileyStats), key_tab_top, key_tab_top_content, key_prefix_top);
  // Mise à jour complete de l'onglet historique
  RefreshTab_FromUI(sortSmileysByHistory(smileyStats), key_tab_history, key_tab_history_content, key_prefix_hist);
  // Suppression du smiley dans l'onglet favoris
  RemoveSmileyStat_FromUI(smiley_tiny_code, key_prefix_fav);
}

/*
  Rafraichi completement le contenu d'un onglet de smileys

  smileyArray : tableau des smileys ordonné en fonction de l'onglet
  key_tab : id de l'onglet
  key_tab_content : id du contenu de l'onglet
  key_prefix : prefix pour l'id des smileys
*/
function RefreshTab_FromUI(smileyArray, key_tab, key_tab_content, key_prefix) {
  // Raffraichi l'onglet correspondant dans la réponse normale et dans la fenêtre de conf
  for(var id_context of [key_smiley_panel, key_tab_yoursmileys]) {
    var context = null;
    var smileys_table = null;
    var clickable = (id_context === key_smiley_panel);
    context = document.getElementById(id_context);
    if(context !== null) {
      smileys_table = context.querySelector("div[id=\"" + key_tab_content + "\"]");
      if(smileys_table !== null) {
        rebuildSmileyTabContent(smileyArray, key_tab, smileys_table, key_prefix, clickable);
      }
    }
  }
}

/*
  Enlève un smiley

  smiley_tiny_code : code du smiley en format "tiny"
  key : code du panneau où enlever ce smiley
*/
function RemoveSmileyStat_FromUI(smiley_tiny_code, key) {
  // Supprime un smiley de l'onglet correspondant dans la réponse normale et dans la fenêtre de conf
  for(var id_context of [key_smiley_panel, key_tab_yoursmileys]) {
    var context = null;
    var smiley = null;
    var container = null;
    context = document.getElementById(id_context);
    if(context !== null) {
      smiley = context.querySelector("li[id=\"" + key + smiley_tiny_code + "\"]");
      if(smiley !== null) {
        container = smiley.parentNode;
        container.removeChild(smiley);
      }
    }
    if(container !== null && !container.hasChildNodes()) {
      displayAucun(container);
    }
  }
}

/*
  Changer le status favoris du smiley
*/
function ChangeFavoriteStatus() {
  var full_code = this.alt;
  var smiley_tiny_code = ConvertFullCodeToTinyCode(full_code); // Tiny code
  var smiley = smileyStats[full_code];
  var favorite_img_src = null;

  if(smiley != null && smiley.fav == true) {
    // Ce smiley ne fait plus partie des favoris
    smiley.fav = false;
    favorite_img_src = icon_fav_inactive;
    saveUserStats(); // Sauve et recharge les stats triées et recharge le panneau des favoris de la réponse rapide
    // Suppression du smiley dans l'onglet favoris
    RemoveSmileyStat_FromUI(smiley_tiny_code, key_prefix_fav);
  } else {
    // Ce smiley devient un favori
    if(smiley == null) {
      smiley = CreateSmileyDefaultObject(full_code);
      smileyStats[full_code] = smiley;
    }
    smiley.fav = true;
    favorite_img_src = icon_fav_active;
    saveUserStats(); // Sauve et recharge les stats triées et recharge le panneau des favoris de la réponse rapide
    // Mise à jour complete de l'onglet favoris
    RefreshTab_FromUI(sortSmileysByName(smileyStats), key_tab_favorite, key_tab_favorite_content, key_prefix_fav);
  }

  if(!sm_include_fav) {
    // Mise à jour complete de l'onglet top
    RefreshTab_FromUI(sortSmileysByStat(smileyStats), key_tab_top, key_tab_top_content, key_prefix_top);
    // Mise à jour complete de l'onglet historique
    RefreshTab_FromUI(sortSmileysByHistory(smileyStats), key_tab_history, key_tab_history_content, key_prefix_hist);
  } else {
    // Mise à jour du smiley dans l'onglet top
    ChangeFavoriteStatus_InUI(smiley, favorite_img_src, key_prefix_top);
    // Mise à jour du smiley dans l'onglet historique
    ChangeFavoriteStatus_InUI(smiley, favorite_img_src, key_prefix_hist);
  }

  // Mise à jour du smiley dans la fenêtre de choix des favoris
  ChangeFavoriteStatus_InUI(smiley, favorite_img_src, key_prefix_favwin);
}

/*
  Changer le status favoris du smiley dans le panneau indiqué par la key
*/
function ChangeFavoriteStatus_InUI(smiley, favorite_img_src, key) {
  var tiny_code = ConvertFullCodeToTinyCode(smiley.c);
  var favorite_img = null;

  // gestion de la fenêtre de choix des favoris
  if(key === key_prefix_favwin) {
    // change le tooltip de l'étoile et l'image de l'etoile dans la fenêtre de choix des favoris
    favorite_img = document.getElementById(key + key_prefix_fav_img + tiny_code);
    if(favorite_img != null) {
      favorite_img.src = favorite_img_src;
      favorite_img.title = GetFavoriteTooltip(smiley);
    }
    // change le tooltip du smiley dans la fenêtre de choix des favoris
    var favorite_smiley = document.getElementById(key + key_prefix_smiley_img + tiny_code);
    if(favorite_smiley != null) {
      favorite_smiley.title = GetFavoriteTooltip(smiley);
    }
  }

  // gestion de l'onglets correspondant dans la réponse normale et dans la fenêtre de conf
  for(var id_context of [key_smiley_panel, key_tab_yoursmileys]) {
    var context = null;
    favorite_img = null;
    context = document.getElementById(id_context);
    if(context !== null) {
      favorite_img = context.querySelector("img[id=\"" + key + key_prefix_fav_img + tiny_code + "\"]");
      if(favorite_img !== null) {
        // change le tooltip de l'étoile et l'image de l'etoile dans l'onglet correspondant
        favorite_img.src = favorite_img_src;
        favorite_img.title = GetFavoriteTooltip(favorite_img);
      }
    }
  }
}

/*
  Ajouter un favori au panneau
*/
function AddFavoriteToPanel(smiley_full_code) {
  var smiley = smileyStats[smiley_full_code];

  for(var id_context of [key_smiley_panel, key_tab_yoursmileys]) {
    var context = null;
    context = document.getElementById(id_context);
    if(context !== null) {
      var smileys_table = context.querySelector("div[id=\"" + key_tab_favorite_content + "\"]");
      if(smileys_table !== null) {
        var favorite_panel = smileys_table.parentNode;

        if(favorite_panel.childNodes.length == 4) {
          favorite_panel.removeChild(favorite_panel.childNodes[3]);
          favorite_panel.removeChild(favorite_panel.childNodes[2]);
          favorite_panel.removeChild(favorite_panel.childNodes[1]);
        }

        if(id_context === key_smiley_panel) { // reponse normale -> clickable
          AddSmileyToPanel(smiley, key_tab_favorite, smileys_table, 0, key_prefix_fav, true);
        } else if(id_context === key_tab_yoursmileys) { // fenêtre de conf -> non clickable
          AddSmileyToPanel(smiley, key_tab_favorite, smileys_table, 0, key_prefix_fav, false);
        }
      }
    }
  }
}

/*
  Convertit le tableau associatif (objet) des stats des smileys en un
  tableau normal et trié par stat décroissante pour l'onglet Top
*/
function sortSmileysByStat(o) {
  // Conversion en array
  var a = Object.values(o);

  // Tri par stat décroissante
  a.sort(function(x, y) {
    return y.s - x.s;
  });

  return a;
}

/*
  Convertit le tableau associatif (objet) des stats des smileys en un
  tableau normal et trié par date décroissante pour l'onglet Historique
*/
function sortSmileysByHistory(o) {
  // Conversion en array
  var a = Object.values(o);

  // Tri par date décroissante
  a.sort(function(x, y) {
    return new Date(y.d) - new Date(x.d);
  });

  return a;
}

/*
  Convertit le tableau associatif (objet) des stats des smileys en un
  tableau normal et trié par code de smiley pour l'onglet et le panneau des Favoris
*/
function sortSmileysByName(o) {
  // Tri par stat décroissante par défaut
  if(!sm_sort_fav) {
    return sortSmileysByStat(o);
  }

  // Conversion en array
  var a = Object.values(o);

  // Tri par code de smiley
  a.sort(function(x, y) {
    return (x.c > y.c) ? 1 : ((x.c < y.c) ? -1 : 0);
  });

  return a;
}

/*
  Retire les citations en code BB du message HFR
*/
function RemoveBBQuotes(msg) {
  return msg.replace(/\[quotemsg[\s\S]*?\[\/quotemsg\]/g, "").replace(/\[citation[\s\S]*?\[\/citation\]/g, "");
}

/*
  Construit une liste de smileys avec leur nombre d'occurence associé.

  En sortie, la liste contient chaque smiley de façon unique
*/
function BuildSmileyListFromMessage(msg) {
  var smileysListExt = {};

  if(msg != null) {

    // Suppression des blocs de citation
    msg = RemoveBBQuotes(msg);

    // Récupération de la liste complète des smileys présents dans le message
    var smileysList = GetSmileysList(msg);

    if(smileysList != null) {

      // Comptage des occurences
      for(var i = 0; i < smileysList.length; ++i) {
        var smiley_full_code = smileysList[i];
        if(!smileysListExt[smiley_full_code]) {
          smileysListExt[smiley_full_code] = {};
          smileysListExt[smiley_full_code].code = smiley_full_code;
          smileysListExt[smiley_full_code].count = 1;
        } else {
          smileysListExt[smiley_full_code].count += 1;
        }
      }

    }

  }

  return smileysListExt;
}

/*
  Fonctions du forum pour l'insertion de smiley dans un post
*/
function countInstances(open, closed) {
  var opening = document.hop.content_form.value.split(open);
  var closing = document.hop.content_form.value.split(closed);
  return opening.length + closing.length - 2;
}

function TAinsert(text1, text2) {
  var ta = document.getElementById("content_form");
  if(document.selection) {
    var str = document.selection.createRange().text;
    ta.focus();
    var sel = document.selection.createRange();
    if(text2 != "") {
      if(str == "") {
        var instances = countInstances(text1, text2);
        if(instances % 2 != 0) {
          sel.text = sel.text + text2;
        } else {
          sel.text = sel.text + text1;
        }
      } else {
        sel.text = text1 + sel.text + text2;
      }
    } else {
      sel.text = sel.text + text1;
    }
  } else if(ta.selectionStart || ta.selectionStart == 0) {
    if(ta.selectionEnd > ta.value.length) {
      ta.selectionEnd = ta.value.length;
    }
    var firstPos = ta.selectionStart;
    var secondPos = ta.selectionEnd + text1.length;
    var contenuScrollTop = ta.scrollTop;
    ta.value = ta.value.slice(0, firstPos) + text1 + ta.value.slice(firstPos);
    ta.value = ta.value.slice(0, secondPos) + text2 + ta.value.slice(secondPos);
    ta.selectionStart = firstPos + text1.length;
    ta.selectionEnd = secondPos;
    ta.focus();
    ta.scrollTop = contenuScrollTop;
  } else {
    var sel2 = document.hop.content_form;
    var instances2 = countInstances(text1, text2);
    if(instances2 % 2 != 0 && text2 != "") {
      sel2.value = sel2.value + text2;
    } else {
      sel2.value = sel2.value + text1;
    }
  }
}

/*
  Insère un smiley dans le post via TAinsert
*/
function putSmiley(tt) {
  if(sm_no_space_insert) {
    TAinsert(tt, "");
  } else {
    TAinsert(" " + tt + " ", "");
  }
}

/*
  Protège les caractères spéciaux éventuellement présents dans la chaine de caractère du code de smiley,
  dans le but d'être utilisé dans une RegEx
*/
function ParseSpecialCharFromSmileyCode(smiley_code) {
  return smiley_code.replace("[", "\\[").replace(")", "\\)").replace("(", "\\(").replace("?", "\\?", "g");
}

/*
  Détermine si c'est un smiley de base ou un smiley utilisateur
*/
function IsBaseSmiley(smiley_code) {
  return smiley_code.indexOf("[") == -1;
}

/*
  Convertit le code d'un smiley de base en chaine de caractères HFR
*/
function ConvertBaseSmileyCodeToString(smiley_code) {
  var hfr_string = null;

  switch (smiley_code) {
    case ":)":
      hfr_string = "smile";
      break;
    case ":(":
      hfr_string = "frown";
      break;
    case ":D":
      hfr_string = "biggrin";
      break;
    case ";)":
      hfr_string = "wink";
      break;
    case ":o":
      hfr_string = "redface";
      break;
    case ":??:":
      hfr_string = "confused";
      break;
    case ":p":
      hfr_string = "tongue";
      break;
    case ":'(":
      hfr_string = "ohill";
      break;
    case ":/":
      hfr_string = "ohwell";
      break;
    default:
      hfr_string = smiley_code.substring(1, smiley_code.length - 1);
      break;
  }

  return hfr_string;
}

/*
  Obtient l'adresse internet de l'image correspondant au smiley de base dont le code est fourni.
*/
function GetUrlForBaseSmiley(smiley_code) {
  var url = null;
  var hfr_string = ConvertBaseSmileyCodeToString(smiley_code);

  switch (smiley_code) {
    case ":)":
    case ":(":
    case ":D":
    case ";)":
    case ":o":
    case ":??:":
    case ":p":
    case ":'(":
    case ":/":
      url = image_general_url + hfr_string;
      break;
    default:
      url = image_base_url + hfr_string;
      break;
  }

  url = url + ".gif";

  return url;
}

/*
  Création d'un objet smiley
*/
function CreateSmileyObject(full_code, count, date) {
  var smiley = {};
  smiley.c = full_code;
  smiley.s = count;
  smiley.d = date;

  return smiley;
}

/*
  Création d'un objet smiley, avec un compteur à 1 et une date à celle de maintenant
*/
function CreateSmileyDefaultObject(full_code) {
  return CreateSmileyObject(full_code, 1, GetCurrentFormatedDate());
}

// =============================================================== //
// Outils génériques
// =============================================================== //

/*
  Obtenir un élément HTML à partir de son XPath

  Exemples de documentation XPath :
  http://fr.wikipedia.org/wiki/XPath
*/
var getElementByXpath = function(path, element) {
  var arr = Array();
  var xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  var item = xpr.iterateNext();
  while(item) {
    arr.push(item);
    item = xpr.iterateNext();
  }
  return arr;
};

/*
  Construit un objet JSON à partir d'une string
*/
function BuildJsonObjectFromString(JSON_string) {
  var JSON_object = JSON.parse(JSON_string);
  return JSON_object;
}

/*
  Construit une string à partir d'un format JSON
*/
function BuildJsonString(JSON_object) {
  var JSON_string = JSON.stringify(JSON_object);
  return JSON_string;
}

// Génère une string représentant la date et l'heure à partir de la date fournie, en format destiné à l'affichage
function getDateTimeStringForDisplay(dateString) {
  var d = new Date(dateString);
  var y = d.getFullYear() + "";
  var m = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1) + "";
  var a = d.getDate() < 10 ? "0" + d.getDate() : d.getDate() + "";
  var h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours() + "";
  var i = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes() + "";
  return y + "/" + m + "/" + a + " à " + h + ":" + i;
}

// Génère une string représentant la date et l'heure à partir de la date fournie
function getDateTimeString(dateString) {
  var d = new Date(dateString);
  return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " +
    d.getHours() + ":" + d.getMinutes().toString() + ":" + d.getSeconds().toString();
}

// Génère une string représentant la date et l'heure, en format destiné à la sauvegarde
function getDateTimeStringForSave() {
  var d = new Date();
  var y = d.getFullYear() + "";
  //var y = (d.getFullYear() + "").substring(2);
  var m = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1) + "";
  var a = d.getDate() < 10 ? "0" + d.getDate() : d.getDate() + "";
  var h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours() + "";
  var i = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes() + "";
  var s = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds() + "";
  return y + m + a + "_" + h + i + s;
}

/*
  Obtient la date courante, formatée pour le script
*/
function GetCurrentFormatedDate() {
  return getDateTimeString(new Date().toString());
}

// Fin de ligne
function getLineBreak() {
  return document.createElement('br');
}

// Fin de ligne et ligne vide
function getLineBreakBlankLine() {
  return document.createElement("p");
}

/*
  Obtient la boîte d'édition de message
*/
function GetMessageEditingBox() {
  return document.getElementById("content_form");
}

/*
  Compter le nombre d'occurences du pattern donné
*/
String.prototype.count = function(pattern) {
  return (this.length - this.replace(new RegExp(pattern, "g"), "").length) / pattern.length;
};

/*
  Teste si l'objet est vide, objet Json notamment. Basé sur l'implémentation "isEmptyObject" de JQuery.
*/
function isEmptyObject(obj) {
  for(var name in obj) {
    return false;
  }
  return true;
}

/*
  Filtre le tableau en éliminant les doublons.

  Exemple : array.getUnique());
*/
Array.prototype.getUnique = function(fieldNameCompare) {
  var sMatchedItems = "";
  var foundCounter = 0;
  var newArray = [];

  for(var i = 0; i < this.length; ++i) {
    var item = eval("this[i]." + fieldNameCompare);
    var match = "|" + item.toLowerCase() + "|";

    if(sMatchedItems.indexOf(match) == -1) {
      sMatchedItems += match;
      newArray[foundCounter++] = item;
    }
  }

  return newArray;
};

// =============================================================== //
// Outils d'enregistrement, backup et reset
// =============================================================== //

/*
  Enregistrement des statistiques de smiley
*/
function saveUserStats() {
  // Construction de la string Json
  var JSON_string = BuildJsonString(smileyStats);
  saveUserStatsFromJsonString(JSON_string);
  // Force la relecture des stats pour avoir la version triée
  LoadSmileyStats(true);
  // Mise à jour du panneau des favoris en reponse rapide si une fenêtre (conf ou favoris) est ouverte
  if(cmScript.isOpened) {
    ReloadSmileysFullPanel();
  }
}

/*
  Enregistrement des statistiques de smiley, à partir de la string JSON
*/
function saveUserStatsFromJsonString(JSON_string) {
  // Mise à jour de la configuration GreaseMonkey
  GM_setValue(key_sm_smiley_stats, JSON_string);
}

/*
  Charge la configuration utilisateur
*/
function loadUserConfig() {
  sm_count = GM_getValue(key_sm_count, sm_count);
  sm_confirm_delete = GM_getValue(key_sm_confirm_delete, sm_confirm_delete);
  sm_include_fav = GM_getValue(key_sm_include_fav, sm_include_fav);
  sm_sort_fav = GM_getValue(key_sm_sort_fav, sm_sort_fav);
  sm_fast_reply = GM_getValue(key_sm_fast_reply, sm_fast_reply);
  sm_fast_reply_position = GM_getValue(key_sm_fast_reply_position, sm_fast_reply_position);
  sm_notify_new = GM_getValue(key_sm_notify_new, sm_notify_new);
  sm_hide_forum_smileys = GM_getValue(key_sm_hide_forum_smileys, sm_hide_forum_smileys);
  sm_no_space_insert = GM_getValue(key_sm_no_space_insert, sm_no_space_insert);
  sm_fav_world = GM_getValue(key_sm_fav_world, sm_fav_world);
  sm_fav_world_icon = GM_getValue(key_sm_fav_world_icon, icon_scan_smileys);
  sm_current_tab = GM_getValue(key_sm_current_tab, sm_current_tab);
  sm_fav_panel_width = GM_getValue(key_sm_fav_panel_width, sm_fav_panel_width);
  sm_fav_panel_height = GM_getValue(key_sm_fav_panel_height, sm_fav_panel_height);
  sm_first_start = GM_getValue(key_sm_first_start, sm_first_start);
}

/*
  Recharge les réglages enregistrés précédemment
*/
function reloadUserConfig() {
  loadUserConfig();
  if(document.getElementById(key_sm_count)) {
    document.getElementById(key_sm_count).value = sm_count;
  }
  if(document.getElementById(key_sm_confirm_delete)) {
    document.getElementById(key_sm_confirm_delete).checked = sm_confirm_delete;
  }
  if(document.getElementById(key_sm_include_fav)) {
    document.getElementById(key_sm_include_fav).checked = sm_include_fav;
  }
  if(document.getElementById(key_sm_sort_fav)) {
    document.getElementById(key_sm_sort_fav).checked = sm_sort_fav;
  }
  if(document.getElementById(key_sm_fast_reply)) {
    document.getElementById(key_sm_fast_reply).checked = sm_fast_reply;
  }
  for(var i = 0; i < 4; ++i) {
    if(i === sm_fast_reply_position) {
      if(document.getElementById(key_sm_fast_reply_position + "_" + i)) {
        document.getElementById(key_sm_fast_reply_position + "_" + i).checked = true;
      }
    }
  }
  if(document.getElementById(key_sm_notify_new)) {
    document.getElementById(key_sm_notify_new).checked = sm_notify_new;
  }
  if(document.getElementById(key_sm_hide_forum_smileys)) {
    document.getElementById(key_sm_hide_forum_smileys).checked = sm_hide_forum_smileys;
  }
  if(document.getElementById(key_sm_no_space_insert)) {
    document.getElementById(key_sm_no_space_insert).checked = sm_no_space_insert;
  }
  if(document.getElementById(key_sm_fav_world)) {
    document.getElementById(key_sm_fav_world).checked = sm_fav_world;
  }
  if(document.getElementById(key_sm_fav_world_icon)) {
    document.getElementById(key_sm_fav_world_icon).value = sm_fav_world_icon;
  }
  if(document.getElementById(key_fav_world_icon_preview)) {
    document.getElementById(key_fav_world_icon_preview).src = sm_fav_world_icon;
  }
}

/*
  Importe les smileys favoris et personnels du forums dans "vos smileys favoris"
*/
function ImportFavPersoForum(firstStart) {
  // Requête Ajax
  var request = new XMLHttpRequest();

  // Traitement de la reponse de la requête Ajax
  request.addEventListener("load", function(e) {
    // Recupération de la page de gestion des images du forum sous la form d'un DOM document object
    var answer = e.target.responseXML;

    // La table contenant les smileys favoris et personnels
    var table = answer.querySelector("div#mesdiscussions form table.main");

    var imgs = new Array;
    var img = null;
    var code = null;
    var smiley = null;

    // Récupération du code des smileys favoris
    var favsCpt = 0;
    var favs = table.rows[3].querySelectorAll("img[src^=\"" + image_utilisateur_url + "\"]");
    for(img of favs) {
      code = img.getAttribute("alt");
      imgs.push(code);
      ++favsCpt;
    }

    // Récupération du code des smileys personnels
    var persosCpt = 0;
    var persos = table.rows[2].querySelectorAll("img[src^=\"" + image_utilisateur_url + "\"]");
    for(img of persos) {
      code = "[:" + img.getAttribute("alt") + "]";
      imgs.push(code);
      ++persosCpt;
    }

    // Import des smileys et sauvegarde
    LoadSmileyStats();
    for(code of imgs) {
      smiley = smileyStats[code];
      if(smiley === undefined) {
        // Ajout de ce smiley dans la liste
        smiley = CreateSmileyDefaultObject(code);
        smileyStats[code] = smiley;
      }
      // Marquage en favoris
      smiley.fav = true;
    }
    saveUserStats();

    // Mise à jour du panneau des favoris en reponse rapide
    ReloadSmileysFullPanel();
    // Mise à jour complete de l'onglet top
    RefreshTab_FromUI(sortSmileysByStat(smileyStats), key_tab_top, key_tab_top_content, key_prefix_top);
    // Mise à jour complete de l'onglet historique
    RefreshTab_FromUI(sortSmileysByHistory(smileyStats), key_tab_history, key_tab_history_content, key_prefix_hist);
    // Mise à jour complete de l'onglet favoris
    RefreshTab_FromUI(sortSmileysByName(smileyStats), key_tab_favorite, key_tab_favorite_content, key_prefix_fav);

    // Message d'information avec le nombre des smileys importés
    var favsSmileyTxt = "smiley favori";
    if(favsCpt > 1) {
      favsSmileyTxt = "smileys favoris";
    }
    var persosSmileyTxt = "smiley personnel";
    if(persosCpt > 1) {
      persosSmileyTxt = "smileys personnels";
    }
    var importeTxt = "du forum ont été importés";
    if(favsCpt + persosCpt === 0) {
      importeTxt = "du forum n'a été importé";
    }
    if(favsCpt + persosCpt === 1) {
      importeTxt = "du forum a été importé";
    }
    alert(favsCpt + " " + favsSmileyTxt + " et " + persosCpt + " " + persosSmileyTxt +
      importeTxt + " dans vos favoris.");

    // En cas de premier lancement, propose aussi le masquage du bloc des smileys favoris et personnels du forum
    if(firstStart !== undefined && firstStart === true) {
      if(confirm("Souhaitez-vous masquer le bloc des smileys favoris et personnels du forum ?") == true) {
        sm_hide_forum_smileys = true;
        GM_setValue(key_sm_hide_forum_smileys, sm_hide_forum_smileys);
      } else {
        sm_hide_forum_smileys = false;
        GM_setValue(key_sm_hide_forum_smileys, sm_hide_forum_smileys);
      }
      reloadUserConfig();
    }

  }, false);

  // construction et appel de la requête Ajax
  request.open("GET", "https://forum.hardware.fr/user/editprofil.php?config=hfr.inc&page=5");
  request.responseType = "document";
  request.send();
}

/*
  Supprimer toutes les statistiques de smileys
*/
function ResetAllStats() {
  if(confirm("Cette réinitialisation va effacer toutes vos données actuelles de smiley, voulez-vous continuer ?") ==
    true) {
    GM_setValue(key_sm_smiley_stats, ""); // Suppression des stats
    LoadSmileyStats(true);
    // Mise à jour du panneau des favoris en reponse rapide
    ReloadSmileysFullPanel();
    // Mise à jour complete de l'onglet top
    RefreshTab_FromUI(sortSmileysByStat(smileyStats), key_tab_top, key_tab_top_content, key_prefix_top);
    // Mise à jour complete de l'onglet historique
    RefreshTab_FromUI(sortSmileysByHistory(smileyStats), key_tab_history, key_tab_history_content, key_prefix_hist);
    // Mise à jour complete de l'onglet favoris
    RefreshTab_FromUI(sortSmileysByName(smileyStats), key_tab_favorite, key_tab_favorite_content, key_prefix_fav);
    alert("Vos données de smileys ont été réinitialisées.");
  }
}

/*
  Réinitialise l'icône placée à côté de chaque message.
*/
function ResetIconFavWorld() {
  // Rafraichissement inputBox
  document.getElementById(key_sm_fav_world_icon).value = icon_scan_smileys;
  // Rafraichissement icône
  document.getElementById(key_fav_world_icon_preview).src = icon_scan_smileys;
}

/*
  Rechargement de l'icône associée à chaque message, affichée pour exemple.
*/
function ReloadIconFavWorld() {
  // Rafraichissement de l'icône
  document.getElementById(key_fav_world_icon_preview).src = document.getElementById(key_sm_fav_world_icon).value;
}

/*
  Construire un fichier de backup des statistiques de smiley
*/
function DoBackupFile() {
  LoadSmileyStats();
  var blob = new Blob([BuildJsonString(smileyStats)], {
    type: "application/json"
  });
  var url = window.URL.createObjectURL(blob);
  var fakeLink = document.createElement("a");
  fakeLink.style.display = "none";
  fakeLink.setAttribute("href", url);
  fakeLink.setAttribute("download", "hfr_vos_smileys_favoris_" + getDateTimeStringForSave() + ".json");
  document.body.appendChild(fakeLink);
  var fakeClick = document.createEvent("MouseEvents");
  fakeClick.initMouseEvent("click", true, false, null, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  fakeLink.dispatchEvent(fakeClick);
  // pas de revokeObjectURL sinon ça marche pas :o (mais osef, il meurt à la fermeture de la page)
}

/*
  Charge un fichier de backup des statistiques de smiley
*/
function LoadBackupFile(evt) {
  var file = evt.target.files[0];
  fileReader = new FileReader();
  fileReader.addEventListener("loadend", readBackupFile, false);
  fileReader.readAsText(file);
}

/*
  Lit le fichier de backup
*/
function readBackupFile() {
  var JSON_string = fileReader.result;
  if(!CheckFormatBackupFile(JSON_string)) {
    alert("Format du fichier non reconnu.");
  } else if(confirm("Cet import va écraser toutes vos données actuelles de smiley, voulez-vous continuer ?") == true) {
    saveUserStatsFromJsonString(JSON_string);
    LoadSmileyStats(true);
    // Mise à jour du panneau des favoris en reponse rapide
    ReloadSmileysFullPanel();
    // Mise à jour complete de l'onglet top
    RefreshTab_FromUI(sortSmileysByStat(smileyStats), key_tab_top, key_tab_top_content, key_prefix_top);
    // Mise à jour complete de l'onglet historique
    RefreshTab_FromUI(sortSmileysByHistory(smileyStats), key_tab_history, key_tab_history_content, key_prefix_hist);
    // Mise à jour complete de l'onglet favoris
    RefreshTab_FromUI(sortSmileysByName(smileyStats), key_tab_favorite, key_tab_favorite_content, key_prefix_fav);
    alert("Vos données de smileys ont été mises à jour.");
  }
}

/*
  Vérification du format de fichier de backup
*/
function CheckFormatBackupFile(JSON_string) {
  try {
    var jsonObj = BuildJsonObjectFromString(JSON_string);
    return true;
  } catch (err) {
    return false;
  }
}

// =============================================================== //
// Modifications de l'interface HFR
// =============================================================== //

/*
  Point d'entrée du script Greasemonkey
*/
function Main() {
  // Chargement de la configuration utilisateur
  loadUserConfig();

  // Premier lancement
  if(sm_first_start) {
    if(confirm("Souhaitez-vous importer vos smileys favoris et personnels du forum dans " + script_name + " ?") ==
      true) {
      ImportFavPersoForum(sm_first_start);
    }
    sm_first_start = false;
    GM_setValue(key_sm_first_start, sm_first_start);
  }

  // Préparation de la fenêtre de configuration
  cmScript.setUp();
  cmScript.createConfigMenu();

  // Obtient l'élément HTML racine de la page HFR
  root = document.getElementById("mesdiscussions");

  var current_url = document.URL;

  // Switch suivant la page affichée
  if(current_url.match("https://forum.hardware.fr/message.php*") ||
    current_url.match("https://forum.hardware.fr/hfr/.*/nouveau_sujet.htm") ||
    current_url.match("https://forum.hardware.fr/hfr/.*/nouveau_sondage.htm") ||
    current_url.match("https://forum.hardware.fr/hfr/.*/repondre.*")) {
    // Page édition de message
    HandleEditingMessagePage();
  } else {
    // Autres pages, notamment les pages de topic, contenant un "fast answer".
    HandleTopicPage();
  }

  // Initialisation du système d'onglets du panneau des smileys
  InitTabSystem_ForFullAnswer();
}

/*
  Traitement des pages de topic. Change l'action du bouton "Valider votre message".
*/
function HandleTopicPage() {
  var textarea = GetMessageEditingBox();

  if(textarea == null) {
    // Il n'y a pas de "fast answer" sur cette page
  } else {
    // Pages de topic

    // Mémorisation de la fonction HFR "edit_in", qui est appelée quand l'utilisateur clique sur l'icône "fast edit".
    var fred82vsf_function_old_edit_in = unsafeWindow.edit_in;
    exportFunction(fred82vsf_function_old_edit_in, unsafeWindow, {
      defineAs: "fred82vsf_function_old_edit_in"
    });

   unsafeWindow.fred82vsf_object_fastEditDict = {};

    LoadSmileyStats();

    ChangeFastAnswerValidationButtonAction();

    if(sm_fast_reply) {
      ShowFavoriteSmileysPanel(true);
    }

    if(sm_fav_world) {
      AddScanSmileysFeature();
    }

    ModifyValidateFastEdit();
  }
}

/*
  Change le comportement du bouton "Valider votre message"
  Ajoute une action qui analyse le message, extrait les smileys, et met à jour les statistiques dans GreaseMonkey
*/
function ChangeFastAnswerValidationButtonAction() {
  var validate_button_fast_answer = document.getElementById("submitreprap");
  validate_button_fast_answer.addEventListener("click", function() {
    ValidateFunction();
  }, true);
}

/*
  Afficher le panneau des favoris à côté du "fast reply"

  create (bool) : true indique qu'il faut créer le panneau. false indique qu'il faut le rafraichir.
*/
function ShowFavoriteSmileysPanel(create) {
  var textarea = GetMessageEditingBox();

  var container = null;

  if(create) {
    // Création du panneau

    container = document.createElement("span");
    container.id = key_favorite_panel;

    // Styles : taille et position
    container.className = "reponserapide cBackCouleurTab1";
    container.style.display = "inline-block";
    container.style.overflow = "auto";
    container.style.position = "relative";
    container.style.padding = "4px";

    // Styles : bordure et couleurs
    container.style.border = "1px dotted #778";
    container.style.width = sm_fav_panel_width;
    container.style.height = sm_fav_panel_height;
    container.style.resize = "both";

    // Mémorisation des nouvelles dimensions en cas de resize
    function savePanelPosition() {
      var height = staticImgMarginTop + container.offsetHeight;
      if(sm_fast_reply_position === 1 || sm_fast_reply_position === 3) { // à droite ou à gauche
        var height2 = 1 + textarea.offsetHeight;
        height = Math.max(height, height2);
      }
      document.getElementById(key_favorite_panel_img).style.marginTop = (height - 16) + "px";
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        var panel = document.getElementById(key_favorite_panel);
        GM_setValue(key_sm_fav_panel_width, panel.style.width);
        GM_setValue(key_sm_fav_panel_height, panel.style.height);
      }, 250);
    }
    var observer1 = new MutationObserver(savePanelPosition);
    observer1.observe(container, {
      attributes: true,
      childList: false,
      characterData: false,
      subtree: false,
      attributeFilter: ["style"]
    });
    if(sm_fast_reply_position === 1 || sm_fast_reply_position === 3) { // à droite ou à gauche
      var observer2 = new MutationObserver(savePanelPosition);
      observer2.observe(textarea, {
        attributes: true,
        childList: false,
        characterData: false,
        subtree: false,
        attributeFilter: ["style"]
      });
    }
  } else {
    // Mise à jour du panneau
    container = document.getElementById(key_favorite_panel);

    // Suppression des favoris affichés dans l'interface
    while(container.hasChildNodes()) {
      container.removeChild(container.lastChild);
    }
  }

  // Ajout de chaque smiley favori
  var smileyArray = sortSmileysByName(smileyStats);
  for(var i = 0; i < smileyArray.length; ++i) {
    var smiley = smileyArray[i];
    if(smiley.fav) {
      var smiley_tiny_code = ConvertFullCodeToTinyCode(smiley.c); // Tiny code
      var smiley_img = BuildSmileyImage(smiley, smiley_tiny_code, true);
      smiley_img.style.margin = "2px";
      smiley_img.className = "fred82vsfsmileyfavoritehover";
      container.appendChild(smiley_img);
    }
  }
  // ajout d'une div de padding pour conserver le padding bottom en overflow
  var divPadBottom = document.createElement("span");
  divPadBottom.style.opacity = "0";
  divPadBottom.style.display = "block";
  divPadBottom.style.width = "1px";
  divPadBottom.style.height = "4px";
  divPadBottom.style.position = "absolute";
  container.appendChild(divPadBottom);

  if(create) {
    var img = document.createElement("img");
    img.id = key_favorite_panel_img;
    img.src = icon_toolbox;
    img.title = "Gérer vos smileys";
    img.style.position = "absolute";
    img.style.cursor = "pointer";
    img.style.width = "16px";
    img.style.height = "16px";
    img.addEventListener("click", function(event) {
      cmScript.showConfigWindow(key_window_config, key_tab_yoursmileys);
    }, false);

    if(sm_fast_reply_position === 1 || sm_fast_reply_position === 2) { // à droite ou en dessous
      var next = textarea.nextElementSibling;
    }

    if(sm_fast_reply_position === 0 || sm_fast_reply_position === 2) { // au dessus ou en dessous
      var br = getLineBreak();
    }

    switch (sm_fast_reply_position) {
      case 0: // au dessus
        container.style.margin = "1px 3px 0px";
        staticImgMarginTop = 1;
        textarea.parentNode.insertBefore(container, textarea);
        textarea.parentNode.insertBefore(img, textarea);
        textarea.parentNode.insertBefore(br, textarea);
        savePanelPosition(); // met à jour la marge de l'image
        break;
      case 1: // à droite
        container.style.margin = "1px 3px -2px 1px";
        staticImgMarginTop = 1;
        textarea.parentNode.insertBefore(container, next);
        textarea.parentNode.insertBefore(img, next);
        savePanelPosition(); // met à jour la marge de l'image
        break;
      case 2: // en dessous
        container.style.margin = "0px 3px 1px";
        staticImgMarginTop = 0;
        textarea.parentNode.insertBefore(br, next);
        textarea.parentNode.insertBefore(container, next);
        textarea.parentNode.insertBefore(img, next);
        savePanelPosition(); // met à jour la marge de l'image
        break;
      case 3: // à gauche
        container.style.margin = "1px 1px -2px 19px";
        staticImgMarginTop = 1;
        textarea.parentNode.insertBefore(img, textarea);
        textarea.parentNode.insertBefore(container, textarea);
        savePanelPosition(); // met à jour la marge de l'image
        break;
    }
  }
}

/*
  Ajout d'une icône pour scanner les smileys présents dans un message
*/
function AddScanSmileysFeature() {
  getElementByXpath("//table//tr[starts-with(@class, \"message\")]//div[@class=\"toolbar\"]//div[@class=\"left\"]", root).
  filter(function(toolbar) {
    return getElementByXpath(".//a[starts-with(@href, \"/message.php\")]", toolbar).length > 0;
  }).forEach(function(toolbar) {
    var icon_ScanSmileys = document.createElement("img");
    icon_ScanSmileys.src = sm_fav_world_icon;
    icon_ScanSmileys.style.cursor = "pointer";
    icon_ScanSmileys.style.marginRight = "3px";
    icon_ScanSmileys.title = "Choisir les smileys à placer en favoris";

    var message = getElementByXpath(".//div[starts-with(@id, \"para\")]", toolbar.parentNode.parentNode)[0];
    icon_ScanSmileys.addEventListener("click", function(event) {
      ShowSmileysForFavorite(message);
    }, true);

    // Placement de l'icône dans la page
    if(toolbar.nextSibling.className == "spacer") {
      var newDiv = document.createElement("div");
      newDiv.className = "right";
      newDiv.appendChild(icon_ScanSmileys);
      toolbar.parentNode.insertBefore(newDiv, toolbar.nextSibling);
    } else {
      toolbar.nextSibling.insertBefore(icon_ScanSmileys, toolbar.nextSibling.firstChild);
    }
  });
}

/*
  Affiche une fenêtre pour choisir quel smileys placer en favoris

  message : message dans lequel rechercher les smileys
*/
function ShowSmileysForFavorite(message) {
  // Récupération de tous les smileys. Ce sont tous les "img" dont l'attribut "onload" est indéfini.
  var imgList = getElementByXpath(".//img[not(@onload) and starts-with(@src, \"https://forum-images.hardware.fr/\")]",
    message);
  if(imgList.length == 0) {
    alert("Aucun smiley n'a été trouvé dans ce message.");
  } else {
    cmScript.showConfigWindow(key_window_favorite);
    cmScript.buildFavoriteWindow(imgList);
  }
}

/*
  Modification de la fonctionnalité HFR d'édition rapide,
  afin de pouvoir traiter les smileys de ce message édité.
*/
function ModifyValidateFastEdit() {
  // Modification de l'évènement "clic de l'utilisateur sur l'icône 'fast edit'"
  function fred82vsf_function_new_edit_in(config, cat, post, numreponse, path) {
    // HFR
    unsafeWindow.fred82vsf_function_old_edit_in(config, cat, post, numreponse, path);

    // Stockage d'information sur les smileys initiaux
    unsafeWindow.fred82vsf_function_ScheduleModifyFastEdit(numreponse);
  }
  exportFunction(fred82vsf_function_new_edit_in, unsafeWindow, {
    defineAs: "fred82vsf_function_new_edit_in"
  });
  unsafeWindow.edit_in = unsafeWindow.fred82vsf_function_new_edit_in;
}

function fred82vsf_function_GetFastEditTextArea(msgId) {
  return document.getElementById("rep_editin_" + msgId);
}
exportFunction(fred82vsf_function_GetFastEditTextArea, unsafeWindow, {
  defineAs: "fred82vsf_function_GetFastEditTextArea"
});

/*
  Stockage d'information sur les smileys initiaux
*/
function fred82vsf_function_ScheduleModifyFastEdit(numreponse) {
  setTimeout(function() {
    var textArea = unsafeWindow.fred82vsf_function_GetFastEditTextArea(numreponse);

    if(textArea == null) {
      /*
        Nouvel essai, car la "textarea" n'est pas encore disponible
        (en attente traitement serveur HFR pour obtenir le BBcode)
      */
      unsafeWindow.fred82vsf_function_ScheduleModifyFastEdit(numreponse);
    } else {
      // Stockage d'informations
      var msgInfo = {};
      msgInfo.msgId = numreponse;
      msgInfo.initialText = unsafeWindow.fred82vsf_function_GetFastEditTextArea(numreponse).value;
      unsafeWindow.fred82vsf_object_fastEditDict[msgInfo.msgId] = msgInfo;

      var val_button = document.querySelector("div#para" + numreponse + " > div > input:first-child:first-of-type");
      val_button.addEventListener("click", function() {
        ValidateFunction(numreponse);
      }, true);
    }
  }, 500);
}
exportFunction(fred82vsf_function_ScheduleModifyFastEdit, unsafeWindow, {
  defineAs: "fred82vsf_function_ScheduleModifyFastEdit"
});

/*
  Traitement des pages "édition de message". Insertion du panneau des smileys.
*/
function HandleEditingMessagePage() {
  // Masque les smileys favoris et personnels du forum
  if(sm_hide_forum_smileys) {
    var dynamic_smilies = document.getElementById("dynamic_smilies");
    if(dynamic_smilies != null) {
      while(dynamic_smilies.hasChildNodes()) {
        dynamic_smilies.removeChild(dynamic_smilies.lastChild);
      }
    }
  }

  // Conteneur latéral gauche
  var parent_container = GetMessageEditingBox().parentNode.parentNode.cells[0];

  // Création du nouveau panneau de statistiques de smileys
  var smiley_panel = document.createElement("div");
  smiley_panel.id = key_smiley_panel;
  smiley_panel.className = "tabber";

  // Ajout de ce panneau au conteneur latéral gauche
  parent_container.appendChild(smiley_panel);

  BuildYourSmileysPanel(smiley_panel, true);

  // Lien pour ouvrir la fenêtre de configuration
  var link_config = document.createElement("a");
  link_config.className = "s1Topic"; // Style
  link_config.href = "javascript:void(null);";
  link_config.addEventListener("click", function(event) {
    cmScript.showConfigWindow(key_window_config, key_tab_parameters);
  }, true);
  link_config.innerHTML = "Configuration du script";
  link_config.title = "Cliquez ici pour configurer le script " + script_name;
  parent_container.appendChild(link_config);

  ChangeValidateButtonAction();

  // Mémorisation du TextArea.
  initialText = GetMessageEditingBox().value;
}

/*
  Construction du panneau des smileys avec les trois onglets {top, historique, favoris)
*/
function BuildYourSmileysPanel(parentPanel, clickable) {
  LoadSmileyStats();

  // 1) Panneau Top

  displaySmileysInPanel(sortSmileysByStat(smileyStats), key_tab_top, key_tab_top_content, key_prefix_top,
    tab_top_title, "Vos " + sm_count + " smileys les plus utilisés", parentPanel, clickable);

  // 2) Panneau Historique

  displaySmileysInPanel(sortSmileysByHistory(smileyStats), key_tab_history, key_tab_history_content, key_prefix_hist,
    tab_history_title, "Vos " + sm_count + " smileys les plus récents", parentPanel, clickable);

  // 3) Panneau Favoris

  displaySmileysInPanel(sortSmileysByName(smileyStats), key_tab_favorite, key_tab_favorite_content, key_prefix_fav,
    tab_favorite_title, null, parentPanel, clickable);

  if(parentPanel.id == key_smiley_panel) {
    // Affiche l'onglet précédemment affiché par l'utilisateur
    ShowThisTab(sm_current_tab);
  }
}

/*
  Affiche l'onglet dont l'id est fourni
*/
function ShowThisTab(key_tab) {
  // Selection d'un onglet sur la fennetre de configuration
  if(key_tab == key_tab_yoursmileys) {
    // Onglet "Vos smileys"
    BuildYourSmileysContentTab(key_tab_yoursmileys);
    document.getElementById(key_config_window_content).tabber.tabShow(index_tab_yoursmileys);
  } else if(key_tab == key_tab_parameters) {
    // Onglet "Paramètres"
    document.getElementById(key_config_window_content).tabber.tabShow(index_tab_parameters);
  }
  // Selection d'un onglet sur le panneau de réponse normale
  else {
    // Onglets du panneau des smileys (top, historique, favoris)
    var default_tab = document.getElementById(key_tab);
    default_tab.className = "tabbertab tabbertabdefault";
  }
}

/*
  Affiche la liste des smileys dans le panneau indiqué

  smileyArray : tableau des smileys ordonné en fonction de l'onglet
  tab_key : type du panneau
  id_panel : id du sous-panneau à créer
  prefix_id : préfixe de l'id du conteneur de chaque image
  tab_title : texte du header de l'onglet
  tips_title : texte en haut du sous-panneau décrivant son utilité,
  parentPanel : panneau parent hébergeant le sous-panneau
  clickable : est-ce que le smiley peut-être selectioné pour un message (oui en réponse normale, non en fenêtre de conf)
*/
function displaySmileysInPanel(smileyArray, tab_key, id_panel, prefix_id, tab_title, tips_title, parentPanel, clickable) {
  var panel = document.createElement("div");
  panel.id = tab_key;
  panel.className = "tabbertab";
  panel.title = tab_title;

  parentPanel.appendChild(panel);

  if(tips_title != null) {
    var tips_titleItem = document.createElement("span");
    tips_titleItem.className = "s1Topic";
    tips_titleItem.style.fontWeight = "bold";
    tips_titleItem.innerHTML = tips_title;
    panel.appendChild(tips_titleItem);
  }

  var j = 0;
  var smileys_table = document.createElement("div");
  smileys_table.id = id_panel;
  smileys_table.style.overflow = "auto";
  smileys_table.style.maxHeight = panel_max_height;

  rebuildSmileyTabContent(smileyArray, tab_key, smileys_table, prefix_id, clickable);

  panel.appendChild(smileys_table);
}

function rebuildSmileyTabContent(smileyArray, tab_key, smileys_table, prefix_id, clickable) {
  // Suppression du contenu existant
  while(smileys_table.hasChildNodes()) {
    smileys_table.removeChild(smileys_table.lastChild);
  }

  // Comptage des smileys affichés
  var i = 0;

  // Construction des smileys
  for(var j = 0; j < smileyArray.length; ++j) {
    if(tab_key != key_tab_favorite && i == sm_count) {
      // Pour les panneaux autres que celui des favoris, une limite de nombre de smiley est appliquée
      break;
    }

    var smiley = smileyArray[j];

    var displayThisSmiley = false;

    // Détermination si on affiche ce smiley
    switch (tab_key) {
      case key_tab_top:
      case key_tab_history:
        if(!smiley.fav || sm_include_fav) {
          // Si ce n'est pas un favoris : on l'affiche
          // Si c'est un favoris et qu'il est spécifié de les inclure : on l'affiche
          displayThisSmiley = true;
        }
        break;
      case key_tab_favorite:
        if(smiley.fav == true) {
          displayThisSmiley = true;
        }
        break;
    }

    if(displayThisSmiley) {
      // Ajout du smiley dans le panneau
      AddSmileyToPanel(smiley, tab_key, smileys_table, i, prefix_id, clickable);
      ++i;
    }
  }

  // Si il n'y a pas de smileys dans cette "catégorie" on affiche "aucun"
  //if(Object.keys(smileysList).length === 0 || (i === 0 && tab_key === key_tab_favorite)) {
  // -> contre-intuitif, retour à un affichage simple du "aucun" quand aucun smiley n'est affiché dans l'onglet
  if(i === 0) {
    displayAucun(smileys_table)
  }
}

function displayAucun(parent) {
  parent.appendChild(getLineBreakBlankLine());

  var none_text = document.createElement("span"); // Elément de texte
  none_text.style.font = "14px Verdana"; // Style
  none_text.innerHTML = "aucun"; // Texte
  parent.appendChild(none_text);

  parent.appendChild(getLineBreakBlankLine());
}

/*
  Ajoute un smiley au panneau désigné

  smiley : objet smiley
  tab_key : type du panneau
  smileys_table : objet graphique contenant les smileys graphiques du panneau
  i : numéro de smiley dans la liste des smileys
  prefix_id : préfixe de l'id du conteneur de chaque image
  clickable : est-ce que le smiley peut-être selectioné pour un message (oui en réponse normale, non en fenêtre de conf)
*/
function AddSmileyToPanel(smiley, tab_key, smileys_table, i, prefix_id, clickable) {
  var smiley_tiny_code = ConvertFullCodeToTinyCode(smiley.c); // Tiny code

  // Conteneur racine de description d'un smiley
  var smiley_parent_container = document.createElement("li");
  smiley_parent_container.id = prefix_id + smiley_tiny_code;
  smiley_parent_container.className = "fred82vsfsmileyhover";
  smiley_parent_container.style.display = "-moz-inline-stack";
  smiley_parent_container.style.display = "inline-block";
  smiley_parent_container.style.verticalAlign = "middle";
  smiley_parent_container.style.margin = "2px";
  smiley_parent_container.style.zoom = "1";

  // Conteneur de description du smiley
  var smiley_container = document.createElement("div");

  // 1) Conteneur de l'image et image (smiley)
  var img_container = document.createElement("div");
  img_container.appendChild(BuildSmileyImage(smiley, smiley_tiny_code, clickable));
  smiley_container.appendChild(img_container);

  // 2) Conteneur d'édition (en-dessous du smiley)
  var manager_container = document.createElement("div");
  manager_container.style.display = "table";
  manager_container.style.width = "100%";
  manager_container.style.height = "18px";

  // 2.1) Statistique
  if(tab_key != key_tab_favorite) {
    var stat_container = document.createElement("span");

    var statInfoText = null;
    var statInfoToolTipText = null;

    switch (tab_key) {
      case key_tab_top:
        statInfoText = smiley.s;
        statInfoToolTipText = smiley.s + " fois";
        break;
      case key_tab_history:
        statInfoText = (i + 1);
        statInfoToolTipText = getDateTimeStringForDisplay(smiley.d);
        break;
    }

    stat_container.innerHTML = statInfoText;
    stat_container.title = statInfoToolTipText;
    stat_container.style.display = "table-cell";
    stat_container.style.align = "left";
    stat_container.style.fontSize = "x-small"; // Taille du nombre statistique
    stat_container.style.cursor = "default";
    stat_container.style.verticalAlign = "middle";
    manager_container.appendChild(stat_container);
  }

  // 2.2) Bouton favori (étoile)
  var star_container = document.createElement("span");
  star_container.style.display = "table-cell";
  star_container.style.align = "center";
  star_container.style.width = "100%";
  star_container.appendChild(BuildFavoriteIcon(smiley, smiley_tiny_code, prefix_id));
  manager_container.appendChild(star_container);

  // 2.3) Bouton de suppression
  if(tab_key != key_tab_favorite) {
    var remove_container = document.createElement("span");
    star_container.style.display = "table-cell";
    star_container.style.align = "right";
    var remove_button = document.createElement("input");
    remove_button.value = "X";
    remove_button.type = "image";
    remove_button.src = icon_del;
    remove_button.title = "Supprimer le smiley " + smiley.c;
    remove_button.alt = smiley.c;
    remove_button.style.verticalAlign = "middle";
    remove_button.className = "fred82vsfdeletehover";
    remove_button.addEventListener("click", RemoveSmileyStat, true);
    remove_container.appendChild(remove_button);
    manager_container.appendChild(remove_container);
  }

  smiley_container.appendChild(manager_container);

  smiley_parent_container.appendChild(smiley_container);

  smileys_table.appendChild(smiley_parent_container);
}

/*
  Construit l'icône interactive "favoris", en forme d'étoile.
*/
function BuildFavoriteIcon(smiley, smiley_tiny_code, prefix_id) {
  var img_favorite = document.createElement("img");

  var favorite_icon_url = "";
  if(smiley.fav == true) {
    favorite_icon_url = icon_fav_active;
  } else {
    favorite_icon_url = icon_fav_inactive;
  }

  img_favorite.id = prefix_id + key_prefix_fav_img + smiley_tiny_code;
  img_favorite.src = favorite_icon_url;
  img_favorite.width = 16;
  img_favorite.height = 16;
  img_favorite.style.marginTop = "1px";
  img_favorite.style.marginBottom = "0";
  img_favorite.style.verticalAlign = "middle";
  img_favorite.className = "fred82vsffavoritehover";

  AddClickEventHandlerForFavoriteStatusChange(smiley, img_favorite);

  return img_favorite;
}

/*
  Ajoute un gestionnaire d'évènement sur le clic de l'utilisateur,
  pour changer le status favoris du smiley
*/
function AddClickEventHandlerForFavoriteStatusChange(smiley, element) {
  element.addEventListener("click", ChangeFavoriteStatus, true);
  element.alt = smiley.c;
  element.style.cursor = "pointer";
  element.title = GetFavoriteTooltip(smiley);
}

/*
  Construction de l'image représentant le smiley
*/
function BuildSmileyImage(smiley, smiley_tiny_code, clickable) {
  var img = document.createElement("img");

  var icon_path = null;

  if(IsBaseSmiley(smiley.c)) {
    // Smiley de base
    icon_path = GetUrlForBaseSmiley(smiley.c);
  } else {
    // Smiley utilisateur
    if(smiley_tiny_code.count(":") == 1) {
      // Smiley personnel numéroté
      var splitCode = smiley_tiny_code.split(":");
      var tiny_code = splitCode[0];
      var numeroSmileyPerso = splitCode[1];

      icon_path = image_utilisateur_url + numeroSmileyPerso + "/" + tiny_code + ".gif";
    } else {
      // Le smiley du forumeur
      icon_path = image_utilisateur_url + smiley_tiny_code + ".gif";
    }
  }

  img.src = icon_path;
  img.alt = smiley.c; // Texte alternatif (quand l'image n'est pas chargée)
  img.title = smiley.c; // Tooltip
  img.style.verticalAlign = "middle";

  if(clickable) {
    img.addEventListener("click", function(event) {
      putSmiley(this.alt);
    }, false);
    img.style.cursor = "pointer";
  }

  return img;
}

function GetFavoriteTooltip(smiley) {
  var tooltip = null;

  if(smiley.fav) {
    tooltip = "Enlever " + smiley.c + " de vos favoris";
  } else {
    tooltip = "Ajouter " + smiley.c + " à vos favoris";
  }

  return tooltip;
}

/*
  Change le comportement du bouton "Valider votre message"
  Ajoute une action qui analyse le message, extrait les smileys, et met à jour les statistiques dans GreaseMonkey
*/
function ChangeValidateButtonAction() {
  var validate_button = getElementByXpath("//td[@class=\"repCase2\"]/input[@name=\"submit\"]", root)[0];
  validate_button.addEventListener("click", function() {
    ValidateFunction();
  }, true);
}

/*
  Mise à jour des statistiques de smileys

  Arguments :
  fastEditMsgId : l'id de l'edition rapide
*/
function ValidateFunction(fastEditMsgId) {
  // Le message est prêt à être envoyé au serveur. Avant cela, analyse le message pour les smileys.

  var message_initial = null;
  var nouveau_message = null;

  // Extraction de la liste des smileys à partir du message
  if(fastEditMsgId === undefined) {
    // Mode réponse rapide ou normale ou edition normale
    message_initial = initialText;
    nouveau_message = GetMessageEditingBox().value;
  } else {
    // Mode édition rapide
    var msgInfo = unsafeWindow.fred82vsf_object_fastEditDict[fastEditMsgId];
    message_initial = msgInfo.initialText;
    nouveau_message = unsafeWindow.fred82vsf_function_GetFastEditTextArea(msgInfo.msgId).value;
  }

  var smileysList_Old = BuildSmileyListFromMessage(message_initial); // Liste des smileys avant édition
  var smileysList_New = BuildSmileyListFromMessage(nouveau_message); // Liste des smileys actuels

  if(smileysList_New == null) {
    // Aucun smiley trouvé
  } else {
    // Des smileys ont été trouvés :  mise à jour de la configuration GreaseMonkey

    LoadSmileyStats();

    // Construction de la date actuelle
    var date = GetCurrentFormatedDate();

    var newSmileyList = new Array;
    var newSmileyCount = 0;

    for(var i in smileysList_New) { // Pour chaque smiley trouvé
      var smiley_New = smileysList_New[i];

      // Recherche si ce smiley était déjà présent avant l'édition
      var smiley_Old = smileysList_Old[smiley_New.code];

      if(smiley_Old != null) {
        var diff = smiley_New.count - smiley_Old.count;

        if(diff <= 0) {
          // Ce smiley n'a pas été utilisé à nouveau dans le message
          continue;
        } else {
          smiley_New.count = diff;
        }
      }

      // Obtention de la statistique précédente, si existante
      var smiley = smileyStats[smiley_New.code];

      if(smiley == null) {
        newSmileyList.push(smiley_New.code);
        ++newSmileyCount;

        // Nouveau smiley, nouvelle entrée

        smiley = CreateSmileyObject(smiley_New.code, smiley_New.count, date);
      } else {
        smiley.s += smiley_New.count; // Incrémente la statistique existante
        smiley.d = date;
      }

      smileyStats[smiley_New.code] = smiley; // Mise à jour ou ajout de la statisque dans la liste Json
    }

    if(sm_notify_new && newSmileyCount > 0) {
      var msg = null;

      if(newSmileyCount == 1) {
        msg = "1 nouveau smiley a été trouvé :\n\n" + newSmileyList[0];
      } else {
        msg = newSmileyCount + " nouveaux smileys ont été trouvés :\n\n";
        for(var s = 0; s < newSmileyList.length; ++s) {
          if(s === newSmileyList.length - 2) {
            msg += newSmileyList[s] + " et ";
          } else if(s === newSmileyList.length - 1) {
            msg += newSmileyList[s];
          } else {
            msg += newSmileyList[s] + ", ";
          }
        }
      }

      alert(msg);
    }

    saveUserStats(); // Sauve et recharge les stats triées et recharge le panneau des favoris de la réponse rapide
  }

  // Envoi du message au serveur HFR
  return true;
}

/*
  Recharge le panneau des smileys en fast reply
*/
function ReloadSmileysFullPanel() {
  var favoritePanelItem = document.getElementById(key_favorite_panel);
  if(favoritePanelItem != null) {
    ShowFavoriteSmileysPanel(false);
  }
}

// =============================================================== //
// CSS des onglets
// =============================================================== //

GM_addStyle(".tabbertabhide{display:none;} .tabber{} .tabberlive{margin-top:4px;} ul.tabbernav{margin:0;padding:3px 0;border-bottom:1px solid #778;font:bold 12px Verdana;} ul.tabbernav li{list-style:none;margin:0;display:inline;} ul.tabbernav li a{padding:3px 0.5em;margin-left:3px;border:1px solid #778;border-bottom:none;background:#DDE;text-decoration:none;} ul.tabbernav li:last-child a{margin-right:3px;} ul.tabbernav li a:link{color:#448;} ul.tabbernav li a:visited{color:#667;} ul.tabbernav li a:hover{color:#000;background:#AAE;border-color:#227;} ul.tabbernav li.tabberactive a{background-color:#fff;border-bottom:1px solid #fff;} ul.tabbernav li.tabberactive a:hover{color:#000;background:#fff;border-bottom:1px solid #fff;} .tabbertab{padding:4px;border:1px solid #778;border-top:0;} .tabberlive#tab2{height:200px;overflow:auto;}");

// CSS mouse over sur les smileys
GM_addStyle(".fred82vsfsmileyhover:hover{opacity:0.75;}");

// CSS mouse over sur les smileys du panneau des favoris en réponse rapide
GM_addStyle(".fred82vsfsmileyfavoritehover:hover{opacity:0.75;}");

// CSS mouse over sur le bouton étoile
GM_addStyle(".fred82vsffavoritehover:hover{opacity:0.75;}");

// CSS mouse over sur le bouton suppression
GM_addStyle(".fred82vsfdeletehover:hover{opacity:0.75;}");

// =============================================================== //
// CSS Manager
// =============================================================== //

var cssManager = {
  cssContent: "",

  addCssProperties: function(properties) {
    cssManager.cssContent += properties;
  },

  insertStyle: function() {
    GM_addStyle(cssManager.cssContent);
    cssManager.cssContent = "";
  }
}

// =============================================================== //
// Fenêtre de configuration
// =============================================================== //

var cmScript = {
  backgroundDiv: null,

  configDiv: null,

  favoriteDiv: null,

  timer: null,

  isOpened: false,

  configHeight: 0,
  favoriteHeight: 0,

  setDivsPosition: function() {
    cmScript.setBackgroundPosition();
    cmScript.setConfigWindowPosition();
  },

  setBackgroundPosition: function() {
    cmScript.backgroundDiv.style.width = document.documentElement.clientWidth + "px";
    cmScript.backgroundDiv.style.height = document.documentElement.offsetHeight + "px";
    cmScript.backgroundDiv.style.top = "0";
  },

  setConfigWindowPosition: function() {
    if(parseInt(cmScript.configDiv.clientHeight) > this.configHeight) {
      this.configHeight = parseInt(cmScript.configDiv.clientHeight);
    }
    if(parseInt(cmScript.favoriteDiv.clientHeight) > this.favoriteHeight) {
      this.favoriteHeight = parseInt(cmScript.favoriteDiv.clientHeight);
    }
    cmScript.configDiv.style.left = (document.documentElement.clientWidth / 2) -
      (parseInt(cmScript.configDiv.style.width) / 2) + window.scrollX + "px";
    cmScript.configDiv.style.top = (document.documentElement.clientHeight / 2) -
      (this.configHeight / 2) + "px";
    cmScript.favoriteDiv.style.left = (document.documentElement.clientWidth / 2) -
      (parseInt(cmScript.favoriteDiv.style.width) / 2) + window.scrollX + "px";
    cmScript.favoriteDiv.style.top = (document.documentElement.clientHeight / 2) -
      (this.favoriteHeight / 2) + "px";
  },

  escKey: function(event) {
    if(event.which === 27) {
      clearInterval(cmScript.timer);
      cmScript.hideConfigWindow();
    }
  },

  alterWindow: function(opening) {
    this.isOpened = opening;
    if(opening) {
      document.addEventListener("keydown", cmScript.escKey, false);
      window.addEventListener("resize", cmScript.setDivsPosition, false);
      getElementByXpath("//iframe", document.body).forEach(function(iframe) {
        iframe.style.visibility = "hidden";
      });
    } else {
      document.removeEventListener("keydown", cmScript.escKey, false);
      window.removeEventListener("resize", cmScript.setDivsPosition, false);
      getElementByXpath("//iframe", document.body).forEach(function(iframe) {
        iframe.style.visibility = "visible";
      });
    }
  },

  buildBackground: function() {
    if(!document.getElementById("sm_back")) {
      cmScript.backgroundDiv = document.createElement("div");
      cmScript.backgroundDiv.id = "sm_back";
      cmScript.backgroundDiv.addEventListener("click", function() {
        clearInterval(cmScript.timer);
        cmScript.hideConfigWindow();
      }, false);
      cssManager.addCssProperties("#sm_back{display:none;position:absolute;left:0px;top:0px;background-color:#242424;z-index:1001;}");
      document.body.appendChild(cmScript.backgroundDiv);
    }
  },

  // =============================================================== //
  // Construction de la fenêtre de configuration
  // =============================================================== //

  buildConfigWindow: function() {
    // Styles de la fenêtre
    cssManager.addCssProperties(".sm_front{display:none;vertical-align:bottom;position:fixed;z-index:1002;border:1px dotted #778;" +
      "padding:8px;text-align:center;font-family:Verdana,Arial,Sans-serif,Helvetica;}");
    cssManager.addCssProperties(".sm_front dl{clear:both;margin:0;}");
    cssManager.addCssProperties(".sm_front dt{float:left;width:80%;text-align:right;font-size:14px;margin-bottom:10px;}");
    cssManager.addCssProperties(".sm_front dd{float:left;font-size:14px;margin-left:20px;}");

    // Construction de la fenêtre
    var configWindow = document.createElement("div");
    configWindow.id = "sm_configWindow";
    configWindow.className = "sm_front cBackCouleurTab1";
    configWindow.style.width = config_window_width;
    configWindow.style.padding = "16px";

    // Bouton Fermer la fenêtre
    var closeButton = this.buildCloseButton();
    closeButton.style.marginTop = "4px";
    closeButton.style.marginRight = "0";
    configWindow.appendChild(closeButton);

    var windowTitle = document.createElement("legend");
    windowTitle.innerHTML = "Configuration du script " + script_name;
    windowTitle.style.fontWeight = "bold";
    configWindow.appendChild(windowTitle);

    var tabs = document.createElement("div");
    tabs.className = "tabber";
    tabs.style.marginTop = "16px";
    tabs.id = key_config_window_content;

    // 1) Construction de l'onglet Paramètres
    this.buildParametersTab(tabs);

    // 2) Onglet Backup
    this.buildBackupTab(tabs);

    // 3) Onglet "Vos smileys"
    this.buildYourSmileysTab(tabs);

    configWindow.appendChild(tabs);

    // Insertion de la fenêtre dans la page globale
    cmScript.configDiv = configWindow;
    document.body.appendChild(cmScript.configDiv);
  },
  /*
    Construire un bouton pour fermer la fenêtre
  */
  buildCloseButton: function() {
    var inputClose = document.createElement("input");
    inputClose.type = "image";
    inputClose.src = icon_cancel;
    inputClose.title = "Fermer";
    inputClose.style.cssFloat = "right";
    inputClose.addEventListener("click", cmScript.hideConfigWindow, false);
    return inputClose;
  },
  /*
    Onglet paramètres
  */
  buildParametersTab: function(tabs) {
    var configTab = document.createElement("div");
    configTab.className = "tabbertab";
    configTab.style.padding = "8px";
    configTab.title = "Paramètres";
    configTab.id = key_tab_parameters;

    tabs.appendChild(configTab);

    // Formulaire
    var formular = document.createElement("fieldset");
    formular.style.margin = "0";
    formular.style.border = "1px solid #778";

    // Titre
    var titre = document.createElement("legend");
    titre.innerHTML = "Paramètres";
    titre.style.fontWeight = "bold";
    formular.appendChild(titre);

    // Liste des réglages

    this.addTextBoxField(formular, "Nombre de smileys affichés dans les onglets \"Top\" et \"Historique\"",
      key_sm_count, sm_count, 10);

    this.addCheckBoxField(formular, "Confirmer la suppression des smileys",
      key_sm_confirm_delete, sm_confirm_delete, true);

    this.addCheckBoxField(formular, "Inclure les favoris dans les onglets \"Top\" et \"Historique\"",
      key_sm_include_fav, sm_include_fav, true);

    this.addCheckBoxField(formular, "Trier les smileys favoris par nom au lieu du tri par \"Top\"",
      key_sm_sort_fav, sm_sort_fav, true);

    this.addCheckBoxField(formular, "Afficher vos smileys favoris à côté de la réponse rapide",
      key_sm_fast_reply, sm_fast_reply, true);

    this.addPositionChoice(formular, "Position",
      key_sm_fast_reply_position, sm_fast_reply_position);

    this.addCheckBoxField(formular, "Signaler lorsque de nouveaux smileys sont trouvés dans vos posts",
      key_sm_notify_new, sm_notify_new, true);

    this.addCheckBoxField(formular, "Masquer le bloc des smileys favoris et personnels du forum",
      key_sm_hide_forum_smileys, sm_hide_forum_smileys, true);

    this.addCheckBoxField(formular, "Ne pas mettre d'espaces autour des smileys insérés dans les posts",
      key_sm_no_space_insert, sm_no_space_insert, true);

    this.addCheckBoxField(formular, "Permettre de marquer des smileys en favori depuis n'importe quel post",
      key_sm_fav_world, sm_fav_world, true);

    // Définition de l'icône associée à chaque message
    this.addIconChoice(formular, "Icône du bouton de marquage des smileys en favori",
      key_sm_fav_world_icon, sm_fav_world_icon, 10);

    // Remarque
    var note = document.createElement("div");
    note.innerHTML = "Si vous changez ces réglages, vous devrez actualiser la page afin qu'ils soient appliqués.";
    note.style.cssFloat = "left";
    note.style.fontSize = "10px";
    note.style.color = "crimson";
    note.style.fontWeight = "bold";
    note.style.margin = "16px 0 0 16px";
    formular.appendChild(note);

    // Boutons de contrôle
    var buttonsContainer = document.createElement("div");
    buttonsContainer.style.cssFloat = "right";
    buttonsContainer.style.margin = "16px 16px 0 0";

    // Enregistrer cette configuration
    var inputOk = document.createElement("input");
    inputOk.type = "image";
    inputOk.src = icon_validate;
    inputOk.title = "Valider";
    inputOk.addEventListener("click", cmScript.validateConfig, false);
    buttonsContainer.appendChild(inputOk);

    // Annuler cette configuration
    var inputCancel = document.createElement("input");
    inputCancel.type = "image";
    inputCancel.src = icon_cancel;
    inputCancel.title = "Annuler";
    inputCancel.style.marginLeft = "8px";
    inputCancel.addEventListener("click", cmScript.hideConfigWindow, false);
    buttonsContainer.appendChild(inputCancel);

    formular.appendChild(buttonsContainer);

    configTab.appendChild(formular);
  },
  /*
    Onglet Backup
  */
  buildBackupTab: function(tabs) {
    var backupTab = document.createElement("div");
    backupTab.className = "tabbertab";
    backupTab.style.padding = "8px";
    backupTab.title = "Sauvegarde";

    // Formulaire
    var formular = document.createElement("fieldset");
    formular.style.margin = "0";
    formular.style.border = "1px solid #778";

    // Titre
    var titre = document.createElement("legend");
    titre.innerHTML = "Sauvegarde";
    titre.style.fontWeight = "bold";
    formular.appendChild(titre);

    // Instruction
    var backupTitle = document.createElement("div");
    backupTitle.style.fontSize = "14px";
    backupTitle.innerHTML = "En cas de réinstallation de Firefox, si vous voulez conserver vos smileys,<br>il faut faire une sauvegarde avant de désinstaller Firefox.";
    formular.appendChild(backupTitle);

    formular.appendChild(getLineBreakBlankLine());

    // Lien pour sauvegarder les données
    var saveDiv = document.createElement("div");
    saveDiv.style.fontSize = "14px";
    var saveText = document.createElement("span");
    saveText.innerHTML = "- ";
    saveDiv.appendChild(saveText);
    var saveLink = document.createElement("a");
    saveLink.className = "s1Topic"; // Style
    saveLink.style.fontSize = "14px";
    saveLink.href = "javascript:void(null);";
    saveLink.addEventListener("click", DoBackupFile, true);
    saveLink.innerHTML = "Faire une sauvegarde de tous vos smileys";
    saveLink.title = "Cliquez ici pour construire un fichier de backup contenant toutes vos infos de smileys.";
    saveDiv.appendChild(saveLink);
    formular.appendChild(saveDiv);

    formular.appendChild(getLineBreakBlankLine());

    // Input file pour charger les données
    var loadDiv = document.createElement("div");
    loadDiv.style.fontSize = "14px";
    var loadText = document.createElement("span");
    loadText.innerHTML = "- Charger un fichier de sauvegarde : ";
    loadDiv.appendChild(loadText);
    var loadInput = document.createElement("input");
    loadInput.style.font = "14px Verdana";
    loadInput.type = "file";
    loadInput.name = "files[]";
    loadDiv.appendChild(loadInput);
    formular.appendChild(loadDiv);

    formular.addEventListener("change", LoadBackupFile, false);

    backupTab.appendChild(formular);

    tabs.appendChild(backupTab);
  },
  /*
    Onglet "Vos smileys"
  */
  buildYourSmileysTab: function(tabs) {
    var yourSmileysTab = document.createElement("div");
    yourSmileysTab.className = "tabbertab";
    yourSmileysTab.style.padding = "8px";
    yourSmileysTab.title = "Vos smileys";
    yourSmileysTab.id = key_tab_yoursmileys;

    // Lien pour importer les smileys favoris et personnels du forum
    var importDiv = document.createElement("div");
    importDiv.style.marginBottom = "8px";
    var importLink = document.createElement("a");
    importLink.className = "s1Topic"; // Style
    importLink.href = "javascript:void(null);";
    importLink.addEventListener("click", ImportFavPersoForum, true);
    importLink.innerHTML = "Importer vos smileys favoris et personnels du forum dans vos favoris";
    importLink.title = "Cliquez ici pour importer vos smileys favoris et personnels du forum dans vos favoris";
    importDiv.appendChild(importLink);
    yourSmileysTab.appendChild(importDiv);

    // Lien pour réinitialiser les statistiques
    var resetDiv = document.createElement("div");
    resetDiv.style.marginTop = "8px";
    var resetLink = document.createElement("a");
    resetLink.className = "s1Topic"; // Style
    resetLink.href = "javascript:void(null);";
    resetLink.addEventListener("click", ResetAllStats, true);
    resetLink.innerHTML = "Réinitialiser toutes vos données de smileys";
    resetLink.title = "Cliquez ici pour effacer toutes vos données de smileys (après confirmation)";
    resetDiv.appendChild(resetLink);
    yourSmileysTab.appendChild(resetDiv);

    tabs.appendChild(yourSmileysTab);
  },
  /*
    Ajoute un champ de type TextBox
    formular : conteneur
  */
  addTextBoxField: function(formular, field_title, field_id, field_value, maxlength) {
    var dl = document.createElement("dl");
    formular.appendChild(dl);

    var dt = document.createElement("dt");
    dt.innerHTML = field_title + " :";
    dl.appendChild(dt);

    var dd = document.createElement("dd");
    dl.appendChild(dd);

    var inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = field_id;
    inputField.setAttribute("name", field_id);
    inputField.maxlength = maxlength; // maximum length (in characters) of an input field
    inputField.size = maxlength; // number of characters that should be visible
    inputField.value = field_value;
    dd.appendChild(inputField);
  },
  /*
    Ajoute un champ de type CheckBox
    formular : conteneur
  */
  addCheckBoxField: function(formular, field_title, field_id, checked, enabled) {
    var dl = document.createElement("dl");
    formular.appendChild(dl);

    var dt = document.createElement("dt");
    dt.innerHTML = field_title + " :";
    dl.appendChild(dt);

    var dd = document.createElement("dd");
    dl.appendChild(dd);

    var inputField = document.createElement("input");
    inputField.type = "checkbox";
    inputField.id = field_id;
    inputField.setAttribute("name", field_id);
    inputField.disabled = !enabled;
    inputField.checked = checked;
    dd.appendChild(inputField);
  },
  /*
    Ajoute le champ pour choisir la position
    formular : conteneur
  */
  addPositionChoice: function(formular, field_title, field_id, field_value) {
    var dl = document.createElement("dl");
    formular.appendChild(dl);

    var dt = document.createElement("dt");
    dt.style.width = "25%"

    // Texte
    var divText = document.createElement("span");
    divText.innerHTML = field_title + " :";
    dt.appendChild(divText);

    dl.appendChild(dt);

    var dd = document.createElement("dd");

    // Boutons radio
    var positions = ["au dessus", "à droite", "en dessous", "à gauche"];
    for(var i = 0; i < 4; ++i) {
      var inputField = document.createElement("input");
      inputField.type = "radio";
      inputField.id = field_id + "_" + i;
      inputField.setAttribute("name", field_id);
      if(i === field_value) {
        inputField.checked = true;
      }
      dd.appendChild(inputField);
      var inputLabel = document.createElement("label");
      inputLabel.setAttribute("for", field_id + "_" + i);
      inputLabel.appendChild(document.createTextNode(" " + positions[i]));
      dd.appendChild(inputLabel);
      dd.appendChild(document.createTextNode(" "));
    }

    dl.appendChild(dd);
  },
  /*
    Ajoute le champ pour choisir l'icône
    formular : conteneur
  */
  addIconChoice: function(formular, field_title, field_id, field_value, maxlength) {
    var dl = document.createElement("dl");
    formular.appendChild(dl);

    var dt = document.createElement("dt");

    // Texte
    var divText = document.createElement("span");
    divText.innerHTML = field_title + " ";
    dt.appendChild(divText);

    // espace 1
    var divSpace1 = document.createElement("span");
    divSpace1.innerHTML = " ";
    dt.appendChild(divSpace1);

    // Icône
    var iconShow = document.createElement("img");
    iconShow.id = key_fav_world_icon_preview;
    iconShow.src = field_value;
    iconShow.style.verticalAlign = "middle";
    dt.appendChild(iconShow);

    // espace 2
    var divSpace2 = document.createElement("span");
    divSpace2.innerHTML = " ";
    dt.appendChild(divSpace2);

    // Image pour réinitialiser l'icône
    var inputReset = document.createElement("input");
    inputReset.type = "image";
    inputReset.src = icon_cancel;
    inputReset.title = "Réinitialiser l'icône";
    inputReset.style.verticalAlign = "middle";
    inputReset.addEventListener("click", ResetIconFavWorld, false);
    dt.appendChild(inputReset);

    // les deux points
    var divDeuxPoint = document.createElement("span");
    divDeuxPoint.innerHTML = " :";
    dt.appendChild(divDeuxPoint);

    dl.appendChild(dt);

    var dd = document.createElement("dd");

    // Définition éditable de l'icône
    var inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = field_id;
    inputField.title = "URL de l'icône (http ou data)";
    inputField.setAttribute("name", field_id);
    inputField.maxlength = maxlength; // maximum length (in characters) of an input field
    inputField.size = maxlength; // number of characters that should be visible
    inputField.value = field_value;
    inputField.addEventListener("input", ReloadIconFavWorld, false);
    inputField.addEventListener("click", function() {
      // Sélection de tout le contenu de la inputBox quand on clique dessus
      inputField.select();
    }, false);
    dd.appendChild(inputField);

    dl.appendChild(dd);
  },
  /*
    Initialisation de la fenêtre "Choix des favoris"
  */
  initFavoriteWindow: function() {
    var favoriteWindow = document.createElement("div");
    favoriteWindow.className = "sm_front cBackCouleurTab1";
    favoriteWindow.style.padding = "16px";
    favoriteWindow.style.width = favorite_window_width;

    // Bouton Fermer la fenêtre
    var closeButton = this.buildCloseButton();
    closeButton.style.marginTop = "2px";
    closeButton.style.marginRight = "0";
    favoriteWindow.appendChild(closeButton);

    // Texte d'en-tête
    var headerText = document.createElement("legend");
    headerText.innerHTML = "Ajoutez des smileys à vos favoris";
    headerText.style.fontSize = "14px";
    headerText.style.fontWeight = "bold";
    favoriteWindow.appendChild(headerText);

    // Encadré
    var container = document.createElement("div");
    container.style.border = "1px solid #778";
    container.style.marginTop = "16px";
    container.style.padding = "4px";
    favoriteWindow.appendChild(container);

    // Conteneur des smileys
    var favoritesList = document.createElement("div");
    favoritesList.id = key_favorite_window_content;
    favoritesList.style.textAlign = "center";
    favoritesList.style.overflow = "auto"; // Scrolling
    favoritesList.style.maxHeight = favorite_window_content_max_height;
    container.appendChild(favoritesList);

    cmScript.favoriteDiv = favoriteWindow;
    document.body.appendChild(cmScript.favoriteDiv);
  },
  /*
    Construction de la fenêtre "Choix des favoris"
  */
  buildFavoriteWindow: function(smileysList) {
    LoadSmileyStats();

    var favoritesList = document.getElementById(key_favorite_window_content);

    // Suppression des favoris éventuellement déjà affichés précédemment.
    while(favoritesList.hasChildNodes()) {
      favoritesList.removeChild(favoritesList.lastChild);
    }

    smileysList = smileysList.getUnique("alt"); // case insensitive!

    for(var i = 0; i < smileysList.length; ++i) {
      var smiley_code = smileysList[i];
      smiley_code = smiley_code.replace(/^:O$/, ":o").replace(/^:P$/, ":p").replace(/^:d$/, ":D");
      var smiley = smileyStats[smiley_code];

      if(smiley == null) {
        smiley = CreateSmileyDefaultObject(smiley_code);
      }

      var smiley_tiny_code = ConvertFullCodeToTinyCode(smiley.c);

      // Container du smiley
      var favoriteContainer = document.createElement("div");
      favoriteContainer.style.display = "inline-block";
      favoriteContainer.style.margin = "2px";
      favoriteContainer.className = "fred82vsfsmileyhover"

      // Ajout image du smiley
      var smileyImage = BuildSmileyImage(smiley, smiley_tiny_code, false);
      smileyImage.id = key_prefix_favwin + key_prefix_smiley_img + smiley_tiny_code;
      AddClickEventHandlerForFavoriteStatusChange(smiley, smileyImage);
      favoriteContainer.appendChild(smileyImage);

      // Ajout icône pour changer le status favoris
      var favoriteIcon = BuildFavoriteIcon(smiley, smiley_tiny_code, key_prefix_favwin);
      favoriteIcon.style.display = "block";
      favoriteIcon.style.textAlign = "center";
      favoriteIcon.style.marginLeft = "auto";
      favoriteIcon.style.marginRight = "auto";
      favoriteContainer.appendChild(favoriteIcon);

      favoritesList.appendChild(favoriteContainer);
    }
  },
  validateConfig: function() {
    getElementByXpath(".//input[starts-with(@id, \"sm_\")]", document.getElementById("sm_configWindow")).
    forEach(function(input) {
      switch (input.type) {
        case "text":
          // Enregistrement du réglage
          GM_setValue(input.name, input.value);
          break;
        case "checkbox":
          // Enregistrement du réglage
          GM_setValue(input.name, input.checked);
          break;
        case "radio":
          if(input.checked) {
            // Enregistrement du réglage
            GM_setValue(input.name, parseInt(input.id.substring(input.id.length - 1)));
          }
          break;
      }
    });
    cmScript.hideConfigWindow();
  },

  initBackAndFront: function() {
    if(document.getElementById("sm_back")) {
      cmScript.setBackgroundPosition();
      cmScript.backgroundDiv.style.opacity = 0;
      cmScript.backgroundDiv.style.display = "block";
    }
  },

  /*
    windowToShow : nom de la fenêtre à afficher
    key_tab : onglet à afficher dans cette fenêtre
  */
  showConfigWindow: function(windowToShow, key_tab) {
    cmScript.alterWindow(true);
    cmScript.initBackAndFront();
    var opacity = 0;
    cmScript.timer = setInterval(function() {
      opacity = Math.round((opacity + 0.1) * 100) / 100;
      cmScript.backgroundDiv.style.opacity = opacity;
      if(opacity >= 0.8) {
        clearInterval(cmScript.timer);

        switch (windowToShow) {
          case key_window_config:
            cmScript.configDiv.style.display = "block";
            break;
          case key_window_favorite:
            cmScript.favoriteDiv.style.display = "block";
            break;
        }

        cmScript.setConfigWindowPosition();

        if(key_tab !== undefined && key_tab !== null) {
          // Affichage d'un onglet particulier
          ShowThisTab(key_tab);
        }
      }
    }, 1);
  },

  /*
    Cache la fenêtre de configuration, et annule les saisies éventuelles
  */
  hideConfigWindow: function() {
    reloadUserConfig(); // Rechargement des réglages

    cmScript.configDiv.style.display = "none";
    cmScript.favoriteDiv.style.display = "none";
    var opacity = cmScript.backgroundDiv.style.opacity;
    cmScript.timer = setInterval(function() {
      opacity = Math.round((opacity - 0.1) * 100) / 100;
      cmScript.backgroundDiv.style.opacity = opacity;
      if(opacity <= 0) {
        clearInterval(cmScript.timer);
        cmScript.backgroundDiv.style.display = "none";
        cmScript.alterWindow(false);
      }
    }, 1);
  },

  setUp: function() {
    if(top.location != self.document.location) {
      return;
    }

    // Arrière-plan
    cmScript.buildBackground();

    // Fenêtre de configuration
    cmScript.buildConfigWindow();

    // Fenêtre de choix des favoris
    cmScript.initFavoriteWindow();

    // CSS
    cssManager.insertStyle();
  },

  createConfigMenu: function() {
    GM_registerMenuCommand(script_name + " -> configuration", function(event) {
      cmScript.showConfigWindow(key_window_config, key_tab_parameters);
    });
  }
};

/*
  Onglet "Vos smileys" : définition du contenu
*/
function BuildYourSmileysContentTab(yourSmileysTabId) {
  // récupération de l'onglet "Vos smileys"
  var yourSmileysTab = document.getElementById(yourSmileysTabId);
  if(yourSmileysTab !== null) {

    // suppression du contenu de "Vos smileys"
    var yourSmileysContent = yourSmileysTab.querySelector("div[id=\"" + key_tab_yoursmileys_content + "\"]");
    if(yourSmileysContent !== null) {
      yourSmileysTab.removeChild(yourSmileysContent);
    }

    // construction du nouveau contenu de "Vos smileys"
    yourSmileysContent = document.createElement("div");
    yourSmileysContent.id = key_tab_yoursmileys_content;
    yourSmileysContent.className = "tabber";
    BuildYourSmileysPanel(yourSmileysContent, false);
    yourSmileysTab.insertBefore(yourSmileysContent, yourSmileysTab.lastElementChild);

    // initialisation des onglets dans le contenu de "Vos smileys"
    InitTabSystem({}, yourSmileysTab);

  }
}

// =============================================================== //
// Script pour faire apparaitre des onglets
// =============================================================== //

var tabberOptions = {
  /* Optional: instead of letting tabber run during the onload event,
     we'll start it up manually. This can be useful because the onload
     even runs after all the images have finished loading, and we can
     run tabber at the bottom of our page to start it up faster. See the
     bottom of this page for more info. Note: this variable must be set
     BEFORE you include tabber.js.   */
  "manualStartup": true,

  /* Optional: code to run after each tabber object has initialized */
  "onLoad": function(argsObj) {
    /* Exemple
       if (argsObj.tabber.id == "tab2") {
       alert("Finished loading tab2!");
       } */
  },

  /* Optional: code to run when the user clicks a tab. If this
     function returns boolean false then the tab will not be changed
     the click is canceled). If you do not return a value or return
     something that is not boolean false, */
  "onClick": function(argsObj) {
    var t = argsObj.tabber; /* Tabber object */
    var id = t.id; /* ID of the main tabber DIV */
    var i = argsObj.index; /* Which tab was clicked (0 is the first tab) */
    var e = argsObj.event; /* Event object */

    if(id == key_smiley_panel) {
      // Onglets du panneau complet des smileys
      SaveCurrentShownTab(t.tabs[i].headingText);
    } else if(t.tabs[i].id == key_tab_yoursmileys) {
      // Onglet "Vos smileys" à l'intérieur de la fenêtre de configuration
      BuildYourSmileysContentTab(t.tabs[i].id);
    }
  },

  /* Optional: set an ID for each tab navigation link */
  "addLinkId": true
};

/*
  Sauvegarde de l'onglet actuellement affiché
*/
function SaveCurrentShownTab(title) {
  switch (title) {
    case tab_top_title:
      sm_current_tab = key_tab_top;
      break;
    case tab_history_title:
      sm_current_tab = key_tab_history;
      break;
    case tab_favorite_title:
      sm_current_tab = key_tab_favorite;
      break;
  }

  GM_setValue(key_sm_current_tab, sm_current_tab);
}

// Source : http://www.barelyfitz.com/projects/tabber/
/*==================================================
  $Id: tabber.js,v 1.9 2006/04/27 20:51:51 pat Exp $
  tabber.js by Patrick Fitzgerald pat@barelyfitz.com

  Documentation can be found at the following URL:
  http://www.barelyfitz.com/projects/tabber/

  License (http://www.opensource.org/licenses/mit-license.php)

  Copyright (c) 2006 Patrick Fitzgerald

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  ==================================================*/

function tabberObj(argsObj) {
  var arg; /* name of an argument to override */

  /* Element for the main tabber div. If you supply this in argsObj,
     then the init() method will be called. */
  this.div = null;

  /* Class of the main tabber div */
  this.classMain = "tabber";

  /* Rename classMain to classMainLive after tabifying
     (so a different style can be applied) */
  this.classMainLive = "tabberlive";

  /* Class of each DIV that contains a tab */
  this.classTab = "tabbertab";

  /* Class to indicate which tab should be active on startup */
  this.classTabDefault = "tabbertabdefault";

  /* Class for the navigation UL */
  this.classNav = "tabbernav";

  /* When a tab is to be hidden, instead of setting display="none", we
     set the class of the div to classTabHide. In your screen
     stylesheet you should set classTabHide to display:none.  In your
     print stylesheet you should set display:block to ensure that all
     the information is printed. */
  this.classTabHide = "tabbertabhide";

  /* Class to set the navigation LI when the tab is active, so you can
     use a different style on the active tab. */
  this.classNavActive = "tabberactive";

  /* Elements that might contain the title for the tab, only used if a
     title is not specified in the TITLE attribute of DIV classTab. */
  this.titleElements = ["h2", "h3", "h4", "h5", "h6"];

  /* Should we strip out the HTML from the innerHTML of the title elements?
     This should usually be true. */
  this.titleElementsStripHTML = true;

  /* If the user specified the tab names using a TITLE attribute on
     the DIV, then the browser will display a tooltip whenever the
     mouse is over the DIV. To prevent this tooltip, we can remove the
     TITLE attribute after getting the tab name. */
  this.removeTitle = true;

  /* If you want to add an id to each link set this to true */
  this.addLinkId = false;

  /* If addIds==true, then you can set a format for the ids.
     <tabberid> will be replaced with the id of the main tabber div.
     <tabnumberzero> will be replaced with the tab number
     (tab numbers starting at zero)
     <tabnumberone> will be replaced with the tab number
     (tab numbers starting at one)
     <tabtitle> will be replaced by the tab title
     (with all non-alphanumeric characters removed) */
  this.linkIdFormat = "<tabberid>nav<tabnumberone>";

  /* You can override the defaults listed above by passing in an object:
     var mytab = new tabber({property:value,property:value}); */
  for(arg in argsObj) {
    this[arg] = argsObj[arg];
  }

  /* Create regular expressions for the class names; Note: if you
     change the class names after a new object is created you must
     also change these regular expressions. */
  this.REclassMain = new RegExp("\\b" + this.classMain + "\\b", "gi");
  this.REclassMainLive = new RegExp("\\b" + this.classMainLive + "\\b", "gi");
  this.REclassTab = new RegExp("\\b" + this.classTab + "\\b", "gi");
  this.REclassTabDefault = new RegExp("\\b" + this.classTabDefault + "\\b", "gi");
  this.REclassTabHide = new RegExp("\\b" + this.classTabHide + "\\b", "gi");

  /* Array of objects holding info about each tab */
  this.tabs = new Array();

  /* If the main tabber div was specified, call init() now */
  if(this.div) {

    this.init(this.div);

    /* We don't need the main div anymore, and to prevent a memory leak
       in IE, we must remove the circular reference between the div
       and the tabber object. */
    this.div = null;
  }
}

/*--------------------------------------------------
  Methods for tabberObj
  --------------------------------------------------*/

tabberObj.prototype.init = function(e) {
  /* Set up the tabber interface.

  e = element (the main containing div)

  Example:
  init(document.getElementById("mytabberdiv")) */

  var
    childNodes, /* child nodes of the tabber div */
    i, i2, /* loop indices */
    t, /* object to store info about a single tab */
    defaultTab = 0,
    /* which tab to select by default */
    DOM_ul, /* tabbernav list */
    DOM_li, /* tabbernav list item */
    DOM_a, /* tabbernav link */
    aId, /* A unique id for DOM_a */
    headingElement; /* searching for text to use in the tab */

  /* Verify that the browser supports DOM scripting */
  if(!document.getElementsByTagName) {
    return false;
  }

  /* If the main DIV has an ID then save it. */
  if(e.id) {
    this.id = e.id;
  }

  /* Clear the tabs array (but it should normally be empty) */
  this.tabs.length = 0;

  /* Loop through an array of all the child nodes within our tabber element. */
  childNodes = e.childNodes;
  for(i = 0; i < childNodes.length; ++i) {

    /* Find the nodes where class="tabbertab" */
    if(childNodes[i].className &&
      childNodes[i].className.match(this.REclassTab)) {

      /* Create a new object to save info about this tab */
      t = new Object();

      /* Save a pointer to the div for this tab */
      t.div = childNodes[i];

      /* Add the new object to the array of tabs */
      this.tabs[this.tabs.length] = t;

      /* If the class name contains classTabDefault,
         then select this tab by default. */
      if(childNodes[i].className.match(this.REclassTabDefault)) {
        defaultTab = this.tabs.length - 1;
      }
    }
  }

  /* Create a new UL list to hold the tab headings */
  DOM_ul = document.createElement("ul");
  DOM_ul.className = this.classNav;

  /* Loop through each tab we found */
  for(i = 0; i < this.tabs.length; ++i) {

    t = this.tabs[i];

    /* Get the label to use for this tab:
       From the title attribute on the DIV,
       Or from one of the this.titleElements[] elements,
       Or use an automatically generated number. */
    t.headingText = t.div.title;
    t.id = t.div.id;

    /* Remove the title attribute to prevent a tooltip from appearing */
    if(this.removeTitle) {
      t.div.title = "";
    }

    if(!t.headingText) {

      /* Title was not defined in the title of the DIV,
         So try to get the title from an element within the DIV.
         Go through the list of elements in this.titleElements
         (typically heading elements ["h2","h3","h4"]) */
      for(i2 = 0; i2 < this.titleElements.length; ++i2) {
        headingElement = t.div.getElementsByTagName(this.titleElements[i2])[0];
        if(headingElement) {
          t.headingText = headingElement.innerHTML;
          if(this.titleElementsStripHTML) {
            t.headingText.replace(/<br>/gi, " ");
            t.headingText = t.headingText.replace(/<[^>]+>/g, "");
          }
          break;
        }
      }
    }

    if(!t.headingText) {
      /* Title was not found (or is blank) so automatically generate a
         number for the tab. */
      t.headingText = i + 1;
    }

    /* Create a list element for the tab */
    DOM_li = document.createElement("li");

    /* Save a reference to this list item so we can later change it to
       the "active" class */
    t.li = DOM_li;

    /* Create a link to activate the tab */
    DOM_a = document.createElement("a");
    DOM_a.appendChild(document.createTextNode(t.headingText));
    DOM_a.href = "javascript:void(null);";
    DOM_a.title = t.headingText;
    DOM_a.addEventListener("click", this.navClick, true);

    /* Add some properties to the link so we can identify which tab
       was clicked. Later the navClick method will need this. */
    DOM_a.tabber = this;
    DOM_a.tabberIndex = i;

    /* Do we need to add an id to DOM_a? */
    if(this.addLinkId && this.linkIdFormat) {

      /* Determine the id name */
      aId = this.linkIdFormat;
      aId = aId.replace(/<tabberid>/gi, this.id);
      aId = aId.replace(/<tabnumberzero>/gi, i);
      aId = aId.replace(/<tabnumberone>/gi, i + 1);
      aId = aId.replace(/<tabtitle>/gi, t.headingText.replace(/[^a-zA-Z0-9\-]/gi, ""));

      DOM_a.id = aId;
    }

    /* Add the link to the list element */
    DOM_li.appendChild(DOM_a);

    /* Add the list element to the list */
    DOM_ul.appendChild(DOM_li);
  }

  /* Add the UL list to the beginning of the tabber div */
  e.insertBefore(DOM_ul, e.firstChild);

  /* Make the tabber div "live" so different CSS can be applied */
  e.className = e.className.replace(this.REclassMain, this.classMainLive);

  /* Activate the default tab, and do not call the onclick handler */
  this.tabShow(defaultTab);

  /* If the user specified an onLoad function, call it now. */
  if(typeof this.onLoad == "function") {
    this.onLoad({
      tabber: this
    });
  }

  return this;
};

tabberObj.prototype.navClick = function(event) {
  /* This method should only be called by the onClick event of an <A>
     element, in which case we will determine which tab was clicked by
     examining a property that we previously attached to the <A>
     element.

     Since this was triggered from an onClick event, the variable
     "this" refers to the <A> element that triggered the onClick
     event (and not to the tabberObj).

     When tabberObj was initialized, we added some extra properties
     to the <A> element, for the purpose of retrieving them now. Get
     the tabberObj object, plus the tab number that was clicked. */

  var
    rVal, /* Return value from the user onclick function */
    a, /* element that triggered the onclick event */
    self, /* the tabber object */
    tabberIndex, /* index of the tab that triggered the event */
    onClickArgs; /* args to send the onclick function */

  a = this;
  if(!a.tabber) {
    return false;
  }

  self = a.tabber;
  tabberIndex = a.tabberIndex;

  /* Remove focus from the link because it looks ugly.
     I don't know if this is a good idea... */
  a.blur();

  /* If the user specified an onClick function, call it now.
     If the function returns false then do not continue. */
  if(typeof self.onClick == "function") {

    onClickArgs = {
      "tabber": self,
      "index": tabberIndex,
      "event": event
    };

    /* IE uses a different way to access the event object */
    if(!event) {
      onClickArgs.event = window.event;
    }

    rVal = self.onClick(onClickArgs);
    if(rVal === false) {
      return false;
    }
  }

  self.tabShow(tabberIndex);

  return false;
};

tabberObj.prototype.tabHideAll = function() {
  var i; /* counter */

  /* Hide all tabs and make all navigation links inactive */
  for(i = 0; i < this.tabs.length; ++i) {
    this.tabHide(i);
  }
};

tabberObj.prototype.tabHide = function(tabberIndex) {
  var div;

  if(!this.tabs[tabberIndex]) {
    return false;
  }

  /* Hide a single tab and make its navigation link inactive */
  div = this.tabs[tabberIndex].div;

  /* Hide the tab contents by adding classTabHide to the div */
  if(!div.className.match(this.REclassTabHide)) {
    div.className += " " + this.classTabHide;
  }
  this.navClearActive(tabberIndex);

  return this;
};

tabberObj.prototype.tabShow = function(tabberIndex) {
  /* Show the tabberIndex tab and hide all the other tabs */

  var div;

  if(!this.tabs[tabberIndex]) {
    return false;
  }

  /* Hide all the tabs first */
  this.tabHideAll();

  /* Get the div that holds this tab */
  div = this.tabs[tabberIndex].div;

  /* Remove classTabHide from the div */
  div.className = div.className.replace(this.REclassTabHide, "");

  /* Mark this tab navigation link as "active" */
  this.navSetActive(tabberIndex);

  /* If the user specified an onTabDisplay function, call it now. */
  if(typeof this.onTabDisplay == "function") {
    this.onTabDisplay({
      "tabber": this,
      "index": tabberIndex
    });
  }

  return this;
};

tabberObj.prototype.navSetActive = function(tabberIndex) {
  /* Note: this method does *not* enforce the rule
     that only one nav item can be active at a time. */

  /* Set classNavActive for the navigation list item */
  this.tabs[tabberIndex].li.className = this.classNavActive;

  return this;
};

tabberObj.prototype.navClearActive = function(tabberIndex) {
  /* Note: this method does *not* enforce the rule
     that one nav should always be active. */

  /* Remove classNavActive from the navigation list item */
  this.tabs[tabberIndex].li.className = "";

  return this;
};

/*==================================================*/

/*
  Création du système d'onglet

  tabberArgs : options des onglets

  rootDiv : élément racine à partir du quel chercher où placer le système d'onglets (ex : document)
*/
function InitTabSystem(tabberArgs, rootDiv) {
  /* This function finds all DIV elements in the document where
     class=tabber.classMain, then converts them to use the tabber
     interface.

     tabberArgs = an object to send to "new tabber()" */
  var tempObj, /* Temporary tabber object */
    divs, /* Array of all divs on the page */
    i; /* Loop index */

  if(!tabberArgs) {
    tabberArgs = {};
  }

  /* Create a tabber object so we can get the value of classMain */
  tempObj = new tabberObj(tabberArgs);

  /* Find all DIV elements in the document that have class=tabber */

  /* First get an array of all DIV elements and loop through them */
  divs = rootDiv.getElementsByTagName("div");

  for(i = 0; i < divs.length; ++i) {
    /* Is this DIV the correct class? */
    if(divs[i].className && divs[i].className.match(tempObj.REclassMain)) {
      /* Now tabify the DIV */
      tabberArgs.div = divs[i];
      divs[i].tabber = new tabberObj(tabberArgs);
    }
  }

  return this;
}

/*
  Prépare le système d'onglets pour le panneau des smileys
*/
function InitTabSystem_ForFullAnswer() {
  InitTabSystem(tabberOptions, document);
}

// =============================================================== //
// Fin script pour faire apparaitre des onglets
// =============================================================== //

Main(); // Exécution du script GreaseMonkey
