const PageTitle = ({ icon: Icon, text, backgroundColor, textColor, children}) => {
    return (
      <div className={`w-full ${backgroundColor} ${textColor} flex items-center px-6 h-8 md:h-10 border-b border-gray-30`}>
        <Icon className="h-4 w-4  mr-2" />
        <h1 className="text-sm md:text-base font-medium">{text}</h1>
        <div className="ml-auto">{children}</div>
      </div>
    );
  };

  export default PageTitle;


  /*
    COMO USAR:

    <div className="flex w-full justify-center px-4">
          <PageTitle
            icon={FaCalendarAlt}
            text="Programação de Ordem de Serviço" />
     </div>
  */