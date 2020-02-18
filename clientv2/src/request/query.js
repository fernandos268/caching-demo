
import gql from 'graphql-tag';

const PROJECTS = gql`
   query($params: QueryParams) {
      projects(params: $params) {
         id
         name
         legal_name
         number
         type
         status
      }
   }
`


export {
   PROJECTS
}