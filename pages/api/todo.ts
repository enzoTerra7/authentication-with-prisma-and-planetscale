import type { NextApiRequest, NextApiResponse } from 'next'
import { createTodo, deleteTodoById, editTodoById, getAllByUserId } from '../../lib/db'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        await createTodo(req.body.description, req.body.userId)
        return res.status(200).json({ message: 'Task criada com sucesso' })
    } else if(req.method === 'GET'){
        try {
            const data = await getAllByUserId(req.query.userId)
            return res.status(200).json({ message: 'Tasks retornadas com sucesso', data: data })
        } catch(e){
            return res.status(500).json({ message: 'Erro no get'})
        }
    } else if(req.method === 'DELETE'){
        try {
            await deleteTodoById(req.query.id)
            return res.status(200).json({ message: 'Task apagada com sucesso'})
        } catch(e){
            return res.status(500).json({ message: 'Erro no delete'})
        }
    } else if(req.method === 'PUT'){
        try {
            await editTodoById(req.query.id, req.query.newDescription)
            return res.status(200).json({ message: 'Task editada com sucesso'})
        } catch(e){
            return res.status(500).json({ message: 'Erro no put'})
        }
    }
}