import { useState } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import UploadModal from '../../modal/upload';
import PreviewFile from '../../modal/preview';

const InputUpload = ({ label, disabled, onFilesUpload }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null); // Para armazenar o arquivo para pré-visualização
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUpload = (files, description) => {
      const newFiles = files.map(file => ({ file, description }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileToRemove) => {
      setUploadedFiles(prevFiles => prevFiles.filter(item => item.file.name !== fileToRemove.name));
  };

  const handlePreviewFile = (file) => {
      setPreviewFile(file);
      setShowPreview(true); // Abre a pré-visualização
  };

  return (
      <div className="flex flex-col mb-4">
          <label 
              className={`flex items-center border border-dashed 
              ${disabled ? 'bg-gray-100 border-gray-300 text-gray-400' : 'border-primary-light hover:bg-blue-50'} 
              rounded-md p-4 cursor-pointer w-full md:w-2/4 
              h-9 md:h-10 transition-colors duration-200`}
              onClick={() => !disabled && setShowModal(true)} // Abre o modal ao clicar
          >
              <FaUpload className={`h-4 w-4 mr-3 ${disabled ? 'text-gray-400' : 'text-primary-light'}`} />
              <span className={`text-xs md:text-sm italic font-normal ${disabled ? 'text-gray-400' : 'text-primary-light'}`}>
                  {label}
              </span>
          </label>

          {/* Exibe os arquivos carregados */}
          {uploadedFiles.length > 0 && (
              <div className="w-full md:w-2/4">
                  {uploadedFiles.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border border-gray-200 rounded-md p-1.5 mt-1">
                          <div className="flex flex-col">
                              <span className="text-sm font-light text-primary-light">{item.file.name}</span>
                              <span className="text-xs text-gray-500">{(item.file.size / 1024).toFixed(2)} KB</span>
                              <span className="text-xs text-gray-500">Descrição: {item.description}</span>
                          </div>
                          <div className="flex">
                              <button onClick={() => handlePreviewFile(item.file)} className="text-blue-500 mr-2">Visualizar</button>
                              <button onClick={() => handleRemoveFile(item.file)} className="text-red-500">
                                  <FaTrash />
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {/* Modal para upload de arquivos */}
          <UploadModal 
              isOpen={showModal} 
              onClose={() => setShowModal(false)} 
              onUpload={handleUpload}
          />

          {/* Modal de pré-visualização */}
          {showPreview && (
              <PreviewFile
                  file={previewFile} 
                  onClose={() => setShowPreview(false)} 
              />
          )}
      </div>
  );
};

export default InputUpload;