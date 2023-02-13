import { Link } from 'react-router-dom'
import './Home.css'
import { Chart } from 'react-google-charts'
import { getFromPumkinDB } from '../../utils'
import UserIcon from '../../images/user.svg'
import MoneyIcon from '../../images/dollar-sign.svg'
import { getViewport, getSplitReport } from '../../utils'
import { ReactComponent as EmptyStateImage } from '../../assets/empty.svg'

const Home = () => {
  const expenses = getFromPumkinDB('expenses') || []
  const people = getFromPumkinDB('people') || []
  let spendingData = []
  let spentOnData = []
  let userToAmountMapping = {}
  let itemToAmountMapping = {}
  for (let expense of expenses) {
    if (expense.person in userToAmountMapping) {
      userToAmountMapping[expense.person] += parseInt(expense.amount)
    } else {
      userToAmountMapping[expense.person] = parseInt(expense.amount)
    }
    if (expense.item in itemToAmountMapping) {
      itemToAmountMapping[expense.item] += parseInt(expense.amount)
    } else {
      itemToAmountMapping[expense.item] = parseInt(expense.amount)
    }
  }
  for (let person of people) {
    if (!(person.id in userToAmountMapping)) {
      userToAmountMapping = { ...userToAmountMapping, [person.id]: 0 }
    }
  }
  for (let personId of Object.keys(userToAmountMapping)) {
    spendingData.push([people.find((person) => person.id === personId).name, userToAmountMapping[personId]])
  }
  for (let item of Object.keys(itemToAmountMapping)) {
    spentOnData.push([item, itemToAmountMapping[item]])
  }

  const [viewPortWidth] = getViewport()
  const chartWidth = viewPortWidth <= 450 ? viewPortWidth - 40 : 400

  const splitReport = getSplitReport(userToAmountMapping)

  const handleClearStorage = () => {
    localStorage.clear()
  }

  return (
    <div className='home'>
      <div className='home__button-container'>
        {people.length > 0 && (
          <>
            <Link className='button home__link' to='/add-expense'>
              Add expense <img src={MoneyIcon} alt='Dollar Sign' />
            </Link>
            <Link className='button home__link' to='/add-people'>
              Add Friends <img src={UserIcon} alt='User' />
            </Link>
          </>
        )}
        {(expenses.length > 0 || people.length > 0) && (
          <button className='button home__link' onClick={handleClearStorage}>
            Clear Data <img src={UserIcon} alt='User' />
          </button>
        )}
      </div>
      <div className='home__chart-container'>
        {expenses.length > 0 && spendingData?.length > 0 && (
          <Chart
            chartType='ColumnChart'
            className='chart'
            width={chartWidth}
            options={{
              backgroundColor: '#eee',
              title: 'Who spent the most?',
            }}
            data={[['Person', 'Spending'], ...spendingData]}
          />
        )}
        {spentOnData?.length > 0 && (
          <Chart
            chartType='PieChart'
            className='chart'
            width={chartWidth}
            options={{
              backgroundColor: '#eee',
              title: 'Amount spent on each item',
            }}
            data={[['Item', 'Amount'], ...spentOnData]}
          />
        )}
      </div>
      {splitReport?.length > 0 && (
        <div className='split-report-container'>
          <h3>Split Report</h3>
          {splitReport.map((transaction, index) => (
            <div className='list' key={index}>
              {transaction.sender} to {transaction.receiver}, ₹{transaction.amount.toFixed(0)}
            </div>
          ))}
        </div>
      )}
      {!people.length > 0 && (
        <div className='empty-state'>
          <EmptyStateImage />
          <p className='empty-state-title'>You have not added any friends yet</p>
          <Link className='button home__link' to='/add-people'>
            Add Friends <img src={UserIcon} alt='User' />
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home
