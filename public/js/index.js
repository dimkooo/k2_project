///////////////////////
// SIDEBAR

const backdrop = document.getElementById('backdrop');
const panel = document.getElementById('panel');
const loader = document.getElementById('loader');
const loaderSpinner = document.getElementById('loader-spinner');
const loaderModal = document.getElementById('loader-modal');

const firstName = document.getElementById('customer-first-name');
const lastName = document.getElementById('customer-last-name');
const middleName = document.getElementById('customer-middle-name');
const tel = document.getElementById('customer-tel');
const email = document.getElementById('customer-email');
const message = document.getElementById('customer-message');

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

    // AJAX
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log('> Відповідь:', this.responseText);

        loaderSpinner.classList.add('loader__spinner--hidden');
        loaderModal.classList.add('loader__modal--shown');

        firstName.value = '';
        lastName.value = '';
        middleName.value = '';
        tel.value = '';
        email.value = '';
        message.value = '';
      }
    };
    xhttp.open("POST", "/send", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      firstName: firstName.value,
      lastName: lastName.value,
      middleName: middleName.value,
      tel: tel.value,
      email: email.value,
      message: message.value
    })); 
    console.log('> Форма відправлена');

    // активувати backdrop
    loader.classList.add('loader--shown');
}
customerMessageForm.addEventListener('submit', onSubmitCustomerMessage, false);
// customerMessageForm.submit = onSubmitCustomerMessage;

const hideLoader = () => {
  loader.classList.remove('loader--shown');
}