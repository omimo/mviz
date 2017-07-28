// Parameters
var scale = 4;
var gap = 0;
var fr = 1/120;
var randScale = 100;
var fig1 = {};
var fig2 = {};
var fig3 = {};

var data1 = [];
var data2 = [];
var data3 = [];

var bigData = [];

var ftop = 750;
var fleft = 440;


var startFrame = 100;
// var endFrame = 3520;
var endFrame = 501;

var animFrame = 1;
var startTime = 0;
var traillength = 1;


var colorScale = d3.schemeCategory20b;

// SVG container
var parent = d3.select("body").select("#cont");

var svg1 = parent.append("svg")
    .attr("width", 1200)
    .attr("height", 900)
    .attr("style", "position: absolute");

var svg2 = parent.append("svg")
    .attr("width", 1200)
    .attr("height", 900)
    .attr("style", "position: absolute");

var svg3 = parent.append("svg")
    .attr("width", 1200)
    .attr("height", 900)
    .attr("style", "position: absolute");


var colorScale_a = ['#08306b','#08519c','#2171b5','#4292c6','#6baed6','#9ecae1','#c6dbef','#c6dbef'];

var colorScale_b = ['#67001f', '#980043', '#ce1256', '#e7298a', '#df65b0', '#c994c7', '#d4b9da', '#e7e1ef'];

var colorScale_v = ['#3f007d', '#54278f', '#6a51a3', '#807dba', '#9e9ac8', '#bcbddc', '#dadaeb', '#efedf5'];

var boneFunction = function(data, k) {    
    
    bf = d3.line()        
        .x(function(d) { return d.x1  * scale + fleft; })
        .y(function(d) { return d.y1  * scale + ftop; })
         //.curve(d3.curveCatmullRom)
        // .curve(d3.curveBundle.beta(1))
       //  .curve(d3.curveBasis)
        //.curve(d3.curveNatural)
         .curve(d3.curveCardinal)
       // .curve(d3.curveStepAfter)
        // .curve(d3.curveStepBefore)
        ;
    return (bf(data));
};

var coloredCurveBoneFcn = function(colorscale) {

    var curveBoneFcn = function(j) {            
        c = j;

        if (j._exit === undefined) {
            c = j.append("path")                  
            .attr("class","jl")   
            .attr("stroke", function(d,i) {
                var ind = math.floor((i/(endFrame-startFrame))*8 ); 
                return colorscale[1];
            })
            .attr("stroke-opacity", function(d,i) {
                return 0.6;        
            })
            .attr("stroke-width",0.1)
            .attr("fill", "transparent");
        }

        c.attr("d", function(d,i) {                                      
                return boneFunction(d,i);
            });
    };

    return curveBoneFcn;
}




var jointLines = function(sel) {
    var c = sel;
    // if it is the first time this function is called, it should append the elements
    if (sel._exit === undefined)
        c = sel.append('line')
        .attr('class', 'jl')
        .attr("stroke", "#333333");   
        // .attr("stroke", d3.interpolateInferno(order/lineSources.length));   

    c.attr("stroke-width", function (d,i, k,p) { 
        return  0.5;
    })   
    .attr("stroke-opacity", 0.3)
    // .transition()
    .attr("x1", function (d, j) {                      
        return d[0].x * scale + fleft;        
    })
    .attr("x2", function (d, j) {
        return d[1].x * scale + fleft;
    })
    .attr("y1", function (d, j) {        
        return d[0].y * scale + ftop;
    })
    .attr("y2", function (d, j) {
        return d[1].y * scale + ftop;
    });
};

var colors = [
    "red",
    "green",
    "blue"
];

var circleJointEnterFcn = function(sel, ff) {   
    var c1 = sel;
    
    if (sel._exit === undefined){
        c1 = sel.append('circle').attr('class','jc'+(ff));    
    }           
        
    c1.attr("cx", function (d) {           
        return d[ff].x * scale + fleft;
    })
    .attr("cy", function (d) {
        return d[ff].y * scale + ftop;
    })
    .attr("r", function (d, i) {
            return 2;
    })
    .attr("fill", function (d, i) {
        return colors[ff];
    })
    .attr("opacity", 0.6);

};


var dataLoaded = function() {
    try {
        if (window.top && window.top.loaded) 
            window.top.loaded();
    } catch(err) {

    }

    if (fig1._dataReady && fig2._dataReady) {
        data1 = fig1.tracks[0].data["joint-positions"];
        data2 = fig2.tracks[0].data["joint-positions"];
        
    }
};

function run() {
    fig1 = MovaViz('Antonio')
    .debug(true)
    .data('https://www.sfu.ca/~oalemi/data/2015-11-27_12-07-39-anotnio-improv-fl.bvh','bvh', dataLoaded)
    .container(svg1);

    fig2 = MovaViz('Bevin')
    .debug(true)
    .data('https://www.sfu.ca/~oalemi/data/2015-11-27_12-07-39-bevin-improv-fl.bvh','bvh', dataLoaded)
    .container(svg2);


    fig3 = MovaViz('Vanessa')
    .debug(true)
    .data('https://www.sfu.ca/~oalemi/data/2015-11-27_12-07-39-vanessa-improv-esr-jitter-fl.bvh','bvh', dataLoaded)
    .container(svg3);

    fig1.addDrawMethod(coloredCurveBoneFcn(colorScale_a), 'bone-positions', [startFrame,endFrame], 1);
    fig2.addDrawMethod(coloredCurveBoneFcn(colorScale_b), 'bone-positions', [startFrame,endFrame], 1);

    fig3.addDrawMethod(coloredCurveBoneFcn(colorScale_v), 'bone-positions', [startFrame,endFrame], 1);

    // fig1.addDrawMethod(jointFrame, 'joint-positions', [1,1+traillength], 1);
    // fig2.addDrawMethod(jointFrame, 'joint-positions', [1,1+traillength], 1);
}
