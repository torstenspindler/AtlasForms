function verify(grant, targetRecord, proposedEdit) {
  
  const axios = require('axios'); // is allowed here
    
  function sendToWebhook(msg) {
    var success = true;
    axios.post(context.values.get('webhook_value'), msg)
      .then(response => {
         console.log(response.data);
      })
      .catch(error => {
        console.log(error);
        success = false;
      });
    return {success: success};
  } 

  grant.granted = true; //Allow the change
  grant.message = ''; //Use this to return an error to user

  try {
  
    console.log(`proposedEdit, stringified: ${EJSON.stringify(proposedEdit, null, 2)}`)
    console.log(`targetRecord: ${EJSON.stringify(targetRecord, null, 2)}`)
    // We ignore targetRecord, but we better fetch it and check that published was false for the comment, just in case
    if (proposedEdit) {
      for (const [key, value] of Object.entries(proposedEdit)) {
        if (key.startsWith('comments.')) {
          [comments, index, fieldname] = key.split(/\./)
          if (fieldname == 'published') {
            const date_publishedKey = [comments, index, 'date_published'].join('.')
            if (value == 'true' && proposedEdit[date_publishedKey] == undefined) {
              proposedEdit[date_publishedKey] = new Date()
              sendToWebhook({text: `This case has a new comment: ${targetRecord}`})

            }
            if (value == 'false') {
              // How to delete a set or unset key in the targetRecord
              // Quick hack to set date_published to Epoch 0
              proposedEdit[date_publishedKey] = new Date(0);
            }
          }
        }
      }
    }
  } catch (e) {
    grant.message = `${e}`;
    grant.granted = false; // Fail on error
  }
}

exports = async function () {
  // Check sendToWebhook, force deployment
  // Don't call the function - just return it so we can call it by reference.
  return verify(1,2,4);
};