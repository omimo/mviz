// Parameters
var scale = 2;
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

var ftop = 450;
var fleft = 340;


var startFrame = 100;
// var endFrame = 3520;
var endFrame = 501;

var animFrame = 1;
var startTime = 0;
var traillength = 1;

var gridPoints = [];
var borderPointsX = [];
var borderPointsY = [];
var pointStep = 1;

var colorScale = d3.schemeCategory20b;

// SVG container
var parent = d3.select("body").select("#cont");

var svg1 = parent.append("svg")
    .attr("width", 900)
    .attr("height",600)
    .attr("style", "position: absolute");



var colorScale_v = ['#08306b','#08519c','#2171b5','#4292c6','#6baed6','#9ecae1','#c6dbef','#c6dbef'];

var colorScale_a = ['#67001f', '#980043', '#ce1256', '#e7298a', '#df65b0', '#c994c7', '#d4b9da', '#e7e1ef'];

var colorScale_b = ['#3f007d', '#54278f', '#6a51a3', '#807dba', '#9e9ac8', '#bcbddc', '#dadaeb', '#efedf5'];

var colorScale_g = ['#C1C1C1', '#A1A1A1', '#919191', '#D1D1D1', '#E1E1E1', '#F1F1F1', '#C1C1C1', '#C1C1C1'];



function redrawPolygon(polygon) {
    polygon
        .attr("d", function(d) {
            // return d && d.every(function(e, i, a){return e !== null;}) !== null ? "M" + d.join("L") + "Z" : null; 

            if (!d || d === undefined || d.some(function(e, i, a){return e === null;}))
                return null;
            
            // console.log(d);
            return "M" + d.join("L") + "Z";
        });
  }

  
var dataLoaded = function() {
    try {
        if (window.top && window.top.loaded) 
            window.top.loaded();
    } catch(err) {

    }
    if (fig1._dataReady && fig2._dataReady && fig3._dataReady) {
        // makeBoneData();
        makeJointData();
        anim();
    }
    

};
function makeBoneData() {
    data1 = fig1.tracks[0].data["bone-positions"];
    data2 = fig2.tracks[0].data["bone-positions"];
    data3 = fig3.tracks[0].data["bone-positions"];
    
    data1_m = data1.map(function(d,i){
        return d.map(function(p, j){
            return [(p.x2 + p.x1)/2 * scale + fleft, (p.y2+p.y1)/2 * scale + ftop];
        });
    });

    data2_m = data2.map(function(d,i){
        return d.map(function(p, j){
            return [(p.x2 - p.x1) * scale + fleft, (p.y2-p.y1) * scale + ftop];
        });
    });

    data3_m = data3.map(function(d,i){
        return d.map(function(p, j){
            return [(p.x2 - p.x1) * scale + fleft, (p.y2-p.y1) * scale + ftop];
        });
    });
}

