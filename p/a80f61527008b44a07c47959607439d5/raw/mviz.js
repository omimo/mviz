/* Mocap Visualization
   Fun with D3 curve functions

   By Omid Alemi
   (C) Feb 2017
*/

// Parameters
var scale = 8;
var gap = 0;
var fr = 1/120;
var fig = {};
var ftop = 670;
var fleft = 410;
var animFrame = 0;
var startTime = 0;

var startFrame = 900;
var endFrame = 3520;

// SVG container
var parent = d3.select("body").select("#cont");

var svg = parent.append("svg")
    .attr("width", 800)
    .attr("height", 800);

var randLogScale = d3.scaleLog()
    .base(10)
    .domain([(1), (endFrame-startFrame)])
    .range([150, 0]);

var randLinScale = d3.scaleLinear()
    .domain([0, (endFrame-startFrame)])
    .range([100, 0]);

var boneFunction = function(d, k) {
    var randCoef = randLogScale((k+1));

    bf = d3.line()        
        .x(function(d) { return d.x1  * scale + fleft + Math.random() * randCoef; })
        .y(function(d) { return d.y1  * scale + ftop + Math.random() * randCoef; })
        // .curve(d3.curveCatmullRom)
        // .curve(d3.curveBundle.beta(1))
        // .curve(d3.curveBasis)
        // .curve(d3.curveNatural)
        .curve(d3.curveCardinal)
        // .curve(d3.curveStepAfter)
        ;
    return (bf(d));
};

var cruveBoneFcn = function(j) {            
    c = j;

    if (j._exit === undefined) {
        c = j.append("path")                  
        .attr("class","bone-positions")   
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", 0.1)
        .attr("fill", "transparent");
    }
    c.transition() 
    .attr("d", function(d,i) {                      
            return boneFunction(d,i);
        });
};


var dataLoaded = function() {
    console.log('Data loaded.');
    if (window.parent && window.parent.loaded) {
        console.log('Minimizing the parent.');
        window.parent.loaded();    
    } else if (loaded) {
        console.log('Minimizing the parent.');
        loaded(); 
    }
       
};

function run() {
    fig = MovaViz('BEA')
    .debug(true)
    .data('https://www.sfu.ca/~oalemi/data/KAREN_BEAS_001_original.bvh','bvh', dataLoaded)
    .container(svg);

    fig.addDrawMethod(cruveBoneFcn, 'bone-positions', [startFrame,endFrame], 1);
}
