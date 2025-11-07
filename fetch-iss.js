import axios from 'axios';
import pool from './database.js'; //the connection pool created to establishj individual connection

const satellite_id = "25544"
const API_URL = `https://api.wheretheiss.at/v1/satellites/${satellite_id}`;


async function fetchAndStoreISS() {
  try {
    const response = await axios.get(API_URL);
    const data = response.data;
    const [result] = await pool.query(
      'INSERT INTO iss_telemetry (latitude, longitude, altitude, velocity, timestamp) VALUES (?, ?, ?, ?, ?)',
      [data.latitude, data.longitude, data.altitude, data.velocity, data.timestamp]
    );
    console.log('Data inserted:', data.timestamp);
    console.log(result.insertId)
    console.log(JSON.stringify(data))
    // Bonus: Check altitude change (compare with last entry)
    const [lastRows] = await pool.query('SELECT altitude FROM iss_telemetry ORDER BY id DESC LIMIT 1 OFFSET 1');
    if (lastRows.length > 0) {
      const change = data.altitude - lastRows[0].altitude;
      if (Math.abs(change) > 0.1) console.log('Altitude change detected:', change); // Log for bonus
    }
    return {data, change} //returns an object for use later
  } catch (err) {
    console.error('Error fetching/storing:', err);
    return err
  }
}

async function fetchISSDataforDisplay() {
  try {
    const data = pool.query()
  } catch (err) {

  }
}




export { fetchAndStoreISS };