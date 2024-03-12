const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://hayonshahar:hayonshahar@cluster0.bmbksfw.mongodb.net/musicSystem')
.then(() => {
    console.log('Connected to mongoDB')
})
.catch(err => console.log('could not connect to mongoDB', err));

const secretKey = 'adminPassword';

const songSchema = new mongoose.Schema({
    songId: String,
    eventId: String,
    name: String,
    likes: Number,
    byWho: String,
});

const adminSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  mail: String,
  securityQuestion: String,
  securityQuestionAnswer: String,
  password: String,
});

const eventSchema = new mongoose.Schema({
    eventAdminId: String,
    eventType: String,
    ownerName: String,
    mail: String,
    phone: String,
    date: String,
    musicPreferences: String,
    requests: String,
});

const Song = mongoose.model('Song', songSchema, 'songs');
const Admin = mongoose.model('Admin', adminSchema, 'admin');
const Event = mongoose.model('Event', eventSchema, 'events');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized: Invalid token');
    }
    req.adminId = decoded.adminId;
    next();
  });
};

app.post('/api/hashPassword', async (req, res) => {
  const mail = req.body.mail;
  const password = req.body.password;
  const admin = await Admin.findOne({ mail: mail });

  const passwordMatch = await bcrypt.compare(password, admin.password);

  console.log(passwordMatch)

  if (passwordMatch) {
    res.send(admin);
  } else {
    res.status(401).send('Worng password');
  }
});

app.get('/api/admin', verifyToken, async (req, res) => {
  const admin = await Admin.find({}).catch(error => {
    console.error('Error fetching admin data:', error);
    res.status(500).send('Internal Server Error');
  });

  res.send(admin);
});

app.get('/api/token', verifyToken, async (req, res) => {
  res.send('ActiveToken');
});

app.post('/api/login', async (req,res) => {
  const mail = req.body.mail;
  const password = req.body.password;

  console.log(password)
  const admin = await Admin.findOne({ mail: mail });

  if (!admin) {
    return res.status(401).send('Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  console.log(passwordMatch)

  if (passwordMatch) {
    const token = jwt.sign({ adminId: admin._id, adminMail: mail }, secretKey, { expiresIn: '1h' });

    res.send({admin, token});
  } else {
    res.status(401).send('Invalid email or password');
  }
});

app.post('/api/register', async (req,res) => {
  const admin = await Admin.find();

  const name = req.body.name;
  const lastName = req.body.lastName;
  const mail = req.body.mail;  
  const password = req.body.password;
  const securityQuestion = req.body.securityQuestion;
  const securityQuestionAnswer = req.body.securityQuestionAnswer;  
  
  const existingAdmin = await Admin.findOne({ mail });
  
  if (existingAdmin) {
    return res.status(400).json({ message: 'Admin with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = new Admin({
    name: name,
    lastName: lastName,
    mail: mail,
    securityQuestion: securityQuestion,
    securityQuestionAnswer: securityQuestionAnswer,
    password: hashedPassword,
  });

  console.log(newAdmin);

  await newAdmin.save();

  res.send(admin);
});

app.post('/api/addEvent', (req, res) => {
  console.log('event');
  const adminId = req.body.adminId;
  const eventType = req.body.eventType;
  const ownerName = req.body.ownerName;
  const mail = req.body.mail;  
  const phone = req.body.phone;
  const date = req.body.date;
  const musicPreferences = req.body.musicPreferences;  
  const requests = req.body.requests;  
  console.log(eventType);

  const newEvent = new Event({
    "eventAdminId": adminId,
    "eventType": eventType,
    "ownerName": ownerName,
    "mail": mail,
    "phone": phone,
    "date": date,
    "musicPreferences": musicPreferences,
    "requests": requests,
  });

  console.log(newEvent)
  newEvent.save().then((result) => res.send(result));
})

app.get('/api/songs', async (req, res) => {
  const songs = await Song.find();
  res.send(songs);
});

app.get('/api/events', async (req, res) => {
    const events = await Event.find();
    res.send(events);
});

app.post('/api/sendSong', (req,res) => {
  const eventId = req.body.eventId;
  const videoId = req.body.videoId;
  const title = req.body.title;
  const fullName = req.body.fullName;

  const newSong = new Song({
      "songId": videoId,
      "eventId": eventId,
      "name": title,
      "likes": 0,
      "byWho": fullName,
    });
      
    newSong.save().then((result) => res.send(result));
});

app.post('/api/likes', async (req,res) => {
  const id = req.body.songId;
  const songs = await Song.find();
  const song = await Song.findById(id);
  
  song.likes += 1;
  await song.save();
  res.send(songs);
});

app.post('/api/editEvent', async (req,res) => {
  const id = req.body.id;
  const eventType = req.body.eventType;
  const ownerName = req.body.ownerName;
  const mail = req.body.mail;
  const phone = req.body.phone;
  const date = req.body.date;
  const musicPreferences = req.body.musicPreferences;
  const requests = req.body.requests;

  const event = await Event.findById(id);

  event.eventType = eventType;
  event.ownerName = ownerName;
  event.mail = mail;
  event.phone = phone;
  event.date = date;
  event.musicPreferences = musicPreferences;
  event.requests = requests;
  
  await event.save();
  res.send(event);
});

app.post('/api/editSettings', async (req,res) => {
  const kind = req.body.kind;
  const identificationMail = req.body.identificationMail
  const name = req.body.name;
  const lastName = req.body.lastName;
  const mail  = req.body.mail;
  const securityQuestion = req.body.securityQuestion;
  const securityQuestionAnswer = req.body.securityQuestionAnswer;
  const password = req.body.password;
  const currentPassword = req.body.currentPassword;

  const admin = await Admin.findOne({ mail: identificationMail });

  console.log(kind)
  if(kind === 'name'){
    console.log(name);
    admin.name = name;
  }

  if(kind === 'lastName'){
    console.log(lastName);
    admin.lastName = lastName;
  }
  
  if(kind === 'mail'){
    console.log(mail);
    admin.mail = mail;
  }

  if(kind === 'securityQuestion'){
    console.log(securityQuestion);
    admin.securityQuestion = securityQuestion;
  }
  
  if(kind === 'securityQuestionAnswer'){
    console.log(securityQuestionAnswer);
    admin.securityQuestionAnswer = securityQuestionAnswer;
  }

  if(kind === 'password'){
    const passwordMatch = await bcrypt.compare(currentPassword, admin.password);

    if (passwordMatch) {
      console.log(password);
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    } else {
      res.status(401).send('Worng Password');
      return;
    }
  }
  
  await admin.save();
  res.send(admin);
});

app.delete('/api/deleteEvent', async (req,res) => {
  const eventId = req.query.id;
  console.log(eventId);
  const deletedEvent = await Event.findOneAndDelete({ _id: eventId });
  const deletedEventSongs = await Song.deleteMany({ eventId: eventId });

  const events = await Event.find();

  res.send({ deletedEventSongs, deletedEvent, events });
});

app.delete('/api/deleteSong', async (req,res) => {
  const songtId = req.query.songId;
  const eventId = req.query.eventId;

  const deleteSong = await Song.findOneAndDelete({ _id: songtId, eventId: eventId,  });

  const events = await Event.find();

  res.send({ deleteSong, events });
});

app.listen(8080, () => {console.log('Listening to 8080')});