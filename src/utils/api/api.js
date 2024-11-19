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

  export const uploadDocument = async (file, orderServiceId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('orderServiceId', orderServiceId);

    try {
        const response = await api.post('/uploadDocument', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao fazer upload do documento:", error);
        throw error;
    }
};

export const getClassStatistics = async () => {
  try {
      const response = await api.get('/statistics/classification');
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar estatísticas de classificação:", error);
      throw error;
  }
};

export const getTypeMaintenanceStatistics = async () => {
  try {
      const response = await api.get('/statistics/typeMaintenance');
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar estatísticas de tipo de manutenção:", error);
      throw error;
  }
};

export const getOrdersBySystemStatistics = async () => {
  try {
      const response = await api.get('/statistics/system'); // Atualize o endpoint conforme necessário
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar estatísticas de ordens por sistema:", error);
      throw error;
  }
};

export const getOrdersByCampus = async () => {
  try {
      const response = await api.get('/statistics/campus'); // Atualize o endpoint conforme necessário
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar estatísticas de ordens por campus:", error);
      throw error;
  }
};


export default api;