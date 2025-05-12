export function abbreviateCityName(name: string): string {
  const words = name.split(" ");
  if (words.length === 2) {
    return words.map((w) => w[0].toUpperCase() + ".").join("");
  }
  return name;
}
