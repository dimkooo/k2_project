///////////////////////
// POLIFILL
if (!String.prototype.splice) {
  String.prototype.splice = function (start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
  };
}

///////////////////////
// SIDEBAR

// встановити ширину sidebar
let bodyWidth = document.getElementsByTagName('body')[0].offsetWidth;
bodyWidth = bodyWidth <= 360 ? bodyWidth : 360;
document.getElementById('panel').style.width = bodyWidth + "px";
document.getElementById('panel').setAttribute('style', `width:${bodyWidth}px`);

// показати sidebar
const onShowSidebar = () => {
  if (document.getElementsByTagName('body')[0].offsetWidth < 992) {
    document.getElementById('backdrop').classList.add('backdrop--shown');
    document.getElementById('panel').classList.add('panel--shown');
  }
}

// сховати sidebar
const onHideSidebar = () => {
  document.getElementById('backdrop').classList.remove('backdrop--shown');
  document.getElementById('panel').classList.remove('panel--shown');
}

// показати sidebar за допомогою swipe-жесту
const mcBody = new Hammer.Manager(document.getElementsByTagName('body')[0]);
mcBody.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_RIGHT }));
mcBody.on("swipe", onShowSidebar);

// сховати sidebar за допомогою swipe-жесту;
const mcPanel = new Hammer.Manager(document.getElementById('panel'));
mcPanel.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_LEFT }));
mcPanel.on("swipe", onHideSidebar);

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

  // вадідувати поля
  const schema = {
    firstName: {
      type: 'string',
      length: {
        minimum: 2,
        maximum: 12
      }
    },
    lastName: {
      format: { pattern: /^$|[A-Za-zЄ-ЯҐа-їґ]{2,12}/ }
    },
    middleName: {
      format: { pattern: /^$|[A-Za-zЄ-ЯҐа-їґ]{2,12}/ }
    },
    tel: {
      numericality: { onlyInteger: true },
      length: { is: 10 }
    },
    email: {
      format: { pattern: /^$|^.*@.*\..*$/ }
    },
    message: {
      type: 'string',
      length: { minimum: 1 }
    }
  };

  let telNumber = '';
  for (let i = 0; i < tel.value.length; i++) {
    if (Number.isInteger(+tel.value[i]) && tel.value[i] !== ' ' && i < 15) {
      telNumber += tel.value[i];
    }
  }

  let validation = validate({
    firstName: firstName.value,
    lastName: lastName.value,
    middleName: middleName.value,
    tel: telNumber,
    email: email.value,
    message: message.value
  }, schema);
  validation = !validation ? 'OK' : validation;
  console.log('> Validation:', validation);

  if (validation !== 'OK') {
    validation = Object.keys(validation);
    validation.forEach((key) => {
      switch (key) {
        case 'firstName':
          firstName.classList.add('is-invalid');
          document.getElementById('customer-first-name-mandatory').classList.remove('send-message__mandatory--shown');
          break;
        case 'lastName':
          lastName.classList.add('is-invalid');
          break;
        case 'middleName':
          middleName.classList.add('is-invalid');
          break;
        case 'tel':
          tel.classList.add('is-invalid');
          document.getElementById('customer-tel-mandatory').classList.remove('send-message__mandatory--shown');
          break;
        case 'email':
          email.classList.add('is-invalid');
          break;
        case 'message':
          message.classList.add('is-invalid');
          document.getElementById('customer-message-mandatory').classList.remove('send-message__mandatory--shown');
          break;
      }
    });
    return;
  }

  // відравити повідомлення за допомогою AJAX
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) { // повідомлення відправлено успішно
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
    } else if (this.readyState == 4 && this.status == 400) { // виявлено помилку у даних, що відправлені клієнтом
      document.getElementsByClassName('loader__message')[0].textContent = 'Помилка відправлених даних.';
      document.getElementsByClassName('loader__message')[1].textContent = 'Будь ласка, виправте помилку.';
      document.getElementById('loader').classList.remove('loader--shown');
      loaderModalContent.classList.add('loader__modal-content--shown');

      console.log('> Response:', this.status);
      console.log('> ', this.responseText);
    } else if (this.readyState == 4) { // інші помилки
      document.getElementById('loader').classList.remove('loader--shown');
      loaderModalContent.classList.add('loader__modal-content--shown');

      console.log('> Response:', this.status);
      console.log('> ', this.responseText);

      document.getElementsByClassName('loader__message')[0].textContent = `${this.status}`;
      document.getElementsByClassName('loader__message')[1].textContent = `${this.statusText}.`;
    }
  };
  xhttp.open("POST", "/send", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({
    firstName: firstName.value,
    lastName: lastName.value,
    middleName: middleName.value,
    tel: telNumber,
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

// сховати позначення поля First Name як некоректне
firstName.addEventListener('input', () => {
  firstName.classList.remove('is-invalid');
  document.getElementById('customer-first-name-mandatory').classList.add('send-message__mandatory--shown');
});

// сховати позначення поля Last Name як некоректне
lastName.addEventListener('input', () => {
  lastName.classList.remove('is-invalid');
});

// сховати позначення поля Middle Name як некоректне
middleName.addEventListener('input', () => {
  middleName.classList.remove('is-invalid');
});

// сховати позначення поля Tel як некоректне
tel.addEventListener('input', () => {
  tel.classList.remove('is-invalid');
  document.getElementById('customer-tel-mandatory').classList.add('send-message__mandatory--shown');
  tel.value = styleTel(tel.value);
});

// сховати позначення поля Email як некоректне
email.addEventListener('input', () => {
  email.classList.remove('is-invalid');
});

// сховати позначення поля Message як некоректне
message.addEventListener('input', () => {
  message.classList.remove('is-invalid');
  document.getElementById('customer-message-mandatory').classList.add('send-message__mandatory--shown');
});

// стилізувати номер телефону
const styleTel = (telRecieved) => {
  telRecieved = telRecieved.toString();
  let telPurified = '';
  let telModified = '';

  // позбутися символів стилізації 
  for (let i = 0; i < telRecieved.length; i++) {
    if (Number.isInteger(+telRecieved[i]) && telRecieved[i] !== ' ' && i < 15) {
      telPurified += telRecieved[i];
    }
  }
  telModified = telPurified;

  // стилізувати номер
  if (telPurified.length > 0) { telModified = telModified.splice(0, 0, '(') }
  if (telPurified.length > 3) { telModified = telModified.splice(4, 0, ') ') }
  if (telPurified.length > 5) { telModified = telModified.splice(8, 0, '-') }
  if (telPurified.length > 7) { telModified = telModified.splice(11, 0, '-') }

  return telModified;
}

