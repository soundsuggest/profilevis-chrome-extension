Last.fm Profile visualizer Chrome Extension
===========================================

About :
-------

A chrome extension that is injected into a last.fm profile page to compare the active user with the current user based on the listening history and artists in their respective profile.

The application retrieves the Last.fm user that active user is visiting (last.fm/user/*). Then it gets the top artists for that user and the top artists for the active user and visualizes similarities in these profiles.

The Last.fm API can be found at http://www.last.fm/api . The JavaScript library by F. Bruns (http://lastfm.felixbruns.de/javascript-last.fm-api/) is used in this project.

A chord diagram is created based on a matrix: for each row corresponding to an artist, a link is established using the value of each column corresponding to the other artists. The source code for this visualization is based on a a JavaScript script by Michael Bostock (http://d3js.org/ and https://github.com/mbostock/d3), which can be found at http://bl.ocks.org/4062006 . For more info on chord diagrams: http://circos.ca/ .

This application is written by Joris Schelfaut. For more information consult http://soundsuggest.wordpress.com/ .

Download :
----------

The resulting Chrome Extension application can be found here :
https://chrome.google.com/webstore/detail/lastfm-profile-visualizer/oolohiafdhdhbaaemoccapejdjiplnae


Useful links :
--------------

GOOGLE CHROME EXTENSIONS
************************

Overview :
http://developer.chrome.com/extensions/overview.html

Manifest :
http://developer.chrome.com/extensions/manifest.html

Page action :
http://developer.chrome.com/extensions/pageAction.html

Content scripts :
http://developer.chrome.com/extensions/content_scripts.html

Security policy :
http://developer.chrome.com/trunk/extensions/contentSecurityPolicy.html

Google Chrome Extensions Manager :
chrome://chrome/extensions/


LAST.FM API :
*************

Last.fm API :
http://www.last.fm/api


D3.JS LIBRARY
*************

Website :
http://d3js.org/

Github :
https://github.com/mbostock/d3

Documentation :
https://github.com/mbostock/d3/wiki

Chord diagram example :
http://bl.ocks.org/4062006



JQUERY LIBRARY
**************

Website :
http://jquery.com/



SOUNDSUGGEST
************

Website / blog :
http://soundsuggest.wordpress.com/

Blog post on this Chrome Extension
http://soundsuggest.wordpress.com/2012/12/28/google-chrome-extensions-example-project/

Github :
https://github.com/JorisSchelfaut/soundsuggest

Youtube :
http://www.youtube.com/user/soundsuggest