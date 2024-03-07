import { useState, useEffect, useContext} from "react"
import { onSnapshot } from "firebase/firestore"
import { getCollectionRef } from "../../Services/CRUD"
import { userContext } from "../../context/userProvider"
import { addData, getData, getDataById, updateData } from "../../Services/CRUD"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPDF from "../../Components/TicketPDF"

const getNextConsecutiveNumber = async () => {
  const currentYear = new Date().getFullYear();

  const tickets = await getData("tickets");

  const currentYearTickets = tickets.filter(
    (ticket) =>
      ticket.timestamp && new Date(ticket.timestamp).getFullYear() === currentYear
  );

  let maxNumber = 0;
  if (currentYearTickets.length > 0) {
    maxNumber = currentYearTickets.reduce((max, ticket) => {
      if (ticket.ticketNumber && ticket.ticketNumber.startsWith(`${currentYear}`)) {
        const ticketNumber = parseInt(ticket.ticketNumber.substring(4), 10);
        return ticketNumber > max ? ticketNumber : max;
      }
      return max;
    }, 0);
  }

  const nextNumber = maxNumber + 1;
  const formattedNumber = nextNumber.toString().padStart(3, "0");
  const ticketID = `${currentYear}${formattedNumber}`;

  return ticketID;
};

  
  



