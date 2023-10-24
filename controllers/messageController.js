const asyncHandler = require('express-async-handler')
const Message = require('../models/messageModel');
const testMessage = require('../models/testMessageModel');
const { google }= require('googleapis');
const { Readable } = require('stream');
const dotenv = require('dotenv').config()

const CLIENT_ID = process.env.CLIENT_ID 
const CLIENT_SECRET = process.env.CLIENT_SECRET 
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN =  process.env.REFRESH_TOKEN


const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

const getNotes = asyncHandler(async(req, res) => {
    let messages; 

    try{
        messages = await Message.find();
    }catch(error){
        console.log(error);
        res.send(404);
    }

    res.json(messages);
})

const testGetNotes = asyncHandler(async(req, res) => {
    let messages; 
    try{
        messages = await testMessage.find();
    }catch(error){
        console.log(error);
        res.send(404);
    }

    res.json(messages);
})

const sabamooi = asyncHandler(async(req, res) => {
    for (let i = 0; i < 5; i++) {
        console.log(i);
        await Message.findOneAndDelete({}, { sort: { createdAt: -1 } }); 
    }
    res.send(200)
})

const newNote = asyncHandler(async (req, res) => {
    if (!req.body.message || !req.body.codeName) {
        res.status(400);
        throw new Error("Complete all the required fields");
    }

    if(req.body.message.length > 1000 || req.body.codeName > 100){
        res.status(400);
        throw new Error("Message too long")
    }

    try {
        let obj;
        if(req.file){
            obj = {
                message: req.body.message,
                codeName: req.body.codeName,
                img: ""
                    // contentType: req.file.mimetype,
                    // data:  req.file.buffer,
            }
        }else{
            obj = {
                message: req.body.message,
                codeName: req.body.codeName,
            }
        } 
        const dbMessage = await Message.create(
            obj
        );
        
        const file = req.file
        let fileId;
        if(file){
            const mediaBody = new Readable();
            mediaBody._read = () => {};
            mediaBody.push(req.file.buffer);
            mediaBody.push(null);

            const media = {
                mimeType: file.mimetype,
                body: mediaBody
            };
            
            const response = await drive.files.create({
                requestBody: {
                    name: dbMessage.id,
                    parents: ['16o999h1yrlh1iK3NevAOSagfsRSQ7ZiJ'],
                },
                media: media
            });
            console.log(response.data.id)
            fileId = response.data.id;

            drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
                
            result = drive.files.get({
                fileId: fileId,
                fields: 'webViewLink, webContentLink',
            });

            const publicLink = `https://drive.google.com/uc?id=${fileId}`;
            const update = await Message.findByIdAndUpdate(dbMessage._id.toString(), {img: publicLink}, {new : true});
            res.status(200).json({ message: update});
            return;
        }

        res.status(200).json({message : dbMessage});
        return;
    } catch (error) {
        console.log(error)
        res.status(500);
        throw new Error("An error occurred while creating a new note");
    }
});


const testNewNote = asyncHandler(async (req, res) => {
    if (!req.body.message || !req.body.codeName) {
        res.status(400);
        throw new Error("Complete all the required fields");
    }
    if(req.body.message.length > 1000 || req.body.codeName > 100){
        res.status(400);
        console.log("Message too long")
        throw new Error("Message too long")
    }    
    try {
        let obj;
        if(req.file){
            obj = {
                message: req.body.message,
                codeName: req.body.codeName,
                img: ""
                    // contentType: req.file.mimetype,
                    // data:  req.file.buffer,
            }
        }else{
            obj = {
                message: req.body.message,
                codeName: req.body.codeName,
            }
        } 
        const dbMessage = await testMessage.create(
            obj
        );
        
        const file = req.file
        let fileId;
        if(file){
            const mediaBody = new Readable();
            mediaBody._read = () => {};
            mediaBody.push(req.file.buffer);
            mediaBody.push(null);

            const media = {
                mimeType: file.mimetype,
                body: mediaBody
            };
            
            const response = await drive.files.create({
                requestBody: {
                    name: dbMessage.id,
                    parents: ['1MbVNEUwa-VF5xcLvBLxBqNpHKAHLDt1V'],
                },
                media: media
            });
            console.log(response.data.id)
            fileId = response.data.id;

            drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
                
            result = drive.files.get({
                fileId: fileId,
                fields: 'webViewLink, webContentLink',
            });

            const publicLink = `https://drive.google.com/uc?id=${fileId}`;

            const update = await testMessage.findByIdAndUpdate(dbMessage._id.toString(), {img: publicLink}, {new : true});

            res.status(200).json({ message: update});
            return;
        }

        res.status(200).json({message : dbMessage});
        return;
    } catch (error) {
        console.log(error)
        res.status(500);
        throw new Error("An error occurred while creating a new note");
    }
});


const deleteNote = asyncHandler(async (req, res) => {
    const id = req.query.id;
    try {
        const result = await Message.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
            // io.emit("noteDeleted", { id });
            res.sendStatus(200);
        } else {
            res.sendStatus(404); 
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500); 
    }
});

const testDeleteNote = asyncHandler(async (req, res) => {
    const id = req.query.id;
    try {
        const result = await testMessage.deleteOne({ _id: id });
        console.log(result)
        console.log(result.deletedCount)
        if (result.deletedCount === 1) {
            // io.emit("noteDeleted", { id });
            res.send(200).json({message: "Note deleted successsfully"});
        } 
    } catch (error) {
        console.log(error);
        res.send(500); 
    }
});

const editNote = asyncHandler(async (req, res) => {
    try {
      const id = req.query.id;
  
      const query = { _id: id };
  
      const update = {
        $set: {
          codeName: req.body.codeName,
          message: req.body.message
        }
      };

      await Message.findOneAndUpdate(query, update);
  
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });
  
const testEditNote = asyncHandler(async (req, res) => {
    try {
      const id = req.query.id;
  
      const query = { _id: id };
  
      const update = {
        $set: {
          codeName: req.body.codeName,
          message: req.body.message
        }
      };

      await testMessage.findOneAndUpdate(query, update);
  
      res.status(200).json({ message: "Note edited successfully" });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });


module.exports = {
    getNotes,
    newNote,
    deleteNote,
    editNote,
    testGetNotes,
    testNewNote,
    testDeleteNote,
    testEditNote,
    sabamooi
}