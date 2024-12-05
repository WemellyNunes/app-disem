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

  export const downloadReport = async (id) => {
    try {
        // Obter o status da ordem de serviço antes de baixar o relatório
        const order = await getOrderById(id);
        const status = order.status;
  
        // Definir o nome do arquivo com base no status
        let fileName = `relatorio_os_${id}.pdf`;
        if (status === 'Em atendimento') {
            fileName = `programacao_os_${id}.pdf`;
        }
  
        // Fazer o download do relatório
        const response = await api.get(`/${id}/report`, {
            responseType: 'blob', // Receber como arquivo binário
        });
  
        // Criar um URL para o Blob e iniciar o download
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // Nome do arquivo definido no frontend
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erro ao baixar o relatório:', error);
        throw new Error('Não foi possível iniciar o download do relatório.');
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

  export const updateOrderServiceStatus = async (id, statusDescricao) => {
    try {
      const response = await api.put(
        `/serviceOrder/${id}/status`,
        JSON.stringify(statusDescricao), // Garante que seja enviado como string
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar o status da OS:", error);
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

export const getSipacOrdersCount = async () => {
  try {
      const response = await api.get('/statistics/sipac');
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar estatísticas SIPAC:", error);
      throw error;
  }
};

export const getMonthOrdersCount = async () => {
  try {
      const response = await api.get('/statistics/month');
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar estatísticas mensais:", error);
      throw error;
  }
};

export const getWeekOrdersCount = async () => {
  try {
      const response = await api.get('/statistics/week');
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar estatísticas semanais:", error);
      throw error;
  }
}

export const getTodayOrdersCount = async () => {
  try {
      const response = await api.get('/statistics/today');
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar estatísticas diárias:", error);
      throw error;
  }
};

export const getYearOrdersCount = async () => {
  try {
      const response = await api.get('/statistics/year');
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar estatísticas anuais:", error);
      throw error;
  }
};

export const createPrograming = async (programingData) => {
  try {
      const response = await api.post('/programing', programingData);
      return response.data;
  } catch (error) {
      console.error("Erro ao salvar programação:", error);
      throw error;
  }
};

export const getProgramingById = async (id) => {
  try {
      const response = await api.get(`/programing/${id}`);
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar programação:", error);
      throw error;
  }
};

export const updatePrograming = async (id, programingData) => {
  try {
    const response = await api.put(`/programing/${id}`, programingData);
    return response.data; // Retorna a resposta do backend
  } catch (error) {
    console.error("Erro ao atualizar programação:", error);
    throw error;
  }
};

export const deletePrograming = async (id) => {
  try {
      const response = await api.delete(`/programing/${id}`);
      return response.data; // Retorna a resposta do backend
  } catch (error) {
      console.error("Erro ao excluir programação:", error);
      throw error; // Lança o erro para ser tratado
  }
};

export const uploadFiles = async (files, programingId, type, description) => {
  const formData = new FormData();
  
  // Certifique-se de que 'files' seja um array de objetos com { file, description }
  files.forEach((fileObj) => {
      formData.append("file", fileObj.file); // Envia o arquivo com a chave 'file'
  });

  formData.append("programingId", programingId); // Adiciona o ID da programação
  formData.append("type", type); // Tipo (antes/depois)
  formData.append("description", description); // Descrição

  try {
      const response = await api.post("/uploadFile", formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });
      console.log(`Arquivos ${description} enviados com sucesso:`, response.data);
      return response.data;
  } catch (error) {
      console.error(`Erro ao enviar arquivos ${description}:`, error.response?.data || error.message);
      throw error;
  }
};


export const getAllImages = async (programingId) => {
  try {
      const response = await api.get(`/files`, {
          params: { programingId }, // Adiciona o parâmetro à requisição
      });
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar as imagens:", error);
      throw error;
  }
};

export const updateImage = async (id, payload) => {
  try {
      const response = await api.put(`/file/${id}`, payload);
      return response.data;
  } catch (error) {
      console.error("Erro ao atualizar a imagem:", error);
      throw error;
  }
};

export default api;