const express = require('express')
const router = express.Router()
const multer = require("multer")
const postLimiter = require('../config/postLimiter')
const getLimiter = require('../config/getLimiter')
const { getNotes, newNote, deleteNote, editNote, testGetNotes, testNewNote, testDeleteNote, testEditNote, sabamooi } = require('../controllers/messageController')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/').get(getLimiter, getNotes)
router.route('/').post(postLimiter, upload.single('imgfile'), newNote)
router.route('/').delete(deleteNote)
router.route('/').put(editNote)

router.route('/test/otenboom').get(sabamooi)
router.route('/test').get(getLimiter, testGetNotes).post(upload.single('imgfile'), testNewNote).delete(testDeleteNote).put(testEditNote)

module.exports = router