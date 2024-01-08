require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING)

let nextEmp = 5

module.exports = {
    getFileList: (req, res) => {
        sequelize.query(`select name, description, link, id from file;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    addFile: (req, res) => {
        const {name, description, link} = req.body
        
        sequelize.query(`insert into file (name, description, link) values
        ('${name}','${description}','${link}') returning *;`)
            .then(dbRes => {
                const fileId = dbRes[0][0].id
                console.log(dbRes)
                console.log("new file id:", fileId)

                //Add file version 1 in the history table
                sequelize.query(`insert into history (version, file_id, comment, date_created, link) 
                values (1,${fileId},'Initial Version', now(), '${link}');`)
                    .then(dbRes2 => {
                        res.status(200).send({success: true})
                    })
                })                
            .catch(err => console.log(err))

        //res.status(200).send({success: true})
    },
    addVersion: (req, res) => {
        const {fileId, comment, link} = req.body
        
        sequelize.query(`select count(*) from history where file_id=${fileId};`)
            .then(dbRes => {
                let version = Number(dbRes[0][0].count) + 1
                sequelize.query(`insert into history (version, file_id, comment, date_created, link) 
                values (${version},${fileId},'${comment}', now(), '${link}');`)
                    .then(dbRes2 => {
                        //Update file.link to the link of this latest version
                        sequelize.query(`update file set link='${link}' where id=${fileId};`)
                        .then(dbRes3 => {
                            res.status(200).send({success: true})
                        })
                    })
                })
            .catch(err => console.log(err))
    },
    getVersionList: (req, res) => {
        const fileId = req.params.fileId
        sequelize.query(`select version, file_id, comment, 
        date_created, 
        link from history where file_id=${fileId};`)
        //TODO: Add file info for client to use to response object
            .then(dbRes => {
                sequelize.query(`select id, name, description, link from 
                file where id=${fileId};`).then(dbRes2 => {
                const resbody = {file: dbRes2[0][0], versions: dbRes[0]}
                //res.status(200).send(dbRes[0])})
                res.status(200).send(resbody)})
                })   
            .catch(err => console.log(err))
    }
}
