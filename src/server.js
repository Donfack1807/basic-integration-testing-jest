const app = require("./app")
const { connectToDB } = require("./database")

main()

async function main () {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
    const MONGODB_DB = process.env.MONGODB_DB || 'mytodos'

    await connectToDB(MONGODB_URI, MONGODB_DB)

    const port = process.env.PORT || 4200
    app.listen(port)
    console.info(`Listening to http://localhost:${port}`)
}
