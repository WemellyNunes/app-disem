import InputPrimary from "../../inputs/inputPrimary";
import ButtonPrimary from "../../buttons/buttonPrimary";
import MessageBox from "../../box/message";
import { useState, useEffect } from "react";
import { useUser } from "../../../contexts/user";

import { createNegation, getNegationByOrderServiceId, downloadReport } from "../../../utils/api/api";

const NegationSection = ({orderServiceId}) => {
   
    const [formData, setFormData] = useState({
        conteudo: { value: "", required: true },
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState();
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });
    const [emptyFields, setEmptyFields] = useState({});
    const { user } = useUser();

    const fetchNegationData = async () => {
      if (!orderServiceId) return;
    
      try {
        const negation = await getNegationByOrderServiceId(orderServiceId); 
    
        if (negation) {
          setFormData({
            conteudo: { value: negation.content || "", required: true },
          });
          setIsSaved(true); 
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("Nenhuma negação encontrada para a ordem de serviço.");
          setFormData({
            conteudo: { value: "", required: true },
          });
          setIsSaved(false); 
        } else {
          console.error("Erro ao buscar os dados da negação:", error);
        }
      }
    };
    
  
    useEffect(() => {
      if (orderServiceId) {
        fetchNegationData();
      }
    }, [orderServiceId]);
    


    const handleFieldChange = (field) => (value) => {
        setFormData((prevData) => {
          const updatedData = {
            ...prevData,
            [field]: { ...prevData[field], value },
          };
    
          if (updatedData[field].required && value.trim()) {
            setEmptyFields((prevEmptyFields) => {
              const updatedEmptyFields = { ...prevEmptyFields };
              delete updatedEmptyFields[field];
              return updatedEmptyFields;
            });
          }
          return updatedData;
        });
    };
    
      const validateFields = () => {
        const newEmptyFields = {};
        Object.keys(formData).forEach((field) => {
          const { value, required } = formData[field];
          if (required && (!value || value.trim() === "")) {
            newEmptyFields[field] = true;
          }
        });
    
        setEmptyFields(newEmptyFields);
        return Object.keys(newEmptyFields).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) {
          setMessageContent({ type: "error", title: "Erro.", message: "Este campo é obrigatório." });
          setShowMessageBox(true);
          setTimeout(() => setShowMessageBox(false), 1500);
          return;
        }
    
        try {
          setIsSaving(true);
          const negationData = {
            orderService_id: orderServiceId,
            content: formData.conteudo.value,
            date: new Date().toISOString().split("T")[0],
          };
    
          console.log("Negation data:", negationData);
          await createNegation(negationData);
    
          setIsSaved(true);
          setMessageContent({ type: "success", title: "Sucesso.", message: "Negação salva com sucesso!" });
          setShowMessageBox(true);
          setTimeout(() => setShowMessageBox(false), 1500);
        
        } catch (error) {
          setMessageContent({
            type: "error",
            title: "Erro ao negar.",
            message: error.response?.data || "Erro ao negar a ordem de serviço.",
          });
          setShowMessageBox(true);
          setTimeout(() => setShowMessageBox(false), 1500);
          console.error("Erro ao negar:", error);
        } finally {
          setIsSaving(false);
        }
    };

  const handleExportReport = async () => {
    try {
      await downloadReport(orderServiceId)
      setMessageContent({ type: "success", title: "Sucesso.", message: "Relatório baixado com sucesso!" });
    } catch (error) {
      setMessageContent({
        type: "error",
        title: "Erro ao baixar relatório.",
        message: "Não foi possível baixar o relatório. Tente novamente.",
      });
    } finally {
      setShowMessageBox(true);
      setTimeout(() => setShowMessageBox(false), 1500);
    }
  };

    return (
        <div className="flex flex-col bg-white border border-gray-300 rounded-xl mb-2 mt-1.5">
            <div className="px-4 md:px-6 py-4">
              <div className="flex flex-col gap-y-1">
                <h3 className="text-sm md:text-base font-medium text-gray-800">Sem aprovação</h3>
                <p className="text-sm text-primary-dark">Motivo para não realizar o atendimento desta ordem de serviço.</p>
              </div>
                <div className="mt-7">
                    <InputPrimary
                        label="Justificativa *"
                        placeholder="Escrever uma justificativa"
                        value={formData.conteudo.value}
                        onChange={handleFieldChange("conteudo")}
                        disabled={isSaved || isSaving}
                        errorMessage={emptyFields.conteudo ? "Este campo é obrigatório" : ""}
                    />
                </div>
                {isSaved && <p className="mt-2 text-sm text-gray-400">Negado por: {user.name}</p>}
                <div className="flex justify-end mt-4">
                    {!isSaved ? (
                        <ButtonPrimary onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Salvando..." : "Salvar"}
                        </ButtonPrimary>
                    ) : (
                        <ButtonPrimary onClick={handleExportReport} >Exportar Relatório</ButtonPrimary>
                    )}
                </div>
            </div>

            {showMessageBox && (
                <MessageBox
                    type={messageContent.type}
                    title={messageContent.title}
                    message={messageContent.message}
                    onClose={() => setShowMessageBox(false)}
                />
            )}
        </div>
    );
}

export default NegationSection;