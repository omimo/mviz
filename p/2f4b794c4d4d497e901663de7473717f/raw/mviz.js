// Variables
var title = 'BEA - Entangled & Colored';
var skeleton;
var positions;
var figureScale = 8;
var h = 670;
var w = 800;
var gap = 0;
var skip = 1;
//******************************************************************//

var markers = [
  [6167.12, 8266.57, "begin"],
  [8266.57, 12640.4, "float"],
  [12640.4, 14040.0, "punch"],
  [14040.0, 17976.5, "glide"],
  [17976.5, 19070.0, "slash"],
  [19070.0, 20119.7, "dab"],
  [20119.7, 23837.5, "wring"],
  [23837.5, 24887.2, "flick"],
  [24887.2, 30835.6, "press"]
];

var colorScale = d3.scale.category10();

function run() {    
    // Read the files
    console.log('Loading the data...');
    
    d3.json("http://omid.al/moveviz/data/Skeleton_BEA.json", function(error, json) {
        if (error) return console.warn(error);
        skeleton = json;
        d3.json("http://omid.al/moveviz/data/BEA.json", function(error, json) {
            positions = json;            
            // positions.splice(0, 160);
            // positions.splice(positions.length-190, 190);
            draw();
        });
    });
}

function draw() {
   console.log('Drawing...');
  // Prep the environment 
  var parent = d3.select("body").select("#c1");
  var svg = parent.append("svg")
    .attr("id","svg")
    .attr("width", w)
    .attr("height", h)
    .attr("overflow", "scroll")
    .style("display", "inline-block");

  // Scale the data

  frames = positions.map(function(ff, j) {
    return ff.map(function(d, i) {
      return {
        x: (d.x ) * figureScale + 400,
        y: -1 * d.y * figureScale + h - 10,
        z: d.z * figureScale
      };
    });
  });

  // Joints
  headJoint = 15;

  svg.selectAll("g.joints")
    .data(frames.filter(function(d, i) {
      return i % skip == 0;
    }))
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(" + (i * gap) + ",0)";
    })
    .selectAll("circle.f")
    .data(function(d, i) {
      return d
    })
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    }).attr("r", function(d, i) {
      if (i == headJoint)
        return .4;
      else
        return .4;
    }).attr("fill", function(d,j,k) {
        t = k * skip * 0.0333333333333 * 1000 /3;        
        c = "transprant";        
        for (var i=0;i<markers.length; i++){
          if (t > markers[i][0] && t < markers[i][1])
            c = colorScale(i);
        } 
        return c;
    })
    .attr("fill-opacity",function(d, di, k) {
    	coef = 0;
      t = k * skip * 0.0333333333333 * 1000 /3;    
      for (var i=0;i<markers.length; i++){
          if (t > markers[i][0] && t < markers[i][1]) {
            coef = (t - markers[i][0]) / (markers[i][1] - markers[i][0]); 
          }            
        }         
      return coef;
    });


  // Bones
 frameBones = svg.selectAll("g.bones")
    .data(frames.filter(function(d, i) {
      return i % skip == 0;
    }))
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(" + (i * gap) + ",0)";
    });

  bones = frameBones.selectAll("line.f")
    .data(skeleton)
    .enter();

  bone = bones.append("line")
    .attr("stroke", function(d,j,k) {
        t = k * skip * 0.0333333333333 * 1000 /3;        
        c = "blue";        
        for (var i=0;i<markers.length; i++){
          if (t > markers[i][0] && t < markers[i][1])
            c = colorScale(i);
        } 
        return c;
    })
    .attr("stroke-opacity", function(d, j, k) {
      coef = 0;
      t = k * skip * 0.0333333333333 * 1000 /3;    
      for (var i=0;i<markers.length; i++){
          if (t > markers[i][0] && t < markers[i][1]) {
            coef = (t - markers[i][0]) / (markers[i][1] - markers[i][0] + 100); 
          }            
        }         
      return coef;
    })
    .attr("stroke-width", .2)
    .attr("x1", 0).attr("x2", 0)
    .attr("x1", function(d, j, k) { 
      return frames[k * skip][d[0]].x;
    })
    .attr("x2", function(d, j, k) {
      return frames[k * skip][d[1]].x;
    })
    .attr("y1", function(d, j, k) {
      return frames[k * skip][d[0]].y;
    })
    .attr("y2", function(d, j, k) {
      return frames[k * skip][d[1]].y;
    });
    
    window.parent.loaded();
}
