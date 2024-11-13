import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Certifique-se de que a porta está correta
});

export const createOrder = async (orderData) => {
    try {
      const response = await api.post('/serviceOrder', orderData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar ordem de serviço:", error);
      throw error;
    }
  };

  export const getAllOrders = async () => {
    try {
      const response = await api.get('/serviceOrders');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar ordens de serviço:", error);
      throw error;
    }
  };

  export const getOrderById = async (id) => {
    try {
      const response = await api.get(`/serviceOrder/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar a ordem de serviço:", error);
      throw error;
    }
  };

  export const updateOrder = async (id, orderData) => {
    try {
      const response = await api.put(`/serviceOrder/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar ordem de serviço:", error);
      throw error;
    }
  };

  export const deleteOrder = async (id) => {
    try {
      const response = await api.delete(`/serviceOrder/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar ordem de serviço:", error);
      throw error;
    }
  };

export default api;