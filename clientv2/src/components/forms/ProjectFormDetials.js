import React from 'react'

function ProjectFormDetials(props){
   console.log('propsDetails: ', props);
   return <h1>
      Hello {props.fieldValues.legal_name}
   </h1>
}

export default ProjectFormDetials