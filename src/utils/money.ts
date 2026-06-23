const moneyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
})

export function formatMoney(value: number) {
  return moneyFormatter.format(value)
}
