import { useState } from 'react'
import CustomerForm from './components/CustomerForm'
import CustomerList from './components/CustomerList'
import './App.css'

function App() {
  const [customers, setCustomers] = useState([])

  function handleAddCustomer(data) {
    setCustomers((prev) => [
      ...prev,
      { ...data, id: crypto.randomUUID() },
    ])
  }

  function handleDeleteCustomer(id) {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Cadastro de Clientes</h1>
        <p>Preencha os dados abaixo para cadastrar um novo cliente.</p>
      </header>

      <main className="app-main">
        <CustomerForm onSubmit={handleAddCustomer} />
        <CustomerList customers={customers} onDelete={handleDeleteCustomer} />
      </main>
    </div>
  )
}

export default App
