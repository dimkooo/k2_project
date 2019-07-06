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

///////////////////////////
// ВІДПРАВИТИ ПОВІДОМЛЕННЯ

var customerMessageForm = document.getElementById('customer-message-form');
function onSubmitCustomerMessage(event) {
    if (event) { event.preventDefault() }
    const firstName = document.getElementById('customer-first-name').value;
    console.log(firstName);


    // do AJAX stuff...
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log('> server', this.responseText);
      }
    };
    xhttp.open("POST", "/test", true);
    xhttp.send(); 
    console.log('submitted');
}
customerMessageForm.addEventListener('submit', onSubmitCustomerMessage, false);
// customerMessageForm.submit = onSubmitCustomerMessage;