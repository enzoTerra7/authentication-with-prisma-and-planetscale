import React, { useState } from 'react'
import {
    Modal,
    ModalBackground,
    ModalContent,
} from 'bloomer'

interface CustomModalProps {
    children: React.ReactNode,
    isActive: boolean,
    handleClose: (param?: any) => any
}

const CustomModal = ({ isActive, children, handleClose }: CustomModalProps) => {
    if (isActive) {
        return (
            <Modal className="fixed w-[100vw] h-[100vh] z-[5000] top-0 flex items-center justify-center" isActive={isActive}>
                <ModalBackground className='bg-black opacity-75 absolute w-full h-full ' onClick={() => handleClose()} />
                <ModalContent
                    className="bg-white p-8 max-w-[95vw] max-h-[95vh] rounded"
                    style={{zIndex: '1'}}
                >
                    {children}
                </ModalContent>
            </Modal>
        )
    }
}

export default CustomModal

export const useModal = (initialMode = false) => {
    const [modalOpen, setModalOpen] = useState(initialMode)
    const toggle = () => setModalOpen(!modalOpen)
    return { modalOpen, setModalOpen, toggle }
}