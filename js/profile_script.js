const _main = document.getElementById('nav');
const _sub = document.getElementById('sub_menu');

const _nav_ye = document.getElementById('nav_ye');
const _sub_ye = document.getElementById('sub_menu_ye');

const _lang = document.getElementById('lang');
const _sub_lang = document.getElementById('sub_menu_lang');

_main.addEventListener('mouseenter', e => {
  _sub.style.display = '';
});

_main.addEventListener('mouseleave', e => {
  _sub.style.display = 'none';
});

_nav_ye.addEventListener('mouseenter', e => {
  _sub_ye.style.display = '';
});

_nav_ye.addEventListener('mouseleave', e => {
  _sub_ye.style.display = 'none';
});

_lang.addEventListener('mouseenter', e => {
    console.log('yes');
     sub_menu_lang.style.display = '';
});

_lang.addEventListener('mouseleave', e => {
    console.log('no');
  sub_menu_lang.style.display = 'none';
});

//Скрипты для развертки и свертки 

/*!
 * Readmore.js jQuery plugin
 * Author: @jed_foster
 * Project home: jedfoster.github.io/Readmore.js
 * Licensed under the MIT license
 */

;(function($) {

  var readmore = 'readmore',
      defaults = {
        speed: 300,
        maxHeight: 200,
        heightMargin: 16,
        moreLink: '<a href="#">Read More</a>',
        lessLink: '<a href="#">Close</a>',
        embedCSS: true,
        sectionCSS: 'display: block; width: 100%;',
        startOpen: false,
        expandedClass: 'readmore-js-expanded',
        collapsedClass: 'readmore-js-collapsed',

        // callbacks
        beforeToggle: function(){},
        afterToggle: function(){}
      },
      cssEmbedded = false;

  function Readmore( element, options ) {
    this.element = element;

    this.options = $.extend( {}, defaults, options);

    $(this.element).data('max-height', this.options.maxHeight);
    $(this.element).data('height-margin', this.options.heightMargin);

    delete(this.options.maxHeight);

    if(this.options.embedCSS && ! cssEmbedded) {
      var styles = '.readmore-js-toggle, .readmore-js-section { ' + this.options.sectionCSS + ' } .readmore-js-section { overflow: hidden; }';

      (function(d,u) {
        var css=d.createElement('style');
        css.type = 'text/css';
        if(css.styleSheet) {
            css.styleSheet.cssText = u;
        }
        else {
            css.appendChild(d.createTextNode(u));
        }
        d.getElementsByTagName('head')[0].appendChild(css);
      }(document, styles));

      cssEmbedded = true;
    }

    this._defaults = defaults;
    this._name = readmore;

    this.init();
  }

  Readmore.prototype = {

    init: function() {
      var $this = this;

      $(this.element).each(function() {
        var current = $(this),
            maxHeight = (current.css('max-height').replace(/[^-\d\.]/g, '') > current.data('max-height')) ? current.css('max-height').replace(/[^-\d\.]/g, '') : current.data('max-height'),
            heightMargin = current.data('height-margin');

        if(current.css('max-height') != 'none') {
          current.css('max-height', 'none');
        }

        $this.setBoxHeight(current);

        if(current.outerHeight(true) <= maxHeight + heightMargin) {
          // The block is shorter than the limit, so there's no need to truncate it.
          return true;
        }
        else {
          current.addClass('readmore-js-section ' + $this.options.collapsedClass).data('collapsedHeight', maxHeight);

          var useLink = $this.options.startOpen ? $this.options.lessLink : $this.options.moreLink;
          current.after($(useLink).on('click', function(event) { $this.toggleSlider(this, current, event) }).addClass('readmore-js-toggle'));

          if(!$this.options.startOpen) {
            current.css({height: maxHeight});
          }
        }
      });

      $(window).on('resize', function(event) {
        $this.resizeBoxes();
      });
    },

    toggleSlider: function(trigger, element, event)
    {
      event.preventDefault();

      var $this = this,
          newHeight = newLink = sectionClass = '',
          expanded = false,
          collapsedHeight = $(element).data('collapsedHeight');

      if ($(element).height() <= collapsedHeight) {
        newHeight = $(element).data('expandedHeight') + 'px';
        newLink = 'lessLink';
        expanded = true;
        sectionClass = $this.options.expandedClass;
      }

      else {
        newHeight = collapsedHeight;
        newLink = 'moreLink';
        sectionClass = $this.options.collapsedClass;
      }

      // Fire beforeToggle callback
      $this.options.beforeToggle(trigger, element, expanded);

      $(element).animate({'height': newHeight}, {duration: $this.options.speed, complete: function() {
          // Fire afterToggle callback
          $this.options.afterToggle(trigger, element, expanded);

          $(trigger).replaceWith($($this.options[newLink]).on('click', function(event) { $this.toggleSlider(this, element, event) }).addClass('readmore-js-toggle'));

          $(this).removeClass($this.options.collapsedClass + ' ' + $this.options.expandedClass).addClass(sectionClass);
        }
      });
    },

    setBoxHeight: function(element) {
      var el = element.clone().css({'height': 'auto', 'width': element.width(), 'overflow': 'hidden'}).insertAfter(element),
          height = el.outerHeight(true);

      el.remove();

      element.data('expandedHeight', height);
    },

    resizeBoxes: function() {
      var $this = this;

      $('.readmore-js-section').each(function() {
        var current = $(this);

        $this.setBoxHeight(current);

        if(current.height() > current.data('expandedHeight') || (current.hasClass($this.options.expandedClass) && current.height() < current.data('expandedHeight')) ) {
          current.css('height', current.data('expandedHeight'));
        }
      });
    },

    destroy: function() {
      var $this = this;

      $(this.element).each(function() {
        var current = $(this);

        current.removeClass('readmore-js-section ' + $this.options.collapsedClass + ' ' + $this.options.expandedClass).css({'max-height': '', 'height': 'auto'}).next('.readmore-js-toggle').remove();

        current.removeData();
      });
    }
  };

  $.fn[readmore] = function( options ) {
    var args = arguments;
    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if ($.data(this, 'plugin_' + readmore)) {
          var instance = $.data(this, 'plugin_' + readmore);
          instance['destroy'].apply(instance);
        }

        $.data(this, 'plugin_' + readmore, new Readmore( this, options ));
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      return this.each(function () {
        var instance = $.data(this, 'plugin_' + readmore);
        if (instance instanceof Readmore && typeof instance[options] === 'function') {
          instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }
      });
    }
  }
})(jQuery);


