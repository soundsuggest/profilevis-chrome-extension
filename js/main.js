/*
 * Part of the SoundSuggest project. For more info consult:
 * http://soundsuggest.wordpress.com/ . Written by
 * Joris Schelfaut.
 */

var user = document.location.toString().split("user/")[1];
var active_user         = $('#idBadgerUser').attr('href').split("user/")[1];
var dataset             = {};
var matrix              = [];
var range               = [];
var range_artists       = [];
var N                   = 0;
var limit               = 20;
var artist_playcount    = {};
var svg;
var width               = 618;
var height              = 550;
var color_co_owned      = "#660066";
var color_user          = "#CC0000";
var color_active_user   = "#000099";

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
            buildVisualization();
        });
    });
});

function setDIV() {
    $('<div id="soundsuggest">'
            + '<h2 class="heading"><span class="h2Wrapper">Top artists diagram</span></h2>'
            + '<p>This diagram indicates which top artists you have in common with <strong>'
            + user
            + '</strong></p><br />'
            + '<div id="soundsuggest-chart"></div>'
            + '<br />'
            + '<p>This application is part of a tutorial that can be found '
            + '<a href="http://soundsuggest.wordpress.com/2012/12/28/google-chrome-extensions-example-project/" title="soundsuggest.wordpress.com" target="_blank">here</a>.</p>'
            + '</div>').insertBefore('#recentTracks');
}

function updateDat(data, usr) {
    for (var i = 0; i < data.topartists.artist.length; i++) {
        if (! dataset[data.topartists.artist[i].name])
            dataset[data.topartists.artist[i].name] = new Array();
        dataset[data.topartists.artist[i].name].push(usr);
    }
    for (var i = 0; i < data.topartists.artist.length; i++) {
        if (! artist_playcount[data.topartists.artist[i].name])
            artist_playcount[data.topartists.artist[i].name] = Number(0);
        artist_playcount[data.topartists.artist[i].name] = Number(data.topartists.artist[i].playcount) + Number(artist_playcount[data.topartists.artist[i].name]);
    }
}

function setRange() {
    for (var key in dataset) {
        range_artists.push(key);
    }

    for (var key in dataset) {
        if (dataset[key].length == 2) {
            range.push(color_co_owned);
        } else if (dataset[key][0] == user) {
            range.push(color_user);
        } else if (dataset[key][0] == active_user) {
            range.push(color_active_user);
        } else {
            console.error("Undefined user [" + dataset[key][0] + "] for artist [" + key + "].");
        }
    }
}

function buildMatrix() {

    N = Object.keys(dataset).length;
    matrix = new Array(N);
    for (var i = 0; i < N; i++) {
        matrix[i] = new Array(N);
    }

    var index1 = 0;
    var index2 = 0;
    for (var key1 in dataset) {
        if (dataset[key1].length == 2) {
            index2 = 0;
            for (var key2 in dataset) {
                if ((dataset[key2].length == 2) && (key1 != key2)) {
                    matrix[index1][index2] = Number(artist_playcount[key1]) + Number(artist_playcount[key2]);
                } else if ((dataset[key2].length == 1) && (key1 != key2)) {
                    matrix[index1][index2] = Number(artist_playcount[key1]) + Number(artist_playcount[key2]);
                } else {
                    matrix[index1][index2] = 0;
                }
                index2++;
            }
        } else if (dataset[key1].length == 1) {
            index2 = 0;
            for (var key2 in dataset) {
                if ((dataset[key2].length == 1) && (key1 != key2) && (dataset[key1][0] == dataset[key2][0])) {
                    matrix[index1][index2] = Number(artist_playcount[key1]) + Number(artist_playcount[key2]);
                } else {
                    matrix[index1][index2] = 0;
                }
                index2++;
            }
        } else {
            index2 = 0;
            for (var key2 in dataset) {
                matrix[index1][index2] = 0;
                index2++;
            }
        }
        index1++;
    }
}

function buildVisualization() {
    
    setRange();
    buildMatrix();

    svg = d3.select("#soundsuggest-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var chord = d3.layout.chord()
            .padding(.05)
            .sortSubgroups(d3.descending)
            .matrix(matrix);

    var fill = d3.scale.ordinal()
            .domain(d3.range(range.length))
            .range(range);

    var innerRadius = Math.min(width - 220, height - 220) * .41;
    var outerRadius = innerRadius * 1.1;

    svg.append("g")
            .selectAll("path")
            .data(chord.groups)
            .enter().append("path")
            .style("fill", function(d) {
                return fill(d.index);
            })
            .style("stroke", function(d) {
                return fill(d.index);
            })
            .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
            .on("mouseover", fade(.1))
            .on("mouseout", fade(1));

    var ticks = svg.append("g").selectAll("g")
            .data(chord.groups)
            .enter().append("g").selectAll("g")
            .data(groupTicks)
            .enter().append("g")
            .attr("transform", function(d) {
                return  "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                        + "translate(" + outerRadius + ",0)";
            });

    ticks.append("line")
            .attr("x1", 1)
            .attr("y1", 0)
            .attr("x2", 5)
            .attr("y2", 0)
            .style("stroke", "#000");

    ticks.append("text")
            .attr("x", 8)
            .attr("dy", ".35em")
            .attr("transform", function(d) {
                return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
            })
            .style("text-anchor", function(d) {
                return d.angle > Math.PI ? "end" : null;
            })
            .text(function(d) {
                return d.label;
            });

    svg.append("g")
            .attr("class", "chord")
            .selectAll("path")
            .data(chord.chords)
            .enter().append("path")
            .attr("d", d3.svg.chord().radius(innerRadius))
            .style("fill", function(d) {
                return fill(d.target.index);
            })
            .style("opacity", 1);
}


// Returns an array of tick angles and labels, given a group.
function groupTicks(d) {
    var k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, 1, 2).map(function(v, i) {
        return {
            angle: v * k + d.startAngle,
            label: range_artists[d.index]
        };
    });
}

function fade(opacity) {
    return function(g, i) {
        svg.selectAll("g.chord path")
                .filter(function(d) {
                    return d.source.index != i && d.target.index != i;
                })
                .transition()
                .style("opacity", opacity);
    };
}
