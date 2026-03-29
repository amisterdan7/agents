import './CustomerList.css'

export default function CustomerList({ customers, onDelete }) {
  if (customers.length === 0) {
    return (
      <div className="customer-list-empty">
        <p>Nenhum cliente cadastrado ainda.</p>
      </div>
    )
  }

  return (
    <div className="customer-list-wrapper">
      <h2 className="customer-list-title">Clientes Cadastrados ({customers.length})</h2>
      <div className="table-scroll">
        <table className="customer-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Sobrenome</th>
              <th>E-mail</th>
              <th>Celular</th>
              <th>CEP</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td>{c.nome}</td>
                <td>{c.sobrenome}</td>
                <td>{c.email}</td>
                <td>{c.celular}</td>
                <td>{c.cep}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(c.id)}
                    title="Remover cliente"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
