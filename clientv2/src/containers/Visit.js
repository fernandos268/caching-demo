import React, { useState, useEffect } from 'react'
import PageWrappers from '../hocs/PageWrappers'
import debounce from 'lodash/debounce'
import DialogWrapper from '../components/DialogWrapper'
// import ProjectFormDetails from '../components/'
import FullDialogWrapper from '../components/FullDialogWrapper'
function Visit() {
   const [data, setData] = useState({ list: [], count: 0 });
   const [selected, setSelected] = useState({})
   const [isOpenDialog, setDialog] = useState(false)
   const [isOpenFullDialog, setFullDialog] = useState(false)

   const [fieldValues, setFieldValues] = useState({})
    useEffect(() => {
      
    }, []);
   
   return (
        <div
          style={{overflowY: 'scroll', maxHeight: '400px'}}
        >
            <h1> Visits</h1>

         <FullDialogWrapper
            name='Project'
            isOpen={isOpenFullDialog}
            onClose={() => setFullDialog(false)}
         >
            <div>
               Visits
            </div>
         </FullDialogWrapper>
         
         <DialogWrapper
            title='New Project'
            isOpen={isOpenDialog}
            handleClose={() => { setDialog(false) }}
         >
            <div>
               <h1>Welcome to dialog</h1>
            </div>
         </DialogWrapper>
        </div>
   );






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

   function handleSave(fieldValues) {
      console.log('do something...');
   }
}

export default PageWrappers(Visit, 'Visit')