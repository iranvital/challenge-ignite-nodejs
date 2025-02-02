import { randomUUID } from 'node:crypto'
import { Database } from "./middlewares/database.js"
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select(
                'tasks',
                search ? {
                    title: search,
                    description: search,
                    completed: search
                } : null
            )

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            if (!title || !description) {
                return res.writeHead(422).end(JSON.stringify({
                    message: 'Title and description are requiredd.'
                }))
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            const idExist = database.select('tasks', { id })

            if (idExist.length < 1) {
                return res.writeHead(404).end(JSON.stringify({
                    message: 'Task not found.'
                }))
            }

            if (!title || !description) {
                return res.writeHead(422).end(JSON.stringify({
                    message: 'Title and description are required.'
                }))
            }

            database.update('tasks', id, {
                title,
                description,
                updated_at: new Date().toISOString()
            })

            return res.writeHead(204).end()

        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const idExist = database.select('tasks', { id })

            if (idExist.length < 1) {
                return res.writeHead(404).end(JSON.stringify({
                    message: 'Task not found.'
                }))
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()

        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/completed'),
        handler: (req, res) => {
            const { id } = req.params

            const idExist = database.select('tasks', { id })

            if (idExist.length < 1) {
                return res.writeHead(404).end(JSON.stringify({
                    message: 'Task not found.'
                }))
            }

            database.update('tasks', id, {
                completed: new Date().toISOString(),
            })

            return res.writeHead(204).end()

        }
        
    }
]