import app from './app.js';
import { env } from './config/env.js'

app.listen(env.PORT, () => {
    console.log(`Project run on Port : ${env.PORT}`)
})