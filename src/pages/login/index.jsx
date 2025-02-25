import { useEffect } from "react";
import InputSecondary from "../../components/inputs/inputSecondary";
import { FaEye, FaArrowRight } from 'react-icons/fa';
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import { useNavigate } from "react-router-dom";
import MessageCard from "../../components/cards/menssegeCard";


export default function Login() {

    const navigate = useNavigate();

    useEffect(() => {
            document.body.classList.add("bg-login-page");
    
            return () => {
                document.body.classList.remove("bg-login-page");
            };
        }, []);

    return (
            <div className="flex flex-col items-center p-10 justify-center ">
                    <MessageCard
                        type="info"
                        message="Sem autenticação no momento, só clique no botão entrar."
                        storageKey="showLoginMessage"
                    />
                <div className="flex flex-col justify-center items-center w-full mt-10">
                    <div className="flex flex-col items-center mb-10">
                        <h2 className="text-3xl font-semibold text-gray-700">Acesse sua conta</h2>
                        <p className="text-lg font-light text-primary-dark">Realize seu login e bom trabalho!</p>
                    </div>
                    <div className="flex flex-col h-full w-full md:w-1/3 rounded-md ">
                    
                        <div className="mb-6">
                            <InputSecondary
                                label="Usuário"
                                placeholder="Digite seu nome de usuário "
                                type="text"
                                buttonIcon={<FaArrowRight />}
                            />
                        </div>
                        <div className="mb-10">
                            <InputSecondary
                                label="Senha"
                                placeholder="Digite sua senha "
                                type="password"
                                buttonIcon={<FaEye />}
                            />
                            <p className="text-xs text-primary-dark">Esqueci a senha</p>
                        </div>
                        <ButtonPrimary onClick={e => navigate("../Dashboard")}  >Entrar</ButtonPrimary>
                    </div>
                </div>
            </div>
    )
};