/* Анимация для раскрывания правых блоков */

const strelkaSpec = document.getElementById('chevronSpec');
const spec = document.getElementById('special');

let i=spec.clientHeight;
strelkaSpec.onclick = function() {
   if(i==0){
       let g = setInterval(function(){
           spec.style.height = i+ 'px';
           i++;
           if(i==153) { clearInterval(g); strelkaSpec.setAttribute('class', 'fas fa-chevron-up');}
       },5)
   } 
    
   else { 
    let g = setInterval(function(){
           spec.style.height = i+ 'px';
           i--;
           if(i==-1) { clearInterval(g); i=0; strelkaSpec.setAttribute('class', 'fas fa-chevron-down');}
       },5)
    }
}


const strelkaSim = document.getElementById('chevronSim');
const sim = document.getElementById('similar');

let k=sim.clientHeight;
strelkaSim.onclick = function() {
   if(k==0){
       let g = setInterval(function(){
           sim.style.height = k+ 'px';
           k++;
           if(k==181) { clearInterval(g); strelkaSim.setAttribute('class', 'fas fa-chevron-up');}
       },5)
   } 
    
   else { 
    let g = setInterval(function(){
           sim.style.height = k+ 'px';
           k--;
           if(k==-1) { clearInterval(g); k=0; strelkaSim.setAttribute('class', 'fas fa-chevron-down');}
       },5)
    }
}

const strelkaMenu = document.getElementById('chevronMenu');
const menuBl = document.getElementById('menuBlock');
const menu = document.getElementById('menu__blocks');

let m=menu.clientHeight;
menuBl.onclick = function() {
   if(m==0){
       let g = setInterval(function(){
           menu.style.height = m+ 'px';
           m++;
           if(m==89) { clearInterval(g); strelkaMenu.setAttribute('class', 'fas fa-chevron-up');
            menu.style.overflow = '';}
       },1)
   } 
    
   else { 
    let g = setInterval(function(){
           menu.style.height = m+ 'px';
           menu.style.overflow = 'hidden';
           m--;
           if(m==-1) { clearInterval(g); m=0; strelkaMenu.setAttribute('class', 'fas fa-chevron-down');
          }
       },1)
    }
}

const strelkaFin = document.getElementById('chevronFin');
const finBl = document.getElementById('finBlock');
const fin = document.getElementById('fin__blocks');

