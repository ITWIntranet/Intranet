/*1.- //Solicitud Contraseña
val1=contraseña

2.- //Retro Solicitud
val1= tipo de solicitud		val2=Aprobo/Denego	val3=nombre lider

3.- //Vencimiento Vacaciones
val1=Cantidad de Vacaciones	val2=cantidad de meses en que venceran

4.- //Regreso Vacaciones
Sin datos de entrada

5.- //Vacaciones Vencidas
val1= Dias Vencidos

6.- //Solicitudes usuario
val1=tipo de solicitud		val2=nombre lider

7.- //Solicitudes Lider
val1=tipo de solicitud		val2=persona solicitante
*/

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
var fs = require('fs');
var StatusMail = true
const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var cors = require('cors')
app.use(cors())

app.post('/SendMail', function (req, res) {
  res.set('Content-Type', 'text/plain');
  correo(req.body.MailType, req.body.valName, req.body.val1, req.body.val2, req.body.val3, req.body.Mailto);
  res.send('{"Respuesta": "' + StatusMail + '"}')
})

//Solicitud de Correo
function correo(MailType, valName, val1, val2, val3, Mailto) {
  var output = ``
  if (MailType == '1') {
    //Solicitud Contraseña
    output = `
    <p>Hola ${valName}:</p>
    <ul>  
      Tu contraseñas para acceder a la página <a href="http://intranet.itw.mx" >intranet.itw.mx</a> es :<br>
          <br><br><strong>${val1}</strong>
    </ul><br><br> 
    <h5>Favor de no replicar este mensaje, Mensaje generado Automáticamente</h5>
    <p><img src="cid:Mail"></p>
    `;
  } else if (MailType == '2') {
    //Retro Solicitud  
    output = `
    <p>Hola ${valName}:</p>
    <ul>  
      Te informamos que tu solicitud de <strong>${val1}</Strong> ha sido <strong>${val2}</Strong>, Si tienes alguna duda te sugerimos revisarlo con tu líder <strong>${val3}</Strong>.
    </ul><br><br> 
    <h5>Favor de no replicar este mensaje, Mensaje generado Automáticamente</h5>
    <p><img src="cid:Mail"></p>
    `;
  } else if (MailType == '3') {
    //Vencimiento Vacaciones
    output = `
    <p>Hola ${valName}:</p>
    <ul>  
      Te notificamos que tus <strong>${val1}</strong> días de Vacaciones vencerán dentro de los próximos <strong>${val2}</strong> meses.<br>
      Te sugerimos ir planificándolos para evitar que se pierdan.
    </ul><br><br> 
    <h5>Favor de no replicar este mensaje, Mensaje generado Automáticamente</h5>
    <p><img src="cid:Mail"></p>
    `;
  } else if (MailType == '4') {
    //Regreso Vacaciones
    output = `
    <p>¡Bienvenido de nuevo ${valName}!</p>
    <ul>  
      Estamos muy felices de tenerte de vuelta en ITW. Todos te hemos extrañado, y los clientes han estado ansiosos por tu regreso. Esperamos que disfrutaras al máximo tus vacaciones.
    </ul><br><br>
    <h5>Favor de no replicar este mensaje, Mensaje generado Automáticamente</h5>
    <p><img src="cid:Mail"></p>
    `;
  } else if (MailType == '5') {
    //Vacaciones Vencidas
    output = `
    <p>Hola ${valName}:</p>
    <ul>
      Lamentamos informarte pero tus <strong>${val1}</strong> días de Vacaciones han <strong>Vencido</strong>, te recomendamos planees con anticipación tus vacaciones de posteriores años.
    </ul><br><br> 
    <h5>Favor de no replicar este mensaje, Mensaje generado Automáticamente</h5>
    <p><img src="cid:Mail"></p>
    `;
  } else if (MailType == '6') {
    //Solicitudes usuario
    output = `
    <p>Hola ${valName}:</p>
    <ul>  
      Te notificamos que tu solicitud de <strong>${val1}</strong> se ha registrado y enviado a tu Líder <strong>${val2}</strong>, En cuanto sea validada se te enviara una notificación por este mismo medio.
    </ul><br><br> 
    <h5>Favor de no replicar este mensaje, Mensaje generado Automáticamente</h5>
    <p><img src="cid:Mail"></p>
    `;
  } else if (MailType == '7') {
    //Solicitudes Lider
    output = `
    <p>Hola ${valName}:</p>
    <ul>  
      Te notificamos que se a registrado una solicitud de <strong>${val1}</strong> por parte de <strong>${val2}</strong>. Te invitamos a revisarla lo más pronto posible en la intranet <a href="http://intranet.itw.mx" >intranet.itw.mx</a>.
    </ul><br><br> 
    <h5>Favor de no replicar este mensaje, Mensaje generado Automáticamente</h5>
    <p><img src="cid:Mail"></p>
    `;
  };

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'notificaciones@itw.mx', // generated ethereal user
      pass: 'Zuy08210'  // generated ethereal password
    },
    /*tls: {
      rejectUnauthorized: false
    }*/
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Notificaciones automáticas" <notificaciones@itw.mx>', // sender address
    to: Mailto, // list of receivers
    subject: 'Notificaciones automáticas', // Subject line // EmailSubject Variable 
    attachments: [{
      filename: 'MailSign.jpg',
      path: './scr/assets/MailSign.jpg',
      cid: 'Mail'
    }],
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    } else {
      console.log('Message sent: %s', info.messageId);
      console.log('Email has been sent');
      return 'Email has been sent';
    }
  });
}


//Esto es para la carga de archivos al servidor

function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  console.log('File base64 encoded');
  return new Buffer(bitmap).toString('base64');
}

function base64_decode(base64str, file) {
  var bitmap = new Buffer(base64str, 'base64');
  fs.writeFileSync(file, bitmap);
  console.log('File created from base64 encoded string');
  return true
}

function fileExists(path) {
  try {
    return fs.statSync(path).isFile();
  } catch (e) {
    return false;
  }
}

function pathExists(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

app.post('/UpdateFile', function (req, res) {
  /*
  if (req.body.FileName.indexOf('/') != -1) {
    var Folders = req.body.FileName.split("/");
    var filePath = '/uploads/';
    for (var a = 1; a < Folders.length-1; a++) {
      filePath = filePath + Folders[a] + '/';
    }
  }
  var x= pathExists(filePath);
  fs.mkdirSync(strFile, { recursive: true }, (err) => {
    if (err)
      console.log(err);
  });*/
  var strFile = __dirname + '/uploads/' + req.body.FileName;
  if (fileExists(strFile)) {
    console.log('File already exist');
    res.send('{"Respuesta": "File already exist"}');
  } else {
    res.set('Content-Type', 'text/plain');
    var Status = base64_decode(body.FileBase64, strFile);
    if (Status) {
      console.log('File Saved: ' + strFile);
      res.send('{"Respuesta": "File Created"}');
    } else {
      console.log('File not Saved: ' + strFile);
      res.send('{"Respuesta": "File Creating error"}');
    }
  }
})

app.post('/DownloadFile', function (req, res) {
  var strFile = __dirname + '/uploads/' + req.body.FileName;
  if (fileExists(strFile)) {
    var base64str = base64_encode(strFile);
    console.log('File encoded base64: ' + base64str);
    res.send('{"Respuesta": "' + base64str + '"}');
  } else {
    console.log('File encoded base64 Failed');
    res.send('{"Respuesta": "File not exist"}');
  }
})

app.listen(3000, () => console.log('Server started...'));
