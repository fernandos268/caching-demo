import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default function Generators(props) {
   const {number, handleChangeGenerate, handleGenerateGrid, style} = props
   return (
      <Grid item container xs={12} spacing={4} style={style}>
         <TextField id="name" value={number} label="Number of Items" style ={{ width: '400px'}} onChange={handleChangeGenerate}/>
         <Button variant="contained" onClick={handleGenerateGrid}>Generate</Button>
      </Grid>
   )
}
