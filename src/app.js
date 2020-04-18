const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function existRepository(request, response, next) {
  const { id } = request.params;
  const repository = repositories.find(repo => repo.id === id);
  if (!repository || !isUuid(id)) {
    return response
      .status(400)
      .json({error: "Repository not found."});
  }
  return next();
}

app.use('/repositories/:id', existRepository);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  if (!title || !url || !techs) {
    return response
      .status(400)
      .json({error: "The fields title, url, and techs should be informed."});
  }
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: Number(0),
  }
  repositories.push(repository);
  return response.status(201).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const index = repositories.findIndex(repository => repository.id === id);
  const repository = repositories[index];
  repositories[index] = { ...repository, title, url, techs };
  return response.status(200).json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repository => repository.id === id);
  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);
  const repository =  repositories[index];
  const { likes } = repository;
  repositories[index] = { ...repository, likes: (likes + 1)}
  return response.status(200).json(repositories[index]);
});

module.exports = app;
