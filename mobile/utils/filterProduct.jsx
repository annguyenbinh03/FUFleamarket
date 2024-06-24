import React from "react";

const sortProductsByDate = (data, ascending = true) => {
  data.sort((a, b) => {
    const aDate = new Date(a.createdDate);
    const bDate = new Date(b.createdDate);

    // Compare only the date parts (ignoring time)
    const aYear = aDate.getFullYear();
    const aMonth = aDate.getMonth();
    const aDay = aDate.getDate();

    const bYear = bDate.getFullYear();
    const bMonth = bDate.getMonth();
    const bDay = bDate.getDate();

    if (aYear !== bYear) {
      return ascending ? aYear - bYear : bYear - aYear;
    } else if (aMonth !== bMonth) {
      return ascending ? aMonth - bMonth : bMonth - aMonth;
    } else {
      return ascending ? aDay - bDay : bDay - aDay;
    }
  });
  return data;
};

const sortProductsByPrice = (data, ascending = true) => {
  data.sort((a, b) => {
    return ascending ? a.price - b.price : b.price - a.price;
  });
  return data;
};

export { sortProductsByDate, sortProductsByPrice };
