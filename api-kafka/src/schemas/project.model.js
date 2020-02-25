import fields from '../schema-raws/project'
import schemaStitcher from '../utils/schemaStitcher';
import logger from '../core/logger/app-logger';

export default function() {
  let thinky = this.thinky; // access to thinky instance
  let type = this.thinky.type; // access to thinky type
  let models = this.models; // access to other models (for creating relationships)

  return {
    modelName: 'Project',
    tableName: "tbl_Project",
    schema: schemaStitcher(fields, type),
    options: {
      enforce_extra: "none"
    },


    // set up any relationships, indexes or function definitions here
    initialize: function(model) {
      model.hasMany(models.Visit, "visits", "id", "project_id"); // note the reference to another model `Person`

      model.ensureIndex("id");

      model.defineStatic("getLimited", function(limit, page, filter) {
        const [filterKey, filterVal] = filter || []
        // console.log('filterKey: ', { filterKey, filterVal });
        const pageLimit = limit || 10
        const endIndex = ((page || 1) * (pageLimit))
        const query = filter ? this.getAll(filterVal, { index: filterKey }) : this;
        logger.info(`Project limit: ${pageLimit} - end: ${endIndex}`)
        return query.slice(endIndex - pageLimit, endIndex)
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
