const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = '';

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: 'Juracy da Cunha',
  number: '99999-9998',
});

// person.save().then((result) => {
//   console.log('person added!');
//   mongoose.connection.close();
// });

Person.find({}).then((result) => {
  result.forEach((person) => {
    console.log(person);
  });
  mongoose.connection.close();
});
