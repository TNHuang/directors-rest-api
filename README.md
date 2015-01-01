directors-rest-api
==================
A simple rest api that keeps track of movie directors's account information. It fetch the directors info from livestream account and perform CRUD operation using Node.js and mongoDB.

installion note:


1. git clone the repository.
2. npm install.
3. create a mongoDB named "myDirectors" with collections named "directors"
4. run "mongod" in the terminal to make sure mongoDB is up and running.
5. run "node server.js" to turn on the server
6. viola! the server is ready to accept http request

usage note:


1. to create a director entry in the api, simply send a post request to "http://localhost:8080/api/directors" with livestream_id as the data. Invalid livestream_id will not register an account, duplicate entry will not be insert into the database. Upon successfully post request, a JSON of the director account information will be include in the response body.

2. to view an individual entry in the database, send a get request to "http://localhost:8080/api/directors/:livestream_id", the :livestream_id part is the livestream_id a the exisitng livestream account. Upon success, a json of the director will be return in the response. The json will contain the following: {
	full_name, dob, livestream_id, favorite_camera, favorite_movies
}

3. to view all registered directors, send a get request to "http://localhost:8080/api/directors/". Upon success, return an array of director json in the response body.

4. to update a specific director, send a put request to "http://localhost:8080/api/directors/:livestream_id", include a header with authorization => "Bearer md5(full_name of the director)" and the field you want to modify. 
md5(full_name) mean the md5 crypto hash of the director's full name. So a md5 of "James Cameron" will be => 0c1f04161f135b59960cc73854c46177. Upon successful update, it will return a json message of "Updated!" 
If the token is invalid, update will not happen, and a json message of "Invalid Token" will be sent back in the response.

5. to delete a specific director, include the md5 authorization token again, then send a delete request to "http://localhost:8080/api/directors/:livestream_id". Upon successful deletion, a json message of "Success!" will be send back through the response.

tests note:

1. run "mocha server.test.js" in the terminal while inside the directory
2. tests include all four CRUD operation, full_name uniqueness validation, livestream_id validation, authorization_token validation (for update and delete) 