import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Table,
  Typography,
  Select,
  Tag,
  Switch,
  Col,
  Row,
  message,
  ConfigProvider,
  theme,
} from 'antd'
import AddTransactionModal from '../../components/Modal'
import { ColumnsType } from 'antd/es/table'
const { darkAlgorithm, defaultAlgorithm } = theme

const { Title } = Typography
const { Option } = Select

export interface Transaction {
  key: string
  description: string
  amount: number
  date: string
  type: 'income' | 'expense'
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filterType, setFilterType] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<string>('date')
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(prefersDarkScheme.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    prefersDarkScheme.addEventListener('change', handleChange)

    return () => {
      prefersDarkScheme.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    const savedTransactions = JSON.parse(
      localStorage.getItem('transactions') || '[]',
    )
    setTransactions(savedTransactions)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  const showAddTransactionModal = () => {
    setIsModalVisible(true)
  }

  const closeAddTransactionModal = () => {
    setIsModalVisible(false)
  }

  const handleAddTransaction = (transaction: Transaction) => {
    const updatedTransactions = [...transactions, transaction]
    setTransactions(updatedTransactions)

    localStorage.setItem('transactions', JSON.stringify(updatedTransactions))
    message.success('Transação adicionada com sucesso!')
  }

  const deleteTransaction = (key: string) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.key !== key,
    )
    setTransactions(updatedTransactions)
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions))
    message.success('Transação excluída com sucesso!')
  }

  const filteredTransactions = filterType
    ? transactions.filter((transaction) => transaction.type === filterType)
    : transactions

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    if (sortKey === 'amount') {
      return b.amount - a.amount
    }
    return a.description.localeCompare(b.description)
  })

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome + totalExpense

  const columns: ColumnsType<Transaction> = [
    { title: 'Descrição', dataIndex: 'description', key: 'description' },
    {
      title: 'Valor',
      dataIndex: 'amount',
      align: 'right',
      render: (amount: number) => (
        <Tag color={amount >= 0 ? 'green' : 'red'}>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(amount)}
        </Tag>
      ),
    },
    {
      title: 'Data',
      dataIndex: 'date',
    },
    {
      title: 'Ações',
      render: (_, record: Transaction) => (
        <Button
          type="link"
          danger
          onClick={() => deleteTransaction(record.key)}
        >
          Excluir
        </Button>
      ),
    },
  ]

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <div style={{ margin: '20px' }}>
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={8}>
            <Card title="Total de Entradas" bordered={false}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalIncome)}
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Total de Saídas" bordered={false}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalExpense)}
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Saldo Atual" bordered={false}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(balance)}
            </Card>
          </Col>
        </Row>

        <Card style={{ padding: '20px', borderRadius: '8px' }} bordered>
          <Title level={3}>Histórico de Transações</Title>

          <div style={{ marginBottom: '20px' }}>
            <Row gutter={[10, 10]} align="middle">
              <Col xs={24} sm={8} md={6}>
                <Select
                  placeholder="Filtrar por tipo"
                  style={{ width: '100%' }}
                  onChange={(value) => setFilterType(value || null)}
                  allowClear
                >
                  <Option value="income">Entradas</Option>
                  <Option value="expense">Saídas</Option>
                </Select>
              </Col>

              <Col xs={24} sm={8} md={6}>
                <Select
                  defaultValue="date"
                  style={{ width: '100%' }}
                  onChange={(value) => setSortKey(value)}
                  options={[
                    {
                      value: 'date',
                      label: 'Ordenar por Data',
                    },
                    {
                      value: 'amount',
                      label: 'Ordenar por Valor',
                    },
                    {
                      value: 'description',
                      label: 'Ordenar por Descrição',
                    },
                  ]}
                />
              </Col>

              <Col xs={24} sm={8} md={3}>
                <Button
                  onClick={showAddTransactionModal}
                  type="primary"
                  style={{ width: '100%' }}
                >
                  Adicionar Transação
                </Button>
              </Col>

              <Col xs={24} sm={8} md={3}>
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  checkedChildren="Escuro"
                  unCheckedChildren="Claro"
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </div>

          <Table
            dataSource={sortedTransactions}
            columns={columns}
            pagination={{ pageSize: 5 }}
            style={{ marginTop: '20px' }}
          />
        </Card>

        <AddTransactionModal
          visible={isModalVisible}
          onClose={closeAddTransactionModal}
          onAddTransaction={handleAddTransaction}
        />
      </div>
    </ConfigProvider>
  )
}
