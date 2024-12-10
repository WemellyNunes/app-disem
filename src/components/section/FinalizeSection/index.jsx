import { useState, useEffect } from "react";
import ButtonPrimary from "../../buttons/buttonPrimary";
import MessageBox from "../../box/message";
import InputPrimary from "../../inputs/inputPrimary";
import { useUser } from "../../../contexts/user";

import { createFinished, updateOrderServiceStatus, getFinalizationByProgramingId, downloadReport } from "../../../utils/api/api";

const FinalizeSection = ({ orderServiceData, onFinalize, isFinalized }) => {
  const [isSaved, setIsSaved] = useState(isFinalized);
  const [isSaving, setIsSaving] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });
  const [emptyFields, setEmptyFields] = useState({});
  const { user } = useUser();

  const [formData, setFormData] = useState({
    observation: { value: "", required: true },
  });

  const programingId = orderServiceData?.programingId || null;

  // Fetch observação salva
  const fetchFinalizationData = async () => {
    if (!programingId) return;
    try {
      const response = await getFinalizationByProgramingId(programingId);
      console.log("Resposta do endpoint:", response); // Verifique a estrutura da resposta

      if (response && response.length > 0) {
        // Use a última observação ou concatene todas, dependendo da lógica
        const latestContent = response[response.length - 1].content;
        setFormData((prevData) => ({
          ...prevData,
          observation: { ...prevData.observation, value: latestContent },
        }));
        setIsSaved(true);
      } else {
        console.warn("Nenhuma observação encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar a finalização:", error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchFinalizationData();
  }, [programingId]);

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
      setTimeout(() => setShowMessageBox(false), 1000);
      return;
    }

    try {
      setIsSaving(true);
      const finalizeData = {
        programing_id: programingId,
        content: formData.observation.value,
        dateContent: new Date().toISOString().split("T")[0],
      };

      await updateOrderServiceStatus(orderServiceData.id, "Finalizado");
      await createFinished(finalizeData);

      setIsSaved(true);
      setMessageContent({ type: "success", title: "Sucesso.", message: "Finalizado com sucesso!" });
      setShowMessageBox(true);
      setTimeout(() => setShowMessageBox(false), 1000);
      onFinalize(formData.observation.value);
    } catch (error) {
      setMessageContent({
        type: "error",
        title: "Erro ao finalizar.",
        message: error.response?.data || "Erro ao finalizar a ordem de serviço.",
      });
      setShowMessageBox(true);
      setTimeout(() => setShowMessageBox(false), 1000);
      console.error("Erro ao finalizar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportReport = async () => {
    try {
      await downloadReport(orderServiceData.id);
      setMessageContent({ type: "success", title: "Sucesso.", message: "Relatório baixado com sucesso!" });
    } catch (error) {
      setMessageContent({
        type: "error",
        title: "Erro ao baixar relatório.",
        message: "Não foi possível baixar o relatório. Tente novamente.",
      });
    } finally {
      setShowMessageBox(true);
      setTimeout(() => setShowMessageBox(false), 1000);
    }
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded mb-2 mt-2 shadow">
      <div className="px-4 md:px-6 py-4">
        <h3 className="text-sm font-medium text-primary-light">Finalização da OS</h3>
        <div className="mt-4">
          <InputPrimary
            label="Observação final *"
            placeholder="Escreva uma observação para finalizar a ordem de serviço"
            value={formData.observation.value}
            onChange={handleFieldChange("observation")}
            disabled={isSaved || isSaving}
            errorMessage={emptyFields.observation ? "Este campo é obrigatório" : ""}
          />
        </div>
        {isSaved && <p className="mt-2 text-sm text-gray-400">Finalizado por: {user.name}</p>}
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
};

export default FinalizeSection;
