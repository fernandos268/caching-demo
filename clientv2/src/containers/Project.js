import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks';
import PageWrappers from '../hocs/PageWrappers'
import MaterialTable from 'material-table'
import { PROJECTS } from '../request/query'
import axios from 'axios'
import Dialog from '../components/FullDialogWrapper'
import ProjectFormDetails from '../components/forms/ProjectFormDetials'
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

   const [isOpen, setOpen] = useState(false)
   const [list, setList] = useState([{
     name: 'aaron',
     legal_name: 'aaron zambrano chua',
     number: '100100022',
     type: 'Male',
     status: 'Single'
   }])
   console.log('list: ', list);
   const [selected, setSelected] = useState({})
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
        <MaterialTable
          title="Editable Example"
          columns={state.columns}
          data={list}
          isLoading={loading}
          onChangePage={(...args) => {console.log(args)}}
          onRowClick={(evt, data) => {
            setSelected(data)
            setOpen(!isOpen)
          }}
          options={{ pageSize: 10, actionsColumnIndex: -1}}
          editable={{
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
          }}
        />
        <Dialog
          name='Project'
          isOpen={isOpen}
          onClose={() => setOpen(false)}
        >
          <div>
            <ProjectFormDetails
              fieldValues={selected}
            />
          </div>
        </Dialog>
      </div>
    );
}

export default PageWrappers(Project, 'Project')