import React from 'react' 
import Loadable from 'react-loadable'
import { Switch, Route } from "react-router-dom";
import Loading from './components/Skeleton'

const Home = Loadable({
   loader: ()=> import('./containers/Home'),
   loading: MyLoadingComponent
})

const Project = Loadable({
   loader: ()=> import('./containers/Project'),
   loading: MyLoadingComponent
})

const Visit = Loadable({   
   loader: ()=> import('./containers/Visit'),
   loading: MyLoadingComponent
})


const NotFound = () => {
   return (
      <div style={{ 
         display: 'flex',
         height: '100%',
         alignItems: 'center',
         justifyContent: 'center'
      }}>
         <div><h1>NOT FOUND</h1></div>
      </div>
   )
}

function MyLoadingComponent() {
   return <Loading/>;
}

const routes = [  
   {
      path: '/',
      exact: true,
      component: Home,

   }, {
      path: '/project/:id?',
      component: Project,
      exact: true
   }, {
      path: '/visit/:id?',
      component: Visit,
      exact: true
   }, {
      component: NotFound
   }
]

function Routes() {
   return (
      <Switch>
         {
            routes.map((e, index) => {
               return (
                  <Route
                     key={index}
                     path={e.path}
                     exact={e.exact}
                     children={<e.component />}
                  />
               )
            })
         }
      </Switch>
   )
}

export default Routes