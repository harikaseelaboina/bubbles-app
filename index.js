let canvas=document.getElementById("canvas");
let resetbtn=document.getElementById("reset");
let context=canvas.getContext("2d");

class Circle{
    constructor(xposition,yposition,radius,color,isClicked){
                this.xposition=xposition;
                this.yposition=yposition;
                this.radius=radius;
                this.color=color;
                this.isClicked=isClicked;
    }
    draw(context){
        context.beginPath();
        context.strokeStyle="black"
        context.lineWidth=5;
        context.arc(this.xposition,this.yposition,this.radius,0,Math.PI*2,false);
        context.stroke();
        context.fillStyle=this.color;
        context.fill()
        context.closePath();
    }
    

    changeColor(newcolor){
        this.color=newcolor;
        this.draw(context)
    }

    clickCircle(x,y){
        const dist=Math.sqrt(((x-this.xposition)**2)+((y-this.yposition)**2))

        if(dist<this.radius){
            this.isClicked=true;
        //   this.changeColor("grey");
        }
    }

    
}

class ArrowMark{
    
    constructor(x1,y1,speed,isTouched){
            this.x1=x1;
            this.y1=y1; 
            this.speed=speed 
            this.isTouched=isTouched
            // this.ismoving=ismoving
            this.dx1=1*speed;
            
    }
    
    draw(context){
    context.beginPath();
    context.moveTo(this.x1 + 100, this.y1);
    context.lineTo(this.x1, this.y1);
    context.lineTo(this.x1 + 25, this.y1 - 25);
    context.lineTo(this.x1 + 25, this.y1 + 25);
    context.lineTo(this.x1, this.y1);
    context.closePath();
    context.fillStyle="black"
    context.strokeStyle="black"
    context.fill();
    context.stroke();
    }
    

    moveArrow(){
       context.clearRect(this.x1, this.y1 - 30,100,60);
        this.x1=this.x1-this.dx1;
        this.draw(context); 
        
           
        }
    
 }

 let circles_array=[]
let arrows_array=[]
 
for (var i=0;i<4;i++){
    
    y=[100,200,300,400]
    colours=["red","yellow","blue","green"]
    let circleobj=new Circle(100,y[i],25,colours[i],false);
    circleobj.draw(context)
    circles_array.push(circleobj)
    
    
    let arrowobj=new ArrowMark(500,y[i],3,false);
    arrowobj.draw(context)
    arrows_array.push(arrowobj)
   

    canvas.addEventListener("click",(event)=>{
           console.log(event);
        const rect=canvas.getBoundingClientRect();
           console.log(rect);
    
           const x=event.clientX-rect.left;
           const y=event.clientY-rect.top;
        //    console.log(x,y);

    circleobj.clickCircle(x,y);   
    let animationId = null;
    if (circleobj.isClicked == true) {
            
        cancelAnimationFrame(animationId);
            
        let updatearrow = function() {
                animationId = requestAnimationFrame(updatearrow);
                arrowobj.moveArrow(); 
                if (arrowobj.x1 <= circleobj.xposition + circleobj.radius) {
                    arrowobj.x1 = circleobj.xposition + circleobj.radius
                    arrowobj.draw(context)
                    delete arrowobj.moveArrow();
                    cancelAnimationFrame(animationId);
                
                    circleobj.changeColor("grey");
                    circleobj.draw(context);
                }
            };
        updatearrow();
        }
 
    })
  
}


resetbtn.addEventListener("click",()=>{
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    circles_array = [];
    arrows_array = [];
    
    for (var i=0;i<4;i++){
        y=[100,200,300,400]
        colours=["red","yellow","blue","green"]
        let circleobj=new Circle(100,y[i],25,colours[i],false);
        circleobj.draw(context)
        circles_array.push(circleobj)
        
        let arrowobj=new ArrowMark(500,y[i],3,false);
        arrowobj.draw(context)
        arrows_array.push(arrowobj)
    }   
    
    canvas.addEventListener('click',function(e){
        context.clearRect(0, 0, canvas.width, canvas.height);
        for(var i=0;i<circles_array.length;i++){
            circles_array[i].draw(context);
        }
        for(var i=0;i<arrows_array.length;i++){
            arrows_array[i].draw(context);
        }
        
        for(var i=0;i<circles_array.length;i++){
            if(circles_array[i].isClicked==false && circles_array[i].checkCollision(e.offsetX,e.offsetY)){
                circles_array[i].isClicked=true;
                circles_array[i].changeColor("green");
                
                let arrowobj=new ArrowMark(circles_array[i].xposition,circles_array[i].yposition,3,true);
                arrowobj.draw(context)
                arrows_array[i]=arrowobj;
                
                if(i<circles_array.length-1){
                    let circleobj=circles_array[i+1];
                    circleobj.draw(context);
                    circleobj.clickCircle();
                }
                
                break;
            }
        }
    });
    
});

