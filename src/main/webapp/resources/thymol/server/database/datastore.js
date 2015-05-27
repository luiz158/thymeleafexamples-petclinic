module.exports = function(DS) {

thymol.database = {};
thymol.database.datastore = DS;

var Owners = DS.defineResource({
  name: 'owners',
  computed: {
    firstName: ['first_name', function (first_name) {
      return first_name;
    }],
    lastName: ['last_name', function (last_name) {
      return last_name;
    }]
  },
  relations: {
    hasMany: {
      pets: {
        localField: 'pets',
        foreignKey: 'owner_id'
      }
    }
  }
});
thymol.database.owners = Owners;

var Types = DS.defineResource({
  name: 'types',
  relations: {
    hasMany: {
      pets: {
//        localField: 'type',
        foreignKey: 'type_id'
      }
    }
  },
  methods: {
    toString: function () {
      return this.name.toString();
    }
  }
});
thymol.database.types = Types;

var Visits = DS.defineResource({
  name: 'visits',
  computed: {
    dov: ['visit_date', function (visit_date) {
      return visit_date;
    }],
    date: ['dov', function (dov) {
      return new PCDate(dov);
    }]
  },
  relations: {
    belongsTo: {
      pets: {
        localKey: 'pet_id'
      }
    }
  }
});
thymol.database.visits = Visits;

var Pets = DS.defineResource({
  name: 'pets',
  computed: {
    birthDate: ['birth_date', function (birth_date) {
      return new PCDate( birth_date );
    }]
  },
  relations: {
    belongsTo: {
      owners: {
        localKey: 'owner_id'
      }
    },
    hasOne: {
      types: {
        localField: 'type',
        localKey: 'type_id'
      }
    },
    hasMany: {
      visits: {
        localField: 'visits',
        foreignKey: 'pet_id'
      }
    }
  }
});
thymol.database.pets = Pets;

var Vets = DS.defineResource({
  name: 'vets',
  computed: {
    firstName: ['first_name', function (first_name) {
      return first_name;
    }],
    lastName: ['last_name', function (last_name) {
      return last_name;
    }]
  },
  relations: {
    hasMany: {
      vet_specialties: {
        localField: 'specialties',
        foreignKey: 'vet_id'
      }
    }
  }
});
thymol.database.vets = Vets;

var Specialties = DS.defineResource({
  name: 'specialties',
  relations: {
    belongsTo: {
      vet_specialties: {
        foreignKey: 'specialty_id'
      }
    }
  }
});
thymol.database.specialties = Specialties;


var Vet_Specialties = DS.defineResource({
  name: 'vet_specialties',
  relations: {
    belongsTo: {
      vets: {
        foreignKey: 'vet_id'
      }
    },
    hasOne: {
      specialties: {
        localField: 'specialty',
        localKey: 'specialty_id'
      }
    }
  }
});
thymol.database.vet_specialties = Vet_Specialties;

Specialties.findAll({}).then( function(allSpecialties) {
  thymol.database.allSpecialties = allSpecialties;
});

Types.findAll({}).then( function(allTypes) {
  thymol.database.allTypes = allTypes;
});

Vet_Specialties.findAll({}).then( function(allVetSpecialties) {
  for (var _len = allVetSpecialties.length, indx = 0; indx < _len; indx++) {
    Vet_Specialties.loadRelations(allVetSpecialties[indx], ['specialties']);
  }
});

//Vet_Specialties.findAll({}).then( function(allVetSpecialties) {
//  thymol.database.allVetSpecialties = allVetSpecialties;
//});

Vets.findAll({}).then( function(allVets) {
  for (var _len = allVets.length, indx = 0; indx < _len; indx++) {
    var vsp = allVets[indx].specialties;
    allVets[indx].nrOfSpecialties = vsp.length;
    for (var _len2 = vsp.length, indx2 = 0; indx2 < _len2; indx2++) {
      vsp[indx2].name = vsp[indx2].specialty.name;
    }
  }
});

Visits.findAll({}).then( function(allVisits) {
});

Pets.findAll({}).then( function(allPets) {
  for (var _len = allPets.length, indx = 0; indx < _len; indx++) {
    Pets.loadRelations(allPets[indx], ['type']);
  }
});

Owners.findAll({}).then( function(allOwners) {
});

};