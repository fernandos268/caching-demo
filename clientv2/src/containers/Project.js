import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks';
import PageWrappers from '../hocs/PageWrappers'
import MaterialTable from 'material-table'
import { USERS} from '../request/query'
import axios from 'axios'
import Dialog from '../components/FullDialogWrapper'
import ProjectFormDetails from '../components/forms/ProjectFormDetials'
const entity = 'Project'
function LandingPage(props) {
   const { loading, data, error } = useQuery(USERS)
   const [isOpen, setOpen] = useState(false)
   const [list, setList] = useState([])
   console.log('list: ', list);
   const [selected, setSelected] = useState({})
   const [state, setState] = useState({
      columns: [
        { title: 'Name', field: 'name' },
        { title: 'Legal Name', field: 'legal_name' },
        { title: 'Number', field: 'number' },
        { title: 'Type', field: 'number'},
        { title: 'Status', field: 'status'},
      ]
    });

    useEffect(() => {
      (async () => {
        const data = await axios.get('http://10.110.3.31:4001/project')
        if(data.data) {
          setList(data.data)
        }
      })()
    }, [])
    return (
      <div>
        <MaterialTable
          title="Editable Example"
          columns={state.columns}
          data={list}
          onChangePage={(...args) => {console.log(args)}}
          onRowClick={(evt, data) => {
            setSelected(data)
            setOpen(!isOpen)
          }}
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

export default PageWrappers(LandingPage, 'Home')