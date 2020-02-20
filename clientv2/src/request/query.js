
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
      }
   }
`

const VISITS = gql`
   query($params: GetListInput) {
      visits(params: $params) {
         id
         type
         status
         category
      }
   }
`
const VISITSBYPROJECT = gql`
   query($project_id: ID!, $params: GetListInput) {
      visits(project_id: $project_id, params: $params) {
         id
         type
         status
         category
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
}
`

export {
   VISIT,
   VISITS,
   PROJECT,
   PROJECTS,
   PHOTOSBYVISIT,
   VISITSBYPROJECT,
}