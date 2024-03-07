const FinanceCard = ({ totalExpenses, totalIncome, balance }) => {
    // Colores basados en el balance
    let balanceColor = "black";
    if (balance > 0) {
      balanceColor = "green";
    } else if (balance < 0) {
      balanceColor = "red";
    }
  
    return (
      <div style={{ color: balanceColor }}>
        <p>Total de Gastos: {totalExpenses}</p>
        <p>Total de Ingresos: {totalIncome}</p>
        <p>Balance: {balance}</p>
      </div>
    );
  };
  
  export default FinanceCard;
  