function makeJointData() {
    
    data1 = fig1.tracks[0].data["joint-positions"];
    data2 = fig2.tracks[0].data["joint-positions"];
    data3 = fig3.tracks[0].data["joint-positions"];
    
    data1_m = data1.map(function(d,i){
        return d.map(function(p, j){
            return [p.x * scale + fleft, p.y * scale + ftop];
        });
    });

    data2_m = data2.map(function(d,i){
        return d.map(function(p, j){
            return [p.x * scale + fleft, p.y * scale + ftop];
        });
    });

    data3_m = data3.map(function(d,i){
        return d.map(function(p, j){
            return [p.x * scale + fleft, p.y * scale + ftop];
        });
    });


    for (var i=0;i<10;i++)
        for (var j=0;j<10;j++)
            gridPoints.push([i*100+getRandomInt(-10,10), j*100+getRandomInt(-10,10)]);
    
    for (var i=-1;i<10;i++) {
        borderPointsX.push([i*100+getRandomInt(-10,10), 0]);
        borderPointsX.push([i*100+getRandomInt(-10,10), 600]);
        borderPointsY.push([0, i*100+getRandomInt(-10,10)]);
        borderPointsY.push([900, i*100+getRandomInt(-10,10)]);
    }
        
    
            

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

// color1 = d3Scale.linear().domain([1,length])
//   .interpolate(d3.interpolateHcl)
//   .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

drawVor = function(frame) {
        data_comb = [];
        
        gridPoints = gridPoints.map(function(d,i){
            var newx = d[0]+getRandomInt(-pointStep,pointStep+1);
            var newy = d[1]+getRandomInt(-pointStep,pointStep+1);
            
            newx = newx<0?0:newx;
            newx = newx>900?900:newx;
            newy = newy<0?0:newy;
            newy = newy>600?600:newy;

            return [newx, newy];
        });

        // borderPointsX = borderPointsX.map(function(d,i){
        //     var newx = d[0]+getRandomInt(-5,6);            
        //     newx = newx<0?0:newx;
        //     newx = newx>900?900:newx;            
        //     return [newx, newy];
        // });


        Array.prototype.push.apply(data_comb, data1_m[frame]);
        Array.prototype.push.apply(data_comb, data2_m[frame]);
        Array.prototype.push.apply(data_comb, data3_m[frame]);
        Array.prototype.push.apply(data_comb, gridPoints);
        Array.prototype.push.apply(data_comb, borderPointsX);
        Array.prototype.push.apply(data_comb, borderPointsY);


        var sel = svg1.selectAll("path");

        if (sel._groups[0].length === 0) {
            sel = sel.data(d3.voronoi().polygons(data_comb))
            .enter()    
            .append("svg:path");
        }
        else {
            sel = sel.data(d3.voronoi().polygons(data_comb));
        }

        
        sel.attr("fill-opacity", 0.5)
        .attr("fill", function(d,i){
            var c = i % 8;//getRandomInt(0,8);

            if (i < 27)
                return colorScale_a[c];
            else if (i >= 27 && i < 27*2)
                return colorScale_b[c];
            else if (i >= 27*2 && i < 27*3)
                return colorScale_v[c];
            else 
                return colorScale_g[c];
        }).attr("stroke", "none")
        // .attr("stroke", function(d,i){
        //     if (i < 27)
        //         return colorScale_a[1];
        //     else if (i >= 27 && i < 27*2)
        //         return colorScale_b[1];
        //     else if (i >= 27*2 && i < 27*3)
        //         return colorScale_v[1];
        //     else 
        //         return colorScale_g[1];
        // })
        .call(redrawPolygon);
};

var anim = function () {    
    
        if (startTime === 0)
            startTime = Date.now();               

        animFrame = Math.floor((Date.now() - startTime)/1000 / fig1.tracks[0].parserObject.frameTime);                                        
                        
        if (animFrame >= data1.length) {
            startTime=Date.now();
            animFrame = 0;
        }
        
        drawVor(animFrame);

        animFrame++;
    
    window.requestAnimationFrame(anim);
};

function run() {
    fig1 = MovaViz('Antonio')
    .debug(true)
    .data('https://www.sfu.ca/~oalemi/data/2015-11-27_12-07-39-anotnio-improv-fl.bvh','bvh', dataLoaded)
    .container(svg1);

    fig2 = MovaViz('Bevin')
    .debug(true)
    .data('https://www.sfu.ca/~oalemi/data/2015-11-27_12-07-39-bevin-improv-fl.bvh','bvh', dataLoaded)
    .container(svg1);


    fig3 = MovaViz('Vanessa')
    .debug(true)
    .data('https://www.sfu.ca/~oalemi/data/2015-11-27_12-07-39-vanessa-improv-esr-jitter-fl.bvh','bvh', dataLoaded)
    .container(svg1);

    // fig1.addDrawMethod(coloredCurveBoneFcn(colorScale_a, d3.curveCardinal), 'bone-positions', [startFrame,endFrame], 1);
    // fig2.addDrawMethod(coloredCurveBoneFcn(colorScale_b,d3.curveCardinal), 'bone-positions', [startFrame,endFrame], 2);

    // fig3.addDrawMethod(coloredCurveBoneFcn(colorScale_v, d3.curveCardinal), 'bone-positions', [startFrame,endFrame], 1);

    //  fig1.addDrawMethod(voronoi_joints(colorScale_a), 'joint-positions', [startFrame, startFrame+10], 1);
    //  fig2.addDrawMethod(multiJointFcn(colorScale_b), 'joint-positions', [startFrame, endFrame], 1);
    //  fig3.addDrawMethod(multiJointFcn(colorScale_v), 'joint-positions', [startFrame, endFrame], 1);
}
