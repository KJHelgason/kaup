"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'is' | 'en'

type Translations = {
  [key: string]: {
    is: string
    en: string
  }
}

const translations: Translations = {
  // Navigation
  home: { is: 'Heim', en: 'Home' },
  browse: { is: 'Skoða', en: 'Browse' },
  sell: { is: 'Selja', en: 'Sell' },
  myAccount: { is: 'Mínar síður', en: 'My Account' },
  
  // Homepage
  welcome: { is: 'Velkomin í Kaup', en: 'Welcome to Kaup' },
  subtitle: { is: 'Kauptu og seldu í íslenska markaðnum', en: 'Buy and sell in the Icelandic marketplace' },
  featuredListings: { is: 'Úrvalsvörur', en: 'Featured Listings' },
  searchPlaceholder: { is: 'Leita að vörum...', en: 'Search for items...' },
  
  // Listings
  price: { is: 'Verð', en: 'Price' },
  category: { is: 'Flokkur', en: 'Category' },
  condition: { is: 'Ástand', en: 'Condition' },
  viewDetails: { is: 'Skoða nánar', en: 'View Details' },
  placeBid: { is: 'Bjóða', en: 'Place Bid' },
  buyNow: { is: 'Kaupa núna', en: 'Buy Now' },
  
  // Categories - Display names
  electronics: { is: 'Rafeindavörur', en: 'Electronics' },
  fashion: { is: 'Tíska', en: 'Fashion' },
  homeGarden: { is: 'Heimili og garður', en: 'Home & Garden' },
  sports: { is: 'Íþróttir', en: 'Sports' },
  vehicles: { is: 'Farartæki', en: 'Vehicles' },
  allCategories: { is: 'Allir flokkar', en: 'All Categories' },
  all: { is: 'Allt', en: 'All' },
  viewAll: { is: 'Skoða allt', en: 'View All' },
  shopByCategory: { is: 'Versla eftir flokki', en: 'Shop by category' },
  shopPopularCategories: { is: 'Versla vinsæla flokka', en: 'Shop popular categories' },
  subcategories: { is: 'Undirflokkar', en: 'Subcategories' },
  more: { is: 'fleiri', en: 'more' },
  categoryNotFound: { is: 'Flokkur fannst ekki', en: 'Category not found' },
  backToCategories: { is: 'Til baka í flokka', en: 'Back to categories' },
  noListingsInCategory: { is: 'Engar vörur í þessum flokki', en: 'No listings in this category' },
  browseAllListings: { is: 'Skoða allar vörur', en: 'Browse all listings' },
  popularNow: { is: 'Vinsælt núna', en: 'Popular now' },
  
  // Main Category keys (mapping from API values)
  'Rafeindatækni': { is: 'Rafeindatækni', en: 'Electronics' },
  'Tíska': { is: 'Tíska', en: 'Fashion' },
  'Heimili & Garður': { is: 'Heimili & Garður', en: 'Home & Garden' },
  'Íþróttir & Útivist': { is: 'Íþróttir & Útivist', en: 'Sports & Outdoors' },
  'Farartæki': { is: 'Farartæki', en: 'Vehicles' },
  'Bækur, Kvikmyndir & Tónlist': { is: 'Bækur, Kvikmyndir & Tónlist', en: 'Books, Movies & Music' },
  'Leikföng & Barnabúnaður': { is: 'Leikföng & Barnabúnaður', en: 'Toys & Baby Gear' },
  'Heilsa & Snyrtivörur': { is: 'Heilsa & Snyrtivörur', en: 'Health & Beauty' },
  'Safngripir & List': { is: 'Safngripir & List', en: 'Collectibles & Art' },
  'Gæludýravörur': { is: 'Gæludýravörur', en: 'Pet Supplies' },
  'Skartgripir & Úr': { is: 'Skartgripir & Úr', en: 'Jewelry & Watches' },
  'Fyrirtæki & Iðnaður': { is: 'Fyrirtæki & Iðnaður', en: 'Business & Industrial' },
  'Miðar & Ferðalög': { is: 'Miðar & Ferðalög', en: 'Tickets & Travel' },
  'Þjónusta': { is: 'Þjónusta', en: 'Specialty Services' },
  'Annað': { is: 'Annað', en: 'Other' },
  
  // Electronics Subcategories
  'Símar og spjaldtölvur': { is: 'Símar og spjaldtölvur', en: 'Phones & Tablets' },
  'Tölvur': { is: 'Tölvur', en: 'Computers' },
  'Myndavélar': { is: 'Myndavélar', en: 'Cameras' },
  'Hljóðbúnaður': { is: 'Hljóðbúnaður', en: 'Audio Equipment' },
  'Tölvuleikir & Leikjatölvur': { is: 'Tölvuleikir & Leikjatölvur', en: 'Video Games & Consoles' },
  
  // Fashion Subcategories
  'Föt - Karlar': { is: 'Föt - Karlar', en: 'Clothing - Men' },
  'Föt - Konur': { is: 'Föt - Konur', en: 'Clothing - Women' },
  'Föt - Börn': { is: 'Föt - Börn', en: 'Clothing - Kids' },
  'Skór': { is: 'Skór', en: 'Shoes' },
  'Fylgihlutir': { is: 'Fylgihlutir', en: 'Accessories' },
  
  // Home & Garden Subcategories
  'Húsgögn': { is: 'Húsgögn', en: 'Furniture' },
  'Eldhúsbúnaður': { is: 'Eldhúsbúnaður', en: 'Kitchen Supplies' },
  'Skraut': { is: 'Skraut', en: 'Decor' },
  'Verkfæri': { is: 'Verkfæri', en: 'Tools' },
  'Garðyrkja': { is: 'Garðyrkja', en: 'Gardening' },
  
  // Sports & Outdoors Subcategories
  'Líkamsræktarbúnaður': { is: 'Líkamsræktarbúnaður', en: 'Fitness Equipment' },
  'Hjól': { is: 'Hjól', en: 'Bicycles' },
  'Útivistarfatnaður': { is: 'Útivistarfatnaður', en: 'Outdoor Clothing' },
  'Íþróttafatnaður': { is: 'Íþróttafatnaður', en: 'Sports Apparel' },
  'Gönguskíði': { is: 'Gönguskíði', en: 'Skis' },
  
  // Vehicles Subcategories
  'Bílar': { is: 'Bílar', en: 'Cars' },
  'Mótorhjól': { is: 'Mótorhjól', en: 'Motorcycles' },
  'Hjólhýsi': { is: 'Hjólhýsi', en: 'RVs & Campers' },
  'Varahlutir': { is: 'Varahlutir', en: 'Parts' },
  
  // Books, Movies & Music Subcategories
  'Bækur': { is: 'Bækur', en: 'Books' },
  'Geisladiskar': { is: 'Geisladiskar', en: 'CDs & DVDs' },
  'Vínylplötur': { is: 'Vínylplötur', en: 'Vinyl Records' },
  'Hljóðfæri': { is: 'Hljóðfæri', en: 'Musical Instruments' },
  
  // Toys & Baby Gear Subcategories
  'Leikföng': { is: 'Leikföng', en: 'Toys' },
  'Barnavagnar': { is: 'Barnavagnar', en: 'Strollers' },
  'Barnastólar': { is: 'Barnastólar', en: 'Baby Chairs' },
  'Barnafatnaður': { is: 'Barnafatnaður', en: 'Baby Clothing' },
  
  // Health & Beauty Subcategories
  'Snyrtivörur': { is: 'Snyrtivörur', en: 'Cosmetics' },
  'Húðvörur': { is: 'Húðvörur', en: 'Skincare' },
  'Heilsuvörur': { is: 'Heilsuvörur', en: 'Health Products' },
  
  // Collectibles & Art Subcategories
  'Listaverk': { is: 'Listaverk', en: 'Artwork' },
  'Fornmunir': { is: 'Fornmunir', en: 'Antiques' },
  'Safnkort': { is: 'Safnkort', en: 'Trading Cards' },
  
  // Pet Supplies Subcategories
  'Hundavörur': { is: 'Hundavörur', en: 'Dog Supplies' },
  'Kattavörur': { is: 'Kattavörur', en: 'Cat Supplies' },
  'Fiskar & Búnaður': { is: 'Fiskar & Búnaður', en: 'Fish & Aquariums' },
  'Fuglabúnaður': { is: 'Fuglabúnaður', en: 'Bird Supplies' },
  'Smádýr': { is: 'Smádýr', en: 'Small Animals' },
  'Skriðdýr': { is: 'Skriðdýr', en: 'Reptiles' },
  
  // Jewelry & Watches Subcategories
  'Úr': { is: 'Úr', en: 'Watches' },
  'Fínlegir skartgripir': { is: 'Fínlegir skartgripir', en: 'Fine Jewelry' },
  'Tískuskartgripir': { is: 'Tískuskartgripir', en: 'Fashion Jewelry' },
  'Fornir skartgripir': { is: 'Fornir skartgripir', en: 'Vintage Jewelry' },
  'Karlaskartgripir': { is: 'Karlaskartgripir', en: 'Men\'s Jewelry' },
  
  // Business & Industrial Subcategories
  'Veitingahúsabúnaður': { is: 'Veitingahúsabúnaður', en: 'Restaurant Equipment' },
  'Heilbrigðisbúnaður': { is: 'Heilbrigðisbúnaður', en: 'Healthcare & Lab' },
  'Þungavinnuvélar': { is: 'Þungavinnuvélar', en: 'Heavy Equipment' },
  'Rafbúnaður': { is: 'Rafbúnaður', en: 'Electrical Supplies' },
  'Skrifstofubúnaður': { is: 'Skrifstofubúnaður', en: 'Office Equipment' },
  
  // Tickets & Travel Subcategories
  'Tónleikamiðar': { is: 'Tónleikamiðar', en: 'Concert Tickets' },
  'Íþróttamiðar': { is: 'Íþróttamiðar', en: 'Sports Tickets' },
  'Viðburðamiðar': { is: 'Viðburðamiðar', en: 'Event Tickets' },
  'Ferðapakkar': { is: 'Ferðapakkar', en: 'Travel Packages' },
  'Farangur': { is: 'Farangur', en: 'Luggage' },
  
  // Specialty Services Subcategories
  'Uppboðsþjónusta': { is: 'Uppboðsþjónusta', en: 'Auction Services' },
  'Vef & Tölvuþjónusta': { is: 'Vef & Tölvuþjónusta', en: 'Web & Computer Services' },
  'Prentun': { is: 'Prentun', en: 'Printing' },
  'Viðgerðarþjónusta': { is: 'Viðgerðarþjónusta', en: 'Restoration & Repair' },
  'Listaþjónusta': { is: 'Listaþjónusta', en: 'Artistic Services' },
  
  // Electronics Sub-subcategories
  'Snjallsímar': { is: 'Snjallsímar', en: 'Smartphones' },
  'Spjaldtölvur': { is: 'Spjaldtölvur', en: 'Tablets' },
  'Símahlífar og fylgihlutir': { is: 'Símahlífar og fylgihlutir', en: 'Phone Cases & Accessories' },
  'Hleðslutæki': { is: 'Hleðslutæki', en: 'Chargers' },
  'Fartölvur': { is: 'Fartölvur', en: 'Laptops' },
  'Borðtölvur': { is: 'Borðtölvur', en: 'Desktops' },
  'Tölvuskjáir': { is: 'Tölvuskjáir', en: 'Monitors' },
  'Tölvuhlutir': { is: 'Tölvuhlutir', en: 'Computer Parts' },
  'Lyklaborð og mýs': { is: 'Lyklaborð og mýs', en: 'Keyboards & Mice' },
  'Stafrænar myndavélar': { is: 'Stafrænar myndavélar', en: 'Digital Cameras' },
  'Linsa': { is: 'Linsa', en: 'Lenses' },
  'Þríróður og búnaður': { is: 'Þríróður og búnaður', en: 'Tripods & Equipment' },
  'Myndavélarhlífar': { is: 'Myndavélarhlífar', en: 'Camera Cases' },
  'Heyrnartól': { is: 'Heyrnartól', en: 'Headphones' },
  'Hátalara': { is: 'Hátalara', en: 'Speakers' },
  'Hljómtæki': { is: 'Hljómtæki', en: 'Sound Systems' },
  'Hljóðkerfisbúnaður': { is: 'Hljóðkerfisbúnaður', en: 'Audio Equipment' },
  'PlayStation': { is: 'PlayStation', en: 'PlayStation' },
  'Xbox': { is: 'Xbox', en: 'Xbox' },
  'Nintendo': { is: 'Nintendo', en: 'Nintendo' },
  'Leikir': { is: 'Leikir', en: 'Games' },
  
  // Fashion Sub-subcategories
  'Jakkar og kápur': { is: 'Jakkar og kápur', en: 'Jackets & Coats' },
  'Bolir og skyrtur': { is: 'Bolir og skyrtur', en: 'Shirts & T-shirts' },
  'Buxur': { is: 'Buxur', en: 'Pants' },
  'Jakkafatnaður': { is: 'Jakkafatnaður', en: 'Suits' },
  'Kjólar': { is: 'Kjólar', en: 'Dresses' },
  'Bolir og toppar': { is: 'Bolir og toppar', en: 'Tops & Blouses' },
  'Pils': { is: 'Pils', en: 'Skirts' },
  'Jakkar': { is: 'Jakkar', en: 'Jackets' },
  'Drengir': { is: 'Drengir', en: 'Boys' },
  'Stúlkur': { is: 'Stúlkur', en: 'Girls' },
  'Ungbörn': { is: 'Ungbörn', en: 'Infants' },
  'Karlaskór': { is: 'Karlaskór', en: 'Men\'s Shoes' },
  'Kvennaskór': { is: 'Kvennaskór', en: 'Women\'s Shoes' },
  'Barnaskór': { is: 'Barnaskór', en: 'Children\'s Shoes' },
  'Íþróttaskór': { is: 'Íþróttaskór', en: 'Athletic Shoes' },
  'Stígvél': { is: 'Stígvél', en: 'Boots' },
  'Töskur og veski': { is: 'Töskur og veski', en: 'Bags & Wallets' },
  'Hattar': { is: 'Hattar', en: 'Hats' },
  'Belti': { is: 'Belti', en: 'Belts' },
  'Sjal og treflar': { is: 'Sjal og treflar', en: 'Scarves & Shawls' },
  'Hanskar': { is: 'Hanskar', en: 'Gloves' },
  
  // Home & Garden Sub-subcategories
  'Sófar og stólar': { is: 'Sófar og stólar', en: 'Sofas & Chairs' },
  'Borð': { is: 'Borð', en: 'Tables' },
  'Rúm': { is: 'Rúm', en: 'Beds' },
  'Skápar': { is: 'Skápar', en: 'Cabinets' },
  'Hillur': { is: 'Hillur', en: 'Shelves' },
  'Pottaefni': { is: 'Pottaefni', en: 'Cookware' },
  'Borðbúnaður': { is: 'Borðbúnaður', en: 'Dinnerware' },
  'Smátæki': { is: 'Smátæki', en: 'Small Appliances' },
  'Geymsla': { is: 'Geymsla', en: 'Storage' },
  'Veggskraut': { is: 'Veggskraut', en: 'Wall Decor' },
  'Kerti': { is: 'Kerti', en: 'Candles' },
  'Púðar': { is: 'Púðar', en: 'Pillows' },
  'Teppi': { is: 'Teppi', en: 'Rugs' },
  'Ljós': { is: 'Ljós', en: 'Lights' },
  'Rafverkfæri': { is: 'Rafverkfæri', en: 'Power Tools' },
  'Handverkfæri': { is: 'Handverkfæri', en: 'Hand Tools' },
  'Málningarbúnaður': { is: 'Málningarbúnaður', en: 'Painting Supplies' },
  'Mælikvarðar': { is: 'Mælikvarðar', en: 'Measuring Tools' },
  'Garðverkfæri': { is: 'Garðverkfæri', en: 'Garden Tools' },
  'Pottur og krukk': { is: 'Pottur og krukk', en: 'Pots & Planters' },
  'Fræ og plöntur': { is: 'Fræ og plöntur', en: 'Seeds & Plants' },
  'Sláttuvélar': { is: 'Sláttuvélar', en: 'Lawnmowers' },
  
  // Sports & Outdoors Sub-subcategories
  'Lóð og búnaður': { is: 'Lóð og búnaður', en: 'Weights & Equipment' },
  'Jógabúnaður': { is: 'Jógabúnaður', en: 'Yoga Equipment' },
  'Hjólreiðaþjálfar': { is: 'Hjólreiðaþjálfar', en: 'Exercise Bikes' },
  'Hlaupaborð': { is: 'Hlaupaborð', en: 'Treadmills' },
  'Götuhjól': { is: 'Götuhjól', en: 'Road Bikes' },
  'Fjallahjól': { is: 'Fjallahjól', en: 'Mountain Bikes' },
  'Rafmagnshjól': { is: 'Rafmagnshjól', en: 'Electric Bikes' },
  'Börn hjól': { is: 'Börn hjól', en: 'Kids Bikes' },
  'Göngufatnaður': { is: 'Göngufatnaður', en: 'Hiking Apparel' },
  'Gönguskór': { is: 'Gönguskór', en: 'Hiking Boots' },
  'Bakpokar': { is: 'Bakpokar', en: 'Backpacks' },
  'Tjöld': { is: 'Tjöld', en: 'Tents' },
  'Svefnpokar': { is: 'Svefnpokar', en: 'Sleeping Bags' },
  'Hlaupafatnaður': { is: 'Hlaupafatnaður', en: 'Running Apparel' },
  'Æfingarfatnaður': { is: 'Æfingarfatnaður', en: 'Workout Clothing' },
  'Sundföt': { is: 'Sundföt', en: 'Swimwear' },
  'Alförin skíði': { is: 'Alförin skíði', en: 'Downhill Skis' },
  'Borðskíði': { is: 'Borðskíði', en: 'Snowboards' },
  'Skíðastafir': { is: 'Skíðastafir', en: 'Ski Poles' },
  'Hjálmar': { is: 'Hjálmar', en: 'Helmets' },
  'Gleraugu': { is: 'Gleraugu', en: 'Goggles' },
  
  // Vehicles Sub-subcategories
  'Fólksbílar': { is: 'Fólksbílar', en: 'Passenger Cars' },
  'Jeppar': { is: 'Jeppar', en: 'SUVs' },
  'Sportbílar': { is: 'Sportbílar', en: 'Sports Cars' },
  'Húsbílar': { is: 'Húsbílar', en: 'RVs' },
  'Krosshjól': { is: 'Krosshjól', en: 'Dirt Bikes' },
  'Vespuhjól': { is: 'Vespuhjól', en: 'Scooters' },
  'Fjórhjól': { is: 'Fjórhjól', en: 'ATVs' },
  'Tjaldvagnar': { is: 'Tjaldvagnar', en: 'Camper Trailers' },
  'Húsbílahúsgögn': { is: 'Húsbílahúsgögn', en: 'RV Furniture' },
  'Hjól og dekk': { is: 'Hjól og dekk', en: 'Wheels & Tires' },
  'Hljóðkerfi': { is: 'Hljóðkerfi', en: 'Audio Systems' },
  'Innri hlutir': { is: 'Innri hlutir', en: 'Interior Parts' },
  'Ytri hlutir': { is: 'Ytri hlutir', en: 'Exterior Parts' },
  'GPS og hleðsla': { is: 'GPS og hleðsla', en: 'GPS & Charging' },
  'Bifreiðaskraut': { is: 'Bifreiðaskraut', en: 'Car Decor' },
  'Hreinsiefni': { is: 'Hreinsiefni', en: 'Cleaning Products' },
  
  // Books, Movies & Music Sub-subcategories
  'Skáldsögur': { is: 'Skáldsögur', en: 'Fiction' },
  'Barnabækur': { is: 'Barnabækur', en: 'Children\'s Books' },
  'Námsbækur': { is: 'Námsbækur', en: 'Textbooks' },
  'Ævisögur': { is: 'Ævisögur', en: 'Biographies' },
  'Matreiðslubækur': { is: 'Matreiðslubækur', en: 'Cookbooks' },
  'Kvikmyndir - DVD': { is: 'Kvikmyndir - DVD', en: 'Movies - DVD' },
  'Kvikmyndir - Blu-ray': { is: 'Kvikmyndir - Blu-ray', en: 'Movies - Blu-ray' },
  'Tónlist - CD': { is: 'Tónlist - CD', en: 'Music - CD' },
  'Rokk': { is: 'Rokk', en: 'Rock' },
  'Popp': { is: 'Popp', en: 'Pop' },
  'Jazz': { is: 'Jazz', en: 'Jazz' },
  'Klassík': { is: 'Klassík', en: 'Classical' },
  'Gítarar': { is: 'Gítarar', en: 'Guitars' },
  'Píanó og hljómborð': { is: 'Píanó og hljómborð', en: 'Pianos & Keyboards' },
  'Trommur': { is: 'Trommur', en: 'Drums' },
  'Strengir': { is: 'Strengir', en: 'Strings' },
  
  // Toys & Baby Gear Sub-subcategories
  'LEGO og byggingarkubbar': { is: 'LEGO og byggingarkubbar', en: 'LEGO & Building Blocks' },
  'Dúkkur': { is: 'Dúkkur', en: 'Dolls' },
  'Tölvuleikjaleikföng': { is: 'Tölvuleikjaleikföng', en: 'Video Game Toys' },
  'Bílar og vélar': { is: 'Bílar og vélar', en: 'Cars & Vehicles' },
  'Spil': { is: 'Spil', en: 'Board Games' },
  'Göngukerru': { is: 'Göngukerru', en: 'Strollers' },
  'Kerrur': { is: 'Kerrur', en: 'Buggies' },
  'Tvíburavagnar': { is: 'Tvíburavagnar', en: 'Twin Strollers' },
  'Hásæti': { is: 'Hásæti', en: 'High Chairs' },
  'Bílstólar': { is: 'Bílstólar', en: 'Car Seats' },
  'Vaggsófar': { is: 'Vaggsófar', en: 'Bouncers' },
  'Ungbörn (0-2 ára)': { is: 'Ungbörn (0-2 ára)', en: 'Infants (0-2 years)' },
  'Smábörn (2-5 ára)': { is: 'Smábörn (2-5 ára)', en: 'Toddlers (2-5 years)' },
  'Börn (6+ ára)': { is: 'Börn (6+ ára)', en: 'Kids (6+ years)' },
  
  // Health & Beauty Sub-subcategories
  'Förðun': { is: 'Förðun', en: 'Makeup' },
  'Neglur': { is: 'Neglur', en: 'Nails' },
  'Ilmvatn': { is: 'Ilmvatn', en: 'Perfume' },
  'Tól': { is: 'Tól', en: 'Tools' },
  'Andlitskrem': { is: 'Andlitskrem', en: 'Face Creams' },
  'Húðhreinsivörur': { is: 'Húðhreinsivörur', en: 'Cleansers' },
  'Sólarvörn': { is: 'Sólarvörn', en: 'Sunscreen' },
  'Vítamín': { is: 'Vítamín', en: 'Vitamins' },
  'Næringarefni': { is: 'Næringarefni', en: 'Supplements' },
  'Fyrstu hjálp': { is: 'Fyrstu hjálp', en: 'First Aid' },
  
  // Collectibles & Art Sub-subcategories
  'Málverk': { is: 'Málverk', en: 'Paintings' },
  'Myndir': { is: 'Myndir', en: 'Prints' },
  'Skúlptúrar': { is: 'Skúlptúrar', en: 'Sculptures' },
  'Myntir': { is: 'Myntir', en: 'Coins' },
  'Íþróttakort': { is: 'Íþróttakort', en: 'Sports Cards' },
  'Pokémon': { is: 'Pokémon', en: 'Pokémon' },
  'Magic': { is: 'Magic', en: 'Magic: The Gathering' },
  
  // Pet Supplies Sub-subcategories
  'Hundfóður': { is: 'Hundfóður', en: 'Dog Food' },
  'Kattafóður': { is: 'Kattafóður', en: 'Cat Food' },
  'Beð': { is: 'Beð', en: 'Beds' },
  'Hálsbönd og taumar': { is: 'Hálsbönd og taumar', en: 'Collars & Leashes' },
  'Fiskabúr': { is: 'Fiskabúr', en: 'Aquariums' },
  'Síur': { is: 'Síur', en: 'Filters' },
  'Fiskur': { is: 'Fiskur', en: 'Fish' },
  'Búr': { is: 'Búr', en: 'Cages' },
  'Fóður': { is: 'Fóður', en: 'Food' },
  'Terrarium': { is: 'Terrarium', en: 'Terrariums' },
  'Hiti og ljós': { is: 'Hiti og ljós', en: 'Heat & Lighting' },
  
  // Jewelry & Watches Sub-subcategories
  'Karlaúr': { is: 'Karlaúr', en: 'Men\'s Watches' },
  'Kvennaúr': { is: 'Kvennaúr', en: 'Women\'s Watches' },
  'Snjallúr': { is: 'Snjallúr', en: 'Smart Watches' },
  'Hringir': { is: 'Hringir', en: 'Rings' },
  'Hálsmen': { is: 'Hálsmen', en: 'Necklaces' },
  'Armbönd': { is: 'Armbönd', en: 'Bracelets' },
  'Eyrnalokkar': { is: 'Eyrnalokkar', en: 'Earrings' },
  'Broskar': { is: 'Broskar', en: 'Brooches' },
  
  // Business & Industrial Sub-subcategories
  'Kælibúnaður': { is: 'Kælibúnaður', en: 'Refrigeration' },
  'Læknistæki': { is: 'Læknistæki', en: 'Medical Equipment' },
  'Rannsóknarfæri': { is: 'Rannsóknarfæri', en: 'Lab Equipment' },
  'Gröfur': { is: 'Gröfur', en: 'Excavators' },
  'Lyftarar': { is: 'Lyftarar', en: 'Lifts' },
  'Vélar': { is: 'Vélar', en: 'Machines' },
  'Strengir og kapal': { is: 'Strengir og kapal', en: 'Wires & Cables' },
  'Rofa': { is: 'Rofa', en: 'Switches' },
  'Prentarar': { is: 'Prentarar', en: 'Printers' },
  'Pappír': { is: 'Pappír', en: 'Paper' },
  
  // Tickets & Travel Sub-subcategories
  'Rokk og Popp': { is: 'Rokk og Popp', en: 'Rock & Pop' },
  'Fótbolti': { is: 'Fótbolti', en: 'Soccer' },
  'Körfubolti': { is: 'Körfubolti', en: 'Basketball' },
  'Handbolti': { is: 'Handbolti', en: 'Handball' },
  'Leikhús': { is: 'Leikhús', en: 'Theater' },
  'Stand-up': { is: 'Stand-up', en: 'Stand-up Comedy' },
  'Viðburðir': { is: 'Viðburðir', en: 'Events' },
  'Flug og hótel': { is: 'Flug og hótel', en: 'Flight & Hotel' },
  'Rútupakkar': { is: 'Rútupakkar', en: 'Bus Tours' },
  'Ferðatöskur': { is: 'Ferðatöskur', en: 'Travel Bags' },
  'Handtöskur': { is: 'Handtöskur', en: 'Handbags' },
  
  // Specialty Services Sub-subcategories
  'Skráning': { is: 'Skráning', en: 'Listing' },
  'Ljósmyndun': { is: 'Ljósmyndun', en: 'Photography' },
  'Vefhönnun': { is: 'Vefhönnun', en: 'Web Design' },
  'Forritun': { is: 'Forritun', en: 'Programming' },
  'Tölvuviðgerðir': { is: 'Tölvuviðgerðir', en: 'Computer Repairs' },
  'Nafnspjöld': { is: 'Nafnspjöld', en: 'Business Cards' },
  'Merki': { is: 'Merki', en: 'Signs' },
  'Hönnun': { is: 'Hönnun', en: 'Design' },
  
  // Old category mappings for backwards compatibility
  'Heimili': { is: 'Heimili', en: 'Home' },
  'Íþróttir': { is: 'Íþróttir', en: 'Sports' },
  'Garður': { is: 'Garður', en: 'Garden' },
  'Electronics': { is: 'Rafeindatækni', en: 'Electronics' },
  'Fashion': { is: 'Tíska', en: 'Fashion' },
  'Home': { is: 'Heimili', en: 'Home' },
  'Sports': { is: 'Íþróttir', en: 'Sports' },
  'Vehicles': { is: 'Farartæki', en: 'Vehicles' },
  'Books': { is: 'Bækur', en: 'Books' },
  'Toys': { is: 'Leikföng', en: 'Toys' },
  'Garden': { is: 'Garður', en: 'Garden' },
  'Other': { is: 'Annað', en: 'Other' },
  
  // Filters
  filters: { is: 'Síur', en: 'Filters' },
  clear: { is: 'Hreinsa', en: 'Clear' },
  clearFilters: { is: 'Hreinsa síur', en: 'Clear Filters' },
  applyFilters: { is: 'Beita síum', en: 'Apply Filters' },
  search: { is: 'Leita', en: 'Search' },
  priceRange: { is: 'Verðbil', en: 'Price Range' },
  minPrice: { is: 'Lágmarksverð', en: 'Min Price' },
  maxPrice: { is: 'Hámarksverð', en: 'Max Price' },
  
  // Results
  result: { is: 'niðurstaða', en: 'result' },
  results: { is: 'niðurstöður', en: 'results' },
  
  // Pagination
  previous: { is: 'Fyrri', en: 'Previous' },
  next: { is: 'Næsta', en: 'Next' },
  
  // Actions
  signIn: { is: 'Skrá inn', en: 'Sign In' },
  signUp: { is: 'Nýskráning', en: 'Sign Up' },
  logout: { is: 'Útskrá', en: 'Logout' },
  signOut: { is: 'Útskrá', en: 'Sign Out' },
  cancel: { is: 'Hætta við', en: 'Cancel' },
  orContinueWith: { is: 'Eða halda áfram með', en: 'Or continue with' },
  signInWithGoogle: { is: 'Skrá inn með Google', en: 'Sign in with Google' },
  signUpWithGoogle: { is: 'Nýskrá með Google', en: 'Sign up with Google' },
  
  // Auth
  email: { is: 'Netfang', en: 'Email' },
  password: { is: 'Lykilorð', en: 'Password' },
  confirmPassword: { is: 'Staðfesta lykilorð', en: 'Confirm Password' },
  username: { is: 'Notandanafn', en: 'Username' },
  firstName: { is: 'Fornafn', en: 'First Name' },
  lastName: { is: 'Eftirnafn', en: 'Last Name' },
  phoneNumber: { is: 'Símanúmer', en: 'Phone Number' },
  signInDescription: { is: 'Skráðu þig inn á reikninginn þinn', en: 'Sign in to your account' },
  signUpDescription: { is: 'Búðu til nýjan reikning', en: 'Create a new account' },
  noAccount: { is: 'Ekki með reikning?', en: "Don't have an account?" },
  haveAccount: { is: 'Með reikning?', en: 'Already have an account?' },
  loginError: { is: 'Villa kom upp við innskráningu', en: 'An error occurred while signing in' },
  registerError: { is: 'Villa kom upp við nýskráningu', en: 'An error occurred while signing up' },
  passwordMismatch: { is: 'Lykilorð passa ekki saman', en: 'Passwords do not match' },
  passwordTooShort: { is: 'Lykilorð verður að vera að minnsta kosti 6 stafir', en: 'Password must be at least 6 characters' },
  createAccount: { is: 'Búa til reikning', en: 'Create Account' },
  creatingAccount: { is: 'Býr til reikning...', en: 'Creating account...' },
  signingIn: { is: 'Skrái inn...', en: 'Signing in...' },
  
  // Profile
  viewProfile: { is: 'Skoða prófíl', en: 'View Profile' },
  editProfile: { is: 'Breyta prófíl', en: 'Edit Profile' },
  accountSettings: { is: 'Stillingar reiknings', en: 'Account Settings' },
  accountSettingsDescription: { is: 'Stilltu persónulegar upplýsingar', en: 'Manage your personal information' },
  notifications: { is: 'Tilkynningar', en: 'Notifications' },
  markAllRead: { is: 'Merkja allt sem lesið', en: 'Mark all as read' },
  noNotifications: { is: 'Engar tilkynningar', en: 'No notifications' },
  profileInformation: { is: 'Prófílupplýsingar', en: 'Profile Information' },
  updateProfileDescription: { is: 'Uppfærðu prófílinn þinn', en: 'Update your profile information' },
  bio: { is: 'Um mig', en: 'Bio' },
  contactInformation: { is: 'Tengiliðaupplýsingar', en: 'Contact Information' },
  bioPlaceholder: { is: 'Segðu okkur aðeins frá þér...', en: 'Tell us a bit about yourself...' },
  address: { is: 'Heimilisfang', en: 'Address' },
  city: { is: 'Borg', en: 'City' },
  postalCode: { is: 'Póstnúmer', en: 'Postal Code' },
  profileImage: { is: 'Prófílmynd', en: 'Profile Image' },
  emailCannotBeChanged: { is: 'Netfang er ekki hægt að breyta', en: 'Email cannot be changed' },
  saveChanges: { is: 'Vista breytingar', en: 'Save Changes' },
  saving: { is: 'Vista...', en: 'Saving...' },
  profileUpdated: { is: 'Prófíl uppfærður', en: 'Profile updated successfully' },
  updateError: { is: 'Villa kom upp við að uppfæra prófíl', en: 'An error occurred while updating profile' },
  userNotFound: { is: 'Notandi fannst ekki', en: 'User Not Found' },
  userNotFoundDescription: { is: 'Notandinn sem þú leitaðir að er ekki til', en: 'The user you are looking for does not exist' },
  noReviewsYet: { is: 'Engar umsagnir enn', en: 'No reviews yet' },
  sales: { is: 'sölur', en: 'sales' },
  followers: { is: 'fylgjendur', en: 'followers' },
  follow: { is: 'Fylgja', en: 'Follow' },
  unfollow: { is: 'Hætta að fylgja', en: 'Unfollow' },
  itemsSold: { is: 'vörur seldar', en: 'items sold' },
  positiveFeedback: { is: 'jákvæð umsögn', en: 'positive feedback' },
  share: { is: 'Deila', en: 'Share' },
  shareProfile: { is: 'Deila prófíl', en: 'Share profile' },
  shareProfileDescription: { is: 'Deildu þessum prófíl með öðrum', en: 'Share this profile with others' },
  copyLink: { is: 'Afrita hlekk', en: 'Copy link' },
  copied: { is: 'Afritað', en: 'Copied' },
  contact: { is: 'Hafa samband', en: 'Contact' },
  save: { is: 'Vista', en: 'Save' },
  about: { is: 'Um', en: 'About' },
  feedback: { is: 'Umsagnir', en: 'Feedback' },
  feedbackRatings: { is: 'Einkunnagjöf', en: 'Feedback ratings' },
  last12Months: { is: 'Síðustu 12 mánuðir', en: 'Last 12 months' },
  positive: { is: 'jákvætt', en: 'positive' },
  neutral: { is: 'Hlutlaust', en: 'Neutral' },
  negative: { is: 'Neikvætt', en: 'Negative' },
  sellerOtherItems: { is: 'Aðrar vörur seljanda', en: "Seller's other items" },
  contactSeller: { is: 'Hafa samband við seljanda', en: 'Contact seller' },
  positiveFeedbackCount: { is: 'jákvæð umsögn síðustu 12 mánuði', en: 'positive feedback in last 12 months' },
  neutralFeedbackCount: { is: 'hlutlaus umsögn síðustu 12 mánuði', en: 'neutral feedback in last 12 months' },
  negativeFeedbackCount: { is: 'neikvæð umsögn síðustu 12 mánuði', en: 'negative feedback in last 12 months' },
  detailedSellerRatings: { is: 'Nákvæmar seljandaeinkunnir', en: 'Detailed seller ratings' },
  averageForLast12Months: { is: 'Meðaltal síðustu 12 mánuði', en: 'Average for the last 12 months' },
  accurateDescription: { is: 'Nákvæm lýsing', en: 'Accurate description' },
  reasonableShippingCost: { is: 'Sanngjarn sendingarkostnaður', en: 'Reasonable shipping cost' },
  shippingSpeed: { is: 'Sendingarhraði', en: 'Shipping speed' },
  communication: { is: 'Samskipti', en: 'Communication' },
  allFeedback: { is: 'Allar umsagnir', en: 'All feedback' },
  feedbackLeftByBuyer: { is: 'Umsögn frá kaupanda', en: 'Feedback left by buyer' },
  verifiedPurchase: { is: 'Staðfest kaup', en: 'Verified purchase' },
  pastMonth: { is: 'Síðasta mánuð', en: 'Past month' },
  past6Months: { is: 'Síðustu 6 mánuði', en: 'Past 6 months' },
  pastYear: { is: 'Síðasta ár', en: 'Past year' },
  joined: { is: 'Skráður', en: 'Joined' },
  review: { is: 'umsögn', en: 'review' },
  reviews: { is: 'umsagnir', en: 'reviews' },
  listings: { is: 'Auglýsingar', en: 'Listings' },
  noListingsYet: { is: 'Engar auglýsingar enn', en: 'No listings yet' },
  noListingsFromUser: { is: 'Þessi notandi hefur engar auglýsingar', en: 'This user has no listings' },
  noReviews: { is: 'Engar umsagnir', en: 'No reviews' },
  
  // Create Listing
  createListing: { is: 'Búa til auglýsingu', en: 'Create Listing' },
  createListingSubtitle: { is: 'Fylltu út upplýsingarnar hér að neðan til að birta vöruna þína', en: 'Fill in the details below to list your item' },
  listingDetails: { is: 'Upplýsingar um vöru', en: 'Listing Details' },
  listingDetailsDescription: { is: 'Gefðu nákvæmar upplýsingar um vöruna sem þú vilt selja', en: 'Provide detailed information about the item you want to sell' },
  title: { is: 'Titill', en: 'Title' },
  titlePlaceholder: { is: 'T.d. iPhone 15 Pro í góðu ástandi', en: 'E.g. iPhone 15 Pro in good condition' },
  description: { is: 'Lýsing', en: 'Description' },
  descriptionPlaceholder: { is: 'Lýstu vörunni þinni í smáatriðum...', en: 'Describe your item in detail...' },
  aboutThisItem: { is: 'Um þessa vöru', en: 'About this item' },
  characters: { is: 'stafir', en: 'characters' },
  selectCategory: { is: 'Veldu flokk', en: 'Select category' },
  selectCondition: { is: 'Veldu ástand', en: 'Select condition' },
  subcategory: { is: 'Undirflokkur', en: 'Subcategory' },
  selectSubcategory: { is: 'Veldu undirflokk', en: 'Select subcategory' },
  subSubcategory: { is: 'Undirundirflokkur', en: 'Sub-subcategory' },
  selectSubSubcategory: { is: 'Veldu undirundirflokk', en: 'Select sub-subcategory' },
  conditionBrandNew: { is: 'Glænýtt', en: 'Brand New' },
  conditionNew: { is: 'Nýtt', en: 'New' },
  conditionLikeNew: { is: 'Eins og nýtt', en: 'Like New' },
  conditionGood: { is: 'Gott', en: 'Good' },
  conditionFair: { is: 'Ásættanlegt', en: 'Fair' },
  conditionPoor: { is: 'Slæmt', en: 'Poor' },
  listingType: { is: 'Tegund sölu', en: 'Listing Type' },
  auction: { is: 'Uppboð', en: 'Auction' },
  buyNowOnly: { is: 'Kaupa núna', en: 'Buy Now' },
  acceptBestOffer: { is: 'Taka á móti tilboðum', en: 'Accept Best Offer' },
  orBestOffer: { is: 'Eða besta tilboð', en: 'Or best offer' },
  startingPrice: { is: 'Upphafsverð', en: 'Starting Price' },
  buyNowPrice: { is: 'Kaupa núna verð', en: 'Buy Now Price' },
  optional: { is: 'valkvætt', en: 'optional' },
  buyNowPriceHelp: { is: 'Kaupendur geta keypt vöruna strax fyrir þetta verð þar til fyrsta boð er gert', en: 'Buyers can purchase immediately at this price until the first bid is placed' },
  endDate: { is: 'Lokadagsetning', en: 'End Date' },
  endDateHelp: { is: 'Hvenær á uppboðinu að ljúka', en: 'When should the auction end' },
  endDateRequired: { is: 'Lokadagsetning er nauðsynleg fyrir uppboð', en: 'End date is required for auctions' },
  isRequired: { is: 'er nauðsynlegur', en: 'is required' },
  itemSpecifics: { is: 'Nákvæmar vöruupplýsingar', en: 'Item Specifics' },
  itemSpecificsHelp: { is: 'Veittu nákvæmar upplýsingar um vöruna til að hjálpa kaupendum', en: 'Provide detailed information about the item to help buyers' },
  sellerResponsibility: { is: 'Seljandi ber ábyrgð á þessari skráningu', en: 'Seller assumes all responsibility for this listing' },
  itemNumber: { is: 'Vörunúmer', en: 'Item number' },
  lastUpdated: { is: 'Síðast uppfært', en: 'Last updated' },
  on: { is: 'þann', en: 'on' },
  sellerNotes: { is: 'Athugasemdir seljanda', en: 'Seller Notes' },
  yes: { is: 'Já', en: 'Yes' },
  no: { is: 'Nei', en: 'No' },
  days: { is: 'dagar', en: 'days' },
  returns: { is: 'Skil', en: 'Returns' },
  freeShipping: { is: 'Frítt sendingagjald', en: 'Free shipping' },
  images: { is: 'Myndir', en: 'Images' },
  imagesHelp: { is: 'Dragðu myndir hingað eða smelltu til að velja (allt að 10 myndir)', en: 'Drag images here or click to select (up to 10 images)' },
  imageUploadComingSoon: { is: 'Myndaupphleðsla kemur fljótlega', en: 'Image upload coming soon' },
  fillRequiredFields: { is: 'Vinsamlegast fylltu út alla nauðsynlega reiti', en: 'Please fill in all required fields' },
  priceInvalid: { is: 'Verð verður að vera hærra en 0', en: 'Price must be greater than 0' },
  buyNowPriceInvalid: { is: 'Kaupa núna verð verður að vera hærra en upphafsverð', en: 'Buy now price must be higher than starting price' },
  createListingError: { is: 'Villa kom upp við að búa til auglýsingu', en: 'An error occurred while creating the listing' },
  creating: { is: 'Býr til...', en: 'Creating...' },
  
  // Listing Detail
  listingNotFound: { is: 'Vara fannst ekki', en: 'Listing Not Found' },
  makeOffer: { is: 'Gera tilboð', en: 'Make Offer' },
  submitOffer: { is: 'Senda tilboð', en: 'Submit Offer' },
  offerAmount: { is: 'Tilboðsupphæð', en: 'Offer Amount' },
  offerMessage: { is: 'Skilaboð (valkvæmt)', en: 'Message (optional)' },
  offerMessagePlaceholder: { is: 'Bættu við skilaboðum við tilboðið þitt...', en: 'Add a message to your offer...' },
  offerTooHigh: { is: 'Tilboð getur ekki verið hærra en verð', en: 'Offer cannot be higher than the price' },
  offerTooLow: { is: 'Vinsamlegast sláðu inn gilt tilboð', en: 'Please enter a valid offer' },
  offerSubmitted: { is: 'Tilboð sent!', en: 'Offer Submitted!' },
  offerSubmittedMessage: { is: 'Tilboð þitt hefur verið sent til seljanda', en: 'Your offer has been sent to the seller' },
  offerError: { is: 'Villa kom upp við að senda tilboð', en: 'An error occurred while submitting the offer' },
  myOffers: { is: 'Mín tilboð', en: 'My Offers' },
  manageYourOffers: { is: 'Skoðaðu og stjórnaðu tilboðum þínum', en: 'View and manage your offers' },
  offersReceived: { is: 'Móttekin tilboð', en: 'Received Offers' },
  offersSent: { is: 'Send tilboð', en: 'Sent Offers' },
  noOffersReceived: { is: 'Þú hefur ekki fengið nein tilboð enn', en: 'You have not received any offers yet' },
  noOffersSent: { is: 'Þú hefur ekki sent nein tilboð enn', en: 'You have not sent any offers yet' },
  acceptOffer: { is: 'Samþykkja tilboð', en: 'Accept Offer' },
  declineOffer: { is: 'Hafna tilboði', en: 'Decline Offer' },
  counterOffer: { is: 'Gera gagntilboð', en: 'Counter Offer' },
  withdrawOffer: { is: 'Draga tilboð til baka', en: 'Withdraw Offer' },
  yourOffer: { is: 'Þitt tilboð', en: 'Your Offer' },
  yourMessage: { is: 'Þín skilaboð', en: 'Your Message' },
  from: { is: 'Frá', en: 'From' },
  to: { is: 'Til', en: 'To' },
  message: { is: 'Skilaboð', en: 'Message' },
  acceptOfferConfirm: { is: 'Ertu viss um að þú viljir samþykkja þetta tilboð fyrir {amount} kr?', en: 'Are you sure you want to accept this offer for {amount} kr?' },
  declineOfferConfirm: { is: 'Ertu viss um að þú viljir hafna þessu tilboði?', en: 'Are you sure you want to decline this offer?' },
  withdrawOfferConfirm: { is: 'Ertu viss um að þú viljir draga þetta tilboð til baka?', en: 'Are you sure you want to withdraw this offer?' },
  counterOfferTitle: { is: 'Gera gagntilboð', en: 'Make Counter Offer' },
  counterOfferDescription: { is: 'Sendu gagntilboð til kaupanda', en: 'Send a counter offer to the buyer' },
  counterAmount: { is: 'Gagntilboðsupphæð', en: 'Counter Offer Amount' },
  counterAmountPlaceholder: { is: 'Sláðu inn gagntilboð', en: 'Enter counter offer amount' },
  counterMessageOptional: { is: 'Skilaboð (valkvæmt)', en: 'Message (optional)' },
  submitCounterOffer: { is: 'Senda gagntilboð', en: 'Submit Counter Offer' },
  counterOfferSuccess: { is: 'Gagntilboð sent!', en: 'Counter Offer Sent!' },
  counterOfferError: { is: 'Villa kom upp við að senda gagntilboð', en: 'An error occurred while sending the counter offer' },
  counterOfferTooHigh: { is: 'Gagntilboð má ekki vera hærra en eða jafnt og upphafsverð', en: 'Counter offer cannot be equal to or higher than the listing price' },
  counterOfferTooLow: { is: 'Gagntilboð verður að vera hærra en 0', en: 'Counter offer must be greater than 0' },
  originalOffer: { is: 'Upphaflegt tilboð', en: 'Original Offer' },
  listingNotFoundDescription: { is: 'Varan sem þú leitaðir að er ekki til', en: 'The listing you are looking for does not exist' },
  seller: { is: 'Seljandi', en: 'Seller' },
  listed: { is: 'Skráð', en: 'Listed' },
  currentBid: { is: 'Núverandi boð', en: 'Current Bid' },
  noBids: { is: 'Engin boð', en: 'No bids' },
  bid: { is: 'boð', en: 'bid' },
  bids: { is: 'boð', en: 'bids' },
  totalBids: { is: 'Fjöldi boða', en: 'Total Bids' },
  endsOn: { is: 'Lýkur', en: 'Ends' },
  
  // Bidding
  bidHistory: { is: 'Boðasaga', en: 'Bid History' },
  noBidsYet: { is: 'Engin boð enn sem komið er', en: 'No bids yet' },
  highestBid: { is: 'Hæsta boð', en: 'Highest Bid' },
  currentPrice: { is: 'Núverandi verð', en: 'Current Price' },
  yourBid: { is: 'Þitt boð', en: 'Your Bid' },
  minimumBid: { is: 'Lágmarks boð', en: 'Minimum Bid' },
  confirmBid: { is: 'Staðfesta boð', en: 'Confirm Bid' },
  bidPlaced: { is: 'Boði komið við', en: 'Bid Placed' },
  bidPlacedMessage: { is: 'Boðið þitt hefur verið skráð!', en: 'Your bid has been placed!' },
  bidMustBeHigher: { is: 'Boð verður að vera hærra en', en: 'Bid must be higher than' },
  bidTooLow: { is: 'Boð verður að vera hærra en 0', en: 'Bid must be greater than 0' },
  bidError: { is: 'Villa kom upp við að setja boð', en: 'Error placing bid' },
  
  // Cart
  cart: { is: 'Karfa', en: 'Cart' },
  addToCart: { is: 'Bæta í körfu', en: 'Add to Cart' },
  removeFromCart: { is: 'Fjarlægja úr körfu', en: 'Remove from Cart' },
  addedToCart: { is: 'Vara bætt í körfu!', en: 'Added to cart!' },
  addToCartError: { is: 'Villa kom upp við að bæta vöru í körfu', en: 'Error adding to cart' },
  emptyCart: { is: 'Karfan þín er tóm', en: 'Your cart is empty' },
  clearCart: { is: 'Hreinsa körfu', en: 'Clear Cart' },
  checkout: { is: 'Halda áfram', en: 'Checkout' },
  
  // Watchlist
  watchlist: { is: 'Vöktunarlisti', en: 'Watchlist' },
  myWatchlist: { is: 'Minn vöktunarlisti', en: 'My Watchlist' },
  emptyWatchlist: { is: 'Vöktunarlisti þinn er tómur', en: 'Your watchlist is empty' },
  addedToWatchlist: { is: 'Bætt á vöktunarlista', en: 'Added to watchlist' },
  removedFromWatchlist: { is: 'Fjarlægt af vöktunarlista', en: 'Removed from watchlist' },
  watchlistCount: { is: 'vöktunarlisti', en: 'watching' },
  
  // Messages
  messages: { is: 'Skilaboð', en: 'Messages' },
  myMessages: { is: 'Mín skilaboð', en: 'My Messages' },
  newMessage: { is: 'Ný skilaboð', en: 'New Message' },
  sendMessage: { is: 'Senda skilaboð', en: 'Send Message' },
  typeMessage: { is: 'Skrifaðu skilaboð...', en: 'Type a message...' },
  noMessages: { is: 'Engin skilaboð', en: 'No messages' },
  noConversations: { is: 'Engar samræður enn', en: 'No conversations yet' },
  messageSent: { is: 'Skilaboð send!', en: 'Message sent!' },
  messageError: { is: 'Villa kom upp við að senda skilaboð', en: 'Error sending message' },
  startConversation: { is: 'Byrja samtal', en: 'Start a conversation' },
  
  // Delete listing
  deleteListing: { is: 'Eyða auglýsingu', en: 'Delete Listing' },
  deleteConfirmTitle: { is: 'Ertu viss?', en: 'Are you sure?' },
  deleteNoBidsMessage: { is: 'Þetta mun eyða auglýsingunni endanlega.', en: 'This will permanently delete the listing.' },
  deleteWithBidsMessage: { is: 'Þessi auglýsing hefur {count} boð. Ef þú heldur áfram verður auglýsingin merkt sem „Afturkölluð" og getur haft áhrif á seljandaeinkunnina þína.', en: 'This listing has {count} bid(s). If you proceed, the listing will be marked as "Cancelled" and may impact your seller reputation.' },
  deleteBlockedMessage: { is: 'Get ekki eytt auglýsingu með boðum sem lýkur innan 24 klukkustunda.', en: 'Cannot delete listing with bids that ends within 24 hours.' },
  confirmDelete: { is: 'Já, eyða', en: 'Yes, Delete' },
  confirmCancel: { is: 'Já, afturkalla', en: 'Yes, Cancel' },
  cancelAction: { is: 'Hætta við', en: 'Cancel' },
  listingDeleted: { is: 'Auglýsingu eytt', en: 'Listing Deleted' },
  listingCancelled: { is: 'Auglýsingu afturkölluð', en: 'Listing Cancelled' },
  deleteError: { is: 'Villa kom upp við að eyða auglýsingu', en: 'Error deleting listing' },
  
  // Homepage sections
  featuredAuctions: { is: 'Uppboð að líða undir lok', en: 'Featured Auctions' },
  showMore: { is: 'Sýna meira', en: 'Show More' },
  noActiveAuctions: { is: 'Engin virk uppboð í augnablikinu', en: 'No active auctions at the moment' },
  
  // Common
  loading: { is: 'Hleður...', en: 'Loading...' },
  noResults: { is: 'Engar vörur fundust', en: 'No items found' },
  currency: { is: 'kr', en: 'ISK' },
  
  // Category-Specific Fields
  // Computer/Electronics Fields
  computerType: { is: 'Tegund tölvu', en: 'Computer Type' },
  brand: { is: 'Framleiðandi', en: 'Brand' },
  model: { is: 'Gerð', en: 'Model' },
  processorBrand: { is: 'Örgjörvi framleiðandi', en: 'Processor Brand' },
  processor: { is: 'Örgjörvi', en: 'Processor' },
  processorSpeed: { is: 'Hraði örgjörva', en: 'Processor Speed' },
  ramSize: { is: 'Vinnsluminni', en: 'RAM Size' },
  storageType: { is: 'Tegund geymslurýmis', en: 'Storage Type' },
  ssdCapacity: { is: 'SSD stærð', en: 'SSD Capacity' },
  hddCapacity: { is: 'HDD stærð', en: 'HDD Capacity' },
  graphicsType: { is: 'Tegund skjákorta', en: 'Graphics Type' },
  gpu: { is: 'Skjákort', en: 'GPU' },
  screenSize: { is: 'Skjástærð', en: 'Screen Size' },
  screenResolution: { is: 'Skjáupplausn', en: 'Screen Resolution' },
  operatingSystem: { is: 'Stýrikerfi', en: 'Operating System' },
  releaseYear: { is: 'Útgáfuár', en: 'Release Year' },
  color: { is: 'Litur', en: 'Color' },
  features: { is: 'Eiginleikar', en: 'Features' },
  connectivity: { is: 'Tengimöguleikar', en: 'Connectivity' },
  weight: { is: 'Þyngd', en: 'Weight' },
  length: { is: 'Lengd', en: 'Length' },
  width: { is: 'Breidd', en: 'Width' },
  height: { is: 'Hæð', en: 'Height' },
  warranty: { is: 'Ábyrgð', en: 'Warranty' },
  suitableFor: { is: 'Hentar fyrir', en: 'Suitable For' },
  
  // Monitor-specific Fields
  refreshRate: { is: 'Uppfærslutíðni', en: 'Refresh Rate' },
  panelType: { is: 'Skjátegund', en: 'Panel Type' },
  aspectRatio: { is: 'Hlutfall', en: 'Aspect Ratio' },
  responseTime: { is: 'Svartími', en: 'Response Time' },
  curvedScreen: { is: 'Boginn skjár', en: 'Curved Screen' },
  hdr: { is: 'HDR', en: 'HDR' },
  brightness: { is: 'Birtustig', en: 'Brightness' },
  contrastRatio: { is: 'Birtuskil', en: 'Contrast Ratio' },
  
  // Laptop/Portable Fields
  batteryLife: { is: 'Endingartími rafhlöðu', en: 'Battery Life' },
  
  // Desktop Fields
  powerSupply: { is: 'Aflgjafi', en: 'Power Supply' },
  caseType: { is: 'Kassi tegund', en: 'Case Type' },
  
  // Parts Fields
  partType: { is: 'Tegund hluta', en: 'Part Type' },
  compatibility: { is: 'Samhæfi', en: 'Compatibility' },
  
  // Keyboard/Mouse Fields
  productType: { is: 'Vörutegund', en: 'Product Type' },
  switchType: { is: 'Rofi tegund', en: 'Switch Type' },
  backlighting: { is: 'Bakljós', en: 'Backlighting' },
  dpi: { is: 'DPI', en: 'DPI' },
  
  // Phone/Tablet Fields
  deviceType: { is: 'Tegund tækis', en: 'Device Type' },
  storageCapacity: { is: 'Geymslurými', en: 'Storage Capacity' },
  batteryHealth: { is: 'Heilsa rafhlöðu', en: 'Battery Health' },
  network: { is: 'Net', en: 'Network' },
  simType: { is: 'SIM tegund', en: 'SIM Type' },
  carrierLock: { is: 'Símafyrirtækjalæsing', en: 'Carrier Lock' },
  
  // Field Options - Computer Types
  'Fartölva': { is: 'Fartölva', en: 'Laptop' },
  'Borðtölva': { is: 'Borðtölva', en: 'Desktop' },
  'Allt-í-einu': { is: 'Allt-í-einu', en: 'All-in-One' },
  'Netbók': { is: 'Netbók', en: 'Netbook' },
  
  // Field Options - Brands
  'Dell': { is: 'Dell', en: 'Dell' },
  'HP': { is: 'HP', en: 'HP' },
  'Lenovo': { is: 'Lenovo', en: 'Lenovo' },
  'Asus': { is: 'Asus', en: 'Asus' },
  'Acer': { is: 'Acer', en: 'Acer' },
  'Apple': { is: 'Apple', en: 'Apple' },
  'MSI': { is: 'MSI', en: 'MSI' },
  'Microsoft': { is: 'Microsoft', en: 'Microsoft' },
  'Razer': { is: 'Razer', en: 'Razer' },
  'Samsung': { is: 'Samsung', en: 'Samsung' },
  'Google': { is: 'Google', en: 'Google' },
  'OnePlus': { is: 'OnePlus', en: 'OnePlus' },
  'Xiaomi': { is: 'Xiaomi', en: 'Xiaomi' },
  'Huawei': { is: 'Huawei', en: 'Huawei' },
  'Nokia': { is: 'Nokia', en: 'Nokia' },
  'Motorola': { is: 'Motorola', en: 'Motorola' },
  
  // Field Options - Processor Brands
  'Intel': { is: 'Intel', en: 'Intel' },
  'AMD': { is: 'AMD', en: 'AMD' },
  'Apple M-series': { is: 'Apple M-seríu', en: 'Apple M-series' },
  
  // Field Options - Storage/Graphics
  'Samþætt': { is: 'Samþætt', en: 'Integrated' },
  'Sérstakt skjákort': { is: 'Sérstakt skjákort', en: 'Dedicated GPU' },
  'Bæði': { is: 'Bæði', en: 'Both' },
  'SSD': { is: 'SSD', en: 'SSD' },
  'HDD': { is: 'HDD', en: 'HDD' },
  'SSD + HDD': { is: 'SSD + HDD', en: 'SSD + HDD' },
  'NVMe SSD': { is: 'NVMe SSD', en: 'NVMe SSD' },
  'Á ekki við': { is: 'Á ekki við', en: 'Not Applicable' },
  
  // Field Options - Operating Systems
  'Windows 11 Home': { is: 'Windows 11 Home', en: 'Windows 11 Home' },
  'Windows 11 Pro': { is: 'Windows 11 Pro', en: 'Windows 11 Pro' },
  'Windows 10': { is: 'Windows 10', en: 'Windows 10' },
  'macOS': { is: 'macOS', en: 'macOS' },
  'Linux': { is: 'Linux', en: 'Linux' },
  'Chrome OS': { is: 'Chrome OS', en: 'Chrome OS' },
  'Ekkert OS': { is: 'Ekkert OS', en: 'No OS' },
  'iOS': { is: 'iOS', en: 'iOS' },
  'Android': { is: 'Android', en: 'Android' },
  
  // Field Options - Colors
  'Svart': { is: 'Svart', en: 'Black' },
  'Hvítt': { is: 'Hvítt', en: 'White' },
  'Silfur': { is: 'Silfur', en: 'Silver' },
  'Grár': { is: 'Grár', en: 'Gray' },
  'Gull': { is: 'Gull', en: 'Gold' },
  'Blátt': { is: 'Blátt', en: 'Blue' },
  'Grænt': { is: 'Grænt', en: 'Green' },
  'Bleikt': { is: 'Bleikt', en: 'Pink' },
  'Rautt': { is: 'Rautt', en: 'Red' },
  'Fjólublátt': { is: 'Fjólublátt', en: 'Purple' },
  
  // Field Options - Features
  'Baklýst lyklaborð': { is: 'Baklýst lyklaborð', en: 'Backlit Keyboard' },
  'Bluetooth': { is: 'Bluetooth', en: 'Bluetooth' },
  'Innbyggður hljóðnemi': { is: 'Innbyggður hljóðnemi', en: 'Built-in Microphone' },
  'Innbyggð vefmyndavél': { is: 'Innbyggð vefmyndavél', en: 'Built-in Webcam' },
  'Wi-Fi': { is: 'Wi-Fi', en: 'Wi-Fi' },
  'Snertiskjár': { is: 'Snertiskjár', en: 'Touchscreen' },
  'Fingrafaralesari': { is: 'Fingrafaralesari', en: 'Fingerprint Reader' },
  'Thunderbolt': { is: 'Thunderbolt', en: 'Thunderbolt' },
  'USB-C hleðsla': { is: 'USB-C hleðsla', en: 'USB-C Charging' },
  
  // Field Options - Connectivity
  'HDMI': { is: 'HDMI', en: 'HDMI' },
  'USB-C': { is: 'USB-C', en: 'USB-C' },
  'USB 3.2': { is: 'USB 3.2', en: 'USB 3.2' },
  'USB 2.0': { is: 'USB 2.0', en: 'USB 2.0' },
  'Ethernet': { is: 'Ethernet', en: 'Ethernet' },
  'SD kortarauf': { is: 'SD kortarauf', en: 'SD Card Slot' },
  'microSD kortarauf': { is: 'microSD kortarauf', en: 'microSD Card Slot' },
  'Heyrnartóla tengi': { is: 'Heyrnartóla tengi', en: 'Headphone Jack' },
  'DisplayPort': { is: 'DisplayPort', en: 'DisplayPort' },
  
  // Field Options - Warranty
  'Engin ábyrgð': { is: 'Engin ábyrgð', en: 'No Warranty' },
  '3 mánuðir': { is: '3 mánuðir', en: '3 Months' },
  '6 mánuðir': { is: '6 mánuðir', en: '6 Months' },
  '1 ár': { is: '1 ár', en: '1 Year' },
  '2 ár': { is: '2 ár', en: '2 Years' },
  '3 ár': { is: '3 ár', en: '3 Years' },
  
  // Field Options - Suitable For
  'Vinnufólk': { is: 'Vinnufólk', en: 'Business' },
  'Skóli': { is: 'Skóli', en: 'School' },
  'Grafísk hönnun': { is: 'Grafísk hönnun', en: 'Graphic Design' },
  'Almenn notkun': { is: 'Almenn notkun', en: 'General Use' },
  'Myndvinnsla': { is: 'Myndvinnsla', en: 'Video Editing' },
  
  // Field Options - Device Types (Phone/Tablet)
  'Snjallsími': { is: 'Snjallsími', en: 'Smartphone' },
  'Spjaldtölva': { is: 'Spjaldtölva', en: 'Tablet' },
  
  // Field Options - Network
  '5G': { is: '5G', en: '5G' },
  '4G LTE': { is: '4G LTE', en: '4G LTE' },
  '3G': { is: '3G', en: '3G' },
  'Wi-Fi Only': { is: 'Bara Wi-Fi', en: 'Wi-Fi Only' },
  
  // Field Options - SIM
  'Nano SIM': { is: 'Nano SIM', en: 'Nano SIM' },
  'eSIM': { is: 'eSIM', en: 'eSIM' },
  'Dual SIM': { is: 'Dual SIM', en: 'Dual SIM' },
  
  // Field Options - Carrier Lock
  'Ólæst': { is: 'Ólæst', en: 'Unlocked' },
  'Læst (tilgreindu í lýsingu)': { is: 'Læst (tilgreindu í lýsingu)', en: 'Locked (specify in description)' },
  'Veit ekki': { is: 'Veit ekki', en: 'Unknown' },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('is')

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('kaup-language') as Language
    if (savedLang === 'is' || savedLang === 'en') {
      setLanguage(savedLang)
    }
  }, [])

  // Save language to localStorage when it changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('kaup-language', lang)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
