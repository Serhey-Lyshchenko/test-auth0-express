const getOrganizations = () => {
  return [
    {id:1,name:'Organization1'},
    {id:2,name:'Organization2'},
    {id:3,name:'Organization3'}
  ];
};

const createOrganization = (data) => {

  return {
    text: "Successfully created",
  };
};

const updateOrganization = (id,data) => {

  return {
    text: "Successfully updated Organization",
  };
};

const deleteOrganization = (id) => {

  return {
    text: "Successfully deleted Organization",
  };
};

module.exports = {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
