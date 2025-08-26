// Temporary in-memory dropdowns
let dropdowns = {
  source: [],
  category: [],
  service: [],
  office: []
};

const getDropdowns = (req, res) => {
  const { type } = req.params;
  if (!dropdowns[type]) return res.status(400).json({ message: 'Invalid dropdown type' });
  res.json(dropdowns[type]);
};

const addDropdown = (req, res) => {
  const { type, value } = req.body;
  if (!dropdowns[type]) return res.status(400).json({ message: 'Invalid dropdown type' });
  dropdowns[type].push(value);
  res.json({ message: 'Dropdown value added', type, values: dropdowns[type] });
};

module.exports = { getDropdowns, addDropdown };
