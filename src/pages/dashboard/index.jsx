import StatCard from "../../components/cards"
import PageTitle from "../../components/title"
import { MdStackedBarChart } from "react-icons/md";
import BarGraphic from "../../components/graphics/barPrimary"
import LocationBarChart from "../../components/graphics/barSecondary";
import DoughnutChart from "../../components/graphics/doughnutPrimary";
import DoughnutSystem from "../../components/graphics/doughnutSecondary";
import Card from "../../components/cards/cardGraphic";
import { useState, useEffect } from "react";

import { getSipacOrdersCount, getMonthOrdersCount, getWeekOrdersCount, getTodayOrdersCount, getYearOrdersCount } from "../../utils/api/api";

export default function Dashboard() {
    const [stats, setStats] = useState({
        sipac: { approved: 0, finalized: 0 },
        monthly: { approved: 0, finalized: 0 },
        weekly: { approved: 0, finalized: 0 },
        today: { approved: 0, finalized: 0 },
        yearly: { approved: 0, finalized: 0 },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch SIPAC data
                const sipacData = await getSipacOrdersCount();
                const sipacApproved = sipacData['A_ATENDER'] || 0;
                const sipacFinalized = sipacData['FINALIZADO'] || 0;

                // Calcular a porcentagem
                const sipacTotal = sipacApproved + sipacFinalized;
                const sipacPercentage = sipacTotal > 0 ? Math.round((sipacFinalized / sipacTotal) * 100) : 0;

                // Fetch Monthly data
                const monthlyData = await getMonthOrdersCount();
                const monthlyApproved = monthlyData['A_ATENDER'] || 0;
                const monthlyFinalized = monthlyData['FINALIZADO'] || 0;

                // Fetch Weekly data
                const weeklyData = await getWeekOrdersCount();
                const weeklyApproved = weeklyData['A_ATENDER'] || 0;
                const weeklyFinalized = weeklyData['FINALIZADO'] || 0;

                // Fetch Today's data
                const todayData = await getTodayOrdersCount();
                const todayApproved = todayData['A_ATENDER'] || 0;
                const todayFinalized = todayData['FINALIZADO'] || 0;

                // Fetch Yearly data
                const yearlyData = await getYearOrdersCount();
                const yearlyApproved = yearlyData['A_ATENDER'] || 0;
                const yearlyFinalized = yearlyData['FINALIZADO'] || 0;

                // Update state with fetched data
                setStats({
                    sipac: { approved: sipacApproved, finalized: sipacFinalized },
                    monthly: { approved: monthlyApproved, finalized: monthlyFinalized },
                    weekly: { approved: weeklyApproved, finalized: weeklyFinalized },
                    today: { approved: todayApproved, finalized: todayFinalized },
                    yearly: { approved: yearlyApproved, finalized: yearlyFinalized },
                });
            } catch (error) {
                console.error("Erro ao buscar dados estatísticos:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="flex flex-col">

                <div className="flex justify-center">
                    <PageTitle
                        icon={MdStackedBarChart}
                        text="Visão geral"
                        backgroundColor="bg-white"
                        textColor="text-primary-dark"
                    />
                </div>
                <div className="px-6">
                    <div className="flex flex-row justify-between mt-2 gap-x-1 overflow-x-auto">
                        <StatCard
                            title="Sipac"
                            approved={stats.sipac.approved}
                            finalized={stats.sipac.finalized}
                            backgroundColor="bg-primary-light"
                            percentage={stats.sipac.percentage}
                            hover="hover:bg-primary-hover"
                        />

                        <StatCard
                            title="Mensal"
                            approved={stats.monthly.approved}
                            finalized={stats.monthly.finalized}
                            backgroundColor="bg-secondary-light"
                            hover="hover:bg-primary-hover"
                        />

                        <StatCard
                            title="Semanal"
                            approved={stats.weekly.approved}
                            finalized={stats.weekly.finalized}
                            backgroundColor="bg-tertiary-light"
                            hover="hover:bg-primary-hover"
                        />

                        <StatCard
                            title="Hoje"
                            approved={stats.today.approved}
                            finalized={stats.today.finalized}
                            backgroundColor="bg-secondary-light"
                            hover="hover:bg-primary-hover"
                        />

                        <StatCard
                            title="Anual"
                            approved={stats.yearly.approved}
                            finalized={stats.yearly.finalized}
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


            </div>

        </>
    )
};