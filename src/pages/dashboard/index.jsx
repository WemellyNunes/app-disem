import StatCard from "../../components/cards"
import PageTitle from "../../components/title"
import { MdStackedBarChart } from "react-icons/md";
import BarGraphic from "../../components/graphics/barPrimary"
import LocationBarChart from "../../components/graphics/barSecondary";
import DoughnutChart from "../../components/graphics/doughnutPrimary";
import DoughnutSystem from "../../components/graphics/doughnutSecondary";
import Card from "../../components/cards/cardGraphic";

export default function Dashboard() {
    return (
        <>
            <div className="flex flex-col">

                <div className="flex justify-center">
                    <PageTitle
                        icon={MdStackedBarChart}
                        text="Visão geral"
                        backgroundColor="bg-white"
                        textColor="text-primary-light"
                    />
                </div>

                <div className="flex flex-row justify-between mt-2 gap-x-1 overflow-x-auto">
                    <StatCard
                        title="Sipac"
                        approved={13}
                        finalized={6}
                        backgroundColor="bg-primary-light"
                        percentage={65}
                        hover="hover:bg-primary-hover"
                    />

                    <StatCard
                        title="Mensal"
                        approved={13}
                        finalized={6}
                        backgroundColor="bg-secondary-light"
                        hover="hover:bg-primary-hover"
                    />

                    <StatCard
                        title="Semanal"
                        approved={13}
                        finalized={6}
                        backgroundColor="bg-tertiary-light"
                        hover="hover:bg-primary-hover"
                    />

                    <StatCard
                        title="Hoje"
                        approved={13}
                        finalized={6}
                        backgroundColor="bg-secondary-light"
                        hover="hover:bg-primary-hover"
                    />

                    <StatCard
                        title="Anual"
                        approved={13}
                        finalized={6}
                        backgroundColor="bg-primary-light"
                        hover="hover:bg-primary-hover"
                    />
                </div>
                <div className="flex flex-col  mb-2">
                    <div className="flex flex-col gap-x-1.5 sm:flex-row">
                        <Card>
                            <BarGraphic/>
                        </Card>
                        <Card>
                            <DoughnutChart/>
                        </Card>
                    </div>
                    <div className="flex flex-col gap-x-1.5 sm:flex-row">
                        <Card>
                            <LocationBarChart/>
                        </Card>
                        <Card>
                            <DoughnutSystem/>
                        </Card>
                    </div>

                </div>

            </div>

        </>
    )
};