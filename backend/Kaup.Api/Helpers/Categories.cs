// DEPRECATED: This hardcoded category list is being replaced by the Category database table.
// It is kept temporarily for backward compatibility during the migration to PostgreSQL.
// TODO: Remove this file once categories are seeded in the database and all references are updated.

namespace Kaup.Api.Helpers;

public class CategoryInfo
{
    public string Icelandic { get; set; } = "";
    public string English { get; set; } = "";
}

public static class Categories
{
    public static readonly Dictionary<string, CategoryInfo> AllCategories = new Dictionary<string, CategoryInfo>
    {
        ["Rafeindatækni"] = new CategoryInfo { Icelandic = "Rafeindatækni", English = "Electronics" },
        ["Tíska"] = new CategoryInfo { Icelandic = "Tíska", English = "Fashion" },
        ["Ökutæki"] = new CategoryInfo { Icelandic = "Ökutæki", English = "Vehicles" },
        ["Heimili & Garður"] = new CategoryInfo { Icelandic = "Heimili & Garður", English = "Home & Garden" },
        ["Íþróttir"] = new CategoryInfo { Icelandic = "Íþróttir", English = "Sports" },
        ["Tómstundir"] = new CategoryInfo { Icelandic = "Tómstundir", English = "Hobbies" },
        ["Barnið"] = new CategoryInfo { Icelandic = "Barnið", English = "Baby" },
        ["Gæludýr"] = new CategoryInfo { Icelandic = "Gæludýr", English = "Pets" },
        ["Annað"] = new CategoryInfo { Icelandic = "Annað", English = "Other" }
    };

    public static readonly Dictionary<string, Dictionary<string, CategoryInfo>> Subcategories = new Dictionary<string, Dictionary<string, CategoryInfo>>
    {
        ["Rafeindatækni"] = new Dictionary<string, CategoryInfo>
        {
            ["Símar og spjaldtölvur"] = new CategoryInfo { Icelandic = "Símar og spjaldtölvur", English = "Phones & Tablets" },
            ["Tölvur"] = new CategoryInfo { Icelandic = "Tölvur", English = "Computers" },
            ["Myndavélar"] = new CategoryInfo { Icelandic = "Myndavélar", English = "Cameras" },
            ["Hljóðbúnaður"] = new CategoryInfo { Icelandic = "Hljóðbúnaður", English = "Audio" },
            ["Tölvuleikir & Leikjatölvur"] = new CategoryInfo { Icelandic = "Tölvuleikir & Leikjatölvur", English = "Gaming" },
            ["Annað"] = new CategoryInfo { Icelandic = "Annað", English = "Other" }
        },
        ["Tíska"] = new Dictionary<string, CategoryInfo>
        {
            ["Föt - Karlar"] = new CategoryInfo { Icelandic = "Föt - Karlar", English = "Men's Clothing" },
            ["Föt - Konur"] = new CategoryInfo { Icelandic = "Föt - Konur", English = "Women's Clothing" },
            ["Föt - Börn"] = new CategoryInfo { Icelandic = "Föt - Börn", English = "Kids Clothing" },
            ["Skór"] = new CategoryInfo { Icelandic = "Skór", English = "Shoes" },
            ["Fylgihlutir"] = new CategoryInfo { Icelandic = "Fylgihlutir", English = "Accessories" },
            ["Annað"] = new CategoryInfo { Icelandic = "Annað", English = "Other" }
        },
        ["Ökutæki"] = new Dictionary<string, CategoryInfo>
        {
            ["Bifreiðar"] = new CategoryInfo { Icelandic = "Bifreiðar", English = "Cars" },
            ["Bifhjól"] = new CategoryInfo { Icelandic = "Bifhjól", English = "Motorcycles" },
            ["Hjólhýsi & Fellihýsi"] = new CategoryInfo { Icelandic = "Hjólhýsi & Fellihýsi", English = "RVs & Trailers" },
            ["Bátar"] = new CategoryInfo { Icelandic = "Bátar", English = "Boats" },
            ["Hjól"] = new CategoryInfo { Icelandic = "Hjól", English = "Bicycles" },
            ["Varahlutir"] = new CategoryInfo { Icelandic = "Varahlutir", English = "Parts" },
            ["Annað"] = new CategoryInfo { Icelandic = "Annað", English = "Other" }
        },
        ["Heimili & Garður"] = new Dictionary<string, CategoryInfo>
        {
            ["Húsgögn"] = new CategoryInfo { Icelandic = "Húsgögn", English = "Furniture" },
            ["Heimilistæki"] = new CategoryInfo { Icelandic = "Heimilistæki", English = "Appliances" },
            ["Verkfæri"] = new CategoryInfo { Icelandic = "Verkfæri", English = "Tools" },
            ["Garðurinn"] = new CategoryInfo { Icelandic = "Garðurinn", English = "Garden" },
            ["Annað"] = new CategoryInfo { Icelandic = "Annað", English = "Other" }
        },
        ["Íþróttir"] = new Dictionary<string, CategoryInfo>
        {
            ["Boltar"] = new CategoryInfo { Icelandic = "Boltar", English = "Ball Sports" },
            ["Líkamsrækt"] = new CategoryInfo { Icelandic = "Líkamsrækt", English = "Fitness" },
            ["Útivist"] = new CategoryInfo { Icelandic = "Útivist", English = "Outdoor" },
            ["Vetraríþróttir"] = new CategoryInfo { Icelandic = "Vetraríþróttir", English = "Winter Sports" },
            ["Annað"] = new CategoryInfo { Icelandic = "Annað", English = "Other" }
        },
        ["Tómstundir"] = new Dictionary<string, CategoryInfo>
        {
            ["Bækur"] = new CategoryInfo { Icelandic = "Bækur", English = "Books" },
            ["Tónlist"] = new CategoryInfo { Icelandic = "Tónlist", English = "Music" },
            ["Kvikmyndir & Sjónvarp"] = new CategoryInfo { Icelandic = "Kvikmyndir & Sjónvarp", English = "Movies & TV" },
            ["Safngripir"] = new CategoryInfo { Icelandic = "Safngripir", English = "Collectibles" },
            ["Annað"] = new CategoryInfo { Icelandic = "Annað", English = "Other" }
        },
        ["Barnið"] = new Dictionary<string, CategoryInfo>
        {
            ["Leikföng"] = new CategoryInfo { Icelandic = "Leikföng", English = "Toys" },
            ["Barnabækur"] = new CategoryInfo { Icelandic = "Barnabækur", English = "Children's Books" },
            ["Barnavörur"] = new CategoryInfo { Icelandic = "Barnavörur", English = "Baby Products" },
            ["Barnafatnaður"] = new CategoryInfo { Icelandic = "Barnafatnaður", English = "Children's Clothing" },
            ["Annað"] = new CategoryInfo { Icelandic = "Annað", English = "Other" }
        },
        ["Gæludýr"] = new Dictionary<string, CategoryInfo>
        {
            ["Hundar"] = new CategoryInfo { Icelandic = "Hundar", English = "Dogs" },
            ["Kettir"] = new CategoryInfo { Icelandic = "Kettir", English = "Cats" },
            ["Fuglar"] = new CategoryInfo { Icelandic = "Fuglar", English = "Birds" },
            ["Önnur gæludýr"] = new CategoryInfo { Icelandic = "Önnur gæludýr", English = "Other Pets" },
            ["Annað"] = new CategoryInfo { Icelandic = "Annað", English = "Other" }
        },
        ["Annað"] = new Dictionary<string, CategoryInfo>
        {
            ["Annað"] = new CategoryInfo { Icelandic = "Annað", English = "Other" }
        }
    };

