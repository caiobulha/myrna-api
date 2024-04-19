const express = require("express")
require("dotenv").config()

const app = express()

app.listen(process.env.APP_PORT, () => {
     console.log(`Service listening on port ${process.env.APP_PORT}`)
})



