var buton= document.querySelector(".navbar-toggler");
var hover= document.querySelectorAll(".ad-shader");
var visible=0;


  $(window).scroll(function(){
    if(visible==0){
    $('nav').toggleClass("scrolled",$(this).scrollTop() > 380 );
    }
  });



buton.addEventListener("click",function(){
  $('nav').toggleClass("scrolled");
  visible=!visible;
});
