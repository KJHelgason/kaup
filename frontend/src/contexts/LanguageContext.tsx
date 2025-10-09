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
  itemsSold: { is: 'vörur seldar', en: 'items sold' },
  positiveFeedback: { is: 'jákvæð umsögn', en: 'positive feedback' },
  share: { is: 'Deila', en: 'Share' },
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
  browseAllListings: { is: 'Skoða allar auglýsingar', en: 'Browse All Listings' },
  
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
