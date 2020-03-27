process.env.PORT = process.env.PORT || 4000
process.env.NODE_DEV = process.env.NODE_DEV || 'dev'
process.env.EXP_TOKEN = '48h'
process.env.SEED = process.env.SEED || 'secret-dev-seed-doshop'
let db
if (process.env.NODE_DEV === 'dev') {
    db = 'mongodb://localhost:27017/doshop'
} else {
    db = process.env.PROD_DB_URI
}
process.env.DB = db
process.env.CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE || '947118140161-cimjqjc68p5uoquh9ui8n9dioefv1hj8.apps.googleusercontent.com'
