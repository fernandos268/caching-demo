
import gql from 'graphql-tag';

const CREATEPROJECT = gql`
   mutation($input: ProjectInput!) {
      createProject(input: $input) {
         id
         name
         legal_name
         number
         type
         type_name
   }
}
`

const DELETEPROJECT = gql`
   mutation($id: ID!) {
      deleteProject(id: $id)
   } 
`  
const EDITPROJECT = gql`
   mutation($input: ProjectInput!) {
      updateProject(input: $input) {
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
export {
   CREATEPROJECT,
   EDITPROJECT,
   DELETEPROJECT
}