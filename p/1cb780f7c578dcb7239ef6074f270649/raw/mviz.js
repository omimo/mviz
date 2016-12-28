// Created by Omid Alemi - 2016

// Parameters
var scale = 18;
var animFrame = 1;
var startTime = 0;
var randScale = 20;
var fig = {};
var ftop = 600;
var fleft = 300;
var traillength = 10;

var CMUDeletedBones = [0, 5,6,11,15,16,17,18,20,24,25,27,28,29,33,36];

// Create the SVG container
var parent = d3.select("body").select("#cont");

var svg = parent.append("svg")
    .attr("width", 800)
    .attr("height", 800);

// Mova Draw Functions
var lineBoneFcn = function(j) {
    var c = j;
    
    // if it is the first time this function is called, it should append the elements
    if (j._exit === undefined)
        c = j.append('line').attr('class','bone-line').attr("stroke", "#666666");    

    c.attr("stroke-width", function (d,i, k,p) { 
        return  Math.random() + Math.random() * 3;
    })   
    // .attr('id', function(d,i){return i})
    .attr("x1", function (d, j) {                          
        return d.x1  * scale + fleft + Math.random() * randScale;        
    })
    .attr("x2", function (d, j) {
        return d.x2 * scale + fleft + Math.random() * randScale;
    })
    .attr("y1", function (d, j) {
        return d.y1 * scale + ftop + Math.random() * randScale;
    })
    .attr("y2", function (d, j) {
        return d.y2 * scale + ftop + Math.random() * randScale;
    });
};

var multiBonesFcn = function(j) {
    c = j;
    
    // if it is the first time this function is called, it should append the g element
    if (j._exit === undefined) {
         c = j.append('g')
        .attr('class','bone-positions')
        .attr("opacity", function (d,i, k) {             
            return 0.1 + 0.3 * i/5;
        })
        .selectAll('line.bone-line')
        .data(function(d,i) {   
                                      
            return d;
        })
        .enter();
    } else {         
        c = c.selectAll('line.bone-line')
        .data(function(d,i) {                                 
            return d;
        });
    }
   
    lineBoneFcn(c);
};

var anim = function () {    
    if (fig._dataReady) {
        if (startTime === 0)
            startTime = Date.now();               

        animFrame = Math.floor((Date.now() - startTime)/1000 / fig.tracks[0].parserObject.frameTime);                                        
        animFrame = Math.max(1, animFrame);

        if (animFrame >= fig.tracks[0].parserObject.frameCount) {
            startTime=Date.now();
            animFrame = 1;
        }
        
        fig.updateDraw(multiBonesFcn, 'bone-positions', [animFrame,animFrame+traillength], 1);
        animFrame++;
    }
    
    // window.requestAnimationFrame(anim);
};

var loaded = function() {
    if (window.parent && window.parent.loaded)
        window.parent.loaded();
    
    // Let's first let go of the stuff we don't want to keep in mem
    fig.tracks[0].data['joint-positions'] = [];
    fig.tracks[0].data['joint-rotations'] = [];

    // Now let's remove the bones that are too short to be drawn. 
    // Otherwise a lot of extra DOM has to be created
    fig.tracks[0].data['bone-positions'] =  fig.tracks[0].data['bone-positions'].map(function(d,j){
        return d.filter(function(p,i) {
            return (CMUDeletedBones.indexOf(i) == -1);
        });
    });

    // Now add let the Mova know that we have a drawing function that uses bone-positions
    fig.addDrawMethod(multiBonesFcn,        // the function to call drawing elements
                        'bone-positions',      // use bone positons
                        [1,1+traillength],     // use this subset of frames
                        1);                    // use every 1 frame

    window.setInterval(anim,fig.tracks[0].parserObject.frameTime*1000);
    // anim();
};

function run() {
    fig = MovaViz('Sketchy')
    .debug(true) // print out the debug messages
    .data('https://www.sfu.ca/~oalemi/data/05/05_07.bvh','bvh', loaded)
    .container(svg);    
}
