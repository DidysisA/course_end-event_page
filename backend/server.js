const express = require('express');
const app = express();
app.get('/', (_,res) => res.send('It works from the backend!'));
app.listen(process.env.PORT||5000, () => console.log('Backend up'));
