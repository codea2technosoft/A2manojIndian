import React from "react";

const SelectOptionExample = ({ options, onChange }) => {
  return (
    <div>
      {/* <label htmlFor="status-select" style={{ marginRight: "8px" }}>
        Status:
      </label> */}
      <select
        id="status-select"
        style={{
          padding: "8px",
          width: "100%",
          borderColor: "#912828",
          borderRadius: "16px",
          fontFamily: "cursive",
        }}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" style={{ fontFamily: "cursive" }}>
          Select Status
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            style={{
              fontFamily: "cursive",
              color:
                option.display === "Pending"
                  ? "rgb(197, 0, 255)"
                  : option.display === "Success"
                    ? "green"
                    : option.display === "Refund"
                      ? "#0a64f5"
                      : option.display === "Faild"
                        ? "red"
                        : "inherit",
            }}
          >
            {option.display}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectOptionExample;
