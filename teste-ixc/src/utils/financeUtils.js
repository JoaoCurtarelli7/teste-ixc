export const filterAndSortTransactions = (
  transactions,
  filterType,
  sortKey,
) => {
  let filteredTransactions = transactions

  if (filterType) {
    filteredTransactions = transactions.filter((transaction) =>
      filterType === 'income'
        ? transaction.amount >= 0
        : transaction.amount < 0,
    )
  }

  return filteredTransactions.sort((a, b) => {
    if (a[sortKey] < b[sortKey]) {
      return -1
    }

    if (a[sortKey] > b[sortKey]) {
      return 1
    }
    return 0
  })
}

export const calculateBalance = (transactions) => {
  return transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
}

const formatNumber = (num) => Number(num.toFixed(2))

export const calculateFinancialSummary = (transactions) => {
  const income = transactions
    .filter((transaction) => transaction.amount >= 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0)

  const balance = income - expenses

  const savingsRate =
    income > 0 ? Number(((balance / income) * 100).toFixed(2)) : 0

  return {
    income: formatNumber(income),
    expenses: formatNumber(expenses),
    balance: formatNumber(balance),
    savingsRate,
  }
}
