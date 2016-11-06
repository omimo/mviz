// Variables
var connectivityMatrix;
var positions;
var figureScale = 0.9;
var h = 200;
var w = 200;
var gap = 0;
var skip = 1;
// var fr = 1/30;                
var len = 50;
var seg = len;
//******************************************************************//

function run () {
// Read the files
$.getJSON("http://omid.al/moveviz/data/ConnectivityMatrix_Antonio.json", function (json) {
  connectivityMatrix = json;
  $.getJSON("http://omid.al/moveviz/data/Improv_Antonio.json", function (json) {
    positions = json;

    // Scale the data
    console.log(positions.length);
    positions.splice(0, 160);
    positions.splice(positions.length - 190, 190);

    frames = positions.map(function (ff, j) {
      return ff.map(function (d, i) {
        return {
          x: (d.x + 70) * figureScale,
          y: -1 * d.y * figureScale + h - 10,
          z: d.z * figureScale
        };
      });
    });

    for (f = len; f < frames.length; f += seg) {
      segment = frames.slice(f - len, f);
      addSegment(segment);
    }

  });
});
}


function draw(svg, frames) {

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
    .selectAll("line.f")
    .data(connectivityMatrix)
    .enter()
    .append("line")
    .attr("stroke", function (d, j, k) {
      // return 'grey';
      c = (k * skip) / frames.length;

      return d3.hsl(130 + c * 100, 0.5, 0.5);
    })
    .attr("stroke-opacity", function (d, j, k) {
      if ((k * skip) < (frames.length / 2))
        coef = (k * skip) / frames.length;
      else
        coef = (frames.length - (k * skip)) / frames.length;

      coef = (k * skip) / frames.length;

      return coef / 1.9 - 0.3;
    })
    .attr("stroke-width", 2.5)
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


function addSegment(segment) {
  // Prep the environment 
  var parent = d3.select("body").select("#c1");

  var svg = parent.append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("overflow", "scroll")
    .style("display", "inline-block");

  draw(svg, segment);
}
