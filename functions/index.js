const functions = require('firebase-functions');
const express = require('express');;
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// налаштувати статичний каталог
app.use('public', express.static(path.join(__dirname, 'public')));
// підключти доступ до об'єкту req.body методу POST
app.use(express.json());

// тестування
app.post('/test', (req, res) => {
  res.send(req.body);
  console.log('> body ', req.body.tel);
});

// підготувати та відправити повідомлення користувача
app.post('/send', (req, res) => {
  const message = 'Повідомлення було успішно відправлено! Дякуємо.'
  // const lastName = req.body.customerLastName ? `<li>Прізвище: ${req.body.customerLastName}</li>` : null;
  // const middleName = req.body.customerMiddleName ? `<li>Ім'я по батькові: ${req.body.customerMiddleName}</li>` : null;
  console.log('body = ', req.body);
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
    res.send(true);
  });
});

// app.listen(3000, () => console.log('Server started...'));

exports.app = functions.https.onRequest(app); 