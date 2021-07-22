<h1 align="center">Boilerplate - ArsTalk Chatting Real-Time RESTfull API</h1>

## About Project

ArsTalk Chatting Real-Time is a website application to send messages in real-time. Make it easy for users to send messages anytime and anywhere.

## Features

1. Authentication
2. Search, Read, and Update User with Upload File
3. CRUD Contact
4. Read and Create Room Chat
5. Read adn Create Message
6. Verification Email
7. Redis
8. Real-time Message

## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.13-green.svg?style=rounded-square)](https://nodejs.org/)
[![Bcrypt](https://img.shields.io/badge/Bcrypt-v.5.0.1-red.svg?style=rounded-square)](https://www.npmjs.com/package/bcrypt)
[![Mysql2](https://img.shields.io/badge/Mysql2-v.2.2.5-blue.svg?style=rounded-square)](https://www.mysql.com/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-v.6.6.0-black.svg?style=rounded-square)](https://nodemailer.com/)
[![Socket-Io](https://img.shields.io/badge/SocketIo-v4.1.2-yellow.svg?style=rounded-square)](https://socket.io/)
[![Redis](https://img.shields.io/badge/Redis-v4.1.2-purple.svg?style=rounded-square)](https://redis.io/documentation)

## Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)
5. Socket.Io

## How to run the app ?

1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name cinemars_ticket_booking, and Import file sql to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3000/)
8. You can see all the end point [here](https://documenter.getpostman.com/view/14947284/TzsYN8x9)

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
DB_HOST='localhost'                 //Database Host
DB_USER='root'                      //Database Username
DB_PASS=""                          //Database Password
DB_NAME=''                          //Database Name
```

## License

© [Aulia Safitri](https://github.com/arsasf/)
