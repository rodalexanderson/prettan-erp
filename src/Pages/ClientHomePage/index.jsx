import { useEffect, useState} from "react";
import { onSnapshot } from "firebase/firestore";
import { getCollectionRef } from "../../Services/CRUD";
import ClientCard from "../../Components/ClientCard";
import { useNavigate } from "react-router-dom";

const ClientHomePage = ({role}) => {
  const [listaClientes, setListaClientes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const unSubscribe = onSnapshot(getCollectionRef("clientes"), (data) => {
      setListaClientes(
        data.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const filteredClients = listaClientes.filter((client) =>
    client.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-4">Lista de Clientes</h1>
          {/* AGREGAR MOVIMIENTO BTN */}
          <div className="mx-auto flex my-4">
              <button className="font-bold border rounded-md text-md w-48 h-12 bg-yellow-500 mx-auto" onClick={() => navigate('/client')}> Agregar Cliente </button>
          </div>
            
            <div className="w-full flex justify-center items-center mt-4">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border rounded-md h-10 px-4"
              />
            </div>
            {/* RESULTADOS */}
            <div className="flex sm:flex-row flex-col min-h-80 pt-8">
                <div className="w-full min-h-36">
                <div className='flex sm:flex-row w-full text-center pr-12 border'>
                <p className='font-bold w-1/2 sm:m-2 sm:mx-4 sm:w-1/5'>Nombre del cliente</p>
                <p className='font-bold w-1/2 sm:m-2 sm:mx-4 sm:w-1/5 '>Direccion</p>
                <p className='font-bold invisible w-0 sm:visible sm:m-2 sm:mx-4 sm:w-1/5 '>Telefono</p>
                <p className='font-bold invisible w-0 sm:visible sm:m-2 sm:mx-4 sm:w-6 text-sm '>Propia Marca</p>
                <p className='font-bold invisible w-0 sm:visible sm:m-2 sm:mx-4 sm:w-6 text-sm '>Factura</p>
                <p className='font-bold invisible w-0 sm:visible sm:m-2 sm:mx-4 sm:w-1/5'>Notas</p>
            </div>
                  <div className="w-full">
                  {filteredClients.map((filteredClient) => (
                    <ClientCard key={filteredClient.id} data={filteredClient} role={role} />
                  ))}
                  </div>
                </div>
            </div>
      </div>
    )
  }
  
  export default ClientHomePage