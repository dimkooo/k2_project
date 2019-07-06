const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.post('/test', (req, res) => {
  res.send('Hello:)');
});

app.post('/send', (req, res) => {
  const message = 'Повідомлення було успішно відправлено! Дякуємо.'
  // const lastName = req.body.customerLastName ? `<li>Прізвище: ${req.body.customerLastName}</li>` : null;
  // const middleName = req.body.customerMiddleName ? `<li>Ім'я по батькові: ${req.body.customerMiddleName}</li>` : null;
  console.log('body = ', req.body);
  const output = `
    <div>
      <h3>Ви отримали нове повідомлення:</h3>
      <br />
      <p>${req.body.customerMessage}</p>
      <br />
      <h3>Від:</h3>
      <ul>  
        <li>Ім'я: ${req.body.customerFirstName}</li>
        <li>Прізвище: ${req.body.customerLastName}</li>
        <li>Ім'я по батькові: ${req.body.customerMiddleName}</li>
        <li>Телефон: ${req.body.customerTel}</li>
        <li>Email: ${req.body.customerEmail}</li>
      </ul>
    </div>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'victor.s.snow@gmail.com', // generated ethereal user
      pass: 'W$m64rNoOM#Z'  // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Туроператор KEY" <victor.s.snow@gmail.com>', // sender address
    to: 'vik8174@gmail.com', // list of receivers
    subject: 'Нове Повідомлення', // Subject line
    // text: 'Hello world?', // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', { layout: false, msg: message });
  });
});

// app.listen(3000, () => console.log('Server started...'));

exports.app = functions.https.onRequest(app); 