const Tabs = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex w-full bg-white font-normal text-xs md:text-sm border-b border-gray-300">
            {tabs.map((tab, index) => (
                <button
                    key={index}
                    className={`px-3 md:px-8 py-4 hover:bg-gray-100 ${
                        activeTab === index
                            ? "border-b-2 border-primary-light font-bold text-primary-light"
                            : "text-primary-dark hover:bg-gray-100"
                    }`}
                    onClick={() => onTabChange(index)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;