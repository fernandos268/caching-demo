const r = require('rethinkdbdash')({servers: [{host: '10.110.55.100', port: '28015'}], db: 'ljpv2_db' });

class LJPAPI {

    async getProjects() {
        const result = await r.table('tbl_Project').run()

        return result
    }
}

module.exports = LJPAPI