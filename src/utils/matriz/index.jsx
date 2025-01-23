const pesosClasse = {
    A: 3,
    B: 2,
    C: 1,
};

const pesosRisco = {
    sustentabilidade: 1,
    estetica: 2,
    confortoUsuario: 3,
    danosMaiores: 4,
    despesas: 5,
    retrofit: 6,
    residuos: 7,
    instalacoes: 8,
    equipamentosCaros: 9,
    qualidadeAr: 10,
    recursosHidrico: 11,
    corteEnergia: 12,
    normasSeguranca: 13,
    acessibilidade: 14,
    sistemasIncendio: 15,
    integridadeEstrutural: 16,
    riscoAcidentes: 17,
};

export const calcularValorRisco = (classe, indiceRisco) => {
    const pesoClasse = pesosClasse[classe] || 0;
    const pesoIndice = pesosRisco[indiceRisco] || 0; 

    const valorRisco = pesoClasse * pesoIndice;

    return valorRisco;
};

export const calcularPrioridade = (valorRisco) => {
    if (valorRisco >= 45){
        return 'Execução Imediata';
    }
    if (valorRisco >= 35) {
        return 'Execução em até 7 dias';
    } 
    if (valorRisco >= 25) {
        return 'Execução em até 15 dias';
    } 
    return 'Execução em até 30 dias';
};
