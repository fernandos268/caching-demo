const { gql } = require('apollo-server-express')

module.exports = gql`
    extend type Query {
        projects: [Project]
    }

    type Project {
        actual_visit: String,
        actual_visit_date: String,
        all_assemblies_assigned: Boolean
        contracted_visit: String
        file_path: String
        footer_id: String
        id: String
        include_deficiency_photo: Boolean
        include_photo: Boolean
        status: String
        sync_date: String
        user_id: String
    }

`