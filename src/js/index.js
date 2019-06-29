///////////////////////
// SIDEBAR

const backdrop = document.getElementById('backdrop');
const panel = document.getElementById('panel');

// встановити ширину sidebar
var bodyWidth = document.getElementsByTagName('body')[0].offsetWidth;
bodyWidth = bodyWidth <= 360 ? bodyWidth : 360; 
panel.style.width = bodyWidth + "px";
panel.setAttribute('style',`width:${bodyWidth}px`);

// показати sidebar
const onShowSidebar = () => {
  backdrop.classList.add('backdrop--shown');
  panel.classList.add('panel--shown');
}

// сховати sidebar
const onHideSidebar = () => {
  backdrop.classList.remove('backdrop--shown');
  panel.classList.remove('panel--shown');
}

// сховати sidebar за допомогою swipe-жесту
var hammerHide = new Hammer(panel);
hammerHide.on('swipe', onHideSidebar);
hammerHide.get('swipe').set({ direction: Hammer.DIRECTION_LEFT });

///////////////////////
// SEND MESSAGE

// валідація форми
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();