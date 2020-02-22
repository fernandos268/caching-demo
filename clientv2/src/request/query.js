
import gql from 'graphql-tag';

const PROJECT = gql`
   query($id: ID!) {
      project(id: $id) {
         id
         name
         legal_name
         number
         type
         type_name
         status
      }
   }
`

const VISIT = gql`
   query($id: ID!) {
      visit(id: $id) {
         id
         type
         status
         category
         actual_visit_date
      }
   }
`

const PROJECTS = gql`
   query($params: GetListInput!) {
      projects(params: $params) {
         id
         name
         legal_name
         number
         type
         type_name
         status
         # visits(params: $params) {
         #    id
         #    type
         #    status
         #    category
         #    actual_visit_date
         #    photos(params: $params) {
         #       id
         #       visit_type
         #       file_path
         #       created_date
         #       inconsistency
         #       status
         #       thumbnail_path
         #       type
         #    }
         # }
      }
   }
`

const VISITS = gql`
   query($params: GetListInput!) {
      visits(params: $params) {
         id
         type
         status
         category
         actual_visit_date
      }
   }
`
const VISITSBYPROJECT = gql`
   query($project_id: ID!, $params: GetListInput!) {
      visitsByProject(project_id: $project_id, params: $params) {
         id
         type
         status
         category
         actual_visit_date
      }
   }
`

const PHOTOSBYVISIT = gql`
   query($visit_id: ID!, $params: GetListInput!) {
      photosByVisit(visit_id: $visit_id, params: $params){
         id
         visit_type
         file_path
         created_date
         inconsistency
         status
         thumbnail_path
         type
      }
   }
`

const PHOTOS = gql`
   query($params: GetListInput!) {
      photos(params: $params) {
         id
         visit_type
         file_path
         created_date
         inconsistency
         status
         thumbnail_path
         type
      }
   }
`



export {
   VISIT,
   VISITS,
   PHOTOS,
   PROJECT,
   PROJECTS,
   PHOTOSBYVISIT,
   VISITSBYPROJECT,
}