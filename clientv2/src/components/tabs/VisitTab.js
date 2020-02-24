import React, { useState, useEffect } from 'react'
import { VISITS, VISITSBYPROJECT } from '../../request/query'
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import Paper from '@material-ui/core/Paper';
import VirtualizedTable from '../VirtualizedTable'
import FullDialogWrapper from '../FullDialogWrapper'
import VisitFormDetails from '../forms/VisitFormDetails'
import GeneratFields from '../Generators'
import Grid from '@material-ui/core/Grid'

function VisitTab(props) {
   const { parent_node, parent_node_id } = props
   const [number, setGenerate] = useState(25)
   const [fetchGrid, { loading, data, error }] = useLazyQuery(VISITSBYPROJECT)

   const [list, setList] = useState([]);
   const [selected, setSelected] = useState({})
   const [isOpenFullDialog, setFullDialog] = useState(false)

   useEffect(() => {
      if(data) {
         setList(data.visitsByProject || [])
      }
   }, [data]);

   useEffect(() => {
      fetchGrid(getFetchParams(25, parent_node, parent_node_id))
   }, []);

   const columns = [
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
            <Grid item xs={12} sm={6} style={{ marginTop: 30 }}>
               <h1>Number of List {length}</h1>
            </Grid>
         </Grid>

         <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
               rowCount={list.length}
               rowGetter={({ index }) => list[index]}
               onRowClick={handleClickRow}
               columns={columns}
               isLoading={loading}
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


   function handleClickRow({ rowData }) {
      setFullDialog(true)
      setSelected(rowData)
   }

   function handleChangeGenerate(evt) {
      const { value } = evt.target
      setGenerate(value)
    }

   function handleGenerateGrid() {
      const limit = Number(number)

      if(!limit && typeof(limit) === 'number') {
         return alert('invalid input')
      }
      fetchGrid(getFetchParams(number))
   }

   function getFetchParams(limit = 25, parent_node, node_id) {
      limit = Number(limit)
      return {
        variables: {
          project_id: node_id,
          "params": {
            limit,
            "page": 1
          },
        }
       }
    }
}

export default VisitTab
