import "./People.css";
import { storeToPumkinDB, getFromPumkinDB } from "../../utils";
import { useState } from "react";
import DeleteIcon from "../../images/x-circle.svg";
import { v4 as uuid } from "uuid";

const People = () => {
  const [people, setPeople] = useState(getFromPumkinDB("people") || []);
  const [person, setPerson] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (person.length > 0) {
      const updatedPeople = [...people, { name: person, id: uuid() }];
      setPeople(updatedPeople);
      storeToPumkinDB("people", updatedPeople);
      setPerson("");
    }
  };

  const handleOnChange = (e) => {
    setPerson(e.target.value);
  };

  const handleOnClick = (e) => {
    const updatedPeople = people.filter((person) => person.id !== e.target.id);
    setPeople(updatedPeople);
    storeToPumkinDB("people", updatedPeople);
  };

  return (
    <form className="form-container" onSubmit={handleOnSubmit}>
      <div>
        {people.map((person, index) => (
          <div key={index} className="list list--hoverable" onClick={handleOnClick} id={person.id}>
            <img src={DeleteIcon} alt="delete icon" className="list__icon" />
            {person.name}
          </div>
        ))}
      </div>
      <div className="form-control">
        <label className="form-label">Name</label>
        <input
          className="input"
          type="text"
          value={person}
          onChange={handleOnChange}
        />
      </div>
      <button type="submit" className="button ">
        Add
      </button>
    </form>
  );
};

export default People;
