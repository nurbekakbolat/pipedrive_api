const pipedrive = require("pipedrive");
const defaultClient = new pipedrive.ApiClient();

// Configure authorization by settings api key
// PIPEDRIVE_API_KEY is an environment variable that holds real api key
defaultClient.authentications.api_key.apiKey =
  "c88ad4f1edcbd2021a0e31ea54f5f8bf8bfd65c3";

async function updatingCustomFieldValue(formData, id) {
  try {
    const DEAL_ID = id; // An ID of Deal which will be updated

    const fieldsApi = new pipedrive.DealFieldsApi(defaultClient);
    const dealsApi = new pipedrive.DealsApi(defaultClient);
    let personsApi = new pipedrive.PersonsApi(defaultClient);
    let opts = {
      start: 0, // Number | Pagination start
      limit: 2, // Number | Items shown per page
    };
    // Get all Deal fields (keep in mind pagination)
    const dealFields = await fieldsApi.getDealFields();
    dealsApi
      .getDealPersons(DEAL_ID, opts)
      .then((obj) => {
        let personOpts = pipedrive.UpdatePerson.constructFromObject({
          firstName: formData.name,
          lastName: formData.surname,
          email: [{ value: formData.email, primary: true, label: "main" }],
          phone: [
            { value: formData.phoneNumber, primary: true, label: "mobile" },
          ],
        });
        personsApi
          .updatePerson(obj.data[0].id, personOpts)
          .then((data) => {
            console.log("API called successfully. Returned data: " + data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    const jobField = dealFields.data.find((field) => field.name === "Job_Type");
    const jobNameField = dealFields.data.find(
      (field) => field.name === "Job_name"
    );
    const st_number = dealFields.data.find((field) => field.name === "Number");
    const st_name = dealFields.data.find((field) => field.name === "Street");
    const post_code = dealFields.data.find(
      (field) => field.name === "Postal_code"
    );
    const state = dealFields.data.find((field) => field.name === "State");
    const date = dealFields.data.find((field) => field.name === "Date");
    const time_from = dealFields.data.find(
      (field) => field.name === "Time_from"
    );
    const time_to = dealFields.data.find((field) => field.name === "Time_to");
    const tech_guy = dealFields.data.find(
      (field) => field.name === "Technician"
    );
    const updatedDeal = await dealsApi.updateDeal(DEAL_ID, {
      [jobField.key]: formData.jobType,
      [jobNameField.key]: formData.jobName,
      [st_number.key]: formData.number,
      [st_name.key]: formData.street,
      [post_code.key]: formData.postalCode,
      [state.key]: formData.state,
      [date.key]: formData.date,
      [time_from.key]: formData.startTime,
      [time_to.key]: formData.endTime,
      [tech_guy.key]: formData.additionalNote,
    });
  } catch (err) {
    const errorToLog = err.context?.body || err;

    console.log("Updating failed", errorToLog);
  }
}

module.exports = { updatingCustomFieldValue };
