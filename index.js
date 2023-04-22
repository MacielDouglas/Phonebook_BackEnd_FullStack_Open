const express = require('express');
const app = express();
const morgan = require('morgan');

// middleware
// app.use(morgan('tiny'));
morgan.token('body', (request) =>
  request.method === 'POST' && request.body.name
    ? JSON.stringify(request.body)
    : null
);

app.use(
  morgan(
    ':method :url :status :response-time ms - :body'
    // ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'
  )
);

app.use(express.json());

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
  const entries = persons.length;
  const date = new Date();

  response.send(
    `<p>Phonebook has info for ${entries} people</p><p>${date}</p>`
  );
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

// Esse app ira gerenciar todas as requisições HTTP GET com parametro id
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 5000);
};

app.post('/api/persons', (request, response) => {
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

  // if (body.name === )

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