    public static List<(string category, string? subcategory, string? subSubcategory)> SearchCategories(string query)
    {
        var results = new List<(string, string?, string?)>();
        var lowerQuery = query.ToLower();

        foreach (var category in AllCategories)
        {
            // Check if category matches in either language
            if (category.Value.Icelandic.ToLower().Contains(lowerQuery) || 
                category.Value.English.ToLower().Contains(lowerQuery))
            {
                results.Add((category.Key, null, null));
            }

            // Check subcategories in both languages
            if (Subcategories.TryGetValue(category.Key, out var subs))
            {
                foreach (var subcategory in subs)
                {
                    if (subcategory.Value.Icelandic.ToLower().Contains(lowerQuery) ||
                        subcategory.Value.English.ToLower().Contains(lowerQuery))
                    {
                        results.Add((category.Key, subcategory.Key, null));
                    }
                }
            }
        }

        return results;
    }

    // Helper to check if two category names match (considering both Icelandic and English)
    public static bool CategoriesMatch(string? cat1, string? cat2)
    {
        if (string.IsNullOrEmpty(cat1) && string.IsNullOrEmpty(cat2))
            return true;
        
        if (string.IsNullOrEmpty(cat1) || string.IsNullOrEmpty(cat2))
            return false;

        // Direct match
        if (cat1.Equals(cat2, StringComparison.OrdinalIgnoreCase))
            return true;

        // Check if cat1 is English and cat2 is Icelandic or vice versa
        foreach (var category in AllCategories)
        {
            if ((category.Value.Icelandic.Equals(cat1, StringComparison.OrdinalIgnoreCase) && 
                 category.Value.English.Equals(cat2, StringComparison.OrdinalIgnoreCase)) ||
                (category.Value.English.Equals(cat1, StringComparison.OrdinalIgnoreCase) && 
                 category.Value.Icelandic.Equals(cat2, StringComparison.OrdinalIgnoreCase)))
            {
                return true;
            }
        }

        // Check subcategories
        foreach (var categoryGroup in Subcategories.Values)
        {
            foreach (var subcategory in categoryGroup)
            {
                if ((subcategory.Value.Icelandic.Equals(cat1, StringComparison.OrdinalIgnoreCase) && 
                     subcategory.Value.English.Equals(cat2, StringComparison.OrdinalIgnoreCase)) ||
                    (subcategory.Value.English.Equals(cat1, StringComparison.OrdinalIgnoreCase) && 
                     subcategory.Value.Icelandic.Equals(cat2, StringComparison.OrdinalIgnoreCase)))
                {
                    return true;
                }
            }
        }

        return false;
    }

    // Get the Icelandic name for a category (normalize from English if needed)
    public static string NormalizeToIcelandic(string categoryName)
    {
        if (string.IsNullOrEmpty(categoryName))
            return categoryName;

        // Check main categories
        foreach (var category in AllCategories)
        {
            if (category.Value.English.Equals(categoryName, StringComparison.OrdinalIgnoreCase))
                return category.Key;
            if (category.Value.Icelandic.Equals(categoryName, StringComparison.OrdinalIgnoreCase))
                return category.Key;
        }

        // Check subcategories
        foreach (var categoryGroup in Subcategories.Values)
        {
            foreach (var subcategory in categoryGroup)
            {
                if (subcategory.Value.English.Equals(categoryName, StringComparison.OrdinalIgnoreCase))
                    return subcategory.Key;
                if (subcategory.Value.Icelandic.Equals(categoryName, StringComparison.OrdinalIgnoreCase))
                    return subcategory.Key;
            }
        }

        // Return original if no match found
        return categoryName;
    }
}
