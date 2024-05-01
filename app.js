const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const databasePath = path.join(__dirname, 'EpiMax.db')

const app = express()

app.use(express.json())

let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

const convertUserDbObjectToResponseObject = dbObject => {
  return {
    id: dbObject.id,
    username: dbObject.username,
    passwordHash: dbObject.password_hash,
  }
}

const convertTaskDbObjectToResponseObject = dbObject => {
  return {
    id: dbObject.id,
    title: dbObject.title,
    description: dbObject.description,
    status: dbObject.status,
    assigneeId: dbObject.assignee_id,
    createdAt: dbObject.created_at,
    updatedAt: dbObject.updated_at,
  }
}

function authenticateToken(request, response, next) {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        next()
      }
    })
  }
}

app.post('/login', async (request, response) => {
  const {username, password} = request.params
  const selectUserQuery = `SELECT * FROM Users WHERE username="Mallesh"`
  const dbUser = await database.get(selectUserQuery)
  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid User')
  } else {
    const isPasswordMatched = await bcrypt.compare(
      'Mallesh@123',
      dbUser.password_hash,
    )
    if (isPasswordMatched === true) {
      const payload = {
        username: 'Mallesh',
      }
      const jwtToken = jwt.sign(payload, 'jmgh')
      response.send({jwtToken})
    } else {
      response.status(400)
      response.send('Invalid Password')
    }
  }
})

app.get('/tasks', async (request, response) => {
  const getTaskQuery = `
    SELECT
      *
    FROM
      Tasks ;`
  const statesArray = await database.all(getTaskQuery)
  response.send(statesArray.map(i => convertTaskDbObjectToResponseObject(i)))
})
app.get('/tasks/:id', async (request, response) => {
  const {id} = request.params
  const getTaskQuery = `
    SELECT
      *
    FROM
      Tasks WHERE id=${id}`
  const statesArray = await database.get(getTaskQuery)
  response.send(convertTaskDbObjectToResponseObject(statesArray))
})

app.post('/tasks', async (request, response) => {
  const {id, title, description, status, assigneeId, createdAt, updatedAt} =
    request.body
  const postTaskQuery = `
  INSERT INTO
    Tasks (id , title, description, status, assignee_id, created_at, updated_at)
  VALUES
    (${id},'${title}',"${description}","${status}",${assigneeId},${createdAt},"${updatedAt}");`
  const m = await database.run(postTaskQuery)
  response.send('New Task is Created Succesfully')
})

app.put('/tasks/:id', async (request, response) => {
  const {id} = request.params
  const {title, description, status, assigneeId, createdAt, updatedAt} =
    request.body
  const updateTaskQuery = `
  UPDATE
    Tasks
  SET
    title = '${title}',
    description = '${description}',
    status = '${status}',
    assignee_id = ${assigneeId},
    created_at = '${createdAt}', 
    updated_at = '${updatedAt}'
  WHERE
    id = ${id};`
  await database.run(updateTaskQuery)
  response.send('Tasks Details Updated')
})

app.delete('/tasks/:id', async (request, response) => {
  const {id} = request.params
  const deleteTaskQuery = `
  DELETE FROM
    Tasks
  WHERE
    id= ${id};`
  const l = await database.run(deleteTaskQuery)
  response.send('Task Removed')
})

module.exports = app
