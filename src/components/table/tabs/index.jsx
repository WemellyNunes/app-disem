const Tabs = ({ activeTab, setActiveTab }) => {
    
    const tabs = ['Abertas', 'Programadas', 'Resolvidas', 'Finalizadas', 'Negadas'];

    return (
        <nav className="flex w-full bg-white rounded-lg font-normal text-xs md:text-base border-b">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 md:px-8 py-4 hover:bg-gray-100 ${activeTab === tab
                            ? 'border-b-2 border-primary-light bg-blue-50 text-primary-light'
                            : 'text-primary-dark '
                        }`}
                >
                    {tab}
                </button>
            ))}
        </nav>
    );
};

export default Tabs;