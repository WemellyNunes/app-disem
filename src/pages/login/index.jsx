import { useEffect, useState} from "react";
import InputSecondary from "../../components/inputs/inputSecondary";
import { FaEye, FaArrowRight } from 'react-icons/fa';
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import { useNavigate } from "react-router-dom";
import MessageCard from "../../components/cards/menssegeCard";
import { getToken } from "../../utils/api/webservice";


export default function Login() {
    const [isToken, setIsToken] = useState(false);

    //posso pfingir mais um pouco 

    const navigate = useNavigate();

    useEffect(() => {
            document.body.classList.add("bg-login-page");
    
            return () => {
                document.body.classList.remove("bg-login-page");
            };
        }, []);

    return (
            <div className="flex flex-col items-center p-10 justify-center ">
                <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-0 mt-10">
                    <div className="flex flex-col items-center mb-10">
                        <h2 className="text-3xl font-semibold text-gray-700">Acesse sua conta</h2>
                        <p className="text-lg font-light text-primary-dark">Realize seu login e bom trabalho!</p>
                    </div>
                    <div className="flex flex-col h-full w-full">
                    
                        <div className="mb-6">
                            <InputSecondary
                                label="Usuário"
                                placeholder="Nome"
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