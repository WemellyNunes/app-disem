import { BiError } from "react-icons/bi";

export default function ServiceError() {

    return(
        <>
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center mt-20">
                <BiError className="h-8 w-8 pb-1"/>
                <h2 className="font-medium text-3xl">503</h2>
                <h3 className="text-lg">Serviço insdiponivel</h3>
            </div>

        </div>
        </>
    )
};