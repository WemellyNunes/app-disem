import axios from 'axios';

const api = axios.create({
  baseURL: 'http://18.230.17.37:8080/api',
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

    const order = await getOrderById(id);
    const status = order.status;

    let fileName = `relatorio_os_${id}.pdf`;
    if (status === 'Em atendimento') {
      fileName = `programacao_os_${id}.pdf`;
    }

    const response = await api.get(`/${id}/report`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
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
      JSON.stringify(statusDescricao),
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

export const updateOpenDays = async (orderServiceId) => {
  try {
    const response = await api.put(`/serviceOrder/${orderServiceId}/openDays`);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar os dias em aberto:", error);
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

export const getDocumentsByOrderServiceId = async (orderServiceId) => {
  try {
      const response = await api.get(`/documents`, {
          params: { orderServiceId }
      });
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      throw error;
  }
};


export const getClassStatistics = async (year, month) => {
  try {
    const response = await api.get('/statistics/classification', {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas de classificação:", error);
    throw error;
  }
};

export const getTypeMaintenanceStatistics = async (year, month) => {
  try {
    const response = await api.get('/statistics/typeMaintenance', {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas de tipo de manutenção:", error);
    throw error;
  }
};

export const getOrdersBySystemStatistics = async (year) => {
  try {
    const response = await api.get('/statistics/system', {
      params: {year},
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas de ordens por sistema:", error);
    throw error;
  }
};

export const getOrdersByCampus = async (year) => {
  try {
    const response = await api.get('/statistics/campus', {
      params: { year },
    }); 
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

export const getMonthOrdersCount = async (year, month) => {
  try {
    const response = await api.get('/statistics/month', {
      params: {year, month}
    });
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

export const deleteImage = async (id) => {
  try {
      const response = await api.delete(`/file/${id}`);
      return response.data;
  } catch (error) {
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

export const createFinished = async (finalizeData) => {
  try {
    const response = await api.post("/finish", finalizeData);
    return response.data;
  } catch (error) {
    console.error("Erro ao finalizar a ordem de serviço:", error.response?.data || error.message);
    throw error;
  }
};

export const createNegation = async (negationData) => {
  try {
    const response = await api.post("/negation", negationData);
    return response.data;
  } catch (error) {
    console.error("Erro ao negar a OS: ", error.response?.data || error.message);
    throw error;
  }
}

export const getOneFinished = async (id) => {
  try {
    const response = await api.get(`finished/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao encontrar a finalização", error);
    throw error;
  }
};

export const getFinalizationByProgramingId = async (programingId) => {
  try {
    const response = await api.get(`finished/byPrograming/${programingId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar finalização pelo ID da programação", error);
    throw error;
  }
};

export const createNote = async (note) => {
  try {
    const response = await api.post(`/note`, note);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar relato:", error);
    throw new Error("Não foi possível criar o relato.");
  }
};

export const getNotesByProgramingId = async (programingId) => {
  try {
    const response = await api.get(`/note/byPrograming/${programingId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatos:", error);
    throw new Error("Não foi possível buscar os relatos.");
  }
};

export const getNegationByOrderServiceId = async (orderServiceId) => {
  try {
    const response = await api.get(`/negation/byOrderService/${orderServiceId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar negações por ID da ordem de serviço:", error.response?.data || error.message);
    throw error;
  }
};

export const getHistoryByOrderId = async (orderId) => {
  try {
    const response = await api.get(`/${orderId}/history`); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar o histórico da OS:", error);
    throw error;
  }
};

export const createTeam = async (teamData) => {
  try {
    const response = await api.post('/teams', teamData); // Faz o POST para o endpoint /teams
    return response.data; // Retorna os dados da equipe salva
  } catch (error) {
    console.error("Erro ao salvar equipe:", error); // Log de erro no console
    throw error; // Lança o erro para ser tratado
  }
};

export const getAllTeams = async () => {
  try {
      const response = await api.get('/teams');
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
      throw error;
  }
};

export const deleteTeam = async (id) => {
  try {
      const response = await api.delete(`/team/${id}`); // Endpoint de exclusão
      return response.data;
  } catch (error) {
      console.error("Erro ao excluir profissional:", error);
      throw error;
  }
};

export const updateTeam = async (id, teamData) => {
  try {
      const response = await api.put(`/team/${id}`, teamData);
      return response.data;
  } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
      throw error;
  }
};

export const uploadTeams = async (formData) => {
  try {
      const response = await api.post("/teams/upload", formData, {
          headers: {
              'Content-Type': 'application/json',
          },
      });
      return response.data; // Retorna os dados da resposta
  } catch (error) {
      throw new Error(error.response?.data || "Erro ao enviar planilha.");
  };

};

export const createInstitute = async (instituteData) => {
  try {
    const response = await api.post('/institute', instituteData); 
    return response.data;

  } catch (error) {
    console.error("Erro ao salvar equipe:", error); 
    throw error; 
  }
};

export const updateInstitute = async (id, instituteData) => {
  try {
      const response = await api.put(`/institute/${id}`, instituteData);
      return response.data;
  } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
      throw error;
  }
};

export const getAllInstitutes = async () => {
  try {
      const response = await api.get('/institutes');
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar os institutos:", error);
      throw error;
  }
};

export const deleteInstitute = async (id) => {
  try {
      const response = await api.delete(`/institute/${id}`); // Endpoint de exclusão
      return response.data;
  } catch (error) {
      console.error("Erro ao excluir a instituição:", error);
      throw error;
  }
};

export const deleteUnit = async (id) => {
  try {
      const response = await api.delete(`/unit/${id}`); // Endpoint de exclusão
      return response.data;
  } catch (error) {
      console.error("Erro ao excluir a unidade:", error);
      throw error;
  }
};

export const getAllUnits = async () => {
  try {
      const response = await api.get('/units');
      return response.data;
  } catch (error) {
      console.error("Erro ao buscar as unidades:", error);
      throw error;
  }
};

export const createUnit = async (uniData) => {
  try {
    const response = await api.post('/unit', uniData); 
    return response.data;

  } catch (error) {
    console.error("Erro ao salvar equipe:", error); 
    throw error; 
  }
};

export const updateUnit = async (id, uniData) => {
  try {
      const response = await api.put(`/unit/${id}`, uniData);
      return response.data;
  } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
      throw error;
  }
};



export default api;