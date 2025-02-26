import axios from 'axios';

const webservice = axios.create({
  baseURL: 'http://localhost:8080/api/webservice',
});

export const getToken = async () => {
  try {
    const response = await webservice.get();
    return response.data;
  } catch (error) {
    console.error("Erro ao gerar token", error);
    throw error;
  }
};

export const buscarUsuario = async () => {
    try{
        const response = await webservice.get("/buscar-usuario");
        return response.data;
    } catch (error) {
        console.error("erro ao buscar usuario", error);
        throw error;
    }
};

export const login = async () => {
    try{
        const response = await webservice.post("/login");
        return response.data;
    } catch (error) {
        console.error("erro ao acessar o sistema", error);
        throw error;
    }
};


export default webservice;