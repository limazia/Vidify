import { categorizedSuggestions } from "../suggestions";

export function randomSuggestions() {
  return categorizedSuggestions.map((category) => {
    const randomItem =
      category.items[Math.floor(Math.random() * category.items.length)];
    return { name: category.name, icon: category.icon, text: randomItem };
  });
}
