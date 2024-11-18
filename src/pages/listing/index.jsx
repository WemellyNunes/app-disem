import TabsAndList from "../../components/table/tabsAndList";
import PageTitle from "../../components/title";
import { FaRegListAlt } from "react-icons/fa";


export default function Listing() {
    return (
        <>
            <div className="flex flex-col w-full">
                 {/* w-full garante que ocupe 100% da largura disponível */}
                 <div className="flex justify-center pb-2">
                    <PageTitle
                        icon={FaRegListAlt}
                        text="Listas "
                        backgroundColor="bg-white"
                        textColor="text-primary-light"
                    />
                </div>

                <div className="flex flex-grow"> {/* flex-grow para ocupar espaço */}
                    <TabsAndList />
                </div>
            </div>
        </>
    );
}
