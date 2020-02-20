
import gql from 'graphql-tag';

const PROJECT = gql`
   query($id: String!) {
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
   query($project_id: String!, $params: GetListInput) {
      visits(project_id: $project_id, params: $params) {
         id
         type
         status
         category
      }
   }
`

const PHOTOSBYVISIT = gql`
   query($visit_id: String!, $params: GetListInput!) {
      photosByVisit(visit_id: $visit_id params: $params) {
         id
   }
   }
`

export {
   PROJECT,
   PROJECTS,
   VISITS,
   PHOTOSBYVISIT,
   VISITSBYPROJECT,
}