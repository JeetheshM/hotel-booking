const listingCategories = [
  "Trending",
  "Rooms",
  "Iconic cities",
  "Mountains",
  "Castels",
  "Amazing pools",
  "Camping",
  "Farms",
  "Arctic",
  "Domes",
  "Boats",
];

const categoryKeywordMap = {
  Trending: /trending|popular|luxury|historic|villa|retreat/i,
  Rooms: /room|apartment|loft|penthouse|suite/i,
  "Iconic cities": /city|downtown|tokyo|boston|miami|amsterdam|new york|los angeles/i,
  Mountains: /mountain|alps|banff|aspen|highlands|chalet|cabin/i,
  Castels: /castle|fort|historic/i,
  "Amazing pools": /pool|beachfront|villa|resort|infinity/i,
  Camping: /camp|cabin|lodge|outdoor|nature/i,
  Farms: /farm|cottage|countryside|ranch/i,
  Arctic: /arctic|snow|ski|winter|ice/i,
  Domes: /dome|igloo|geodesic/i,
  Boats: /boat|lake|canal|island|waterfront|shore/i,
};

module.exports = {
  listingCategories,
  categoryKeywordMap,
};
