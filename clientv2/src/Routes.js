import React from 'react' 
import Loadable from 'react-loadable'
import { Switch, Route } from "react-router-dom";


const LandingPage = Loadable({
   loader: ()=> import('./containers/LandingPage'),
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
   return <div>Loading...</div>;
}

const routes = [  
   {
      path: '/',
      exact: true,
      component: LandingPage,

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