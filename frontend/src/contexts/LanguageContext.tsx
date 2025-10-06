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
  
  // Category keys (mapping from API values)
  'Rafeindatækni': { is: 'Rafeindatækni', en: 'Electronics' },
  'Tíska': { is: 'Tíska', en: 'Fashion' },
  'Heimili': { is: 'Heimili', en: 'Home' },
  'Íþróttir': { is: 'Íþróttir', en: 'Sports' },
  'Farartæki': { is: 'Farartæki', en: 'Vehicles' },
  'Bækur': { is: 'Bækur', en: 'Books' },
  'Leikföng': { is: 'Leikföng', en: 'Toys' },
  'Garður': { is: 'Garður', en: 'Garden' },
  'Annað': { is: 'Annað', en: 'Other' },
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
  profileInformation: { is: 'Prófílupplýsingar', en: 'Profile Information' },
  updateProfileDescription: { is: 'Uppfærðu prófílinn þinn', en: 'Update your profile information' },
  bio: { is: 'Um mig', en: 'Bio' },
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
  characters: { is: 'stafir', en: 'characters' },
  selectCategory: { is: 'Veldu flokk', en: 'Select category' },
  selectCondition: { is: 'Veldu ástand', en: 'Select condition' },
  conditionNew: { is: 'Nýtt', en: 'New' },
  conditionLikeNew: { is: 'Eins og nýtt', en: 'Like New' },
  conditionGood: { is: 'Gott', en: 'Good' },
  conditionFair: { is: 'Ásættanlegt', en: 'Fair' },
  conditionPoor: { is: 'Slæmt', en: 'Poor' },
  listingType: { is: 'Tegund sölu', en: 'Listing Type' },
  auction: { is: 'Uppboð', en: 'Auction' },
  buyNowOnly: { is: 'Kaupa núna', en: 'Buy Now' },
  startingPrice: { is: 'Upphafsverð', en: 'Starting Price' },
  buyNowPrice: { is: 'Kaupa núna verð', en: 'Buy Now Price' },
  optional: { is: 'valkvætt', en: 'optional' },
  buyNowPriceHelp: { is: 'Kaupendur geta keypt vöruna strax fyrir þetta verð', en: 'Buyers can purchase the item immediately at this price' },
  endDate: { is: 'Lokadagsetning', en: 'End Date' },
  endDateHelp: { is: 'Hvenær á uppboðinu að ljúka', en: 'When should the auction end' },
  endDateRequired: { is: 'Lokadagsetning er nauðsynleg fyrir uppboð', en: 'End date is required for auctions' },
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
  listingNotFoundDescription: { is: 'Varan sem þú leitaðir að er ekki til', en: 'The listing you are looking for does not exist' },
  seller: { is: 'Seljandi', en: 'Seller' },
  listed: { is: 'Skráð', en: 'Listed' },
  currentBid: { is: 'Núverandi boð', en: 'Current Bid' },
  noBids: { is: 'Engin boð', en: 'No bids' },
  totalBids: { is: 'Fjöldi boða', en: 'Total Bids' },
  endsOn: { is: 'Lýkur', en: 'Ends On' },
  
  // Common
  loading: { is: 'Hleður...', en: 'Loading...' },
  noResults: { is: 'Engar vörur fundust', en: 'No items found' },
  currency: { is: 'kr', en: 'ISK' },
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
