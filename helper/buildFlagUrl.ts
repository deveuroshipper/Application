import { nameMap } from "@/constants/country";

export const CountryImage = (name: String) => {
  const code = nameMap[name?.toLowerCase()];
  return `https://flagcdn.com/w80/${code}.png`;
};
