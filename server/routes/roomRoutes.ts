import express from 'express';
import { fetchData } from '../helpers/api';
const router = express.Router();


//@Get all rooms
router.get('/rooms', async (req, res) => {
    try {
      const rooms = await fetchData( "rooms", "get");
      res.json(rooms);
    } catch (error: any) {
      console.log("error: ", error);
      res.status(500).json({ error: error.message });
    }
});

//@Create a room with a name
router.post('/createRoom', async (req, res) => {
  try {
    // object deconstruction happens here to manually set each room to expire in 1 hour.
    // 1 hour = 3600 seconds, we take the current Date seconds and add 3600 seconds which means the room expires in 1 hour time
    const body = {
      ...req.body, 
      properties: {
        exp: Math.floor(Date.now() / 1000 + 3600)
      }
    }
    const roomCreated = await fetchData("rooms", "post", body);
    res.json(roomCreated);
  } catch (error: any) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
})

//@Get a room via the name
router.get('/getRoom/:name', async (req, res) => {
  try {
    const room = await fetchData(`rooms/${req.params.name}`, "get")
    res.json(room);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message })
  }
})

export default router;