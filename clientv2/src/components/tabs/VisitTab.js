import React, { useState, useEffect } from 'react'
import { VISITS, VISITSBYPROJECT } from '../../request/query'
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import Paper from '@material-ui/core/Paper';
import VirtualizedTable from '../VirtualizedTable'
import FullDialogWrapper from '../FullDialogWrapper'
import VisitFormDetails from '../forms/VisitFormDetails'
import GeneratFields from '../Generators'
import PaginatedTable from 'mui-table'
function VisitTab(props) {
   const { parent_node, parent_node_id } = props
   const [number, setGenerate] = useState(25)
   const [fetchGrid, { loading, data, error }] = useLazyQuery(VISITS)

   const [list, setList] = useState([]);
   const [selected, setSelected] = useState({})
   const [isOpenDialog, setDialog] = useState(false)
   const [isOpenFullDialog, setFullDialog] = useState(false)

   const [fieldValues, setFieldValues] = useState({})

   useEffect(() => {
      if(data) {
         setList(data.visits || [])
      }
   }, [data]);
   
   useEffect(() => {
      fetchGrid(getFetchParams(25, parent_node, parent_node_id))
   }, []);

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
               columns={[
                  {
                     width: 200,
                     label: 'Type',
                     dataKey: 'type',
                  },
                  {
                     width: 200,
                     label: 'Category',
                     dataKey: 'category',
                  },
                  {
                     width: 200,
                     label: 'Status',
                     dataKey: 'status',
                  },
                  {
                     width: 200,
                     label: 'Actual Visit Date',
                     dataKey: 'actual_visit_date',
                  },
               ]}
            />
         </Paper>


         <FullDialogWrapper
            name='Visit'
            isOpen={isOpenFullDialog}
            onClose={() => setFullDialog(false)}
         >
            <div>
               <VisitFormDetails fieldValues={selected}/>
            </div>
         </FullDialogWrapper>
        </div>
   )


   function handleClickRow({ event, index, rowData }) {
      setFullDialog(true)
      setSelected(rowData)
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
          project_id: parent_node_id,
          "params": {
            limit,
            "page": 1
          },
        }
       }
    }
}
   
export default VisitTab
