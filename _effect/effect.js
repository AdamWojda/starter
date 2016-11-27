/*

effect -  by Effectivity.pl

*/


var effect = {
    
    /* variable */
    
    fileExtension: 'jpg',
    
    /* init */
    
    init: function(){
        this.buildHtml();
        this.setAction();
    },
    
    /* action */

    setAction: function(){
        $(window).keypress(function(e) {
            var keyCode = e.keyCode ? e.keyCode : e.charCode;

            switch(keyCode) {
                    case 96 : { $('#effect').toggle(); return false;  break; }
                    case 49 : { $('#effect').css({"opacity" : "1.0"}); break; }
                    case 50 : { $('#effect').css({"opacity" : "0.75"}); break; }
                    case 51 : { $('#effect').css({"opacity" : "0.5"}); break; }
                    case 52 : { $('#effect').css({"opacity" : "0.25"}); break; } 
            }
        });
    },

    /* build */
    
    buildHtml: function(){
        
        $("body").prepend(
            $("<div>")
                .attr("id", "effect")
                .css({"background" : "url(_effect/" + effect.getFileName() + ") no-repeat center top"})
                .css({"display" : "block"})
                .css({"left" : "0"})
                .css({"position" : "absolute"})
                .css({"top" : "0"})
                .css({"width" : "100%"})
                .css({"z-index" : "9999"})
                .prepend(
                        $("<img>")
                        .attr("src", "_effect/" + effect.getFileName())
                        .error(function(e) {
                                alert('Nie znaleziono pliku o nazwie: \n\n ' + effect.getFileName());
                        }).load(function(){
                            $("body").css({"min-height" : $('#effect').height() + "px"});
                            $('#effect').height($('#effect').find("img").height());
                            $('#effect').css({"left" : Math.round(($(window).width() - $('#effect').width()) / 2) + "px" });
                            $('#effect').find("img").remove();
                            $('#effect').hide();
                        })
        ));

    },
    
    getFileName: function(){
        return document.location.href.substring(document.location.href.lastIndexOf("/")+1, document.location.href.lastIndexOf("."))+'.'+effect.fileExtension;
    }

};


$(window).load(function() {
    effect.init();   
});