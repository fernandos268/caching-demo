import React, { useState, useEffect } from 'react'
import PageWrappers from '../hocs/PageWrappers'
import { PHOTOS } from '../request/query'
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import Paper from '@material-ui/core/Paper';
import VirtualizedTable from '../components/VirtualizedTable'
import GeneratFields from '../components/Generators'
import { Grid } from '@material-ui/core';

const url = (id) => `https://ljpv2-upload.dnamicro.net/file?entity=photo&id=${id}&force=true`
const entity = 'Photos'
function Photos(props) {
   const [number, setGenerate] = useState(25)
   const [fetchGrid, { loading, data, error }] = useLazyQuery(PHOTOS)
   const [list, setList] = useState([]);

   useEffect(() => {
      if(data) {
         setList(data.photos || [])
      }
   }, [data]);

   useEffect(() => {
      fetchGrid(getFetchParams())
   }, []);

   const columns = [
      {
        width: 160,
        label: 'Image',
        dataKey: 'file_path',
      },
      {
         width: 160,
         label: 'Visit Type',
         dataKey: 'visit_type',
      },
      {
         width: 900,
         label: 'Created Date',
         dataKey: 'created_date',
      },
   ]
   const length = list.length || 0
   return (
    <div>
     <Grid container>
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
     <Paper style={{ height: 700, width: '100%'}}>
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
      console.log('do something. . .', { event, index, rowData })
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
      fetchGrid(getFetchParams(number))
   }

   function getFetchParams(limit = 25, refetch) {
      limit = Number(limit)
      return { 
        variables: {
          "params": {
            limit,
            "page": 1
          },
        }
      }
  }
}
   
export default PageWrappers(Photos, entity)
