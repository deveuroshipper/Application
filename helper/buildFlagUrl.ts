import { nameMap, normalizeCountryName } from "@/constants/country";

export const CountryImage = (name?: string | null) => {
  const code = nameMap[normalizeCountryName(name)];
  return code ? `https://flagcdn.com/w80/${code}.png` : "";
};
