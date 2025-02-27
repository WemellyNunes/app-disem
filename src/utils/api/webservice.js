import axios from 'axios';

const webservice = axios.create({
  baseURL: 'http://localhost:8080/api/webservice',
});

export const getToken = async () => {
  try {
    const response = await webservice.get();
    localStorage.setItem("authToken", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao gerar token", error);
    throw error;
  }
};

export const buscarUsuario = async (login) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await webservice.get("/buscar-usuario", {
      params: { login, token },
    });
    return response.data;
  } catch (error) {
    console.error("erro ao buscar usuario", error);
    throw error;
  }
};

export const login = async (login, senha) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await webservice.post("/login", null, {
      params: { login, senha, token },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  } catch (error) {
    console.error("erro ao acessar o sistema", error);
    throw error;
  }
};

export const listarUsuarios = async () => {
  try {
      const response = await webservice.get("/usuarios");
      console.log("📌 Dados recebidos do backend:", response.data);
      return response.data;
  } catch (error) {
      console.error("Erro ao listar usuários", error);
      throw error;
  }
};

export const salvarUsuario = async (usuario) => {
  try {
      const response = await webservice.post("/salvar-usuario", usuario);
      return response.data;
  } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      throw error;
  }
};




export default webservice;