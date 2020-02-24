import validate from 'validator'
import startCase from 'lodash/startCase'

export default function validateInput(fields, fieldsToValidate = []) {
   const errors = fieldsToValidate.reduce((acc, cur) => {
      if(validate.isEmpty(fields[cur].trim())) {
         return { ...acc, [cur]: `${startCase(cur)} is required.` }
      }
      return acc
   }, {})
   console.log({
      errors,
      isValid: Object.keys(errors).length
   })
   return {
      errors,
      isValid: Object.keys(errors).length === 0
   }
}