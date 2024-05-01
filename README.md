#EpiMax India Portal




Given two files `app.js` and a database file `EpiMax.db` consisting of three tables `Users`, `Tasks`.

Write APIs to perform operations on the tables `Users`, `Tasks` only after authentication of the user.

The columns of the tables are given below,

**Users Table**

| Columns    | Type    |
| ---------- | ------- |
| id | INTEGER |
| username | TEXT    |
| password_hash| TEXT |

**Tasks Table**

| Columns       | Type    |
| ------------- | ------- |
| id   | INTEGER |
| title | TEXT    |
| description     | TEXT |
| status      | TEXT|
| assignee_id        | INTEGER |
| created_at        | TEXT|
| updated_at        | TEXT |

You can use your previous code if required.

#### Sample Valid User Credentials

```
{
  "username": "Mallesh",
  "password": "Mallesh@123"
}
```

### API 1

#### Path: `/login/`

#### Method: `POST`

**Request**

```
{
  "username": "Mallesh",
  "password": "Mallesh@123"
}
```

- **Scenario 1**

  - **Description**:

    If an unregistered user tries to login

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Body**
      ```
      Invalid user
      ```

- **Scenario 2**

  - **Description**:

    If the user provides an incorrect password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Body**
      ```
      Invalid password
      ```

- **Scenario 3**

  - **Description**:

    Successful login of the user

  - **Response**

    Return the JWT Token

    ```
    {
      "jwtToken": "ak2284ns8Di32......"
    }
    ```

### Authentication with Token

- **Scenario 1**

  - **Description**:

    If the token is not provided by the user or an invalid token

  - **Response**
    - **Status code**
      ```
      401
      ```
    - **Body**
      ```
      Invalid JWT Token
      ```

- **Scenario 2**
  After successful verification of token proceed to next middleware or handler

### API 2

#### Path: `/tasks/`

#### Method: `GET`

#### Description:

Returns a list of all tasks in the tasks table

#### Response

```

### API 3

#### Path: `/tasks/:id`

#### Method: `GET`

#### Description:

Returns a task based on the task ID

#### Response

```

### API 4

#### Path: `/tasks`

#### Method: `POST`

#### Description:

Create a id in the task table, `id` is auto-incremented

#### Request

#### Response

```
New Task is Created Succesfully
```


### API 6

#### Path: `/tasks/:id`

#### Method: `DELETE`

#### Description:

Deletes a task from the Tasks table based on the  ID

#### Response

```
Task Removed

```

### API 7

#### Path: `/tasks/:id`

#### Method: `PUT`

#### Description:

Updates the details of a specific task based on thetask  ID

#### Request

`
```

#### Response

```

Tasks Details Updated

```

# EpiMax-nodejs
