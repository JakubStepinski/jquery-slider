//slajdy w folderze /slides, nazwy od s0.jpg, przyspieszenie(+) o 0.5s, do 1.5s
//manual zatrzymuje auto, wywolanie funkcji z iloscia slajdow w runner.js
//sprawdzone w chrome v55

function Slider(number){

var slideCon = $("#slide-container");
if(!slideCon.length){
    return;
}
var slides = number || 3;
var srcData = [];
var visualOb = {};
var speed = 3000;
var animateSpeed = 1000;
var working = false;
var actualSlide=0;
var autoplay=true;
var slide;

function checkSrc(){
    var data = [];
    var imgT="";
    for(var i=0;i<slides;i++){
        imgT="slides/s"+i+".jpg";
        data.push(imgT);
    }
    return data;             
}

function setVisuals(){
    var size;
    var dots=[];
    if($(window).height()<200){
        size = "20px";
    }
    else{
        size=($(window).height())/10+"px";
    }
    var leftDiv = $("<div></div>")
    .css({
        position: "absolute",
        top: "40%",
        left: 0,
        zIndex:2,
        fontSize: size 
    }).appendTo(slideCon);
    var leftArrow = $("<i></i>",{
        class: "fa fa-chevron-left"
    }).appendTo(leftDiv);

    var rightDiv = $("<div></div>")
    .css({
        position: "absolute",
        top: "40%",
        right: 0,
        zIndex:2,
        fontSize: size 
    }).appendTo(slideCon);
    var rightArrow = $("<i></i>",{
        class: "fa fa-chevron-right"
    }).appendTo(rightDiv);
    var dotSize=parseInt(size)/4+"px";
    var navSize=parseInt(size)/2+"px";
    var dotDiv = $("<div></div>")
    .css({
        position: "absolute",
        top: "90%",
        width: "100%",
        zIndex:2,
        fontSize: dotSize,
        textAlign: "center"
    }).appendTo(slideCon);

    for(var i=0; i<slides;i++){
        dots[i]=$("<i></i>",{
        class: "fa fa-circle",
        number: i
        })
        .css({
            marginLeft: dotSize,
            marginRight: dotSize,
        })
        dots[i].appendTo(dotDiv);
    }
    var navigator = $("<div></div>")
    .css({
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex:2,
        fontSize: navSize,
        textAlign: "center"
    }).appendTo(slideCon);
    var slower = $("<i></i>",{
        class: "fa fa-minus"
    })
    .css({
        marginLeft: dotSize,
        marginRight: dotSize,
    }).appendTo(navigator);       
    var pause = $("<i></i>")
    .css({
        marginLeft: dotSize,
        marginRight: dotSize,
    }).appendTo(navigator);     
    var faster = $("<i></i>",{
        class: "fa fa-plus"
    })
    .css({
        marginLeft: dotSize,
        marginRight: dotSize,
    }).appendTo(navigator); 

    var siteNumber = $("<div></div>")
        .css({
        position: "absolute",
        top: "90%",
        right: "2%",
        color: "darkgray",  
        zIndex:2,
        fontSize: navSize,         
        }).appendTo(slideCon);

    return {
        rightA: rightArrow,
        leftA: leftArrow,
        pause,
        slower,
        faster,
        siteNumber,
        dots
    }
}

function addSlider(){
    srcData=checkSrc();
	var slider=$("<img>",{
        id: "slider",
        src: srcData[0],
        alt: "error"
    }).appendTo(slideCon);
    return slider;
}

function addElements(){
    visualOb = setVisuals();
    setDot();
    checkSite();
}

function nextSlide(element){

    if(++actualSlide >= slides){
        actualSlide=0;
    }
    var newSlide = $("<img>",{
        src: srcData[actualSlide],
        alt: "error"
    }).css({top: 0, left: "100%"}).appendTo(slideCon);
    working = true;
    element.animate({
        left:"-100%"
    },animateSpeed, function(){
        this.remove();
        working = false;
    });
    newSlide.animate({
        left:"0%"
    },animateSpeed);
    setDot();
    checkSite();    
    return newSlide;
}

function prevSlide(element){

    if(!actualSlide){
        actualSlide=slides-1;
    }
    else
    {
        --actualSlide;
    } 
    var newSlide = $("<img>",{
        src: srcData[actualSlide],
    }).css({top: 0, left: "-100%"}).appendTo(slideCon);
    working = true;
    element.animate({
        left:"100%"
    },speed/2, function(){
        this.remove();
        working = false;
    });
    newSlide.animate({
        left:0
    },speed/2);
    setDot();
    checkSite();
    return newSlide;
}

function setDot(){
    for(var i=0; i<slides; i++){
        if(i==actualSlide){
            visualOb.dots[i].addClass("active");
        }
        else{
            visualOb.dots[i].removeClass("active");
        }
    }
}

function checkSite(){
    visualOb.siteNumber.text(actualSlide+1+"/"+slides);
}

function autoDown(interval){
        clearInterval(interval); 
        autoplay=false;
        visualOb.pause.removeClass("fa fa-pause-circle-o").addClass("fa fa-play-circle-o");   
 }
function autoUp(element){
visualOb.pause.removeClass("fa fa-play-circle-o").addClass("fa fa-pause-circle-o");      
    var autoSlider = setInterval(function(){
        slide=nextSlide(slide);
    },speed);
    return autoSlider;
 }


(function run(){
    
    slide = addSlider();  
    if(slides<2){        
        return;
    }  
    addElements();
    var autoSlider = autoUp(slide); 
    
    visualOb.rightA.on("click", function(){
        autoDown(autoSlider);
        if(working){
            return;
        }
        slide=nextSlide(slide);   
    });

    visualOb.leftA.on("click", function(){
        autoDown(autoSlider);  
        if(working){
            return;
        }   
        slide=prevSlide(slide);
    });
    visualOb.pause.on("click", function(){
        if($(this).hasClass("fa-play-circle-o")){
            autoSlider=autoUp(slide);
        }
        else{
            autoDown(autoSlider);
        }
    })
    visualOb.faster.on("click", function(){
        if(speed>=2000){
            speed-=500;
            console.log("actual interval time: "+speed);
            autoDown(autoSlider);
            autoSlider=autoUp(slide);
        }
    })
    visualOb.slower.on("click", function(){
        if(speed<=4000){
            speed+=500;
            console.log("actual interval time: "+speed);
            autoDown(autoSlider);
            autoSlider=autoUp(slide);
         }
    })    

    $.each(visualOb.dots, function(index, value){     
        var that=this;
        that.on("click", function(){

            autoDown(autoSlider);
            if(working || (that.attr("number")==actualSlide)){
            return;
            }
            if(that.attr("number")>actualSlide){
                actualSlide=parseInt(that.attr("number")) - 1;
                slide=nextSlide(slide);
                }
            else{
                actualSlide=parseInt(that.attr("number")) + 1;
                slide=prevSlide(slide);
            }
        })
    })    
})();	
}