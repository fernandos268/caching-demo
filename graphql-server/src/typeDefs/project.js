const { gql } = require('apollo-server-express')

module.exports = gql`
    extend type Query {
        projects(params: GetListInput!): [Project] @cacheControl(maxAge: 100)
        project(id: ID): Project @cacheControl(maxAge: 100)
    }

    extend type Mutation {
        createProject(input: ProjectInput!): Project
        updateProject(input: ProjectInput!): Project
        deleteProject(id: ID): String
    }

    type ProjectsResponse {
        count: Int!
        list: [Project!]!
    }

    type Project {
        actual_visit: String,
        actual_visit_date: String,
        all_assemblies_assigned: Boolean
        carrier_id: String
        client_id: String
        contracted_visit: String
        created_date: String
        file_path: String
        footer_id: String
        id: ID
        include_deficiency_photo: Boolean
        include_photo: Boolean
        is_assemblies_shared: Boolean
        is_capture_app: Boolean
        is_capture_qa: Boolean
        is_single_reporting: Boolean
        legal_name: String
        master_project_id: String
        name: String
        number: String
        phase: String
        region_id: String
        secondary_user_id: String
        state_id: String
        trip_tracker: Int
        type: String
        type_name: String
        status: String
        updated_date: String
        sync_date: String
        user_id: String
        metadata: ScalarObject

        # RELATIONAL FIELDS
        visits(params: GetListInput!): [Visit] @cacheControl(maxAge: 100)
    }

    input ProjectInput {
        id: ID
        master_project_id: String
        name: String
        legal_name: String
        number: String
        address: String
        user_id: String
        secondary_user_id: String
        city: String
        zip_code: String
        state: String
        status: String
        image_url: String
        type: String
        type_name: String
        building_type_id: String
        client_id: String
        carrier_id: String
        state_id: String
        region_id: String
        footer_id: String
        include_deficiency_photo: Boolean
        include_photo: Boolean
        is_single_reporting: Boolean
        is_capture_app: Boolean
        is_capture_qa: Boolean
        created_date: String
        updated_date: String
        contracted_visit: String
    }
`
