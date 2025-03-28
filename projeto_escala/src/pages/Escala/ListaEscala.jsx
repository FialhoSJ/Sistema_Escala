const ListaEscala = ({ escalas }) => {
    return (
      <div className="p-4">
        {Object.entries(escalas).map(([local, semanas]) => (
          <div key={local} className="mb-4">
            <h2 className="text-xl font-bold">{local}</h2>
            {Object.entries(semanas).map(([semana, servidores]) => (
              <div key={semana} className="ml-4">
                <h3 className="text-lg font-semibold">{semana}</h3>
                <ul className="list-disc list-inside">
                  {servidores.length > 0 ? (
                    servidores.map((servidor, index) => (
                      <li key={index}>{servidor}</li>
                    ))
                  ) : (
                    <li className="text-gray-500">Nenhum servidor escalado</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  export default ListaEscala;
  