const Employee = require('../models/Employee');
const fieldLabels = require('../constants/tableFields');

function mappingFields() {
	return Object.keys(Employee.schema.obj).map(key => ({
		field: key,
		label: fieldLabels[key],
		type: 'text',
		visibleTo: 'all'
	}));
}

module.exports = mappingFields;