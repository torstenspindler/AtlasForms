function verify(grant, targetRecord, proposedEdit) {
  grant.granted = true; //Allow the change
  grant.message = ''; //Use this to return an error to user

  try {
    console.log(proposedEdit)
    console.log(targetRecord)
    if (proposedEdit && proposedEdit.comments && proposedEdit.comments.length > 0) {
      for (var i = 0; i < proposedEdit.comments.length; i++) {
        if (targetRecord.comments &&
          targetRecord.comments[i] &&
          proposedEdit.comments[i].published == true && targetRecord.comments[i].published == false) {
          proposedEdit.comments[i].date_published = new Date()
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