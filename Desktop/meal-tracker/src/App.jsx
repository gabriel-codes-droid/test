import React, { useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [trackedMeals, setTrackedMeals] = useState([]);
  const [customName, setCustomName] = useState("");
  const [customCalories, setCustomCalories] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔎 Search MealDB
  const searchMeals = async () => {
    if (!search) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meals");
      }

      const data = await response.json();
      setResults(data.meals || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add API Meal
  const addApiMeal = (meal) => {
    const newMeal = {
      id: Date.now(),
      name: meal.strMeal,
      calories: 500 // temporary estimate
    };

    setTrackedMeals([...trackedMeals, newMeal]);
  };

  // ➕ Add Custom Meal
  const addCustomMeal = () => {
    if (!customName || !customCalories) return;

    const newMeal = {
      id: Date.now(),
      name: customName,
      calories: Number(customCalories)
    };

    setTrackedMeals([...trackedMeals, newMeal]);

    setCustomName("");
    setCustomCalories("");
  };

  // 🗑 Delete Meal
  const deleteMeal = (id) => {
    setTrackedMeals(trackedMeals.filter((meal) => meal.id !== id));
  };

  // 🧮 Total Calories
  const totalCalories = trackedMeals.reduce(
    (total, meal) => total + meal.calories,
    0
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Nutrition Tracker</h1>

      {/* 🔎 Search Section */}
      <h2>Search Meals</h2>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search meal..."
      />
      <button onClick={searchMeals}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {results.map((meal) => (
          <div
            key={meal.idMeal}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px"
            }}
          >
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              style={{ width: "100%" }}
            />
            <h4>{meal.strMeal}</h4>
            <button onClick={() => addApiMeal(meal)}>
              Add to Tracker
            </button>
          </div>
        ))}
      </div>

      <hr />

      {/* ➕ Custom Meal Section */}
      <h2>Add Custom Meal</h2>
      <input
        value={customName}
        onChange={(e) => setCustomName(e.target.value)}
        placeholder="Meal name"
      />
      <input
        type="number"
        value={customCalories}
        onChange={(e) => setCustomCalories(e.target.value)}
        placeholder="Calories"
      />
      <button onClick={addCustomMeal}>Add Custom Meal</button>

      <hr />

      {/* 📋 Tracked Meals */}
      <h2>Tracked Meals</h2>

      {trackedMeals.map((meal) => (
        <div key={meal.id}>
          <p>
            {meal.name} — {meal.calories} kcal
          </p>
          <button onClick={() => deleteMeal(meal.id)}>
            Delete
          </button>
        </div>
      ))}

      <h3>Total Calories: {totalCalories}</h3>
    </div>
  );
}

export default App;