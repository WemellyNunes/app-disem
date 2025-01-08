import * as XLSX from 'xlsx';

export const parseExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const formattedData = jsonData.map((row) => ({
                    name: row['Nome'],  // Coluna na planilha
                    role: row['Cargo'], // Cargo na planilha
                    status: row['Status'] // Status na planilha
                }));
                resolve(formattedData);
            } catch (error) {
                reject('Erro ao processar a planilha.');
            }
        };
        reader.readAsArrayBuffer(file);
    });
};
