import { useState } from 'react';
import PageTitle from '../../components/title'
import TeamModal from '../../components/modal/team'
import ButtonPrimary from '../../components/buttons/buttonPrimary';


export default function TeamPage() {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    // Função para fechar o modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className='flex flex-col'>
                <PageTitle
                    text="Equipe"
                    backgroundColor="bg-white"
                    textColor="text-primary-dark"
                />

                <div className="p-6">
                    {/* Botão para abrir o modal */}
                    <ButtonPrimary onClick={handleOpenModal}>
                        Cadastrar Profissional
                    </ButtonPrimary>
                </div>

                    {showModal && <TeamModal onClose={handleCloseModal} />}

            </div>
        
        </>
    )


}