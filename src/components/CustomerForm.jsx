import { useState } from 'react'
import './CustomerForm.css'

const EMPTY_FORM = {
  nome: '',
  sobrenome: '',
  email: '',
  celular: '',
  cep: '',
}

const ERRORS_INITIAL = {
  nome: '',
  sobrenome: '',
  email: '',
  celular: '',
  cep: '',
}

function formatCelular(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatCep(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

function validate(form) {
  const errors = { ...ERRORS_INITIAL }
  let valid = true

  if (!form.nome.trim()) {
    errors.nome = 'Nome é obrigatório.'
    valid = false
  }

  if (!form.sobrenome.trim()) {
    errors.sobrenome = 'Sobrenome é obrigatório.'
    valid = false
  }

  if (!form.email.trim()) {
    errors.email = 'E-mail é obrigatório.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'E-mail inválido.'
    valid = false
  }

  const celularDigits = form.celular.replace(/\D/g, '')
  if (!celularDigits) {
    errors.celular = 'Celular é obrigatório.'
    valid = false
  } else if (celularDigits.length < 10 || celularDigits.length > 11) {
    errors.celular = 'Celular inválido. Use o formato (99) 99999-9999.'
    valid = false
  }

  const cepDigits = form.cep.replace(/\D/g, '')
  if (!cepDigits) {
    errors.cep = 'CEP é obrigatório.'
    valid = false
  } else if (cepDigits.length !== 8) {
    errors.cep = 'CEP inválido. Use 8 dígitos.'
    valid = false
  }

  return { errors, valid }
}

export default function CustomerForm({ onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState(ERRORS_INITIAL)
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    let formatted = value

    if (name === 'celular') formatted = formatCelular(value)
    if (name === 'cep') formatted = formatCep(value)

    setForm((prev) => ({ ...prev, [name]: formatted }))

    if (submitted) {
      const next = { ...form, [name]: formatted }
      const { errors: newErrors } = validate(next)
      setErrors(newErrors)
    }
  }

  async function handleCepBlur() {
    const digits = form.cep.replace(/\D/g, '')
    if (digits.length !== 8) return
    setCepLoading(true)
    setCepError('')
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (data.erro) {
        setCepError('CEP não encontrado.')
      }
    } catch {
      setCepError('Erro ao buscar o CEP. Verifique sua conexão.')
    } finally {
      setCepLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const { errors: newErrors, valid } = validate(form)
    setErrors(newErrors)
    if (!valid) return

    onSubmit({ ...form })
    setForm(EMPTY_FORM)
    setErrors(ERRORS_INITIAL)
    setSubmitted(false)
    setCepError('')
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Ex: João"
            value={form.nome}
            onChange={handleChange}
            className={errors.nome ? 'input-error' : ''}
          />
          {errors.nome && <span className="error-msg">{errors.nome}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="sobrenome">Sobrenome</label>
          <input
            id="sobrenome"
            name="sobrenome"
            type="text"
            placeholder="Ex: Silva"
            value={form.sobrenome}
            onChange={handleChange}
            className={errors.sobrenome ? 'input-error' : ''}
          />
          {errors.sobrenome && <span className="error-msg">{errors.sobrenome}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Ex: joao@email.com"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="celular">Celular</label>
          <input
            id="celular"
            name="celular"
            type="tel"
            placeholder="(99) 99999-9999"
            value={form.celular}
            onChange={handleChange}
            className={errors.celular ? 'input-error' : ''}
          />
          {errors.celular && <span className="error-msg">{errors.celular}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cep">
            CEP
            {cepLoading && <span className="cep-loading"> Buscando...</span>}
          </label>
          <input
            id="cep"
            name="cep"
            type="text"
            placeholder="99999-999"
            value={form.cep}
            onChange={handleChange}
            onBlur={handleCepBlur}
            className={errors.cep || cepError ? 'input-error' : ''}
          />
          {errors.cep && <span className="error-msg">{errors.cep}</span>}
          {!errors.cep && cepError && <span className="error-msg">{cepError}</span>}
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Cadastrar Cliente
      </button>
    </form>
  )
}
