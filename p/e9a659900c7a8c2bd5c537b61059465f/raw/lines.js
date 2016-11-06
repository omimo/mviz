// Variables
var skeleton;
var positions;
var figureScale = 2.2;
var h = 540;
var w = 500;
var gap = 0;
var skip = 1;
var traillength = 20;
//******************************************************************//
var Mova = {};

Mova.Joints = function(parent, frames, className) {
    return parent.selectAll(className)
                 .data(frames.filter(function(d, i) {
                 return i % skip === 0;
                 }))
                 .enter()
                 .append("g")
                 .attr("class", className)
                 .attr("transform", function(d, i) {
                  return "translate(" + (i * gap) + ",0)";
                 })
                 .selectAll("joint")
                 .data(function(d, i) {
                 return d;
                 })
                 .enter();
};

Mova.Bones = function(parent, frames, skeleton, className) {
    return parent.selectAll(className)
                 .data(frames)
                 .enter()
                 .append("g")
                 .attr("class", className)
                 .selectAll("bone")
                 .data(skeleton)
                 .enter();
};

function run() {
    // Read the files
    console.log('Loading the data...');
    
    d3.json("http://omid.al/moveviz/data/ConnectivityMatrix_Antonio.json", function(error, json) {
        if (error) return console.warn(error);
        skeleton = json;
        d3.json("http://omid.al/moveviz/data/Improv_Antonio.json", function(error, json) {
            positions = json;
            positions.splice(0, 160);
            positions.splice(positions.length-190, 190);

             var frames = positions.map(function(ff, j) {
                return ff.map(function(d, i) {
                return {
                    x: (d.x + 80) * figureScale,
                    y: -1 * d.y * figureScale + h - 10,
                    z: d.z * figureScale
                };
                });
            });

            svg = draw(frames);
            
            var fr = 1/30;
            var startTimeJ = Date.now();   

            anim0(frames.slice(0,traillength),svg);
            
            window.setInterval(function() {
                f = traillength + Math.floor((Date.now() - startTimeJ)/1000 / fr);                                        
                
                if (f > frames.length) {
                    startTimeJ=Date.now();
                    f = 0;
                }
                segment = frames.slice(f-traillength,f);
                anim(segment,svg);                    
                
            }, fr * 1000);
            
        });
    });
}


function draw(frames) {
   console.log('Drawing...');
  // Prep the environment 
  var parent = d3.select("body").select("#c1");
  var svg = parent.append("svg")
    .attr("id","svg")
    .attr("width", w)
    .attr("height", h)
    .attr("overflow", "scroll")
    .style("display", "inline-block");

    return svg;
}

function anim0(frames, svg) {
  // Joints
  headJoint = 15;


var joints = Mova.Joints(svg, frames,"jointsanim");
var bones = Mova.Bones(svg, frames, skeleton, "boneanim");

// joints.append("circle")
//     .attr("class","anim")
//     .attr("cx", function(d) {
//       return d.x;
//     }).attr("cy", function(d) {
//       return d.y;
//     }).attr("r", function(d, i) {
//       if (i == headJoint)
//         return .8;
//       else
//         return 1.8;
//     })
//     .attr("fill",'#cc6666')
//     .attr("fill-opacity",1);


  // Bones

 bones.append("line")  
    .attr("class","anim")   
    .attr("stroke", "#cc6666")
    .attr("stroke-opacity", .8)
    .attr("stroke-width", 2) 
    .attr("x1", function(d, j, k) {         
      return frames[k][d[0]].x;
    })
    .attr("x2", function(d, j, k) {
      return frames[k][d[1]].x;
    })
    .attr("y1", function(d, j, k) {
      return frames[k][d[0]].y;
    })
    .attr("y2", function(d, j, k) {
      return frames[k][d[1]].y;
    });

    window.parent.loaded();
}

function anim(frames, svg) {
  // Joints
  headJoint = 15;

 svg.selectAll("g.jointsanim")
    .data(frames)
    .selectAll("circle.anim")
    .data(function(d, i) {
      return d;
    })
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", function(d, i, k) {
        return .2 + 1.5 * k/traillength;
    })
    .attr("fill",'#cc6666')
    .attr("fill-opacity", function (d,i, k) {
        return k/traillength;
    });


  // Bones

 svg.selectAll("g.boneanim")
    .data(frames)
    .selectAll("line.anim")
    .data(skeleton)
    .attr("stroke", "#666666")
    .attr("stroke-opacity",  function (d,i, k) {
        return .1 + 0.3 * k/traillength;
    })
    .attr("stroke-width", function (d,i, k) {
        return  k/traillength  + Math.random() * 3;
    })
    .attr("x1", function(d, j, k) {
      return frames[k][d[0]].x + Math.random() * 20;
    })
    .attr("x2", function(d, j, k) {
      return frames[k][d[1]].x + Math.random() * 20;
    })
    .attr("y1", function(d, j, k) {
      return frames[k][d[0]].y + Math.random() * 20;
    })
    .attr("y2", function(d, j, k) {
      return frames[k][d[1]].y + Math.random() * 20;
    });
}