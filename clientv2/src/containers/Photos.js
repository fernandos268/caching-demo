import React, { useState, useEffect } from 'react'
import PageWrappers from '../hocs/PageWrappers'
import debounce from 'lodash/debounce'
import DialogWrapper from '../components/DialogWrapper'
import { PHOTOS } from '../request/query'
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import Paper from '@material-ui/core/Paper';
import VirtualizedTable from '../components/VirtualizedTable'
import FullDialogWrapper from '../components/FullDialogWrapper'
import VisitFormDetails from '../components/forms/VisitFormDetails'
import GeneratFields from '../components/Generators'

function Photos(props) {
   const [number, setGenerate] = useState(25)
   const [fetchGrid, { loading, data, error }] = useLazyQuery(PHOTOS)

   const [list, setList] = useState([]);
   const [selected, setSelected] = useState({})
   const [isOpenDialog, setDialog] = useState(false)
   const [isOpenFullDialog, setFullDialog] = useState(false)

   useEffect(() => {
      if(data) {
         setList(data.photos || [])
      }
   }, [data]);
   
   useEffect(() => {
      fetchGrid(getFetchParams())
   }, []);

   return (
    <div>
     <GeneratFields 
        number={number}
        handleGenerateGrid={handleGenerateGrid}
        handleChangeGenerate={handleChangeGenerate}
        style={{ marginTop: 50 }}
     />
     <Paper style={{ height: 700, width: '100%', marginTop: 50 }}>
        <VirtualizedTable
           rowCount={list.length}
           rowGetter={({ index }) => {
              return list[index]
           }}
           onRowClick={handleClickRow}
           rowRenderer={renderRow}
           rowHeight={80}
           headerHeight={70}
           columns={[
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
           ]}
        />
     </Paper>
    </div>
)

function renderRow({ index, rowData, onRowClick, style, ...restProps }) {
  console.log({ index,rowData, onRowClick, style, ...restProps })
  return(
    <div key={rowData.id} style={{ ...style, display: 'flex', alignItems: 'center'}}>
      <div style={{ padding: 10, width: 150,  margin: 5}}><img src='/Tiger.jpg' height={60} width={70}/></div>
      <div style={{ padding: 10, width: 150, margin: 5}}>{rowData.visit_type}</div>
      <div style={{ padding: 10, width: 900, margin: 5}}>{rowData.created_date}</div>
    </div>
  )
}

   function handleClickRow({ event, index, rowData }) {
      // setFullDialog(true)
      // setSelected(rowData)
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
   
export default PageWrappers(Photos, 'Photos')
