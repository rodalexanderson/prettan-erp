import { useState, useEffect} from "react"
// import { userContext } from "../../context/userProvider"
import { addData, getDataById, updateData } from "../../Services/CRUD"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

const ProductPage = ({editMode}) => {
    // const user = useContext(userContext)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        timestamp: new Date().toISOString(),
        ticketNumber: '' // Nuevo campo para el número consecutivo
    })
    let {id} = useParams()

    const handleSubmit = async (e) => {
        e.preventDefault();
            if (!editMode) {
                await addData("products", {
                    name: formData.name,
                    price: formData.price,
                    size: formData.size,
                    category: formData.category,
                  });
              navigate("/productsHomePage");
            }
        if (editMode){
            await updateData("products", id, {
                name: formData.name,
                price: formData.price,
                size: formData.size,
                category: formData.category,
            })
            navigate('/productsHomePage')
        }
    }

    const fetchData = async () => {
       const response =  await getDataById("products", id)
        setFormData({
            name: response.name,
            price: response.price,
            size: response.size,
            category: response.category,
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
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Producto</label>
                            <input 
                            id="name"
                            name="name"
                            type="text"
                            onChange={handleChange}
                            required={true}
                            value={formData.name}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <label htmlFor="size" className="block text-gray-700 text-sm font-bold mb-2">Presentacion</label>
                            <input 
                            id="size"
                            name="size"
                            type="text"
                            onChange={handleChange}
                            required={true}
                            value={formData.size}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <label htmlFor="category"className="block text-gray-700 text-sm font-bold mb-2">Linea</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required={true}
                                defaultValue={'disable-value'}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                <option value={'disable-value'} disabled> -- Selecciona una opcion -- </option>
                                <option value="nutricionales">Nutricionales</option>
                                <option value="cosmeticos" >Cosmeticos</option>
                                <option value="otros" >Otros</option>
                            </select>
                            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                            <input 
                            id="price"
                            name="price"
                            type="number"
                            onChange={handleChange}
                            required={true}
                            value={formData.price}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        <input value="Enviar" type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer mt-9" />
                    </section>
                </form>
            </div>
        </div>
    )
    
}
export default ProductPage