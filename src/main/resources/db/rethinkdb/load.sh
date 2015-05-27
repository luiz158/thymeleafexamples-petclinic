rethinkdb import --force  -f owners.json --format json --table petclinic.owners --auth fish
rethinkdb import --force  -f pets.json --format json --table petclinic.pets --auth fish
rethinkdb import --force  -f specialties.json --format json --table petclinic.specialties --auth fish
rethinkdb import --force  -f types.json --format json --table petclinic.types --auth fish
rethinkdb import --force  -f vets.json --format json --table petclinic.vets --auth fish
rethinkdb import --force  -f vet_specialties.json --format json --table petclinic.vet_specialties --auth fish
rethinkdb import --force  -f visits.json --format json --table petclinic.visits --auth fish
