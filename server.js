console.log("hi")
// cool
const express = require('express')

const app = express()
const router = express.Router()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


let port = process.env.PORT;
if (port == null || port == "") {
  port = "8000";
}
app.listen(port);

function blah (req, res)  {
    const menu = {
        'Number 9': 1.99,
        'Number 9 Large': 2.99,
        'Number 6 with Extra Dip': 3.25,
        'Number 7': 3.99,
        'Number 45': 3.45
    }
    return res.status(200).json({ menu: menu })
}

router.get('/', blah)
app.use('/menu', router)
