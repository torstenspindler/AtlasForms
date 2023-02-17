function verify(grant, targetRecord, proposedEdit) {
  grant.granted = true; //Allow the change
  grant.message = ''; //Use this to return an error to user

  try {
    console.log(`proposedEdit, stringified: ${EJSON.stringify(proposedEdit, null, 2)}`)
    console.log(`targetRecord: ${EJSON.stringify(targetRecord, null, 2)}`)
    // We ignore targetRecord, but we better fetch it and check that published was false for the comment, just in case
    // Also we override date_published if it was set before ...
    if (proposedEdit) {
      // This is a royal hackery, there has to be a better way!
      for (const [key, value] of Object.entries(proposedEdit)) {
        if (key.startsWith("comments.")) {
          console.log(`key: ${key}, value: ${proposedEdit[key]}`)
          if (key.endsWith(".published")) {
          const date_publishedKey = key.replace(".published", ".date_published")
            if (value == "true" && proposedEdit[date_publishedKey] == undefined) {
              proposedEdit[date_publishedKey] = new Date()
            }
            if (value == "false") {
              proposedEdit[date_publishedKey] = new Date(0)
            }
          }
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