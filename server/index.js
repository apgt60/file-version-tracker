require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const {
    getFileList,
    addFile,
    addVersion,
    getVersionList
} = require('./controller.js')

app.use(express.json())
app.use(cors())

// ENDPOINTS
app.get('/api/allFiles', getFileList)
app.post('/api/addFile', addFile)
app.post('/api/addVersion', addVersion)
app.get('/api/versions/:fileId', getVersionList)

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))