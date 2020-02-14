import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const { PORT } = process.env;

const app = express();
app.use(cors());

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
})