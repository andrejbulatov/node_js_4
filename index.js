const express = require('express');
// const joi = require('joi');

const app = express();

let uniqueId = 1;

const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'users.json');
const users = JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));

// const userScheme = joi.object({
//   firstname: joi.string().min(1).required(),
//   secondname: joi.string().min(1).required(),
//   city: joi.string(1).min(2),
//   age: joi.number().min(0).max(130).required()
// });
app.use(express.json());

app.get('/users', (req, res) => {
  res.send({ users });
})

app.get('/users/:id', (req, res) => {
  const userId = +req.params.id;
  const user = users.find((user) => user.id === userId);
  if (user) {
    res.send({ user });
  } else {
    res.status(404);
    res.send({ user: null });
  }
})

app.post('/users', (req, res) => {

  uniqueId = users[users.length -1].id + 1;
  users.push({
    id: uniqueId,
    ...req.body
  });
  fs.writeFileSync(pathToFile, JSON.stringify(users, null, 2));
  res.send({ id: uniqueId });
})

app.put('/users/:id', (req, res) => {
//   const result = userScheme.validate(req.body);
//   if (result.error) {
//     return res.status(404).send({ error: result.error.details });
// }

  const userId = +req.params.id;
  const user = users.find((user) => user.id === userId);
  if (user) {
    const { firstname, secondname, city, age } = req.body;
    user.firstname = firstname;
    user.secondname = secondname;
    user.city = city;
    user.age = age;
    fs.writeFileSync(pathToFile, JSON.stringify(users, null, 2));
    res.send({ user });
  } else {
    res.status(404);
    res.send({ user: null });
  }
})

app.delete('/users/:id', (req, res) => {
  const userId = +req.params.id;
  const user = users.find((user) => user.id === userId);
  if (user) {
    const userIndex = users.indexOf(user);
    users.splice(userIndex, 1);
    fs.writeFileSync(pathToFile, JSON.stringify(users, null, 2));
    res.send({ user });
  } else {
    res.status(404);
    res.send({ user: null });
  }
})

app.listen(3000);