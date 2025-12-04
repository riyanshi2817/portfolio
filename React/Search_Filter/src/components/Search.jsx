// src/components/Search.jsx
import React, { useState } from "react";
import { AllData } from "./Data";

const Search = () => {
  const [store] = useState(AllData);
  const [data, setData] = useState("");

  const getData = (e) => {
    setData(e.target.value.toLowerCase());
  };

  const filterOut = store.filter((curValue) => {
    const nameMatch = curValue.name.toLowerCase().includes(data);
    const priceMatch = curValue.price.toString().includes(data);
    return nameMatch || priceMatch;
  });

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search by name or price.."
        value={data}
        onChange={getData}
      />

      <div className="type">
        <h3>Name</h3>
        <h3>Price</h3>
        <h3>Image</h3>
      </div>

      {filterOut.map((cur) => (
        <div className="itemList" key={cur.id}>
          <p>{cur.name}</p>
          <p>{cur.price}</p>
          <img src={cur.img} alt={cur.name} />
        </div>
      ))}
    </div>
  );
};

export default Search;
