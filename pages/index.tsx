import Head from 'next/head'
import { useSession, signOut, getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { getAllByUserId, toDoProps } from '../lib/db'
import { useState } from 'react'
import { Session } from 'next-auth'
import axios from 'axios'
import CustomModal, { useModal } from '../components/CustomModal'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const toDo: toDoProps[] = await getAllByUserId(String(session.id))

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: {
      userId: session?.id,
      toDo: toDo || []
    }
  }
}

export interface HomeProps {
  toDo: toDoProps[]
  userId: string
}

export default function Home(props: HomeProps) {

  const { modalOpen, setModalOpen, toggle } = useModal()

  const [description, setDescription] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [toDos, setToDos] = useState<toDoProps[]>(props.toDo)
  const [editTodo, setEditTodo] = useState<toDoProps>({
    description: '',
    id: null,
    user: null,
    userId: ''
  })

  const makeTodo = async (description: string) => {
    try {
      await axios.post("/api/todo", {
        description: description,
        userId: props.userId
      }).then(() => {
        setDescription('')
      })
      const { data } = await axios.get(`api/todo?userId=${props.userId}`)
      setToDos(data.data)
    } catch (e) {
      console.log(e)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`/api/todo?id=${id}`)
      const { data } = await axios.get(`api/todo?userId=${props.userId}`)
      setToDos(data.data)
    } catch (e) {
      console.log(e)
    }
  }

  const toEditTodo = async (id: number) => {
    try {
      await axios.put(`/api/todo?id=${id}&newDescription=${newDescription}`)
      const { data } = await axios.get(`api/todo?userId=${props.userId}`)
      setToDos(data.data)
    } catch (e) {
      console.log(e)
    } finally {
      setNewDescription('')
      setEditTodo({
        description: '',
        id: null,
        user: null,
        userId: ''
      })
      setModalOpen(false)
    }
  }

  return (
    <div>
      <div className="h-full min-h-screen pb-5 bg-gray-500">
        <nav className="flex justify-center p-4 bg-gray-600">
          <h1 className="text-white text-2xl font-bold">Feedback Traversy Media</h1>
        </nav>
        <div>
          <form onSubmit={(e) => e.preventDefault()} className="flex justify-center mt-10">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h1 className="text-center mb-4">Escrever to-do task</h1>
              <div className="flex space-x-2 p-2 bg-white rounded-md">
                <input
                  type="text"
                  value={description}
                  placeholder="Escreva aqui..."
                  className="w-full outline-none"
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button
                  className="bg-green-500 px-2 py-1 rounded-md text-white font-semibold"
                  onClick={() => {
                    if (description !== '') {
                      makeTodo(description)
                    }
                  }}
                >
                  Enviar
                </button>
              </div>
            </div>
          </form>
          <div>
            {toDos?.map((toDo, index) => (
              <div className="flex justify-center" key={toDo.id}>
                <div className=" relative justify-center mt-6">
                  <div className="absolute flex top-0 right-0 p-3 space-x-1">
                    <span
                      onClick={() => {
                        setEditTodo(toDo)
                        setModalOpen(true)
                        setNewDescription(toDo.description)
                      }}
                      className="cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </span>
                    <span className='cursor-pointer' onClick={() => deleteTodo(toDo.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </span>
                  </div>
                  <span className="absolute -left-3 -top-3 bg-green-500 flex justify-center items-center rounded-full w-8 h-8 text-gray-50 font-bold">
                    {index + 1}
                  </span>
                  <p className="bg-white px-12 py-8 rounded-lg w-80">
                    {toDo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CustomModal
        isActive={modalOpen}
        handleClose={() => (
          setModalOpen(false),
          setNewDescription(''),
          setEditTodo({
            description: '',
            id: null,
            user: null,
            userId: ''
          })
        )}
      >
        <div className="flex w-full h-full items-center justify-center flex-col gap-7">
          <p className='text-2xl uppercase font-bold text-gray-500'>
            Edite sua ToDo
          </p>
          <input
            value={newDescription}
            type="text"
            onChange={(e) => setNewDescription(e.target.value)}
            className='w-[75vw] bg-black border-none rounded text-lg outline-transparent focus:outline-gray-500 focus:text-white transition-colors text-gray-500 h-12 px-8'
          />
          <div className="flex w-full h-full items-center justify-center gap-10">
            <span
              onClick={() => (
                setModalOpen(false),
                setNewDescription(''),
                setEditTodo({
                  description: '',
                  id: null,
                  user: null,
                  userId: ''
                })
              )}
              className="cursor-pointer"
            >
              Cancelar
            </span>
            <button
              className='border-2 bg-transparent border-black text-gray-500 rounded p-4 text-sm outline-transparent hover:text-white hover:bg-black transition-colors'
              onClick={() => toEditTodo(editTodo.id)}
            >
              Editar
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  )
}