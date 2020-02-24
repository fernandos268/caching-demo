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
// const defaults = {
//    id: '',
//    name: '',
//    legal_name: '',
//    number: '',
//    type: '',
//    type_name: '',
//    status: ''
// }

export default function NewProjectDialog(props) {
   const classes = useStyles();
   const { handleInputChange: onChange, fieldValues, errors} = props
   const [ fields, setFields ] = useState(fieldValues)
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
                        <TextField
                           required
                           id="name"
                           label="Name"
                           value={fieldValues.name}
                           style ={{ width: '400px'}}
                           error={Boolean(errors.name)}
                           onChange={handleInputChange}
                           helperText={errors.name}
                        />
                     </Grid>
                     <Grid item xs={12} sm={6}>
                        <TextField
                           id="legal_name"
                           label="Legal Name"
                           value={fieldValues.legal_name}
                           onChange={handleInputChange}
                           error={Boolean(errors.legal_name)}
                           helperText={errors.legal_name}
                        />
                     </Grid>
                  </Grid>
                  <Grid container spacing={1} className={classes.grid}>
                     <Grid item xs={6} sm={3}>
                        <TextField
                           required
                           id="number"
                           label="Number"
                           value={fieldValues.number}
                           onChange={handleInputChange}
                           error={Boolean(errors.number)}
                           helperText={errors.number}
                        />
                     </Grid>
                     <Grid item xs={6} sm={3}>
                        <TextField
                           required
                           id="type"
                           label="Type"
                           value={fieldValues.type}
                           onChange={handleInputChange}
                           error={Boolean(errors.type)}
                           helperText={errors.type}
                        />
                     </Grid>
                     <Grid item xs={6} sm={3}>
                        <TextField
                           required
                           id="type_name"
                           label="Type Name"
                           value={fieldValues.type_name}
                           onChange={handleInputChange}
                           error={Boolean(errors.type_name)}
                           helperText={errors.type_name}
                        />
                     </Grid>
                  </Grid>
              </Paper>
            </Grid>
      </div>
   )
}
