import React, { useState, useEffect } from 'react'
import PhotosTab from '../tabs/PhotosTab'
import TabContainer from '../TabsWrapper'
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import { VISIT } from '../../request/query'
import { useQuery } from '@apollo/react-hooks';
import Skeleton from '../Skeleton'

const useStyles = makeStyles(theme => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  paper: {
   padding: theme.spacing(2),
   color: theme.palette.text.secondary,
   width: '98%',
   marginTop: 10,
   margin: 'auto'
  },
  grid: {
   margin: 3,
   pading: 10
  }
}));

function VisitFormDetails(props){
   const classes = useStyles();
   const { fieldValues: propFieldValues } = props
   const { loading, data, error } = useQuery(VISIT, { 
      variables: {
         id: propFieldValues.id
      }
   })
   const [fieldValues, setFieldValues] = useState(propFieldValues)

   useEffect(() => {
      if(data) {
         setFieldValues((fieldValues) => ({ ...fieldValues, ...data.project }))
      }
   }, [data])

   if(loading) {
      return <Skeleton />
   }
   return (
      <div>
         <Grid container spacing={2}>
            <Grid item xs={12} className={classes.grid}>
               <Paper className={classes.paper}>
                  <Grid container spacing={2} className={classes.grid}>
                     <Grid item xs={12} sm={1}>
                        <Avatar alt={fieldValues.type} src="/static/images/avatar/1.jpg" className={classes.large} />
                     </Grid>
                     <Grid item xs={12} sm={6}>
                        <TextField id="type" value={fieldValues.type} label="Type" disabled style ={{ width: '400px'}} onChange={handleInputChange}/>
                     </Grid>
                  </Grid>
                  <Grid container spacing={1} className={classes.grid}>
                     <Grid item xs={6} sm={3}>
                        <TextField id="category" value={fieldValues.category} disabled label="Category" onChange={handleInputChange}/>
                     </Grid>
                  </Grid>
              </Paper>
            </Grid>
         </Grid>
         <div style={{ marginTop: '20px'}}>
            <TabContainer tabs={tabs()} />
         </div>
      </div>
   )

   function handleInputChange(evt) {
      const { id, value }  = evt.target     
      setFieldValues({
         ...fieldValues,
         [id]: value
      })
   }

   function tabs(){
      const passedProps = { parent_node: 'visit', parent_node_id: propFieldValues.id }
      return([
         {
            component: <PhotosTab label={'Photos'} {...passedProps}/>,
            label: 'Photos',
         }
      ])
   }
}

export default VisitFormDetails