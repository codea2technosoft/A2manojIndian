import React from "react";

const SearchClient = () => {
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>SEARCH CLIENT</h3>
        <button style={styles.backBtn}>Back</button>
      </div>

      {/* Search Box */}
      <div style={styles.content}>
        <input
          type="text"
          placeholder="Search Code"
          style={styles.input}
        />
        <br />
        <button style={styles.searchBtn}>Search</button>
      </div>

      {/* Bottom Empty Area */}
    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f2f2f2",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    backgroundColor: "#b88a2f",
    color: "#fff",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "bold",
  },

  backBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  content: {
    backgroundColor: "#fff",
    padding: "20px",
  },

  input: {
    width: "280px",
    padding: "8px 10px",
    border: "2px solid #2a74ff",
    borderRadius: "6px",
    outline: "none",
  },

  searchBtn: {
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "7px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  bottomArea: {
    height: "300px",
    background:
      "repeating-linear-gradient(45deg, #eee, #eee 10px, #f5f5f5 10px, #f5f5f5 20px)",
  },
};

export default SearchClient;
