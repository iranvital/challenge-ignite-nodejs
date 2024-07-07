import http from 'node:http'
import { json } from './middlewares/json.js'

const tasks = []

const server = http.createServer(async (req, res) => {

    const { method, url } = req

    await json(req, res)

    if (method === 'GET' && url === '/tasks') {
        return res.end(JSON.stringify(tasks))
    }

    if (method === 'POST' && url === '/tasks') {
        const { title, description } = req.body

        tasks.push({
            id: 1,
            title,
            description,
            completed: false
        })

        return res.writeHead(201).end()
    }   

    return res.writeHead(404).end('Not Found')
 })
    
server.listen(3333)