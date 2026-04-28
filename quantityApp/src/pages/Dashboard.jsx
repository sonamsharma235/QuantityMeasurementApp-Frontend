
import { useState, useEffect } from "react";
// import { UNITS, TEMP_UNITS, TYPE_META } from "../utils/converter";
import { UNITS, TEMP_UNITS, TYPE_META } from "../utils/converter";
import { convertQuantity } from "../services/quantityService";
import { getHistory } from "../services/quantityService";

import "../styles/dashboard.css";

const unitMap = {
  // LENGTH
  feet: "FEET",
  inches: "INCHES",
  yards: "YARDS",
  centimeters: "CENTIMETERS",

  // VOLUME
  litre: "LITRE",
  millilitre: "MILLILITRE",
  gallon: "GALLON",

  // MASS
  kilograms: "KILOGRAMS",
  grams: "GRAMS",
  pounds: "POUNDS",

  // TEMPERATURE
  celsius: "CELSIUS",
  fahrenheit: "FAHRENHEIT",
  kelvin: "KELVIN"
};

export default function Dashboard({ user, onLogout }) {
  const [type,        setType]        = useState("length");
  const [fromUnit,    setFromUnit]    = useState("meter");
  const [toUnit,      setToUnit]      = useState("kilometer");
  const [inputVal,    setInputVal]    = useState("");
  const [history,     setHistory]     = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [result, setResult] = useState("");

  const units = type === "temperature" ? TEMP_UNITS : Object.keys(UNITS[type]);

  // Reset units when type changes
  useEffect(() => {
    const u = type === "temperature" ? TEMP_UNITS : Object.keys(UNITS[type]);
    setFromUnit(u[0]);
    setToUnit(u[1] || u[0]);
    setInputVal("");
  }, [type]);

  useEffect(() => {

  if (inputVal === "") {
    setResult("");
    return;
  }

  const fetchResult = async () => {

    try {

     const typeMap = {
      length: "LengthUnit",
      volume: "VolumeUnit",
      mass: "WeightUnit",
      temperature: "TemperatureUnit"
    };

    const request = {
     quantityValue: parseFloat(inputVal),
     unit: unitMap[fromUnit],
     measurementType: typeMap[type],
     targetUnit: unitMap[toUnit]
    };

      const response = await convertQuantity(request);

      setResult(response.value);

    } catch (err) {
      console.error("Conversion failed", err);
    }
  };

  fetchResult();

}, [inputVal, fromUnit, toUnit, type]);

  const handleBlur = () => {
    if (result === "" || inputVal === "") return;
    setHistory(h => [{
      from: `${inputVal} ${fromUnit}`,
      to:   `${result} ${toUnit}`,
      type,
      time: new Date().toLocaleTimeString(),
    }, ...h].slice(0, 20));
  };

  

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  onLogout();
};

  return (
    <div className="dashboard">

      {/* ── Header ── */}
      <div className="header">
        <div className="header__brand">
          <span className="header__brand-icon">⚗️</span>
          <span className="header__brand-name">Quantity Measurement</span>
        </div>
        <div className="header__actions">
          <button
            className={`btn-history ${showHistory ? "active" : ""}`}
            onClick={() => setShowHistory(s => !s)}
          >
            History {history.length > 0 && `(${history.length})`}
          </button>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* ── Banner ── */}
      <div className="banner">
        Welcome, {user.name} — Convert anything, instantly ✨
      </div>

      {/* ── Main ── */}
      <div className="main">

        {/* Type cards */}
        <p className="section-label">Choose Type</p>
        <div className="types">
          {TYPE_META.map(t => (
            <div
              key={t.key}
              className={`type-card ${type === t.key ? "active" : ""}`}
              onClick={() => setType(t.key)}
            >
              <div className="type-card__icon">{t.icon}</div>
              <div className="type-card__label">{t.label}</div>
            </div>
          ))}
        </div>

        {/* Converter */}
        <div className="converter-box">
          <div className="converter-row">

            {/* FROM */}
            <div className="conv-field">
              <span className="conv-field__label">From</span>
              <input
                className="conv-field__input"
                type="number"
                placeholder="Enter value…"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onBlur={handleBlur}
              />
              <select
                className="conv-field__select"
                value={fromUnit}
                onChange={e => setFromUnit(e.target.value)}
              >
                {units.map(u => (
                  <option key={u} value={u}>
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap */}
            <div className="swap-col">
              <button className="swap-btn" onClick={handleSwap} title="Swap units">⇄</button>
              <span className="swap-label">SWAP</span>
            </div>

            {/* TO */}
            <div className="conv-field">
              <span className="conv-field__label">To</span>
              <div className={`conv-field__result ${result !== "" ? "has-value" : ""}`}>
                {result !== "" ? result : "—"}
              </div>
              <select
                className="conv-field__select"
                value={toUnit}
                onChange={e => setToUnit(e.target.value)}
              >
                {units.map(u => (
                  <option key={u} value={u}>
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Formula strip */}
          {result !== "" && (
            <div className="formula-strip">
              {inputVal} {fromUnit} = <strong>{result} {toUnit}</strong>
            </div>
          )}
        </div>

        {/* History */}
        {showHistory && (
          <div className="history-panel">
            <div className="history-panel__header">
              <span className="history-panel__title">Conversion History</span>
              {history.length > 0 && (
                <button className="btn-clear" onClick={() => setHistory([])}>Clear all</button>
              )}
            </div>

            {history.length === 0
              ? <p className="history-empty">No conversions yet.</p>
              : history.map((h, i) => (
                <div key={i} className="history-item">
                  <span className="history-item__formula">{h.from} → {h.to}</span>
                  <div className="history-item__meta">
                    <span className="history-badge">{h.type}</span>
                    <span className="history-time">{h.time}</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}

      </div>
    </div>
  );
}
