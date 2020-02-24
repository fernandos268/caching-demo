import React, { useState, useEffect } from 'react'
import PageWrappers from '../hocs/PageWrappers'
import MaterialTable from 'material-table'

import { PROJECTS } from '../request/query'
import { CREATEPROJECT, DELETEPROJECT, EDITPROJECT } from '../request/mutation'

import moment from 'moment'
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import DialogWrapper from '../components/DialogWrapper'
import FullDialogWrapper from '../components/FullDialogWrapper'
import ProjectFormDetails from '../components/forms/ProjectFormDetials'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import NewProjectDialog from '../components/dialogs/NewProjectDialog'
import GeneratFields from '../components/Generators'
import pick from 'lodash/pick'
import { useSnackbar as snack } from 'notistack' 
import validateFields from '../components/validations'
import omit from 'lodash/omit'

const defaults = {
  // id: '',
  name: '',
  legal_name: '',
  number: '',
  type: '',
  type_name: '',
  status: ''
}
const entity = 'Project'
function Project() {
   const { enqueueSnackbar } = snack()
   const [number, setGenerate] = useState(25)
   const [fetchGrid, { loading, data, error }] = useLazyQuery(PROJECTS)
   const [createProject, { error: createError, loading: createLoading }] = useMutation(CREATEPROJECT, { onCompleted: (response) => { onCompleted('create', response) }})
   const [deleteProject, { error: deleteError, loading: deleteLoading }] = useMutation(DELETEPROJECT, { refetchQueries: [{ query: PROJECTS, ...getFetchParams(number) }], onCompleted: (response) => onCompleted('delete', response) })
   const [editProject, { error: editError, loading: editLoading }] = useMutation(EDITPROJECT, { onCompleted: () => { onCompleted('edit') }})
   
   const [list, setList] = useState([])   
   const [selected, setSelected] = useState({})
   const [isOpenDialog, setDialogOpen] = useState(false)
   const [isOpen, setOpen] = useState(false)
   const [dialogFieldValues, setDialogFieldValues] = useState(defaults)
   const [errors, setErrors] = useState({})
   const [paging, setPaging] = useState({ page: 1, rowPerPage: 25 })
   
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
          <Grid container item xs={12} spacing={4} >
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
          page={paging.page || 0}
          rowPerPage={paging.rowPerPage || 10}
          style={{ marginTop: '50px'}}
          onChangePage={(page) => {
            setPaging({ ...paging, page })
            fetchGrid(getFetchParams(number, page + 1))
          }}
          detailPanel={rowData => {
            return detailedPanel(rowData)
          }}
          onChangeRowsPerPage={(perPage) => setPaging({ ...paging, rowPerPage: perPage })}
          options={{ pageSize: 10, actionsColumnIndex: -1, pageSizeOptions: [5,10, 25 , 100, 500]}}
        />
        <FullDialogWrapper
          name='Project'
          isOpen={isOpen}
          onClose={() => {
            setOpen(false)
            setErrors({})
          }}
        >
          <ProjectFormDetails
            fieldValues={selected}
            handleSave={handleSave}
            isSaving={editLoading}
            errors={errors}
          />
        </FullDialogWrapper>
        
        <DialogWrapper
          title='New Project'
          isOpen={isOpenDialog}
          handleClose={() => { 
            setDialogOpen(false) 
            setDialogFieldValues({})
            setErrors({})
          }}
          isLoading ={createLoading}
          handleSave={handleCreateProject}
          fieldValues={dialogFieldValues}
        >
          <NewProjectDialog 
            errors={errors} 
            fieldValues={dialogFieldValues} 
            handleInputChange={handleDialogInput}
          />
        </DialogWrapper>
      </div>
    );

    function detailedPanel(rowData){
      console.log('rowData: ', rowData);
      if(!rowData.visits || !rowData.visits.length) {
        return <Grid container><h1>No Visit</h1></Grid>
      }
      return <Grid>
        <Grid container><h1>Visits & Photos</h1></Grid>
        <Grid container>
            {
              rowData.visits && rowData.visits.map((e, index) => (
                <Grid container key={e.id}>
                  <Grid container item xs={12} sm={6}>
                      <Grid item xs={12} sm={4}>
                          {`${index + 1}.) Type: ${e.type}`}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          Actual Visit Date: {formatDate(e.actual_visit_date)}
                      </Grid>
                  </Grid>
                  {
                    <Grid item xs={12} sm={6}>
                        No. of photos: {e.photos && e.photos.length || 0}
                    </Grid>
                  }
                </Grid>
              ))
            }
        </Grid>
      </Grid>
    }
    function handleNew() {
      setDialogOpen(true)
    }

    function handleCreateProject() {
      const fieldsToValidate = ['name', 'legal_name', 'number', 'type', 'type_name']
      const { errors, isValid } = validateFields(dialogFieldValues, fieldsToValidate)
      if(isValid) {
        createProject({
          variables: {
            input: dialogFieldValues
          }
        })
      } else {
        setErrors(errors)
      }
    }

    function onCompleted(action_type, response) {
      if(action_type === 'create') {
        setList([response.createProject, ...list])
        setDialogOpen(false)
        showSnackBar('success', 'Successfully Created')
      } else if(action_type === 'edit') {
        showSnackBar('success', 'Successfully Edited')
      } else if(action_type === 'delete') {
        showSnackBar('success', response.deleteProject)
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
      setErrors(omit(errors, id))
      setDialogFieldValues({ ...dialogFieldValues, [id]: value })   
    }

    function formatDate(date = '') {
      return date ? moment(date).format('LL') : ''
    }

    function handleSave(fields) {
      console.log('fields: ', fields);
      const fieldsToValidate = ['name', 'legal_name', 'number', 'type', 'type_name']
      const { errors, isValid } = validateFields(fields, fieldsToValidate) 
      if(isValid) {
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
      } else {
        setErrors(errors)
      }
    }

    function editable() {
      return( 
        {
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
    
    function getFetchParams(limit = 25, page) {
      limit = Number(limit)
      return { 
        variables: {
          "params": {
            limit,
            "page": page || 1
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

export default PageWrappers(Project, entity)