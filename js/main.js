/*
 * Part of the SoundSuggest project. For more info consult:
 * http://soundsuggest.wordpress.com/ . Written by
 * Joris Schelfaut.
 */

var user = document.location.toString().split("user/")[1];
var active_user         = $('#idBadgerUser').attr('href').split("user/")[1];
var dataset             = {};
var limit               = 20;

$(document).ready(function() {
    lastfm.api.chrome.user.getTopArtists({
        user    : user,
        limit   : limit
    },
    function(response1) {
        updateDat(response1, user);
        lastfm.api.chrome.user.getTopArtists({
            user    : active_user,
            limit   : limit
        },
        function(response2) {
            updateDat(response2, active_user);
            setDIV();
            buildVisualization(dataset, user, active_user);
        });
    });
});

function setDIV() {
    $('<div id="profilevis">'
            + '<h2 class="heading"><span class="h2Wrapper">Top artists diagram</span></h2>'
            + '<p>This diagram indicates which top artists you have in common with <strong>'
            + user
            + '</strong></p><br />'
            + '<div id="profilevis-chart"></div>'
            + '<br />'
            + '<p>This application is part of a tutorial that can be found '
            + '<a href="http://soundsuggest.wordpress.com/2012/12/28/google-chrome-extensions-example-project/" title="soundsuggest.wordpress.com" target="_blank">here</a>.</p>'
            + '</div>').insertBefore('#recentTracks');
}

function updateDat(data, usr) {
    for (var i = 0; i < data.topartists.artist.length; i++) {
        if (! dataset[data.topartists.artist[i].name]) {
            dataset[data.topartists.artist[i].name] = {
                item        : data.topartists.artist[i].name,
                users       : new Array(),
                totalvalue  : Number(0)
            };
        }
        dataset[data.topartists.artist[i].name].users.push(usr);
        dataset[data.topartists.artist[i].name].totalvalue = Number(data.topartists.artist[i].playcount) + Number(dataset[data.topartists.artist[i].name].totalvalue);
    }
}
