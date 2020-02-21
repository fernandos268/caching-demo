import React, { useState, useEffect } from 'react'
import { PHOTOSBYVISIT } from '../../request/query'
import { useLazyQuery } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';
import VirtualizedTable from '../VirtualizedTable'
import GeneratFields from '../Generators'
const url = (id) => `https://ljpv2-upload.dnamicro.net/file?entity=photo&id=${id}&force=true`
function PhotosTab(props) {
   const { parent_node, parent_node_id } = props
   const [number, setGenerate] = useState(25)
   const [fetchGrid, { data }] = useLazyQuery(PHOTOSBYVISIT)
   const [list, setList] = useState([]);

   useEffect(() => {
      if(data) {
         setList(data.photosByVisit || [])
      }
   }, [data]);
   
   useEffect(() => {
      fetchGrid(getFetchParams(25, parent_node, parent_node_id))
   }, []);

   const columns = [
      {
        width: 150,
        label: 'Image',
        dataKey: 'file_path',
      },
      {
        width: 150,
        label: 'Visit Type',
        dataKey: 'visit_type',
      },
      {
        width: 900,
        label: 'File Path',
        dataKey: 'created_date',
      },
   ]
   
   const length = list.length || 0

   return (
      <div>
         <Grid container style={{ marginLeft: 20}}>
            <Grid item xs={12} sm={6}> 
               <GeneratFields 
                  number={number}
                  style={{ marginTop: 30 }}
                  handleGenerateGrid={handleGenerateGrid}
                  handleChangeGenerate={handleChangeGenerate}
               />
            </Grid>
            <Grid item xs={12} sm={6} style={{ marginTop: 30 }}><h1>Number of List {length}</h1></Grid>
         </Grid>
         <Paper style={{ height: 650, width: '100%'}}>
            <VirtualizedTable
               rowHeight={80}
               headerHeight={70}
               columns={columns}
               rowCount={list.length}
               rowRenderer={renderRow}
               onRowClick={handleClickRow}
               rowGetter={({ index }) => list[index]}
            />
         </Paper>
      </div>
   )

   function renderRow({ index, rowData, onRowClick, style, ...restProps }) {
      return(
        <div key={rowData.id} style={{ ...style, display: 'flex', alignItems: 'center'}}>
          <div style={{ padding: 10, width: 150,  margin: 5}}><img src={url(rowData.id)} height={60} width={70}/></div>
          <div style={{ padding: 10, width: 150, margin: 5}}>{rowData.visit_type}</div>
          <div style={{ padding: 10, width: 900, margin: 5}}>{rowData.created_date}</div>
        </div>
      )
   }

   function handleClickRow({ event, index, rowData }) {
      console.log('do some thing')
   }

   function handleChangeGenerate(evt) {
      const { id, value } = evt.target
      setGenerate(value)
    }

   function handleGenerateGrid() {
      const limit = Number(number)

      if(!limit && typeof(limit) === 'number') {
         return alert('invalid input')
      }
      fetchGrid(getFetchParams(number, 'visit', parent_node_id))
   }

   function getFetchParams(limit = 25) {
      console.log('parent_node_id: ', parent_node_id);
      limit = Number(limit)
      return { 
        variables: {
          visit_id: parent_node_id,
          "params": {
            limit,
            "page": 1
          },
        }
       }
    }
}
   
export default PhotosTab