let f=fin.clientHeight;
finBl.onclick = function() {
   if(f==0){
       let g = setInterval(function(){
           fin.style.height = f+ 'px';
           f++;
           if(f==89) { clearInterval(g); strelkaFin.setAttribute('class', 'fas fa-chevron-up');}
       },1)
   } 
    
   else { 
    let g = setInterval(function(){
           fin.style.height = f+ 'px';
           f--;
           if(f==-1) { clearInterval(g); f=0; strelkaFin.setAttribute('class', 'fas fa-chevron-down');}
       },1)
    }
}


const strelkaProf = document.getElementById('chevronProf');
const profBl = document.getElementById('profBlock');
const prof = document.getElementById('prof__blocks');

let p=prof.clientHeight;
profBl.onclick = function() {
   if(p==0){
       let g = setInterval(function(){
           prof.style.height = p+ 'px';
           p++;
           if(p==89) { clearInterval(g); strelkaProf.setAttribute('class', 'fas fa-chevron-up');}
       },1)
   } 
    
   else { 
    let g = setInterval(function(){
           prof.style.height = p+ 'px';
           p--;
           if(p==-1) { clearInterval(g); p=0; strelkaProf.setAttribute('class', 'fas fa-chevron-down');}
       },1)
    }
}


const strelkaPep = document.getElementById('chevronPep');
const pepBl = document.getElementById('peopleBlock');
const pep = document.getElementById('people__blocks');

let peop=pep.clientWidth;
pepBl.onclick = function() {
   if(peop==0){
       
       if(al>0) {als.style.width = 0; als.style.height = 0; al=0; 
       strelkaAl.setAttribute('class', 'fas fa-chevron-right');}
       
       pep.style.width = '190px'; peop = 190;
       pep.style.height = 'auto';
       strelkaPep.setAttribute('class', 'fas fa-chevron-left');
       
      /* let g = setInterval(function(){
           pep.style.width = peop+ 'px';
           pep.style.height = 'auto';
           peop++;
           if(peop==191) { clearInterval(g); strelkaPep.setAttribute('class', 'fas fa-chevron-left');}
       },0.001) */
   } 
    
   else { 
      pep.style.width = 0;
      pep.style.height = 0; peop = 0;
      strelkaPep.setAttribute('class', 'fas fa-chevron-right');
    
    }
}

const strelkaAl = document.getElementById('chevronAl');
const alBl = document.getElementById('alsoBlock');
const als = document.getElementById('also__blocks');

let al=als.clientWidth;
alBl.onclick = function() {
   if(al==0){
       
       if(peop>0) {pep.style.width = 0;
      pep.style.height = 0; peop = 0;
      strelkaPep.setAttribute('class', 'fas fa-chevron-right');}
       
      als.style.width = '150px'; al = 150;
      als.style.height = 'auto';
      strelkaAl.setAttribute('class', 'fas fa-chevron-left');
       
      /* let g = setInterval(function(){
           als.style.width = al+ 'px';
           als.style.height = 'auto';
           al++;
           if(al==151) { clearInterval(g); strelkaAl.setAttribute('class', 'fas fa-chevron-left');}
       },0.01)*/
   } 
    
   else { 
       als.style.width = 0;
       als.style.height = 0; al=0; 
       strelkaAl.setAttribute('class', 'fas fa-chevron-right');
    
    }
}


const strelkaAbSv = document.getElementById('chevronAbSv');
const abSvBl = document.getElementById('aboutServiceBlock');
const abSv = document.getElementById('aboutServiceBlocks');

let ab_Sv=abSv.clientHeight;
abSvBl.onclick = function() {
   if(ab_Sv==0){
       abSvBl.style.color = '#6F6BFF';
       
       let g = setInterval(function(){
           abSv.style.height = ab_Sv+ 'px';
           ab_Sv++;
           if(ab_Sv==56) { clearInterval(g); strelkaAbSv.setAttribute('class', 'fas fa-chevron-up');}
       },1)
   } 
    
   else { 
    let g = setInterval(function(){
           abSv.style.height = ab_Sv+ 'px';
           ab_Sv--;
           if(ab_Sv==-1) { clearInterval(g); ab_Sv=0; strelkaAbSv.setAttribute('class', 'fas fa-chevron-down'); abSvBl.style.color = '#fff';}
       },1)
    }
}


const strelkaFUr = document.getElementById('chevronForUsers');
const fUrBl = document.getElementById('forUsersBlock');
const fUr = document.getElementById('forUsersBlocks');

