// Parameters
var scale = 3;
var gap = 0;
var fr = 1/120;
var randScale = 100;
var fig = {};
var ftop = 790;
var fleft = 680;

var startFrame = 200;
var endFrame = 1820;

// SVG container
var parent = d3.select("body").select("#cont");

var svg = parent.append("svg")
    .attr("width", 1300)
    .attr("height", 880);

var randLogScale = d3.scaleLog()
    .base(2)
    .domain([-(endFrame-startFrame)/2, (endFrame-startFrame)/2])
    .range([200, 0]);

var randLinScale = d3.scaleLinear()
    .domain([0, (endFrame-startFrame)])
    // .domain([-(endFrame-startFrame)/2, (endFrame-startFrame)/2])
    .range([50, 0]);

var partLinScale = d3.scaleLinear()
    .domain([0.1, 130])
    // .domain([-(endFrame-startFrame)/2, (endFrame-startFrame)/2])
    .range([90, 0]);

var boneFunction = function(d, k) {
    var randCoef = partLinScale((k));

    bf = d3.line()        
        .x(function(d) { return d.x1  * scale + fleft + Math.random() * randCoef; })
        .y(function(d) { return d.y1  * scale + ftop + Math.random() * randCoef; })
        // .curve(d3.curveCatmullRom)
        // .curve(d3.curveBundle.beta(1))
        // .curve(d3.curveBasis)
        .curve(d3.curveNatural)
        // .curve(d3.curveCardinal)
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
        .attr("stroke-opacity", function(d,i) {
            return 0.3;
            return i/((endFrame-startFrame)*2) +0.1;
        })
        .attr("stroke-width", 0.15)
        .attr("fill", "transparent");
    }
    c.transition() 
    .attr("d", function(d,i) {                      
            return boneFunction(d,i);
        });
};



var dataLoaded = function() {
    if (window.top && window.top.loaded) 
        window.top.loaded();     
};

function run() {
    fig = MovaViz('Antonio')
    .debug(true)
    .data('https://www.sfu.ca/~oalemi/data/2015-11-27_12-07-39-anotnio-improv-fl.bvh','bvh', dataLoaded)
    .container(svg);

    fig.addDrawMethod(cruveBoneFcn, 'bone-positions', [startFrame,endFrame], 1);
}
