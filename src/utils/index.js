export const storeToPumkinDB = (key, value) => {
  // console.log(`pumkin store -> {${key}: ${JSON.stringify(value)}}`)
  localStorage.setItem(key, JSON.stringify(value))
}

export const getFromPumkinDB = (key) => {
  // console.log(`pumkin get -> ${key}`)
  return JSON.parse(localStorage.getItem(key))
}

export const getViewport = () => {
  let viewPortWidth
  let viewPortHeight
  // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
  if (typeof window.innerWidth != 'undefined') {
    viewPortWidth = window.innerWidth
    viewPortHeight = window.innerHeight
  }
  // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
  else if (
    typeof document.documentElement != 'undefined' &&
    typeof document.documentElement.clientWidth != 'undefined' &&
    document.documentElement.clientWidth !== 0
  ) {
    viewPortWidth = document.documentElement.clientWidth
    viewPortHeight = document.documentElement.clientHeight
  }
  // older versions of IE
  else {
    viewPortWidth = document.getElementsByTagName('body')[0].clientWidth
    viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
  }
  return [viewPortWidth, viewPortHeight]
}

export const getPersonNameById = (personId) => {
  const people = getFromPumkinDB('people')
  return people.find((person) => person.id === personId).name
}

export const getSplitReport = (payments) => {
  let splitReport = []
  const expenses = getFromPumkinDB('expenses') || []
  const people = getFromPumkinDB('people') || []
  const individualExpense = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0) / people.length
  let paymentDifferences = Object.entries(payments)
    .map((entry) => ({ person: entry[0], amount: entry[1] }))
    .sort((payment1, payment2) => payment1.amount - payment2.amount)
    .map((payment) => ({
      ...payment,
      deltaPayment: payment.amount - individualExpense,
    }))
  let senderIndex = 0
  let receiverIndex = paymentDifferences.length - 1
  while (senderIndex < receiverIndex) {
    let debt = Math.min(Math.abs(paymentDifferences[senderIndex].deltaPayment), paymentDifferences[receiverIndex].deltaPayment)
    splitReport.push({
      sender: getPersonNameById(paymentDifferences[senderIndex].person),
      receiver: getPersonNameById(paymentDifferences[receiverIndex].person),
      amount: debt,
    })
    paymentDifferences[senderIndex].deltaPayment += debt // remove debt from person after payment
    paymentDifferences[receiverIndex].deltaPayment -= debt // remove amount to be received
    if (paymentDifferences[senderIndex].deltaPayment === 0) {
      senderIndex++
    }
    if (paymentDifferences[receiverIndex].deltaPayment === 0) {
      receiverIndex--
    }
  }
  return splitReport.filter(transaction => transaction.amount > 0 )
}
