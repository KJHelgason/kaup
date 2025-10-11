// Category-specific fields for listing creation
// Based on eBay's Item Specifics system

export interface CategoryField {
  name: string
  label: string // For translation key
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean'
  required?: boolean
  options?: string[] // For select/multiselect types
  unit?: string // e.g., "GB", "in", "GHz"
  placeholder?: string
  hideForSubSubcategories?: string[] // Hide this field for specific sub-subcategories
}

export type CategoryFields = {
  [categoryValue: string]: {
    [subcategoryValue: string]: {
      [subSubcategoryValue: string]: CategoryField[]
    } | CategoryField[] // Support both nested (with sub-subcategories) and flat (without)
  }
}

// Helper to check if the field structure has sub-subcategory levels
export function hasSubSubcategoryFields(fields: any): fields is { [subSubcategoryValue: string]: CategoryField[] } {
  if (Array.isArray(fields)) return false
  return typeof fields === 'object' && fields !== null
}

// Define category-specific fields
export const categoryFields: CategoryFields = {
  "Rafeindatækni": {
    // Computers (Tölvur) - Organized by computer type (sub-subcategory)
    "Tölvur": {
      // Laptops (Fartölva)
      "Fartölva": [
        { name: "brand", label: "brand", type: "select", required: true,
          options: ["Dell", "HP", "Lenovo", "Asus", "Acer", "Apple", "MSI", "Microsoft", "Razer", "Samsung", "LG", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. Latitude 5420" },
        { name: "processor", label: "processor", type: "text", placeholder: "t.d. Intel Core i7-1185G7" },
        { name: "processorSpeed", label: "processorSpeed", type: "number", unit: "GHz", placeholder: "t.d. 4.80" },
        { name: "ramSize", label: "ramSize", type: "select", 
          options: ["4 GB", "8 GB", "16 GB", "32 GB", "64 GB", "128 GB", "Annað"] },
        { name: "storageType", label: "storageType", type: "select",
          options: ["SSD", "HDD", "SSD + HDD", "NVMe SSD", "Annað"] },
        { name: "ssdCapacity", label: "ssdCapacity", type: "select",
          options: ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB", "4 TB", "Annað"] },
        { name: "gpu", label: "gpu", type: "text", placeholder: "t.d. NVIDIA RTX 4060, Intel Iris Xe" },
        { name: "screenSize", label: "screenSize", type: "select",
          options: ["11 in", "13 in", "14 in", "15 in", "16 in", "17 in", "Annað"] },
        { name: "screenResolution", label: "screenResolution", type: "select",
          options: ["1366 x 768 (HD)", "1920 x 1080 (Full HD)", "2560 x 1440 (QHD)", "3840 x 2160 (4K UHD)", "Annað"] },
        { name: "operatingSystem", label: "operatingSystem", type: "select",
          options: ["Windows 11 Home", "Windows 11 Pro", "Windows 10", "macOS", "Linux", "Chrome OS", "Ekkert OS", "Annað"] },
        { name: "releaseYear", label: "releaseYear", type: "number", placeholder: "t.d. 2021" },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Grár", "Blátt", "Rautt", "Annað"] },
        { name: "batteryLife", label: "batteryLife", type: "number", unit: "klst", placeholder: "t.d. 8" },
        { name: "weight", label: "weight", type: "number", unit: "kg", placeholder: "t.d. 1.4" },
        { name: "features", label: "features", type: "multiselect",
          options: ["Baklýst lyklaborð", "Bluetooth", "Innbyggður hljóðnemi", "Innbyggð vefmyndavél", 
                   "Wi-Fi", "Snertiskjár", "Fingrafaralesari", "Thunderbolt", "USB-C hleðsla"] },
        { name: "connectivity", label: "connectivity", type: "multiselect",
          options: ["HDMI", "USB-C", "USB 3.2", "USB 2.0", "Ethernet", "SD kortarauf", 
                   "microSD kortarauf", "Heyrnartóla tengi", "DisplayPort"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "3 mánuðir", "6 mánuðir", "1 ár", "2 ár", "3 ár"] },
        { name: "suitableFor", label: "suitableFor", type: "multiselect",
          options: ["Vinnufólk", "Leikir", "Skóli", "Grafísk hönnun", "Almenn notkun", "Forritun", "Myndvinnsla"] }
      ],
      
      // Desktops (Borðtölva)
      "Borðtölva": [
        { name: "brand", label: "brand", type: "select", required: true,
          options: ["Dell", "HP", "Lenovo", "Asus", "Acer", "Apple", "MSI", "Custom Build", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. OptiPlex 7090" },
        { name: "processor", label: "processor", type: "text", placeholder: "t.d. Intel Core i7-11700" },
        { name: "processorSpeed", label: "processorSpeed", type: "number", unit: "GHz", placeholder: "t.d. 4.90" },
        { name: "ramSize", label: "ramSize", type: "select",
          options: ["8 GB", "16 GB", "32 GB", "64 GB", "128 GB", "256 GB", "Annað"] },
        { name: "storageType", label: "storageType", type: "select",
          options: ["SSD", "HDD", "SSD + HDD", "NVMe SSD", "M.2 SSD", "Annað"] },
        { name: "ssdCapacity", label: "ssdCapacity", type: "select",
          options: ["256 GB", "512 GB", "1 TB", "2 TB", "4 TB", "Annað"] },
        { name: "hddCapacity", label: "hddCapacity", type: "select",
          options: ["500 GB", "1 TB", "2 TB", "4 TB", "8 TB", "Annað", "Á ekki við"] },
        { name: "gpu", label: "gpu", type: "text", placeholder: "t.d. NVIDIA RTX 4070, AMD Radeon RX 7800" },
        { name: "operatingSystem", label: "operatingSystem", type: "select",
          options: ["Windows 11 Home", "Windows 11 Pro", "Windows 10", "Linux", "Ekkert OS", "Annað"] },
        { name: "releaseYear", label: "releaseYear", type: "number", placeholder: "t.d. 2023" },
        { name: "caseType", label: "caseType", type: "select",
          options: ["Tower", "Mid Tower", "Mini Tower", "Small Form Factor (SFF)", "Annað"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Grár", "RGB ljós", "Annað"] },
        { name: "features", label: "features", type: "multiselect",
          options: ["Bluetooth", "Wi-Fi", "RGB Lighting", "Liquid Cooling", "Multiple Drive Bays", "Tool-less Design"] },
        { name: "connectivity", label: "connectivity", type: "multiselect",
          options: ["HDMI", "DisplayPort", "USB-C", "USB 3.2", "USB 2.0", "Ethernet", "Audio In/Out"] },
        { name: "powerSupply", label: "powerSupply", type: "number", unit: "W", placeholder: "t.d. 650" },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "3 mánuðir", "6 mánuðir", "1 ár", "2 ár", "3 ár"] },
        { name: "suitableFor", label: "suitableFor", type: "multiselect",
          options: ["Vinnufólk", "Leikir", "Grafísk hönnun", "Myndvinnsla", "3D Modeling", "Forritun", "Server"] }
      ],
      
      // All-in-One (Allt-í-einu)
      "Allt-í-einu": [
        { name: "brand", label: "brand", type: "select", required: true,
          options: ["Apple", "HP", "Dell", "Lenovo", "Asus", "Acer", "Microsoft", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. iMac 24-inch" },
        { name: "processor", label: "processor", type: "text", placeholder: "t.d. Apple M1" },
        { name: "processorSpeed", label: "processorSpeed", type: "number", unit: "GHz" },
        { name: "ramSize", label: "ramSize", type: "select",
          options: ["8 GB", "16 GB", "32 GB", "64 GB", "128 GB", "Annað"] },
        { name: "storageType", label: "storageType", type: "select",
          options: ["SSD", "HDD", "SSD + HDD", "NVMe SSD", "Annað"] },
        { name: "ssdCapacity", label: "ssdCapacity", type: "select",
          options: ["256 GB", "512 GB", "1 TB", "2 TB", "4 TB", "Annað"] },
        { name: "gpu", label: "gpu", type: "text", placeholder: "t.d. Apple M1 GPU, NVIDIA GTX" },
        { name: "screenSize", label: "screenSize", type: "select",
          options: ["21.5 in", "24 in", "27 in", "32 in", "Annað"] },
        { name: "screenResolution", label: "screenResolution", type: "select",
          options: ["1920 x 1080 (Full HD)", "2560 x 1440 (QHD)", "3840 x 2160 (4K UHD)", "4480 x 2520 (4.5K)", "5120 x 2880 (5K)", "Annað"] },
        { name: "touchscreen", label: "touchscreen", type: "select",
          options: ["Já", "Nei"] },
        { name: "operatingSystem", label: "operatingSystem", type: "select",
          options: ["macOS", "Windows 11 Home", "Windows 11 Pro", "Windows 10", "Chrome OS", "Annað"] },
        { name: "releaseYear", label: "releaseYear", type: "number", placeholder: "t.d. 2021" },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Blár", "Grænn", "Bleikur", "Appelsínugulur", "Annað"] },
        { name: "features", label: "features", type: "multiselect",
          options: ["Bluetooth", "Wi-Fi", "Innbyggð vefmyndavél", "Innbyggðir hátalara", "Snertiskjár", "Fingrafaralesari"] },
        { name: "connectivity", label: "connectivity", type: "multiselect",
          options: ["HDMI", "Thunderbolt", "USB-C", "USB 3.0", "Ethernet", "SD kortarauf", "Heyrnartóla tengi"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "3 mánuðir", "6 mánuðir", "1 ár", "2 ár", "3 ár"] }
      ],
      
      // Netbook (Netbók)
      "Netbók": [
        { name: "brand", label: "brand", type: "select", required: true,
          options: ["Asus", "Acer", "HP", "Lenovo", "Dell", "Samsung", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. Chromebook Flip" },
        { name: "processor", label: "processor", type: "text", placeholder: "t.d. Intel Celeron, AMD A4" },
        { name: "ramSize", label: "ramSize", type: "select",
          options: ["2 GB", "4 GB", "8 GB", "16 GB", "Annað"] },
        { name: "storageCapacity", label: "storageCapacity", type: "select",
          options: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "Annað"] },
        { name: "screenSize", label: "screenSize", type: "select",
          options: ["10 in", "11 in", "12 in", "13 in", "14 in", "Annað"] },
        { name: "screenResolution", label: "screenResolution", type: "select",
          options: ["1366 x 768 (HD)", "1920 x 1080 (Full HD)", "Annað"] },
        { name: "operatingSystem", label: "operatingSystem", type: "select",
          options: ["Chrome OS", "Windows 10", "Windows 11", "Linux", "Annað"] },
        { name: "batteryLife", label: "batteryLife", type: "number", unit: "klst", placeholder: "t.d. 10" },
        { name: "weight", label: "weight", type: "number", unit: "kg", placeholder: "t.d. 1.1" },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Blár", "Annað"] },
        { name: "features", label: "features", type: "multiselect",
          options: ["Bluetooth", "Wi-Fi", "Innbyggð vefmyndavél", "Snertiskjár", "360° Hinge"] },
        { name: "connectivity", label: "connectivity", type: "multiselect",
          options: ["USB-C", "USB 3.0", "HDMI", "microSD kortarauf", "Heyrnartóla tengi"] }
      ],
      
      // Computer Monitors (Tölvuskjáir)
      "Tölvuskjáir": [
        { name: "brand", label: "brand", type: "select", required: true,
          options: ["Dell", "LG", "Samsung", "Asus", "Acer", "BenQ", "HP", "Lenovo", "AOC", "ViewSonic", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. UltraSharp U2720Q" },
        { name: "screenSize", label: "screenSize", type: "select", required: true,
          options: ["19 in", "21.5 in", "24 in", "27 in", "32 in", "34 in", "38 in", "43 in", "49 in", "Annað"] },
        { name: "screenResolution", label: "screenResolution", type: "select", required: true,
          options: ["1920 x 1080 (Full HD)", "2560 x 1440 (QHD)", "3440 x 1440 (UWQHD)", 
                   "3840 x 2160 (4K UHD)", "5120 x 2880 (5K)", "7680 x 4320 (8K)", "Annað"] },
        { name: "refreshRate", label: "refreshRate", type: "select",
          options: ["60 Hz", "75 Hz", "120 Hz", "144 Hz", "165 Hz", "180 Hz", "240 Hz", "360 Hz", "Annað"] },
        { name: "panelType", label: "panelType", type: "select",
          options: ["IPS", "VA", "TN", "OLED", "QLED", "Annað"] },
        { name: "aspectRatio", label: "aspectRatio", type: "select",
          options: ["16:9", "16:10", "21:9 (Ultrawide)", "32:9 (Super Ultrawide)", "Annað"] },
        { name: "responseTime", label: "responseTime", type: "number", unit: "ms", placeholder: "t.d. 1" },
        { name: "curvedScreen", label: "curvedScreen", type: "select",
          options: ["Já", "Nei"] },
        { name: "hdr", label: "hdr", type: "select",
          options: ["HDR10", "HDR400", "HDR600", "HDR1000", "Dolby Vision", "Nei"] },
        { name: "brightness", label: "brightness", type: "number", unit: "cd/m²", placeholder: "t.d. 350" },
        { name: "contrastRatio", label: "contrastRatio", type: "text", placeholder: "t.d. 1000:1" },
        { name: "features", label: "features", type: "multiselect",
          options: ["G-Sync", "FreeSync", "Built-in Speakers", "USB Hub", "Height Adjustable", 
                   "Pivot/Rotate", "VESA Mount", "Blue Light Filter", "Flicker-Free"] },
        { name: "connectivity", label: "connectivity", type: "multiselect",
          options: ["HDMI 2.1", "HDMI 2.0", "HDMI 1.4", "DisplayPort 1.4", "DisplayPort 1.2", 
                   "USB-C", "DVI", "VGA", "Thunderbolt 3"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Grár", "Annað"] },
        { name: "releaseYear", label: "releaseYear", type: "number", placeholder: "t.d. 2023" },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár", "3 ár"] },
        { name: "suitableFor", label: "suitableFor", type: "multiselect",
          options: ["Leikir", "Grafísk hönnun", "Myndvinnsla", "Forritun", "Almenn notkun", "Professional Color Work"] }
      ],
      
      // Computer Parts (Tölvuhlutir) - Keep as basic list since highly variable
      "Tölvuhlutir": [
        { name: "partType", label: "partType", type: "select", required: true,
          options: ["Örgjörvi (CPU)", "Skjákort (GPU)", "Móðurborð", "RAM Minni", "SSD/HDD", 
                   "Aflgjafi", "Kæling", "Kassi", "Viftur", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Intel, AMD, NVIDIA" },
        { name: "model", label: "model", type: "text", required: true, placeholder: "t.d. RTX 4070 Ti" },
        { name: "compatibility", label: "compatibility", type: "text", placeholder: "t.d. LGA1700, AM5" },
        { name: "specifications", label: "specifications", type: "text", placeholder: "t.d. 12GB GDDR6X, PCIe 4.0" },
        { name: "condition", label: "condition", type: "select",
          options: ["Nýtt", "Notað - Eins og nýtt", "Notað - Gott ástand", "Notað - Ásættanlegt ástand"] }
      ],
      
      // Keyboard & Mouse (Lyklaborð og mýs)
      "Lyklaborð og mýs": [
        { name: "productType", label: "productType", type: "select", required: true,
          options: ["Lyklaborð", "Mús", "Lyklaborð og mús sett", "Annað"] },
        { name: "brand", label: "brand", type: "select",
          options: ["Logitech", "Razer", "Corsair", "SteelSeries", "HyperX", "Microsoft", "Apple", "Keychron", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. MX Keys, G Pro X" },
        { name: "connectionType", label: "connectionType", type: "select",
          options: ["Þráðlaust (Bluetooth)", "Þráðlaust (2.4GHz)", "Snúra (USB)", "Snúra (USB-C)", "Bæði þráðlaust og snúra"] },
        { name: "switchType", label: "switchType", type: "select",
          options: ["Mechanical - Cherry MX Red", "Mechanical - Cherry MX Blue", "Mechanical - Cherry MX Brown", 
                   "Mechanical - Gateron", "Mechanical - Kailh", "Membrane", "Scissor Switch", "Annað", "Á ekki við"] },
        { name: "backlighting", label: "backlighting", type: "select",
          options: ["RGB", "Single Color", "White", "Engin lýsing"] },
        { name: "dpi", label: "dpi", type: "number", placeholder: "t.d. 16000 (fyrir mús)" },
        { name: "batteryLife", label: "batteryLife", type: "text", placeholder: "t.d. 5 mánuðir" },
        { name: "features", label: "features", type: "multiselect",
          options: ["Programmable Keys", "Hot-Swappable Switches", "Wrist Rest", "Media Controls", 
                   "Wireless Charging", "Multi-device Pairing", "Adjustable Weight"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Grár", "RGB", "Annað"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár"] }
      ]
    },
    
    // Phones & Tablets (Símar og spjaldtölvur)
    "Símar og spjaldtölvur": {
      // Smartphones (Snjallsímar)
      "Snjallsímar": [
        { name: "brand", label: "brand", type: "select", required: true,
          options: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Huawei", "Nokia", "Motorola", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. iPhone 15 Pro, Galaxy S24" },
        { name: "storageCapacity", label: "storageCapacity", type: "select",
          options: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "Annað"] },
        { name: "ramSize", label: "ramSize", type: "select",
          options: ["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB", "Annað"] },
        { name: "screenSize", label: "screenSize", type: "text", unit: "in", placeholder: "t.d. 6.1" },
        { name: "operatingSystem", label: "operatingSystem", type: "select",
          options: ["iOS", "Android", "Annað"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Gull", "Blátt", "Grænt", "Bleikt", "Rautt", "Fjólublátt", "Annað"] },
        { name: "batteryHealth", label: "batteryHealth", type: "number", unit: "%", placeholder: "t.d. 85" },
        { name: "network", label: "network", type: "select",
          options: ["5G", "4G LTE", "3G", "Annað"] },
        { name: "simType", label: "simType", type: "select",
          options: ["Nano SIM", "eSIM", "Dual SIM", "Annað"] },
        { name: "carrierLock", label: "carrierLock", type: "select",
          options: ["Ólæst", "Læst (tilgreindu í lýsingu)", "Veit ekki"] }
      ],
      
      // Tablets (Spjaldtölvur)
      "Spjaldtölvur": [
        { name: "brand", label: "brand", type: "select", required: true,
          options: ["Apple", "Samsung", "Microsoft", "Amazon", "Lenovo", "Huawei", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. iPad Pro, Galaxy Tab S9" },
        { name: "storageCapacity", label: "storageCapacity", type: "select",
          options: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "Annað"] },
        { name: "ramSize", label: "ramSize", type: "select",
          options: ["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB", "Annað"] },
        { name: "screenSize", label: "screenSize", type: "select",
          options: ["7-8 in", "9-10 in", "11-12 in", "13 in+", "Annað"] },
        { name: "operatingSystem", label: "operatingSystem", type: "select",
          options: ["iPadOS", "Android", "Windows", "Annað"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Gull", "Blátt", "Grænt", "Bleikt", "Annað"] },
        { name: "network", label: "network", type: "select",
          options: ["Wi-Fi Only", "Wi-Fi + Cellular (5G)", "Wi-Fi + Cellular (4G)", "Annað"] }
      ],
      
      // Phone Cases & Accessories (Símahlífar og fylgihlutir)
      "Símahlífar og fylgihlutir": [
        { name: "accessoryType", label: "accessoryType", type: "select", required: true,
          options: ["Símahlíf", "Skjáhlíf", "Hleðslusnúra", "Heyrnartól", "PopSocket", "Símahaldari", "Annað"] },
        { name: "compatibleWith", label: "compatibleWith", type: "text", placeholder: "t.d. iPhone 15, Galaxy S24" },
        { name: "brand", label: "brand", type: "select",
          options: ["Apple", "Samsung", "OtterBox", "Spigen", "UAG", "Generic", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Silíkon", "Leður", "Plast", "Gler", "TPU", "Metal", "Annað"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Blátt", "Rautt", "Grænt", "Bleikt", "Gult", "Fjöllitur", "Annað"] }
      ],
      
      // Chargers (Hleðslutæki)
      "Hleðslutæki": [
        { name: "chargerType", label: "chargerType", type: "select", required: true,
          options: ["Wall Charger", "Car Charger", "Wireless Charger", "Power Bank", "Charging Cable", "Annað"] },
        { name: "cableType", label: "cableType", type: "select",
          options: ["Lightning", "USB-C", "Micro USB", "Magnetic", "Ekkert (þráðlaust)", "Annað"] },
        { name: "powerOutput", label: "powerOutput", type: "select",
          options: ["5W", "10W", "15W", "20W", "30W", "45W+", "Annað"] },
        { name: "brand", label: "brand", type: "select",
          options: ["Apple", "Samsung", "Anker", "Belkin", "Aukey", "Generic", "Annað"] },
        { name: "features", label: "features", type: "multiselect",
          options: ["Fast Charging", "Wireless", "Multi-Port", "Foldable Plug", "LED Indicator", "Travel Adapter"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Annað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "brand", label: "brand", type: "select",
          options: ["Apple", "Samsung", "Google", "Annað"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Annað"] }
      ]
    },
    
    // Cameras (Myndavélar)
    "Myndavélar": {
      // Digital Cameras (Stafrænar myndavélar)
      "Stafrænar myndavélar": [
        { name: "cameraType", label: "cameraType", type: "select", required: true,
          options: ["DSLR", "Mirrorless", "Point & Shoot", "Action Camera", "Instant Camera", "Film Camera", "Annað"] },
        { name: "brand", label: "brand", type: "select", required: true,
          options: ["Canon", "Nikon", "Sony", "Fujifilm", "Panasonic", "Olympus", "Leica", "GoPro", "DJI", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. EOS R5, A7 IV" },
        { name: "megapixels", label: "megapixels", type: "number", unit: "MP", placeholder: "t.d. 24" },
        { name: "sensorSize", label: "sensorSize", type: "select",
          options: ["Full Frame", "APS-C", "Micro Four Thirds", "1 inch", "Smaller than 1 inch", "Annað"] },
        { name: "videoResolution", label: "videoResolution", type: "select",
          options: ["720p (HD)", "1080p (Full HD)", "4K", "6K", "8K", "Annað"] },
        { name: "isoRange", label: "isoRange", type: "text", placeholder: "t.d. 100-51200" },
        { name: "shutterSpeed", label: "shutterSpeed", type: "text", placeholder: "t.d. 1/8000 - 30s" },
        { name: "screenSize", label: "screenSize", type: "select",
          options: ["2.7 in", "3.0 in", "3.2 in", "Engin skjár", "Annað"] },
        { name: "viewfinder", label: "viewfinder", type: "select",
          options: ["Optical", "Electronic (EVF)", "Both", "None"] },
        { name: "connectivity", label: "connectivity", type: "multiselect",
          options: ["Wi-Fi", "Bluetooth", "NFC", "USB-C", "HDMI", "Microphone Jack"] },
        { name: "batteryLife", label: "batteryLife", type: "number", unit: "shots", placeholder: "t.d. 500" },
        { name: "storageType", label: "storageType", type: "multiselect",
          options: ["SD Card", "CF Express", "Micro SD", "XQD", "Internal Storage"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Silfur", "Hvítt", "Annað"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár", "3 ár"] }
      ],
      
      // Camera Lenses (Linsa)
      "Linsa": [
        { name: "brand", label: "brand", type: "select", required: true,
          options: ["Canon", "Nikon", "Sony", "Sigma", "Tamron", "Fujifilm", "Olympus", "Samyang", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. RF 24-70mm f/2.8" },
        { name: "lensMount", label: "lensMount", type: "select", required: true,
          options: ["Canon EF", "Canon RF", "Nikon F", "Nikon Z", "Sony E", "Sony FE", "Micro Four Thirds", "Fujifilm X", "L-Mount", "Annað"] },
        { name: "focalLength", label: "focalLength", type: "text", placeholder: "t.d. 24-70mm, 50mm" },
        { name: "maxAperture", label: "maxAperture", type: "text", placeholder: "t.d. f/2.8, f/1.4" },
        { name: "lensType", label: "lensType", type: "select",
          options: ["Prime (Fixed)", "Zoom", "Macro", "Wide-Angle", "Telephoto", "Fisheye", "Annað"] },
        { name: "imageStabilization", label: "imageStabilization", type: "select",
          options: ["Já", "Nei"] },
        { name: "filterSize", label: "filterSize", type: "number", unit: "mm", placeholder: "t.d. 77" },
        { name: "autofocus", label: "autofocus", type: "select",
          options: ["Já", "Nei (Manual Only)"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Annað"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár"] }
      ],
      
      // Tripods & Equipment (Þríróður og búnaður)
      "Þríróður og búnaður": [
        { name: "equipmentType", label: "equipmentType", type: "select", required: true,
          options: ["Þríróður", "Monopod", "Gimbal", "Camera Bag", "Flash/Speedlight", "Lens Filter", "Memory Card", "Battery/Charger", "Annað"] },
        { name: "brand", label: "brand", type: "select",
          options: ["Manfrotto", "Gitzo", "Vanguard", "Peak Design", "Lowepro", "SanDisk", "Lexar", "Godox", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. MT055XPRO3" },
        { name: "maxLoadCapacity", label: "maxLoadCapacity", type: "number", unit: "kg", placeholder: "t.d. 9" },
        { name: "material", label: "material", type: "select",
          options: ["Carbon Fiber", "Aluminum", "Plastic", "Annað"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár"] }
      ],
      
      // Camera Cases (Myndavélarhlífar)
      "Myndavélarhlífar": [
        { name: "caseType", label: "caseType", type: "select", required: true,
          options: ["Backpack", "Shoulder Bag", "Hard Case", "Pouch", "Strap", "Annað"] },
        { name: "brand", label: "brand", type: "select",
          options: ["Peak Design", "Lowepro", "Manfrotto", "Think Tank", "Vanguard", "Amazon Basics", "Annað"] },
        { name: "capacity", label: "capacity", type: "text", placeholder: "t.d. 1 camera + 3 lenses" },
        { name: "waterproof", label: "waterproof", type: "select",
          options: ["Já", "Nei", "Water Resistant"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Grár", "Brúnn", "Annað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "t.d. Remote Shutter, Cleaning Kit" },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Canon" },
        { name: "description", label: "description", type: "text", placeholder: "Lýsing" }
      ]
    },
    
    // Audio Equipment (Hljóðbúnaður)
    "Hljóðbúnaður": {
      // Headphones (Heyrnartól)
      "Heyrnartól": [
        { name: "headphoneType", label: "headphoneType", type: "select", required: true,
          options: ["Over-Ear", "On-Ear", "In-Ear (Earbuds)", "True Wireless", "Neckband", "Annað"] },
        { name: "brand", label: "brand", type: "select", required: true,
          options: ["Sony", "Bose", "Sennheiser", "Audio-Technica", "Beyerdynamic", "Apple", "Samsung", "JBL", "Beats", "AKG", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. WH-1000XM5, AirPods Pro" },
        { name: "connectivity", label: "connectivity", type: "select", required: true,
          options: ["Wired (3.5mm)", "Wired (USB-C)", "Bluetooth", "Wireless 2.4GHz", "Both Wired & Wireless"] },
        { name: "noiseCancellation", label: "noiseCancellation", type: "select",
          options: ["Active Noise Cancellation (ANC)", "Passive", "None"] },
        { name: "driverSize", label: "driverSize", type: "number", unit: "mm", placeholder: "t.d. 40" },
        { name: "impedance", label: "impedance", type: "number", unit: "Ω", placeholder: "t.d. 32" },
        { name: "frequencyResponse", label: "frequencyResponse", type: "text", placeholder: "t.d. 20Hz - 20kHz" },
        { name: "batteryLife", label: "batteryLife", type: "number", unit: "klst", placeholder: "t.d. 30" },
        { name: "microphoneQuality", label: "microphoneQuality", type: "select",
          options: ["Built-in Microphone", "Detachable Boom Mic", "No Microphone"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Blár", "Rauður", "Annað"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár"] }
      ],
      
      // Speakers (Hátalara)
      "Hátalara": [
        { name: "speakerType", label: "speakerType", type: "select", required: true,
          options: ["Bluetooth Portable", "Smart Speaker", "Bookshelf", "Tower", "Soundbar", "Subwoofer", "PA System", "Annað"] },
        { name: "brand", label: "brand", type: "select", required: true,
          options: ["Sonos", "Bose", "JBL", "Sony", "Harman Kardon", "Marshall", "B&O", "Klipsch", "KEF", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. HomePod, Flip 6" },
        { name: "powerOutput", label: "powerOutput", type: "number", unit: "W", placeholder: "t.d. 60" },
        { name: "connectivity", label: "connectivity", type: "multiselect",
          options: ["Bluetooth", "Wi-Fi", "AUX", "USB", "Optical", "HDMI", "RCA", "XLR"] },
        { name: "batteryLife", label: "batteryLife", type: "number", unit: "klst", placeholder: "t.d. 12" },
        { name: "waterproof", label: "waterproof", type: "select",
          options: ["IPX7 (Waterproof)", "IPX5 (Water Resistant)", "IPX4 (Splash Resistant)", "Ekki vatnsheldur"] },
        { name: "smartFeatures", label: "smartFeatures", type: "multiselect",
          options: ["Alexa", "Google Assistant", "Siri", "Multi-room Audio", "Voice Control"] },
        { name: "frequencyResponse", label: "frequencyResponse", type: "text", placeholder: "t.d. 50Hz - 20kHz" },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Silfur", "Viður", "Annað"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár"] }
      ],
      
      // Music Equipment (Hljómtæki)
      "Hljómtæki": [
        { name: "instrumentType", label: "instrumentType", type: "select", required: true,
          options: ["Gítar", "Bassagítar", "Trommur", "Hljómborð/Píanó", "Strengjahljóðfæri", "Blásturshljóðfæri", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Fender, Yamaha, Roland" },
        { name: "model", label: "model", type: "text", placeholder: "t.d. Stratocaster" },
        { name: "material", label: "material", type: "text", placeholder: "t.d. Solid Wood, Maple" },
        { name: "numberOfStrings", label: "numberOfStrings", type: "select",
          options: ["4", "5", "6", "7", "12", "Á ekki við"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Náttúrulegur viður", "Sunburst", "Annað"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár"] }
      ],
      
      // Audio Production Equipment (Hljóðkerfisbúnaður)
      "Hljóðkerfisbúnaður": [
        { name: "equipmentType", label: "equipmentType", type: "select", required: true,
          options: ["Audio Interface", "Mixer", "Microphone", "Studio Monitor", "MIDI Controller", "Synthesizer", "Amplifier", "Annað"] },
        { name: "brand", label: "brand", type: "select",
          options: ["Focusrite", "PreSonus", "Behringer", "Shure", "Rode", "Neumann", "Yamaha", "Roland", "Korg", "Annað"] },
        { name: "model", label: "model", type: "text", placeholder: "t.d. Scarlett 2i2" },
        { name: "numberOfChannels", label: "numberOfChannels", type: "select",
          options: ["2", "4", "8", "16", "24", "32", "Annað"] },
        { name: "connectivity", label: "connectivity", type: "multiselect",
          options: ["USB", "USB-C", "Thunderbolt", "XLR", "1/4 inch TRS", "MIDI", "Optical"] },
        { name: "phantomPower", label: "phantomPower", type: "select",
          options: ["Já (+48V)", "Nei", "Á ekki við"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár", "3 ár"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "t.d. Audio Cable, Adapter" },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. AudioQuest" },
        { name: "description", label: "description", type: "text", placeholder: "Lýsing" }
      ]
    },
    
    // Gaming (Tölvuleikir & Leikjatölvur)
    "Tölvuleikir & Leikjatölvur": {
      // PlayStation
      "PlayStation": [
        { name: "consoleModel", label: "consoleModel", type: "select", required: true,
          options: ["PS5", "PS5 Digital Edition", "PS4 Pro", "PS4 Slim", "PS4", "PS3", "PS2", "PS1", "Annað"] },
        { name: "storageCapacity", label: "storageCapacity", type: "select",
          options: ["500 GB", "1 TB", "2 TB", "Annað"] },
        { name: "includedItems", label: "includedItems", type: "multiselect",
          options: ["Controller(s)", "HDMI Cable", "Power Cable", "Games", "Original Box", "Headset"] },
        { name: "numberOfControllers", label: "numberOfControllers", type: "number", placeholder: "t.d. 2" },
        { name: "region", label: "region", type: "select",
          options: ["Region Free", "PAL (Europe)", "NTSC (US/Japan)", "Annað"] },
        { name: "color", label: "color", type: "select",
          options: ["Hvítt", "Svart", "Annað"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár"] }
      ],
      
      // Xbox
      "Xbox": [
        { name: "consoleModel", label: "consoleModel", type: "select", required: true,
          options: ["Xbox Series X", "Xbox Series S", "Xbox One X", "Xbox One S", "Xbox One", "Xbox 360", "Annað"] },
        { name: "storageCapacity", label: "storageCapacity", type: "select",
          options: ["512 GB", "1 TB", "2 TB", "Annað"] },
        { name: "includedItems", label: "includedItems", type: "multiselect",
          options: ["Controller(s)", "HDMI Cable", "Power Cable", "Games", "Original Box", "Headset", "Kinect"] },
        { name: "numberOfControllers", label: "numberOfControllers", type: "number", placeholder: "t.d. 2" },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Annað"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár"] }
      ],
      
      // Nintendo
      "Nintendo": [
        { name: "consoleModel", label: "consoleModel", type: "select", required: true,
          options: ["Switch OLED", "Switch", "Switch Lite", "Wii U", "Wii", "3DS", "DS", "Game Boy", "Annað"] },
        { name: "storageCapacity", label: "storageCapacity", type: "select",
          options: ["32 GB", "64 GB", "128 GB + SD Card", "Annað"] },
        { name: "includedItems", label: "includedItems", type: "multiselect",
          options: ["Joy-Cons", "Dock", "HDMI Cable", "Power Adapter", "Games", "Original Box", "Carrying Case"] },
        { name: "color", label: "color", type: "select",
          options: ["Rauður/Blár", "Grár", "Annað"] },
        { name: "warranty", label: "warranty", type: "select",
          options: ["Engin ábyrgð", "6 mánuðir", "1 ár", "2 ár"] }
      ],
      
      // Games (Leikir)
      "Leikir": [
        { name: "platform", label: "platform", type: "select", required: true,
          options: ["PS5", "PS4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "PC", "Annað"] },
        { name: "gameTitle", label: "gameTitle", type: "text", required: true, placeholder: "t.d. The Last of Us Part II" },
        { name: "genre", label: "genre", type: "select",
          options: ["Action", "Adventure", "RPG", "Sports", "Racing", "Fighting", "Puzzle", "Horror", "Annað"] },
        { name: "ageRating", label: "ageRating", type: "select",
          options: ["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18", "Annað"] },
        { name: "physicalDigital", label: "physicalDigital", type: "select",
          options: ["Physical Disc", "Digital Code"] },
        { name: "language", label: "language", type: "multiselect",
          options: ["Íslenska", "English", "Nordic", "Annað"] },
        { name: "includesBox", label: "includesBox", type: "select",
          options: ["Já", "Nei"] }
      ],
      
      // Accessories (Fylgihlutir)
      "Fylgihlutir": [
        { name: "accessoryType", label: "accessoryType", type: "select", required: true,
          options: ["Controller", "Headset", "Charging Station", "Carrying Case", "Screen Protector", "Grip", "Extra Cables", "VR Headset", "Annað"] },
        { name: "compatibleWith", label: "compatibleWith", type: "multiselect",
          options: ["PS5", "PS4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "PC", "Multi-platform"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Sony, Microsoft, Logitech" },
        { name: "wireless", label: "wireless", type: "select",
          options: ["Já", "Nei", "Bæði"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Hvítt", "Rauður", "Blár", "Annað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "t.d. Gaming Chair, Desk" },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. DXRacer" },
        { name: "description", label: "description", type: "text", placeholder: "Lýsing" }
      ]
    }
  },
  
  // Fashion (Tíska)
  "Tíska": {
    // Men's Clothing (Föt - Karlar)
    "Föt - Karlar": {
      // Jackets & Coats (Jakkar og kápur)
      "Jakkar og kápur": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. The North Face, Carhartt" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "Annað"] },
        { name: "jacketType", label: "jacketType", type: "select",
          options: ["Vetrarjakki", "Regnskúr", "Vindjakki", "Úlpa", "Parka", "Leðurjakki", "Prjónaður jakki", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Polyester", "Ull", "Leður", "Nylon", "Bómull", "Gæsadúnn", "Blandað efni", "Annað"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Grár", "Hvítt", "Brúnn", "Blár", "Grár", "Rauður", "Grænn", "Annað"] },
        { name: "fitType", label: "fitType", type: "select",
          options: ["Slim Fit", "Regular Fit", "Relaxed Fit", "Oversized", "Annað"] },
        { name: "waterproof", label: "waterproof", type: "select",
          options: ["Já", "Nei", "Water Resistant"] }
      ],
      
      // Shirts & T-Shirts (Bolir og skyrtur)
      "Bolir og skyrtur": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Ralph Lauren, H&M" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "Annað"] },
        { name: "clothingType", label: "clothingType", type: "select",
          options: ["T-bolur", "Langermaboli", "Skyrta", "Polo skyrta", "Hettupeysa", "Sweatshirt", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Bómull", "100% Bómull", "Polyester", "Blend", "Lín", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Hvítt, Blár" },
        { name: "pattern", label: "pattern", type: "select",
          options: ["Einfaldur", "Rendur", "Prikkar", "Flætt", "Grafík", "Annað"] },
        { name: "sleeveLength", label: "sleeveLength", type: "select",
          options: ["Stutterma", "Langerma", "3/4 ermar", "Ermalaus"] },
        { name: "fitType", label: "fitType", type: "select",
          options: ["Slim Fit", "Regular Fit", "Relaxed Fit", "Oversized"] },
        { name: "neckline", label: "neckline", type: "select",
          options: ["Crew Neck", "V-Neck", "Polo", "Henley", "Hálsbindishnappur", "Annað"] }
      ],
      
      // Pants (Buxur)
      "Buxur": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Levi's, Dockers" },
        { name: "waistSize", label: "waistSize", type: "select", required: true,
          options: ["28", "29", "30", "31", "32", "33", "34", "36", "38", "40", "42", "44", "Annað"] },
        { name: "length", label: "length", type: "select",
          options: ["28", "30", "32", "34", "36", "Annað"] },
        { name: "pantsType", label: "pantsType", type: "select",
          options: ["Gallabuxur", "Chinos", "Cargo buxur", "Íþróttabuxur", "Joggers", "Stuttbuxur", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Denim", "Bómull", "Polyester", "Khaki", "Wool Blend", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Blátt, Svart, Khaki" },
        { name: "fitType", label: "fitType", type: "select",
          options: ["Slim Fit", "Straight Fit", "Relaxed Fit", "Skinny", "Bootcut", "Annað"] },
        { name: "rise", label: "rise", type: "select",
          options: ["Low Rise", "Mid Rise", "High Rise"] }
      ],
      
      // Suits (Jakkafatnaður)
      "Jakkafatnaður": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Hugo Boss, Brooks Brothers" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["44", "46", "48", "50", "52", "54", "56", "Annað"] },
        { name: "suitType", label: "suitType", type: "select",
          options: ["Heilt sett (Jakki + Buxur)", "Þrískipt (Jakki + Vesti + Buxur)", "Jakki eingöngu", "Buxur eingöngu", "Smokingur", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Ull", "Wool Blend", "Polyester", "Lín", "Bómull", "Annað"] },
        { name: "color", label: "color", type: "select",
          options: ["Svart", "Kolgrár", "Dökkblár", "Ljósgrár", "Brúnn", "Annað"] },
        { name: "fitType", label: "fitType", type: "select",
          options: ["Slim Fit", "Modern Fit", "Classic Fit", "Annað"] },
        { name: "numberOfButtons", label: "numberOfButtons", type: "select",
          options: ["1 hnappur", "2 hnappar", "3 hnappar", "Annað"] }
      ],
      
      // Sportswear (Íþróttafatnaður)
      "Íþróttafatnaður": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Nike, Adidas, Under Armour" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "Annað"] },
        { name: "sportswearType", label: "sportswearType", type: "select",
          options: ["Æfingabolur", "Æfingabuxur", "Stuttbuxur", "Hettupeysa", "Íþróttajakki", "Compression Wear", "Annað"] },
        { name: "sportType", label: "sportType", type: "select",
          options: ["Hlaup", "Líkamsrækt", "Fótbolti", "Körfubolti", "Jóga", "Almenn æfing", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Polyester", "Nylon", "Spandex", "Bómull Blend", "Dri-FIT", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Blár, Rauður" },
        { name: "moistureWicking", label: "moistureWicking", type: "select",
          options: ["Já", "Nei"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "t.d. Sokkar, Nærfatnaður" },
        { name: "brand", label: "brand", type: "text" },
        { name: "size", label: "size", type: "text" },
        { name: "color", label: "color", type: "text" }
      ]
    },
    
    // Women's Clothing (Föt - Konur)
    "Föt - Konur": {
      // Dresses (Kjólar)
      "Kjólar": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Zara, Mango, H&M" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "Annað"] },
        { name: "dressType", label: "dressType", type: "select",
          options: ["Dagkjóll", "Kvöldkjóll", "Sumarkjóll", "Brudarkjóll", "Kokkteilkjóll", "Maxi kjóll", "Midi kjóll", "Mini kjóll", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Bómull", "Polyester", "Silki", "Satín", "Lín", "Dansi", "Blend", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Rauður, Blár" },
        { name: "pattern", label: "pattern", type: "select",
          options: ["Einfaldur", "Blómamynstur", "Rendur", "Prikkar", "Annað"] },
        { name: "sleeveLength", label: "sleeveLength", type: "select",
          options: ["Ermalaus", "Stutterma", "3/4 ermar", "Langerma"] },
        { name: "dressLength", label: "dressLength", type: "select",
          options: ["Mini (yfir hné)", "Midi (niður fyrir hné)", "Maxi (niður að ökkla)", "Annað"] },
        { name: "neckline", label: "neckline", type: "select",
          options: ["V-Neck", "Round Neck", "Off-Shoulder", "Halter", "Sweetheart", "High Neck", "Annað"] },
        { name: "occasion", label: "occasion", type: "select",
          options: ["Casual", "Formlegt", "Brúðkaup", "Partý", "Sumar", "Annað"] }
      ],
      
      // Tops & Blouses (Bolir og toppar)
      "Bolir og toppar": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Zara, Mango" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "Annað"] },
        { name: "topType", label: "topType", type: "select",
          options: ["T-bolur", "Blússa", "Tanktop", "Crop Top", "Peysa", "Hettupeysa", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Bómull", "Polyester", "Silki", "Lín", "Blend", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Hvítt, Svart" },
        { name: "pattern", label: "pattern", type: "select",
          options: ["Einfaldur", "Rendur", "Blómamynstur", "Prikkar", "Annað"] },
        { name: "sleeveLength", label: "sleeveLength", type: "select",
          options: ["Ermalaus", "Stutterma", "3/4 ermar", "Langerma"] },
        { name: "neckline", label: "neckline", type: "select",
          options: ["V-Neck", "Round Neck", "Off-Shoulder", "Halter", "Boat Neck", "Annað"] }
      ],
      
      // Pants (Buxur)
      "Buxur": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Levi's, Zara" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["24", "25", "26", "27", "28", "29", "30", "32", "34", "XS", "S", "M", "L", "XL", "Annað"] },
        { name: "pantsType", label: "pantsType", type: "select",
          options: ["Gallabuxur", "Leggins", "Chinos", "Cargo", "Dress Pants", "Joggers", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Denim", "Bómull", "Polyester", "Leður", "Stretch", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Blátt, Svart" },
        { name: "fitType", label: "fitType", type: "select",
          options: ["Skinny", "Slim Fit", "Straight", "Boyfriend", "Wide Leg", "Bootcut", "Annað"] },
        { name: "rise", label: "rise", type: "select",
          options: ["Low Rise", "Mid Rise", "High Rise"] }
      ],
      
      // Skirts (Pils)
      "Pils": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Zara, H&M" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "Annað"] },
        { name: "skirtType", label: "skirtType", type: "select",
          options: ["A-Line", "Pencil", "Maxi", "Mini", "Midi", "Pleated", "Wrap", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Bómull", "Polyester", "Denim", "Leður", "Lín", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Rauður" },
        { name: "pattern", label: "pattern", type: "select",
          options: ["Einfaldur", "Rendur", "Blómamynstur", "Prikkar", "Annað"] },
        { name: "skirtLength", label: "skirtLength", type: "select",
          options: ["Mini", "Midi", "Maxi", "Annað"] }
      ],
      
      // Jackets (Jakkar)
      "Jakkar": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Mango, Zara" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "Annað"] },
        { name: "jacketType", label: "jacketType", type: "select",
          options: ["Blazer", "Leðurjakki", "Denim jakki", "Regnskúr", "Bomber jakki", "Prjónaður jakki", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Polyester", "Leður", "Denim", "Ull", "Bómull", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Brúnn" },
        { name: "fitType", label: "fitType", type: "select",
          options: ["Fitted", "Regular", "Oversized", "Annað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "t.d. Leggings, Nærföt" },
        { name: "brand", label: "brand", type: "text" },
        { name: "size", label: "size", type: "text" },
        { name: "color", label: "color", type: "text" }
      ]
    },
    
    // Kids' Clothing (Föt - Börn)
    "Föt - Börn": {
      // Boys (Drengir)
      "Drengir": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. H&M Kids, Gap Kids" },
        { name: "age", label: "age", type: "select", required: true,
          options: ["0-3 mán", "3-6 mán", "6-12 mán", "1-2 ára", "2-3 ára", "3-4 ára", "4-5 ára", "5-6 ára", "7-8 ára", "9-10 ára", "11-12 ára", "13-14 ára", "Annað"] },
        { name: "clothingType", label: "clothingType", type: "select",
          options: ["Bolur", "Skyrta", "Buxur", "Stuttbuxur", "Jakki", "Hettupeysa", "Jakkasett", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Bómull", "Polyester", "Blend", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Blár, Grænn" },
        { name: "season", label: "season", type: "select",
          options: ["Sumar", "Vetur", "Allt árið", "Annað"] }
      ],
      
      // Girls (Stúlkur)
      "Stúlkur": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. H&M Kids, Gap Kids" },
        { name: "age", label: "age", type: "select", required: true,
          options: ["0-3 mán", "3-6 mán", "6-12 mán", "1-2 ára", "2-3 ára", "3-4 ára", "4-5 ára", "5-6 ára", "7-8 ára", "9-10 ára", "11-12 ára", "13-14 ára", "Annað"] },
        { name: "clothingType", label: "clothingType", type: "select",
          options: ["Kjóll", "Bolur", "Pils", "Buxur", "Leggings", "Jakki", "Hettupeysa", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Bómull", "Polyester", "Blend", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Bleikur, Fjólublátt" },
        { name: "season", label: "season", type: "select",
          options: ["Sumar", "Vetur", "Allt árið", "Annað"] }
      ],
      
      // Babies (Ungbörn)
      "Ungbörn": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Carter's, H&M Baby" },
        { name: "age", label: "age", type: "select", required: true,
          options: ["0-3 mán", "3-6 mán", "6-9 mán", "9-12 mán", "12-18 mán", "18-24 mán", "Annað"] },
        { name: "clothingType", label: "clothingType", type: "select",
          options: ["Gráta", "Boli", "Sokkabuxur", "Sofahöld", "Yfirhafnir", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["100% Bómull", "Organic Cotton", "Blend", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Hvítt, Bleikt, Blátt" },
        { name: "gender", label: "gender", type: "select",
          options: ["Strákur", "Stúlka", "Unisex"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "t.d. Sokkar, Húfa" },
        { name: "brand", label: "brand", type: "text" },
        { name: "age", label: "age", type: "text" },
        { name: "color", label: "color", type: "text" }
      ]
    },
    
    // Shoes (Skór)
    "Skór": {
      // Men's Shoes (Karlaskór)
      "Karlaskór": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Nike, Adidas, Clarks" },
        { name: "shoeSize", label: "shoeSize", type: "select", required: true,
          options: ["39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "Annað"] },
        { name: "shoeType", label: "shoeType", type: "select",
          options: ["Íþróttaskór", "Leðurskór", "Stígvél", "Sandalar", "Loafers", "Oxfords", "Sneakers", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Leður", "Gervi leður", "Canvas", "Mesh", "Suede", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Brúnn, Hvítt" },
        { name: "occasion", label: "occasion", type: "select",
          options: ["Casual", "Formlegt", "Íþróttir", "Gönguskór", "Vinna", "Annað"] }
      ],
      
      // Women's Shoes (Kvennaskór)
      "Kvennaskór": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Nike, Clarks, Steve Madden" },
        { name: "shoeSize", label: "shoeSize", type: "select", required: true,
          options: ["35", "36", "37", "38", "39", "40", "41", "42", "Annað"] },
        { name: "shoeType", label: "shoeType", type: "select",
          options: ["Hælar", "Flats", "Stígvél", "Sandalar", "Sneakers", "Wedges", "Boots", "Annað"] },
        { name: "heelHeight", label: "heelHeight", type: "select",
          options: ["Flat (0-1 cm)", "Low (1-5 cm)", "Mid (5-8 cm)", "High (8+ cm)", "Á ekki við"] },
        { name: "material", label: "material", type: "select",
          options: ["Leður", "Gervi leður", "Suede", "Canvas", "Satin", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Rauður" },
        { name: "occasion", label: "occasion", type: "select",
          options: ["Casual", "Formlegt", "Partý", "Dagleg notkun", "Annað"] }
      ],
      
      // Kids' Shoes (Barnaskór)
      "Barnaskór": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Nike Kids, Adidas Kids" },
        { name: "shoeSize", label: "shoeSize", type: "select", required: true,
          options: ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "Annað"] },
        { name: "shoeType", label: "shoeType", type: "select",
          options: ["Sneakers", "Sandalar", "Stígvél", "Íþróttaskór", "Skólaskór", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Leður", "Canvas", "Mesh", "Gervi efni", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Blár, Bleikur" },
        { name: "gender", label: "gender", type: "select",
          options: ["Strákur", "Stúlka", "Unisex"] }
      ],
      
      // Sports Shoes (Íþróttaskór)
      "Íþróttaskór": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Nike, Adidas, Asics" },
        { name: "shoeSize", label: "shoeSize", type: "select", required: true,
          options: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "Annað"] },
        { name: "sportType", label: "sportType", type: "select",
          options: ["Hlaup", "Körfubolti", "Fótbolti", "Tennis", "Crossfit", "Almenn þjálfun", "Annað"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Karl", "Kona", "Unisex"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Hvítt" }
      ],
      
      // Boots (Stígvél)
      "Stígvél": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Timberland, Dr. Martens" },
        { name: "shoeSize", label: "shoeSize", type: "select", required: true,
          options: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "Annað"] },
        { name: "bootType", label: "bootType", type: "select",
          options: ["Vinnu stígvél", "Chelsea", "Combat", "Ankle", "Knee-High", "Hiking", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Leður", "Suede", "Rubber", "Gervi leður", "Annað"] },
        { name: "waterproof", label: "waterproof", type: "select",
          options: ["Já", "Nei", "Water Resistant"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Karl", "Kona", "Unisex"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Brúnn, Svart" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "shoeType", label: "shoeType", type: "text", placeholder: "t.d. Inniskór, Slippers" },
        { name: "brand", label: "brand", type: "text" },
        { name: "shoeSize", label: "shoeSize", type: "text" },
        { name: "color", label: "color", type: "text" }
      ]
    },
    
    // Accessories (Fylgihlutir)
    "Fylgihlutir": {
      // Bags & Wallets (Töskur og veski)
      "Töskur og veski": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Michael Kors, Coach" },
        { name: "accessoryType", label: "accessoryType", type: "select", required: true,
          options: ["Handtaska", "Bakpoki", "Axlartaska", "Clutch", "Veski", "Ferðataska", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Leður", "Gervi leður", "Canvas", "Nylon", "Suede", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Brúnn" },
        { name: "gender", label: "gender", type: "select",
          options: ["Kona", "Karl", "Unisex"] }
      ],
      
      // Hats (Hattar)
      "Hattar": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. New Era, Kangol" },
        { name: "hatType", label: "hatType", type: "select", required: true,
          options: ["Húfa", "Keps", "Fedora", "Beanie", "Bucket hat", "Beret", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Ull", "Bómull", "Polyester", "Stráhatur", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Blár" },
        { name: "size", label: "size", type: "select",
          options: ["One Size", "S/M", "L/XL", "Annað"] }
      ],
      
      // Belts (Belti)
      "Belti": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Levi's, Gucci" },
        { name: "material", label: "material", type: "select",
          options: ["Leður", "Gervi leður", "Canvas", "Fabric", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Brúnn" },
        { name: "beltWidth", label: "beltWidth", type: "select",
          options: ["Mjótt (<3 cm)", "Miðlungs (3-4 cm)", "Breitt (>4 cm)", "Annað"] },
        { name: "buckleType", label: "buckleType", type: "select",
          options: ["Hefðbundin spenna", "Automatic", "Plate buckle", "Annað"] },
        { name: "length", label: "length", type: "select",
          options: ["80-85 cm", "85-90 cm", "90-95 cm", "95-100 cm", "100-110 cm", "110-120 cm", "Annað"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Karl", "Kona", "Unisex"] }
      ],
      
      // Scarves & Shawls (Sjal og treflar)
      "Sjal og treflar": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Burberry, Pashmina" },
        { name: "accessoryType", label: "accessoryType", type: "select",
          options: ["Trefill", "Sjal", "Scarf", "Infinity scarf", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Ull", "Kashmír", "Silki", "Bómull", "Acrylic", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Rauður, Grár" },
        { name: "pattern", label: "pattern", type: "select",
          options: ["Einfaldur", "Rendur", "Tartan", "Grafík", "Annað"] },
        { name: "season", label: "season", type: "select",
          options: ["Vetur", "Sumar", "Allt árið", "Annað"] }
      ],
      
      // Gloves (Hanskar)
      "Hanskar": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. The North Face" },
        { name: "gloveType", label: "gloveType", type: "select",
          options: ["Vettlingar", "Fingrahanskar", "Leður hanskar", "Vinnuhanskar", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Ull", "Leður", "Fleece", "Gore-Tex", "Nylon", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Grár" },
        { name: "size", label: "size", type: "select",
          options: ["XS", "S", "M", "L", "XL", "One Size", "Annað"] },
        { name: "waterproof", label: "waterproof", type: "select",
          options: ["Já", "Nei", "Water Resistant"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "accessoryType", label: "accessoryType", type: "text", placeholder: "t.d. Sólgleraugu, Skartgripir" },
        { name: "brand", label: "brand", type: "text" },
        { name: "color", label: "color", type: "text" }
      ]
    }
  },
  
  // Vehicles (Farartæki)
  "Farartæki": {
    // Cars (Bílar)
    "Bílar": {
      // Passenger Cars (Fólksbílar)
      "Fólksbílar": [
        { name: "make", label: "make", type: "text", required: true, placeholder: "t.d. Toyota, Volkswagen, Ford" },
        { name: "carModel", label: "carModel", type: "text", required: true, placeholder: "t.d. Corolla, Golf, Focus" },
        { name: "year", label: "year", type: "number", required: true, placeholder: "t.d. 2018" },
        { name: "mileage", label: "mileage", type: "number", required: true, unit: "km", placeholder: "t.d. 65000" },
        { name: "fuelType", label: "fuelType", type: "select", required: true,
          options: ["Bensín", "Dísel", "Rafmagn", "Hybrid (Bensín)", "Hybrid (Dísel)", "Plug-in Hybrid", "Vetni", "Annað"] },
        { name: "transmission", label: "transmission", type: "select", required: true,
          options: ["Sjálfskiptur", "Beinskiptur"] },
        { name: "engineSize", label: "engineSize", type: "number", unit: "L", placeholder: "t.d. 2.0" },
        { name: "horsePower", label: "horsePower", type: "number", unit: "hp", placeholder: "t.d. 150" },
        { name: "driveType", label: "driveType", type: "select",
          options: ["Framhjóladrifinn", "Bakhjóladrifinn", "Fjórhjóladrifinn (4WD)", "Allsherjar (AWD)"] },
        { name: "numberOfDoors", label: "numberOfDoors", type: "select",
          options: ["2", "3", "4", "5"] },
        { name: "numberOfSeats", label: "numberOfSeats", type: "select",
          options: ["2", "4", "5", "7", "8+"] },
        { name: "exteriorColor", label: "exteriorColor", type: "text", placeholder: "t.d. Svart, Hvítt, Silfur" },
        { name: "interiorColor", label: "interiorColor", type: "text", placeholder: "t.d. Svart, Beige, Grár" },
        { name: "vin", label: "vin", type: "text", placeholder: "VIN númer (Vehicle Identification Number)" },
        { name: "registrationNumber", label: "registrationNumber", type: "text", placeholder: "Skráningarnúmer" },
        { name: "nextInspection", label: "nextInspection", type: "text", placeholder: "t.d. 06/2026" },
        { name: "vehicleFeatures", label: "vehicleFeatures", type: "multiselect",
          options: ["Leðursæti", "Sóllúga", "Bakkmyndavél", "Cruise Control", "Upphitað sæti", "Loftkæling", "GPS", "Bluetooth", "Apple CarPlay", "Android Auto", "Keyless Entry", "Start/Stop", "Lane Assist", "Parking Sensors", "Annað"] }
      ],
      
      // SUVs & Jeeps (Jeppar)
      "Jeppar": [
        { name: "make", label: "make", type: "text", required: true, placeholder: "t.d. Toyota, Land Rover, Jeep" },
        { name: "carModel", label: "carModel", type: "text", required: true, placeholder: "t.d. Land Cruiser, Defender, Wrangler" },
        { name: "year", label: "year", type: "number", required: true, placeholder: "t.d. 2020" },
        { name: "mileage", label: "mileage", type: "number", required: true, unit: "km", placeholder: "t.d. 45000" },
        { name: "fuelType", label: "fuelType", type: "select", required: true,
          options: ["Bensín", "Dísel", "Rafmagn", "Hybrid (Bensín)", "Hybrid (Dísel)", "Plug-in Hybrid", "Annað"] },
        { name: "transmission", label: "transmission", type: "select", required: true,
          options: ["Sjálfskiptur", "Beinskiptur"] },
        { name: "engineSize", label: "engineSize", type: "number", unit: "L", placeholder: "t.d. 3.0" },
        { name: "horsePower", label: "horsePower", type: "number", unit: "hp", placeholder: "t.d. 200" },
        { name: "driveType", label: "driveType", type: "select", required: true,
          options: ["Fjórhjóladrifinn (4WD)", "Allsherjar (AWD)", "Framhjóladrifinn"] },
        { name: "numberOfDoors", label: "numberOfDoors", type: "select",
          options: ["2", "3", "4", "5"] },
        { name: "numberOfSeats", label: "numberOfSeats", type: "select",
          options: ["5", "7", "8+"] },
        { name: "exteriorColor", label: "exteriorColor", type: "text", placeholder: "t.d. Svart, Hvítt" },
        { name: "interiorColor", label: "interiorColor", type: "text", placeholder: "t.d. Svart, Beige" },
        { name: "vin", label: "vin", type: "text", placeholder: "VIN númer" },
        { name: "registrationNumber", label: "registrationNumber", type: "text", placeholder: "Skráningarnúmer" },
        { name: "nextInspection", label: "nextInspection", type: "text", placeholder: "t.d. 06/2026" },
        { name: "offRoadCapability", label: "offRoadCapability", type: "select",
          options: ["Já - Modified", "Já - Stock", "Nei - Road Only"] },
        { name: "vehicleFeatures", label: "vehicleFeatures", type: "multiselect",
          options: ["Leðursæti", "Sóllúga", "Bakkmyndavél", "Cruise Control", "Upphitað sæti", "Loftkæling", "GPS", "Bluetooth", "Tow Hitch", "Roof Rack", "Winch", "Lift Kit", "Larger Tires", "Annað"] }
      ],
      
      // Sports Cars (Sportbílar)
      "Sportbílar": [
        { name: "make", label: "make", type: "text", required: true, placeholder: "t.d. Porsche, BMW, Mercedes-Benz" },
        { name: "carModel", label: "carModel", type: "text", required: true, placeholder: "t.d. 911, M3, AMG GT" },
        { name: "year", label: "year", type: "number", required: true, placeholder: "t.d. 2021" },
        { name: "mileage", label: "mileage", type: "number", required: true, unit: "km", placeholder: "t.d. 15000" },
        { name: "fuelType", label: "fuelType", type: "select", required: true,
          options: ["Bensín", "Dísel", "Rafmagn", "Hybrid", "Annað"] },
        { name: "transmission", label: "transmission", type: "select", required: true,
          options: ["Sjálfskiptur", "Beinskiptur", "Dual Clutch (DCT)", "Sequential"] },
        { name: "engineSize", label: "engineSize", type: "number", unit: "L", placeholder: "t.d. 3.0" },
        { name: "horsePower", label: "horsePower", type: "number", unit: "hp", placeholder: "t.d. 450" },
        { name: "zeroToHundred", label: "zeroToHundred", type: "number", unit: "sek", placeholder: "0-100 km/klst" },
        { name: "topSpeed", label: "topSpeed", type: "number", unit: "km/klst", placeholder: "t.d. 280" },
        { name: "driveType", label: "driveType", type: "select",
          options: ["Bakhjóladrifinn", "Fjórhjóladrifinn (4WD)", "Allsherjar (AWD)"] },
        { name: "numberOfDoors", label: "numberOfDoors", type: "select",
          options: ["2", "4"] },
        { name: "exteriorColor", label: "exteriorColor", type: "text", placeholder: "t.d. Rauður, Svart" },
        { name: "interiorColor", label: "interiorColor", type: "text", placeholder: "t.d. Svart, Rauður" },
        { name: "vin", label: "vin", type: "text", placeholder: "VIN númer" },
        { name: "registrationNumber", label: "registrationNumber", type: "text", placeholder: "Skráningarnúmer" },
        { name: "nextInspection", label: "nextInspection", type: "text", placeholder: "t.d. 06/2026" },
        { name: "performancePackage", label: "performancePackage", type: "select",
          options: ["Já", "Nei"] },
        { name: "vehicleFeatures", label: "vehicleFeatures", type: "multiselect",
          options: ["Leðursæti", "Kolefnisteygja", "Sóllúga", "Sport Exhaust", "Adaptive Suspension", "Launch Control", "Sport Steering Wheel", "Premium Sound System", "Carbon Brakes", "Alcantara Interior", "Annað"] }
      ],
      
      // RVs & Motorhomes (Húsbílar)
      "Húsbílar": [
        { name: "make", label: "make", type: "text", required: true, placeholder: "t.d. Mercedes, Hymer, Fiat" },
        { name: "carModel", label: "carModel", type: "text", required: true, placeholder: "t.d. Sprinter, B-Klasse" },
        { name: "year", label: "year", type: "number", required: true, placeholder: "t.d. 2019" },
        { name: "mileage", label: "mileage", type: "number", required: true, unit: "km", placeholder: "t.d. 30000" },
        { name: "fuelType", label: "fuelType", type: "select", required: true,
          options: ["Dísel", "Bensín", "Annað"] },
        { name: "transmission", label: "transmission", type: "select",
          options: ["Sjálfskiptur", "Beinskiptur"] },
        { name: "engineSize", label: "engineSize", type: "number", unit: "L", placeholder: "t.d. 2.3" },
        { name: "sleeps", label: "sleeps", type: "select",
          options: ["2", "3", "4", "5", "6+"] },
        { name: "vehicleLength", label: "vehicleLength", type: "number", unit: "m", placeholder: "t.d. 6.5" },
        { name: "vehicleHeight", label: "vehicleHeight", type: "number", unit: "m", placeholder: "t.d. 2.8" },
        { name: "vin", label: "vin", type: "text", placeholder: "VIN númer" },
        { name: "registrationNumber", label: "registrationNumber", type: "text", placeholder: "Skráningarnúmer" },
        { name: "nextInspection", label: "nextInspection", type: "text", placeholder: "t.d. 06/2026" },
        { name: "vehicleFeatures", label: "vehicleFeatures", type: "multiselect",
          options: ["Baðherbergi með sturtu", "Eldhús", "Kæli/Frystir", "Upphitun", "Loftkæling", "Sólarplötur", "Auka rafhlaða", "Bakkmyndavél", "Markísa", "TV", "Annað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "make", label: "make", type: "text", placeholder: "Framleiðandi" },
        { name: "carModel", label: "carModel", type: "text", placeholder: "Gerð" },
        { name: "year", label: "year", type: "number", placeholder: "Árgerð" },
        { name: "mileage", label: "mileage", type: "number", unit: "km", placeholder: "Ekinn fjöldi" }
      ]
    },
    
    // Motorcycles (Mótorhjól)
    "Mótorhjól": {
      // Street Bikes (Götuhjól)
      "Götuhjól": [
        { name: "make", label: "make", type: "text", required: true, placeholder: "t.d. Harley-Davidson, Yamaha, Honda" },
        { name: "motorcycleModel", label: "motorcycleModel", type: "text", required: true, placeholder: "t.d. Street 750, MT-07, CBR600RR" },
        { name: "year", label: "year", type: "number", required: true, placeholder: "t.d. 2019" },
        { name: "mileage", label: "mileage", type: "number", required: true, unit: "km", placeholder: "t.d. 12000" },
        { name: "engineSize", label: "engineSize", type: "number", unit: "cc", placeholder: "t.d. 750" },
        { name: "bikeType", label: "bikeType", type: "select",
          options: ["Cruiser", "Sport", "Naked", "Touring", "Standard", "Café Racer", "Annað"] },
        { name: "numberOfCylinders", label: "numberOfCylinders", type: "select",
          options: ["1", "2", "3", "4", "6"] },
        { name: "fuelType", label: "fuelType", type: "select",
          options: ["Bensín", "Rafmagn"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Rauður" },
        { name: "registrationNumber", label: "registrationNumber", type: "text", placeholder: "Skráningarnúmer" },
        { name: "nextInspection", label: "nextInspection", type: "text", placeholder: "t.d. 06/2026" },
        { name: "motorcycleFeatures", label: "motorcycleFeatures", type: "multiselect",
          options: ["ABS", "Traction Control", "Cruise Control", "Heated Grips", "Quick Shifter", "LED Lights", "Saddlebags", "Windscreen", "Custom Exhaust", "Annað"] }
      ],
      
      // Dirt Bikes (Krosshjól)
      "Krosshjól": [
        { name: "make", label: "make", type: "text", required: true, placeholder: "t.d. KTM, Honda, Yamaha" },
        { name: "motorcycleModel", label: "motorcycleModel", type: "text", required: true, placeholder: "t.d. 250 SX-F, CRF450R" },
        { name: "year", label: "year", type: "number", required: true, placeholder: "t.d. 2021" },
        { name: "engineSize", label: "engineSize", type: "number", unit: "cc", placeholder: "t.d. 250" },
        { name: "bikeType", label: "bikeType", type: "select",
          options: ["Motocross", "Enduro", "Trail", "Dual Sport", "Annað"] },
        { name: "strokeType", label: "strokeType", type: "select",
          options: ["2-stroke", "4-stroke"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Appelsínugulur, Blár" },
        { name: "hoursUsed", label: "hoursUsed", type: "number", unit: "klst", placeholder: "Notkunartímar" }
      ],
      
      // Scooters (Vespuhjól)
      "Vespuhjól": [
        { name: "make", label: "make", type: "text", required: true, placeholder: "t.d. Vespa, Honda, Yamaha" },
        { name: "motorcycleModel", label: "motorcycleModel", type: "text", required: true, placeholder: "t.d. Primavera, PCX, NMAX" },
        { name: "year", label: "year", type: "number", required: true, placeholder: "t.d. 2020" },
        { name: "mileage", label: "mileage", type: "number", required: true, unit: "km", placeholder: "t.d. 5000" },
        { name: "engineSize", label: "engineSize", type: "number", unit: "cc", placeholder: "t.d. 125" },
        { name: "fuelType", label: "fuelType", type: "select",
          options: ["Bensín", "Rafmagn"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Hvítt, Rauður" },
        { name: "registrationNumber", label: "registrationNumber", type: "text", placeholder: "Skráningarnúmer" },
        { name: "nextInspection", label: "nextInspection", type: "text", placeholder: "t.d. 06/2026" }
      ],
      
      // ATVs & Quads (Fjórhjól)
      "Fjórhjól": [
        { name: "make", label: "make", type: "text", required: true, placeholder: "t.d. Polaris, Can-Am, Yamaha" },
        { name: "motorcycleModel", label: "motorcycleModel", type: "text", required: true, placeholder: "t.d. Sportsman, Outlander, Grizzly" },
        { name: "year", label: "year", type: "number", required: true, placeholder: "t.d. 2018" },
        { name: "hoursUsed", label: "hoursUsed", type: "number", unit: "klst", placeholder: "Notkunartímar" },
        { name: "engineSize", label: "engineSize", type: "number", unit: "cc", placeholder: "t.d. 570" },
        { name: "driveType", label: "driveType", type: "select",
          options: ["2WD", "4WD", "AWD"] },
        { name: "atvType", label: "atvType", type: "select",
          options: ["Utility", "Sport", "Youth", "Side-by-Side (UTV)", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Grænn, Svart" },
        { name: "vehicleFeatures", label: "vehicleFeatures", type: "multiselect",
          options: ["Winch", "Plow", "Storage Box", "Roof", "Windshield", "Heated Grips", "Annað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "make", label: "make", type: "text", placeholder: "Framleiðandi" },
        { name: "motorcycleModel", label: "motorcycleModel", type: "text", placeholder: "Gerð" },
        { name: "year", label: "year", type: "number", placeholder: "Árgerð" },
        { name: "engineSize", label: "engineSize", type: "number", unit: "cc", placeholder: "Vélarstærð" }
      ]
    },
    
    // Campers (Hjólhýsi)
    "Hjólhýsi": {
      // Tent Trailers (Tjaldvagnar)
      "Tjaldvagnar": [
        { name: "make", label: "make", type: "text", required: true, placeholder: "t.d. Jayco, Coleman" },
        { name: "camperModel", label: "camperModel", type: "text", required: true, placeholder: "Gerð" },
        { name: "year", label: "year", type: "number", required: true, placeholder: "t.d. 2017" },
        { name: "sleeps", label: "sleeps", type: "select",
          options: ["2", "3", "4", "5", "6", "7", "8+"] },
        { name: "weight", label: "weight", type: "number", unit: "kg", placeholder: "Þyngd þegar pakkaður" },
        { name: "camperFeatures", label: "camperFeatures", type: "multiselect",
          options: ["Eldhús", "Vatn kerfi", "Upphitun", "Markísa", "Borð og stólar", "Sólarsella", "Annað"] }
      ],
      
      // Camper Furniture (Húsbílahúsgögn)
      "Húsbílahúsgögn": [
        { name: "furnitureType", label: "furnitureType", type: "select", required: true,
          options: ["Rúm", "Borð", "Stóll", "Skápar", "Eldhúsbúnaður", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "material", label: "material", type: "text", placeholder: "t.d. Tré, Ál, Plast" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" }
      ]
    },
    
    // Parts (Varahlutir)
    "Varahlutir": {
      // Wheels & Tires (Hjól og dekk)
      "Hjól og dekk": [
        { name: "partType", label: "partType", type: "select", required: true,
          options: ["Hjól (Rims)", "Dekk (Tires)", "Hjól og dekk saman", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Michelin, Pirelli, BBS" },
        { name: "tireSize", label: "tireSize", type: "text", placeholder: "t.d. 205/55R16, 275/40R20" },
        { name: "rimSize", label: "rimSize", type: "text", placeholder: "t.d. 16\", 18\", 20\"" },
        { name: "boltPattern", label: "boltPattern", type: "text", placeholder: "t.d. 5x114.3, 5x120" },
        { name: "quantity", label: "quantity", type: "select",
          options: ["1", "2", "3", "4", "5+"] },
        { name: "season", label: "season", type: "select",
          options: ["Sumardekk", "Vetradekk", "All Season", "Annað"] },
        { name: "treadDepth", label: "treadDepth", type: "text", placeholder: "Myntardýpt (mm)" }
      ],
      
      // Audio Systems (Hljóðkerfi)
      "Hljóðkerfi": [
        { name: "partType", label: "partType", type: "select", required: true,
          options: ["Stereo/Head Unit", "Hátalara", "Subwoofer", "Amplifier", "Heilt kerfi", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Pioneer, Sony, JBL, Focal" },
        { name: "features", label: "features", type: "multiselect",
          options: ["Bluetooth", "Apple CarPlay", "Android Auto", "GPS", "CD Player", "USB", "Touchscreen", "Annað"] }
      ],
      
      // Lights (Ljós)
      "Ljós": [
        { name: "lightType", label: "lightType", type: "select", required: true,
          options: ["Framljós", "Bakljós", "Blikkers", "Þokuljós", "LED bar", "Interior lights", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Philips, Osram, Hella" },
        { name: "bulbType", label: "bulbType", type: "select",
          options: ["LED", "Halogen", "Xenon/HID", "Annað"] },
        { name: "compatibleVehicles", label: "compatibleVehicles", type: "text", placeholder: "Hvaða bílum passar þetta?" }
      ],
      
      // Interior Parts (Innri hlutir)
      "Innri hlutir": [
        { name: "partType", label: "partType", type: "select", required: true,
          options: ["Sæti", "Stýri", "Dashboard", "Teppi", "Interior trim", "Mælaborð", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "compatibleVehicles", label: "compatibleVehicles", type: "text", placeholder: "Hvaða bílum passar þetta?" },
        { name: "color", label: "color", type: "text", placeholder: "Litur" },
        { name: "material", label: "material", type: "select",
          options: ["Leður", "Alcantara", "Fabric", "Vinyl", "Plast", "Annað"] }
      ],
      
      // Exterior Parts (Ytri hlutir)
      "Ytri hlutir": [
        { name: "partType", label: "partType", type: "select", required: true,
          options: ["Bumper", "Hood", "Fender", "Door", "Grille", "Mirror", "Spoiler", "Body kit", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "compatibleVehicles", label: "compatibleVehicles", type: "text", placeholder: "Hvaða bílum passar þetta?" },
        { name: "color", label: "color", type: "text", placeholder: "Litur (ef málað)" },
        { name: "material", label: "material", type: "select",
          options: ["Plast", "Málmur", "Kolefnisteygja", "Fiberglass", "Annað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "partType", label: "partType", type: "text", required: true, placeholder: "t.d. Vél, Transmission, Brake pads" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "compatibleVehicles", label: "compatibleVehicles", type: "text", placeholder: "Hvaða ökutækjum passar þetta?" }
      ]
    },
    
    // Accessories (Fylgihlutir)
    "Fylgihlutir": {
      // GPS & Charging (GPS og hleðsla)
      "GPS og hleðsla": [
        { name: "accessoryType", label: "accessoryType", type: "select", required: true,
          options: ["GPS", "Símahaldari", "USB hleðslutæki", "Þráðlaus hleðsla", "Dashcam", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Garmin, TomTom, Anker" },
        { name: "features", label: "features", type: "multiselect",
          options: ["Bluetooth", "WiFi", "Voice Control", "Live Traffic", "Multiple USB ports", "Fast Charging", "Annað"] }
      ],
      
      // Car Decor (Bifreiðaskraut)
      "Bifreiðaskraut": [
        { name: "decorType", label: "decorType", type: "select", required: true,
          options: ["Sætishlífar", "Stýrishjólshlíf", "Gólfmottur", "Ilmkubbar", "LED lights", "Stickers/Decals", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "color", label: "color", type: "text", placeholder: "Litur" },
        { name: "material", label: "material", type: "text", placeholder: "t.d. Leður, Gúmmí, Plast" }
      ],
      
      // Cleaning Products (Hreinsiefni)
      "Hreinsiefni": [
        { name: "cleaningType", label: "cleaningType", type: "select", required: true,
          options: ["Bílasápa", "Wax/Polish", "Interior cleaner", "Glass cleaner", "Wheel cleaner", "Clay bar", "Microfiber towels", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Meguiar's, Chemical Guys, Turtle Wax" },
        { name: "volume", label: "volume", type: "text", placeholder: "t.d. 500ml, 1L" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "accessoryType", label: "accessoryType", type: "text", required: true, placeholder: "Tegund fylgihluta" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "vehicleType", label: "vehicleType", type: "text", placeholder: "Tegund ökutækis/vöru" },
      { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" }
    ]
  },
  
  // Home & Garden (Heimili & Garður)
  "Heimili & Garður": {
    // Furniture (Húsgögn)
    "Húsgögn": {
      // Sofas & Chairs (Sófar og stólar)
      "Sófar og stólar": [
        { name: "furnitureType", label: "furnitureType", type: "select", required: true,
          options: ["Sófi", "Sófi með sófabeði", "Hornsófi", "Armstóll", "Borðstóll", "Skrifstofustóll", "Bar stóll", "Daybed", "Ottóman", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. IKEA, Karlsson" },
        { name: "material", label: "material", type: "select",
          options: ["Leður", "Gervi leður", "Fabric", "Velvet", "Microfiber", "Linen", "Tré", "Plast", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Grár, Beige, Blátt" },
        { name: "numberOfSeats", label: "numberOfSeats", type: "select",
          options: ["1", "2", "3", "4", "5+", "Á ekki við"] },
        { name: "dimensions", label: "dimensions", type: "text", placeholder: "Lengd x Breidd x Hæð (cm)" },
        { name: "assemblyRequired", label: "assemblyRequired", type: "select",
          options: ["Já", "Nei", "Að hluta til"] }
      ],
      
      // Tables (Borð)
      "Borð": [
        { name: "tableType", label: "tableType", type: "select", required: true,
          options: ["Borðstofuborð", "Kaffistofu borð", "Skrifstofu borð", "Konsól borð", "Bar borð", "Hliðarborð", "Útihúsgagna borð", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. IKEA, Hay" },
        { name: "material", label: "material", type: "select",
          options: ["Tré", "Gler", "Marmari", "Málmur", "MDF", "Plast", "Blandað efni", "Annað"] },
        { name: "shape", label: "shape", type: "select",
          options: ["Rétthyrnt", "Hringlaga", "Kringlótt", "Sporöskjulaga", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Tré, Svart, Hvítt" },
        { name: "seatsNumber", label: "seatsNumber", type: "select",
          options: ["2", "4", "6", "8", "8+", "Á ekki við"] },
        { name: "dimensions", label: "dimensions", type: "text", placeholder: "Lengd x Breidd x Hæð (cm)" },
        { name: "extendable", label: "extendable", type: "select",
          options: ["Já", "Nei"] },
        { name: "assemblyRequired", label: "assemblyRequired", type: "select",
          options: ["Já", "Nei", "Að hluta til"] }
      ],
      
      // Beds (Rúm)
      "Rúm": [
        { name: "bedType", label: "bedType", type: "select", required: true,
          options: ["Tvíbreitt rúm", "Einbreitt rúm", "Queen size", "King size", "Háhæð rúm", "Kofarúm", "Dagbeð", "Barnarúm", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. IKEA, Tempurpedic" },
        { name: "bedSize", label: "bedSize", type: "select",
          options: ["80x200 cm", "90x200 cm", "120x200 cm", "140x200 cm", "160x200 cm", "180x200 cm", "200x200 cm", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Tré", "Málmur", "Upholstered", "Leður", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Hvítt, Tré" },
        { name: "includesMattress", label: "includesMattress", type: "select",
          options: ["Já", "Nei"] },
        { name: "storage", label: "storage", type: "select",
          options: ["Já - Skúffur", "Já - Lyftandi", "Nei"] },
        { name: "assemblyRequired", label: "assemblyRequired", type: "select",
          options: ["Já", "Nei", "Að hluta til"] }
      ],
      
      // Cabinets (Skápar)
      "Skápar": [
        { name: "cabinetType", label: "cabinetType", type: "select", required: true,
          options: ["Fata skápur", "Skenkur", "TV skápur", "Skápur með spegli", "Bókaskápur", "Skóskápur", "Buffet", "China Cabinet", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. IKEA, Bolia" },
        { name: "material", label: "material", type: "select",
          options: ["Tré", "MDF", "Málmur", "Gler", "Blandað efni", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Hvítt, Svart, Tré" },
        { name: "dimensions", label: "dimensions", type: "text", placeholder: "Lengd x Breidd x Hæð (cm)" },
        { name: "numberOfDoors", label: "numberOfDoors", type: "select",
          options: ["0 (Opin)", "1", "2", "3", "4+"] },
        { name: "numberOfDrawers", label: "numberOfDrawers", type: "select",
          options: ["0", "1", "2", "3", "4", "5+"] },
        { name: "assemblyRequired", label: "assemblyRequired", type: "select",
          options: ["Já", "Nei", "Að hluta til"] }
      ],
      
      // Shelves (Hillur)
      "Hillur": [
        { name: "shelfType", label: "shelfType", type: "select", required: true,
          options: ["Bókahilla", "Veggshilla", "Ladder shelf", "Hornahilla", "Floating shelf", "Storage shelf", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. IKEA, String" },
        { name: "material", label: "material", type: "select",
          options: ["Tré", "Málmur", "MDF", "Gler", "Blandað efni", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Hvítt, Svart, Tré" },
        { name: "dimensions", label: "dimensions", type: "text", placeholder: "Lengd x Breidd x Hæð (cm)" },
        { name: "numberOfShelves", label: "numberOfShelves", type: "select",
          options: ["1", "2", "3", "4", "5", "6+"] },
        { name: "assemblyRequired", label: "assemblyRequired", type: "select",
          options: ["Já", "Nei", "Að hluta til"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "furnitureType", label: "furnitureType", type: "text", placeholder: "Tegund húsgagns" },
        { name: "brand", label: "brand", type: "text" },
        { name: "material", label: "material", type: "text" },
        { name: "dimensions", label: "dimensions", type: "text", placeholder: "Stærð" }
      ]
    },
    
    // Kitchen (Eldhúsbúnaður)
    "Eldhúsbúnaður": {
      // Cookware (Pottaefni)
      "Pottaefni": [
        { name: "cookwareType", label: "cookwareType", type: "select", required: true,
          options: ["Pottur", "Panna", "Steikarpanna", "Wok", "Pottasett", "Kökuform", "Grillpanna", "Pressure cooker", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Tefal, Le Creuset, Fiskars" },
        { name: "material", label: "material", type: "select",
          options: ["Stainless Steel", "Non-stick", "Cast Iron", "Copper", "Aluminum", "Ceramic", "Annað"] },
        { name: "size", label: "size", type: "text", placeholder: "t.d. 24cm, 3L" },
        { name: "pieceCount", label: "pieceCount", type: "select",
          options: ["1", "2", "3-5", "6-10", "10+"] },
        { name: "ovenSafe", label: "ovenSafe", type: "select",
          options: ["Já", "Nei"] },
        { name: "dishwasherSafe", label: "dishwasherSafe", type: "select",
          options: ["Já", "Nei"] }
      ],
      
      // Tableware (Borðbúnaður)
      "Borðbúnaður": [
        { name: "tablewareType", label: "tablewareType", type: "select", required: true,
          options: ["Diskasett", "Glas", "Bestik", "Kaffibollasett", "Vínglös", "Serveringadiskur", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Royal Copenhagen, Iittala" },
        { name: "material", label: "material", type: "select",
          options: ["Postulín", "Keramik", "Gler", "Stainless Steel", "Plast", "Tré", "Annað"] },
        { name: "pieceCount", label: "pieceCount", type: "text", placeholder: "t.d. 12 pieces, 6 persónur" },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Hvítt, Blátt" },
        { name: "dishwasherSafe", label: "dishwasherSafe", type: "select",
          options: ["Já", "Nei"] }
      ],
      
      // Small Appliances (Smátæki)
      "Smátæki": [
        { name: "applianceType", label: "applianceType", type: "select", required: true,
          options: ["Kaffivél", "Brauðrist", "Blandari", "Matarvinnsluvél", "Hrærivél", "Slow Cooker", "Air Fryer", "Ketill", "Mikrobylgjuofn", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. KitchenAid, Nespresso, Bosch" },
        { name: "power", label: "power", type: "number", unit: "W", placeholder: "t.d. 1200" },
        { name: "capacity", label: "capacity", type: "text", placeholder: "t.d. 1.5L, 6 cups" },
        { name: "color", label: "color", type: "text", placeholder: "t.d. Svart, Stainless" }
      ],
      
      // Storage (Geymsla)
      "Geymsla": [
        { name: "storageType", label: "storageType", type: "select", required: true,
          options: ["Matvælageymsla", "Brauðkassi", "Krydd rekki", "Ruslatunna", "Vínrekki", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "material", label: "material", type: "select",
          options: ["Plast", "Gler", "Málmur", "Tré", "Keramik", "Annað"] },
        { name: "capacity", label: "capacity", type: "text", placeholder: "t.d. 5L, 20 flöskur" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text" }
      ]
    },
    
    // Decor (Skraut)
    "Skraut": {
      // Wall Decor (Veggskraut)
      "Veggskraut": [
        { name: "decorType", label: "decorType", type: "select", required: true,
          options: ["Mynd í ramma", "Spegill", "Veggklukka", "Veggrekki", "Canvas print", "Poster", "Veggljósstjaki", "Annað"] },
        { name: "dimensions", label: "dimensions", type: "text", placeholder: "Stærð (cm)" },
        { name: "color", label: "color", type: "text", placeholder: "Litur/Litir" },
        { name: "material", label: "material", type: "text", placeholder: "t.d. Tré, Málmur, Gler" },
        { name: "style", label: "style", type: "select",
          options: ["Modern", "Scandinavian", "Vintage", "Industrial", "Bohemian", "Minimalist", "Annað"] }
      ],
      
      // Candles (Kerti)
      "Kerti": [
        { name: "candleType", label: "candleType", type: "select", required: true,
          options: ["Ilmkerti", "Pillar candle", "Tea light", "Vax kerti", "LED kerti", "Kertastjaki", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Yankee Candle" },
        { name: "scent", label: "scent", type: "text", placeholder: "t.d. Vanilla, Lavender" },
        { name: "size", label: "size", type: "text", placeholder: "Stærð/þyngd" },
        { name: "burnTime", label: "burnTime", type: "text", placeholder: "t.d. 40 klst" }
      ],
      
      // Cushions (Púðar)
      "Púðar": [
        { name: "cushionType", label: "cushionType", type: "select", required: true,
          options: ["Sófa púði", "Rúmpúði", "Sætispúði", "Gólfpúði", "Annað"] },
        { name: "size", label: "size", type: "text", placeholder: "t.d. 50x50 cm" },
        { name: "material", label: "material", type: "select",
          options: ["Bómull", "Velvet", "Linen", "Polyester", "Ull", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" },
        { name: "includeInsert", label: "includeInsert", type: "select",
          options: ["Já", "Nei - Aðeins húð"] }
      ],
      
      // Rugs (Teppi)
      "Teppi": [
        { name: "rugType", label: "rugType", type: "select", required: true,
          options: ["Stofuherbergisteppi", "Gangstétt", "Útiteppi", "Bath mat", "Annað"] },
        { name: "size", label: "size", type: "text", placeholder: "t.d. 200x300 cm" },
        { name: "material", label: "material", type: "select",
          options: ["Ull", "Bómull", "Polyester", "Jute", "Sísal", "Gervi leður", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur/mynstur" },
        { name: "shape", label: "shape", type: "select",
          options: ["Rétthyrnt", "Hringlaga", "Kringlótt", "Runner", "Annað"] }
      ],
      
      // Lights (Ljós)
      "Ljós": [
        { name: "lightType", label: "lightType", type: "select", required: true,
          options: ["Loftlampi", "Vegglampi", "Gólflampi", "Borðlampi", "Pendant light", "Ljós strengur", "LED strip", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Philips, IKEA" },
        { name: "material", label: "material", type: "text", placeholder: "t.d. Málmur, Gler, Tré" },
        { name: "color", label: "color", type: "text", placeholder: "Litur" },
        { name: "bulbIncluded", label: "bulbIncluded", type: "select",
          options: ["Já", "Nei"] },
        { name: "bulbType", label: "bulbType", type: "select",
          options: ["LED", "E27", "E14", "GU10", "Innbyggður LED", "Annað", "Á ekki við"] },
        { name: "dimmable", label: "dimmable", type: "select",
          options: ["Já", "Nei"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "decorType", label: "decorType", type: "text", placeholder: "Tegund skrauts" },
        { name: "material", label: "material", type: "text" },
        { name: "color", label: "color", type: "text" }
      ]
    },
    
    // Tools (Verkfæri)
    "Verkfæri": {
      // Power Tools (Rafverkfæri)
      "Rafverkfæri": [
        { name: "toolType", label: "toolType", type: "select", required: true,
          options: ["Bora", "Sög", "Sanders", "Grinder", "Impact driver", "Hammer drill", "Jigsaw", "Circular saw", "Nailer", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Makita, DeWalt, Bosch, Milwaukee" },
        { name: "powerSource", label: "powerSource", type: "select",
          options: ["Rafhlöðu", "Rafmagn (snúra)", "Loftpressur", "Bensín", "Annað"] },
        { name: "voltage", label: "voltage", type: "select",
          options: ["12V", "18V", "20V", "40V", "220V", "Annað"] },
        { name: "batteryIncluded", label: "batteryIncluded", type: "select",
          options: ["Já", "Nei", "Á ekki við"] },
        { name: "includesCase", label: "includesCase", type: "select",
          options: ["Já", "Nei"] }
      ],
      
      // Hand Tools (Handverkfæri)
      "Handverkfæri": [
        { name: "toolType", label: "toolType", type: "select", required: true,
          options: ["Hamar", "Skrúfjárn", "Tæng", "Lykill", "Sagir", "Verkfærasett", "Målebånd", "Vinnubelti", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Stanley, Bahco" },
        { name: "material", label: "material", type: "select",
          options: ["Stál", "Chrome Vanadium", "Carbon Steel", "Plast", "Annað"] },
        { name: "pieceCount", label: "pieceCount", type: "text", placeholder: "Fjöldi í setti" }
      ],
      
      // Painting Supplies (Málningarbúnaður)
      "Málningarbúnaður": [
        { name: "paintingType", label: "paintingType", type: "select", required: true,
          options: ["Penslar", "Rúllur", "Sprayer", "Tape", "Drop cloths", "Málningarsett", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "size", label: "size", type: "text", placeholder: "Stærð" }
      ],
      
      // Measuring Tools (Mælikvarðar)
      "Mælikvarðar": [
        { name: "measuringType", label: "measuringType", type: "select", required: true,
          options: ["Målebånd", "Laser measure", "Vog", "Vatnslína", "Vindur", "Digital caliper", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Stanley, Bosch" },
        { name: "maxMeasure", label: "maxMeasure", type: "text", placeholder: "t.d. 5m, 30m" },
        { name: "accuracy", label: "accuracy", type: "text", placeholder: "Nákvæmni" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "toolType", label: "toolType", type: "text", placeholder: "Tegund verkfæris" },
        { name: "brand", label: "brand", type: "text" }
      ]
    },
    
    // Garden (Garðyrkja)
    "Garðyrkja": {
      // Garden Tools (Garðverkfæri)
      "Garðverkfæri": [
        { name: "gardenToolType", label: "gardenToolType", type: "select", required: true,
          options: ["Skófla", "Hrífill", "Garðklippur", "Trimmer", "Hedge trimmer", "Leaf blower", "Sláttuvél", "Garðverkfærasett", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Fiskars, Gardena" },
        { name: "powerSource", label: "powerSource", type: "select",
          options: ["Handvirkt", "Rafmagn", "Rafhlöðu", "Bensín", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Stál", "Aluminum", "Plast", "Tré", "Annað"] }
      ],
      
      // Pots & Planters (Pottur og krukk)
      "Pottur og krukk": [
        { name: "planterType", label: "planterType", type: "select", required: true,
          options: ["Garðpottur", "Hanging planter", "Innipottur", "Jarðveg kassi", "Annað"] },
        { name: "material", label: "material", type: "select",
          options: ["Terracotta", "Keramik", "Plast", "Málmur", "Tré", "Cement", "Annað"] },
        { name: "size", label: "size", type: "text", placeholder: "t.d. 30cm diameter, 20L" },
        { name: "color", label: "color", type: "text", placeholder: "Litur" },
        { name: "drainage", label: "drainage", type: "select",
          options: ["Já - Með göt", "Nei - Engin göt"] }
      ],
      
      // Seeds & Plants (Fræ og plöntur)
      "Fræ og plöntur": [
        { name: "plantType", label: "plantType", type: "select", required: true,
          options: ["Fræ", "Inniplanta", "Útiplanta", "Tré", "Blóm", "Grænmeti", "Jurta", "Kaktus/Succulent", "Annað"] },
        { name: "plantName", label: "plantName", type: "text", placeholder: "Nafn plöntu" },
        { name: "potIncluded", label: "potIncluded", type: "select",
          options: ["Já", "Nei"] },
        { name: "careLevel", label: "careLevel", type: "select",
          options: ["Auðvelt", "Meðal", "Erfitt"] },
        { name: "lightRequirement", label: "lightRequirement", type: "select",
          options: ["Mikið ljós", "Meðal ljós", "Lítið ljós", "Skuggi"] }
      ],
      
      // Lawn Mowers (Sláttuvélar)
      "Sláttuvélar": [
        { name: "mowerType", label: "mowerType", type: "select", required: true,
          options: ["Push mower", "Self-propelled", "Riding mower", "Robot mower", "Reel mower", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Honda, Husqvarna" },
        { name: "powerSource", label: "powerSource", type: "select", required: true,
          options: ["Bensín", "Rafmagn", "Rafhlöðu", "Handvirkt", "Annað"] },
        { name: "cuttingWidth", label: "cuttingWidth", type: "number", unit: "cm", placeholder: "t.d. 46" },
        { name: "cuttingHeight", label: "cuttingHeight", type: "text", placeholder: "t.d. 25-75mm" },
        { name: "bagIncluded", label: "bagIncluded", type: "select",
          options: ["Já", "Nei"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text" }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
      { name: "brand", label: "brand", type: "text" }
    ]
  },
  
  // Sports & Outdoors (Íþróttir & Útivist)
  "Íþróttir & Útivist": {
    // Fitness Equipment (Líkamsræktarbúnaður)
    "Líkamsræktarbúnaður": {
      // Weights & Equipment (Lóð og búnaður)
      "Lóð og búnaður": [
        { name: "equipmentType", label: "equipmentType", type: "select", required: true,
          options: ["Dumbbell", "Barbell", "Kettlebell", "Lóðadiskur", "Weight bench", "Squat rack", "Pull-up bar", "Resistance bands", "Medicine ball", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Rogue, Eleiko" },
        { name: "weight", label: "weight", type: "text", placeholder: "t.d. 10kg, 20kg, Adjustable" },
        { name: "material", label: "material", type: "select",
          options: ["Járn", "Stál", "Gúmmí húðuð", "Neopren", "Annað"] },
        { name: "adjustable", label: "adjustable", type: "select",
          options: ["Já", "Nei"] }
      ],
      
      // Yoga Equipment (Jógabúnaður)
      "Jógabúnaður": [
        { name: "yogaEquipmentType", label: "yogaEquipmentType", type: "select", required: true,
          options: ["Jógamotta", "Jógakubbur", "Jógareim", "Bolster", "Meditation cushion", "Jógasett", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Manduka, Gaiam" },
        { name: "material", label: "material", type: "select",
          options: ["PVC", "TPE", "Natural rubber", "Cork", "Bómull", "Annað"] },
        { name: "thickness", label: "thickness", type: "text", placeholder: "t.d. 3mm, 5mm, 6mm" },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Exercise Bikes (Hjólreiðaþjálfar)
      "Hjólreiðaþjálfar": [
        { name: "bikeTrainerType", label: "bikeTrainerType", type: "select", required: true,
          options: ["Stationary bike", "Spin bike", "Recumbent bike", "Air bike", "Bike trainer (roller)", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Peloton, Schwinn, Wahoo" },
        { name: "resistance", label: "resistance", type: "select",
          options: ["Magnetic", "Friction", "Air", "Direct drive", "Annað"] },
        { name: "hasDisplay", label: "hasDisplay", type: "select",
          options: ["Já", "Nei"] },
        { name: "maxUserWeight", label: "maxUserWeight", type: "number", unit: "kg", placeholder: "t.d. 150" },
        { name: "adjustable", label: "adjustable", type: "select",
          options: ["Já - Full adjustable", "Já - Partial", "Nei"] }
      ],
      
      // Treadmills (Hlaupaborð)
      "Hlaupaborð": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. NordicTrack, ProForm" },
        { name: "motorPower", label: "motorPower", type: "number", unit: "HP", placeholder: "t.d. 2.5" },
        { name: "maxSpeed", label: "maxSpeed", type: "number", unit: "km/klst", placeholder: "t.d. 20" },
        { name: "inclineRange", label: "inclineRange", type: "text", placeholder: "t.d. 0-15%" },
        { name: "beltSize", label: "beltSize", type: "text", placeholder: "t.d. 140x50 cm" },
        { name: "maxUserWeight", label: "maxUserWeight", type: "number", unit: "kg", placeholder: "t.d. 150" },
        { name: "foldable", label: "foldable", type: "select",
          options: ["Já", "Nei"] },
        { name: "hasDisplay", label: "hasDisplay", type: "select",
          options: ["Já", "Nei"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "equipmentType", label: "equipmentType", type: "text", placeholder: "Tegund búnaðar" },
        { name: "brand", label: "brand", type: "text" }
      ]
    },
    
    // Bikes (Hjól)
    "Hjól": {
      // Road Bikes (Götuhjól)
      "Götuhjól": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Trek, Specialized, Giant" },
        { name: "bikeModel", label: "bikeModel", type: "text", placeholder: "Gerð" },
        { name: "frameSize", label: "frameSize", type: "select", required: true,
          options: ["XS (47-49 cm)", "S (50-52 cm)", "M (53-55 cm)", "L (56-58 cm)", "XL (59-61 cm)", "XXL (62+ cm)", "Annað"] },
        { name: "frameMaterial", label: "frameMaterial", type: "select",
          options: ["Carbon", "Aluminum", "Stál", "Titanium", "Annað"] },
        { name: "wheelSize", label: "wheelSize", type: "select",
          options: ["700c", "650b", "26\"", "27.5\"", "29\"", "Annað"] },
        { name: "gears", label: "gears", type: "text", placeholder: "t.d. 21 speed, 11 speed" },
        { name: "brakeType", label: "brakeType", type: "select",
          options: ["Rim brakes", "Disc brakes - Mechanical", "Disc brakes - Hydraulic", "Annað"] },
        { name: "suspension", label: "suspension", type: "select",
          options: ["Engin", "Front", "Full suspension", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Mountain Bikes (Fjallahjól)
      "Fjallahjól": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Trek, Specialized, Cannondale" },
        { name: "bikeModel", label: "bikeModel", type: "text", placeholder: "Gerð" },
        { name: "frameSize", label: "frameSize", type: "select", required: true,
          options: ["XS (13-14\")", "S (15-16\")", "M (17-18\")", "L (19-20\")", "XL (21-22\")", "XXL (23+\")", "Annað"] },
        { name: "frameMaterial", label: "frameMaterial", type: "select",
          options: ["Carbon", "Aluminum", "Stál", "Titanium", "Annað"] },
        { name: "wheelSize", label: "wheelSize", type: "select",
          options: ["26\"", "27.5\"", "29\"", "Annað"] },
        { name: "gears", label: "gears", type: "text", placeholder: "t.d. 1x12, 2x10" },
        { name: "brakeType", label: "brakeType", type: "select",
          options: ["Disc brakes - Mechanical", "Disc brakes - Hydraulic", "Annað"] },
        { name: "suspension", label: "suspension", type: "select", required: true,
          options: ["Hardtail (front only)", "Full suspension", "Rigid (engin)", "Annað"] },
        { name: "travelDistance", label: "travelDistance", type: "text", placeholder: "t.d. 100mm, 150mm" },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Electric Bikes (Rafmagnshjól)
      "Rafmagnshjól": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Specialized, Trek, Bosch" },
        { name: "bikeModel", label: "bikeModel", type: "text", placeholder: "Gerð" },
        { name: "bikeType", label: "bikeType", type: "select",
          options: ["City e-bike", "Mountain e-bike", "Road e-bike", "Cargo e-bike", "Folding e-bike", "Annað"] },
        { name: "frameSize", label: "frameSize", type: "select", required: true,
          options: ["XS", "S", "M", "L", "XL", "One size", "Annað"] },
        { name: "motorPower", label: "motorPower", type: "number", unit: "W", placeholder: "t.d. 250, 500" },
        { name: "motorPosition", label: "motorPosition", type: "select",
          options: ["Hub motor - Front", "Hub motor - Rear", "Mid-drive", "Annað"] },
        { name: "batteryCapacity", label: "batteryCapacity", type: "number", unit: "Wh", placeholder: "t.d. 500" },
        { name: "rangeEstimate", label: "rangeEstimate", type: "text", placeholder: "t.d. 50-100 km" },
        { name: "maxSpeed", label: "maxSpeed", type: "number", unit: "km/klst", placeholder: "t.d. 25" },
        { name: "chargerIncluded", label: "chargerIncluded", type: "select",
          options: ["Já", "Nei"] }
      ],
      
      // Kids Bikes (Börn hjól)
      "Börn hjól": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Specialized, Woom" },
        { name: "wheelSize", label: "wheelSize", type: "select", required: true,
          options: ["12\"", "14\"", "16\"", "18\"", "20\"", "24\"", "Annað"] },
        { name: "ageRange", label: "ageRange", type: "select",
          options: ["2-4 ára", "3-5 ára", "4-6 ára", "5-8 ára", "7-11 ára", "9-12 ára", "Annað"] },
        { name: "frameMaterial", label: "frameMaterial", type: "select",
          options: ["Aluminum", "Stál", "Annað"] },
        { name: "trainingWheels", label: "trainingWheels", type: "select",
          options: ["Já - Included", "Nei"] },
        { name: "brakeType", label: "brakeType", type: "select",
          options: ["Coaster brake", "Hand brakes", "Both", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Accessories (Fylgihlutir)
      "Fylgihlutir": [
        { name: "accessoryType", label: "accessoryType", type: "select", required: true,
          options: ["Hjálmur", "Ljós", "Lock", "Pump", "Water bottle holder", "Saddle bag", "Bike computer", "Pedals", "Hjólastæði", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "size", label: "size", type: "text", placeholder: "Stærð (ef á við)" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text" }
      ]
    },
    
    // Outdoor Clothing (Útivistarfatnaður)
    "Útivistarfatnaður": {
      // Hiking Clothing (Göngufatnaður)
      "Göngufatnaður": [
        { name: "clothingType", label: "clothingType", type: "select", required: true,
          options: ["Gönguskyrta", "Göngubuxur", "Göngujakki", "Fleece", "Vindjakki", "Regnskúr", "Base layer", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. The North Face, Patagonia, Arc'teryx" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "Annað"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Karl", "Kona", "Unisex"] },
        { name: "material", label: "material", type: "select",
          options: ["Gore-Tex", "Softshell", "Fleece", "Merino wool", "Polyester", "Nylon", "Annað"] },
        { name: "waterproof", label: "waterproof", type: "select",
          options: ["Já - Waterproof", "Water resistant", "Nei"] },
        { name: "breathable", label: "breathable", type: "select",
          options: ["Já", "Nei"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Hiking Boots (Gönguskór)
      "Gönguskór": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Salomon, Merrell, La Sportiva" },
        { name: "shoeSize", label: "shoeSize", type: "select", required: true,
          options: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "Annað"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Karl", "Kona", "Unisex"] },
        { name: "bootType", label: "bootType", type: "select",
          options: ["Low cut (hiking shoes)", "Mid cut", "High cut (boots)", "Approach shoes", "Annað"] },
        { name: "waterproof", label: "waterproof", type: "select",
          options: ["Já - Gore-Tex", "Já - Other waterproof", "Nei"] },
        { name: "support", label: "support", type: "select",
          options: ["Light hiking", "Day hiking", "Backpacking", "Mountaineering", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Backpacks (Bakpokar)
      "Bakpokar": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Osprey, Deuter, Gregory" },
        { name: "capacity", label: "capacity", type: "select", required: true,
          options: ["0-20L (Dagsferð)", "20-35L (Dagstúr)", "35-50L (Helgarferð)", "50-70L (Viku+)", "70L+ (Langferð)", "Annað"] },
        { name: "backpackType", label: "backpackType", type: "select",
          options: ["Dagspoki", "Hiking backpack", "Travel backpack", "Mountaineering pack", "Hydration pack", "Annað"] },
        { name: "frameType", label: "frameType", type: "select",
          options: ["Internal frame", "External frame", "Frameless", "Annað"] },
        { name: "hipBeltSize", label: "hipBeltSize", type: "text", placeholder: "t.d. S/M, L/XL" },
        { name: "rainCoverIncluded", label: "rainCoverIncluded", type: "select",
          options: ["Já", "Nei"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Tents (Tjöld)
      "Tjöld": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. MSR, Big Agnes, Hilleberg" },
        { name: "capacity", label: "capacity", type: "select", required: true,
          options: ["1 person", "2 persons", "3 persons", "4 persons", "5+ persons", "Annað"] },
        { name: "tentType", label: "tentType", type: "select",
          options: ["Backpacking tent", "Car camping tent", "4-season tent", "3-season tent", "Ultralight tent", "Annað"] },
        { name: "weight", label: "weight", type: "number", unit: "kg", placeholder: "t.d. 2.5" },
        { name: "floorArea", label: "floorArea", type: "text", placeholder: "t.d. 2.5 m²" },
        { name: "peakHeight", label: "peakHeight", type: "number", unit: "cm", placeholder: "t.d. 120" },
        { name: "seasonRating", label: "seasonRating", type: "select",
          options: ["1-2 season", "3-season", "4-season", "Annað"] },
        { name: "freeststanding", label: "freeststanding", type: "select",
          options: ["Já", "Nei"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Sleeping Bags (Svefnpokar)
      "Svefnpokar": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Marmot, The North Face, Western Mountaineering" },
        { name: "temperatureRating", label: "temperatureRating", type: "text", required: true, placeholder: "t.d. -10°C, 0°C, +5°C" },
        { name: "insulationType", label: "insulationType", type: "select",
          options: ["Down (dúnn)", "Synthetic", "Hybrid", "Annað"] },
        { name: "shape", label: "shape", type: "select",
          options: ["Mummy", "Semi-rectangular", "Rectangular", "Annað"] },
        { name: "weight", label: "weight", type: "number", unit: "kg", placeholder: "t.d. 1.2" },
        { name: "packSize", label: "packSize", type: "text", placeholder: "t.d. 20x30 cm" },
        { name: "zipperSide", label: "zipperSide", type: "select",
          options: ["Left", "Right", "Center", "Double", "Annað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text" }
      ]
    },
    
    // Sportswear (Íþróttafatnaður)
    "Íþróttafatnaður": {
      // Running Clothing (Hlaupafatnaður)
      "Hlaupafatnaður": [
        { name: "clothingType", label: "clothingType", type: "select", required: true,
          options: ["Hlaupaskyrta", "Hlaupabuxur", "Tights", "Shorts", "Hlaupapeysa", "Vest", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Nike, Adidas, Under Armour" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "Annað"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Karl", "Kona", "Unisex"] },
        { name: "material", label: "material", type: "select",
          options: ["Polyester", "Nylon", "Spandex", "Dri-FIT", "Climacool", "Merino wool", "Annað"] },
        { name: "reflectiveDetails", label: "reflectiveDetails", type: "select",
          options: ["Já", "Nei"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Sports Shoes (Íþróttaskór)
      "Íþróttaskór": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Nike, Adidas, Asics, New Balance" },
        { name: "shoeSize", label: "shoeSize", type: "select", required: true,
          options: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "Annað"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Karl", "Kona", "Unisex"] },
        { name: "sportType", label: "sportType", type: "select",
          options: ["Hlaup", "Training", "Körfubolti", "Fótbolti", "Tennis", "Crossfit", "Skateboard", "Annað"] },
        { name: "terrainType", label: "terrainType", type: "select",
          options: ["Road running", "Trail running", "Indoor", "All-terrain", "Annað"] },
        { name: "cushioning", label: "cushioning", type: "select",
          options: ["Minimal", "Moderate", "Maximum", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Training Clothing (Æfingarfatnaður)
      "Æfingarfatnaður": [
        { name: "clothingType", label: "clothingType", type: "select", required: true,
          options: ["T-bolur", "Tank top", "Æfingabuxur", "Leggings", "Hettupeysa", "Zip-up jacket", "Sports bra", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Nike, Gymshark, Lululemon" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "Annað"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Karl", "Kona", "Unisex"] },
        { name: "material", label: "material", type: "select",
          options: ["Polyester", "Spandex", "Nylon", "Bómull blend", "Compression fabric", "Annað"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Swimwear (Sundföt)
      "Sundföt": [
        { name: "swimwearType", label: "swimwearType", type: "select", required: true,
          options: ["Sundbolur - Kona", "Bikini", "Sundbuxur - Karl", "Wetsuit", "Swim trunks", "Rash guard", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Speedo, Arena, TYR" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "Annað"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Karl", "Kona", "Unisex"] },
        { name: "material", label: "material", type: "select",
          options: ["Polyester", "Nylon", "Spandex", "Lycra", "Neoprene", "Annað"] },
        { name: "uvProtection", label: "uvProtection", type: "select",
          options: ["Já - UPF 50+", "Já - UPF 30+", "Nei"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "clothingType", label: "clothingType", type: "text", placeholder: "Tegund fatnaðar" },
        { name: "brand", label: "brand", type: "text" },
        { name: "size", label: "size", type: "text" }
      ]
    },
    
    // Skiing (Gönguskíði)
    "Gönguskíði": {
      // Alpine Skis (Alförin skíði)
      "Alförin skíði": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Rossignol, Atomic, Salomon" },
        { name: "skiLength", label: "skiLength", type: "number", unit: "cm", required: true, placeholder: "t.d. 170" },
        { name: "skiType", label: "skiType", type: "select",
          options: ["All-mountain", "Carving", "Freestyle", "Freeride", "Racing", "Powder", "Annað"] },
        { name: "abilityLevel", label: "abilityLevel", type: "select",
          options: ["Beginner", "Intermediate", "Advanced", "Expert", "Annað"] },
        { name: "waistWidth", label: "waistWidth", type: "number", unit: "mm", placeholder: "t.d. 85" },
        { name: "bindingsIncluded", label: "bindingsIncluded", type: "select",
          options: ["Já", "Nei"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Karl", "Kona", "Unisex"] }
      ],
      
      // Snowboards (Borðskíði)
      "Borðskíði": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Burton, Lib Tech, Capita" },
        { name: "boardLength", label: "boardLength", type: "number", unit: "cm", required: true, placeholder: "t.d. 155" },
        { name: "boardType", label: "boardType", type: "select",
          options: ["All-mountain", "Freestyle", "Freeride", "Powder", "Split board", "Annað"] },
        { name: "shape", label: "shape", type: "select",
          options: ["Directional", "Twin", "Directional twin", "Annað"] },
        { name: "flex", label: "flex", type: "select",
          options: ["Soft (1-3)", "Medium (4-6)", "Stiff (7-10)", "Annað"] },
        { name: "bindingsIncluded", label: "bindingsIncluded", type: "select",
          options: ["Já", "Nei"] },
        { name: "abilityLevel", label: "abilityLevel", type: "select",
          options: ["Beginner", "Intermediate", "Advanced", "Expert"] }
      ],
      
      // Ski Poles (Skíðastafir)
      "Skíðastafir": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Leki, Black Diamond" },
        { name: "poleLength", label: "poleLength", type: "number", unit: "cm", required: true, placeholder: "t.d. 120" },
        { name: "material", label: "material", type: "select",
          options: ["Aluminum", "Carbon fiber", "Composite", "Annað"] },
        { name: "adjustable", label: "adjustable", type: "select",
          options: ["Já", "Nei"] },
        { name: "poleType", label: "poleType", type: "select",
          options: ["Alpine skiing", "Cross-country", "Backcountry", "Trekking poles", "Annað"] }
      ],
      
      // Helmets (Hjálmar)
      "Hjálmar": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Smith, Giro, POC" },
        { name: "size", label: "size", type: "select", required: true,
          options: ["XS (52-55 cm)", "S (55-56 cm)", "M (56-59 cm)", "L (59-62 cm)", "XL (62+ cm)", "Annað"] },
        { name: "helmetType", label: "helmetType", type: "select",
          options: ["Ski/Snowboard helmet", "Bike helmet", "Climbing helmet", "Multi-sport", "Annað"] },
        { name: "certifications", label: "certifications", type: "text", placeholder: "t.d. CE EN 1077, ASTM" },
        { name: "adjustable", label: "adjustable", type: "select",
          options: ["Já", "Nei"] },
        { name: "color", label: "color", type: "text", placeholder: "Litur" }
      ],
      
      // Goggles (Gleraugu)
      "Gleraugu": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Oakley, Smith, Anon" },
        { name: "goggleType", label: "goggleType", type: "select", required: true,
          options: ["Ski/Snowboard goggles", "Swimming goggles", "Safety goggles", "Annað"] },
        { name: "lensType", label: "lensType", type: "select",
          options: ["Cylindrical", "Spherical", "Toric", "Annað"] },
        { name: "lensTint", label: "lensTint", type: "select",
          options: ["Clear", "Yellow/Gold", "Rose", "Dark/Smoke", "Mirrored", "Photochromic", "Annað"] },
        { name: "extraLensIncluded", label: "extraLensIncluded", type: "select",
          options: ["Já", "Nei"] },
        { name: "otg", label: "otg", type: "select",
          options: ["Já - OTG (Over The Glasses)", "Nei"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text" }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
      { name: "brand", label: "brand", type: "text" }
    ]
  },
  
  // Books, Movies & Music Category
  "Bækur, Kvikmyndir & Tónlist": {
    // Books (Bækur)
    "Bækur": {
      // Fiction (Skáldsögur)
      "Skáldsögur": [
        { name: "bookTitle", label: "bookTitle", type: "text", required: true, placeholder: "Titill bókar" },
        { name: "author", label: "author", type: "text", required: true, placeholder: "t.d. Halldór Laxness" },
        { name: "isbn", label: "isbn", type: "text", placeholder: "ISBN númer" },
        { name: "publisher", label: "publisher", type: "text", placeholder: "Útgefandi" },
        { name: "publicationYear", label: "publicationYear", type: "number", placeholder: "t.d. 2020" },
        { name: "language", label: "language", type: "select", 
          options: ["Íslenska", "Enska", "Danska", "Norska", "Sænska", "Þýska", "Franska", "Spænska", "Annað"] },
        { name: "bookFormat", label: "bookFormat", type: "select", 
          options: ["Innbundin", "Kilja", "E-bók", "Hljóðbók", "Annað"] },
        { name: "bookCondition", label: "bookCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "numberOfPages", label: "numberOfPages", type: "number", placeholder: "Fjöldi síðna" },
        { name: "bookGenre", label: "bookGenre", type: "select",
          options: ["Glæpasaga", "Rómantík", "Spenna", "Sci-Fi", "Fantasía", "Sögulegt", "Annað"] }
      ],
      
      // Children's Books (Barnabækur)
      "Barnabækur": [
        { name: "bookTitle", label: "bookTitle", type: "text", required: true, placeholder: "Titill bókar" },
        { name: "author", label: "author", type: "text", placeholder: "Höfundur" },
        { name: "isbn", label: "isbn", type: "text", placeholder: "ISBN númer" },
        { name: "publisher", label: "publisher", type: "text", placeholder: "Útgefandi" },
        { name: "publicationYear", label: "publicationYear", type: "number" },
        { name: "language", label: "language", type: "select", 
          options: ["Íslenska", "Enska", "Danska", "Norska", "Sænska", "Annað"] },
        { name: "bookFormat", label: "bookFormat", type: "select", 
          options: ["Innbundin", "Kilja", "E-bók", "Hljóðbók", "Myndskreytt", "Annað"] },
        { name: "ageRange", label: "ageRange", type: "select",
          options: ["0-2 ára", "3-5 ára", "6-8 ára", "9-12 ára", "13+ ára"] },
        { name: "bookCondition", label: "bookCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "illustratedBook", label: "illustratedBook", type: "boolean" }
      ],
      
      // Textbooks (Námsbækur)
      "Námsbækur": [
        { name: "bookTitle", label: "bookTitle", type: "text", required: true, placeholder: "Titill bókar" },
        { name: "author", label: "author", type: "text", placeholder: "Höfundur" },
        { name: "isbn", label: "isbn", type: "text", placeholder: "ISBN númer" },
        { name: "publisher", label: "publisher", type: "text", placeholder: "Útgefandi" },
        { name: "publicationYear", label: "publicationYear", type: "number" },
        { name: "edition", label: "edition", type: "text", placeholder: "t.d. 3. útgáfa" },
        { name: "subject", label: "subject", type: "select",
          options: ["Stærðfræði", "Eðlisfræði", "Efnafræði", "Líffræði", "Saga", "Enska", "Íslenska", "Viðskipti", "Tölvunarfræði", "Annað"] },
        { name: "educationLevel", label: "educationLevel", type: "select",
          options: ["Grunnskóli", "Framhaldsskóli", "Háskóli - Grunnám", "Háskóli - Framhald", "Annað"] },
        { name: "bookCondition", label: "bookCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "language", label: "language", type: "select", 
          options: ["Íslenska", "Enska", "Danska", "Norska", "Sænska", "Annað"] },
        { name: "highlightedOrMarked", label: "highlightedOrMarked", type: "boolean" }
      ],
      
      // Biographies (Ævisögur)
      "Ævisögur": [
        { name: "bookTitle", label: "bookTitle", type: "text", required: true, placeholder: "Titill bókar" },
        { name: "author", label: "author", type: "text", required: true },
        { name: "subjectPerson", label: "subjectPerson", type: "text", placeholder: "Viðfangsefni ævisögu" },
        { name: "isbn", label: "isbn", type: "text", placeholder: "ISBN númer" },
        { name: "publisher", label: "publisher", type: "text", placeholder: "Útgefandi" },
        { name: "publicationYear", label: "publicationYear", type: "number" },
        { name: "language", label: "language", type: "select", 
          options: ["Íslenska", "Enska", "Danska", "Norska", "Sænska", "Annað"] },
        { name: "bookFormat", label: "bookFormat", type: "select", 
          options: ["Innbundin", "Kilja", "E-bók", "Hljóðbók", "Annað"] },
        { name: "bookCondition", label: "bookCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] }
      ],
      
      // Cookbooks (Matreiðslubækur)
      "Matreiðslubækur": [
        { name: "bookTitle", label: "bookTitle", type: "text", required: true, placeholder: "Titill bókar" },
        { name: "author", label: "author", type: "text", placeholder: "Höfundur/Kokkur" },
        { name: "isbn", label: "isbn", type: "text", placeholder: "ISBN númer" },
        { name: "publisher", label: "publisher", type: "text", placeholder: "Útgefandi" },
        { name: "publicationYear", label: "publicationYear", type: "number" },
        { name: "cuisineType", label: "cuisineType", type: "select",
          options: ["Alþjóðleg", "Íslensk", "Ítölsk", "Asísk", "Mexíkósk", "VeganMatargerð", "GlúteinlausMatargerð", "Annað"] },
        { name: "language", label: "language", type: "select", 
          options: ["Íslenska", "Enska", "Danska", "Norska", "Sænska", "Annað"] },
        { name: "bookCondition", label: "bookCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "bookFormat", label: "bookFormat", type: "select", 
          options: ["Innbundin", "Kilja", "E-bók", "Annað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "bookTitle", label: "bookTitle", type: "text", required: true, placeholder: "Titill bókar" },
        { name: "author", label: "author", type: "text", placeholder: "Höfundur" },
        { name: "bookCondition", label: "bookCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "language", label: "language", type: "select", 
          options: ["Íslenska", "Enska", "Danska", "Norska", "Sænska", "Annað"] }
      ]
    },
    
    // CDs/DVDs (Geisladiskar)
    "Geisladiskar": {
      // Movies - DVD (Kvikmyndir - DVD)
      "Kvikmyndir - DVD": [
        { name: "movieTitle", label: "movieTitle", type: "text", required: true, placeholder: "Titill kvikmyndar" },
        { name: "director", label: "director", type: "text", placeholder: "Leikstjóri" },
        { name: "releaseYear", label: "releaseYear", type: "number", placeholder: "t.d. 2020" },
        { name: "movieGenre", label: "movieGenre", type: "multiselect",
          options: ["Dramatík", "Gamanmynd", "Þrillari", "Hryllingur", "Rómantík", "Ævintýri", "Sci-Fi", "Fantasía", "Heimildarmynd", "Annað"] },
        { name: "ageRating", label: "ageRating", type: "select",
          options: ["Leyfð öllum", "7 ára", "12 ára", "16 ára", "18 ára"] },
        { name: "audioLanguage", label: "audioLanguage", type: "multiselect",
          options: ["Íslenska", "Enska", "Danska", "Norska", "Sænska", "Annað"] },
        { name: "subtitles", label: "subtitles", type: "multiselect",
          options: ["Íslenskar", "Enskar", "Danskar", "Norskar", "Sænskar", "Engar", "Annað"] },
        { name: "discCondition", label: "discCondition", type: "select", required: true,
          options: ["Nýr", "Eins og nýr", "Gott ástand", "Sæmilegt ástand", "Rispuð"] },
        { name: "caseIncluded", label: "caseIncluded", type: "boolean" }
      ],
      
      // Movies - Blu-ray (Kvikmyndir - Blu-ray)
      "Kvikmyndir - Blu-ray": [
        { name: "movieTitle", label: "movieTitle", type: "text", required: true, placeholder: "Titill kvikmyndar" },
        { name: "director", label: "director", type: "text", placeholder: "Leikstjóri" },
        { name: "releaseYear", label: "releaseYear", type: "number" },
        { name: "movieGenre", label: "movieGenre", type: "multiselect",
          options: ["Dramatík", "Gamanmynd", "Þrillari", "Hryllingur", "Rómantík", "Ævintýri", "Sci-Fi", "Fantasía", "Heimildarmynd", "Annað"] },
        { name: "ageRating", label: "ageRating", type: "select",
          options: ["Leyfð öllum", "7 ára", "12 ára", "16 ára", "18 ára"] },
        { name: "videoQuality", label: "videoQuality", type: "select",
          options: ["1080p", "4K UHD", "3D", "Annað"] },
        { name: "audioLanguage", label: "audioLanguage", type: "multiselect",
          options: ["Íslenska", "Enska", "Danska", "Norska", "Sænska", "Annað"] },
        { name: "subtitles", label: "subtitles", type: "multiselect",
          options: ["Íslenskar", "Enskar", "Danskar", "Norskar", "Sænskar", "Engar", "Annað"] },
        { name: "discCondition", label: "discCondition", type: "select", required: true,
          options: ["Nýr", "Eins og nýr", "Gott ástand", "Sæmilegt ástand", "Rispuð"] },
        { name: "caseIncluded", label: "caseIncluded", type: "boolean" }
      ],
      
      // Music - CD (Tónlist - CD)
      "Tónlist - CD": [
        { name: "albumTitle", label: "albumTitle", type: "text", required: true, placeholder: "Titill plötu" },
        { name: "artist", label: "artist", type: "text", required: true, placeholder: "Flytjandi" },
        { name: "releaseYear", label: "releaseYear", type: "number" },
        { name: "musicGenre", label: "musicGenre", type: "select",
          options: ["Rokk", "Popp", "Jazz", "Klassík", "Rap/Hip-Hop", "Rafmagn", "Kantri", "Blues", "Folk", "Annað"] },
        { name: "recordLabel", label: "recordLabel", type: "text", placeholder: "Plötufyrirtæki" },
        { name: "numberOfTracks", label: "numberOfTracks", type: "number", placeholder: "Fjöldi laga" },
        { name: "discCondition", label: "discCondition", type: "select", required: true,
          options: ["Nýr", "Eins og nýr", "Gott ástand", "Sæmilegt ástand", "Rispuð"] },
        { name: "caseIncluded", label: "caseIncluded", type: "boolean" },
        { name: "bookletIncluded", label: "bookletIncluded", type: "boolean" }
      ],
      
      // Games (Leikir)
      "Leikir": [
        { name: "gameTitle", label: "gameTitle", type: "text", required: true, placeholder: "Heiti leiks" },
        { name: "platform", label: "platform", type: "select", required: true,
          options: ["PlayStation 5", "PlayStation 4", "PlayStation 3", "Xbox Series X/S", "Xbox One", "Xbox 360", "Nintendo Switch", "PC", "Annað"] },
        { name: "releaseYear", label: "releaseYear", type: "number" },
        { name: "gameGenre", label: "gameGenre", type: "select",
          options: ["Action", "Adventure", "RPG", "Sports", "Racing", "Shooter", "Strategy", "Puzzle", "Annað"] },
        { name: "ageRating", label: "ageRating", type: "select",
          options: ["PEGI 3", "PEGI 7", "PEGI 12", "PEGI 16", "PEGI 18"] },
        { name: "discCondition", label: "discCondition", type: "select", required: true,
          options: ["Nýr", "Eins og nýr", "Gott ástand", "Sæmilegt ástand", "Rispuð"] },
        { name: "caseIncluded", label: "caseIncluded", type: "boolean" },
        { name: "manualIncluded", label: "manualIncluded", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "title", label: "title", type: "text", required: true, placeholder: "Titill" },
        { name: "discCondition", label: "discCondition", type: "select", required: true,
          options: ["Nýr", "Eins og nýr", "Gott ástand", "Sæmilegt ástand", "Rispuð"] }
      ]
    },
    
    // Vinyl Records (Vínylplötur)
    "Vínylplötur": {
      // Rock (Rokk)
      "Rokk": [
        { name: "albumTitle", label: "albumTitle", type: "text", required: true, placeholder: "Titill plötu" },
        { name: "artist", label: "artist", type: "text", required: true, placeholder: "Flytjandi" },
        { name: "releaseYear", label: "releaseYear", type: "number" },
        { name: "recordLabel", label: "recordLabel", type: "text", placeholder: "Plötufyrirtæki" },
        { name: "vinylSize", label: "vinylSize", type: "select",
          options: ["7 tommur", "10 tommur", "12 tommur"] },
        { name: "rpm", label: "rpm", type: "select",
          options: ["33 RPM", "45 RPM", "78 RPM"] },
        { name: "vinylCondition", label: "vinylCondition", type: "select", required: true,
          options: ["Mint (M)", "Near Mint (NM)", "Excellent (E)", "Very Good (VG)", "Good (G)", "Fair (F)", "Poor (P)"] },
        { name: "sleeveCondition", label: "sleeveCondition", type: "select",
          options: ["Mint (M)", "Near Mint (NM)", "Excellent (E)", "Very Good (VG)", "Good (G)", "Fair (F)", "Poor (P)"] },
        { name: "originalPressing", label: "originalPressing", type: "boolean" },
        { name: "coloredVinyl", label: "coloredVinyl", type: "boolean" }
      ],
      
      // Pop (Popp)
      "Popp": [
        { name: "albumTitle", label: "albumTitle", type: "text", required: true, placeholder: "Titill plötu" },
        { name: "artist", label: "artist", type: "text", required: true, placeholder: "Flytjandi" },
        { name: "releaseYear", label: "releaseYear", type: "number" },
        { name: "recordLabel", label: "recordLabel", type: "text", placeholder: "Plötufyrirtæki" },
        { name: "vinylSize", label: "vinylSize", type: "select",
          options: ["7 tommur", "10 tommur", "12 tommur"] },
        { name: "rpm", label: "rpm", type: "select",
          options: ["33 RPM", "45 RPM", "78 RPM"] },
        { name: "vinylCondition", label: "vinylCondition", type: "select", required: true,
          options: ["Mint (M)", "Near Mint (NM)", "Excellent (E)", "Very Good (VG)", "Good (G)", "Fair (F)", "Poor (P)"] },
        { name: "sleeveCondition", label: "sleeveCondition", type: "select",
          options: ["Mint (M)", "Near Mint (NM)", "Excellent (E)", "Very Good (VG)", "Good (G)", "Fair (F)", "Poor (P)"] },
        { name: "originalPressing", label: "originalPressing", type: "boolean" },
        { name: "coloredVinyl", label: "coloredVinyl", type: "boolean" }
      ],
      
      // Jazz (Jazz)
      "Jazz": [
        { name: "albumTitle", label: "albumTitle", type: "text", required: true, placeholder: "Titill plötu" },
        { name: "artist", label: "artist", type: "text", required: true, placeholder: "Flytjandi" },
        { name: "releaseYear", label: "releaseYear", type: "number" },
        { name: "recordLabel", label: "recordLabel", type: "text", placeholder: "Plötufyrirtæki" },
        { name: "vinylSize", label: "vinylSize", type: "select",
          options: ["7 tommur", "10 tommur", "12 tommur"] },
        { name: "rpm", label: "rpm", type: "select",
          options: ["33 RPM", "45 RPM", "78 RPM"] },
        { name: "vinylCondition", label: "vinylCondition", type: "select", required: true,
          options: ["Mint (M)", "Near Mint (NM)", "Excellent (E)", "Very Good (VG)", "Good (G)", "Fair (F)", "Poor (P)"] },
        { name: "sleeveCondition", label: "sleeveCondition", type: "select",
          options: ["Mint (M)", "Near Mint (NM)", "Excellent (E)", "Very Good (VG)", "Good (G)", "Fair (F)", "Poor (P)"] },
        { name: "originalPressing", label: "originalPressing", type: "boolean" },
        { name: "coloredVinyl", label: "coloredVinyl", type: "boolean" }
      ],
      
      // Classical (Klassík)
      "Klassík": [
        { name: "albumTitle", label: "albumTitle", type: "text", required: true, placeholder: "Titill plötu" },
        { name: "composer", label: "composer", type: "text", placeholder: "Tónskáld" },
        { name: "performer", label: "performer", type: "text", placeholder: "Flytjandi/Hljómsveit" },
        { name: "releaseYear", label: "releaseYear", type: "number" },
        { name: "recordLabel", label: "recordLabel", type: "text", placeholder: "Plötufyrirtæki" },
        { name: "vinylSize", label: "vinylSize", type: "select",
          options: ["7 tommur", "10 tommur", "12 tommur"] },
        { name: "rpm", label: "rpm", type: "select",
          options: ["33 RPM", "45 RPM", "78 RPM"] },
        { name: "vinylCondition", label: "vinylCondition", type: "select", required: true,
          options: ["Mint (M)", "Near Mint (NM)", "Excellent (E)", "Very Good (VG)", "Good (G)", "Fair (F)", "Poor (P)"] },
        { name: "sleeveCondition", label: "sleeveCondition", type: "select",
          options: ["Mint (M)", "Near Mint (NM)", "Excellent (E)", "Very Good (VG)", "Good (G)", "Fair (F)", "Poor (P)"] },
        { name: "originalPressing", label: "originalPressing", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "albumTitle", label: "albumTitle", type: "text", required: true, placeholder: "Titill plötu" },
        { name: "artist", label: "artist", type: "text", required: true, placeholder: "Flytjandi" },
        { name: "vinylCondition", label: "vinylCondition", type: "select", required: true,
          options: ["Mint (M)", "Near Mint (NM)", "Excellent (E)", "Very Good (VG)", "Good (G)", "Fair (F)", "Poor (P)"] }
      ]
    },
    
    // Musical Instruments (Hljóðfæri)
    "Hljóðfæri": {
      // Guitars (Gítarar)
      "Gítarar": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Fender, Gibson" },
        { name: "instrumentModel", label: "instrumentModel", type: "text", placeholder: "Gerð" },
        { name: "guitarType", label: "guitarType", type: "select", required: true,
          options: ["Rafmagns gítar", "Akustísk gítar", "Klassísk gítar", "Bassi", "Ukulele", "Annað"] },
        { name: "numberOfStrings", label: "numberOfStrings", type: "select",
          options: ["4 strengir", "6 strengir", "7 strengir", "8 strengir", "12 strengir", "Annað"] },
        { name: "bodyMaterial", label: "bodyMaterial", type: "text", placeholder: "t.d. Mahogany, Maple" },
        { name: "instrumentCondition", label: "instrumentCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Þarfnast viðgerðar"] },
        { name: "caseIncluded", label: "caseIncluded", type: "boolean" },
        { name: "yearMade", label: "yearMade", type: "number", placeholder: "Árgerð" }
      ],
      
      // Piano & Keyboards (Píanó og hljómborð)
      "Píanó og hljómborð": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Yamaha, Casio" },
        { name: "instrumentModel", label: "instrumentModel", type: "text", placeholder: "Gerð" },
        { name: "keyboardType", label: "keyboardType", type: "select", required: true,
          options: ["Akustískt píanó", "Rafmagns píanó", "Hljómborð", "Synthesizer", "MIDI Controller", "Annað"] },
        { name: "numberOfKeys", label: "numberOfKeys", type: "select",
          options: ["25 hnappar", "49 hnappar", "61 hnappar", "76 hnappar", "88 hnappar", "Annað"] },
        { name: "weightedKeys", label: "weightedKeys", type: "boolean" },
        { name: "instrumentCondition", label: "instrumentCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Þarfnast viðgerðar"] },
        { name: "standIncluded", label: "standIncluded", type: "boolean" },
        { name: "pedalIncluded", label: "pedalIncluded", type: "boolean" }
      ],
      
      // Drums (Trommur)
      "Trommur": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Pearl, Tama" },
        { name: "instrumentModel", label: "instrumentModel", type: "text", placeholder: "Gerð" },
        { name: "drumType", label: "drumType", type: "select", required: true,
          options: ["Akustískt trommuhljóðfæri", "Rafmagns trommuhljóðfæri", "Einstök tromma", "Cymbals", "Annað"] },
        { name: "numberOfPieces", label: "numberOfPieces", type: "text", placeholder: "t.d. 5-piece kit" },
        { name: "instrumentCondition", label: "instrumentCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Þarfnast viðgerðar"] },
        { name: "hardwareIncluded", label: "hardwareIncluded", type: "boolean" },
        { name: "cymbalsIncluded", label: "cymbalsIncluded", type: "boolean" }
      ],
      
      // Strings (Strengir)
      "Strengir": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "instrumentModel", label: "instrumentModel", type: "text", placeholder: "Gerð" },
        { name: "stringInstrumentType", label: "stringInstrumentType", type: "select", required: true,
          options: ["Fiðla", "Víóla", "Selló", "Kontrabass", "Hörpu", "Annað"] },
        { name: "instrumentSize", label: "instrumentSize", type: "select",
          options: ["1/8", "1/4", "1/2", "3/4", "4/4 (Full)", "Annað"] },
        { name: "instrumentCondition", label: "instrumentCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Þarfnast viðgerðar"] },
        { name: "caseIncluded", label: "caseIncluded", type: "boolean" },
        { name: "bowIncluded", label: "bowIncluded", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "instrumentType", label: "instrumentType", type: "text", required: true, placeholder: "Tegund hljóðfæris" },
        { name: "instrumentCondition", label: "instrumentCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Þarfnast viðgerðar"] }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
      { name: "brand", label: "brand", type: "text" }
    ]
  },
  
  // Toys & Baby Category
  "Leikföng & Barnabúnaður": {
    // Toys (Leikföng)
    "Leikföng": {
      // LEGO and Building Blocks (LEGO og byggingarkubbar)
      "LEGO og byggingarkubbar": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. LEGO, Mega Bloks" },
        { name: "setName", label: "setName", type: "text", placeholder: "Nafn settins" },
        { name: "setNumber", label: "setNumber", type: "text", placeholder: "Sett númer" },
        { name: "numberOfPieces", label: "numberOfPieces", type: "number", placeholder: "Fjöldi kubbanna" },
        { name: "ageRange", label: "ageRange", type: "select",
          options: ["0-2 ára", "3-5 ára", "6-8 ára", "9-12 ára", "13+ ára"] },
        { name: "toyCondition", label: "toyCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "completeSet", label: "completeSet", type: "boolean" },
        { name: "instructionsIncluded", label: "instructionsIncluded", type: "boolean" },
        { name: "boxIncluded", label: "boxIncluded", type: "boolean" }
      ],
      
      // Dolls (Dúkkur)
      "Dúkkur": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Barbie, Baby Born" },
        { name: "dollType", label: "dollType", type: "select",
          options: ["Barbie", "Bratz", "Baby dúkkur", "Fashion dúkkur", "Þjóðbúningar", "Annað"] },
        { name: "dollSize", label: "dollSize", type: "text", placeholder: "t.d. 30 cm" },
        { name: "ageRange", label: "ageRange", type: "select",
          options: ["0-2 ára", "3-5 ára", "6-8 ára", "9-12 ára", "13+ ára"] },
        { name: "toyCondition", label: "toyCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "accessoriesIncluded", label: "accessoriesIncluded", type: "boolean" },
        { name: "clothingIncluded", label: "clothingIncluded", type: "boolean" }
      ],
      
      // Video Game Toys (Tölvuleikjaleikföng)
      "Tölvuleikjaleikföng": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Nintendo, PlayStation" },
        { name: "toyType", label: "toyType", type: "select",
          options: ["Figures", "Plushies", "Collectibles", "Amiibo", "Skylanders", "Annað"] },
        { name: "characterName", label: "characterName", type: "text", placeholder: "Nafn persónu" },
        { name: "ageRange", label: "ageRange", type: "select",
          options: ["0-2 ára", "3-5 ára", "6-8 ára", "9-12 ára", "13+ ára"] },
        { name: "toyCondition", label: "toyCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "boxIncluded", label: "boxIncluded", type: "boolean" },
        { name: "nfcChipWorking", label: "nfcChipWorking", type: "boolean" }
      ],
      
      // Cars and Vehicles (Bílar og vélar)
      "Bílar og vélar": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Hot Wheels, Bruder" },
        { name: "vehicleType", label: "vehicleType", type: "select",
          options: ["Bíll", "Vörubíll", "Traktor", "Hjól", "Flugvél", "Skip", "Annað"] },
        { name: "scale", label: "scale", type: "text", placeholder: "t.d. 1:18, 1:64" },
        { name: "rcVehicle", label: "rcVehicle", type: "boolean" },
        { name: "batteryPowered", label: "batteryPowered", type: "boolean" },
        { name: "ageRange", label: "ageRange", type: "select",
          options: ["0-2 ára", "3-5 ára", "6-8 ára", "9-12 ára", "13+ ára"] },
        { name: "toyCondition", label: "toyCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "remoteIncluded", label: "remoteIncluded", type: "boolean" }
      ],
      
      // Board Games (Spil)
      "Spil": [
        { name: "gameTitle", label: "gameTitle", type: "text", required: true, placeholder: "Nafn spils" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "boardGameType", label: "boardGameType", type: "select",
          options: ["Fjölskylduspil", "Strategy", "Card game", "Púsluspil", "Partíspil", "Annað"] },
        { name: "numberOfPlayers", label: "numberOfPlayers", type: "text", placeholder: "t.d. 2-4 leikmenn" },
        { name: "ageRange", label: "ageRange", type: "select",
          options: ["0-2 ára", "3-5 ára", "6-8 ára", "9-12 ára", "13+ ára"] },
        { name: "playTime", label: "playTime", type: "text", placeholder: "t.d. 30-60 mínútur" },
        { name: "toyCondition", label: "toyCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "completeSet", label: "completeSet", type: "boolean" },
        { name: "instructionsIncluded", label: "instructionsIncluded", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "toyType", label: "toyType", type: "text", required: true, placeholder: "Tegund leikfangs" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "ageRange", label: "ageRange", type: "select",
          options: ["0-2 ára", "3-5 ára", "6-8 ára", "9-12 ára", "13+ ára"] },
        { name: "toyCondition", label: "toyCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] }
      ]
    },
    
    // Strollers (Barnavagnar)
    "Barnavagnar": {
      // Walking Strollers (Göngukerru)
      "Göngukerru": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Bugaboo, Thule" },
        { name: "strollerModel", label: "strollerModel", type: "text", placeholder: "Gerð" },
        { name: "strollerType", label: "strollerType", type: "select",
          options: ["Létt kerru", "Alhliða kerru", "Jogga kerru", "Travel system", "Annað"] },
        { name: "seatingCapacity", label: "seatingCapacity", type: "select",
          options: ["1 barn", "2 börn", "3+ börn"] },
        { name: "foldingMechanism", label: "foldingMechanism", type: "select",
          options: ["Eins handa samanbrot", "Tvíhenda samanbrot", "Ekki samanbrotið", "Annað"] },
        { name: "strollerWeight", label: "strollerWeight", type: "text", unit: "kg", placeholder: "Þyngd" },
        { name: "strollerCondition", label: "strollerCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "carSeatCompatible", label: "carSeatCompatible", type: "boolean" },
        { name: "rainCoverIncluded", label: "rainCoverIncluded", type: "boolean" },
        { name: "carryingBagIncluded", label: "carryingBagIncluded", type: "boolean" }
      ],
      
      // Wagons (Kerrur)
      "Kerrur": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "wagonModel", label: "wagonModel", type: "text", placeholder: "Gerð" },
        { name: "seatingCapacity", label: "seatingCapacity", type: "select",
          options: ["1 barn", "2 börn", "3+ börn"] },
        { name: "maxWeightCapacity", label: "maxWeightCapacity", type: "number", unit: "kg", placeholder: "Hámarksþyngd" },
        { name: "foldingMechanism", label: "foldingMechanism", type: "select",
          options: ["Samanbrotið", "Ekki samanbrotið"] },
        { name: "strollerCondition", label: "strollerCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "canopyIncluded", label: "canopyIncluded", type: "boolean" },
        { name: "seatBeltsIncluded", label: "seatBeltsIncluded", type: "boolean" }
      ],
      
      // Twin Strollers (Tvíburavagnar)
      "Tvíburavagnar": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Baby Jogger, Phil & Teds" },
        { name: "strollerModel", label: "strollerModel", type: "text", placeholder: "Gerð" },
        { name: "twinStrollerType", label: "twinStrollerType", type: "select",
          options: ["Side by side", "Tandem (framar og aftar)", "Annað"] },
        { name: "foldingMechanism", label: "foldingMechanism", type: "select",
          options: ["Eins handa samanbrot", "Tvíhenda samanbrot", "Ekki samanbrotið", "Annað"] },
        { name: "strollerWeight", label: "strollerWeight", type: "text", unit: "kg", placeholder: "Þyngd" },
        { name: "strollerCondition", label: "strollerCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "carSeatCompatible", label: "carSeatCompatible", type: "boolean" },
        { name: "rainCoverIncluded", label: "rainCoverIncluded", type: "boolean" }
      ],
      
      // Accessories (Fylgihlutir)
      "Fylgihlutir": [
        { name: "accessoryType", label: "accessoryType", type: "select", required: true,
          options: ["Rain cover", "Carrying bag", "Cup holder", "Organizer", "Sunshade", "Footmuff", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "compatibleBrands", label: "compatibleBrands", type: "text", placeholder: "Samhæfðir framleiðendur" },
        { name: "itemCondition", label: "itemCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "itemCondition", label: "itemCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] }
      ]
    },
    
    // Baby Seats (Barnastólar)
    "Barnastólar": {
      // High Chairs (Hásæti)
      "Hásæti": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Stokke, Ikea" },
        { name: "chairModel", label: "chairModel", type: "text", placeholder: "Gerð" },
        { name: "adjustableHeight", label: "adjustableHeight", type: "boolean" },
        { name: "recliningBackrest", label: "recliningBackrest", type: "boolean" },
        { name: "removableTray", label: "removableTray", type: "boolean" },
        { name: "foldingChair", label: "foldingChair", type: "boolean" },
        { name: "ageRange", label: "ageRange", type: "select",
          options: ["0-6 mánaða", "6-12 mánaða", "1-2 ára", "2-3 ára", "3+ ára"] },
        { name: "chairCondition", label: "chairCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "cushionIncluded", label: "cushionIncluded", type: "boolean" }
      ],
      
      // Car Seats (Bílstólar)
      "Bílstólar": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Britax, Cybex" },
        { name: "seatModel", label: "seatModel", type: "text", placeholder: "Gerð" },
        { name: "carSeatGroup", label: "carSeatGroup", type: "select", required: true,
          options: ["Hópur 0 (0-10 kg)", "Hópur 0+ (0-13 kg)", "Hópur 1 (9-18 kg)", "Hópur 2 (15-25 kg)", "Hópur 3 (22-36 kg)", "Blandaður hópur", "Annað"] },
        { name: "isofixCompatible", label: "isofixCompatible", type: "boolean" },
        { name: "rearFacing", label: "rearFacing", type: "boolean" },
        { name: "sideImpactProtection", label: "sideImpactProtection", type: "boolean" },
        { name: "expirationDate", label: "expirationDate", type: "text", placeholder: "Gildistími" },
        { name: "chairCondition", label: "chairCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "accidentFree", label: "accidentFree", type: "boolean" },
        { name: "coverIncluded", label: "coverIncluded", type: "boolean" }
      ],
      
      // Booster Seats (Vaggsófar)
      "Vaggsófar": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "seatModel", label: "seatModel", type: "text", placeholder: "Gerð" },
        { name: "boosterType", label: "boosterType", type: "select",
          options: ["Með bakvið", "Án bakvið", "Foldable", "Annað"] },
        { name: "ageRange", label: "ageRange", type: "select",
          options: ["15-25 kg", "22-36 kg", "3-6 ára", "6-12 ára", "Annað"] },
        { name: "isofixCompatible", label: "isofixCompatible", type: "boolean" },
        { name: "chairCondition", label: "chairCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "coverIncluded", label: "coverIncluded", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "chairCondition", label: "chairCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] }
      ]
    },
    
    // Baby Clothing (Barnafatnaður)
    "Barnafatnaður": {
      // Infants (Ungbörn 0-2 ára)
      "Ungbörn (0-2 ára)": [
        { name: "clothingType", label: "clothingType", type: "select", required: true,
          options: ["Guffa", "Body", "Buxur", "Kjóll", "Jakki", "Sokkabuxur", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "babySize", label: "babySize", type: "select", required: true,
          options: ["50 (Nýfæddur)", "56 (1-2 mán)", "62 (2-4 mán)", "68 (4-6 mán)", "74 (6-9 mán)", "80 (9-12 mán)", "86 (12-18 mán)", "92 (18-24 mán)"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Drengur", "Stúlka", "Unisex"] },
        { name: "clothingMaterial", label: "clothingMaterial", type: "text", placeholder: "t.d. Bómull, Ull" },
        { name: "clothingCondition", label: "clothingCondition", type: "select", required: true,
          options: ["Nýtt með merkjum", "Nýtt án merkja", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "organicMaterial", label: "organicMaterial", type: "boolean" }
      ],
      
      // Toddlers (Smábörn 2-5 ára)
      "Smábörn (2-5 ára)": [
        { name: "clothingType", label: "clothingType", type: "select", required: true,
          options: ["Boli", "Buxur", "Kjóll", "Peysa", "Jakki", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "babySize", label: "babySize", type: "select", required: true,
          options: ["92 (2 ára)", "98 (3 ára)", "104 (4 ára)", "110 (5 ára)"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Drengur", "Stúlka", "Unisex"] },
        { name: "clothingMaterial", label: "clothingMaterial", type: "text", placeholder: "t.d. Bómull, Ull" },
        { name: "clothingCondition", label: "clothingCondition", type: "select", required: true,
          options: ["Nýtt með merkjum", "Nýtt án merkja", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] }
      ],
      
      // Children (Börn 6+ ára)
      "Börn (6+ ára)": [
        { name: "clothingType", label: "clothingType", type: "select", required: true,
          options: ["Boli", "Buxur", "Kjóll", "Peysa", "Jakki", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "babySize", label: "babySize", type: "select", required: true,
          options: ["116 (6 ára)", "122 (7 ára)", "128 (8 ára)", "134 (9 ára)", "140 (10 ára)", "146 (11 ára)", "152 (12 ára)", "158 (13 ára)", "164 (14 ára)"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Drengur", "Stúlka", "Unisex"] },
        { name: "clothingMaterial", label: "clothingMaterial", type: "text", placeholder: "t.d. Bómull, Polyester" },
        { name: "clothingCondition", label: "clothingCondition", type: "select", required: true,
          options: ["Nýtt með merkjum", "Nýtt án merkja", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] }
      ],
      
      // Shoes (Skór)
      "Skór": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Nike, Adidas" },
        { name: "shoeType", label: "shoeType", type: "select", required: true,
          options: ["Stígvél", "Sandalar", "Íþróttaskór", "Daglegir skór", "Háskór", "Annað"] },
        { name: "babyShoeSize", label: "babyShoeSize", type: "select", required: true,
          options: ["17-18", "19-20", "21-22", "23-24", "25-26", "27-28", "29-30", "31-32", "33-34", "35-36", "37-38"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Drengur", "Stúlka", "Unisex"] },
        { name: "shoeCondition", label: "shoeCondition", type: "select", required: true,
          options: ["Nýtt með merkjum", "Nýtt án merkja", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] },
        { name: "waterproof", label: "waterproof", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "clothingType", label: "clothingType", type: "text", required: true, placeholder: "Tegund fatnaðar" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "babySize", label: "babySize", type: "text", placeholder: "Stærð" },
        { name: "clothingCondition", label: "clothingCondition", type: "select", required: true,
          options: ["Nýtt með merkjum", "Nýtt án merkja", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Slit"] }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
      { name: "brand", label: "brand", type: "text" }
    ]
  },
  
  // Health & Beauty Category
  "Heilsa & Snyrtivörur": {
    // Cosmetics (Snyrtivörur)
    "Snyrtivörur": {
      // Makeup (Förðun)
      "Förðun": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. MAC, Maybelline" },
        { name: "makeupType", label: "makeupType", type: "select", required: true,
          options: ["Foundation", "Concealer", "Púður", "Rouge", "Augnskuggi", "Maskara", "Varalitir", "Brúnalína", "Highlighter", "Annað"] },
        { name: "shade", label: "shade", type: "text", placeholder: "Litur/tónn" },
        { name: "skinType", label: "skinType", type: "select",
          options: ["Öll húðgerð", "Þurr", "Feit", "Blandað", "Viðkvæm", "Annað"] },
        { name: "finish", label: "finish", type: "select",
          options: ["Matte", "Dewy", "Satin", "Shimmery", "Glossy", "Annað"] },
        { name: "volumeSize", label: "volumeSize", type: "text", placeholder: "t.d. 30ml, 10g" },
        { name: "beautyCondition", label: "beautyCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Hálf notað", "Mestmegnis notað"] },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "crueltyFree", label: "crueltyFree", type: "boolean" },
        { name: "vegan", label: "vegan", type: "boolean" }
      ],
      
      // Nails (Neglur)
      "Neglur": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "nailProductType", label: "nailProductType", type: "select", required: true,
          options: ["Naglaúr", "Gel lakkur", "Neglulím", "Neglubúnaður", "Gervinglur", "Neglaskreytingar", "Annað"] },
        { name: "shade", label: "shade", type: "text", placeholder: "Litur" },
        { name: "volumeSize", label: "volumeSize", type: "text", placeholder: "t.d. 15ml" },
        { name: "beautyCondition", label: "beautyCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Hálf notað", "Mestmegnis notað"] },
        { name: "quickDrying", label: "quickDrying", type: "boolean" },
        { name: "longLasting", label: "longLasting", type: "boolean" }
      ],
      
      // Perfume (Ilmvatn)
      "Ilmvatn": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Chanel, Dior" },
        { name: "perfumeName", label: "perfumeName", type: "text", required: true, placeholder: "Nafn ilmvatns" },
        { name: "perfumeType", label: "perfumeType", type: "select",
          options: ["Eau de Parfum", "Eau de Toilette", "Eau de Cologne", "Parfum", "Body mist", "Annað"] },
        { name: "volumeSize", label: "volumeSize", type: "text", required: true, placeholder: "t.d. 50ml, 100ml" },
        { name: "scentFamily", label: "scentFamily", type: "select",
          options: ["Blómleg", "Ávaxta", "Oriental", "Woody", "Fresh", "Spicy", "Annað"] },
        { name: "gender", label: "gender", type: "select",
          options: ["Konur", "Karlar", "Unisex"] },
        { name: "beautyCondition", label: "beautyCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Hálf notað", "Mestmegnis notað"] },
        { name: "boxIncluded", label: "boxIncluded", type: "boolean" }
      ],
      
      // Tools (Tól)
      "Tól": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "beautyToolType", label: "beautyToolType", type: "select", required: true,
          options: ["Penslar", "Sponge", "Augnklemma", "Pinsettur", "Hárbursti", "Hárblásari", "Hárréttir", "Hárkveipur", "Annað"] },
        { name: "setOrIndividual", label: "setOrIndividual", type: "select",
          options: ["Einstakt tól", "Sett", "Annað"] },
        { name: "beautyCondition", label: "beautyCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Gott ástand", "Sæmilegt ástand"] },
        { name: "cleaningBrushes", label: "cleaningBrushes", type: "text", placeholder: "Hvernig hreinsa á" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "beautyCondition", label: "beautyCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Hálf notað", "Mestmegnis notað"] }
      ]
    },
    
    // Skincare (Húðvörur)
    "Húðvörur": {
      // Face Cream (Andlitskrem)
      "Andlitskrem": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. The Ordinary, CeraVe" },
        { name: "productName", label: "productName", type: "text", placeholder: "Nafn vöru" },
        { name: "skincareType", label: "skincareType", type: "select", required: true,
          options: ["Dagkrem", "Næturkrem", "Andlitsolía", "Serum", "Augakrem", "Fuktari", "Annað"] },
        { name: "skinType", label: "skinType", type: "select",
          options: ["Öll húðgerð", "Þurr", "Feit", "Blandað", "Viðkvæm", "Þroskaðri húð", "Unglingshúð", "Annað"] },
        { name: "keyIngredients", label: "keyIngredients", type: "text", placeholder: "t.d. Retinol, Vitamin C" },
        { name: "concerns", label: "concerns", type: "multiselect",
          options: ["Öldrun", "Þurrk", "Bólur", "Pigment", "Fínar línur", "Stór svitakirtlar", "Viðkvæm húð", "Annað"] },
        { name: "volumeSize", label: "volumeSize", type: "text", required: true, placeholder: "t.d. 50ml" },
        { name: "spfProtection", label: "spfProtection", type: "text", placeholder: "SPF gildi" },
        { name: "beautyCondition", label: "beautyCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Hálf notað", "Mestmegnis notað"] },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "crueltyFree", label: "crueltyFree", type: "boolean" },
        { name: "vegan", label: "vegan", type: "boolean" },
        { name: "fraganceFree", label: "fraganceFree", type: "boolean" }
      ],
      
      // Cleansers (Húðhreinsivörur)
      "Húðhreinsivörur": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "productName", label: "productName", type: "text", placeholder: "Nafn vöru" },
        { name: "cleanserType", label: "cleanserType", type: "select", required: true,
          options: ["Andlitssápa", "Gel hreinsi", "Olíuhreinsi", "Mjólkurhreinsi", "Micellar water", "Exfoliating scrub", "Tóner", "Annað"] },
        { name: "skinType", label: "skinType", type: "select",
          options: ["Öll húðgerð", "Þurr", "Feit", "Blandað", "Viðkvæm", "Annað"] },
        { name: "volumeSize", label: "volumeSize", type: "text", required: true, placeholder: "t.d. 200ml" },
        { name: "beautyCondition", label: "beautyCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Hálf notað", "Mestmegnis notað"] },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "crueltyFree", label: "crueltyFree", type: "boolean" },
        { name: "vegan", label: "vegan", type: "boolean" },
        { name: "fraganceFree", label: "fraganceFree", type: "boolean" }
      ],
      
      // Sun Protection (Sólarvörn)
      "Sólarvörn": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "productName", label: "productName", type: "text", placeholder: "Nafn vöru" },
        { name: "spfProtection", label: "spfProtection", type: "select", required: true,
          options: ["SPF 15", "SPF 20", "SPF 30", "SPF 50", "SPF 50+", "Annað"] },
        { name: "sunscreenType", label: "sunscreenType", type: "select",
          options: ["Krem", "Spray", "Stick", "Gel", "Olía", "Annað"] },
        { name: "skinType", label: "skinType", type: "select",
          options: ["Öll húðgerð", "Þurr", "Feit", "Blandað", "Viðkvæm", "Barnshúð", "Annað"] },
        { name: "volumeSize", label: "volumeSize", type: "text", required: true, placeholder: "t.d. 100ml" },
        { name: "waterResistant", label: "waterResistant", type: "boolean" },
        { name: "beautyCondition", label: "beautyCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Hálf notað", "Mestmegnis notað"] },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "crueltyFree", label: "crueltyFree", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "beautyCondition", label: "beautyCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Hálf notað", "Mestmegnis notað"] }
      ]
    },
    
    // Health Products (Heilsuvörur)
    "Heilsuvörur": {
      // Vitamins (Vítamín)
      "Vítamín": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "productName", label: "productName", type: "text", required: true, placeholder: "Nafn vöru" },
        { name: "vitaminType", label: "vitaminType", type: "select", required: true,
          options: ["Fjölvítamín", "Vítamín C", "Vítamín D", "Vítamín B", "Omega-3", "Probiotic", "Magnesíum", "Járn", "Kalsíum", "Annað"] },
        { name: "formType", label: "formType", type: "select",
          options: ["Töflur", "Hylki", "Gúmmí", "Púður", "Vökvi", "Annað"] },
        { name: "quantity", label: "quantity", type: "text", placeholder: "t.d. 60 töflur" },
        { name: "dosage", label: "dosage", type: "text", placeholder: "Skammtur" },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "healthCondition", label: "healthCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Opnað", "Annað"] },
        { name: "glutenFree", label: "glutenFree", type: "boolean" },
        { name: "vegan", label: "vegan", type: "boolean" },
        { name: "organic", label: "organic", type: "boolean" }
      ],
      
      // Supplements (Næringarefni)
      "Næringarefni": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "productName", label: "productName", type: "text", required: true, placeholder: "Nafn vöru" },
        { name: "supplementType", label: "supplementType", type: "select", required: true,
          options: ["Prótein", "Kreatin", "BCAA", "Pre-workout", "Post-workout", "Þyngdaraukning", "Þyngdartap", "Collagen", "Annað"] },
        { name: "formType", label: "formType", type: "select",
          options: ["Púður", "Töflur", "Hylki", "Vökvi", "Barrar", "Annað"] },
        { name: "flavor", label: "flavor", type: "text", placeholder: "Bragð" },
        { name: "quantity", label: "quantity", type: "text", placeholder: "t.d. 1kg, 60 skammtar" },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "healthCondition", label: "healthCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Opnað", "Annað"] },
        { name: "glutenFree", label: "glutenFree", type: "boolean" },
        { name: "vegan", label: "vegan", type: "boolean" }
      ],
      
      // First Aid (Fyrstu hjálp)
      "Fyrstu hjálp": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "productName", label: "productName", type: "text", required: true, placeholder: "Nafn vöru" },
        { name: "firstAidType", label: "firstAidType", type: "select", required: true,
          options: ["Fyrstu hjálp tösku", "Bindingarefni", "Sárakrem", "Sýklalyfjakrem", "Hitamælir", "Blóðþrýstingsmælir", "Pulsóxímeter", "Annað"] },
        { name: "quantity", label: "quantity", type: "text", placeholder: "Fjöldi/stærð" },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "healthCondition", label: "healthCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Gott ástand"] },
        { name: "sterilized", label: "sterilized", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "healthCondition", label: "healthCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Opnað", "Annað"] }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
      { name: "brand", label: "brand", type: "text" }
    ]
  },
  
  // Collectibles & Art Category
  "Safngripir & List": {
    // Artwork (Listaverk)
    "Listaverk": {
      // Paintings (Málverk)
      "Málverk": [
        { name: "artTitle", label: "artTitle", type: "text", required: true, placeholder: "Titill listaverks" },
        { name: "artist", label: "artist", type: "text", required: true, placeholder: "Nafn listamanns" },
        { name: "yearCreated", label: "yearCreated", type: "number", placeholder: "Ártal" },
        { name: "artMedium", label: "artMedium", type: "select",
          options: ["Olía á striga", "Akrýl á striga", "Vatnslitir", "Blönduð tækni", "Annað"] },
        { name: "artDimensions", label: "artDimensions", type: "text", required: true, placeholder: "t.d. 50x70 cm" },
        { name: "artStyle", label: "artStyle", type: "select",
          options: ["Abstrakt", "Realismi", "Impressionism", "Samtímalist", "Landslag", "Portrett", "Annað"] },
        { name: "artCondition", label: "artCondition", type: "select", required: true,
          options: ["Frábært", "Mjög gott", "Gott", "Sæmilegt", "Þarfnast viðgerðar"] },
        { name: "framed", label: "framed", type: "boolean" },
        { name: "signed", label: "signed", type: "boolean" },
        { name: "certificateOfAuthenticity", label: "certificateOfAuthenticity", type: "boolean" },
        { name: "limitedEdition", label: "limitedEdition", type: "text", placeholder: "t.d. 5/100" }
      ],
      
      // Prints (Myndir)
      "Myndir": [
        { name: "artTitle", label: "artTitle", type: "text", required: true, placeholder: "Titill myndar" },
        { name: "artist", label: "artist", type: "text", placeholder: "Nafn listamanns" },
        { name: "yearCreated", label: "yearCreated", type: "number", placeholder: "Ártal" },
        { name: "printType", label: "printType", type: "select",
          options: ["Ljósmynd", "Giclée prent", "Litprent", "Silkiprent", "Poster", "Annað"] },
        { name: "artDimensions", label: "artDimensions", type: "text", required: true, placeholder: "t.d. 30x40 cm" },
        { name: "artCondition", label: "artCondition", type: "select", required: true,
          options: ["Frábært", "Mjög gott", "Gott", "Sæmilegt", "Þarfnast viðgerðar"] },
        { name: "framed", label: "framed", type: "boolean" },
        { name: "signed", label: "signed", type: "boolean" },
        { name: "limitedEdition", label: "limitedEdition", type: "text", placeholder: "t.d. 10/500" },
        { name: "certificateOfAuthenticity", label: "certificateOfAuthenticity", type: "boolean" }
      ],
      
      // Sculptures (Skúlptúrar)
      "Skúlptúrar": [
        { name: "artTitle", label: "artTitle", type: "text", required: true, placeholder: "Titill skúlptúrs" },
        { name: "artist", label: "artist", type: "text", required: true, placeholder: "Nafn listamanns" },
        { name: "yearCreated", label: "yearCreated", type: "number", placeholder: "Ártal" },
        { name: "sculptureMaterial", label: "sculptureMaterial", type: "select",
          options: ["Bronz", "Stein", "Tré", "Leir", "Gler", "Málmur", "Plast", "Annað"] },
        { name: "artDimensions", label: "artDimensions", type: "text", required: true, placeholder: "Hæð x breidd x dýpt" },
        { name: "sculptureWeight", label: "sculptureWeight", type: "text", unit: "kg", placeholder: "Þyngd" },
        { name: "artCondition", label: "artCondition", type: "select", required: true,
          options: ["Frábært", "Mjög gott", "Gott", "Sæmilegt", "Þarfnast viðgerðar"] },
        { name: "signed", label: "signed", type: "boolean" },
        { name: "limitedEdition", label: "limitedEdition", type: "text", placeholder: "t.d. 3/25" },
        { name: "certificateOfAuthenticity", label: "certificateOfAuthenticity", type: "boolean" },
        { name: "mountingRequired", label: "mountingRequired", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "artTitle", label: "artTitle", type: "text", required: true, placeholder: "Titill listaverks" },
        { name: "artist", label: "artist", type: "text", placeholder: "Nafn listamanns" },
        { name: "artCondition", label: "artCondition", type: "select", required: true,
          options: ["Frábært", "Mjög gott", "Gott", "Sæmilegt", "Þarfnast viðgerðar"] }
      ]
    },
    
    // Antiques (Fornmunir)
    "Fornmunir": {
      // Furniture (Húsgögn)
      "Húsgögn": [
        { name: "itemName", label: "itemName", type: "text", required: true, placeholder: "Nafn hlutar" },
        { name: "antiqueFurnitureType", label: "antiqueFurnitureType", type: "select", required: true,
          options: ["Stóll", "Borð", "Skápur", "Kommóða", "Rúm", "Spegill", "Annað"] },
        { name: "period", label: "period", type: "select",
          options: ["Barokk", "Rokókó", "Victorian", "Art Deco", "Miðalda", "1800-1900", "1900-1950", "Annað"] },
        { name: "yearCreated", label: "yearCreated", type: "text", placeholder: "Ártal eða áratugar" },
        { name: "material", label: "material", type: "text", placeholder: "t.d. Mahogany, eik" },
        { name: "dimensions", label: "dimensions", type: "text", placeholder: "Stærðir" },
        { name: "antiqueCondition", label: "antiqueCondition", type: "select", required: true,
          options: ["Frábært", "Mjög gott", "Gott", "Sæmilegt", "Þarfnast viðgerðar"] },
        { name: "restored", label: "restored", type: "boolean" },
        { name: "authenticityProof", label: "authenticityProof", type: "boolean" },
        { name: "provenance", label: "provenance", type: "text", placeholder: "Uppruni/saga hlutar" }
      ],
      
      // Jewelry (Skartgripir)
      "Skartgripir": [
        { name: "itemName", label: "itemName", type: "text", required: true, placeholder: "Nafn skartgrips" },
        { name: "antiqueJewelryType", label: "antiqueJewelryType", type: "select", required: true,
          options: ["Hringur", "Hálsmen", "Armbönd", "Eyrnalokkar", "Broskar", "Úr", "Annað"] },
        { name: "period", label: "period", type: "select",
          options: ["Victorian", "Edwardian", "Art Nouveau", "Art Deco", "Retro", "Annað"] },
        { name: "yearCreated", label: "yearCreated", type: "text", placeholder: "Ártal" },
        { name: "metalType", label: "metalType", type: "select",
          options: ["Gull", "Silfur", "Platína", "Brons", "Annað"] },
        { name: "gemstones", label: "gemstones", type: "text", placeholder: "t.d. Demantir, safír" },
        { name: "hallmarks", label: "hallmarks", type: "text", placeholder: "Merki/stimplun" },
        { name: "antiqueCondition", label: "antiqueCondition", type: "select", required: true,
          options: ["Frábært", "Mjög gott", "Gott", "Sæmilegt", "Þarfnast viðgerðar"] },
        { name: "restored", label: "restored", type: "boolean" },
        { name: "authenticityProof", label: "authenticityProof", type: "boolean" },
        { name: "boxIncluded", label: "boxIncluded", type: "boolean" }
      ],
      
      // Coins (Myntir)
      "Myntir": [
        { name: "coinName", label: "coinName", type: "text", required: true, placeholder: "Nafn eða lýsing myntar" },
        { name: "country", label: "country", type: "text", placeholder: "Land" },
        { name: "yearMinted", label: "yearMinted", type: "text", placeholder: "Ártal sláttrar" },
        { name: "denomination", label: "denomination", type: "text", placeholder: "Nafnverð" },
        { name: "coinMaterial", label: "coinMaterial", type: "select",
          options: ["Gull", "Silfur", "Kopar", "Nikkel", "Brons", "Annað"] },
        { name: "coinGrade", label: "coinGrade", type: "select",
          options: ["Proof", "Uncirculated", "Extremely Fine", "Very Fine", "Fine", "Good", "Poor"] },
        { name: "certified", label: "certified", type: "boolean" },
        { name: "mintMark", label: "mintMark", type: "text", placeholder: "Myntmerki" },
        { name: "rarity", label: "rarity", type: "select",
          options: ["Mjög sjaldgæf", "Sjaldgæf", "Óskagilega sjaldgæf", "Algeng", "Annað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "itemName", label: "itemName", type: "text", required: true, placeholder: "Nafn hlutar" },
        { name: "yearCreated", label: "yearCreated", type: "text", placeholder: "Ártal" },
        { name: "antiqueCondition", label: "antiqueCondition", type: "select", required: true,
          options: ["Frábært", "Mjög gott", "Gott", "Sæmilegt", "Þarfnast viðgerðar"] }
      ]
    },
    
    // Trading Cards (Safnkort)
    "Safnkort": {
      // Sports Cards (Íþróttakort)
      "Íþróttakort": [
        { name: "cardName", label: "cardName", type: "text", required: true, placeholder: "Nafn korts" },
        { name: "playerName", label: "playerName", type: "text", required: true, placeholder: "Nafn leikmanns" },
        { name: "sport", label: "sport", type: "select",
          options: ["Fótbolti", "Körfubolti", "Hafnabolti", "Íshokkí", "Boltaíþróttir", "Annað"] },
        { name: "cardYear", label: "cardYear", type: "number", placeholder: "Ártal" },
        { name: "cardBrand", label: "cardBrand", type: "text", placeholder: "t.d. Topps, Panini" },
        { name: "cardSet", label: "cardSet", type: "text", placeholder: "Safn/sett" },
        { name: "cardNumber", label: "cardNumber", type: "text", placeholder: "Kortanúmer" },
        { name: "cardCondition", label: "cardCondition", type: "select", required: true,
          options: ["Gem Mint 10", "Mint 9", "Near Mint 8", "Excellent 7", "Very Good 6", "Good 5", "Poor"] },
        { name: "gradedCard", label: "gradedCard", type: "boolean" },
        { name: "autographed", label: "autographed", type: "boolean" },
        { name: "rookieCard", label: "rookieCard", type: "boolean" },
        { name: "serialNumbered", label: "serialNumbered", type: "text", placeholder: "t.d. 5/99" }
      ],
      
      // Pokémon Cards (Pokémon)
      "Pokémon": [
        { name: "cardName", label: "cardName", type: "text", required: true, placeholder: "Nafn korts" },
        { name: "pokemonName", label: "pokemonName", type: "text", required: true, placeholder: "Nafn Pokémon" },
        { name: "cardSet", label: "cardSet", type: "text", placeholder: "Safn" },
        { name: "cardNumber", label: "cardNumber", type: "text", placeholder: "Kortanúmer" },
        { name: "cardRarity", label: "cardRarity", type: "select",
          options: ["Common", "Uncommon", "Rare", "Holo Rare", "Ultra Rare", "Secret Rare", "Annað"] },
        { name: "cardCondition", label: "cardCondition", type: "select", required: true,
          options: ["Gem Mint 10", "Mint 9", "Near Mint 8", "Excellent 7", "Very Good 6", "Good 5", "Poor"] },
        { name: "firstEdition", label: "firstEdition", type: "boolean" },
        { name: "gradedCard", label: "gradedCard", type: "boolean" },
        { name: "shadowless", label: "shadowless", type: "boolean" },
        { name: "language", label: "language", type: "select",
          options: ["Enska", "Japönsk", "Annað"] }
      ],
      
      // Magic Cards (Magic)
      "Magic": [
        { name: "cardName", label: "cardName", type: "text", required: true, placeholder: "Nafn korts" },
        { name: "cardSet", label: "cardSet", type: "text", placeholder: "Safn" },
        { name: "cardNumber", label: "cardNumber", type: "text", placeholder: "Kortanúmer" },
        { name: "cardRarity", label: "cardRarity", type: "select",
          options: ["Common", "Uncommon", "Rare", "Mythic Rare", "Special", "Annað"] },
        { name: "cardCondition", label: "cardCondition", type: "select", required: true,
          options: ["Gem Mint 10", "Mint 9", "Near Mint 8", "Excellent 7", "Very Good 6", "Good 5", "Poor"] },
        { name: "foilCard", label: "foilCard", type: "boolean" },
        { name: "gradedCard", label: "gradedCard", type: "boolean" },
        { name: "language", label: "language", type: "select",
          options: ["Enska", "Japönsk", "Annað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "cardName", label: "cardName", type: "text", required: true, placeholder: "Nafn korts" },
        { name: "cardSet", label: "cardSet", type: "text", placeholder: "Safn" },
        { name: "cardCondition", label: "cardCondition", type: "select", required: true,
          options: ["Gem Mint 10", "Mint 9", "Near Mint 8", "Excellent 7", "Very Good 6", "Good 5", "Poor"] }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
      { name: "brand", label: "brand", type: "text" }
    ]
  },
  
  // Pet Supplies Category
  "Gæludýravörur": {
    // Dog Supplies (Hundavörur)
    "Hundavörur": {
      // Dog Food (Hundfóður)
      "Hundfóður": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Royal Canin, Acana" },
        { name: "productName", label: "productName", type: "text", placeholder: "Nafn vöru" },
        { name: "dogFoodType", label: "dogFoodType", type: "select", required: true,
          options: ["Þurrfóður", "Blautfóður", "Frosið", "Hrátt", "Annað"] },
        { name: "dogSize", label: "dogSize", type: "select",
          options: ["Lítill hundur", "Meðalstór hundur", "Stór hundur", "Öll stærð"] },
        { name: "dogAge", label: "dogAge", type: "select",
          options: ["Hvolpur", "Fullorðinn", "Eldri", "Öll aldur"] },
        { name: "specialDiet", label: "specialDiet", type: "multiselect",
          options: ["Grain-free", "Hypoallergenic", "Weight management", "Sensitive stomach", "Annað"] },
        { name: "weightAmount", label: "weightAmount", type: "text", unit: "kg", placeholder: "Þyngd" },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað"] }
      ],
      
      // Toys (Leikföng)
      "Leikföng": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "dogToyType", label: "dogToyType", type: "select", required: true,
          options: ["Tyggjuleikföng", "Boltar", "Frisbee", "Stuffed leikföng", "Interactive leikföng", "Annað"] },
        { name: "dogSize", label: "dogSize", type: "select",
          options: ["Lítill hundur", "Meðalstór hundur", "Stór hundur", "Öll stærð"] },
        { name: "toyMaterial", label: "toyMaterial", type: "text", placeholder: "t.d. Gúmmí, Þráður" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] },
        { name: "squeakyToy", label: "squeakyToy", type: "boolean" },
        { name: "durable", label: "durable", type: "boolean" }
      ],
      
      // Beds (Beð)
      "Beð": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "bedType", label: "bedType", type: "select", required: true,
          options: ["Púði", "Nest beð", "Ortopedískt", "Heated beð", "Outdoor beð", "Annað"] },
        { name: "dogSize", label: "dogSize", type: "select", required: true,
          options: ["Lítill hundur", "Meðalstór hundur", "Stór hundur"] },
        { name: "bedDimensions", label: "bedDimensions", type: "text", placeholder: "Stærðir" },
        { name: "bedMaterial", label: "bedMaterial", type: "text", placeholder: "t.d. Memory foam, Bómull" },
        { name: "washable", label: "washable", type: "boolean" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Collars and Leashes (Hálsbönd og taumar)
      "Hálsbönd og taumar": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "collarLeashType", label: "collarLeashType", type: "select", required: true,
          options: ["Hálsband", "Harness", "Taumi", "Retractable taumi", "Annað"] },
        { name: "dogSize", label: "dogSize", type: "select",
          options: ["Lítill hundur", "Meðalstór hundur", "Stór hundur", "Stillanlegt"] },
        { name: "collarMaterial", label: "collarMaterial", type: "text", placeholder: "t.d. Nálon, Leður" },
        { name: "adjustable", label: "adjustable", type: "boolean" },
        { name: "reflective", label: "reflective", type: "boolean" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Cat Supplies (Kattavörur)
    "Kattavörur": {
      // Cat Food (Kattafóður)
      "Kattafóður": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Whiskas, Royal Canin" },
        { name: "productName", label: "productName", type: "text", placeholder: "Nafn vöru" },
        { name: "catFoodType", label: "catFoodType", type: "select", required: true,
          options: ["Þurrfóður", "Blautfóður", "Treats", "Annað"] },
        { name: "catAge", label: "catAge", type: "select",
          options: ["Kattaketti", "Fullorðinn", "Eldri", "Öll aldur"] },
        { name: "specialDiet", label: "specialDiet", type: "multiselect",
          options: ["Grain-free", "Hairball control", "Weight management", "Indoor cats", "Sensitive stomach", "Annað"] },
        { name: "weightAmount", label: "weightAmount", type: "text", unit: "kg", placeholder: "Þyngd" },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað"] }
      ],
      
      // Furniture (Húsgögn)
      "Húsgögn": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "catFurnitureType", label: "catFurnitureType", type: "select", required: true,
          options: ["Kattartré", "Krassaborð", "Kattaturn", "Beð", "Hús", "Annað"] },
        { name: "furnitureDimensions", label: "furnitureDimensions", type: "text", placeholder: "Hæð x breidd x dýpt" },
        { name: "numberOfLevels", label: "numberOfLevels", type: "number", placeholder: "Fjöldi hæða" },
        { name: "furnitureMaterial", label: "furnitureMaterial", type: "text", placeholder: "t.d. Sisal, Plúss" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] },
        { name: "assemblyRequired", label: "assemblyRequired", type: "boolean" }
      ],
      
      // Toys (Leikföng)
      "Leikföng": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "catToyType", label: "catToyType", type: "select", required: true,
          options: ["Veiðistöng", "Músaleikföng", "Boltar", "Laser pointer", "Interactive leikföng", "Catnip leikföng", "Annað"] },
        { name: "toyMaterial", label: "toyMaterial", type: "text", placeholder: "Efni" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] },
        { name: "batteryPowered", label: "batteryPowered", type: "boolean" },
        { name: "catnipIncluded", label: "catnipIncluded", type: "boolean" }
      ],
      
      // Litter Boxes (Sandkassar)
      "Sandkassar": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "litterBoxType", label: "litterBoxType", type: "select", required: true,
          options: ["Opinn kassi", "Húðaður kassi", "Self-cleaning", "Disposable", "Annað"] },
        { name: "litterBoxSize", label: "litterBoxSize", type: "text", placeholder: "Stærð" },
        { name: "hoodedBox", label: "hoodedBox", type: "boolean" },
        { name: "litterScoop", label: "litterScoop", type: "boolean" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Fish & Equipment (Fiskar & Búnaður)
    "Fiskar & Búnaður": {
      // Aquarium (Fiskabúr)
      "Fiskabúr": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "tankSize", label: "tankSize", type: "number", unit: "L", required: true, placeholder: "Stærð í lítrum" },
        { name: "tankDimensions", label: "tankDimensions", type: "text", placeholder: "Lengd x breidd x hæð" },
        { name: "tankType", label: "tankType", type: "select",
          options: ["Ferskvatn", "Saltvatn", "Reef", "Betta", "Annað"] },
        { name: "tankShape", label: "tankShape", type: "select",
          options: ["Rétthyrningur", "Boga", "Cylinder", "Annað"] },
        { name: "standIncluded", label: "standIncluded", type: "boolean" },
        { name: "lidIncluded", label: "lidIncluded", type: "boolean" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Filters (Síur)
      "Síur": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "filterType", label: "filterType", type: "select", required: true,
          options: ["Hang-on-back", "Canister", "Sponge", "Internal", "Undergravel", "Annað"] },
        { name: "flowRate", label: "flowRate", type: "text", placeholder: "t.d. 500 L/h" },
        { name: "suitableTankSize", label: "suitableTankSize", type: "text", placeholder: "t.d. 50-200L" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Gott ástand"] }
      ],
      
      // Equipment (Búnaður)
      "Búnaður": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "aquariumEquipmentType", label: "aquariumEquipmentType", type: "select", required: true,
          options: ["Heater", "Ljós", "Air pump", "CO2 system", "Skraut", "Gravel", "Plants", "Annað"] },
        { name: "wattage", label: "wattage", type: "number", unit: "W", placeholder: "Vöt" },
        { name: "suitableTankSize", label: "suitableTankSize", type: "text", placeholder: "Hentar fyrir" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Fish (Fiskur)
      "Fiskur": [
        { name: "fishSpecies", label: "fishSpecies", type: "text", required: true, placeholder: "Tegund fisks" },
        { name: "fishSize", label: "fishSize", type: "text", placeholder: "Stærð" },
        { name: "fishAge", label: "fishAge", type: "text", placeholder: "Aldur" },
        { name: "waterType", label: "waterType", type: "select", required: true,
          options: ["Ferskvatn", "Saltvatn", "Brackish"] },
        { name: "temperament", label: "temperament", type: "select",
          options: ["Friðsamur", "Semi-aggressive", "Aggressive", "Annað"] },
        { name: "quantity", label: "quantity", type: "number", placeholder: "Fjöldi fiska" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Bird Supplies (Fuglabúnaður)
    "Fuglabúnaður": {
      // Cages (Búr)
      "Búr": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "cageDimensions", label: "cageDimensions", type: "text", required: true, placeholder: "Lengd x breidd x hæð" },
        { name: "birdType", label: "birdType", type: "select",
          options: ["Litlir fuglar", "Meðal fuglar", "Stórir fuglar", "Páfagaukar", "Annað"] },
        { name: "cageMaterial", label: "cageMaterial", type: "text", placeholder: "t.d. Stál, Tré" },
        { name: "barSpacing", label: "barSpacing", type: "text", placeholder: "Bil á milli stanga" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] },
        { name: "standIncluded", label: "standIncluded", type: "boolean" },
        { name: "perchesIncluded", label: "perchesIncluded", type: "boolean" }
      ],
      
      // Food (Fóður)
      "Fóður": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "productName", label: "productName", type: "text", placeholder: "Nafn vöru" },
        { name: "birdFoodType", label: "birdFoodType", type: "select", required: true,
          options: ["Fræ", "Pellets", "Treats", "Fruit blöndu", "Annað"] },
        { name: "birdType", label: "birdType", type: "select",
          options: ["Litlir fuglar", "Meðal fuglar", "Stórir fuglar", "Páfagaukar", "Allir fuglar", "Annað"] },
        { name: "weightAmount", label: "weightAmount", type: "text", unit: "kg", placeholder: "Þyngd" },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað"] }
      ],
      
      // Toys (Leikföng)
      "Leikföng": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "birdToyType", label: "birdToyType", type: "select", required: true,
          options: ["Sveifla", "Ladder", "Kúlur", "Chewing leikföng", "Mirrors", "Bells", "Annað"] },
        { name: "toyMaterial", label: "toyMaterial", type: "text", placeholder: "t.d. Tré, Kaðall" },
        { name: "birdType", label: "birdType", type: "select",
          options: ["Litlir fuglar", "Meðal fuglar", "Stórir fuglar", "Allir fuglar"] },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Small Animals (Smádýr)
    "Smádýr": {
      // Cages (Búr)
      "Búr": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "cageDimensions", label: "cageDimensions", type: "text", required: true, placeholder: "Lengd x breidd x hæð" },
        { name: "smallAnimalType", label: "smallAnimalType", type: "select", required: true,
          options: ["Hamster", "Gerbil", "Guinea pig", "Kanína", "Chinchilla", "Annað"] },
        { name: "cageMaterial", label: "cageMaterial", type: "text", placeholder: "t.d. Plast, Tré, Stál" },
        { name: "multiLevel", label: "multiLevel", type: "boolean" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] },
        { name: "accessoriesIncluded", label: "accessoriesIncluded", type: "boolean" }
      ],
      
      // Food (Fóður)
      "Fóður": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "productName", label: "productName", type: "text", placeholder: "Nafn vöru" },
        { name: "smallAnimalType", label: "smallAnimalType", type: "select", required: true,
          options: ["Hamster", "Gerbil", "Guinea pig", "Kanína", "Chinchilla", "Öll smádýr", "Annað"] },
        { name: "foodForm", label: "foodForm", type: "select",
          options: ["Pellets", "Fræ blöndu", "Hay", "Treats", "Annað"] },
        { name: "weightAmount", label: "weightAmount", type: "text", unit: "kg", placeholder: "Þyngd" },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Reptiles (Skriðdýr)
    "Skriðdýr": {
      // Terrarium (Terrarium)
      "Terrarium": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "terrariumSize", label: "terrariumSize", type: "text", required: true, placeholder: "Lengd x breidd x hæð" },
        { name: "reptileType", label: "reptileType", type: "select",
          options: ["Eðla", "Snákur", "Skjaldbaka", "Frosk/padda", "Annað"] },
        { name: "terrariumMaterial", label: "terrariumMaterial", type: "select",
          options: ["Gler", "Plast", "Blönduð efni", "Annað"] },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] },
        { name: "lockableTop", label: "lockableTop", type: "boolean" },
        { name: "standIncluded", label: "standIncluded", type: "boolean" }
      ],
      
      // Heat and Light (Hiti og ljós)
      "Hiti og ljós": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "heatLightType", label: "heatLightType", type: "select", required: true,
          options: ["Heat lamp", "UV ljós", "Ceramic heater", "Heat mat", "Basking lamp", "Annað"] },
        { name: "wattage", label: "wattage", type: "number", unit: "W", placeholder: "Vöt" },
        { name: "uvbOutput", label: "uvbOutput", type: "text", placeholder: "UVB gildi" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað", "Gott ástand"] }
      ],
      
      // Food (Fóður)
      "Fóður": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "productName", label: "productName", type: "text", required: true, placeholder: "Nafn vöru" },
        { name: "reptileFoodType", label: "reptileFoodType", type: "select", required: true,
          options: ["Lifandi fóður", "Frosið fóður", "Pellets", "Supplements", "Annað"] },
        { name: "reptileType", label: "reptileType", type: "select",
          options: ["Eðla", "Snákur", "Skjaldbaka", "Frosk/padda", "Öll skriðdýr", "Annað"] },
        { name: "expiryDate", label: "expiryDate", type: "text", placeholder: "Gildistími" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Nýtt opnað", "Lítið notað"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "petProductCondition", label: "petProductCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
      { name: "brand", label: "brand", type: "text" }
    ]
  },
  
  // Jewelry & Watches Category
  "Skartgripir & Úr": {
    // Watches (Úr)
    "Úr": {
      // Men's Watches (Karlaúr)
      "Karlaúr": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Rolex, Seiko, Casio" },
        { name: "watchModel", label: "watchModel", type: "text", placeholder: "Model" },
        { name: "watchMovement", label: "watchMovement", type: "select", required: true,
          options: ["Automatic", "Quartz", "Mechanical", "Kinetic", "Solar", "Annað"] },
        { name: "caseMaterial", label: "caseMaterial", type: "select",
          options: ["Stál", "Gull", "Silfur", "Títanium", "Keramík", "Plast", "Annað"] },
        { name: "caseDiameter", label: "caseDiameter", type: "text", unit: "mm", placeholder: "Þvermál húss" },
        { name: "strapMaterial", label: "strapMaterial", type: "select",
          options: ["Leður", "Stál", "Gúmmí", "Nálon", "Keramík", "Annað"] },
        { name: "waterResistance", label: "waterResistance", type: "text", placeholder: "t.d. 50m, 100m, 200m" },
        { name: "watchCondition", label: "watchCondition", type: "select", required: true,
          options: ["Nýtt með boxu", "Nýtt án boxu", "Eins og nýtt", "Lítið notað", "Gott ástand", "Sæmilegt ástand"] },
        { name: "boxPapers", label: "boxPapers", type: "boolean" },
        { name: "serialNumber", label: "serialNumber", type: "text", placeholder: "Raðnúmer" },
        { name: "warrantyIncluded", label: "warrantyIncluded", type: "boolean" }
      ],
      
      // Women's Watches (Kvennaúr)
      "Kvennaúr": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Rolex, Cartier, Michael Kors" },
        { name: "watchModel", label: "watchModel", type: "text", placeholder: "Model" },
        { name: "watchMovement", label: "watchMovement", type: "select", required: true,
          options: ["Automatic", "Quartz", "Mechanical", "Kinetic", "Solar", "Annað"] },
        { name: "caseMaterial", label: "caseMaterial", type: "select",
          options: ["Stál", "Gull", "Silfur", "Títanium", "Keramík", "Plast", "Annað"] },
        { name: "caseDiameter", label: "caseDiameter", type: "text", unit: "mm", placeholder: "Þvermál húss" },
        { name: "strapMaterial", label: "strapMaterial", type: "select",
          options: ["Leður", "Stál", "Gúmmí", "Nálon", "Keramík", "Annað"] },
        { name: "waterResistance", label: "waterResistance", type: "text", placeholder: "t.d. 30m, 50m, 100m" },
        { name: "watchCondition", label: "watchCondition", type: "select", required: true,
          options: ["Nýtt með boxu", "Nýtt án boxu", "Eins og nýtt", "Lítið notað", "Gott ástand", "Sæmilegt ástand"] },
        { name: "boxPapers", label: "boxPapers", type: "boolean" },
        { name: "serialNumber", label: "serialNumber", type: "text", placeholder: "Raðnúmer" },
        { name: "warrantyIncluded", label: "warrantyIncluded", type: "boolean" },
        { name: "gemstones", label: "gemstones", type: "boolean" }
      ],
      
      // Smart Watches (Snjallúr)
      "Snjallúr": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Apple, Samsung, Garmin" },
        { name: "watchModel", label: "watchModel", type: "text", required: true, placeholder: "Model" },
        { name: "screenSize", label: "screenSize", type: "text", unit: "mm", placeholder: "Skjástærð" },
        { name: "smartwatchOS", label: "smartwatchOS", type: "select",
          options: ["watchOS", "Wear OS", "Tizen", "Garmin OS", "Fitbit OS", "Annað"] },
        { name: "caseMaterial", label: "caseMaterial", type: "select",
          options: ["Stál", "Ál", "Títanium", "Keramík", "Plast", "Annað"] },
        { name: "gpsIncluded", label: "gpsIncluded", type: "boolean" },
        { name: "cellularEnabled", label: "cellularEnabled", type: "boolean" },
        { name: "batteryLife", label: "batteryLife", type: "text", placeholder: "t.d. 18 klst, 2 dagar" },
        { name: "waterResistance", label: "waterResistance", type: "text", placeholder: "t.d. IP68, 50m" },
        { name: "watchCondition", label: "watchCondition", type: "select", required: true,
          options: ["Nýtt með boxu", "Nýtt án boxu", "Eins og nýtt", "Lítið notað", "Gott ástand", "Sæmilegt ástand"] },
        { name: "boxPapers", label: "boxPapers", type: "boolean" },
        { name: "warrantyIncluded", label: "warrantyIncluded", type: "boolean" }
      ],
      
      // Accessories (Fylgihlutir)
      "Fylgihlutir": [
        { name: "accessoryType", label: "accessoryType", type: "select", required: true,
          options: ["Ól", "Hleðslutæki", "Borð fyrir úr", "Úrkassi", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "compatibleWith", label: "compatibleWith", type: "text", placeholder: "Hentar fyrir" },
        { name: "jewelryCondition", label: "jewelryCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vöru" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "watchCondition", label: "watchCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Fine Jewelry (Fínlegir skartgripir)
    "Fínlegir skartgripir": {
      // Rings (Hringir)
      "Hringir": [
        { name: "ringType", label: "ringType", type: "select", required: true,
          options: ["Trúlofunar hringur", "Giftingar hringur", "Silfurhringur", "Gullhringur", "Demantshringur", "Annað"] },
        { name: "metalType", label: "metalType", type: "select", required: true,
          options: ["Gull", "Hvítgull", "Rauðgull", "Silfur", "Platína", "Títanium", "Annað"] },
        { name: "metalPurity", label: "metalPurity", type: "select",
          options: ["24K", "18K", "14K", "10K", "925 Sterling", "Annað"] },
        { name: "ringSize", label: "ringSize", type: "text", placeholder: "Stærð hrings" },
        { name: "gemstoneType", label: "gemstoneType", type: "select",
          options: ["Demant", "Safír", "Rúbín", "Smaragður", "Perlur", "Topas", "Amethyst", "Enginn", "Annað"] },
        { name: "caratWeight", label: "caratWeight", type: "text", placeholder: "Karat þyngd" },
        { name: "hallmark", label: "hallmark", type: "boolean" },
        { name: "certificateIncluded", label: "certificateIncluded", type: "boolean" },
        { name: "jewelryCondition", label: "jewelryCondition", type: "select", required: true,
          options: ["Nýtt með boxu", "Nýtt án boxu", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Vintage"] }
      ],
      
      // Necklaces (Hálsmen)
      "Hálsmen": [
        { name: "necklaceType", label: "necklaceType", type: "select", required: true,
          options: ["Keðja", "Pendant hálsmen", "Perlu hálsmen", "Choker", "Locket", "Annað"] },
        { name: "metalType", label: "metalType", type: "select", required: true,
          options: ["Gull", "Hvítgull", "Rauðgull", "Silfur", "Platína", "Títanium", "Annað"] },
        { name: "metalPurity", label: "metalPurity", type: "select",
          options: ["24K", "18K", "14K", "10K", "925 Sterling", "Annað"] },
        { name: "necklaceLength", label: "necklaceLength", type: "text", unit: "cm", placeholder: "Lengd" },
        { name: "gemstoneType", label: "gemstoneType", type: "select",
          options: ["Demant", "Safír", "Rúbín", "Smaragður", "Perlur", "Topas", "Amethyst", "Enginn", "Annað"] },
        { name: "hallmark", label: "hallmark", type: "boolean" },
        { name: "certificateIncluded", label: "certificateIncluded", type: "boolean" },
        { name: "jewelryCondition", label: "jewelryCondition", type: "select", required: true,
          options: ["Nýtt með boxu", "Nýtt án boxu", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Vintage"] }
      ],
      
      // Bracelets (Armbönd)
      "Armbönd": [
        { name: "braceletType", label: "braceletType", type: "select", required: true,
          options: ["Keðja", "Bangle", "Charm armband", "Tennis armband", "Cuff", "Annað"] },
        { name: "metalType", label: "metalType", type: "select", required: true,
          options: ["Gull", "Hvítgull", "Rauðgull", "Silfur", "Platína", "Títanium", "Annað"] },
        { name: "metalPurity", label: "metalPurity", type: "select",
          options: ["24K", "18K", "14K", "10K", "925 Sterling", "Annað"] },
        { name: "braceletLength", label: "braceletLength", type: "text", unit: "cm", placeholder: "Lengd" },
        { name: "gemstoneType", label: "gemstoneType", type: "select",
          options: ["Demant", "Safír", "Rúbín", "Smaragður", "Perlur", "Topas", "Amethyst", "Enginn", "Annað"] },
        { name: "hallmark", label: "hallmark", type: "boolean" },
        { name: "certificateIncluded", label: "certificateIncluded", type: "boolean" },
        { name: "jewelryCondition", label: "jewelryCondition", type: "select", required: true,
          options: ["Nýtt með boxu", "Nýtt án boxu", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Vintage"] }
      ],
      
      // Earrings (Eyrnalokkar)
      "Eyrnalokkar": [
        { name: "earringType", label: "earringType", type: "select", required: true,
          options: ["Stud earrings", "Hoop earrings", "Drop earrings", "Chandelier", "Annað"] },
        { name: "metalType", label: "metalType", type: "select", required: true,
          options: ["Gull", "Hvítgull", "Rauðgull", "Silfur", "Platína", "Títanium", "Annað"] },
        { name: "metalPurity", label: "metalPurity", type: "select",
          options: ["24K", "18K", "14K", "10K", "925 Sterling", "Annað"] },
        { name: "gemstoneType", label: "gemstoneType", type: "select",
          options: ["Demant", "Safír", "Rúbín", "Smaragður", "Perlur", "Topas", "Amethyst", "Enginn", "Annað"] },
        { name: "hallmark", label: "hallmark", type: "boolean" },
        { name: "certificateIncluded", label: "certificateIncluded", type: "boolean" },
        { name: "jewelryCondition", label: "jewelryCondition", type: "select", required: true,
          options: ["Nýtt með boxu", "Nýtt án boxu", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Vintage"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund skartgrips" },
        { name: "metalType", label: "metalType", type: "select",
          options: ["Gull", "Silfur", "Platína", "Annað"] },
        { name: "jewelryCondition", label: "jewelryCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Fashion Jewelry (Tískuskartgripir)
    "Tískuskartgripir": {
      // Rings (Hringir)
      "Hringir": [
        { name: "ringType", label: "ringType", type: "select", required: true,
          options: ["Statement hringur", "Band hringur", "Stackable hringir", "Annað"] },
        { name: "fashionMaterial", label: "fashionMaterial", type: "select", required: true,
          options: ["Stál", "Alloy", "Plated gull", "Plated silfur", "Messing", "Annað"] },
        { name: "ringSize", label: "ringSize", type: "text", placeholder: "Stærð hrings" },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Pandora, Swarovski" },
        { name: "fashionJewelryCondition", label: "fashionJewelryCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Necklaces (Hálsmen)
      "Hálsmen": [
        { name: "necklaceType", label: "necklaceType", type: "select", required: true,
          options: ["Keðja", "Pendant", "Choker", "Locket", "Annað"] },
        { name: "fashionMaterial", label: "fashionMaterial", type: "select", required: true,
          options: ["Stál", "Alloy", "Plated gull", "Plated silfur", "Messing", "Annað"] },
        { name: "necklaceLength", label: "necklaceLength", type: "text", unit: "cm", placeholder: "Lengd" },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Pandora, Swarovski" },
        { name: "fashionJewelryCondition", label: "fashionJewelryCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Bracelets (Armbönd)
      "Armbönd": [
        { name: "braceletType", label: "braceletType", type: "select", required: true,
          options: ["Keðja", "Bangle", "Charm armband", "Cuff", "Annað"] },
        { name: "fashionMaterial", label: "fashionMaterial", type: "select", required: true,
          options: ["Stál", "Alloy", "Plated gull", "Plated silfur", "Messing", "Leður", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Pandora, Swarovski" },
        { name: "fashionJewelryCondition", label: "fashionJewelryCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Earrings (Eyrnalokkar)
      "Eyrnalokkar": [
        { name: "earringType", label: "earringType", type: "select", required: true,
          options: ["Stud", "Hoop", "Drop", "Dangle", "Annað"] },
        { name: "fashionMaterial", label: "fashionMaterial", type: "select", required: true,
          options: ["Stál", "Alloy", "Plated gull", "Plated silfur", "Messing", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Pandora, Swarovski" },
        { name: "fashionJewelryCondition", label: "fashionJewelryCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund skartgrips" },
        { name: "fashionMaterial", label: "fashionMaterial", type: "text", placeholder: "Efni" },
        { name: "fashionJewelryCondition", label: "fashionJewelryCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Vintage Jewelry (Fornir skartgripir)
    "Fornir skartgripir": {
      // Rings (Hringir)
      "Hringir": [
        { name: "ringType", label: "ringType", type: "select", required: true,
          options: ["Victorian", "Art Deco", "Retro", "Mid-century", "Annað"] },
        { name: "metalType", label: "metalType", type: "select",
          options: ["Gull", "Hvítgull", "Silfur", "Platína", "Annað"] },
        { name: "metalPurity", label: "metalPurity", type: "select",
          options: ["24K", "18K", "14K", "10K", "925 Sterling", "Óþekkt", "Annað"] },
        { name: "estimatedAge", label: "estimatedAge", type: "text", placeholder: "t.d. 1920s, 1950s" },
        { name: "gemstoneType", label: "gemstoneType", type: "select",
          options: ["Demant", "Safír", "Rúbín", "Smaragður", "Perlur", "Enginn", "Annað"] },
        { name: "hallmark", label: "hallmark", type: "boolean" },
        { name: "vintageJewelryCondition", label: "vintageJewelryCondition", type: "select", required: true,
          options: ["Frábært", "Gott", "Sæmilegt", "Þarfnast viðgerðar"] }
      ],
      
      // Brooches (Broskar)
      "Broskar": [
        { name: "broochStyle", label: "broochStyle", type: "select", required: true,
          options: ["Victorian", "Art Nouveau", "Art Deco", "Retro", "Annað"] },
        { name: "metalType", label: "metalType", type: "select",
          options: ["Gull", "Silfur", "Platína", "Annað"] },
        { name: "estimatedAge", label: "estimatedAge", type: "text", placeholder: "t.d. 1890s, 1930s" },
        { name: "gemstoneType", label: "gemstoneType", type: "select",
          options: ["Demant", "Safír", "Rúbín", "Perlur", "Enamel", "Enginn", "Annað"] },
        { name: "hallmark", label: "hallmark", type: "boolean" },
        { name: "vintageJewelryCondition", label: "vintageJewelryCondition", type: "select", required: true,
          options: ["Frábært", "Gott", "Sæmilegt", "Þarfnast viðgerðar"] }
      ],
      
      // Necklaces (Hálsmen)
      "Hálsmen": [
        { name: "necklaceType", label: "necklaceType", type: "select", required: true,
          options: ["Victorian", "Art Deco", "Retro", "Perlu hálsmen", "Annað"] },
        { name: "metalType", label: "metalType", type: "select",
          options: ["Gull", "Silfur", "Platína", "Annað"] },
        { name: "estimatedAge", label: "estimatedAge", type: "text", placeholder: "t.d. 1900s, 1940s" },
        { name: "necklaceLength", label: "necklaceLength", type: "text", unit: "cm", placeholder: "Lengd" },
        { name: "gemstoneType", label: "gemstoneType", type: "select",
          options: ["Demant", "Perlur", "Enginn", "Annað"] },
        { name: "hallmark", label: "hallmark", type: "boolean" },
        { name: "vintageJewelryCondition", label: "vintageJewelryCondition", type: "select", required: true,
          options: ["Frábært", "Gott", "Sæmilegt", "Þarfnast viðgerðar"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund skartgrips" },
        { name: "estimatedAge", label: "estimatedAge", type: "text", placeholder: "Aldur" },
        { name: "metalType", label: "metalType", type: "text", placeholder: "Málmur" },
        { name: "vintageJewelryCondition", label: "vintageJewelryCondition", type: "select", required: true,
          options: ["Frábært", "Gott", "Sæmilegt", "Þarfnast viðgerðar"] }
      ]
    },
    
    // Men's Jewelry (Karlaskartgripir)
    "Karlaskartgripir": {
      // Rings (Hringir)
      "Hringir": [
        { name: "ringType", label: "ringType", type: "select", required: true,
          options: ["Giftingar hringur", "Signet hringur", "Band hringur", "Annað"] },
        { name: "metalType", label: "metalType", type: "select", required: true,
          options: ["Gull", "Hvítgull", "Silfur", "Títanium", "Tungsten", "Stál", "Annað"] },
        { name: "metalPurity", label: "metalPurity", type: "select",
          options: ["24K", "18K", "14K", "10K", "925 Sterling", "Annað"] },
        { name: "ringSize", label: "ringSize", type: "text", placeholder: "Stærð hrings" },
        { name: "gemstoneType", label: "gemstoneType", type: "select",
          options: ["Demant", "Onyx", "Topas", "Enginn", "Annað"] },
        { name: "jewelryCondition", label: "jewelryCondition", type: "select", required: true,
          options: ["Nýtt með boxu", "Nýtt án boxu", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Bracelets (Armbönd)
      "Armbönd": [
        { name: "braceletType", label: "braceletType", type: "select", required: true,
          options: ["Keðja", "Leather armband", "ID armband", "Cuff", "Annað"] },
        { name: "materialType", label: "materialType", type: "select", required: true,
          options: ["Gull", "Silfur", "Stál", "Leður", "Títanium", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "jewelryCondition", label: "jewelryCondition", type: "select", required: true,
          options: ["Nýtt með boxu", "Nýtt án boxu", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Necklaces (Hálsmen)
      "Hálsmen": [
        { name: "necklaceType", label: "necklaceType", type: "select", required: true,
          options: ["Keðja", "Dog tag", "Pendant", "Annað"] },
        { name: "metalType", label: "metalType", type: "select", required: true,
          options: ["Gull", "Silfur", "Stál", "Títanium", "Annað"] },
        { name: "necklaceLength", label: "necklaceLength", type: "text", unit: "cm", placeholder: "Lengd" },
        { name: "jewelryCondition", label: "jewelryCondition", type: "select", required: true,
          options: ["Nýtt með boxu", "Nýtt án boxu", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund skartgrips" },
        { name: "materialType", label: "materialType", type: "text", placeholder: "Efni" },
        { name: "jewelryCondition", label: "jewelryCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
      { name: "brand", label: "brand", type: "text" }
    ]
  },
  
  // Business & Industrial Category
  "Fyrirtæki & Iðnaður": {
    // Restaurant Equipment (Veitingahúsabúnaður)
    "Veitingahúsabúnaður": {
      // Kitchen Equipment (Eldhúsbúnaður)
      "Eldhúsbúnaður": [
        { name: "equipmentType", label: "equipmentType", type: "select", required: true,
          options: ["Eldavél", "Ofn", "Grill", "Fryer", "Uppþvottavél", "Blandari", "Skurðarborð", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "modelNumber", label: "modelNumber", type: "text", placeholder: "Model númer" },
        { name: "powerRequirement", label: "powerRequirement", type: "text", placeholder: "t.d. 220V, 380V" },
        { name: "dimensions", label: "dimensions", type: "text", placeholder: "Stærðir" },
        { name: "capacity", label: "capacity", type: "text", placeholder: "Rými/afköst" },
        { name: "commercialGrade", label: "commercialGrade", type: "boolean" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Þarfnast viðgerðar", "Til varahluta"] },
        { name: "yearManufactured", label: "yearManufactured", type: "text", placeholder: "Framleiðsluár" }
      ],
      
      // Table Equipment (Borðbúnaður)
      "Borðbúnaður": [
        { name: "equipmentType", label: "equipmentType", type: "select", required: true,
          options: ["Diskar", "Glervatn", "Hnífapör", "Borðdúkar", "Servíettur", "Annað"] },
        { name: "materialType", label: "materialType", type: "select",
          options: ["Postulín", "Gler", "Plast", "Stál", "Annað"] },
        { name: "setQuantity", label: "setQuantity", type: "number", placeholder: "Fjöldi í setti" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt ónotað", "Lítið notað", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Refrigeration (Kælibúnaður)
      "Kælibúnaður": [
        { name: "equipmentType", label: "equipmentType", type: "select", required: true,
          options: ["Walk-in kæli", "Borðkæli", "Frystir", "Kæliklefi", "Display kæli", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "modelNumber", label: "modelNumber", type: "text", placeholder: "Model númer" },
        { name: "capacity", label: "capacity", type: "text", placeholder: "Rými" },
        { name: "dimensions", label: "dimensions", type: "text", placeholder: "Stærðir" },
        { name: "temperatureRange", label: "temperatureRange", type: "text", placeholder: "Hitastig bil" },
        { name: "powerRequirement", label: "powerRequirement", type: "text", placeholder: "Rafmagn" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Þarfnast viðgerðar", "Til varahluta"] },
        { name: "yearManufactured", label: "yearManufactured", type: "text", placeholder: "Framleiðsluár" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund búnaðar" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Medical Equipment (Heilbrigðisbúnaður)
    "Heilbrigðisbúnaður": {
      // Medical Devices (Læknistæki)
      "Læknistæki": [
        { name: "deviceType", label: "deviceType", type: "select", required: true,
          options: ["Blóðþrýstingsmælir", "Hjartasláttarmælir", "Súrefnismælir", "Ultrasound", "X-ray", "MRI", "Annað"] },
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "modelNumber", label: "modelNumber", type: "text", placeholder: "Model númer" },
        { name: "certificationRequired", label: "certificationRequired", type: "boolean" },
        { name: "calibrationDate", label: "calibrationDate", type: "text", placeholder: "Síðasta kvörðun" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt ónotað", "Eins og nýtt", "Gott ástand", "Þarfnast viðgerðar"] },
        { name: "yearManufactured", label: "yearManufactured", type: "text", placeholder: "Framleiðsluár" },
        { name: "warrantyIncluded", label: "warrantyIncluded", type: "boolean" }
      ],
      
      // Research Equipment (Rannsóknarfæri)
      "Rannsóknarfæri": [
        { name: "equipmentType", label: "equipmentType", type: "select", required: true,
          options: ["Microscope", "Centrifuge", "Incubator", "Spectrophotometer", "Pipettes", "Annað"] },
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "modelNumber", label: "modelNumber", type: "text", placeholder: "Model númer" },
        { name: "specifications", label: "specifications", type: "text", placeholder: "Tæknilýsing" },
        { name: "calibrationDate", label: "calibrationDate", type: "text", placeholder: "Síðasta kvörðun" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt ónotað", "Eins og nýtt", "Gott ástand", "Þarfnast viðgerðar"] },
        { name: "yearManufactured", label: "yearManufactured", type: "text", placeholder: "Framleiðsluár" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund búnaðar" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Heavy Machinery (Þungavinnuvélar)
    "Þungavinnuvélar": {
      // Excavators (Gröfur)
      "Gröfur": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. Caterpillar, Volvo" },
        { name: "modelNumber", label: "modelNumber", type: "text", required: true, placeholder: "Model" },
        { name: "yearManufactured", label: "yearManufactured", type: "text", required: true, placeholder: "Framleiðsluár" },
        { name: "hoursUsed", label: "hoursUsed", type: "number", placeholder: "Notkunar klukkustundir" },
        { name: "bucketSize", label: "bucketSize", type: "text", placeholder: "Stærð skópu" },
        { name: "enginePower", label: "enginePower", type: "text", placeholder: "Aflgjöf vélar" },
        { name: "weightCapacity", label: "weightCapacity", type: "text", placeholder: "Þyngd/afkastageta" },
        { name: "machineryCondition", label: "machineryCondition", type: "select", required: true,
          options: ["Frábært ástand", "Gott ástand", "Sæmilegt ástand", "Þarfnast viðgerðar", "Til varahluta"] },
        { name: "serviceHistory", label: "serviceHistory", type: "boolean" }
      ],
      
      // Forklifts (Lyftarar)
      "Lyftarar": [
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "modelNumber", label: "modelNumber", type: "text", required: true, placeholder: "Model" },
        { name: "yearManufactured", label: "yearManufactured", type: "text", required: true, placeholder: "Framleiðsluár" },
        { name: "hoursUsed", label: "hoursUsed", type: "number", placeholder: "Notkunar klukkustundir" },
        { name: "liftCapacity", label: "liftCapacity", type: "text", required: true, placeholder: "Lyftugeta" },
        { name: "fuelType", label: "fuelType", type: "select",
          options: ["Rafmagn", "Diesel", "Gas", "Propane", "Annað"] },
        { name: "liftHeight", label: "liftHeight", type: "text", placeholder: "Lyfti hæð" },
        { name: "machineryCondition", label: "machineryCondition", type: "select", required: true,
          options: ["Frábært ástand", "Gott ástand", "Sæmilegt ástand", "Þarfnast viðgerðar", "Til varahluta"] },
        { name: "serviceHistory", label: "serviceHistory", type: "boolean" }
      ],
      
      // Machines (Vélar)
      "Vélar": [
        { name: "machineType", label: "machineType", type: "select", required: true,
          options: ["Bulldozer", "Loader", "Grader", "Compactor", "Crane", "Annað"] },
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "Framleiðandi" },
        { name: "modelNumber", label: "modelNumber", type: "text", placeholder: "Model" },
        { name: "yearManufactured", label: "yearManufactured", type: "text", required: true, placeholder: "Framleiðsluár" },
        { name: "hoursUsed", label: "hoursUsed", type: "number", placeholder: "Notkunar klukkustundir" },
        { name: "enginePower", label: "enginePower", type: "text", placeholder: "Aflgjöf vélar" },
        { name: "machineryCondition", label: "machineryCondition", type: "select", required: true,
          options: ["Frábært ástand", "Gott ástand", "Sæmilegt ástand", "Þarfnast viðgerðar", "Til varahluta"] },
        { name: "serviceHistory", label: "serviceHistory", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund vélar" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "yearManufactured", label: "yearManufactured", type: "text", placeholder: "Framleiðsluár" },
        { name: "machineryCondition", label: "machineryCondition", type: "select", required: true,
          options: ["Frábært ástand", "Gott ástand", "Sæmilegt ástand", "Þarfnast viðgerðar"] }
      ]
    },
    
    // Electrical Equipment (Rafbúnaður)
    "Rafbúnaður": {
      // Cables and Wires (Strengir og kabal)
      "Strengir og kabal": [
        { name: "cableType", label: "cableType", type: "select", required: true,
          options: ["Rafmagnsstrengur", "Network kapal", "Coax kapal", "Fiber optic", "Annað"] },
        { name: "cableLength", label: "cableLength", type: "text", unit: "m", placeholder: "Lengd" },
        { name: "wireGauge", label: "wireGauge", type: "text", placeholder: "Þykkt/gauge" },
        { name: "voltage", label: "voltage", type: "text", placeholder: "Volt" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt ónotað", "Lítið notað", "Gott ástand"] }
      ],
      
      // Switches (Rofa)
      "Rofa": [
        { name: "switchType", label: "switchType", type: "select", required: true,
          options: ["Light switch", "Circuit breaker", "Network switch", "Transfer switch", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "voltage", label: "voltage", type: "text", placeholder: "Volt" },
        { name: "amperage", label: "amperage", type: "text", placeholder: "Amper" },
        { name: "numberOfPorts", label: "numberOfPorts", type: "number", placeholder: "Fjöldi porta" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt ónotað", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Lights (Ljós)
      "Ljós": [
        { name: "lightType", label: "lightType", type: "select", required: true,
          options: ["LED pæra", "Fluorescent", "Halogen", "Industrial ljós", "Utanhúss ljós", "Annað"] },
        { name: "wattage", label: "wattage", type: "number", unit: "W", placeholder: "Vöt" },
        { name: "voltage", label: "voltage", type: "text", placeholder: "Volt" },
        { name: "lumens", label: "lumens", type: "text", placeholder: "Lumens" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt ónotað", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund rafbúnaðar" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Office Equipment (Skrifstofubúnaður)
    "Skrifstofubúnaður": {
      // Printers (Prentarar)
      "Prentarar": [
        { name: "printerType", label: "printerType", type: "select", required: true,
          options: ["Inkjet", "Laser", "All-in-one", "Plotter", "3D prentari", "Annað"] },
        { name: "brand", label: "brand", type: "text", required: true, placeholder: "t.d. HP, Canon, Epson" },
        { name: "modelNumber", label: "modelNumber", type: "text", placeholder: "Model" },
        { name: "colorPrinting", label: "colorPrinting", type: "boolean" },
        { name: "printSpeed", label: "printSpeed", type: "text", placeholder: "Síður á mínútu" },
        { name: "connectivity", label: "connectivity", type: "multiselect",
          options: ["USB", "WiFi", "Ethernet", "Bluetooth"] },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt ónotað", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand", "Þarfnast viðgerðar"] }
      ],
      
      // Paper (Pappír)
      "Pappír": [
        { name: "paperType", label: "paperType", type: "select", required: true,
          options: ["A4 pappír", "A3 pappír", "Letter", "Legal", "Photo paper", "Cardstock", "Annað"] },
        { name: "paperWeight", label: "paperWeight", type: "text", placeholder: "g/m²" },
        { name: "sheetsPerPack", label: "sheetsPerPack", type: "number", placeholder: "Fjöldi blaða" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt óopnað", "Opnað", "Gott ástand"] }
      ],
      
      // Furniture (Húsgögn)
      "Húsgögn": [
        { name: "furnitureType", label: "furnitureType", type: "select", required: true,
          options: ["Skrifborð", "Stóll", "Hillukerfi", "Skápur", "Fundarborð", "Annað"] },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "dimensions", label: "dimensions", type: "text", placeholder: "Stærðir" },
        { name: "materialType", label: "materialType", type: "select",
          options: ["Tré", "Stál", "Gler", "Plast", "Blönduð efni", "Annað"] },
        { name: "ergonomic", label: "ergonomic", type: "boolean" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund búnaðar" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "industrialCondition", label: "industrialCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
      { name: "brand", label: "brand", type: "text" }
    ]
  },
  
  // Tickets & Travel Category
  "Miðar & Ferðalög": {
    // Concert Tickets (Tónleikamiðar)
    "Tónleikamiðar": {
      // Rock and Pop (Rokk og Popp)
      "Rokk og Popp": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "Nafn viðburðar" },
        { name: "artistName", label: "artistName", type: "text", required: true, placeholder: "Nafn listamans" },
        { name: "venueName", label: "venueName", type: "text", required: true, placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "eventTime", label: "eventTime", type: "text", placeholder: "Tími" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "seatSection", label: "seatSection", type: "text", placeholder: "Sæti hluti" },
        { name: "seatNumbers", label: "seatNumbers", type: "text", placeholder: "Sætanúmer" },
        { name: "ticketType", label: "ticketType", type: "select",
          options: ["Almennt", "VIP", "Stæði", "Setuð sæti", "Annað"] },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ],
      
      // Classical (Klassík)
      "Klassík": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "Nafn viðburðar" },
        { name: "artistName", label: "artistName", type: "text", placeholder: "Hljómsveit/Listamenn" },
        { name: "venueName", label: "venueName", type: "text", required: true, placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "eventTime", label: "eventTime", type: "text", placeholder: "Tími" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "seatSection", label: "seatSection", type: "text", placeholder: "Sæti hluti" },
        { name: "seatNumbers", label: "seatNumbers", type: "text", placeholder: "Sætanúmer" },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ],
      
      // Jazz (Jazz)
      "Jazz": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "Nafn viðburðar" },
        { name: "artistName", label: "artistName", type: "text", required: true, placeholder: "Nafn listamans" },
        { name: "venueName", label: "venueName", type: "text", required: true, placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "eventTime", label: "eventTime", type: "text", placeholder: "Tími" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "seatSection", label: "seatSection", type: "text", placeholder: "Sæti hluti" },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "Nafn viðburðar" },
        { name: "venueName", label: "venueName", type: "text", required: true, placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ]
    },
    
    // Sports Tickets (Íþróttamiðar)
    "Íþróttamiðar": {
      // Football (Fótbolti)
      "Fótbolti": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "t.d. ÍBV vs. Valur" },
        { name: "venueName", label: "venueName", type: "text", required: true, placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "eventTime", label: "eventTime", type: "text", placeholder: "Tími" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "seatSection", label: "seatSection", type: "text", placeholder: "Sæti hluti" },
        { name: "seatNumbers", label: "seatNumbers", type: "text", placeholder: "Sætanúmer" },
        { name: "ticketType", label: "ticketType", type: "select",
          options: ["Almennt", "VIP", "Stæði", "Setuð sæti", "Fjölskyldurými", "Annað"] },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ],
      
      // Basketball (Körfubolti)
      "Körfubolti": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "Nafn viðburðar" },
        { name: "venueName", label: "venueName", type: "text", required: true, placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "eventTime", label: "eventTime", type: "text", placeholder: "Tími" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "seatSection", label: "seatSection", type: "text", placeholder: "Sæti hluti" },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ],
      
      // Handball (Handbolti)
      "Handbolti": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "Nafn viðburðar" },
        { name: "venueName", label: "venueName", type: "text", required: true, placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "eventTime", label: "eventTime", type: "text", placeholder: "Tími" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "seatSection", label: "seatSection", type: "text", placeholder: "Sæti hluti" },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "Nafn viðburðar" },
        { name: "venueName", label: "venueName", type: "text", required: true, placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ]
    },
    
    // Event Tickets (Viðburðamiðar)
    "Viðburðamiðar": {
      // Theater (Leikhús)
      "Leikhús": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "Nafn sýningar" },
        { name: "venueName", label: "venueName", type: "text", required: true, placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "eventTime", label: "eventTime", type: "text", placeholder: "Tími" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "seatSection", label: "seatSection", type: "text", placeholder: "Sæti hluti" },
        { name: "seatNumbers", label: "seatNumbers", type: "text", placeholder: "Sætanúmer" },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ],
      
      // Stand-up (Stand-up)
      "Stand-up": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "Nafn sýningar" },
        { name: "artistName", label: "artistName", type: "text", placeholder: "Nafn grínarans" },
        { name: "venueName", label: "venueName", type: "text", required: true, placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "eventTime", label: "eventTime", type: "text", placeholder: "Tími" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ],
      
      // Events (Viðburðir)
      "Viðburðir": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "Nafn viðburðar" },
        { name: "eventType", label: "eventType", type: "select",
          options: ["Ráðstefna", "Sýning", "Festival", "Keppni", "Annað"] },
        { name: "venueName", label: "venueName", type: "text", required: true, placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "eventTime", label: "eventTime", type: "text", placeholder: "Tími" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "eventName", label: "eventName", type: "text", required: true, placeholder: "Nafn viðburðar" },
        { name: "venueName", label: "venueName", type: "text", placeholder: "Staðsetning" },
        { name: "eventDate", label: "eventDate", type: "text", required: true, placeholder: "Dagsetning" },
        { name: "ticketQuantity", label: "ticketQuantity", type: "number", required: true, placeholder: "Fjöldi miða" },
        { name: "electronicTicket", label: "electronicTicket", type: "boolean" }
      ]
    },
    
    // Travel Packages (Ferðapakkar)
    "Ferðapakkar": {
      // Flight and Hotel (Flug og hótel)
      "Flug og hótel": [
        { name: "packageName", label: "packageName", type: "text", required: true, placeholder: "Nafn pakka" },
        { name: "destination", label: "destination", type: "text", required: true, placeholder: "Áfangastaður" },
        { name: "departureCity", label: "departureCity", type: "text", placeholder: "Brottfararstaður" },
        { name: "departureDate", label: "departureDate", type: "text", required: true, placeholder: "Brottfarardagur" },
        { name: "returnDate", label: "returnDate", type: "text", required: true, placeholder: "Heimferðardagur" },
        { name: "numberOfTravelers", label: "numberOfTravelers", type: "number", required: true, placeholder: "Fjöldi ferðalanga" },
        { name: "hotelName", label: "hotelName", type: "text", placeholder: "Nafn hótels" },
        { name: "hotelRating", label: "hotelRating", type: "select",
          options: ["2 stjörnur", "3 stjörnur", "4 stjörnur", "5 stjörnur", "Óskráð"] },
        { name: "roomType", label: "roomType", type: "select",
          options: ["Eins rúms", "Tveggja rúma", "Fjölskylduherbergi", "Suite", "Annað"] },
        { name: "mealsIncluded", label: "mealsIncluded", type: "select",
          options: ["Allt innifalið", "Half-board", "Morgunmatur", "Ekkert", "Annað"] },
        { name: "transferable", label: "transferable", type: "boolean" }
      ],
      
      // Bus Packages (Rútupakkar)
      "Rútupakkar": [
        { name: "packageName", label: "packageName", type: "text", required: true, placeholder: "Nafn pakka" },
        { name: "destination", label: "destination", type: "text", required: true, placeholder: "Áfangastaður" },
        { name: "departureCity", label: "departureCity", type: "text", required: true, placeholder: "Brottfararstaður" },
        { name: "departureDate", label: "departureDate", type: "text", required: true, placeholder: "Brottfarardagur" },
        { name: "returnDate", label: "returnDate", type: "text", placeholder: "Heimferðardagur" },
        { name: "numberOfTravelers", label: "numberOfTravelers", type: "number", required: true, placeholder: "Fjöldi ferðalanga" },
        { name: "tourDuration", label: "tourDuration", type: "text", placeholder: "Lengd ferðar" },
        { name: "transferable", label: "transferable", type: "boolean" }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "packageName", label: "packageName", type: "text", required: true, placeholder: "Nafn pakka" },
        { name: "destination", label: "destination", type: "text", required: true, placeholder: "Áfangastaður" },
        { name: "departureDate", label: "departureDate", type: "text", required: true, placeholder: "Brottfarardagur" },
        { name: "numberOfTravelers", label: "numberOfTravelers", type: "number", required: true, placeholder: "Fjöldi ferðalanga" },
        { name: "transferable", label: "transferable", type: "boolean" }
      ]
    },
    
    // Luggage (Farangur)
    "Farangur": {
      // Travel Bags (Ferðatöskur)
      "Ferðatöskur": [
        { name: "brand", label: "brand", type: "text", placeholder: "t.d. Samsonite, American Tourister" },
        { name: "luggageType", label: "luggageType", type: "select", required: true,
          options: ["Handfarangur", "Innritunarfarangur", "Duffel", "Garment bag", "Annað"] },
        { name: "luggageSize", label: "luggageSize", type: "select",
          options: ["Lítill (under 55cm)", "Miðlungs (56-69cm)", "Stór (70cm+)", "Annað"] },
        { name: "materialType", label: "materialType", type: "select",
          options: ["Hardshell", "Softshell", "Leður", "Nálon", "Annað"] },
        { name: "wheelCount", label: "wheelCount", type: "select",
          options: ["Engin hjól", "2 hjól", "4 hjól (spinner)", "Annað"] },
        { name: "expandable", label: "expandable", type: "boolean" },
        { name: "lockIncluded", label: "lockIncluded", type: "boolean" },
        { name: "luggageCondition", label: "luggageCondition", type: "select", required: true,
          options: ["Nýtt með merkingum", "Nýtt án merkinga", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Backpacks (Bakpokar)
      "Bakpokar": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "backpackType", label: "backpackType", type: "select", required: true,
          options: ["Ferðabakpoki", "Hiking bakpoki", "Dagsferðabakpoki", "Laptop bakpoki", "Annað"] },
        { name: "volumeCapacity", label: "volumeCapacity", type: "text", placeholder: "Rúmmál (lítrar)" },
        { name: "materialType", label: "materialType", type: "select",
          options: ["Nálon", "Polyester", "Canvas", "Annað"] },
        { name: "waterResistant", label: "waterResistant", type: "boolean" },
        { name: "luggageCondition", label: "luggageCondition", type: "select", required: true,
          options: ["Nýtt með merkingum", "Nýtt án merkinga", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Handbags (Handtöskur)
      "Handtöskur": [
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "handbagType", label: "handbagType", type: "select", required: true,
          options: ["Shoulder bag", "Crossbody", "Tote", "Clutch", "Messenger bag", "Annað"] },
        { name: "materialType", label: "materialType", type: "select",
          options: ["Leður", "Synthetic leður", "Canvas", "Nálon", "Annað"] },
        { name: "luggageCondition", label: "luggageCondition", type: "select", required: true,
          options: ["Nýtt með merkingum", "Nýtt án merkinga", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "productType", label: "productType", type: "text", required: true, placeholder: "Tegund farangs" },
        { name: "brand", label: "brand", type: "text", placeholder: "Framleiðandi" },
        { name: "luggageCondition", label: "luggageCondition", type: "select", required: true,
          options: ["Nýtt", "Eins og nýtt", "Gott ástand", "Sæmilegt ástand"] }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
      { name: "brand", label: "brand", type: "text" }
    ]
  },
  
  // Services Category
  "Þjónusta": {
    // Auction Services (Uppboðsþjónusta)
    "Uppboðsþjónusta": {
      // Registration (Skráning)
      "Skráning": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "t.d. 1 klukkustund, 1 dagur" },
        { name: "pricePerItem", label: "pricePerItem", type: "number", placeholder: "Verð per hlut" },
        { name: "minimumOrder", label: "minimumOrder", type: "number", placeholder: "Lágmarks pöntun" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ],
      
      // Photography (Ljósmyndun)
      "Ljósmyndun": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "photographyType", label: "photographyType", type: "select",
          options: ["Vörumyndataka", "Viðburðamyndataka", "Portrett", "Annað"] },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Lengd þjónustu" },
        { name: "photosIncluded", label: "photosIncluded", type: "number", placeholder: "Fjöldi mynda" },
        { name: "editingIncluded", label: "editingIncluded", type: "boolean" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Lengd þjónustu" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ]
    },
    
    // Web & IT Services (Vef & Tölvuþjónusta)
    "Vef & Tölvuþjónusta": {
      // Web Design (Vefhönnun)
      "Vefhönnun": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "websiteType", label: "websiteType", type: "select",
          options: ["Portfolio", "E-commerce", "Blog", "Fyrirtækjavefur", "Landing page", "Annað"] },
        { name: "pagesIncluded", label: "pagesIncluded", type: "number", placeholder: "Fjöldi síðna" },
        { name: "responsiveDesign", label: "responsiveDesign", type: "boolean" },
        { name: "cmsIncluded", label: "cmsIncluded", type: "boolean" },
        { name: "hostingIncluded", label: "hostingIncluded", type: "boolean" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Áætluð tímalengd" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ],
      
      // Programming (Forritun)
      "Forritun": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "programmingLanguages", label: "programmingLanguages", type: "multiselect",
          options: ["JavaScript", "Python", "Java", "C#", "PHP", "Ruby", "Swift", "Kotlin", "Annað"] },
        { name: "projectType", label: "projectType", type: "select",
          options: ["Web app", "Mobile app", "Desktop app", "API", "Database", "Annað"] },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Áætluð tímalengd" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ],
      
      // Computer Repairs (Tölvuviðgerðir)
      "Tölvuviðgerðir": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "repairType", label: "repairType", type: "multiselect",
          options: ["Hardware viðgerð", "Software viðgerð", "Virus fjarlæging", "Data recovery", "Uppfærsla", "Annað"] },
        { name: "deviceTypes", label: "deviceTypes", type: "multiselect",
          options: ["Fartölva", "Borðtölva", "Mac", "PC", "Annað"] },
        { name: "warrantyOffered", label: "warrantyOffered", type: "boolean" },
        { name: "onsiteService", label: "onsiteService", type: "boolean" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Áætluð tímalengd" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Lengd þjónustu" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ]
    },
    
    // Printing (Prentun)
    "Prentun": {
      // Business Cards (Nafnspjöld)
      "Nafnspjöld": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "printQuantity", label: "printQuantity", type: "number", placeholder: "Fjöldi eintaka" },
        { name: "cardStock", label: "cardStock", type: "select",
          options: ["Standard", "Premium", "Glossy", "Matte", "Textured", "Annað"] },
        { name: "printSides", label: "printSides", type: "select",
          options: ["Einhliða", "Tvíhliða"] },
        { name: "designIncluded", label: "designIncluded", type: "boolean" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Afgreiðslutími" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ],
      
      // Labels (Merki)
      "Merki": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "printQuantity", label: "printQuantity", type: "number", placeholder: "Fjöldi merkja" },
        { name: "labelSize", label: "labelSize", type: "text", placeholder: "Stærð merkis" },
        { name: "labelMaterial", label: "labelMaterial", type: "select",
          options: ["Pappír", "Vinyl", "Plast", "Waterproof", "Annað"] },
        { name: "customShape", label: "customShape", type: "boolean" },
        { name: "designIncluded", label: "designIncluded", type: "boolean" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Afgreiðslutími" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "printQuantity", label: "printQuantity", type: "number", placeholder: "Fjöldi eintaka" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Afgreiðslutími" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ]
    },
    
    // Repair Services (Viðgerðarþjónusta)
    "Viðgerðarþjónusta": {
      // Computers (Tölvur)
      "Tölvur": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "repairType", label: "repairType", type: "multiselect",
          options: ["Hardware viðgerð", "Software viðgerð", "Virus fjarlæging", "Data recovery", "Uppfærsla", "Annað"] },
        { name: "warrantyOffered", label: "warrantyOffered", type: "boolean" },
        { name: "onsiteService", label: "onsiteService", type: "boolean" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Áætluð tímalengd" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ],
      
      // Phones (Símar)
      "Símar": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "phoneRepairType", label: "phoneRepairType", type: "multiselect",
          options: ["Skjár viðgerð", "Rafhlöðuskipti", "Charging port", "Camera viðgerð", "Water damage", "Annað"] },
        { name: "phoneBrands", label: "phoneBrands", type: "multiselect",
          options: ["iPhone", "Samsung", "Huawei", "OnePlus", "Google Pixel", "Önnur"] },
        { name: "warrantyOffered", label: "warrantyOffered", type: "boolean" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Áætluð tímalengd" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Áætluð tímalengd" },
        { name: "warrantyOffered", label: "warrantyOffered", type: "boolean" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ]
    },
    
    // Art Services (Listaþjónusta)
    "Listaþjónusta": {
      // Photography (Ljósmyndun)
      "Ljósmyndun": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "photographyType", label: "photographyType", type: "select",
          options: ["Brúðkaup", "Portrett", "Viðburðir", "Vörumyndataka", "Fasteignir", "Annað"] },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Lengd þjónustu" },
        { name: "photosIncluded", label: "photosIncluded", type: "number", placeholder: "Fjöldi mynda" },
        { name: "editingIncluded", label: "editingIncluded", type: "boolean" },
        { name: "printsIncluded", label: "printsIncluded", type: "boolean" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ],
      
      // Design (Hönnun)
      "Hönnun": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "designType", label: "designType", type: "multiselect",
          options: ["Logo hönnun", "Vörumerki", "Prentmiðlar", "Samfélagsmiðlar", "UI/UX", "Annað"] },
        { name: "revisionsIncluded", label: "revisionsIncluded", type: "number", placeholder: "Fjöldi endurskoðana" },
        { name: "fileFormats", label: "fileFormats", type: "multiselect",
          options: ["AI", "PSD", "PDF", "PNG", "JPG", "SVG", "Annað"] },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Áætluð tímalengd" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ],
      
      // Other (Annað)
      "Annað": [
        { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
        { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" },
        { name: "serviceDuration", label: "serviceDuration", type: "text", placeholder: "Lengd þjónustu" },
        { name: "serviceAvailability", label: "serviceAvailability", type: "select",
          options: ["Tiltækt strax", "Innan viku", "Innan mánaðar", "Samkomulag"] }
      ]
    },
    
    // Other (Annað)
    "Annað": [
      { name: "serviceName", label: "serviceName", type: "text", required: true, placeholder: "Nafn þjónustu" },
      { name: "serviceDescription", label: "serviceDescription", type: "text", required: true, placeholder: "Lýsing á þjónustu" }
    ]
  },
  
  // Other Category (catch-all)
  "Annað": {
    "Annað": [
      { name: "productType", label: "productType", type: "text", placeholder: "Tegund vöru" },
      { name: "brand", label: "brand", type: "text" },
      { name: "description", label: "description", type: "text", placeholder: "Lýsing" }
    ]
  }
}

// Helper function to get fields for a specific category/subcategory/sub-subcategory
export function getCategoryFields(category: string, subcategory?: string, subSubcategory?: string): CategoryField[] {
  if (!categoryFields[category] || !subcategory) {
    return []
  }
  
  const subcatFields = categoryFields[category][subcategory]
  if (!subcatFields) {
    return []
  }
  
  // Check if this subcategory has sub-subcategory-specific fields
  if (hasSubSubcategoryFields(subcatFields)) {
    // If we have a sub-subcategory specified, return its fields
    if (subSubcategory && subcatFields[subSubcategory]) {
      return subcatFields[subSubcategory]
    }
    // Otherwise return empty (user needs to select sub-subcategory first)
    return []
  }
  
  // It's a flat field array (no sub-subcategories)
  return subcatFields
}

// Helper function to find a field definition by name across all subcategories in a category
export function findCategoryField(category: string, fieldName: string): CategoryField | undefined {
  if (!categoryFields[category]) {
    return undefined
  }
  
  // Search through all subcategories
  for (const subcategory in categoryFields[category]) {
    const subcatFields = categoryFields[category][subcategory]
    
    // Handle both nested and flat structures
    if (hasSubSubcategoryFields(subcatFields)) {
      // Search through sub-subcategories
      for (const subSubcat in subcatFields) {
        const fields = subcatFields[subSubcat]
        const field = fields.find((f: CategoryField) => f.name === fieldName)
        if (field) {
          return field
        }
      }
    } else {
      // Search in flat array
      const field = subcatFields.find((f: CategoryField) => f.name === fieldName)
      if (field) {
        return field
      }
    }
  }
  
  return undefined
}
