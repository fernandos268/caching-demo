import React, { useState, useEffect } from 'react'
import PageWrappers from '../hocs/PageWrappers'
import MaterialTable from 'material-table'

import { PROJECTS } from '../request/query'
import { CREATEPROJECT, DELETEPROJECT, EDITPROJECT } from '../request/mutation'

import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import DialogWrapper from '../components/DialogWrapper'
import FullDialogWrapper from '../components/FullDialogWrapper'
import ProjectFormDetails from '../components/forms/ProjectFormDetials'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import NewProjectDialog from '../components/dialogs/NewProjectDialog'
import GeneratFields from '../components/Generators'
import pick from 'lodash/pick'
import { useSnackbar as snack } from 'notistack' 

const entity = 'Project'
function Project(props) {
   const { enqueueSnackbar } = snack()
   const [number, setGenerate] = useState(25)
   const [fetchGrid, { loading, data, error }] = useLazyQuery(PROJECTS)
   const [createProject, { data: createData, error: createError, loading: createLoading }] = useMutation(CREATEPROJECT, { onCompleted: () => { sideEffects('create') }})
   const [deleteProject, { data: deleteData, error: deleteError, loading: deleteLoading }] = useMutation(DELETEPROJECT, { refetchQueries: [{ query: PROJECTS, ...getFetchParams(number) }], onCompleted: () => sideEffects('delete') })
   const [editProject, { data: editData, error: editError, loading: editLoading }] = useMutation(EDITPROJECT, { onCompleted: () => { sideEffects('edit') }})
   
   const [list, setList] = useState([])   
   const [selected, setSelected] = useState({})
   const [isOpenDialog, setDialogOpen] = useState(false)
   const [isOpen, setOpen] = useState(false)
   const [dialogFieldValues, setDialogFieldValues] = useState({})

   const [state, setState] = useState({
      columns: [
        { title: 'Name', field: 'name' },
        { title: 'Legal Name', field: 'legal_name' },
        { title: 'Number', field: 'number' },
        { title: 'Type', field: 'type'},
        { title: 'Status', field: 'status'},
      ]
    });
    
    useEffect(() => {
      if(data) {
        setList(data.projects)
      } 
    }, [data])

    useEffect(() => {
      if(error) {
        showSnackBar('error', 'Error')
      } else if(createError) {
        showSnackBar('error', 'Error Created')
      } else if(editError) {
        showSnackBar('error', 'Error Edit')
      } else if(deleteError) {
        showSnackBar('error', 'Error Delete')
      }
    }, [error, createError, editError, deleteError])

    useEffect(() => {
      fetchGrid(getFetchParams(number))
    }, [])

    return (
      <div>
        <Grid container spacing={4} style={{ marginTop: '50px'}}>
          <Grid item container xs={12} spacing={4} >
              <Button variant="contained" onClick={handleNew}>New</Button>
          </Grid>
          <GeneratFields 
            number={number}
            handleGenerateGrid={handleGenerateGrid}
            handleChangeGenerate={handleChangeGenerate}
            style={{ marginTop: 10 }}
          />
        </Grid>
        <MaterialTable
          data={list}
          isLoading={loading || deleteLoading}
          editable={editable()}
          columns={state.columns}
          title="Projects"
          onRowClick={(evt, data) => {
            setSelected(data)
            setOpen(!isOpen)
          }}
          style={{ marginTop: '50px'}}
          onChangePage={(...args) => {console.log(args)}}
          options={{ pageSize: 10, actionsColumnIndex: -1}}
        />
        
        <FullDialogWrapper
          name='Project'
          isOpen={isOpen}
          onClose={() => setOpen(false)}
        >
          <ProjectFormDetails
            fieldValues={selected}
            handleSave={handleSave}
            isSaving={editLoading}
          />
        </FullDialogWrapper>
        
        <DialogWrapper
          title='New Project'
          isOpen={isOpenDialog}
          handleClose={() => { 
            setDialogOpen(false) 
            setDialogFieldValues({})
          }}
          isLoading ={createLoading}
          handleSave={handleCreateProject}
        >
          <NewProjectDialog fieldValues={dialogFieldValues} handleInputChange={handleDialogInput}/>
        </DialogWrapper>
      </div>
    );

    
    function handleNew() {
      setDialogOpen(true)
    }

    function handleCreateProject() {
      createProject({
        variables: {
          input: dialogFieldValues
        }
      })
    }

    function sideEffects(action_type) {
      console.log('action_type: ', action_type);
      if(action_type === 'create') {
        setList([createData.createProject, ...list])
        setDialogOpen(false)
        showSnackBar('success', 'Successfully Created')
      } else if(action_type === 'edit') {
        showSnackBar('success', 'Successfully Edited')
      } else if(action_type === 'delete') {
        showSnackBar('success', 'Successfully Deleted')
      }
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

    function handleDialogInput(id, value) {
      setDialogFieldValues({ ...dialogFieldValues, [id]: value })     
    }

    function handleSave(fields) {
      console.log('fields: ', fields);
      editProject({
        variables: {
          input: pick(fields, [
            'id',
            'name',
            'legal_name',
            'number',
            'type',
            'type_name',
            'status'
          ])
        }
      })
    }

    function editable() {
      return( 
        {
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                setState(prevState => {
                  const data = [...prevState.data];
                  data.push(newData);
                  return { ...prevState, data };
                });
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              resolve()
              deleteProject({
                variables: {
                  id: oldData.id
                }
              })
            }),
        }
      )
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

    function showSnackBar(variant, message) {
      enqueueSnackbar(message, { variant, anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
      }, })
   }

}

export default PageWrappers(Project, 'Project')