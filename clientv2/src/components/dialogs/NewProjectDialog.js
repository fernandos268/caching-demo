import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

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
const defaults = {
   id: '',
   name: '',
   legal_name: '',
   number: '',
   type: '',
   type_name: '',
   status: ''
}

export default function NewProjectDialog(props) {
   const classes = useStyles();
   const { handleInputChange: onChange, fieldValues } = props
   const [ fields, setFields ] = useState(defaults)
   function handleInputChange(evt) {
      const { id, value } = evt.target
      setFields({...fields, [id]: value})
      onChange(id, value)
   }
   return (
      <div style={{ width: 900 }}> 
         <Grid container spacing={4} className={classes.grid}>
               <Paper className={classes.paper}>
                  <Grid container spacing={4} className={classes.grid}>
                     <Grid item xs={12} sm={6}>
                        <TextField id="name" value={fields.name} label="Name" style ={{ width: '400px'}} onChange={handleInputChange}/>
                     </Grid>
                     <Grid item xs={12} sm={6}>
                        <TextField id="legal_name" value={fields.legal_name} label="Legal Name" onChange={handleInputChange}/>
                     </Grid>
                  </Grid>
                  <Grid container spacing={1} className={classes.grid}>
                     <Grid item xs={6} sm={3}>
                        <TextField id="number" value={fields.number} label="Number" onChange={handleInputChange}/>
                     </Grid>
                     <Grid item xs={6} sm={3}>
                        <TextField id="type" value={fields.type} label="Type" onChange={handleInputChange}/>
                     </Grid>
                     <Grid item xs={6} sm={3}>
                        <TextField id="type_name" value={fields.type_name} label="Type Name" onChange={handleInputChange}/>
                     </Grid>
                  </Grid>
              </Paper>
            </Grid>
      </div>
   )
}
