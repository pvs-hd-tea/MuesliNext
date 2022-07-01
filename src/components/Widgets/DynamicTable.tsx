import React from "react";

const TableData = [
  { id: 1, fullName: "Noor Khan", age: 25, city: "Patna" },
  { id: 2, fullName: "Rapsan Jani", age: 26, city: "Noida" },
  { id: 3, fullName: "Monika Singh", age: 18, city: "New Delhi" },
  { id: 4, fullName: "Sunil Kumar", age: 22, city: "Jaipur" },
  { id: 5, fullName: "Kajol Kumari", age: 21, city: "Chennai" },
];

function DynamicTable() {
  // get table column

  const column = Object.keys(TableData[1]);
  // get table heading data
  const ThData = () => {
    return column.map((data) => {
      return <th key={data}>{data}</th>;
    });
  };
  // get table row data
  const tdData = () => {
    return TableData.map((data: any) => {
      return (
        <tr key={data.id}>
          {column.map((v) => {
            return <td key={v}>{data[v]}</td>;
          })}
        </tr>
      );
    });
  };
  return (
    <table className="table">
      <thead>
        <tr>{ThData()}</tr>
      </thead>
      <tbody>{tdData()}</tbody>
    </table>
  );
}
export default DynamicTable;
