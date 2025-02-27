import { useState, useEffect } from "react";
import ButtonPrimary from "../../buttons/buttonPrimary";
import MessageBox from "../../box/message";
import InputPrimary from "../../inputs/inputPrimary";
import { useUser } from "../../../contexts/user";

import { createFinished, updateOrderServiceStatus, getFinalizationByProgramingId, downloadReport } from "../../../utils/api/api";

const FinalizeSection = ({ orderServiceData, onFinalize, isFinalized }) => {
  const [isSaved, setIsSaved] = useState(isFinalized);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false); 
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });
  const [emptyFields, setEmptyFields] = useState({});
  const { user } = useUser();

  const [formData, setFormData] = useState({
    observation: { value: "", required: true },
  });

  const programingId = orderServiceData?.programingId || null;

  const fetchFinalizationData = async () => {
    if (!programingId) return;
    try {
      const response = await getFinalizationByProgramingId(programingId);

      setTimeout(() => {
        if (response && response.length > 0) {
          const latestContent = response[response.length - 1].content;
          setFormData((prevData) => ({
            ...prevData,
            observation: { ...prevData.observation, value: latestContent },
          }));
          setIsSaved(true);
        }
        setIsLoading(false);
      }, 1000)
    } catch (error) {
      console.error("Erro ao buscar a finalização:", error);
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
      setIsExporting(true);
      await downloadReport(orderServiceData.id);
      setMessageContent({ type: "success", title: "Sucesso.", message: "Relatório baixado com sucesso!" });
    } catch (error) {
      setMessageContent({
        type: "error",
        title: "Erro ao baixar relatório.",
        message: "Não foi possível baixar o relatório. Tente novamente.",
      });
    } finally {
      setIsExporting(false);
      setShowMessageBox(true);
      setTimeout(() => setShowMessageBox(false), 1000);
    }
  };

  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-xl mb-4 mt-1.5">
      <div className="px-4 md:px-6 py-4">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-sm md:text-base font-medium text-gray-800">Finalização</h3>
          <p className="text-sm text-primary-dark">Observação sobre a manutenção realizada para conclusão da ordem de serviço.</p>
        </div>
        {isLoading ? (
          <div className="animate-pulse flex flex-col space-y-3 mt-7">
            <div className="h-10 bg-gray-100 rounded-xl"></div>
            <div className="h-10 bg-gray-100 rounded-xl"></div>
          </div>
        ) : (
          <>
            <div className="mt-7">
              <InputPrimary
                label="Observação final *"
                placeholder="Escrever uma observação"
                value={formData.observation.value.toUpperCase()}
                onChange={handleFieldChange("observation")}
                disabled={isSaved || isSaving}
                errorMessage={emptyFields.observation ? "Este campo é obrigatório" : ""}
              />
            </div>
            {isSaved && <p className="mt-2 text-sm text-gray-400">Finalizado por: {user.name}</p>}
          </>
        )}
        <div className="flex justify-end mt-4">
          {!isSaved ? (
            <ButtonPrimary onClick={handleSave} loading={isSaving}>
              salvar
            </ButtonPrimary>
          ) : (
            <ButtonPrimary onClick={handleExportReport} loading={isExporting}>Exportar Relatório</ButtonPrimary>
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
