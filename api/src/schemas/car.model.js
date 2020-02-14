export default function() {
  let thinky = this.thinky; // access to thinky instance
  let type = this.thinky.type; // access to thinky type
  let models = this.models; // access to other models (for creating relationships)

  return {
    tableName: "Car",
    schema: {
      id: type.string(),
      name: type.string(),
      type: type.string(),
      year: type.string(),
      idOwner: type.string()
    },
    options: {
      enforce_extra: "none"
    },


    // set up any relationships, indexes or function definitions here
    initialize: function(model) {
      // model.belongsTo(models.Person, "owner", "idOwner", "id"); // note the reference to another model `Person`

      model.ensureIndex("type");

      model.define("isDomestic", function() {
        return this.type === 'Ford' || this.type === 'GM';
      });

      model.define("getAll", function() {
        return this.find({});
      });

      model.define("addCar", function(carToAdd) {
        return carToAdd.save();
      });

      model.define("isDomestic", function(carName) {
        return this.remove({ name: carName });
      });
    }

  };

};
