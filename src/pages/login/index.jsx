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
                <div className="flex flex-col justify-center items-center content-center w-full mt-2">
                    <div className="flex flex-col mb-10 md:mb-16 h-3 w-44">
                        <img src="./public/images/disemLogo.png" alt="" />
                    </div>
                    <div className="flex flex-col items-center mb-10">
                        <h2 className="text-3xl font-semibold text-gray-700">Acesse sua conta</h2>
                        <p className="text-lg font-light text-primary-dark">Realize seu login e bom trabalho!</p>
                    </div>
                    <div className="flex flex-col p-8 h-full w-96 max-w-xs md:max-w-md rounded-md bg-white border border-primary-light">
                        <p className="text-2xl font-semibold text-primary-light mb-8">Login</p>
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