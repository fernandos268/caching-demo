export default [
  {
    "name": "name",
    "required": true,
    "type": "string"
  },
  {
    "name": "legal_name",
    "required": true,
    "type": "string"
  },
  {
    "name": "type",
    "required": true,
    "type": "string"
  },
  {
    "name": "type_name",
    "required": true,
    "type": "string"
  },
  {
    "name": "number",
    "required": true,
    "type": "string"
  },
  {
    "default": true,
    "name": "include_deficiency_photo",
    "type": "boolean"
  },
  {
    "default": true,
    "name": "include_photo",
    "type": "boolean"
  },
  {
    "default": false,
    "name": "is_single_reporting",
    "type": "boolean"
  },
  {
    "default": "Active",
    "name": "status",
    "type": "string"
  },
  {
    "name": "user_id",
    "type": "string"
  },
  {
    "name": "client_id",
    "type": "string"
  },
  {
    "name": "carrier_id",
    "type": "string"
  },
  {
    "name": "state_id",
    "type": "string"
  },
  {
    "name": "footer_id",
    "type": "string"
  },
  {
    "name": "region_id",
    "type": "string"
  },
  {
    "name": "actual_visit_date",
    "type": "string"
  },
  {
    "default": [],
    "name": "contacts",
    "type": "array"
  },
  {
    "default": {},
    "name": "metadata",
    "type": "object"
  },
  {
    "name": "file_path",
    "type": "string"
  },
  {
    "default": [],
    "name": "assemblies",
    "type": "array"
  },
  {
    "name": "phase",
    "type": "string"
  },
  {
    "default": false,
    "name": "all_assemblies_assigned",
    "type": "boolean"
  },
  {
    "name": "contracted_visit",
    "type": "string"
  },
  {
    "name": "trip_tracker",
    "type": "number"
  },
  {
    "name": "actual_visit",
    "type": "string"
  },
  {
    "name": "master_project_id",
    "type": "string"
  },
  {
    "name": "secondary_user_id",
    "type": "string"
  },
  {
    "default": false,
    "name": "is_assemblies_shared",
    "type": "boolean"
  },
  {
    "default": false,
    "name": "is_capture_app",
    "type": "boolean"
  },
  {
    "default": true,
    "name": "is_capture_qa",
    "type": "boolean"
  }
]