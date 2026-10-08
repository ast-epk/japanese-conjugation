import wordTypes from "../data/wordTypes.json";

function wordTypeToDisplayText(type) {
  return wordTypes[type] ?? "Unknown";
}

export {
    wordTypeToDisplayText
}