const TicketPage = ({editMode}) => {
    const user = useContext(userContext)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        timestamp: new Date().toISOString(),
        ticketNumber: '', // Nuevo campo para el número consecutivo
        date: new Date().toISOString().split('T')[0], // Establecer la fecha actual
    })
    const [cantidadProducto, setCantidadProducto] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');
    const [precioProducto, setPrecioProducto] = useState('');
    const [objetoEnviado, setObjetoEnviado] = useState([]);
    const [products, setProducts] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [clientDetails, setClientDetails] = useState({
      direction: '',
      phone: '',
      brand: ''
    });
    const [estatus, setEstatus] = useState('Creada');

    let {id} = useParams()
    
    // Obtener el próximo número consecutivo al montar el componente
        useEffect(() => {
            const fetchNextTicketID = async () => {
                const nextID = await getNextConsecutiveNumber();
                setFormData((prevState) => ({ ...prevState, ticketNumber: nextID }));
              };
              

            fetchNextTicketID();
        }, []);

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

        useEffect(() => {
          const selectedClient = listaClientes.find(cliente => cliente.name === formData.clientName);
          if (selectedClient) {
            setClientDetails({
              direction: selectedClient.direction || '',
              phone: selectedClient.phone || '',
              brand: selectedClient.brand || ''
            });
          }
        }, [formData.clientName, listaClientes]);

        const handleSubmit = async (e) => {
          e.preventDefault();
      
          const ticketData = {
            ticketNumber: formData.ticketNumber,
            clientName: formData.clientName,
            amount: formData.amount,
            category: formData.category,
            timestamp: formData.timestamp,
            date: formData.date,
            uid: user.uid,
            objetoEnviado: objetoEnviado,
            type: 'expense',
            direction: clientDetails.direction,
            phone: clientDetails.phone,
            brand: clientDetails.brand,
            estatus: estatus,
          };
      
          if (!editMode) {
            await addData("tickets", {
              ...ticketData,
              estatus: 'Creada',
            });
            navigate("/");
          } else {
            await updateData("tickets", id, ticketData);
            navigate('/');
          }
        };

    useEffect(() => {
        const fetchData = async () => {
          if (editMode) {
            const response = await getDataById("tickets", id);
            setFormData({
              ticketNumber: response.ticketNumber,
              clientName: response.clientName,
              amount: response.amount,
              category: response.category,
              timestamp: response.timestamp,
              date: response.date,
              uid: user.uid,
              objetoEnviado: response.objetoEnviado || [],
              type: 'expense',
              direction: response.direction,
              phone: response.phone,
              brand: response.brand,
              estatus: response.estatus,
            });
            setObjetoEnviado(response.objetoEnviado || []); // Actualizar el estado de objetoEnviado
            setEstatus(response.estatus);
          }
        };
      
        fetchData();
      }, [editMode, id, user.uid]);
      
      console.log(objetoEnviado)

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
    
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
        if (name === 'estatus') {
          setEstatus(value); // Actualiza el estado 'estatus' al cambiar su valor en el formulario
        }
    }

    // Agrega productos a un array

    useEffect(() => {
        const unsubscribe = onSnapshot(getCollectionRef('products'), (data) => {
          setProducts(
            data.docs.map((doc) => {
              return { ...doc.data(), id: doc.id };
            })
          );
        });
    
        return () => {
          unsubscribe();
        };
      }, []);

      useEffect(() => {
        const selectedProduct = products.find((product) => product.name === nombreProducto);
        if (selectedProduct) {
          setPrecioProducto(selectedProduct.price.toString());
        } else {
          setPrecioProducto('');
        }
      }, [nombreProducto, products]);

      const handleAddProduct = (e) => {
        e.preventDefault();
      
        if (!nombreProducto || !precioProducto || !cantidadProducto) {
          // Mostrar algún mensaje o realizar alguna acción si falta algún dato
          return;
        }
      
        const selectedProduct = products.find((product) => product.name === nombreProducto);
        const nuevoProducto = {
          cantidadProducto,
          nombreProducto,
          precioProducto: selectedProduct ? selectedProduct.price : '',
        };
      
        const totalAmount =
          objetoEnviado.reduce((acc, obj) => {
            return acc + Number(obj.cantidadProducto || 0) * Number(obj.precioProducto || 0);
          }, 0) +
          Number(nuevoProducto.cantidadProducto || 0) * Number(nuevoProducto.precioProducto || 0);
      
        setFormData((prevState) => ({
          ...prevState,
          amount: totalAmount.toString(),
        }));
      
        const updatedProducts = [
          ...objetoEnviado,
          {
            cantidadProducto: nuevoProducto.cantidadProducto,
            nombreProducto: nuevoProducto.nombreProducto,
            precioProducto: nuevoProducto.precioProducto,
          },
        ];
      
        setObjetoEnviado(updatedProducts);
        setCantidadProducto('');
        setNombreProducto('');
        setPrecioProducto('');
      };
      
      
      
      const handleDeleteLastProduct = (e) => {
        e.preventDefault();
      
        // Verificar si hay productos para eliminar
        if (objetoEnviado.length > 0) {
          const updatedProducts = [...objetoEnviado];
          updatedProducts.pop(); // Eliminar el último producto del array
      
          setObjetoEnviado(updatedProducts); // Actualizar el estado con el array modificado
        }
      }; 

      const GeneratePDFLink = () => (
        <PDFDownloadLink document={<TicketPDF clientDetails={clientDetails} formData={formData} objetoEnviado={objetoEnviado}/>} fileName="ticket.pdf">
          {({ loading }) =>
            loading ? 'Generando PDF...' : 'Descargar PDF'
          }
        </PDFDownloadLink>
      );

      
    return (
      <div className="flex flex-col justify-center align-middle items-center mx-auto w-full">
      <h1 className="text-black text-center flex justify-center align-middle items-center mx-auto text-2xl font-semibold mt-8">
        {editMode ? 'Actualiza la remisión' : 'Crear una remisión'}
      </h1>
        
      <div className="flex flex-col mx-auto w-full sm:w-3/4 xl:w-4/12 items-center">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded pt-6 pb-8 w-full sm:w-3/4 xl:w-10/12">
          <section className="flex flex-col flex-wrap w-3/4 mx-auto">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold">
              Categoría
            </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required={true}
            defaultValue={'disable-value'}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline mt-2"
          >
            <option value={'disable-value'} disabled>-- Selecciona una opción --</option>
            <option value="nutricionales">Remisión Nutricionales</option>
            <option value="cosmeticos">Remisión Cosméticos</option>
            <option value="otros">Otros</option>
          </select>
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
              <option value={'disable-value'} disabled>
                -- Selecciona un cliente --
              </option>
              {/* Iterar y mostrar opciones */}
              {listaClientes.map((cliente) => (
                <option key={cliente.id} value={cliente.name}>
                  {cliente.name}
                </option>
              ))}
            </select>
            <div className="mt-6">
              <h1 className="text-center font-bold">Detalles del Cliente</h1>
              <p>Nombre: {formData.clientName}</p>
              <p>Dirección: {clientDetails.direction}</p>
              <p>Teléfono: {clientDetails.phone}</p>
              <p>Marca Propia: {clientDetails.brand}</p>
            </div>
                            <div className="mt-6">
                                <h1 className="text-center font-bold">Agrega Productos</h1>
                                <div className="mb-6">
                                    <label htmlFor="cantidad" className="block text-gray-700 text-sm font-bold ">Cantidad</label>
                                    <input
                                        type="text"
                                        value={cantidadProducto}
                                        onChange={(e) => setCantidadProducto(e.target.value)}
                                        placeholder="Cantidad"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                                    />
                                </div>
                                <div className="mb-6">
                                <label htmlFor="producto" className="block text-gray-700 text-sm font-bold  mt-4">Nombre del Producto</label>
          <select
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
            placeholder="Selecciona un producto"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline mt-2"
          >
            <option value="">Selecciona un producto</option>
            {/* Iterar y mostrar opciones */}
            {products.map((product, index) => (
              <option key={index} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
                                </div>
                                <div>
                                    <label htmlFor="precio" className="block text-gray-700 text-sm font-bold  mt-4">Precio</label>
                                    <input
                                    type="text"
                                    value={precioProducto}
                                    onChange={(e) => setPrecioProducto(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                                    readOnly // Evita la modificación directa del campo 3 por el usuario
                                    />
                                </div>
                            </div>
            
                                <div className="flex flex-row justify-evenly">
                                    <button
                                        onClick={handleAddProduct}
                                        disabled={!cantidadProducto || !nombreProducto || !precioProducto}
                                        className={`bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer mt-9 ${!cantidadProducto || !nombreProducto || !precioProducto ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Agregar Productos
                                    </button>
                                    {objetoEnviado.length > 0 && (
                                        <button onClick={handleDeleteLastProduct} className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline cursor-pointer mt-9">
                                        Eliminar el último producto
                                        </button>
                                    )}
                                </div>

                            
                            <div>
                            {objetoEnviado.map((objeto, index) => (
                              <div key={index}>
                                <p>------------------------</p>
                                <p>Producto {index + 1}:</p>
                                <p>Cantidad: {objeto.cantidadProducto}</p>
                                <p>Nombre: {objeto.nombreProducto}</p>
                                <p>Precio: {objeto.precioProducto}</p>
                              </div>
                            ))}

                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-gray-700 text-sm font-bold my-3 ">Total acumulado</label>
                                <input
                                id="amount"
                                name="amount"
                                type="text"
                                onChange={handleChange}
                                required={true}
                                value={formData.amount}
                                readOnly
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            {editMode && (
                              <div className="mt-6">
                                <label htmlFor="estatus" className="block text-gray-700 text-sm font-bold">
                                  Estatus
                                </label>
                                <select
                                  name="estatus"
                                  value={estatus}
                                  onChange={handleChange}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline mt-2"
                                >
                                  <option value="Creada">Creada</option>
                                  <option value="Procesando">En Proceso</option>
                                  <option value="Terminada">Producción Terminada</option>
                                  <option value="Enviada">Enviada</option>
                                </select>
                              </div>
                            )}
                              <input
                                type="submit"
                                value={editMode ? 'Actualizar' : 'Enviar'}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer mt-9"
                              />
                            </section>
                            {editMode &&
                            <div className="mx-auto flex">
                              <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer mt-9 mx-auto">
                                <GeneratePDFLink />
                              </button> 
                            </div>
                            }
                </form>

            </div>
        </div>
    )
    
}
export default TicketPage