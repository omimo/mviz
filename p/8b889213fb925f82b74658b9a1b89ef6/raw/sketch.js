// Variables
var connectivityMatrix;
var positions;
var figureScale = 2.2;
var h = 270;
var w = 1000;
var gap = 0.6;
var skip = 2;

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
    positions.splice(0, 160);
    positions.splice(positions.length - 490, 490);

    frames = positions.map(function (ff, j) {
        return ff.map(function (d, i) {
            return {
                x: (d.x + 70) * figureScale,
                y: -1 * d.y * figureScale + h - 10,
                z: d.z * figureScale
            };
        });
    });

    // Joints
    headJoint = 7;

    svg.selectAll("g.joints")
        .data(frames.filter(function (d, i) {
            return i % skip == 0;
        }))
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(" + (i * gap) + ",0)";
        })
        .selectAll("circle.f" + index)
        .data(function (d, i) {
            return d
        })
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return d.x;
        }).attr("cy", function (d) {
            return d.y;
        }).attr("r", function (d, i) {
            if (i == headJoint || i == 28 || i == 21 || i == 13 || i == 33)
                return 1;
            else
                return 0;
        }).attr("fill", function (d, i, k) {
            if (k > 0 && i == 7) {
                spx = Math.abs(frames[k * skip][i].x - frames[(k - 1) * skip][i].x);
                spy = Math.abs(frames[k * skip][i].y - frames[(k - 1) * skip][i].y);
                spz = Math.abs(frames[k * skip][i].z - frames[(k - 1) * skip][i].z);
                sp = Math.sqrt(Math.pow(spx, 2) + Math.pow(spy, 2) + Math.pow(spz, 2));
                return d3.hsl(190, 1, 1 - Math.min(1, sp / 3));
            } else if (k > 0 && i == 28) {
                spx = Math.abs(frames[k * skip][i].x - frames[(k - 1) * skip][i].x);
                spy = Math.abs(frames[k * skip][i].y - frames[(k - 1) * skip][i].y);
                spz = Math.abs(frames[k * skip][i].z - frames[(k - 1) * skip][i].z);
                sp = Math.sqrt(Math.pow(spx, 2) + Math.pow(spy, 2) + Math.pow(spz, 2));
                return d3.hsl(210, 1, 1 - Math.min(1, sp / 2));
            } else if (k > 0 && i == 21) {
                spx = Math.abs(frames[k * skip][i].x - frames[(k - 1) * skip][i].x);
                spy = Math.abs(frames[k * skip][i].y - frames[(k - 1) * skip][i].y);
                spz = Math.abs(frames[k * skip][i].z - frames[(k - 1) * skip][i].z);
                sp = Math.sqrt(Math.pow(spx, 2) + Math.pow(spy, 2) + Math.pow(spz, 2));
                return d3.hsl(339, 1, 1 - Math.min(1, sp / 3));
            } else if (k > 0 && i == 13) {
                spx = Math.abs(frames[k * skip][i].x - frames[(k - 1) * skip][i].x);
                spy = Math.abs(frames[k * skip][i].y - frames[(k - 1) * skip][i].y);
                spz = Math.abs(frames[k * skip][i].z - frames[(k - 1) * skip][i].z);
                sp = Math.sqrt(Math.pow(spx, 2) + Math.pow(spy, 2) + Math.pow(spz, 2));
                return d3.hsl(210, 1, 1 - Math.min(1, sp / 3));
            } else if (k > 0 && i == 33) {
                spx = Math.abs(frames[k * skip][i].x - frames[(k - 1) * skip][i].x);
                spy = Math.abs(frames[k * skip][i].y - frames[(k - 1) * skip][i].y);
                spz = Math.abs(frames[k * skip][i].z - frames[(k - 1) * skip][i].z);
                sp = Math.sqrt(Math.pow(spx, 2) + Math.pow(spy, 2) + Math.pow(spz, 2));
                return d3.hsl(339, 1, 1 - Math.min(1, sp * 2));
            } else
                return "grey";
        })
        .attr("fill-opacity", function (d, i, k) {
            if ((k * skip) < (frames.length / 2))
                coef = (k * skip) / frames.length;
            else
                coef = (frames.length - (k * skip)) / frames.length;
            return coef;
        });    

    // Bones
    svg.selectAll("g.bones")
        .data(frames.filter(function (d, i) {
            return i % skip == 0;
        }))
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(" + (i * gap) + ",0)";
        })
        .selectAll("line.f" + index)
        .data(connectivityMatrix)
        .enter()
        .append("line")
        .attr("stroke", "grey")
        .attr("stroke-opacity", function (d, j, k) {
            if ((k * skip) < (frames.length / 2))
                coef = (k * skip) / frames.length;
            else
                coef = (frames.length - (k * skip)) / frames.length;
            return Math.min(0.17, coef);
        })
        .attr("stroke-width", 1.4)
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
    connectivityMatrix = json;
    $.getJSON("http://omid.al/moveviz/data/BEA.json", function (json) {
        positions = json;
        draw();
    });
});