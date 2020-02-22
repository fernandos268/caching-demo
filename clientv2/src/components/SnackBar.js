
import React from 'react'
import { useSnackbar as snack } from 'notistack' 

export default function showSnackBar(variant, message) {
   const { enqueueSnackbar } = snack()
   enqueueSnackbar(message, { variant, anchorOrigin: {
         vertical: 'top',
         horizontal: 'center',
   }, })
}