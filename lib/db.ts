import prisma from './prisma';

export interface toDoProps {
    id: number;
    description: string;
    completed: number
    userId: string;
    user: any
}

export async function getAllToDos() {
    const data = await prisma.todo.findMany()
    return data
}

export async function getAllByUserId(userId: string | string[]) {
    const data = await prisma.todo.findMany({
        where: {
            userId: userId
        }
    })
    return data || []
}

export async function createTodo(description: string, userId: string) {
    await prisma.todo.create({
        data: {
            description,
            userId
        }
    })
}

export async function deleteTodoById(todoId) {
    await prisma.todo.delete({
        where: {
            id: Number(todoId)
        }
    })
}

export async function editTodoById(todoId, description) {
    await prisma.todo.update({
        where: {
            id: Number(todoId),
        },
        data: {
            description: String(description),
        },
    })
}

export async function changeTodoStatus(todoId, status) {
    await prisma.todo.update({
        where: {
            id: Number(todoId),
        },
        data: {
            completed: !(Number(status) === 0),
        },
    })
}