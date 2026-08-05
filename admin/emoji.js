/*
 * Sélecteur d'emoji pour le back-office.
 * Decap n'en fournit pas ; celui-ci s'ajoute par-dessus sans toucher au CMS.
 *
 * Deux mécanismes d'insertion, selon le champ visé :
 *  - champs simples (titre, résumé, légendes) : execCommand('insertText'),
 *    que React reçoit comme une frappe et enregistre ;
 *  - éditeur riche de l'article : un événement de collage, seul chemin que
 *    Slate intercepte. Écrire dans le DOM y est ignoré puis effacé.
 * Vérifié dans le back-office réel : l'aperçu — qui ne reflète que l'état
 * enregistré — affiche bien l'emoji dans les deux cas.
 */
(function () {
  'use strict';

  var EMOJIS = [
    ['Studio', [
      ['📸', 'appareil photo photographie'], ['📷', 'appareil photo'], ['🎥', 'camera video film'],
      ['🎬', 'clap tournage cinema'], ['🎞️', 'pellicule film'], ['🖼️', 'cadre tableau image'],
      ['💡', 'lumiere ampoule idee'], ['🔦', 'lampe torche lumiere'], ['🎙️', 'micro podcast studio'],
      ['🎧', 'casque audio son'], ['🎵', 'musique note'], ['🔊', 'son haut-parleur'],
      ['💻', 'ordinateur montage'], ['🖥️', 'ecran moniteur'], ['⚙️', 'reglage engrenage'],
      ['🔋', 'batterie'], ['💾', 'carte memoire sauvegarde'], ['📀', 'disque'],
    ]],
    ['Visages', [
      ['🙂', 'sourire content'], ['😊', 'sourire heureux'], ['😀', 'rire joie'],
      ['😍', 'amour yeux coeur'], ['🤩', 'etoiles admiration'], ['😎', 'lunettes cool'],
      ['🥳', 'fete celebration'], ['🤗', 'calin accueil'], ['🙏', 'merci priere svp'],
      ['😉', 'clin oeil'], ['🤔', 'reflexion penser'], ['😅', 'gene rire'],
      ['🥰', 'tendresse amour'], ['😌', 'soulage calme'], ['🫶', 'coeur mains'],
    ]],
    ['Gestes', [
      ['👋', 'salut bonjour'], ['👋🏾', 'salut bonjour'], ['👍', 'pouce bien ok'], ['👍🏾', 'pouce bien ok'],
      ['👏', 'applaudir bravo'], ['👏🏾', 'applaudir bravo'], ['✌️', 'paix victoire'],
      ['🤝', 'poignee main accord'], ['💪', 'force bras'], ['💪🏾', 'force bras'],
      ['👀', 'yeux regarder'], ['✍️', 'ecrire'], ['🫱🏾‍🫲🏼', 'poignee main'],
    ]],
    ['Cœurs', [
      ['❤️', 'coeur rouge amour'], ['🧡', 'coeur orange'], ['💛', 'coeur jaune'],
      ['💚', 'coeur vert'], ['💙', 'coeur bleu'], ['🤍', 'coeur blanc'],
      ['🖤', 'coeur noir'], ['💛', 'coeur or'], ['✨', 'etincelles brillant'],
      ['💍', 'bague mariage'], ['💐', 'bouquet fleurs mariage'], ['🥂', 'trinquer fete'],
    ]],
    ['Nature', [
      ['🌞', 'soleil jour'], ['☀️', 'soleil'], ['🌅', 'lever soleil aube'],
      ['🌇', 'coucher soleil'], ['🌙', 'lune nuit'], ['⭐', 'etoile'],
      ['🌿', 'feuille plante'], ['🌳', 'arbre'], ['🌸', 'fleur'],
      ['🔥', 'feu chaud'], ['💧', 'eau goutte'], ['🌊', 'vague mer'],
      ['🏔️', 'montagne'], ['🌍', 'terre monde afrique'], ['🌧️', 'pluie'],
    ]],
    ['Lieux & voyage', [
      ['✈️', 'avion voyage'], ['🚗', 'voiture route'], ['🏠', 'maison'],
      ['⛪', 'eglise culte'], ['🏛️', 'batiment institution'], ['🎪', 'evenement chapiteau'],
      ['🇹🇬', 'togo drapeau'], ['🇩🇪', 'allemagne drapeau'], ['🇫🇷', 'france drapeau'],
      ['🇬🇧', 'royaume uni drapeau'], ['🇪🇺', 'europe drapeau'],
    ]],
    ['Repères', [
      ['✅', 'valide coche oui'], ['❌', 'croix non erreur'], ['⚠️', 'attention avertissement'],
      ['➡️', 'fleche droite suite'], ['⬅️', 'fleche gauche'], ['🔗', 'lien'],
      ['📌', 'punaise important'], ['📍', 'lieu position'], ['📅', 'date calendrier'],
      ['⏱️', 'temps chrono duree'], ['💬', 'commentaire bulle'], ['📩', 'message courrier'],
      ['📞', 'telephone appel'], ['🎯', 'cible objectif'], ['🏆', 'trophee reussite'],
      ['1️⃣', 'un chiffre'], ['2️⃣', 'deux chiffre'], ['3️⃣', 'trois chiffre'],
    ]],
  ];

  var cible = null;
  var position = null; // Range pour l'éditeur riche, indices pour un champ simple.

  function estChampTexte(el) {
    return !!el && (el.isContentEditable || el.tagName === 'TEXTAREA' ||
      (el.tagName === 'INPUT' && /^(text|search|url)$/i.test(el.type || 'text')));
  }

  function memoriser(el) {
    if (!estChampTexte(el) || el.closest('#bewegt-emoji')) return;
    cible = el;
    if (el.isContentEditable) {
      var sel = window.getSelection();
      // Sans cela, focus() replacerait le curseur au tout début du texte.
      if (sel && sel.rangeCount && el.contains(sel.anchorNode)) position = sel.getRangeAt(0).cloneRange();
    } else {
      position = { debut: el.selectionStart, fin: el.selectionEnd };
    }
  }

  document.addEventListener('focusin', function (e) { memoriser(e.target); });
  // Le curseur bouge sans changement de focus : on suit aussi la sélection.
  document.addEventListener('selectionchange', function () {
    memoriser(document.activeElement);
  });

  function restaurer() {
    cible.focus();
    if (cible.isContentEditable && position && position.startContainer &&
        document.body.contains(position.startContainer)) {
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(position);
    } else if (!cible.isContentEditable && position && typeof position.debut === 'number') {
      cible.setSelectionRange(position.debut, position.fin);
    }
  }

  function inserer(caractere) {
    if (!cible || !document.body.contains(cible)) {
      alert('Clique d’abord dans le texte, à l’endroit où tu veux l’emoji.');
      return;
    }
    restaurer();

    // L'éditeur riche (Slate) tient son propre modèle du texte : écrire dans le
    // DOM y est ignoré et effacé au premier rafraîchissement. Le collage, lui,
    // est intercepté et enregistré. Vérifié dans le back-office réel.
    if (cible.isContentEditable) {
      try {
        var dt = new DataTransfer();
        dt.setData('text/plain', caractere);
        var traite = !cible.dispatchEvent(
          new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })
        );
        if (traite) return;
      } catch (err) { /* navigateur sans ClipboardEvent constructible */ }
    }

    // Champs simples : insertText suit le chemin d'une frappe, React enregistre.
    var ok = document.execCommand && document.execCommand('insertText', false, caractere);
    if (!ok && 'setRangeText' in cible) {
      var d = cible.selectionStart || 0;
      cible.setRangeText(caractere, d, cible.selectionEnd || d, 'end');
      cible.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function construire() {
    var style = document.createElement('style');
    style.textContent = [
      '#bewegt-emoji{position:fixed;right:18px;bottom:18px;z-index:99999;font-family:system-ui,sans-serif}',
      '#bewegt-emoji .ouvrir{width:46px;height:46px;border-radius:999px;border:1px solid rgba(0,0,0,.15);background:#fff;box-shadow:0 6px 20px rgba(0,0,0,.18);font-size:22px;cursor:pointer;line-height:1}',
      '#bewegt-emoji .panneau{display:none;position:absolute;right:0;bottom:56px;width:330px;max-height:60vh;overflow:auto;background:#fff;border:1px solid rgba(0,0,0,.12);border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.22);padding:12px}',
      '#bewegt-emoji.ouvert .panneau{display:block}',
      '#bewegt-emoji input{width:100%;padding:8px 10px;margin-bottom:10px;border:1px solid rgba(0,0,0,.18);border-radius:8px;font-size:14px}',
      '#bewegt-emoji h4{margin:12px 0 6px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;font-weight:700}',
      '#bewegt-emoji .grille{display:grid;grid-template-columns:repeat(8,1fr);gap:2px}',
      '#bewegt-emoji .grille button{font-size:20px;line-height:1;padding:5px 0;border:0;background:none;cursor:pointer;border-radius:6px}',
      '#bewegt-emoji .grille button:hover{background:rgba(0,0,0,.07)}',
      '#bewegt-emoji .vide{color:#888;font-size:13px;padding:8px 2px}',
    ].join('');
    document.head.appendChild(style);

    var boite = document.createElement('div');
    boite.id = 'bewegt-emoji';
    var bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'ouvrir';
    bouton.textContent = '🙂';
    bouton.title = 'Insérer un emoji';
    bouton.setAttribute('aria-label', 'Insérer un emoji');

    var panneau = document.createElement('div');
    panneau.className = 'panneau';
    var recherche = document.createElement('input');
    recherche.type = 'search';
    recherche.placeholder = 'Chercher : soleil, mariage, coeur…';
    var listes = document.createElement('div');
    panneau.appendChild(recherche);
    panneau.appendChild(listes);
    boite.appendChild(panneau);
    boite.appendChild(bouton);
    document.body.appendChild(boite);

    function dessiner(filtre) {
      listes.textContent = '';
      var f = (filtre || '').trim().toLowerCase();
      var total = 0;
      EMOJIS.forEach(function (groupe) {
        var trouves = groupe[1].filter(function (e) { return !f || e[1].indexOf(f) !== -1; });
        if (!trouves.length) return;
        total += trouves.length;
        var titre = document.createElement('h4');
        titre.textContent = groupe[0];
        var grille = document.createElement('div');
        grille.className = 'grille';
        trouves.forEach(function (e) {
          var b = document.createElement('button');
          b.type = 'button';
          b.textContent = e[0];
          b.title = e[1];
          b.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
          b.addEventListener('click', function () { inserer(e[0]); });
          grille.appendChild(b);
        });
        listes.appendChild(titre);
        listes.appendChild(grille);
      });
      if (!total) {
        var vide = document.createElement('p');
        vide.className = 'vide';
        vide.textContent = 'Aucun emoji pour « ' + filtre +' ».';
        listes.appendChild(vide);
      }
    }

    bouton.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
    bouton.addEventListener('click', function () { boite.classList.toggle('ouvert'); });
    recherche.addEventListener('input', function () { dessiner(recherche.value); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') boite.classList.remove('ouvert');
    });
    document.addEventListener('click', function (e) {
      if (!boite.contains(e.target)) boite.classList.remove('ouvert');
    });

    dessiner('');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', construire);
  else construire();
})();
