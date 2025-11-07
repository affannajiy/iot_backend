import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';

import { fetchAndStoreISS } from './fetch-iss.js';


const app = express();
const port = 3000;


app.use(express.static('public')); // Serve static files

app.get('/', (req, res) => {
  res.send("Express server Running!")
})

let running = false;
setInterval(async () => {
  if (running) return;
  running = true;
  try { 
    const {result, change} = await fetchAndStoreISS(); 
    console.log(`Data: ${result}`)
    console.log(`Change: ${change}`)
  } catch (err) {
    console.log(`Error: ${err}`)
  } finally { 
    running = false; 
  }
}, 1000); // Schedule every 10 seconds (respects ~1/sec rate limit; adjust for production) //andrew changed the scheduling to run every 1 second, and log for debugging purposes


app.get('/data', async (req, res) => {
  try {
    const {data, change} = await fetchAndStoreISS();
    res.json({data, change}); // Send newest location data & change to frontend
  } catch (err) {
    console.log(err)
  }
});

app.listen(port, () => console.log(`Server on http://localhost:${port}`));