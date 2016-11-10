// Variables
var skeleton;
var positions;
var figureScale = 2.2;
var h = 200;
var w = 100;
var gap = 0.6;
var skip = 2;


function draw() {
    // Prep the environment 
    var parent = d3.select("body").select("#c1");

    var svg = parent.append("svg")
        .attr("width", w)
        .attr("height", h);

    // Scale the data
    positions = positions.map(function (f, j) {
        return f.map(function (d, i) {
            return {
                x: (d.x) * figureScale + 80,
                y: -1 * d.y * figureScale + h - 10,
                z: d.z * figureScale
            };
        });
    });

    // Choose the frame to draw
    index = 0; // the index of the frame
    currentFrame = positions[index];

    headJoint = 15;

    var joints = svg.selectAll("circle.joints" + index)
        .data(currentFrame)
        .enter();


    joints.append("circle")
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", function (d, i) {
            if (i == headJoint)
                return 4;
            else
                return 2;
        })
        .attr("fill", function (d, i) {
            return '#555555';
        })
        .attr("opacity", 0.9);

    // Bones
    var bones = svg.selectAll("line.bones" + index)
        .data(skeleton)
        .enter();

    bones.append("line")
        .attr("stroke", "#555555")
        .attr("stroke-width", 1)
        .attr("opacity", 0.9)
        .attr("x1", 0).attr("x2", 0)
        .attr("x1", function (d, j) {
            return currentFrame[d[0]].x;
        })
        .attr("x2", function (d, j) {
            return currentFrame[d[1]].x;
        })
        .attr("y1", function (d, j) {
            return currentFrame[d[0]].y;
        })
        .attr("y2", function (d, j) {
            return currentFrame[d[1]].y;
        });

    window.parent.loaded();
}

// Read the files
$.getJSON("https://omid.al/moveviz/data/Skeleton_Slash.json", function (json) {
    skeleton = json;
    $.getJSON("https://omid.al/moveviz/data/Slash.json", function (json) {
        positions = json;
        draw();
    });
});