///////////////////////
// SIDEBAR

// встановити ширину sidebar
let bodyWidth = document.getElementsByTagName('body')[0].offsetWidth;
bodyWidth = bodyWidth <= 360 ? bodyWidth : 360;
document.getElementById('panel').style.width = bodyWidth + "px";
document.getElementById('panel').setAttribute('style', `width:${bodyWidth}px`);

// показати sidebar
const onShowSidebar = () => {
  document.getElementById('backdrop').classList.add('backdrop--shown');
  document.getElementById('panel').classList.add('panel--shown');
}

// сховати sidebar
const onHideSidebar = () => {
  document.getElementById('backdrop').classList.remove('backdrop--shown');
  document.getElementById('panel').classList.remove('panel--shown');
}

// сховати sidebar за допомогою swipe-жесту
const hammerHide = new Hammer(panel);
hammerHide.on('swipe', onHideSidebar);
hammerHide.get('swipe').set({ direction: Hammer.DIRECTION_LEFT });

///////////////////////////
// CUSTOMER MESSAGE

const firstName = document.getElementById('customer-first-name');
const lastName = document.getElementById('customer-last-name');
const middleName = document.getElementById('customer-middle-name');
const tel = document.getElementById('customer-tel');
const email = document.getElementById('customer-email');
const message = document.getElementById('customer-message');

const loaderModalContent = document.getElementById('loader-modal-content');
const customerMessageForm = document.getElementById('customer-message-form');

const onSubmitCustomerMessage = (event) => {
  // зупинити перевантаження сторінки
  if (event) { event.preventDefault() }

  // відравити повідомлення за допомогою AJAX
  let prevStatusText = '';
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementsByClassName('loader__message')[0].textContent = 'Повідомлення відправлено успішно.';
      document.getElementsByClassName('loader__message')[1].textContent = 'Дякуємо.';
      document.getElementById('loader').classList.remove('loader--shown');
      loaderModalContent.classList.add('loader__modal-content--shown');

      console.log('> Response:', this.status);
      console.log('> ', this.responseText);

      firstName.value = '';
      lastName.value = '';
      middleName.value = '';
      tel.value = '';
      email.value = '';
      message.value = '';
    } else if (this.readyState == 4 && this.status == 400) {
      document.getElementsByClassName('loader__message')[0].textContent = 'Помилка відправлених даних.';
      document.getElementsByClassName('loader__message')[1].textContent = 'Будь ласка, виправте помилку.';
      document.getElementById('loader').classList.remove('loader--shown');
      loaderModalContent.classList.add('loader__modal-content--shown');

      console.log('> Response:', this.status);
      console.log('> ', this.responseText);
    } else if (this.readyState == 4) {
      document.getElementById('loader').classList.remove('loader--shown');
      loaderModalContent.classList.add('loader__modal-content--shown');

      // console.log('> Response:', this.status, this.statusText);
      console.log('> Response:', this.status);
      console.log('> ', this.responseText);

      document.getElementsByClassName('loader__message')[0].textContent = `${this.status}`;
      document.getElementsByClassName('loader__message')[1].textContent = `${this.statusText}.`;
      prevStatusText = this.statusText;
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
  console.log('> Request: Done');

  // активувати backdrop
  $('#loader-modal').modal('show');
  document.getElementById('loader').classList.add('loader--shown');
}
customerMessageForm.addEventListener('submit', onSubmitCustomerMessage, false);

// сховати завантажувач
const hideLoader = () => {
  $('#loader-modal').modal('hide');
  loaderModalContent.classList.remove('loader__modal-content--shown');;
}


