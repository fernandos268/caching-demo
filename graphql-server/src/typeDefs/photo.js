const { gql } = require('apollo-server-express')

module.exports = gql`
    extend type Query {
        photos: [Photo]
    }

    type Photo {
        client_id
        client_provided_photo_tag
        close_out_time
        closed_by_visit_id
        completed_date
        created_date
        #detail
        file_path
        group_id
        id
        inconsistency
        is_client_provided
        is_closed
        is_deficiency_report_sent
        is_from_camera
        is_old_photo
        is_pov
        #metadata
        observation_date
        project_id
        project_scope_id
        scope_group_id
        session_id
        status Active
        sync_date
        thumbnail_path
        #trades
        type
        updated_date
        uploaded_date
        user_id
        visit_id
        visit_type
    }

`