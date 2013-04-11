function buildVisualization(dataset, user, active_user) {
    
    var width   = 618;
    var height  = 550;
    var artists = [];
    
    var range = setRange(dataset, user, active_user);
    var matrix = buildMatrix(dataset, matrix);
    
    for (var key in dataset) {
        artists.push(key);
    }
    
    var svg = d3.select("#profilevis-chart")
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
    
    function groupTicks(d) {
        var k = (d.endAngle - d.startAngle) / d.value;
        return d3.range(0, 1, 2).map(function(v, i) {
            return {
                angle: v * k + d.startAngle,
                label: artists[d.index]
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
}

function buildMatrix(dataset, matrix) {
    
    var N = Object.keys(dataset).length;
    matrix = new Array(N);
    for (var i = 0; i < N; i++) {
        matrix[i] = new Array(N);
    }
    
    var index1 = 0;
    var index2 = 0;
    for (var key1 in dataset) {
        if (Number(dataset[key1].users.length) === Number(2)) {
            index2 = 0;
            for (var key2 in dataset) {
                if ((Number(dataset[key2].users.length) === Number(2)) && (key1 != key2)) {
                    matrix[index1][index2] = Number(dataset[key1].totalvalue) + Number(dataset[key2].totalvalue);
                } else if ((Number(dataset[key2].users.length) === Number(1)) && (key1 != key2)) {
                    matrix[index1][index2] = Number(dataset[key1].totalvalue) + Number(dataset[key2].totalvalue);
                } else {
                    matrix[index1][index2] = 0;
                }
                index2++;
            }
        } else if (Number(dataset[key1].users.length) === Number(1)) {
            index2 = 0;
            for (var key2 in dataset) {
                if ((Number(dataset[key2].users.length) === Number(1)) && (key1 != key2) && (dataset[key1].users[0] == dataset[key2].users[0])) {
                    matrix[index1][index2] = Number(dataset[key1].totalvalue) + Number(dataset[key2].totalvalue);
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
    return matrix;
}

function setRange(dataset, user, active_user) {
    
    var color_co_owned      = "#660066";
    var color_user          = "#CC0000";
    var color_active_user   = "#000099";
    var range = [];
    
    for (var key in dataset) {
        if (Number(dataset[key].users.length) === Number(2)) {
            range.push(color_co_owned);
        } else if (dataset[key].users[0] == user) {
            range.push(color_user);
        } else if (dataset[key].users[0] == active_user) {
            range.push(color_active_user);
        } else {
            console.error("Undefined user [" + dataset[key].users[0] + "] for artist [" + key + "].");
        }
    }
    return range;
}