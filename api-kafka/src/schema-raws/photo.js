export default [
  {
    "name": "project_id",
    "required": true,
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
    "name": "visit_id",
    "required": true,
    "type": "string"
  },
  {
    "name": "group_id",
    "required": true,
    "type": "string"
  },
  {
    "name": "type",
    "required": true,
    "type": "string"
  },
  {
    "default": [],
    "name": "trades",
    "type": "array"
  },
  {
    "default": {},
    "name": "metadata",
    "type": "object"
  },
  {
    "default": {},
    "name": "detail",
    "type": "object"
  },
  {
    "name": "file_path",
    "type": "string"
  },
  {
    "name": "thumbnail_path",
    "type": "string"
  },
  {
    "default": false,
    "name": "is_closed",
    "type": "boolean"
  },
  {
    "default": "Active",
    "name": "status",
    "type": "string"
  },
  {
    "default": "",
    "name": "inconsistency",
    "type": "string"
  },
  {
    "default": "",
    "name": "closed_by_visit_id",
    "type": "string"
  },
  {
    "default": false,
    "name": "is_client_provided",
    "type": "boolean"
  },
  {
    "name": "project_scope_id",
    "type": "string"
  },
  {
    "name": "scope_group_id",
    "type": "string"
  },
  {
    "name": "observation_date",
    "type": "string"
  },
  {
    "name": "close_out_time",
    "type": "number"
  },
  {
    "name": "completed_date",
    "type": "string"
  },
  {
    "name": "is_old_photo",
    "type": "boolean"
  },
  {
    "name": "visit_type",
    "type": "string"
  },
  {
    "default": false,
    "name": "is_pov",
    "type": "boolean"
  },
  {
    "name": "client_provided_photo_tag",
    "type": "string"
  },
  {
    "name": "is_deficiency_report_sent",
    "type": "boolean"
  },
  {
    "default": false,
    "name": "is_from_camera",
    "type": "boolean"
  },
  {
    "name": "is_need_to_close",
    "type": "boolean"
  },
  {
    "default": false,
    "name": "is_manual_closed",
    "type": "boolean"
  }
]
