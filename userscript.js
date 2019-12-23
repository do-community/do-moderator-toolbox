// ==UserScript==
// @name         DO Moderator Toolbox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A useful set of moderator tools for the DO Community team
// @author       DigitalOcean
// @match        https://www.digitalocean.com/community
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var host = 'http://localhost:8000/';
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function() { window.runModeratorToolbox(); };
    script.src = host + 'index.js';
    document.getElementsByTagName('head')[0].appendChild(script);
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = host + 'index.css';
    document.getElementsByTagName('head')[0].appendChild(link);
})();
