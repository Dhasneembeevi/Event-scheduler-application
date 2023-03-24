const Event = require('../models/event')
const router = require('express').Router();

const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended:false }));

router.use(bodyParser.json())

// 1. create new event
router.post('/', async (req, res) => {
    try{
        const requiredFields = ['title', 'description', 'location']; 
        const maxLengths = { title: 50, description: 500, location: 100 };  
        const minLengths = { title: 5 };

        const missingFields = requiredFields.filter(field => !(field in req.body));
        if (missingFields.length) {
          return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }
        
        const invalidFields = Object.keys(maxLengths).filter(field => req.body[field].length > maxLengths[field]);
        if (invalidFields.length) {
          return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
        }
        
        if (!req.body.title.trim()) {
          return res.status(400).json({ error: "Title cannot be empty" });
        }
        
        if (req.body.title.trim().length < 6 ) {
          return res.status(400).json({ error: "Title should be at least 6 characters" });
        }
        
        const newEvent = await Event.create({
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        })
        
        res.status(201).json({
           status:"success",
           newEvent
        })
    }
    catch(err) {
        res.status(400).json({
            message: err.message,
        })
    }
})


//2. list all events
router.get('/', async function (req, res) {
    try {
        const events = await Event.find()
        res.status(200).json({
            events
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})


//3. get specific event
router.get('/:eventId', async function (req, res) {
    const { eventId} =req.params
    try {
        const event = await Event.findOne({_id: eventId})
        if(!event){
            res.status(404).json({
                message: 'There is no event with this Id'
            })
        }
        res.status(200).json({
            event
        })

    } catch (err) {
        res.status(404).json({
            message:  "event not found with this id"
        })
    }
})


// 4. delete event 
router.delete('/:eventId',  async (req, res)=> {
    const { eventId } = req.params;
    try {
        await Event.deleteOne({_id: eventId})
        res.status(204).end()
    } catch (error) {
        res.status(404).json({
          
        })
    }
})

// 5 . update event

router.put('/:eventId', async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const updates = req.body;
      const options = { new: true }; 
  
     
      const requiredFields = ['title', 'description', 'location', 'startTime', 'endTime'];
      const maxLengths = { title: 50, description: 500, location: 100 };
  
      const missingFields = requiredFields.filter(field => !(field in req.body));
      if (missingFields.length) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
      }
  
      const invalidFields = Object.keys(maxLengths).filter(field => req.body[field].length > maxLengths[field]);
      if (invalidFields.length) {
        return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
      }
  
      if (!req.body.title) {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
  
      const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, options);
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(updatedEvent);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  

module.exports = router;