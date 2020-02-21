import React, { useState, useEffect } from 'react'
import Visit from '../../components/tabs/VisitTab'
import TabContainer from '../TabsWrapper'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Skeleton from '../Skeleton'
import { PROJECT } from '../../request/query'
import { useQuery } from '@apollo/react-hooks';

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

const defaults = {
   id: '',
   name: '',
   legal_name: '',
   number: '',
   type: '',
   type_name: '',
   status: ''
}

function ProjectFormDetials(props){
   const classes = useStyles();
   const { fieldValues: propFieldValues, handleSave, isSaving } = props
   const { loading, data, error } = useQuery(PROJECT, { 
      variables: {
         id: propFieldValues.id
      }
   })

   const [fieldValues, setFieldValues] = useState(defaults)

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
                  <Button variant="contained" disabled={isSaving} onClick={() => handleSave(fieldValues)}>Save</Button>
            </Grid>
            <Grid item xs={12} className={classes.grid}>
               <Paper className={classes.paper}>
                  <Grid container spacing={2} className={classes.grid}>
                     <Grid item xs={12} sm={1}>
                        <Avatar alt={fieldValues.legal_name} src="/static/images/avatar/1.jpg" className={classes.large} />
                     </Grid>
                     <Grid item xs={12} sm={6}>
                        <TextField id="name" value={fieldValues.name} label="Name" style ={{ width: '400px'}} onChange={handleInputChange}/>
                     </Grid>
                  </Grid>
                  <Grid container spacing={1} className={classes.grid}>
                     <Grid item xs={6} sm={3}>
                        <TextField id="legal_name" value={fieldValues.legal_name} label="Legal Name" onChange={handleInputChange}/>
                     </Grid>
                     <Grid item xs={6} sm={3}>
                        <TextField id="number" value={fieldValues.number} label="Number" onChange={handleInputChange}/>
                     </Grid>
                     <Grid item xs={6} sm={3}>
                        <TextField id="type" value={fieldValues.type} label="Type" onChange={handleInputChange}/>
                     </Grid>
                     <Grid item xs={6} sm={3}>
                        <TextField id="type_name" value={fieldValues.type_name} label="Type Name" onChange={handleInputChange}/>
                     </Grid>
                  </Grid>
              </Paper>
            </Grid>
         </Grid>
         <div style={{ marginTop: '20px'}}>
            <TabContainer
               tabs={tabs()}
            />
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
      const passedProps = { parent_node: 'project', parent_node_id: propFieldValues.id }
      return([
         {
            component: <Visit label={'Visits'} {...passedProps}/>,
            label: 'Visit',
         }
      ])
   }
}

export default ProjectFormDetials