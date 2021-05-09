require('dotenv').config();
let mongoose = require('mongoose');
mongoose.connect("mongodb+srv://codeCamp:mongoose@learning-node.hrzpe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
name : {
  type: String,
  require: true
},
age :  Number,
favoriteFoods : [String]
});

const Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  var billyJoel = new Person({name: "Billy Joel", age: 71, favoriteFoods: ["pizza", "steak", "salmon"]})

  billyJoel.save(function(err, data){
    if(err) return console.error(err);
    done(null, data);
  })
};

var arrayOfPeople = [
  {name: "Freddie Mercury", age: 74, favoriteFoods: ["wine"]},
  {name: "Jeff Lynne", age: 73, favoriteFoods: ["chicken"]}
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, people){
    if(err) return console.log(err);
    done(null, people);
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, function(err, personFound){
    if(err) return console.log(err);
    done(null, personFound);
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, function(err, data){
    if(err) return console.log(err);
    done(null, data);
  })
};

const findPersonById = (personId, done) => {
  Person.findById(personId, function(err, data){
    if(err) return console.log(err);
    done(null, data);
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, function(err, person){
    if(err) return console.log(err);

    person.favoriteFoods.push(foodToAdd);

    person.save((err, updatedPerson) => {
      if(err) return console.log(err);
      done(null, updatedPerson)
    })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, (err, updatedPerson) => {
    if(err) return console.log(err);
    done(null, updatedPerson);
  })
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if(err) return console.log(err);
    done(null, removedPerson);
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, response) => {
    if(err) return console.log(err);
    done(null, response);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: {$all: [foodToSearch]}})
  .sort({name: 'asc'})
  .limit(2)
  .select('-age')
  .exec((err, people) => {
    if(err) return console.log(err);
    done(null, people);
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;


