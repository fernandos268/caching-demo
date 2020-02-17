const { gql } = require('apollo-server-express')

module.exports = gql`
    extend type Query {
        photos(params: GetListInput): [Photo!]! @cacheControl(maxAge: 500)
        photosByVisit(visit_id: String!): [Photo!]! @cacheControl(maxAge: 500)
    }

    extend type Mutation {
        addPhotoToVisit(input: VisitInput!): Visit
        updatePhoto(input: VisitInput!): Visit
        deletePhoto(id: String!): Visit
    }

    type Photo {
        client_id: String
        client_provided_photo_tag: String
        close_out_time: Int
        closed_by_visit_id: String
        completed_date: String
        created_date: String
        #detail
        file_path: String
        group_id: String
        id: String
        inconsistency: String
        is_client_provided: Boolean
        is_closed: Boolean
        is_deficiency_report_sent: Boolean
        is_from_camera: Boolean
        is_old_photo: Boolean
        is_pov: Boolean
        #metadata
        observation_date: String
        project_id: String
        project_scope_id: String
        scope_group_id: String
        session_id: String
        status: String
        sync_date: String
        thumbnail_path: String
        #trades
        type: String
        updated_date: String
        uploaded_date: String
        user_id: String
        visit_id: String
        visit_type: String

        # RELATIONAL FIELDS
        project: Project
        visit: Visit
    }

    input PhotoInput {
        client_id: String
        client_provided_photo_tag: String
        close_out_time: Int
        closed_by_visit_id: String
        completed_date: String
        created_date: String
        #detail
        file_path: String
        group_id: String
        id: String
        inconsistency: String
        is_client_provided: Boolean
        is_closed: Boolean
        is_deficiency_report_sent: Boolean
        is_from_camera: Boolean
        is_old_photo: Boolean
        is_pov: Boolean
        #metadata
        observation_date: String
        project_id: String
        project_scope_id: String
        scope_group_id: String
        session_id: String
        status: String
        sync_date: String
        thumbnail_path: String
        #trades
        type: String
        updated_date: String
        uploaded_date: String
        user_id: String
        visit_id: String
        visit_type: String

        # RELATIONAL FIELDS
        # project: Project
    }
`
