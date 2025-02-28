import { useEffect, useState } from "react";
import InputSecondary from "../../components/inputs/inputSecondary";
import { FaEye, FaArrowRight } from 'react-icons/fa';
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import { useNavigate } from "react-router-dom";
import { getToken, login as loginAPI, buscarUsuario, salvarUsuario } from "../../utils/api/webservice";
import MessageBox from "../../components/box/message";

export default function Login() {
    const [isLoading, setIsLoading] = useState(true);
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [errorFields, setErrorFields] = useState({ usuario: false, senha: false });
    const [showErrorMessage, setShowErrorMessage] = useState(false); 

    const navigate = useNavigate();

    const handleInputChange = (field, value) => {
        if (field === "usuario") {
            setUsuario(value);
            if (value.trim() !== "") {
                setErrorFields((prev) => ({ ...prev, usuario: false }));
            }
        }
        if (field === "senha") {
            setSenha(value);
            if (value.trim() !== "") {
                setErrorFields((prev) => ({ ...prev, senha: false }));
            }
        }
    };

    const handleLogin = async () => {
        setShowErrorMessage(false);

        if (!usuario.trim() || !senha.trim()) {
            setErrorFields({
                usuario: usuario.trim() === "",
                senha: senha.trim() === "",
            });
            return;
        }

        try {
            const token = await getToken();
            console.log("Token gerado:", token);
            sessionStorage.setItem("authToken", token);

            const response = await loginAPI(usuario, senha);
            console.log("Login bem-sucedido:", response);

            const userInfo = await buscarUsuario(usuario);
            console.log("dados da api: ", userInfo)

            if (!userInfo || !userInfo.id_usuario || !userInfo.nome) {
                console.error("Erro: Dados do usuário incompletos", userInfo);
                setShowErrorMessage(true);
                return;
            }

            const userData = {
                idUsuario: userInfo.id_usuario,
                nome: userInfo.nome,
                email: userInfo.email || "sem-email",
                papel: "Usuário"
            };

            await salvarUsuario(userData);

            sessionStorage.setItem("userSession", JSON.stringify(userData));

            navigate("/dashboard");

        } catch (error) {
            console.error("Erro ao acessar o sistema:", error);

            if (error.response && error.response.status === 500) {
                setShowErrorMessage(true);
            }
        }
    };


    return (
        <div className="flex flex-col items-center p-10 justify-center ">
            <div className="flex flex-col justify-center items-center w-full px-0 mt-10 ">
                <div className="flex flex-col md:items-center mb-6 gap-y-4">
                    <img src="./logo-app.png" alt="logo" width={60} />
                    <h2 className="text-3xl font-semibold text-gray-700">Bem vindo ao NomeSistema!</h2>
                    <p className="text-base font-light text-primary-dark">Preencha os dados abaixo para a acessar a plataforma e um bom trabalho!</p>
                </div>
                <div className="flex flex-col h-full w-full md:w-[600px] mt-12">

                    <div className="mb-6">
                        <InputSecondary
                            label="Usuário"
                            placeholder="Nome"
                            type="text"
                            value={usuario}
                            onChange={(e) => handleInputChange("usuario", e.target.value)}
                            buttonIcon={<FaArrowRight />}
                            errorMessage={errorFields.usuario ? "Usuário é obrigatório" : ""}
                        />
                    </div>
                    <div className="mb-10">
                        <InputSecondary
                            label="Senha"
                            placeholder="Digite sua senha "
                            type="password"
                            value={senha}
                            onChange={(e) => handleInputChange("senha", e.target.value)}
                            buttonIcon={<FaEye />}
                            errorMessage={errorFields.senha ? "Senha é obrigatória" : ""}
                        />
                        <p className="text-xs text-primary-dark">Esqueci a senha</p>
                    </div>
                    <ButtonPrimary onClick={handleLogin}>Entrar</ButtonPrimary>
                </div>
            </div>
            {showErrorMessage && (
                <MessageBox
                    type="error"
                    title="Erro de autenticação."
                    message="Usuário ou senha inválidos. Tente novamente."
                    onClose={() => setShowErrorMessage(false)}
                />
            )}
        </div>
    )
};