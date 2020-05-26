module.exports = {
  CAOrg: (opportunities) => {
    var caOnlyOrgs = opportunities.filter(opp => opp.parentOrg.location.region === 'CA');
    return caOnlyOrgs;
  },

  CustomRequiredFields: (opportunities) => opportunities.filter(opp => opp.customFields.filter(cf => cf.required).length === 0)
}
