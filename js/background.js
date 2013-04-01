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

// LISTENERS :
// -----------
/* 
 * Listen for any changes to the URL of any tab.
 */
chrome.tabs.onUpdated.addListener(checkForValidUrl);
/*
 * The onMessage method is a part of chrome.extension
 * http://developer.chrome.com/extensions/extension.html
 */
chrome.extension.onMessage.addListener(doAction);


// GLOBAL VARIABLES AND CONSTANTS :
// --------------------------------
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

// FUNCTIONS :
// -----------
/**
 * Called when the url of a tab changes.
 * @param {type} tabId
 * @param {type} changeInfo
 * @param {type} tab
 * @returns {undefined}
 */
function checkForValidUrl(tabId, changeInfo, tab) {
    // Show the page action in the tab if the URL contains 'last.fm' and 'user'
    if (tab.url.indexOf('last.fm/user/') > -1) {
        chrome.pageAction.show(tabId);
    }
};

/**
 * Performs an action with given action name.
 * @param {Object} request
 * @param {Object} sender
 * @param {function} sendResponse
 * @returns {boolean}
 */
function doAction(request, sender, sendResponse) {
    if (request.action === 'user.getTopArtists') {
        lastfm.user.getTopArtists({
            user    : request.params.user,
            limit   : request.params.limit
        }, {
            success : function(data) {
                console.log("Successfully received last.fm data.");
                sendResponse(data);
            },
            error   : function(error, msg) {
                console.error(error + " : " + msg);
            }
        });
        return true;
    }
};