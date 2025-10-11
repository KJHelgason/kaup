export interface Category {
  value: string
  label: string
  slug: string // English URL-friendly slug
  subcategories: {
    value: string
    slug: string // English URL-friendly slug for subcategory
    subSubcategories: string[]
  }[]
}

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug)
}

// Helper function to get subcategory by slug
export function getSubcategoryBySlug(category: Category, slug: string) {
  return category.subcategories.find(sc => sc.slug === slug)
}

// Helper function to get slug from category value
export function getSlugFromValue(value: string): string {
  return categories.find(c => c.value === value)?.slug || value
}

// Helper function to convert Icelandic text to URL-friendly slug
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[áàâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/ð/g, 'd')
    .replace(/þ/g, 'th')
    .replace(/[^a-z0-9-]/g, '')
}

export const categories: Category[] = [
  { 
    value: "Rafeindatækni", 
    label: "Rafeindatækni",
    slug: "electronics",
    subcategories: [
      { value: "Símar og spjaldtölvur", slug: "phones-tablets", subSubcategories: ["Snjallsímar", "Spjaldtölvur", "Símahlífar og fylgihlutir", "Hleðslutæki", "Annað"] },
      { value: "Tölvur", slug: "computers", subSubcategories: ["Fartölva", "Borðtölva", "Allt-í-einu", "Netbók", "Tölvuskjáir", "Tölvuhlutir", "Lyklaborð og mýs", "Annað"] },
      { value: "Myndavélar", slug: "cameras", subSubcategories: ["Stafrænar myndavélar", "Linsa", "Þríróður og búnaður", "Myndavélarhlífar", "Annað"] },
      { value: "Hljóðbúnaður", slug: "audio", subSubcategories: ["Heyrnartól", "Hátalara", "Hljómtæki", "Hljóðkerfisbúnaður", "Annað"] },
      { value: "Tölvuleikir & Leikjatölvur", slug: "gaming", subSubcategories: ["PlayStation", "Xbox", "Nintendo", "Leikir", "Fylgihlutir", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Tíska", 
    label: "Tíska",
    slug: "fashion",
    subcategories: [
      { value: "Föt - Karlar", slug: "mens-clothing", subSubcategories: ["Jakkar og kápur", "Bolir og skyrtur", "Buxur", "Jakkafatnaður", "Íþróttafatnaður", "Annað"] },
      { value: "Föt - Konur", slug: "womens-clothing", subSubcategories: ["Kjólar", "Bolir og toppar", "Buxur", "Pils", "Jakkar", "Annað"] },
      { value: "Föt - Börn", slug: "kids-clothing", subSubcategories: ["Drengir", "Stúlkur", "Ungbörn", "Annað"] },
      { value: "Skór", slug: "shoes", subSubcategories: ["Karlaskór", "Kvennaskór", "Barnaskór", "Íþróttaskór", "Stígvél", "Annað"] },
      { value: "Fylgihlutir", slug: "accessories", subSubcategories: ["Töskur og veski", "Hattar", "Belti", "Sjal og treflar", "Hanskar", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Heimili & Garður", 
    label: "Heimili & Garður",
    slug: "home-garden",
    subcategories: [
      { value: "Húsgögn", slug: "furniture", subSubcategories: ["Sófar og stólar", "Borð", "Rúm", "Skápar", "Hillur", "Annað"] },
      { value: "Eldhúsbúnaður", slug: "kitchen", subSubcategories: ["Pottaefni", "Borðbúnaður", "Smátæki", "Geymsla", "Annað"] },
      { value: "Skraut", slug: "decor", subSubcategories: ["Veggskraut", "Kerti", "Púðar", "Teppi", "Ljós", "Annað"] },
      { value: "Verkfæri", slug: "tools", subSubcategories: ["Rafverkfæri", "Handverkfæri", "Málningarbúnaður", "Mælikvarðar", "Annað"] },
      { value: "Garðyrkja", slug: "garden", subSubcategories: ["Garðverkfæri", "Pottur og krukk", "Fræ og plöntur", "Sláttuvélar", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Íþróttir & Útivist", 
    label: "Íþróttir & Útivist",
    slug: "sports-outdoors",
    subcategories: [
      { value: "Líkamsræktarbúnaður", slug: "fitness", subSubcategories: ["Lóð og búnaður", "Jógabúnaður", "Hjólreiðaþjálfar", "Hlaupaborð", "Annað"] },
      { value: "Hjól", slug: "bikes", subSubcategories: ["Götuhjól", "Fjallahjól", "Rafmagnshjól", "Börn hjól", "Fylgihlutir", "Annað"] },
      { value: "Útivistarfatnaður", slug: "outdoor-clothing", subSubcategories: ["Göngufatnaður", "Gönguskór", "Bakpokar", "Tjöld", "Svefnpokar", "Annað"] },
      { value: "Íþróttafatnaður", slug: "sportswear", subSubcategories: ["Hlaupafatnaður", "Íþróttaskór", "Æfingarfatnaður", "Sundföt", "Annað"] },
      { value: "Gönguskíði", slug: "skiing", subSubcategories: ["Alförin skíði", "Borðskíði", "Skíðastafir", "Hjálmar", "Gleraugu", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Farartæki", 
    label: "Farartæki",
    slug: "vehicles",
    subcategories: [
      { value: "Bílar", slug: "cars", subSubcategories: ["Fólksbílar", "Jeppar", "Sportbílar", "Húsbílar", "Annað"] },
      { value: "Mótorhjól", slug: "motorcycles", subSubcategories: ["Götuhjól", "Krosshjól", "Vespuhjól", "Fjórhjól", "Annað"] },
      { value: "Hjólhýsi", slug: "campers", subSubcategories: ["Tjaldvagnar", "Húsbílahúsgögn", "Annað"] },
      { value: "Varahlutir", slug: "parts", subSubcategories: ["Hjól og dekk", "Hljóðkerfi", "Ljós", "Innri hlutir", "Ytri hlutir", "Annað"] },
      { value: "Fylgihlutir", slug: "accessories", subSubcategories: ["GPS og hleðsla", "Bifreiðaskraut", "Hreinsiefni", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Bækur, Kvikmyndir & Tónlist", 
    label: "Bækur, Kvikmyndir & Tónlist",
    slug: "books-movies-music",
    subcategories: [
      { value: "Bækur", slug: "books", subSubcategories: ["Skáldsögur", "Barnabækur", "Námsbækur", "Ævisögur", "Matreiðslubækur", "Annað"] },
      { value: "Geisladiskar", slug: "cds-dvds", subSubcategories: ["Kvikmyndir - DVD", "Kvikmyndir - Blu-ray", "Tónlist - CD", "Leikir", "Annað"] },
      { value: "Vínylplötur", slug: "vinyl", subSubcategories: ["Rokk", "Popp", "Jazz", "Klassík", "Annað"] },
      { value: "Hljóðfæri", slug: "instruments", subSubcategories: ["Gítarar", "Píanó og hljómborð", "Trommur", "Strengir", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Leikföng & Barnabúnaður", 
    label: "Leikföng & Barnabúnaður",
    slug: "toys-baby",
    subcategories: [
      { value: "Leikföng", slug: "toys", subSubcategories: ["LEGO og byggingarkubbar", "Dúkkur", "Tölvuleikjaleikföng", "Bílar og vélar", "Spil", "Annað"] },
      { value: "Barnavagnar", slug: "strollers", subSubcategories: ["Göngukerru", "Kerrur", "Tvíburavagnar", "Fylgihlutir", "Annað"] },
      { value: "Barnastólar", slug: "baby-seats", subSubcategories: ["Hásæti", "Bílstólar", "Vaggsófar", "Annað"] },
      { value: "Barnafatnaður", slug: "baby-clothing", subSubcategories: ["Ungbörn (0-2 ára)", "Smábörn (2-5 ára)", "Börn (6+ ára)", "Skór", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Heilsa & Snyrtivörur", 
    label: "Heilsa & Snyrtivörur",
    slug: "health-beauty",
    subcategories: [
      { value: "Snyrtivörur", slug: "cosmetics", subSubcategories: ["Förðun", "Neglur", "Ilmvatn", "Tól", "Annað"] },
      { value: "Húðvörur", slug: "skincare", subSubcategories: ["Andlitskrem", "Húðhreinsivörur", "Sólarvörn", "Annað"] },
      { value: "Heilsuvörur", slug: "health", subSubcategories: ["Vítamín", "Næringarefni", "Fyrstu hjálp", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Safngripir & List", 
    label: "Safngripir & List",
    slug: "collectibles-art",
    subcategories: [
      { value: "Listaverk", slug: "art", subSubcategories: ["Málverk", "Myndir", "Skúlptúrar", "Annað"] },
      { value: "Fornmunir", slug: "antiques", subSubcategories: ["Húsgögn", "Skartgripir", "Myntir", "Annað"] },
      { value: "Safnkort", slug: "trading-cards", subSubcategories: ["Íþróttakort", "Pokémon", "Magic", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Gæludýravörur", 
    label: "Gæludýravörur",
    slug: "pet-supplies",
    subcategories: [
      { value: "Hundavörur", slug: "dogs", subSubcategories: ["Hundfóður", "Leikföng", "Beð", "Hálsbönd og taumar", "Annað"] },
      { value: "Kattavörur", slug: "cats", subSubcategories: ["Kattafóður", "Húsgögn", "Leikföng", "Sandkassar", "Annað"] },
      { value: "Fiskar & Búnaður", slug: "fish", subSubcategories: ["Fiskabúr", "Síur", "Búnaður", "Fiskur", "Annað"] },
      { value: "Fuglabúnaður", slug: "birds", subSubcategories: ["Búr", "Fóður", "Leikföng", "Annað"] },
      { value: "Smádýr", slug: "small-animals", subSubcategories: ["Búr", "Fóður", "Annað"] },
      { value: "Skriðdýr", slug: "reptiles", subSubcategories: ["Terrarium", "Hiti og ljós", "Fóður", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Skartgripir & Úr", 
    label: "Skartgripir & Úr",
    slug: "jewelry-watches",
    subcategories: [
      { value: "Úr", slug: "watches", subSubcategories: ["Karlaúr", "Kvennaúr", "Snjallúr", "Fylgihlutir", "Annað"] },
      { value: "Fínlegir skartgripir", slug: "fine-jewelry", subSubcategories: ["Hringir", "Hálsmen", "Armbönd", "Eyrnalokkar", "Annað"] },
      { value: "Tískuskartgripir", slug: "fashion-jewelry", subSubcategories: ["Hringir", "Hálsmen", "Armbönd", "Eyrnalokkar", "Annað"] },
      { value: "Fornir skartgripir", slug: "vintage-jewelry", subSubcategories: ["Hringir", "Broskar", "Hálsmen", "Annað"] },
      { value: "Karlaskartgripir", slug: "mens-jewelry", subSubcategories: ["Hringir", "Armbönd", "Hálsmen", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Fyrirtæki & Iðnaður", 
    label: "Fyrirtæki & Iðnaður",
    slug: "business-industrial",
    subcategories: [
      { value: "Veitingahúsabúnaður", slug: "restaurant-equipment", subSubcategories: ["Eldhúsbúnaður", "Borðbúnaður", "Kælibúnaður", "Annað"] },
      { value: "Heilbrigðisbúnaður", slug: "medical-equipment", subSubcategories: ["Læknistæki", "Rannsóknarfæri", "Annað"] },
      { value: "Þungavinnuvélar", slug: "heavy-machinery", subSubcategories: ["Gröfur", "Lyftarar", "Vélar", "Annað"] },
      { value: "Rafbúnaður", slug: "electrical", subSubcategories: ["Strengir og kabal", "Rofa", "Ljós", "Annað"] },
      { value: "Skrifstofubúnaður", slug: "office-equipment", subSubcategories: ["Prentarar", "Pappír", "Húsgögn", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Miðar & Ferðalög", 
    label: "Miðar & Ferðalög",
    slug: "tickets-travel",
    subcategories: [
      { value: "Tónleikamiðar", slug: "concert-tickets", subSubcategories: ["Rokk og Popp", "Klassík", "Jazz", "Annað"] },
      { value: "Íþróttamiðar", slug: "sports-tickets", subSubcategories: ["Fótbolti", "Körfubolti", "Handbolti", "Annað"] },
      { value: "Viðburðamiðar", slug: "event-tickets", subSubcategories: ["Leikhús", "Stand-up", "Viðburðir", "Annað"] },
      { value: "Ferðapakkar", slug: "travel-packages", subSubcategories: ["Flug og hótel", "Rútupakkar", "Annað"] },
      { value: "Farangur", slug: "luggage", subSubcategories: ["Ferðatöskur", "Bakpokar", "Handtöskur", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Þjónusta", 
    label: "Þjónusta",
    slug: "services",
    subcategories: [
      { value: "Uppboðsþjónusta", slug: "auction-services", subSubcategories: ["Skráning", "Ljósmyndun", "Annað"] },
      { value: "Vef & Tölvuþjónusta", slug: "web-it-services", subSubcategories: ["Vefhönnun", "Forritun", "Tölvuviðgerðir", "Annað"] },
      { value: "Prentun", slug: "printing", subSubcategories: ["Nafnspjöld", "Merki", "Annað"] },
      { value: "Viðgerðarþjónusta", slug: "repair-services", subSubcategories: ["Tölvur", "Símar", "Annað"] },
      { value: "Listaþjónusta", slug: "art-services", subSubcategories: ["Ljósmyndun", "Hönnun", "Annað"] },
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  },
  { 
    value: "Annað", 
    label: "Annað",
    slug: "other",
    subcategories: [
      { value: "Annað", slug: "other", subSubcategories: [] }
    ]
  }
]
