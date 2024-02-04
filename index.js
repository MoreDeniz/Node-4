const fs = require('fs');
const path = require('path');
const express = require('express');
const pathDB = path.join(__dirname, 'users.json');
const Joi = require('joi');

const app = express();

app.use(express.json());

let uniqueID = 1;
app.use(express.json());

/**
 * Validation
 */
const userScheme = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(30)
        .required(),
    lastName: Joi.string()
        .min(2)
        .max(30)
        .required(),
    age: Joi.number()
        .min(0)
        .max(130)
        .required(),
    city: Joi.string()
        .min(1)
        .max(30),
});


/**
 * Получить все статьи
 */
app.get('/users', (req, res) => {
    // res.send('Hello!');
    res.send(fs.readFileSync(pathDB));
});

/**
 * Получить конкретного юзера
 */
app.get('/users/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(pathDB));
    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
        res.send({ user })
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

/**
 * создать нового юзера
 */
app.post('/users', (req, res) => {
    uniqueID += 1;
    const users = JSON.parse(fs.readFileSync(pathDB));

    users.push({
        id: uniqueID,
        ...req.body
    });

    // save data!!!
    fs.writeFileSync(pathDB, JSON.stringify(users, null, 2));

    res.send({ 
        id: uniqueID,
     });
});

/**
 * обновить статью по ID
 */
// app.put('/articles/:id', (req, res) => {
app.put('/users/:id', (req, res) => {
    const result = userScheme.validate(req.body);

    if (result.error) {
        return res.status(404).send({error: result.error.details});
    } 
    
    const users = JSON.parse(fs.readFileSync(pathDB));
    let user = users.find((user) => user.id === Number(req.params.id));

    // пересобрали объект юзера: переписали + новые данные
    if (user) {
        // user = {
        //     ...user,
        //     ...req.body
        // }
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.age = req.body.age;
        user.sity = req.body.sity;

        // save data!!!
        fs.writeFileSync(pathDB, JSON.stringify(users, null, 2));

        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

/**
 * удалить юзера по ID
 */
app.delete('/users/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(pathDB));
    let user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
        const userIndex = users.indexOf(user);
        // splice = вынуть данные
        users.splice(userIndex, 1);

        fs.writeFileSync(pathDB, JSON.stringify(users, null, 2));

        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});


// app.put('/', (req, res) => {
//     console.log(req.body);
//     res.send('<h1>This is a put request!</h1>');
// });

// запустить сервер
app.listen(3000);

// npm init
// npm install express
// npm i fs
// npm i path
// node ./index.js