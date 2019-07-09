const functions = require('firebase-functions');
const express = require('express');;
const path = require('path');
const nodemailer = require('nodemailer');
const Joi = require('joi');

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
    firstName: Joi.string().trim().alphanum().min(2).max(12).required(),
    lastName: Joi.string().trim().alphanum().min(2).max(12).optional().allow(''),
    middleName: Joi.string().trim().alphanum().min(2).max(12).optional().allow(''),
    tel: Joi.number().integer(10).required(),
    email: Joi.string().trim().email().optional().allow(''),
    message: Joi.string().trim().min(1).required()
  });

  const validationResult = Joi.validate(req.body, schema);
  console.log('> validationResult', validationResult);

  if (!validationResult.error) {
    const output = `
    <div>
      <h3>Ви отримали нове повідомлення:</h3>
      <br />
      <p>${req.body.message}</p>
      <br />
      <h3>Від:</h3>
      <ul>  
        <li>Ім'я: ${req.body.firstName}</li>
        <li>Прізвище: ${req.body.lastName}</li>
        <li>Ім'я по батькові: ${req.body.middleName}</li>
        <li>Телефон: ${req.body.tel}</li>
        <li>Email: ${req.body.email}</li>
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