import { useState } from "react";

function MealDBApp() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meals");
      }

      const data = await response.json();

      if (!data.meals) {
        setResults([]);
        setError("No meals found.");
      } else {
        setResults(data.meals);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>🍽️ MealDB Explorer</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search meals (e.g. chicken, pasta)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Search
        </button>
      </form>

      {loading && <p>🔍 Searching...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={gridStyle}>
        {results.map((meal) => (
          <div key={meal.idMeal} style={cardStyle}>
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h4>{meal.strMeal}</h4>
            <p><strong>Category:</strong> {meal.strCategory}</p>
            <p><strong>Area:</strong> {meal.strArea}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- STYLES ----------------

const containerStyle = {
  maxWidth: "800px",
  margin: "auto",
  padding: "20px",
  fontFamily: "Arial, sans-serif"
};

const inputStyle = {
  padding: "10px",
  width: "70%",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "10px 15px",
  marginLeft: "10px",
  cursor: "pointer"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px"
};

const cardStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  borderRadius: "10px",
  textAlign: "center"
};

export default MealDBApp;