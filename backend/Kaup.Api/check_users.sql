CREATE TABLE "Users" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Users" PRIMARY KEY,
    "Username" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "PhoneNumber" TEXT NULL,
    "ProfileImageUrl" TEXT NULL,
    "GoogleId" TEXT NULL,
    "AuthProvider" TEXT NULL,
    "Bio" TEXT NULL,
    "Address" TEXT NULL,
    "City" TEXT NULL,
    "PostalCode" TEXT NULL,
    "AverageRating" REAL NOT NULL,
    "TotalRatings" INTEGER NOT NULL,
    "TotalSales" INTEGER NOT NULL,
    "IsAdmin" INTEGER NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NULL
);


CREATE TABLE "Listings" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Listings" PRIMARY KEY,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Price" decimal(18,2) NOT NULL,
    "BuyNowPrice" decimal(18,2) NULL,
    "Category" TEXT NOT NULL,
    "Condition" TEXT NOT NULL,
    "ImageUrls" TEXT NOT NULL,
    "ListingType" INTEGER NOT NULL,
    "Status" INTEGER NOT NULL,
    "IsFeatured" INTEGER NOT NULL,
    "AcceptOffers" INTEGER NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "EndDate" TEXT NULL,
    "UpdatedAt" TEXT NULL,
    "SellerId" TEXT NOT NULL,
    CONSTRAINT "FK_Listings_Users_SellerId" FOREIGN KEY ("SellerId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);


CREATE TABLE "Notifications" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Notifications" PRIMARY KEY,
    "UserId" TEXT NOT NULL,
    "Type" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "Message" TEXT NOT NULL,
    "LinkUrl" TEXT NULL,
    "RelatedEntityId" TEXT NULL,
    "IsRead" INTEGER NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    CONSTRAINT "FK_Notifications_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);


CREATE TABLE "Bids" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Bids" PRIMARY KEY,
    "Amount" decimal(18,2) NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "ListingId" TEXT NOT NULL,
    "BidderId" TEXT NOT NULL,
    CONSTRAINT "FK_Bids_Listings_ListingId" FOREIGN KEY ("ListingId") REFERENCES "Listings" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Bids_Users_BidderId" FOREIGN KEY ("BidderId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);


CREATE TABLE "CartItems" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_CartItems" PRIMARY KEY,
    "CreatedAt" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "ListingId" TEXT NOT NULL,
    CONSTRAINT "FK_CartItems_Listings_ListingId" FOREIGN KEY ("ListingId") REFERENCES "Listings" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_CartItems_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);


CREATE TABLE "Messages" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Messages" PRIMARY KEY,
    "Content" TEXT NOT NULL,
    "IsRead" INTEGER NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "SenderId" TEXT NOT NULL,
    "ReceiverId" TEXT NOT NULL,
    "ListingId" TEXT NULL,
    CONSTRAINT "FK_Messages_Listings_ListingId" FOREIGN KEY ("ListingId") REFERENCES "Listings" ("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_Messages_Users_ReceiverId" FOREIGN KEY ("ReceiverId") REFERENCES "Users" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Messages_Users_SenderId" FOREIGN KEY ("SenderId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);


CREATE TABLE "Offers" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Offers" PRIMARY KEY,
    "ListingId" TEXT NOT NULL,
    "BuyerId" TEXT NOT NULL,
    "SellerId" TEXT NOT NULL,
    "Amount" decimal(18,2) NOT NULL,
    "Message" TEXT NULL,
    "Status" INTEGER NOT NULL,
    "ParentOfferId" TEXT NULL,
    "ExpiresAt" TEXT NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "RespondedAt" TEXT NULL,
    CONSTRAINT "FK_Offers_Listings_ListingId" FOREIGN KEY ("ListingId") REFERENCES "Listings" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Offers_Offers_ParentOfferId" FOREIGN KEY ("ParentOfferId") REFERENCES "Offers" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Offers_Users_BuyerId" FOREIGN KEY ("BuyerId") REFERENCES "Users" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Offers_Users_SellerId" FOREIGN KEY ("SellerId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);


CREATE TABLE "Reviews" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Reviews" PRIMARY KEY,
    "Rating" INTEGER NOT NULL,
    "Comment" TEXT NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "ReviewerId" TEXT NOT NULL,
    "ReviewedUserId" TEXT NOT NULL,
    "ListingId" TEXT NULL,
    CONSTRAINT "FK_Reviews_Listings_ListingId" FOREIGN KEY ("ListingId") REFERENCES "Listings" ("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_Reviews_Users_ReviewedUserId" FOREIGN KEY ("ReviewedUserId") REFERENCES "Users" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Reviews_Users_ReviewerId" FOREIGN KEY ("ReviewerId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);


CREATE TABLE "Watchlists" (
    "Id" TEXT NOT NULL CONSTRAINT "PK_Watchlists" PRIMARY KEY,
    "UserId" TEXT NOT NULL,
    "ListingId" TEXT NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    CONSTRAINT "FK_Watchlists_Listings_ListingId" FOREIGN KEY ("ListingId") REFERENCES "Listings" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Watchlists_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);


CREATE INDEX "IX_Bids_BidderId" ON "Bids" ("BidderId");


CREATE INDEX "IX_Bids_ListingId" ON "Bids" ("ListingId");


CREATE INDEX "IX_CartItems_CreatedAt" ON "CartItems" ("CreatedAt");


CREATE INDEX "IX_CartItems_ListingId" ON "CartItems" ("ListingId");


CREATE UNIQUE INDEX "IX_CartItems_UserId_ListingId" ON "CartItems" ("UserId", "ListingId");


CREATE INDEX "IX_Listings_SellerId" ON "Listings" ("SellerId");


CREATE INDEX "IX_Messages_ListingId" ON "Messages" ("ListingId");


CREATE INDEX "IX_Messages_ReceiverId" ON "Messages" ("ReceiverId");


CREATE INDEX "IX_Messages_SenderId" ON "Messages" ("SenderId");


CREATE INDEX "IX_Notifications_CreatedAt" ON "Notifications" ("CreatedAt");


CREATE INDEX "IX_Notifications_UserId_IsRead" ON "Notifications" ("UserId", "IsRead");


CREATE INDEX "IX_Offers_BuyerId" ON "Offers" ("BuyerId");


CREATE INDEX "IX_Offers_ListingId" ON "Offers" ("ListingId");


CREATE INDEX "IX_Offers_ParentOfferId" ON "Offers" ("ParentOfferId");


CREATE INDEX "IX_Offers_SellerId" ON "Offers" ("SellerId");


CREATE INDEX "IX_Reviews_ListingId" ON "Reviews" ("ListingId");


CREATE INDEX "IX_Reviews_ReviewedUserId" ON "Reviews" ("ReviewedUserId");


CREATE INDEX "IX_Reviews_ReviewerId" ON "Reviews" ("ReviewerId");


CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");


CREATE INDEX "IX_Watchlists_CreatedAt" ON "Watchlists" ("CreatedAt");


CREATE INDEX "IX_Watchlists_ListingId" ON "Watchlists" ("ListingId");


CREATE UNIQUE INDEX "IX_Watchlists_UserId_ListingId" ON "Watchlists" ("UserId", "ListingId");


