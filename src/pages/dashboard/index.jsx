import StatCard from "../../components/cards"
import PageTitle from "../../components/title"
import { MdStackedBarChart } from "react-icons/md";
import BarGraphic from "../../components/graphics/barPrimary"
import LocationBarChart from "../../components/graphics/barSecondary";
import DoughnutChart from "../../components/graphics/doughnutPrimary";
import DoughnutSystem from "../../components/graphics/doughnutSecondary";
import Card from "../../components/cards/cardGraphic";
import { useState, useEffect } from "react";
import PeriodSelect from "../../components/inputs/periodSelect";

import { getSipacOrdersCount, getMonthOrdersCount, getWeekOrdersCount, getTodayOrdersCount, getYearOrdersCount } from "../../utils/api/api";

export default function Dashboard() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const [stats, setStats] = useState({
        sipac: { approved: 0, finalized: 0 },
        monthly: { approved: 0, finalized: 0 },
        weekly: { approved: 0, finalized: 0 },
        today: { approved: 0, finalized: 0 },
        yearly: { approved: 0, finalized: 0 },
    });

    const [selectedYear, setSelectedYear] = useState(currentYear); // Estado do ano selecionado
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const years = [2022, 2023, 2024, 2025]; // Lista de anos
    const months = [
        { name: "Janeiro", value: 1 },
        { name: "Fevereiro", value: 2 },
        { name: "Março", value: 3 },
        { name: "Abril", value: 4 },
        { name: "Maio", value: 5 },
        { name: "Junho", value: 6 },
        { name: "Julho", value: 7 },
        { name: "Agosto", value: 8 },
        { name: "Setembro", value: 9 },
        { name: "Outubro", value: 10 },
        { name: "Novembro", value: 11 },
        { name: "Dezembro", value: 12 },
    ];

    const fetchData = async (year, month) => {
        try {
            const sipacData = await getSipacOrdersCount();
            const monthlyData = await getMonthOrdersCount(year, month);
            const weeklyData = await getWeekOrdersCount();
            const todayData = await getTodayOrdersCount();
            const yearlyData = await getYearOrdersCount(year); 

            setStats({
                sipac: { approved: sipacData["A_ATENDER"] || 0, finalized: sipacData["FINALIZADO"] || 0 },
                monthly: { approved: monthlyData["A_ATENDER"] || 0, finalized: monthlyData["FINALIZADO"] || 0 },
                weekly: { approved: weeklyData["A_ATENDER"] || 0, finalized: weeklyData["FINALIZADO"] || 0 },
                today: { approved: todayData["A_ATENDER"] || 0, finalized: todayData["FINALIZADO"] || 0 },
                yearly: { approved: yearlyData["A_ATENDER"] || 0, finalized: yearlyData["FINALIZADO"] || 0 },
            });
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    useEffect(() => {
        fetchData(selectedYear, selectedMonth); // Executa a função com os valores selecionados
    }, [selectedYear, selectedMonth]);

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
                <div className="flex gap-x-2 md:gap-x-4 items-center justify-center md:justify-end py-1 md:px-6 border-b">
                    <p className="hidden md:flex text-xs text-gray-500" >Comparar periodos</p>
                    <PeriodSelect
                        type='ano'
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        options={years}
                    />
                    <PeriodSelect
                        type='mês'
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        options={months}
                />
                </div>
                <div className="px-2 md:px-6">
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
                                <BarGraphic />
                            </Card>
                            <Card>
                                <DoughnutChart />
                            </Card>
                        </div>
                        <div className="flex flex-col gap-x-1.5 sm:flex-row">
                            <Card>
                                <LocationBarChart />
                            </Card>
                            <Card>
                                <DoughnutSystem />
                            </Card>
                        </div>

                    </div>

                </div>


            </div>

        </>
    )
};