import React from 'react';
import { Document, Page, Text} from '@react-pdf/renderer';


const TicketPDF = ({clientDetails, formData, objetoEnviado}) => {
  return (
    <Document>
        <Page size="A4" style={{paddingHorizontal: "50px", paddingVertical: "50px" }}>
            <Text style={{textAlign: 'center',fontSize: '22px' }}>{`Remisión ${formData.ticketNumber}`}</Text>
            <div>
                <Text style={{fontSize: '12px', marginTop: "12px"}}>Remitente</Text>
                <Text style={{fontSize: '12px'}}>Luis Gerardo Ibarra Covarrubias</Text>
                <Text style={{fontSize: '12px', paddingRight: "40px" }}>Hocaba #354, Colonia Pedregal de San Nicolas 4ta Sec, Tlalpan, CDXM CP 14100</Text>
                <Text style={{fontSize: '12px'}}>5554343576</Text>
            </div>
            <div>
                <Text style={{fontSize: '12px', marginTop: "10px"}}>Destinatario</Text>
                <Text style={{fontSize: '12px'}}>{`Nombre del cliente: ${formData.clientName}`}</Text>
                <Text style={{fontSize: '12px', paddingRight: "40px" }}>{`Dirección de envío: ${clientDetails.direction}`}</Text>
                <Text style={{fontSize: '12px', marginBottom: "15px" }}>{`Teléfono: ${clientDetails.phone}`}</Text>
            </div>
            <Text style={{fontSize: '17px', paddingBottom: "10px" }}>Detalle de productos</Text>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly"}}>
                    <Text style={{fontSize: '14px', width:"30%"}}>Cantidad</Text>
                    <Text style={{fontSize: '14px', width:"30%"}}>Nombre del Producto</Text>
                    <Text style={{fontSize: '14px', width:"30%"}}>Precio</Text>
                </div>
                {objetoEnviado.map((objeto, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly"}}>
                        <Text style={{ fontSize: '10px', marginVertical: '7px', width:"30%" }}>{objeto.cantidadProducto}</Text>
                        <Text style={{ fontSize: '10px', marginVertical: '7px', width:"30%" }}>{objeto.nombreProducto}</Text>
                        <Text style={{ fontSize: '10px', marginVertical: '7px', width:"30%" }}>${objeto.precioProducto}</Text>
                    </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'row', marginVertical: '12px'}}>
                    <Text style={{fontSize: '12px', marginRight: "5px" }}>Suma sin IVA</Text>
                    <Text style={{fontSize: '12px' }}>${`${formData.amount}`}MXN</Text>
                </div>
        </Page>
    </Document>
  )
}

export default TicketPDF