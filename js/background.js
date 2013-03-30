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
chrome.extension.onMessage.addListener(loadTopArtists);


// GLOBAL VARIABLES AND CONSTANTS :
// --------------------------------
var api_key     = '828c109e6a54fffedad5177b194f7107';
var api_secret  = '7c2f09e6eb84e8a6183c59e0bc574f70';
var cache       = new LastFMCache();
var lastfm      = new LastFM({
    apiKey    : api_key,
    apiSecret : api_secret,
    cache     : cache
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
 * Loads the top artists for given users
 * @param {type} request
 * @param {type} sender
 * @param {type} sendResponse
 * @returns {undefined}
 */
function loadTopArtists(request, sender, sendResponse) {
    if (request.action == 'user.gettopartists') {
        console.log("user        : " + request.data.user);
        lastfm.user.getTopArtists({
            user    : request.data.user,
            limit   : request.data.limit
        }, {
            success : function(data) {
                for (var i = 0; i < data.topartists.artist.length; i++) {
                    console.log("data.topartists.artist[" + i + "] = "
                            + data.topartists.artist[i].name);
                }
                sendResponse({ data : data });
            },
            error   : function(error, msg) {
                console.log(error + " : " + msg);
            }
        });
        return true;
    }
};