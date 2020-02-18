import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks';
import PageWrappers from '../hocs/PageWrappers'
import MaterialTable from 'material-table'
import { PROJECTS } from '../request/query'
import axios from 'axios'
import DialogWrapper from '../components/DialogWrapper'
import FullDialogWrapper from '../components/FullDialogWrapper'
import ProjectFormDetails from '../components/forms/ProjectFormDetials'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'

const entity = 'Project'

function Project(props) {
   const { loading, data, error } = useQuery(PROJECTS, { 
    variables: {
      "params": {
        "limit": 25,
        "page": 1
      }
    }
   })
   const [selected, setSelected] = useState({})
   const [isOpenDialog, setDialogOpen] = useState(false)
   const [isOpen, setOpen] = useState(false)
   const [list, setList] = useState([{
     name: 'aaron',
     legal_name: 'aaron zambrano chua',
     number: '100100022',
     type: 'Male',
     status: 'Single'
   }])

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
        console.log('data: ', data);
        setList(data.projects)
      }
    }, [data])

    return (
      <div>
        <Grid container spacing={2}>
            <Grid item container xs={12} spacing={4} >
               <Button variant="contained" onClick={handleNew}>Save</Button>
            </Grid>
        </Grid>
        <MaterialTable
          data={list}
          isLoading={loading}
          editable={editable()}
          columns={state.columns}
          title="Editable Example"
          onRowClick={(evt, data) => {
            setSelected(data)
            setOpen(!isOpen)
          }}
          onChangePage={(...args) => {console.log(args)}}
          options={{ pageSize: 10, actionsColumnIndex: -1}}
        />
        
        <FullDialogWrapper
          name='Project'
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          handleSave={handleSave}
        >
          <div>
            <ProjectFormDetails
              fieldValues={selected}
            />
          </div>
        </FullDialogWrapper>
        
        <DialogWrapper
          title='New Project'
          isOpen={isOpenDialog}
          handleClose={() => { setDialogOpen(false) }}
          handleCreateProject={handleCreateProject}
        >
          <div>
            <h1>Welcome to dialog</h1>
          </div>
        </DialogWrapper>
      </div>
    );

    
    function handleNew() {
      setDialogOpen(true)
    }

    function handleCreateProject(fieldValues) {
      console.log('do something...')      
    }

    function handleSave(fieldValues) {
      console.log('do something...');
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
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  setState(prevState => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                  });
                }
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                setState(prevState => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  return { ...prevState, data };
                });
              }, 600);
            }),
        }
      )
    }
}

export default PageWrappers(Project, 'Project')