import React, { useEffect, useState } from "react";
import './App.css'

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);

  useEffect(() => {
    fetch("https://api.frankfurter.app/currencies")
      .then((res) => res.json())
      .then((data) => {
        const currencyKeys = Object.keys(data);
        setCurrencies(currencyKeys);
        setFromCurrency("USD");
        setToCurrency("INR");
      });
  }, []);

  const handleConvert = () => {
    if (fromCurrency === toCurrency) {
      setConverted(amount);
      return;
    }

    fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
    )
      .then((res) => res.json())
      .then((data) => {
        setConverted(data.rates[toCurrency]);
      });
  };

  return (
    <div className="container">
    <h2>Currency Converter</h2>

    <div className="inputRow">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
        {currencies.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </select>

      <span style={{ fontSize: "24px", fontWeight: "bold" }}>→</span>

      <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
        {currencies.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </select>
    </div>

    <button onClick={handleConvert}>Convert</button>

    {converted && (
      <h3>
        {amount} {fromCurrency} = {converted} {toCurrency}
      </h3>
    )}
  </div>
  );
}

export default App
