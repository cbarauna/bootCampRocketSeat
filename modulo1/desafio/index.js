const express = require("express");

const server = express();
server.use(express.json());

const projects = [];



/**
 * Middleware que dá log no número de requisições
 */
server.use((req, res, next) =>{

  console.count("Número de requisições");

  return next();
});


/**
 *
 * Route param:id
 * Middleware que verifica se um projeto existe com id presente na rota
 */
function checkProject(req, res, next) {
  const { id } = req.params;
  const project = projects.find(prj => prj.id == id);
  if (!project) {
    return res.status(400).json({ error: "idProject does not exist!" });
  }
  return next();
}

/**
 * Middleware que verifica se já existe outro projeto com mesmo id cadastrado
 */

function checkProjectsId(req, res, next) {
  const { id } = req.body;
  const project = projects.find(prj => prj.id == id);

  if (project) {
    return res.status(400).json({ error: "Projects id exist!" });
  }

  return next();
}

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id;
 */
server.post("/projects/:id/tasks", checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(project => project.id == id);
  project.tasks.push(title);
  return res.json(projects);
});

/**
 * Route params: id
 * Deleta o projeto com o id presente nos parâmetros da rota.
 */
server.delete("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id == id);

  if (projectIndex !=-1){
   projects.splice(projectIndex, 1);
  }
  return res.json(projects);
});

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */
server.put("/projects/:id", checkProject, (req, res) => {
  const project = projects.find(project => project.id == req.params.id);
  project.title = req.body.title;
  return res.json(project);
});

/**
 * Retorna todos os projetos
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", checkProjectsId, (req, res) => {
  const { id, title, tasks } = req.body;
  projects.push({ id, title, tasks });
  return res.json(projects);
});

server.listen(3001);
