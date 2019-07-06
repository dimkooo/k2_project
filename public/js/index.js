///////////////////////
// SIDEBAR

const backdrop = document.getElementById('backdrop');
const senderBackdrop = document.getElementById('sender-backdrop');
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

const customerMessageForm = document.getElementById('customer-message-form');
const onSubmitCustomerMessage = (event) => {
    if (event) { event.preventDefault() }
    const firstName = document.getElementById('customer-first-name').value;
    const lastName = document.getElementById('customer-last-name').value;
    const middleName = document.getElementById('customer-middle-name').value;
    const tel = document.getElementById('customer-tel').value;
    const email = document.getElementById('customer-email').value;
    const message = document.getElementById('customer-message').value;

    // AJAX
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log('> Response:', this.responseText);
        senderBackdrop.classList.remove('sender__backdrop--shown');
      }
    };
    xhttp.open("POST", "/send", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      middleName: middleName,
      tel: tel,
      email: email,
      message: message
    })); 
    console.log('> Відправлено');

    // активувати backdrop
    senderBackdrop.classList.add('sender__backdrop--shown');
}
customerMessageForm.addEventListener('submit', onSubmitCustomerMessage, false);
// customerMessageForm.submit = onSubmitCustomerMessage;