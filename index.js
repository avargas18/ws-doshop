require('./config/config')
const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect(
    process.env.DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err) => {
        if (err) {
            return console.log(`Error connecting to database ${err}`)
        } else {
            console.log('Connection to the established database ...')
            app.listen(process.env.PORT, () => {
                console.log(`API REST running in PORT ${process.env.PORT}`)
            })
        }
    }
)
