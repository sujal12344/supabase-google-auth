import express from 'express';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.get('/hello', (req, res) => {
  res.send('message from backend');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});