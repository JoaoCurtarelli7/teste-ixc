import {
  filterAndSortTransactions,
  calculateBalance,
  calculateFinancialSummary,
} from '../financeUtils'

describe('filterAndSortTransactions', () => {
  const mockTransactions = [
    { description: 'Venda', amount: 200, date: '2025-03-29' },
    { description: 'Compra', amount: -50, date: '2025-03-28' },
    { description: 'Salário', amount: 1500, date: '2025-03-30' },
    { description: 'Aluguel', amount: -800, date: '2025-03-27' },
  ]

  test('deve filtrar transações por receitas e ordenar por data', () => {
    const result = filterAndSortTransactions(mockTransactions, 'income', 'date')
    expect(result).toEqual([
      { description: 'Venda', amount: 200, date: '2025-03-29' },
      { description: 'Salário', amount: 1500, date: '2025-03-30' },
    ])
  })

  test('deve filtrar transações por despesas e ordenar por data', () => {
    const result = filterAndSortTransactions(
      mockTransactions,
      'expense',
      'date',
    )
    expect(result).toEqual([
      { description: 'Aluguel', amount: -800, date: '2025-03-27' },
      { description: 'Compra', amount: -50, date: '2025-03-28' },
    ])
  })

  test('deve ordenar transações por valor sem filtrar', () => {
    const result = filterAndSortTransactions(mockTransactions, null, 'amount')
    expect(result).toEqual([
      { description: 'Aluguel', amount: -800, date: '2025-03-27' },
      { description: 'Compra', amount: -50, date: '2025-03-28' },
      { description: 'Venda', amount: 200, date: '2025-03-29' },
      { description: 'Salário', amount: 1500, date: '2025-03-30' },
    ])
  })

  test('deve ordenar transações por descrição', () => {
    const result = filterAndSortTransactions(
      mockTransactions,
      null,
      'description',
    )
    expect(result).toEqual([
      { description: 'Aluguel', amount: -800, date: '2025-03-27' },
      { description: 'Compra', amount: -50, date: '2025-03-28' },
      { description: 'Salário', amount: 1500, date: '2025-03-30' },
      { description: 'Venda', amount: 200, date: '2025-03-29' },
    ])
  })

  test('deve retornar array vazio quando não há transações', () => {
    const result = filterAndSortTransactions([], 'income', 'date')
    expect(result).toEqual([])
  })
})

describe('calculateBalance', () => {
  test('deve calcular o saldo total corretamente', () => {
    const transactions = [
      { amount: 100 },
      { amount: -30 },
      { amount: 50 },
      { amount: -20 },
    ]
    expect(calculateBalance(transactions)).toBe(100)
  })

  test('deve retornar 0 quando não há transações', () => {
    expect(calculateBalance([])).toBe(0)
  })

  test('deve calcular saldo negativo corretamente', () => {
    const transactions = [{ amount: -100 }, { amount: -50 }, { amount: -30 }]
    expect(calculateBalance(transactions)).toBe(-180)
  })
})

describe('calculateFinancialSummary', () => {
  test('deve calcular o resumo financeiro corretamente', () => {
    const transactions = [
      { amount: 1000 },
      { amount: -300 },
      { amount: 500 },
      { amount: -200 },
    ]

    const summary = calculateFinancialSummary(transactions)

    expect(summary).toEqual({
      income: 1500.0,
      expenses: 500.0,
      balance: 1000.0,
      savingsRate: 66.67,
    })
  })

  test('deve retornar valores zerados quando não há transações', () => {
    const summary = calculateFinancialSummary([])

    expect(summary).toEqual({
      income: 0.0,
      expenses: 0.0,
      balance: 0.0,
      savingsRate: 0.0,
    })
  })

  test('deve calcular taxa de poupança como 0 quando não há receitas', () => {
    const transactions = [{ amount: -100 }, { amount: -200 }]

    const summary = calculateFinancialSummary(transactions)

    expect(summary.savingsRate).toBe(0.0)
  })

  test('deve calcular taxa de poupança como 100 quando não há despesas', () => {
    const transactions = [{ amount: 1000 }, { amount: 500 }]

    const summary = calculateFinancialSummary(transactions)

    expect(summary.savingsRate).toBe(100.0)
  })

  test('deve lidar com valores decimais corretamente', () => {
    const transactions = [{ amount: 1000.5 }, { amount: -300.25 }]

    const summary = calculateFinancialSummary(transactions)

    expect(summary).toEqual({
      income: 1000.5,
      expenses: 300.25,
      balance: 700.25,
      savingsRate: 69.99,
    })
  })
})
