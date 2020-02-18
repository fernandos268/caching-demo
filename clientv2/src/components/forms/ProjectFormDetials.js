import React, { useState } from 'react'
import Visit from '../tabs/visitTabs'
import Photos from '../tabs/visitTabs'
import TabContainer from '../TabsWrapper'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles(theme => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  paper: {
   padding: theme.spacing(2),
   // textAlign: 'center',
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

   function ProjectFormDetials(props){
      const classes = useStyles();
      const { fieldValues: data } = props
      const [fieldValues, setFieldValues] = useState(data)

   function handleInputChange(evt) {
      const { id, value }  = evt.target     
      setFieldValues({
         ...fieldValues,
         [id]: value
      })
   }

   function handleSave() {
      console.log('Do something')
   }

   return (
      <div>
         <Grid container spacing={2}>
            <Grid item xs={12} spacing={4} className={classes.grid}>
               <Button variant="contained" onClick={handleSave}>Save</Button>
            </Grid>
            <Grid item xs={12} spacing={4} className={classes.grid}>
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
                        <TextField id="legal_name" value={fieldValues.legal_name} label="Legal Name" onChange={handleInputChange}/>
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
}

const tabs = () => ([
   {
      component: <Visit label={'Visits'}/>,
      label: 'Visit',
   },
   {
      component: <Photos label={'Photos'}/>,
      label: 'Photos',
   }
])

export default ProjectFormDetials