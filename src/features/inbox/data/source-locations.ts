// Geocoded source locations. Key = entry.id
// countryId = ISO numeric (matches world-atlas `id`)
export const sourceLocations: Record<
  string,
  { name: string; coords: [number, number]; countryId: string }
> = {
  "1": {
    name: "Bonn, Germany (BMZ)",
    coords: [7.0982, 50.7374],
    countryId: "276",
  },
  "2": {
    name: "Bujumbura, Burundi",
    coords: [29.3599, -3.3614],
    countryId: "108",
  },
  "3": { name: "Berlin, Germany", coords: [13.405, 52.52], countryId: "276" },
  "4": {
    name: "Nairobi, Kenya (Reuters Africa)",
    coords: [36.8219, -1.2921],
    countryId: "404",
  },
  "5": {
    name: "Düsseldorf, Germany",
    coords: [6.7735, 51.2277],
    countryId: "276",
  },
  "6": {
    name: "Nairobi, Kenya (UNICEF ESARO)",
    coords: [36.8219, -1.2921],
    countryId: "404",
  },
  "7": {
    name: "Gitega, Burundi",
    coords: [29.9246, -3.4271],
    countryId: "108",
  },
  "8": {
    name: "Bonn, Germany (VENRO)",
    coords: [7.0982, 50.7374],
    countryId: "276",
  },
  "9": {
    name: "Brussels, Belgium (EU)",
    coords: [4.3517, 50.8503],
    countryId: "056",
  },
  "10": {
    name: "Brazzaville, WHO Africa",
    coords: [15.2832, -4.2634],
    countryId: "178",
  },
  "11": {
    name: "Ngozi, Burundi",
    coords: [29.8306, -2.9075],
    countryId: "108",
  },
  "12": {
    name: "Aachen, Germany (Misereor)",
    coords: [6.0838, 50.7753],
    countryId: "276",
  },
  "13": {
    name: "Kigali, Rwanda",
    coords: [30.0619, -1.9441],
    countryId: "646",
  },
  "14": {
    name: "Rumonge, Burundi",
    coords: [29.4386, -3.9758],
    countryId: "108",
  },
  "15": {
    name: "Abidjan, Côte d'Ivoire (AfDB)",
    coords: [-4.0083, 5.3599],
    countryId: "384",
  },
  "16": {
    name: "Stuttgart, Germany (Bosch)",
    coords: [9.1829, 48.7758],
    countryId: "276",
  },
  "17": {
    name: "Muyinga, Burundi",
    coords: [30.3414, -2.8458],
    countryId: "108",
  },
  "18": {
    name: "Kinshasa, DR Congo",
    coords: [15.2663, -4.4419],
    countryId: "180",
  },
  "19": {
    name: "Bonn, Germany (GIZ)",
    coords: [7.0982, 50.7374],
    countryId: "276",
  },
  "20": {
    name: "Washington DC, USA (Devex)",
    coords: [-77.0369, 38.9072],
    countryId: "840",
  },
  "21": {
    name: "Bujumbura, Burundi (M&E)",
    coords: [29.3599, -3.3614],
    countryId: "108",
  },
  "22": {
    name: "Berlin, Germany (WTG monitoring)",
    coords: [13.405, 52.52],
    countryId: "276",
  },
  "23": {
    name: "Nairobi, Kenya (WTG monitoring)",
    coords: [36.8219, -1.2921],
    countryId: "404",
  },
};
