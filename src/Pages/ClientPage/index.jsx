import { useState, useEffect} from "react"
// import { userContext } from "../../context/userProvider"
import { addData, getDataById, updateData } from "../../Services/CRUD"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

const ClientPage = ({editMode}) => {
    // const user = useContext(userContext)
    const navigate = useNavigate()
    const [formData, setFormData] = useState([])
    let {id} = useParams()

    const handleSubmit = async (e) => {
        e.preventDefault();
            if (!editMode) {
                await addData("clientes", {
                    name: formData.name,
                    direction: formData.direction,
                    brand: formData.brand,
                    phone: formData.phone,
                    invoice: formData.invoice,
                    notes: formData.notes,
                  });
              navigate("/clientHomePage");
            }
        if (editMode){
            await updateData("clientes", id, {
                name: formData.name,
                direction: formData.direction,
                brand: formData.brand,
                phone: formData.phone,
                invoice: formData.invoice,
                notes: formData.notes,
            })
            navigate('/clientHomePage')
        }
    }

    const fetchData = async () => {
       const response =  await getDataById("clientes", id)
        setFormData({
            name: response.name,
            direction: response.direction,
            brand: response.brand,
            phone: response.phone,
            invoice: response.invoice,
            notes: response.notes,
            })
    }

    useEffect(() => {
        if(editMode) fetchData()
    }, [])

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
    
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }


    return (
        <div className="flex flex-col justify-center align-middle items-center mx-auto ">
            <h1 className="text-black text-center flex justify-center align-middle items-center mx-auto text-2xl font-semibold mt-4">{editMode ? 'Actualiza el producto' : 'Agregar producto'}</h1>
            <div className="flex flex-col mx-auto  w-full sm:w-4/5 items-center">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 m-4 w-3/4">
                    <section className="flex flex-col flex-wrap w-3/4 mx-auto">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Cliente</label>
                            <input 
                            id="name"
                            name="name"
                            type="text"
                            onChange={handleChange}
                            required={true}
                            value={formData.name}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <label htmlFor="direction" className="block text-gray-700 text-sm font-bold mb-2">Direccion de Envio</label>
                            <input 
                            id="direction"
                            name="direction"
                            type="text"
                            onChange={handleChange}
                            required={true}
                            value={formData.direction}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            
                            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Telefono</label>
                            <input 
                            id="phone"
                            name="phone"
                            type="text"
                            onChange={handleChange}
                            required={true}
                            value={formData.phone}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <label htmlFor="brand"className="block text-gray-700 text-sm font-bold mb-2"></label>
                            <select 
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required={true}
                                defaultValue={'disable-value'}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                <option value={'disable-value'} disabled> ¿Tiene marca propia? </option>
                                <option value="Si">Si</option>
                                <option value="No" >No</option>
                            </select>
                            <label htmlFor="invoice"className="block text-gray-700 text-sm font-bold mb-2"></label>
                            <select 
                                name="invoice"
                                value={formData.invoice}
                                onChange={handleChange}
                                required={true}
                                defaultValue={'disable-value'}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                <option value={'disable-value'} disabled> ¿Necesita factura? </option>
                                <option value="Si">Si</option>
                                <option value="No" >No</option>
                            </select>
                            <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notas:</label>
                            <input 
                            id="notes"
                            name="notes"
                            type="text"
                            onChange={handleChange}
                            required={true}
                            value={formData.notes}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        <input value="Enviar" type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer mt-9" />
                    </section>
                </form>
            </div>
        </div>
    )
    
}
export default ClientPage