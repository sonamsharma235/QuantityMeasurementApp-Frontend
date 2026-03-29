// ---------------- TYPES DATA ----------------
const data = {
  length: {
    meter: 1,
    kilometer: 0.001,
    centimeter: 100
  },
  volume: {
    liter: 1,
    milliliter: 1000
  },
  temperature: "temp"
};

let currentType = "length";

// ---------------- ELEMENTS ----------------
const types = document.querySelectorAll(".type");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const value = document.getElementById("value");
const result = document.getElementById("result");

// ---------------- SWITCH TYPE ----------------
types.forEach(btn => {
  btn.onclick = () => {
    types.forEach(t => t.classList.remove("active"));
    btn.classList.add("active");

    currentType = btn.dataset.type;
    loadUnits();
    convert();
  };
});

// ---------------- LOAD UNITS ----------------
function loadUnits() {
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  if (currentType === "temperature") {
    ["celsius", "fahrenheit"].forEach(u => {
      fromUnit.add(new Option(u, u));
      toUnit.add(new Option(u, u));
    });
    return;
  }

  const units = data[currentType];
  Object.keys(units).forEach(u => {
    fromUnit.add(new Option(u, u));
    toUnit.add(new Option(u, u));
  });
}

// ---------------- CONVERT ----------------
function convert() {
  const val = parseFloat(value.value);

  if (isNaN(val)) {
    result.value = "";
    return;
  }

  if (currentType === "temperature") {
    if (fromUnit.value === "celsius" && toUnit.value === "fahrenheit") {
      result.value = (val * 9/5) + 32;
    } else if (fromUnit.value === "fahrenheit" && toUnit.value === "celsius") {
      result.value = (val - 32) * 5/9;
    } else {
      result.value = val;
    }
    return;
  }

  const units = data[currentType];
  const res = (val / units[fromUnit.value]) * units[toUnit.value];
  result.value = res;
}

// ---------------- EVENTS ----------------
value.addEventListener("input", convert);
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);

// Init
loadUnits();