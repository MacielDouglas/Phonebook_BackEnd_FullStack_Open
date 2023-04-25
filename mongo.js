const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const arguments = process.argv;

const password = arguments[2];
const name = arguments[3];
const number = arguments[4];

const url = ``;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (arguments.length === 3) {
  // console.log({ Person });
  Person.find({}).then((result) => {
    result.map((peaple) => console.log(peaple.name, peaple.number));
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`added ${name}, number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
