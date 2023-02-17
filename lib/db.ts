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
    try {
        // const user = await getUserById(userId)
        // console.log('user', user)
        await prisma.todo.create({
            data: {
                description,
                userId,
                completed: 0
            }
        })
    } catch(e) {
        throw e
    }
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
    console.log(status)
    try {
        await prisma.todo.update({
            where: {
                id: Number(todoId),
            },
            data: {
                completed: Number(status),
            },
        })
    } catch(e){
        console.log(e)
        throw e
    }
}

export async function getUserById(id) {
    const getUser = prisma.User.findUnique({
        where: {
            id: id
        }
    })

    const user = await getUser.then()
    
    return user
}