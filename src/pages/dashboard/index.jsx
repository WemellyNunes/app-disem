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

    useEffect(() => {
        document.body.classList.add("bg-dashboard-page");

        return () => {
            document.body.classList.remove("bg-dashboard-page");
        };
    }, []);

    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        sipac: { approved: 0, finalized: 0 },
        monthly: { approved: 0, finalized: 0 },
        weekly: { approved: 0, finalized: 0 },
        today: { approved: 0, finalized: 0 },
        yearly: { approved: 0, finalized: 0 },
    });

    const [selectedYear, setSelectedYear] = useState(currentYear); 
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const years = [2022, 2023, 2024, 2025]; 
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
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(selectedYear, selectedMonth);
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
                <div className="flex gap-x-2 bg-white md:gap-x-4 mx-2 md:mx-6 items-center justify-center md:justify-between py-1 md:px-6 shadow rounded-md mt-2">
                    <div>
                        <p className="hidden md:flex text-gray-700 text-sm">Dados das Ordem de Serviços no sitema</p>
                    </div>
                    <div className="flex gap-x-2 md:gap-x-4 items-center ">
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
                </div>
                <div className="px-2 md:px-6">
                    <div className="flex flex-row justify-between mt-3 gap-x-2 md:gap-x-4 overflow-x-auto">
                        <StatCard
                            title="Sipac"
                            approved={stats.sipac.approved}
                            finalized={stats.sipac.finalized}
                            borderColor="border-r-blue-500"
                            percentage={stats.sipac.percentage}
                        />

                        <StatCard
                            title="Mensal"
                            approved={stats.monthly.approved}
                            finalized={stats.monthly.finalized}
                            borderColor="border-r-purple-500"
                        />

                        <StatCard
                            title="Semanal"
                            approved={stats.weekly.approved}
                            finalized={stats.weekly.finalized}
                            borderColor="border-r-red-500"
                        />

                        <StatCard
                            title="Hoje"
                            approved={stats.today.approved}
                            finalized={stats.today.finalized}
                            borderColor="border-r-orange-500"
                        />

                        <StatCard
                            title="Anual"
                            approved={stats.yearly.approved}
                            finalized={stats.yearly.finalized}
                            borderColor="border-r-yellow-500"
                        />
                    </div>
                    <div className="flex flex-col mb-2">
                        <div className="flex flex-col gap-x-4 sm:flex-row">
                            <Card>
                                <BarGraphic year={selectedYear} month={selectedMonth} />
                            </Card>
                            <Card >
                                <DoughnutChart year={selectedYear} month={selectedMonth} />
                            </Card>
                        </div>
                        <div className="flex flex-col gap-x-4 sm:flex-row">
                            <Card>
                                <LocationBarChart year={selectedYear} />
                            </Card>
                            <Card>
                                <DoughnutSystem year={selectedYear}/>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};