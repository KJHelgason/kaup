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
function hasSubSubcategoryFields(fields: any): fields is { [subSubcategoryValue: string]: CategoryField[] } {
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
    "Símar og spjaldtölvur": [
      // Device Type
      {
        name: "deviceType",
        label: "deviceType",
        type: "select",
        required: true,
        options: ["Snjallsími", "Spjaldtölva", "Annað"]
      },
      
      // Brand
      {
        name: "brand",
        label: "brand",
        type: "select",
        required: true,
        options: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Huawei", "Nokia", "Motorola", "Annað"]
      },
      
      // Model
      {
        name: "model",
        label: "model",
        type: "text",
        required: false,
        placeholder: "t.d. iPhone 15 Pro, Galaxy S24"
      },
      
      // Storage Capacity
      {
        name: "storageCapacity",
        label: "storageCapacity",
        type: "select",
        required: false,
        options: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "Annað"]
      },
      
      // RAM
      {
        name: "ramSize",
        label: "ramSize",
        type: "select",
        required: false,
        options: ["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB", "Annað"]
      },
      
      // Screen Size
      {
        name: "screenSize",
        label: "screenSize",
        type: "text",
        required: false,
        unit: "in",
        placeholder: "t.d. 6.1"
      },
      
      // Operating System
      {
        name: "operatingSystem",
        label: "operatingSystem",
        type: "select",
        required: false,
        options: ["iOS", "Android", "Annað"]
      },
      
      // Color
      {
        name: "color",
        label: "color",
        type: "select",
        required: false,
        options: ["Svart", "Hvítt", "Silfur", "Gull", "Blátt", "Grænt", "Bleikt", "Rautt", "Fjólublátt", "Annað"]
      },
      
      // Battery Health (for phones)
      {
        name: "batteryHealth",
        label: "batteryHealth",
        type: "number",
        required: false,
        unit: "%",
        placeholder: "t.d. 85"
      },
      
      // Network
      {
        name: "network",
        label: "network",
        type: "select",
        required: false,
        options: ["5G", "4G LTE", "3G", "Wi-Fi Only", "Annað"]
      },
      
      // SIM Card Type
      {
        name: "simType",
        label: "simType",
        type: "select",
        required: false,
        options: ["Nano SIM", "eSIM", "Dual SIM", "Annað"]
      },
      
      // Carrier Lock
      {
        name: "carrierLock",
        label: "carrierLock",
        type: "select",
        required: false,
        options: ["Ólæst", "Læst (tilgreindu í lýsingu)", "Veit ekki"]
      }
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
