function verify(grant, targetRecord, proposedEdit) {
  grant.granted = true; //Allow the change
  grant.message = ''; //Use this to return an error to user

  try {
    console.log(`proposedEdit, stringified: ${EJSON.stringify(proposedEdit, null, 2)}`)
    console.log(`proposedEdit: ${proposedEdit}`)
    console.log(`targetRecord: ${EJSON.stringify(targetRecord, null, 2)}`)
    // We ignore targetRecord, but we better fetch it and check that published was false for the comment, just in case
    // Also we override date_published if it was set before ...
    if (proposedEdit) {
      console.log(1)
      for (const key in Object.keys(proposedEdit)) {
        console.log(`key: ${key}`)
        if (proposedEdit[key].published == true && proposedEdit[key].date_published === undefined) {
          console.log("Setting publish date")
          proposedEdit[key].date_published = new Date()
        }
        if (proposedEdit[key].published == false && proposedEdit[key].date_published !== undefined) {
          console.log("Removing publish date")
          delete proposedEdit[key].date_published
        }
      }
    }
  } catch (e) {
    grant.message = `${e}`
    grant.granted = false // Fail on error
  }
}

exports = function () {
  // Don't call the function - just return it so we can call it by reference.
  return verify
}