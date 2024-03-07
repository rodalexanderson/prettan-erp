import { useState, useEffect, useContext} from "react"
import { onSnapshot } from "firebase/firestore"
import { getCollectionRef } from "../../Services/CRUD"
import { userContext } from "../../context/userProvider"
import { addData, getData, getDataById, updateData } from "../../Services/CRUD"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

const getNextConsecutiveNumber = async () => {
  const currentYear = new Date().getFullYear();
  const tickets = await getData("tickets");

  const currentYearIncomeTickets = tickets.filter(
    (ticket) =>
      ticket.timestamp && new Date(ticket.timestamp).getFullYear() === currentYear && ticket.type === 'income'
  );

  let maxNumber = 0;

  if (currentYearIncomeTickets.length > 0) {
    maxNumber = currentYearIncomeTickets.reduce((max, ticket) => {
      if (ticket.ticketNumber && ticket.ticketNumber.startsWith(`PAGO${currentYear}`)) {
        const ticketNumber = parseInt(ticket.ticketNumber.substring(10), 10);
        return ticketNumber > max ? ticketNumber : max;
      }
      return max;
    }, 0);
  }

  const nextNumber = maxNumber + 1;
  const formattedNumber = nextNumber.toString().padStart(3, "0");
  const ticketID = `PAGO${currentYear}${formattedNumber}`;

  return ticketID;
};

  
  const IncomePage = ({ editMode }) => {
    const user = useContext(userContext);
    const navigate = useNavigate();
    const { id } = useParams();
  
    const [formData, setFormData] = useState({
      timestamp: new Date().toISOString(),
      ticketNumber: '',
      date: new Date().toISOString().split('T')[0],
      clientName: '',
      amount: '',
      paymentMethod: '', // Nuevo campo para el método de pago
      depositDate: '', // Nuevo campo para la fecha de depósito
    });

    const [listaClientes, setListaClientes] = useState([]);
    
      // Cambios en useEffect para obtener el próximo ticket o pago según el tipo
      useEffect(() => {
        const fetchNextTicketOrPaymentID = async () => {
          const type = 'income'; // Ajustar siempre el tipo como 'income' en este componente
          const nextID = await getNextConsecutiveNumber(type);
          setFormData((prevState) => ({ ...prevState, ticketNumber: nextID }));
        };
    
        fetchNextTicketOrPaymentID();
      }, [editMode]);

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

            const handleSubmit = async (e) => {
              e.preventDefault();
              
            
              if (!editMode) {
                await addData("tickets", {
                  ticketNumber: formData.ticketNumber,
                  clientName: formData.clientName,
                  amount: formData.amount,
                  timestamp: formData.timestamp,
                  date: formData.date,
                  uid: user.uid,
                  type: 'income',
                  paymentMethod: formData.paymentMethod,
                  depositDate: formData.depositDate, // Agregar fecha de depósito al objeto guardado
                });
                navigate("/");
              }
          
              if (editMode) {
                await updateData("tickets", id, {
                  ticketNumber: formData.ticketNumber,
                  clientName: formData.clientName,
                  amount: formData.amount,
                  timestamp: formData.timestamp,
                  date: formData.date,
                  uid: user.uid,
                  type: 'income',
                  paymentMethod: formData.paymentMethod,
                  depositDate: formData.depositDate, // Agregar fecha de depósito al objeto guardado
                });
                navigate('/');
              }
            };

            useEffect(() => {
              const fetchData = async () => {
                if (editMode) {
                  const response = await getDataById("tickets", id);
                  setFormData({
                    ...response // Asegúrate de que los campos coincidan con los valores esperados
                  });
                }
              };
            
              fetchData();
            }, [editMode, id]);
  
            const handleChange = (e) => {
              const value = e.target.value;
              const name = e.target.name;
          
              setFormData((prevState) => ({
                ...prevState,
                [name]: value
              }));
            };


      

      
    return (
      <div className="flex flex-col justify-center align-middle items-center mx-auto w-full">
      <h1 className="text-black text-center flex justify-center align-middle items-center mx-auto text-2xl font-semibold mt-8">
        {editMode ? 'Actualizar un deposito' : 'Registrar un deposito'}
      </h1>
      <div className="flex flex-col mx-auto w-full sm:w-3/4 xl:w-10/12 items-center">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded pt-6 pb-8 w-full sm:w-3/4 xl:w-4/12">
          <section className="flex flex-col flex-wrap w-3/4 mx-auto">
          <label htmlFor="clientName" className="block text-gray-700 text-sm font-bold mt-2">
              Nombre del Cliente
            </label>
            <select
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required={true}
              defaultValue={'disable-value'}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline mt-2"
            >
              <option value={'disable-value'} disabled >
                -- Selecciona un cliente --
              </option>
              {/* Iterar y mostrar opciones */}
              {listaClientes.map((cliente) => (
                <option key={cliente.id} value={cliente.name}>
                  {cliente.name}
                </option>
              ))}
            </select>
                            <div>
                                <label htmlFor="amount" className="block text-gray-700 text-sm font-bold my-3 ">Monto</label>
                                <input
                                id="amount"
                                name="amount"
                                type="text"
                                onChange={handleChange}
                                required={true}
                                value={formData.amount}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-bold mt-2">
            Método de Pago
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required={true}
            defaultValue={'disable-value'}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline mt-2"
          >
            <option value={'disable-value'} disabled>
              -- Selecciona un método de pago --
            </option>
            <option value="transferencia">Transferencia</option>
            <option value="deposito">Depósito Bancario</option>
          </select>
          <label htmlFor="depositDate" className="block text-gray-700 text-sm font-bold mt-2">
            Fecha de Depósito
          </label>
          <input
            type="date"
            name="depositDate"
            value={formData.depositDate}
            onChange={handleChange}
            required={true}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline mt-2"
          />
                        <input
                        type="submit"
                        value={editMode ? 'Actualizar' : 'Enviar'}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer mt-9"
                        />

                    </section>
                </form>

            </div>
        </div>
    )
    
}
export default IncomePage