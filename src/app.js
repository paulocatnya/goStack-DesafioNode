const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(newRepo);

  return res.json(newRepo)
});

app.put("/repositories/:id", (req, res) => {
  const {id} = req.params;
  const { title, url, techs } = req.body
  const index = repositories.findIndex(item => item.id === id)

  if (index === -1) {
    return res.status(400).json({ error: 'Repository does not exists.' })
  }

  const { likes } = repositories[index]
  repositories[index] = { id, title, url, techs, likes }

  return res.json({ id, title, url, techs, likes })
});

app.delete("/repositories/:id", (req, res) => {
  const {id} = req.params;
  let index = repositories.findIndex(item =>item.id == id);

  if(!isUuid(id)){
    return res.status(400).json({error:'Is invalid UuID'})
  }
  
  repositories.splice(index,1)

  return res.status(204).send()
});

app.post("/repositories/:id/like", (req, res) => {
  const {id} = req.params;

  const index = repositories.findIndex(item => item.id === id) 

  if(index<0){
    return res.status(400).json({ error: 'Repository does not exists' })
  }

  repositories[index].likes++;

  return res.json(repositories[index])
});

module.exports = app;
