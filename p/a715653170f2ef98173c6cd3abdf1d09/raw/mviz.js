// Variables
var skeleton;
var positions;
var figureScale = 2.2;
var h = 540;
var w = 500;
var gap = 0;
var skip = 1;
var traillength = 3;
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
    var bones = Mova.Bones(svg, frames, skeleton, "boneanim");

  // Bones
    var boneFunction = d3.svg.line()
        .x(function(d,j,k) {return frames[0][d[0]].x; })
        .y(function(d) { return frames[0][d[0]].y; })
        .interpolate("linear");

    bones.append("path")  
        .attr("d", boneFunction(skeleton))
        .attr("class","anim")   
        .attr("stroke", "#666666")
        .attr("stroke-opacity", .1)
        .attr("stroke-width", .2)
        .attr("fill", "transparent");

    window.parent.loaded();

}

function anim(frames, svg, f) {
  // Bones
    var boneFunction = function(d, k) {
        bf = d3.svg.line()
        .x(function(d) { return frames[k][d[0]].x; })
        .y(function(d) { return frames[k][d[0]].y; })
        .interpolate("basis");
        return (bf(d));
    };


    svg.selectAll("g.boneanim")
        .data(frames)
        .selectAll("path.anim")
        .data(skeleton)
        .attr("d", function(d,j,k) {
            return boneFunction(skeleton,k);
        })
        .attr("fill", "transparent")        
        .attr("stroke", "#666666")
        .attr("stroke-opacity",  0.1)
        .attr("stroke-width", 0.2);
}