/*
 * Part of the SoundSuggest project. For more info consult:
 * http://soundsuggest.wordpress.com/ . Written by
 * Joris Schelfaut.
 */

/*
 * NOTE : to make this file work, you'll need to change the
 * URL used in "js/lib/lastfm/lastfm.api.js" from
 * http://ws.audioscrobbler.com/2.0/ to https://ws.audioscrobbler.com/2.0/ ,
 * as Chrome Extensions only allow HTTPS calls, as specified in
 * "manifest.json" under  "content_security_policy" : "script-src 'self'
 * https://ws.audioscrobbler.com/2.0/; object-src 'self'".
 * 
 */

chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.extension.onMessage.addListener(doAction);

var api_key     = '828c109e6a54fffedad5177b194f7107';
var api_secret  = '7c2f09e6eb84e8a6183c59e0bc574f70';
var url         = 'https://ws.audioscrobbler.com/2.0/';
var cache       = new LastFMCache();
var lastfm      = new LastFM({
    apiKey    : api_key,
    apiSecret : api_secret,
    cache     : cache,
    apiUrl    : url
});

function checkForValidUrl(tabId, changeInfo, tab) {
    if (tab.url.indexOf('last.fm/user/') > -1) {
        chrome.pageAction.show(tabId);
    }
};

function doAction(request, sender, sendResponse) {
    if (request.action === 'user.getTopArtists') {
        lastfm.user.getTopArtists({
            user    : request.params.user,
            limit   : request.params.limit
        }, {
            success : function(data) {
                sendResponse(data);
            },
            error   : function(error, msg) {
                console.error(error + " : " + msg);
            }
        });
        return true;
    }
};