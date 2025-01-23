import SectionCard from "../sectionPrimary";
import Circle from "../../table/circle";

export default function OrderServiceDetails({ orderServiceData, user }) {
    return (
        <SectionCard
            background="bg-gray-50"
            title="Ordem de serviço"
            placeholder="Informações cadastradas da ordem de serviço."
        >
            <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4 text-sm text-gray-500 mb-8">
                <div className="flex flex-row items-center gap-x-2">
                    <p className="font-medium">Solicitante:</p>
                    <p className="uppercase">{orderServiceData.requester}</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                    <p className="font-medium">Contato:</p>
                    <p className="uppercase">{orderServiceData.contact}</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                    <p className="font-medium">Unidade do solicitante:</p>
                    <p className="uppercase">{orderServiceData.unit}</p>
                </div>
                <div className="flex items-center gap-x-2 flex-wrap">
                    <p className="font-medium">Descrição:</p>
                    <p className="uppercase">{orderServiceData.preparationObject}</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                    <p className="font-medium">Tipo de manutenção:</p>
                    <p>{orderServiceData.typeMaintenance}</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                    <p className="font-medium">Sistema:</p>
                    <p className="uppercase">{orderServiceData.system}</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                    <p className="font-medium">Unidade da manutenção:</p>
                    <p className="uppercase">{orderServiceData.maintenanceUnit}</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                    <p className="mr-1 font-medium">Campus:</p>
                    <p className="uppercase">{orderServiceData.campus}</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                    <p className="font-medium">Tratamento:</p>
                    <p className="uppercase">{orderServiceData.typeTreatment}</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                    <p className="font-medium">Clasificação:</p>
                    <p className="uppercase">{orderServiceData.classification}</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                    <p className="mr-1 font-medium">Data do cadastro:</p>
                    <p>{orderServiceData.date}</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                    <p className="mr-1 font-medium">Dias em aberto:</p>
                    <p>{orderServiceData.openDays}</p>
                </div>
            </div>

            <p className="mt-2 text-sm text-gray-400">Cadastrado por: {user.name}</p>
        </SectionCard>
    );
}