let f_Ur=fUr.clientHeight;
fUrBl.onclick = function() {
   if(f_Ur==0){
       fUrBl.style.color = '#6F6BFF';
       
       let g = setInterval(function(){
           fUr.style.height = f_Ur+ 'px';
           f_Ur++;
           if(f_Ur==122) { clearInterval(g); strelkaFUr.setAttribute('class', 'fas fa-chevron-up');}
       },1)
   } 
    
   else { 
    let g = setInterval(function(){
           fUr.style.height = f_Ur+ 'px';
           f_Ur--;
           if(f_Ur==-1) { clearInterval(g); f_Ur=0; strelkaFUr.setAttribute('class', 'fas fa-chevron-down'); fUrBl.style.color = '#fff';}
       },1)
    }
}


const strelkaHp = document.getElementById('chevronHp');
const hpBl = document.getElementById('hpBlock');
const hp = document.getElementById('hpBlocks');

let h_p=hp.clientHeight;
hpBl.onclick = function() {
   if(h_p==0){
       hpBl.style.color = '#6F6BFF';
       
       let g = setInterval(function(){
           hp.style.height = h_p+ 'px';
           h_p++;
           if(h_p==89) { clearInterval(g); strelkaHp.setAttribute('class', 'fas fa-chevron-up');}
       },1)
   } 
    
   else { 
    let g = setInterval(function(){
           hp.style.height = h_p+ 'px';
           h_p--;
           if(h_p==-1) { clearInterval(g); h_p=0; strelkaHp.setAttribute('class', 'fas fa-chevron-down'); hpBl.style.color = '#fff';}
       },1)
    }
}


const strelkaSc = document.getElementById('chevronSc');
const scBl = document.getElementById('scBlock');
const sc = document.getElementById('scBlocks');

let s_c=sc.clientHeight;
scBl.onclick = function() {
   if(s_c==0){
       scBl.style.color = '#6F6BFF';
       
       let g = setInterval(function(){
           sc.style.height = s_c+ 'px';
           s_c++;
           if(s_c==33) { clearInterval(g); strelkaSc.setAttribute('class', 'fas fa-chevron-up');}
       },1)
   } 
    
   else { 
    let g = setInterval(function(){
           sc.style.height = s_c+ 'px';
           s_c--;
           if(s_c==-1) { clearInterval(g); s_c=0; strelkaSc.setAttribute('class', 'fas fa-chevron-down'); scBl.style.color = '#fff';}
       },1)
    }
}



 /* SLIDERS */


var slideNow = 1;
var slideCount = $('#slidewrapper').children().length;
var slideInterval = 3000;
var navBtnId = 0;
var translateWidth = 0;

$(document).ready(function() {
    var switchInterval = setInterval(nextSlide, slideInterval);

    $('#viewport').hover(function() {
        clearInterval(switchInterval);
    }, function() {
        switchInterval = setInterval(nextSlide, slideInterval);
    });

    $('#next-btn').click(function() {
        nextSlide();555
    });

    $('#prev-btn').click(function() {
        prevSlide();
    });

    $('.slide-nav-btn').click(function() {
        navBtnId = $(this).index();

        if (navBtnId + 1 != slideNow) {
            translateWidth = -$('#viewport').width() * (navBtnId);
            $('#slidewrapper').css({
                'transform': 'translate(' + translateWidth + 'px, 0)',
                '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
            });
            slideNow = navBtnId + 1;
        }
    });
});


function nextSlide() {
    if (slideNow == slideCount || slideNow <= 0 || slideNow > slideCount) {
        $('#slidewrapper').css('transform', 'translate(0, 0)');
        slideNow = 1;
    } else {
        translateWidth = -$('#viewport').width() * (slideNow);
        $('#slidewrapper').css({
            'transform': 'translate(' + translateWidth + 'px, 0)',
            '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
            '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
        });
        slideNow++;
    }
}

function prevSlide() {
    if (slideNow == 1 || slideNow <= 0 || slideNow > slideCount) {
        translateWidth = -$('#viewport').width() * (slideCount - 1);
        $('#slidewrapper').css({
            'transform': 'translate(' + translateWidth + 'px, 0)',
            '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
            '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
        });
        slideNow = slideCount;
    } else {
        translateWidth = -$('#viewport').width() * (slideNow - 2);
        $('#slidewrapper').css({
            'transform': 'translate(' + translateWidth + 'px, 0)',
            '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
            '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
        });
        slideNow--;
    }
}













