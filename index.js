const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const Person = require('./models/person');

// app.use(morgan('tiny'));
morgan.token('body', (request) =>
  request.method === 'POST' && request.body.name
    ? JSON.stringify(request.body)
    : null
);

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.use(morgan(':method :url :status :response-time ms - :body'));

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

// Gerenciador de eventos que lida com requisiçoes HTTP GET
app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>');
});
app.get('/info', (request, response) => {
  const entries = Person.length - 1;
  const date = new Date();

  response.send(
    `<p>Phonebook has info for ${entries} people</p><p>${date}</p>`
  );
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((peaples) => {
    response.json(peaples);
  });
});

// Esse app ira gerenciar todas as requisições HTTP GET com parametro id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const generateId = () => {
  return Math.floor(Math.random() * 5000);
};

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number is missing missing',
    });
  }
  const hasName = persons.map((name) => name.name).includes(body.name);
  console.log(hasName);

  if (hasName) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  // persons = persons.concat(person);
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatePerson) => {
      response.json(updatePerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// gerenciador de requisições com um endpoint desconhecido
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// gerenciador de requisições com um resultado para erros
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
