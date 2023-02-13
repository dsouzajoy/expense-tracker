import "./Expense.css";
import { storeToPumkinDB, getFromPumkinDB } from "../../utils";
import { useState } from "react";
import DeleteIcon from "../../images/x-circle.svg";
import { v4 as uuid } from "uuid";

const Expense = () => {
  const [expenses, setExpenses] = useState(getFromPumkinDB("expenses") || []);
  const [expense, setExpense] = useState({ item: "", person: "", amount: "" });
  const [people] = useState(getFromPumkinDB("people") || []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (expense.item && expense.person && expense.amount) {
      const updatedExpenses = [...expenses, { id: uuid(), ...expense }];
      setExpenses(updatedExpenses);
      storeToPumkinDB("expenses", updatedExpenses);
      setExpense({ item: "", person: "", amount: "" });
    }
  };

  const handleOnClick = (e) => {
    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== e.target.id
    );
    setExpenses(updatedExpenses);
    storeToPumkinDB("expenses", updatedExpenses);
  };

  const handleOnChange = (e) => {
    const key = e.target.id;
    const value = e.target.value;
    if (key === "amount" && parseInt(value) <= 0) return;
    setExpense({
      ...expense,
      [key]: value,
    });
  };

  return (
    <form className="form-container" onSubmit={handleOnSubmit}>
      <div>
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="list list--hoverable"
            onClick={handleOnClick}
            id={expense.id}
          >
            <img src={DeleteIcon} alt="delete icon" className="list__icon" />
            {expense.item} | ₹{expense.amount} | {people.find(person => person.id === expense.person).name}
          </div>
        ))}
      </div>
      <div className="form-control">
        <label className="form-label">Spent on: </label>
        <input
          className="input"
          type="text"
          value={expense.item}
          id="item"
          onChange={handleOnChange}
        />
      </div>
      <div className="form-control">
        <label className="form-label">Spent By: </label>
        {people.length > 0 ? (
          <select
            className="input"
            id="person"
            value={expense.person}
            onChange={handleOnChange}
          >
            <option value="">--Select a person--</option>
            {people.map((person, index) => (
              <option value={person.id} key={index}>
                {person.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="list">
            --please add friends to your group before adding expenses--
          </div>
        )}
      </div>
      <div className="form-control">
        <label className="form-label">Amount</label>
        <input
          className="input"
          type="number"
          value={expense.amount}
          id="amount"
          onChange={handleOnChange}
        />
      </div>
      <button type="submit" className="button ">
        Add
      </button>
    </form>
  );
};

export default Expense;
