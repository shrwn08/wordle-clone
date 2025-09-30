export const WORDS = [
"penny","money","apple","honey","happy","funny","sunny","jazzy","poppy","mercy",
"lucky","fuzzy","crazy","witty","kitty","jolly","silly","golly","folly","bully",
"nifty","shiny","windy","rocky","crisp","sharp","spicy","tasty","juicy","berry",
"lemon","melon","grape","bread","chair","couch","light","water","sweet","salty",
"sugar","spoon","plate","glass","plant","earth","world","dream","smile","laugh",
"peace","trust","grace","glory","honor","faith","brave","smart","quick","quiet",
"early","later","night","cloud","storm","rainy","snowy","frost","beach","river",
"ocean","shore","grass","field","woods","mount","stone","metal","candy","cakes",
"fries","pizza","toast","juice","drink","tears","blood","heart","brain","nerve",
"bones","hands","faces","bench","cabin","house","rooms","doors","walls","beams",
"music","songs","notes","piano","drums","viola","cello","flute","harps","shoes",
"boots","pants","shirt","dress","scarf","socks","jewel","rings","pearl","books",
"novel","story","pages","paper","cover","title","index","chart","graph","phone",
"mouse","wires","cable","cords","chips","board","clock","games","chess","cards",
"token","score","match","level","start","reset","smoke","flame","burns","ashes",
"steam","dusty","round","point","curve","angle","edges","lines","shape","solid",
"plane","crown","shine","taste","touch","reach","blend","swift","bloom","flora",
"fauna","crane","shark","whale","eagle","tiger","zebra","camel","sheep","goose",
"ducks","crowd","gloom","spark","flock","glove","pride","flood","wheat","grind",
"grain","meats","sauce","cream","olive","spice","herbs","onion","beans","pulse",
"mango","peach","plums","pears","guava","dates","chili","minty","basil","scent",
"roses","lilac","tulip","daisy","vines","roots","seeds","crops","vital","solar",
"lunar","oasis","ridge","valve","slope","blaze","creek","caves","mines","rocks",
"sands","desks","stool","shelf","lamps","sofas","muggy","brows","paint","brush",
"color","shade","white","black","green","brown","beige","ivory","amber","coral",
"azure","golds","steel","titan","zincs","bacon","basic","batch","beard","begin",
"below","block","blues","bring","build","carry","catch","clean","clear","cling",
"close","coach","coast","crack","craft","crash","cycle","delta","drive","eager",
"eight","enter","event","extra","fairy","grand","great","habit","ideal","input",
"issue","judge","knock","layer","logic","medal","mimic","overt","proud","quota",
"about","dummy",
];

export const getRandomWord = () => {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
};

// Function to validate if a word exists in the list
export const isValidWord = (word) => {
  return WORDS.includes(word.toLowerCase());
};
