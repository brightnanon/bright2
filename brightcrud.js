const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

let dataArray = [];


fs.readFile('DB.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    try {
      dataArray = JSON.parse(data);
    } catch (parseError) {
      console.error(parseError);
    }
  }
});

app.use(express.json());

app.get('/data', (req, res) => {
  res.send(dataArray);
});

app.post('/data', (req, res) => {
  const { title, description } = req.body;
  const id = uuidv4();
  const newData = {
    id,
    title,
    description
  };

  dataArray.push(newData);

  fs.writeFile('DB.json', JSON.stringify(dataArray), 'utf8', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Data added successfully');
    }
  });
});

app.put('/data/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  console.log('Updating data with ID:', id);
  console.log('New data:', title, description);

  const index = dataArray.findIndex(data => data.id === id);

  console.log('Index:', index);
  console.log('Existing data:', dataArray[index]);

  if (index !== -1) {
    dataArray[index].title = title;
    dataArray[index].description = description;

    fs.writeFile('DB.json', JSON.stringify(dataArray), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send('Data updated successfully');
      }
    });
  } else {
    console.log('Data not found');
    res.status(404).send('Data not found');
  }
});

app.delete('/data/:id', (req, res) => {
  const { id } = req.params;

  console.log('Deleting data with ID:', id);

  const index = dataArray.findIndex(data => data.id === id);

  console.log('Index:', index);
  console.log('Existing data:', dataArray[index]);

  if (index !== -1) {
    dataArray.splice(index, 1);

    fs.writeFile('DB.json', JSON.stringify(dataArray), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send('Data deleted successfully');
      }
    });
  } else {
    console.log('Data not found');
    res.status(404).send('Data not found');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
