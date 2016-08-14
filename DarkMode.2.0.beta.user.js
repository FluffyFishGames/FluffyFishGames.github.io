// ==UserScript==
// @name JuhNau DarkMode 2.0
// @description Explore JuhNau with some extra spice!
// @version 0.8.6c
// @match *://younow.com/*
// @match *://www.younow.com/*
// @namespace https://github.com/FluffyFishGames/JuhNau-Darkmode
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_listValues
// @updateURL https://FluffyFishGames.github.io/DarkMode.2.0.beta.user.js
// @downloadURL https://FluffyFishGames.github.io/DarkMode.2.0.beta.user.js
// @run-at   document-start
// ==/UserScript==

var badScripts = [
    "https://cdn.younow.com/angularjsapp/build/app/younow.js",
    "https://cdn.younow.com/angularjsapp/build/core/core.js",
    "https://cdn.younow.com/angularjsapp/build/app/vendor.js"
];

var inWindow = function()
{
    window.darkMode = {
		'version': '0.8.6c',
		'base': 'https://fluffyfishgames.github.io/'
	};
};

inWindow();
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ inWindow +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

if (window.chrome)
{
    var url = window.location.href;
    var ind = url.indexOf("?");
    if (ind > -1)
        var base = url.substring(0, ind);
    else 
        var base = url;
    var _params = url.substring(ind + 1);
    var _params = _params.split("&");
    var params = {};
    for (var i = 0; i < _params.length; i++)
    {
        var split = _params[i].split("=");
        params[split[0]] = split[1];
        GM_setValue(split[0], split[1]);
    }

    if (base.endsWith(".html"))
    {
        document.body.style.background = "#000000";
        document.body.style.color = "#ffffff";
        document.body.innerHTML = "Loading Dark Mode...";
        var oldURL = GM_getValue("redirectFrom");
        // load the html from github
        var xobj = new XMLHttpRequest();
        xobj.open('GET', window.darkMode.base+'html.html?rand='+Math.random()*10000000000, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") 
            {
                window.history.pushState({"html": document.documentElement.outerHTML, "pageTitle": ""}, "", oldURL);
                var newHTML = xobj.responseText;
                newHTML = newHTML.replace("%BUILDJS%", window.darkMode.base+"build.min.js?rand="+Math.random() * 1000000000);
                document.write(newHTML);
                document.close();
            }
        };
        xobj.send(null);  
    }
    else if (!(base.indexOf(".php") > 0))
    {
        var url = base;
        GM_setValue("redirectFrom", url);
        window.location.href = "https://www.younow.com/"+(Math.random()*100000)+".html";
    }
}
else 
{
    window.addEventListener('beforescriptexecute', function(e) {
        src = e.target.src;
		for (var i = 0; i < badScripts.length; i++)
		{
			if (src.startsWith(badScripts[i]))
			{
				e.preventDefault();
				e.stopPropagation();
				e.target.remove();
			}
		}
    }, true);
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = window.darkMode.base+"build.min.js?rand="+Math.random() * 1000000000;
    document.head.appendChild(script);
}