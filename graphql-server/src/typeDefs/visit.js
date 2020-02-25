const { gql } = require('apollo-server-express')

module.exports = gql`
    extend type Query {
        visits(params: GetListInput): [Visit!]! @cacheControl(maxAge: 100)
        visit(id: ID!): Visit @cacheControl(maxAge: 100)
        visitsByProject(project_id: ID, params: GetListInput): [Visit!]! @cacheControl(maxAge: 100)
    }

    extend type Mutation {
        createVisit(input: VisitInput!): Visit
        updateVisit(input: VisitInput!): Visit
        deleteVisit(id: ID!): String
    }

    type Visit {
        actual_visit_date: String
        alarm: Int
        alarms: [Int]
        all_day: Boolean
        app_version: String
        category:String
        client_id: String
        created_date: String
        current_visit_status: String
        destination_id: String
        distance: Int
        end_date: String
        event_id: String
        event_time: Int
        file_path: String
        id: ID!
        ios_version: String
        is_deficiency: Boolean
        is_old_visit: Boolean
        is_scheduling_issue: Boolean
        last_event_activity_date: String
        last_location: String
        last_office_activity_date: String
        last_picture_activity_date: String
        last_travel_activity_date: String
        last_travel_pause_duration_date: String
        last_visit_pause_duration_date: String
        message_body: String
        metadata: CustomScalarObject
        next_visit_date: String
        next_visit_id: ID
        original_start_date: String
        outstanding_open_items: [String]
        previous_tags: CustomScalarObject
        project_id: ID
        project_scope_id: String
        purpose: String
        repeat_frequency: String
        repeat_group_id: String
        scope_visit: String
        send_back_app: Boolean
        send_to: [String]
        session_id: String
        single_reporting: Boolean
        source: String
        start_date: String
        status: String
        subject: String
        sync_date: String
        system_event_time: String
        system_office_time: Int
        system_picture_time: Int
        system_travel_mileage: Int
        system_travel_time: Int
        timezone_offset: String
        travel_pause_duration: Int
        travel_time: Int
        type: String
        updated_date: String
        user_id: String
        visit_coordination: CustomScalarObject
        visit_pause_duration: Int

        # RELATIONAL FIELDS
        photos (params: GetListInput!): [Photo] @cacheControl(maxAge: 100)
        project: Project @cacheControl(maxAge: 100)
    }

    input VisitInput {
        actual_visit_date: String
        alarm: Int
        alarms: [Int]
        all_day: Boolean
        app_version: String
        category:String
        client_id: String
        created_date: String
        current_visit_status: String
        destination_id: String
        distance: Int
        end_date: String
        event_id: String
        event_time: Int
        file_path: String
        id: ID
        ios_version: String
        is_deficiency: Boolean
        is_old_visit: Boolean
        is_scheduling_issue: Boolean
        last_event_activity_date: String
        last_location: String
        last_office_activity_date: String
        last_picture_activity_date: String
        last_travel_activity_date: String
        last_travel_pause_duration_date: String
        last_visit_pause_duration_date: String
        message_body: String
        # metadata
        next_visit_date: String
        next_visit_id: ID
        original_start_date: String
        outstanding_open_items: [String]
        # previous_tags
        project_id: ID
        project_scope_id: String
        purpose: String
        repeat_frequency: String
        repeat_group_id: String
        scope_visit: String
        send_back_app: Boolean
        send_to: [String]
        session_id: String
        single_reporting: Boolean
        source: String
        start_date: String
        status: String
        subject: String
        sync_date: String
        system_event_time: String
        system_office_time: Int
        system_picture_time: Int
        system_travel_mileage: Int
        system_travel_time: Int
        timezone_offset: String
        travel_pause_duration: Int
        travel_time: Int
        type: String
        updated_date: String
        user_id: String
        # visit_coordination0
        visit_pause_duration: Int
    }
`
