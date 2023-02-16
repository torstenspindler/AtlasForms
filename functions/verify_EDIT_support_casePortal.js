function verify(grant, targetRecord, proposedEdit) {
  grant.granted = true; //Allow the change
  grant.message = ''; //Use this to return an error to user
  if (proposedEdit && proposedEdit.published == true && targetRecord.published == false) {
    proposedEdit.date_published = new Date()
  }
}

exports = function () {
  // Don't call the function - just return it so we can call it by reference.
  return verify
}