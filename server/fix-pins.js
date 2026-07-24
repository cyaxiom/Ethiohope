const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ethiohope').then(async () => {
  const Child = mongoose.model('Child', new mongoose.Schema({}, { strict: false }));
  const children = await Child.find({});
  let missing = 0;
  children.forEach(c => {
    if (!c._doc.plainPin) missing++;
  });
  console.log('Total children:', children.length);
  console.log('Children missing plainPin:', missing);
  if (missing > 0) {
    console.log('Updating missing plainPins...');
    for (const c of children) {
      if (!c._doc.plainPin) {
        await Child.updateOne({ _id: c._id }, { $set: { plainPin: '1234' } });
      }
    }
    console.log('Done updating.');
  }
  process.exit(0);
});
