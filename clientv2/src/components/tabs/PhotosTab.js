import React, { useState, useEffect } from 'react'
import { VISITS, PHOTOSBYVISIT } from '../../request/query'
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import Paper from '@material-ui/core/Paper';
import VirtualizedTable from '../VirtualizedTable'
import GeneratFields from '../Generators'
function PhotosTab(props) {
   const { parent_node, parent_node_id } = props
   const [number, setGenerate] = useState(25)
   const [fetchGrid, { loading, data, error }] = useLazyQuery(PHOTOSBYVISIT)
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
   return (
        <div>
         <GeneratFields 
            number={number}
            handleGenerateGrid={handleGenerateGrid}
            handleChangeGenerate={handleChangeGenerate}
            style={{ marginTop: 50 }}
         />
         <Paper style={{ height: 400, width: '100%', marginTop: 50 }}>
            <VirtualizedTable
               rowCount={list.length}
               rowGetter={({ index }) => {
                  return list[index]
               }}
               onRowClick={handleClickRow}
               rowRenderer={renderRow}
               rowHeight={80}
               headerHeight={70}
               columns={columns}
            />
         </Paper>
        </div>
   )

   function renderRow({ index, rowData, onRowClick, style, ...restProps }) {
      return(
        <div key={rowData.id} style={{ ...style, display: 'flex', alignItems: 'center'}}>
          <div style={{ padding: 10, width: 150,  margin: 5}}><img src='/Tiger.jpg' height={60} width={70}/></div>
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
      fetchGrid(getFetchParams(number))
   }

   function getFetchParams(limit = 25, parent_node, parent_node_id) {
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
