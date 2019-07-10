const functions = require('firebase-functions');
const express = require('express');;
const path = require('path');
const nodemailer = require('nodemailer');
const Joi = require('joi');

// Polifill
if (!String.prototype.splice) {
  String.prototype.splice = function(start, delCount, newSubStr) {
      return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
  };
}

const app = express();
// налаштувати статичний каталог
// app.use('public', express.static(path.join(__dirname, 'public')));
// підключти доступ до об'єкту req.body методу POST
app.use(express.json());

// тестування
app.post('/test', (req, res) => {
  res.send(req.body);
  console.log('> body ', req.body.tel);
});

// підготувати та відправити повідомлення користувача
app.post('/send', (req, res) => {
  // валідувати отримане повідомлення
  const schema = Joi.object().keys({
    firstName: Joi.string().trim().min(2).required(),
    lastName: Joi.string().trim().min(2).optional().allow(''),
    middleName: Joi.string().trim().min(2).optional().allow(''),
    tel: Joi.number().integer(10).required(),
    email: Joi.string().trim().email().optional().allow(''),
    message: Joi.string().trim().min(1).required()
  });

  const validationResult = Joi.validate(req.body, schema);

  // стилізувати номер
  let telNumber = req.body.tel;
  if (req.body.tel.length > 0) { telNumber = telNumber.splice(0, 0, '(') }
  if (req.body.tel.length > 3) { telNumber = telNumber.splice(4, 0, ') ') }
  if (req.body.tel.length > 5) { telNumber = telNumber.splice(8, 0, '-') }
  if (req.body.tel.length > 7) { telNumber = telNumber.splice(11, 0, '-') }
    
  // підготувати поля
  const lastName = req.body.lastName ? `<li>Прізвище: ${capitalizeFirstLetter(req.body.lastName)}</li>` : '';
  const middleName = req.body.middleName ? `<li>Ім'я по батькові: ${capitalizeFirstLetter(req.body.middleName)}</li>` : '';
  const email = req.body.email ? `<li>Email: ${req.body.email}</li>` : '';

  if (!validationResult.error) {
    const output = `
    <div>
      <h3>Ви отримали нове повідомлення:</h3>
      <p>${capitalizeFirstLetter(req.body.message)}</p>
      <h3>Від:</h3>
      <ul>  
        <li>Ім'я: ${capitalizeFirstLetter(req.body.firstName)}</li>
        ${lastName}
        ${middleName}
        <li>Телефон: ${telNumber}</li>
        ${email}
      </ul>
    </div>
  `;

    // створити транспортер
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: 'victor.s.snow@gmail.com',
        pass: 'W$m64rNoOM#Z'
      }
    });

    // зібрати повідомлення
    let mailOptions = {
      from: '"Туроператор KEY" <victor.s.snow@gmail.com>',
      to: 'vik8174@gmail.com',
      subject: 'Нове Повідомлення',
      // text: 'Hello world?', 
      html: output
    };

    // відправити зібране повідомлення
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) { return console.log(error) }
      res.status(200).send(validationResult);
    });
  } else {
    res.status(400).send(validationResult);
  }
});

// app.listen(3000, () => console.log('Server started...'));

exports.app = functions.https.onRequest(app); 

// зробити першу літеру рядка великою
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}