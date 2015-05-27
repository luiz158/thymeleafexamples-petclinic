# Thymol enhanced Spring PetClinic + Thymeleaf Sample Application

## What's this?
This is the Thymeleaf-enabled version of the Spring PetClinic official
sample application by SpringSource cloned from the Thymeleaf project, but with additional JavaScript files to support both client-side and server-side versions of the web application using Thymol.

The original application can be found at [https://github.com/SpringSource/spring-petclinic](https://github.com/SpringSource/spring-petclinic)

The Thymeleaf version can be found at [https://github.com/thymeleaf/thymeleafexamples-petclinic](https://github.com/thymeleaf/thymeleafexamples-petclinic)



## Running the client-side Thymol petclinic project locally

Firstly, you will have to download the project. If you have a local installation of git, you can simply clone this repository:

	git clone https://github.com/thymol/thymol.thymeleafexamples-petclinic.git

If you don't have git installed, you can download a `.zip` by pressing the 
*Download zip* button on the right-hand side of this page.

Once downloaded, simply use your web browser to load the following file from your local file system:

 &lt;path-to-project&gt;/src/main/webapp/WEB-INF/thymeleaf/welcome.html
   
Where "&lt;path-to-project&gt;" is the directory to which you cloned or unzipped the repository.

You should now be able to see the client-side Thymol emulation of the petclinic project.

## Running the server-side Thymol petclinic project

If you have successfully unpacked and tested the latest client-side Thymol petclinic system, then you already have all of the server-side application code on your system. All you need now is nodejs, npm and a database system, one of [sqlite3](http://www.sqlite.org) or [rethinkdb](http://www.rethinkdb.com/).

The next thing to do is install the web application support libraries. Using npm, nothing could be simpler:

    > cd <path-to-project>/src/main/webapp/resources/thymol
    > npm install

 Next, you need to initialise the application database.
 
### For sqlite3:
 
    > cd <path-to-project>/src/main/resources/db/sqlite3
    > sqlite3 -init setup.sqlite3 petclinic.db .exit
  
### For rethinkdb:

The easiest way to set up the database is using the RethinkDB Administration Console

    > cd <path-to-project>/src/main/webapp/resources/thymol
    > rethinkdb create
    > rethinkdb

browse to http://localhost:8080/ and select "Data Explorer"

    > r.db('rethinkdb').table('cluster_config').get('auth').update({auth_key: 'fish'})
    > r.dbCreate('petclinic')


Now from a command prompt:


    cd <path-to-project>/src/main/resources/db/rethinkdb

now execute the commands in load.sh:

    > rethinkdb import --force  -f owners.json --format json --table petclinic.owners --auth fish
    > rethinkdb import --force  -f pets.json --format json --table petclinic.pets --auth fish
    > rethinkdb import --force  -f specialties.json --format json --table petclinic.specialties --auth fish
    > rethinkdb import --force  -f types.json --format json --table petclinic.types --auth fish
    > rethinkdb import --force  -f vets.json --format json --table petclinic.vets --auth fish
    > rethinkdb import --force  -f vet_specialties.json --format json --table petclinic.vet_specialties --auth fish
    > rethinkdb import --force  -f visits.json --format json --table petclinic.visits --auth fish

### Installing the server

    npm install thymol-node-server -g

### Running the server

If all is well, you should be able to run the server using a command line like:

    thymol -w <path-to-project>/src/main/webapp/resources/thymol/petclinic.js <path-to-project>/src/main/webapp /WEB-INF/thymeleaf
    
You should now be able to browse to

    http://localhost:3000/welcome
  
and see the familiar petclinic home page. Follow the links and try the data entry forms, everything should work just as it does when running with Thymeleaf in a J2EE web container.
  
