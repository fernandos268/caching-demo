export default [
  {
    "name": "category",
    "type": "string"
  },
  {
    "name": "purpose",
    "required": true,
    "type": "string"
  },
  {
    "name": "start_date",
    "type": "string"
  },
  {
    "name": "end_date",
    "type": "string"
  },
  {
    "name": "actual_visit_date",
    "type": "string"
  },
  {
    "name": "original_start_date",
    "type": "string"
  },
  {
    "name": "travel_time",
    "type": "number"
  },
  {
    "name": "event_time",
    "type": "number"
  },
  {
    "name": "distance",
    "type": "number"
  },
  {
    "name": "alarm",
    "type": "number"
  },
  {
    "name": "project_id",
    "type": "string"
  },
  {
    "name": "project_scope_id",
    "type": "string"
  },
  {
    "name": "scope_visit",
    "type": "string"
  },
  {
    "name": "client_id",
    "required": true,
    "type": "string"
  },
  {
    "name": "user_id",
    "required": true,
    "type": "string"
  },
  {
    "name": "session_id",
    "required": true,
    "type": "string"
  },
  {
    "name": "event_id",
    "type": "string"
  },
  {
    "name": "type",
    "required": true,
    "type": "string"
  },
  {
    "name": "next_visit_id",
    "type": "string"
  },
  {
    "default": "",
    "name": "current_visit_status",
    "type": "string"
  },
  {
    "default": "Active",
    "name": "status",
    "type": "string"
  },
  {
    "default": false,
    "name": "single_reporting",
    "type": "boolean"
  },
  {
    "default": false,
    "name": "is_deficiency",
    "type": "boolean"
  },
  {
    "default": false,
    "name": "is_scheduling_issue",
    "type": "boolean"
  },
  {
    "default": [],
    "name": "outstanding_open_items",
    "type": "array"
  },
  {
    "default": {},
    "name": "metadata",
    "type": "object"
  },
  {
    "default": {},
    "name": "consultant_notes",
    "type": "object"
  },
  {
    "default": {},
    "name": "previous_tags",
    "type": "object"
  },
  {
    "name": "file_path",
    "type": "string"
  },
  {
    "name": "destination_id",
    "type": "string"
  },
  {
    "default": false,
    "name": "all_day",
    "type": "boolean"
  },
  {
    "default": [],
    "name": "visit_coordination",
    "type": "array"
  },
  {
    "name": "system_travel_time",
    "type": "number"
  },
  {
    "name": "system_event_time",
    "type": "number"
  },
  {
    "name": "system_travel_mileage",
    "type": "number"
  },
  {
    "name": "system_office_time",
    "type": "number"
  },
  {
    "name": "system_picture_time",
    "type": "number"
  },
  {
    "name": "travel_pause_duration",
    "type": "number"
  },
  {
    "name": "visit_pause_duration",
    "type": "number"
  },
  {
    "name": "last_location",
    "type": "string"
  },
  {
    "name": "last_travel_activity_date",
    "type": "string"
  },
  {
    "name": "last_event_activity_date",
    "type": "string"
  },
  {
    "name": "last_office_activity_date",
    "type": "string"
  },
  {
    "name": "last_picture_activity_date",
    "type": "string"
  },
  {
    "name": "last_travel_pause_duration_date",
    "type": "string"
  },
  {
    "name": "last_visit_pause_duration_date",
    "type": "string"
  },
  {
    "name": "repeat_frequency",
    "type": "string"
  },
  {
    "name": "repeat_group_id",
    "type": "string"
  },
  {
    "default": [],
    "name": "alarms",
    "type": "array"
  },
  {
    "name": "is_old_visit",
    "type": "boolean"
  },
  {
    "name": "next_visit_date",
    "type": "string"
  },
  {
    "default": [],
    "name": "send_to",
    "type": "array"
  },
  {
    "name": "subject",
    "type": "string"
  },
  {
    "name": "message_body",
    "type": "string"
  },
  {
    "name": "send_back_app",
    "type": "boolean"
  },
  {
    "name": "timezone_offset",
    "type": "string"
  },
  {
    "name": "app_version",
    "type": "string"
  },
  {
    "name": "ios_version",
    "type": "string"
  }
]