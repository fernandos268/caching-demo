import fields from '../schema-raws/visit'
import schemaStitcher from '../utils/schemaStitcher';

export default function() {
  let thinky = this.thinky; // access to thinky instance
  let type = this.thinky.type; // access to thinky type
  let models = this.models; // access to other models (for creating relationships)

  return {
    modelName: 'Visit',
    tableName: "tbl_Visit",
    schema: schemaStitcher(fields, type),
    options: {
      enforce_extra: "none"
    },


    // set up any relationships, indexes or function definitions here
    initialize: function(model) {
      // model.belongsTo(models.Person, "owner", "idOwner", "id"); // note the reference to another model `Person`

      model.ensureIndex("id");


      model.defineStatic("getLimited", function(limit, page) {
        const pageLimit = limit || 10
        const endIndex = ((page || 1) * (pageLimit)) + 1
        return this.slice(endIndex - pageLimit, endIndex);
      });

      model.defineStatic("getById", function(id = '') {
        console.log('define id: ', id);
        return this.filter({ id });
      });

      model.defineStatic("addNode", function(node) {
        return node.save();
      });

      model.defineStatic("updateNode", async function(id, data) {
        const [node] = await this.filter({ id })
        if (!node) {
          throw new Error('Node Not Found')
        }
        return node.merge(data).save();
      });

      model.defineStatic("deleteNode", async function(id) {
        const [node] = await this.filter({ id })
        if (!node) {
          throw new Error('Node Not Found')
        }
        return node.delete();
      });
    }

  };

};
