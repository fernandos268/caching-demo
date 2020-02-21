function generateDataToString(obj) {
    return evaluateObject(obj).map(value => {
        if(Array.isArray(value)) {
            return evaluateArray(value)
        }

        if(typeof value === 'object') {
            return generateDataToString(value)
        }

        return value
    })
  }


  function evaluateObject(obj) {
    return Object.entries(obj).map(([key, value]) => typeof value === 'object' ? [key, value] : key).flat()
  }


  function evaluateArray(arr) {
    return arr.map(el => {
        return generateDataToString(el)
    }).flat()
  }

  module.exports = {
    generateDataToString
  }