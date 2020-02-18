import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks';
import PageWrappers from '../hocs/PageWrappers'
import MaterialTable from 'material-table'
import { USERS} from '../request/query'
const entity = 'Project'
function Home(props) {
   return <h1> hi this is ladning</h1>  
}

export default PageWrappers(Home, 'Home')