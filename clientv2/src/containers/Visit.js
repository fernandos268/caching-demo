import React, { useState, useEffect } from 'react'
import PageWrappers from '../hocs/PageWrappers'
import debounce from 'lodash/debounce'
import DialogWrapper from '../components/DialogWrapper'
import { VISITS } from '../request/query'
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import Paper from '@material-ui/core/Paper';
import VirtualizedTable from '../components/VirtualizedTable'
import FullDialogWrapper from '../components/FullDialogWrapper'
import VisitFormDetails from '../components/forms/VisitFormDetails'
import GeneratFields from '../components/Generators'
import Grid from '@material-ui/core/Grid';

function Visit(props) {
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
      fetchGrid(getFetchParams())
   }, []);

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
            <Grid item xs={12} sm={6} style={{ marginTop: 30 }}><h1>Number of List {list.length || 0}</h1></Grid>
         </Grid>
         <Paper style={{ height: 600, width: '100%' }}>
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
                  }
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

   function handleInputChange(evt) {
      const { id, value } = evt.target
      setFieldValues({...fieldValues, [id]: value})
   }

   function handleNew() {
      console.log('do s o m e t h i n g  .  .  .')
   }

   function handleCreateVisit(fieldValues) {
      console.log('do something...')      
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
   
export default PageWrappers(Visit, 'Visit')
