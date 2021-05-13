const express = require('express')
const ftp = require("basic-ftp")
const csv=require('csvtojson')
// const fs = require('fs')

const app = express()
const router = express.Router()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


let port = process.env.PORT;
if (port == null || port == "") {
  port = "8080";
}
console.log(port)
app.listen(port);


async function retrieve() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: "ftp.addicosolutions.com",
            user: "serendipity",
            password: "$3r3nd1p1ty509",
            secure: false
        })
        var files = await client.list()
        files.sort((a, b) => (Date.parse(a.rawModifiedAt) > Date.parse(b.rawModifiedAt)) ? 1 : -1)
        const csvFilePath = 'temp.txt'
        
        // Async / await usage
        var jsonArray = []
        for (let i = 0; i < files.length; i++) {
          const e = files[i];
          if (e.name.includes(".txt")) {
            await client.downloadTo(csvFilePath, e.name)
            if (e.name.includes("delete")) {
              let tempDelete = await csv().fromFile(csvFilePath)
              tempDelete.map(e => {
                e['action'] = 'delete'
                return e
              })
              jsonArray = jsonArray.concat(tempDelete);
            } else if (e.name.includes("add")) {
              let tempAdd = await csv().fromFile(csvFilePath)
              tempAdd.map(e => {
                e['action'] = 'add'
                return e
              })
              jsonArray = jsonArray.concat(tempAdd);
            }
            // await client.remove(e.name)
          }
        }
        return jsonArray
        // const jsonString = JSON.stringify(jsonArray)
        // fs.writeFile('./stock.json', jsonString, err => {
        //     if (err) {
        //         console.log('Error writing file', err)
        //     }
        // })
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}


async function updates (req, res)  {
    return res.status(200).json({"updates": await retrieve()})
}

router.get('/', updates)
app.use('/updates', router)
