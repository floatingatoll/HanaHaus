/*

*/


var accelerometerChecked=false;
var hPos, vPos;

var active, activeX, activeY;
var pi = Math.PI;
//The data for our line

 var lineFunction = d3.svg.line()
                          .x(function(d) { return d.x; })
                          .y(function(d) { return d.y; })
                         .interpolate("linear");

var svg = d3.select("svg");
function createHoneycomb() {
  //console.log(window.innerHeight);
  //svg.style("height", window.innerHeight);
  $(".home").css("height", window.innerHeight).css("width", window.innerWidth);
  $("svg").css("height", window.innerHeight).css("width", window.innerWidth);
  var svgWidth  = svg.style('width').split('px')[0];
  var svgHeight = window.innerHeight;
   
  var imageWidth, imageHeight;
  if (window.innerWidth < window.innerHeight) {
    imageHeight = svgHeight;
    imageWidth = svgHeight * 1197 /770;
   
  } else {
     imageHeight = 770/1197*svgWidth;
    imageWidth = svgWidth;
  }

  var colors1 = ["white", "rgb(240,240,240)", "rgb(247,247,247)"];
  var colors2 = ["rgb(91,201,227)", "rgb(222,225,78)", "rgb(167,155,148)"];

  var r = 80;
  if (svgWidth <= 600) {
    r = 40;
   
  }

 var a = [{ "x": -r*Math.cos(pi/6),   "y": -r*Math.sin(pi/6)},  
          { "x":-r*Math.cos(pi/6),   "y": r*Math.sin(pi/6)},
          { "x": 0,  "y": r},
          { "x": 0,  "y": 0}];
var b = [{ "x": 0,   "y":0},  
          { "x":0,   "y": r},
          { "x": r*Math.cos(pi/6), "y": r*Math.sin(pi/6)},
         { "x": r*Math.cos(pi/6),   "y": -r*Math.sin(pi/6)}];
var c = [{ "x": 0,   "y":0},  
          {"x": r*Math.cos(pi/6),   "y": -r*Math.sin(pi/6)},
          { "x": 0, "y": -r},
         {  "x": -r*Math.cos(pi/6),   "y": -r*Math.sin(pi/6)}];
 //This is the accessor function we talked about above

var dataSet = [a,b,c];
  var vNum = Math.floor(imageHeight/((3*r+Math.sin(pi/6)*r)/2));
  var hNum = Math.ceil(imageWidth/((3*r+Math.sin(pi/6)*r)/2))+1;
  //The SVG Container
  for (var i=0; i< vNum; i++){
    for (var j=0; j< hNum; j++) {
      var xOffset = j*(2* r*Math.cos(pi/6)) + (i%2)*r*Math.cos(pi/6);
      var yOffset = i*(r+r*Math.sin(pi/6));

      for (var k=0; k<3; k++) {
        var side1 =  svg.append("path")
       .attr("id",  i+ '-' + j + '-' + k)
        .attr("class", 'side' + k )
        .attr("d", lineFunction(dataSet[k]))
        .attr("stroke", "none")
        .attr("transform", "translate(" + xOffset + "," +yOffset + ")")
        .on("mouseover",function() {
          toggleActive(this);
        })
        .on("mouseout",function() {
         toggleActive(this);
        });
      }
      }
    
      
    
  }

  svg.append('svg:svg').attr('class', 'my-supah-svg')
      .append('svg:defs')
    .attr('pointer-events', 'none')
      .call(function (defs) {
       
        defs.append('svg:mask')
          .attr('id', 'gradient-mask')
          .attr('width', imageWidth)
          .attr('height', imageHeight)
          .attr('x', 0)
          .attr('y', 0)
          .call(function(mask) {
           for (var i=0; i< vNum; i++){
            for (var j=0; j< hNum; j++) {
              var xOffset = j*(2* r*Math.cos(pi/6)) + (i%2)*r*Math.cos(pi/6);
              var yOffset = i*(r+r*Math.sin(pi/6));
          
              for (var k=0; k<3; k++) {
                var side1 =  mask.append("path")
               .attr("id", 's' + i+ '-' + j + '-' + k)
               .attr("class", "mask")
                .attr("d", lineFunction(dataSet[k]))
                .attr("stroke", "none")
                .attr("transform", "translate(" + xOffset + "," +yOffset + ")")
              }
              }
            
              
            
          }
          });
      })

  d3.select('.my-supah-svg').append('svg:image')
    .attr('class', 'final-bg')
    .attr('pointer-events', 'none')
    .attr('xlink:href', 'img/exterior_bw.png')
    .attr('width', imageWidth)
    .attr('height', imageHeight)
    .attr('x', (svgWidth - imageWidth)/2)
    .attr('y', 0)
    .attr('mask', 'url(#gradient-mask)');
  svg.append("svg:image")
    .attr('pointer-events', 'none')
    .attr('xlink:href', 'img/logo_svg.png')
    .attr('width', ((svgWidth < 480) ?0.5:1) * 138)
    .attr('height', ((svgWidth < 480) ?0.5:1) *133)
    .attr('x', (svgWidth - ((svgWidth < 480) ?0.5:1) *138)/2)
    .attr('y', (svgHeight - ((svgWidth < 480) ?0.5:1) *133)*0.45)

    hPos = d3.scale.linear().domain([-35,35]).range([0, svgWidth]).clamp(true);
    vPos = d3.scale.linear().domain([0, 45]).range([0, svgHeight]).clamp(true);
    activeX = svgWidth/2;
    activeY = svgHeight/2;
}


function toggleActive(element) {
  element.classList.toggle('active');
  document.getElementById('s'+element.id).classList.toggle("active");
}


if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', onWindowDeviceOrientation);
 // window.addEventListener('devicemotion', onDeviceMotion);
}

window.addEventListener('resize', onWindowResize);
function onWindowResize( event ) {
  svg.selectAll("*").remove();
  createHoneycomb();
}
function onWindowDeviceOrientation( event ) {

  if ( event.beta ) {
    if (!accelerometerChecked && !document.getElementsByTagName("body")[0].classList.contains("accelerometer")) {
      document.getElementsByTagName("body")[0].classList.add("accelerometer");
      accelerometerChecked=true;
    }
    var h = Math.round(hPos(event.gamma));
    var v = Math.round(vPos(event.beta));
  
      activeX = lerp(activeX, h, 0.1)
      activeY = lerp(activeY, v, 0.1)
     
      var target = document.elementFromPoint(activeX,activeY);
   
      if (active !== target && target.parentNode.nodeName == 'svg') {
        if (active) {
          toggleActive(active);
        }
        active = target;
        toggleActive(active);
    
     }
   

  }
}
function onDeviceMotion(event) {
  console.log("acceleration x:" + event.acceleration.x + ", y:"+event.acceleration.y+", z:"+event.acceleration.z);
 // console.log("rotation alpha:" + event.rotationRate.alpha + ", beta:"+event.rotationRate.beta+", gamma:"+event.rotationRate.gamma);
  
}

function subscribe(){
  
}

lerp = function(a,b,u) {
      return (1-u) * a + u * b;
  };

createHoneycomb();