import moment from "moment";

export const formatDate = (targetDate) => {
  const date = moment(targetDate);

  if (date.fromNow() === "a few seconds ago") {
    return "just now";
  }
  const formatedDate = date.fromNow().trim().replace(/[ ]+/, " ").split(" ");

  let number = formatedDate[0];
  const char = formatedDate[1].split("")[0];

  if (Number(number) >= 7 && Number(number) <= 31 && char === "d") {
    let num = Math.floor(Number(number) / 7);
    return `${num} w`;
  }

  if (number === "a" || number === "an") {
    number = "1";
  }

  return `${number} ${char}`;
};
// console.log(formatDate("2025-01-24T13:48:00"));

export const tenMin = 10 * 60 * 1000;

export const formatMessagesDate = (targetDate) => {
  const date = moment(targetDate).format("llll");
  return date;
};
