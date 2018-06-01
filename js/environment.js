const environment = function(c, bg, ctx){
    this.c = c;
    this.ctx = ctx;
    this.bgPos = 0;
    this.fgpos = 0;
    this.bgSpeed = 2;
    this.bgImg = bg;
    this.bgWidth = 120;

    this.update = function(bgS){
        
        this.bgSpeed = bgS;
        this.bgPos -= this.bgSpeed;

        if(this.bgPos < -cwidth ){
            this.bgPos = 0;
        }

       
    } 

    this.render = function(){
        
        for(var i=0; i<2*c.width/this.bgWidth; ++i)    
            this.ctx.drawImage(this.bgImg, this.bgPos+i*this.bgWidth, 0);
    }
}
