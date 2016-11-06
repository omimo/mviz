// Variables
var connectivityMatrix;
var positions;
var figureScale = 2;
var h = 200;
var w = 1200;
var gap = 20;
var skip = 20;

var svg;

function draw() {
    // Prep the environment 
    var parent = d3.select("body").select("#c1");

    svg = parent.append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("overflow", "scroll");

    // Scale the data
    index = 30;

    frames = positions.map(function (ff, j) {
        return ff.map(function (d, i) {
            return {
                x: (d.x + 70) * figureScale,
                y: -1 * d.y * figureScale + h - 10,
                z: d.z * figureScale
            };
        });
    });

    currentFrame = frames[index];
    // Joints
    headJoint = 7;

    // Joints
    svg.selectAll("g")
        .data(frames.filter(function (d, i) {
            return i % skip == 0;
        }))
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(" + (i * gap) + ",0)";
        })
        .selectAll("circle.joints")
        .data(function (d, i) {
            return d
        })
        .enter()
        .append("circle")
        .attr("fill-opacity", "0.95")
        .attr("cx", function (d) {
            return d.x;
        }).attr("cy", function (d) {
            return d.y;
        }).attr("r", function (d, i) {
            if (i == headJoint)
                return 4;
            else
                return 2;
        }).attr("fill", function (d, i) {
            return '#555555';
        });


    // Bones
    svg.selectAll("g2")
        .data(frames.filter(function (d, i) {
            return i % skip == 0;
        }))
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(" + (i * gap) + ",0)";
        })
        .selectAll("line.bones")
        .data(skeleton)
        .enter()
        .append("line")
        .attr("stroke-opacity", "0.95")
        .attr("stroke", "grey")
        .attr("stroke-width", 1)
        .attr("x1", 0).attr("x2", 0)
        .attr("x1", function (d, j, k) {
            return frames[k * skip][d[0]].x;
        })
        .attr("x2", function (d, j, k) {
            return frames[k * skip][d[1]].x;
        })
        .attr("y1", function (d, j, k) {
            return frames[k * skip][d[0]].y;
        })
        .attr("y2", function (d, j, k) {
            return frames[k * skip][d[1]].y;
        });

    window.parent.loaded();
}

// Read the files
$.getJSON("http://omid.al/moveviz/data/Skeleton_BEA.json", function (json) {
    skeleton = json;
    $.getJSON("http://omid.al/moveviz/data/BEA1.json", function (json) {
        positions = json;
        draw();
    });
});