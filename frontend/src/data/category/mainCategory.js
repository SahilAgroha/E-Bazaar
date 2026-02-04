export const mainCategory = [
  {
    name: "Men",
    categoryId: "men",
    level: 1,
    levelTwoCategory: [
      {
        name: "Topwear",
        categoryId: "men_topwear",
        parentCategoryId: "men",
        level: 2,
        levelThreeCategory: [
          { name: "T-Shirts", categoryId: "men_topwear_tshirts", parentCategoryId: "men_topwear", level: 3 },
          { name: "Shirts", categoryId: "men_topwear_shirts", parentCategoryId: "men_topwear", level: 3 },
          { name: "Jackets", categoryId: "men_topwear_jackets", parentCategoryId: "men_topwear", level: 3 },
          { name: "Sweatshirts", categoryId: "men_topwear_sweatshirts", parentCategoryId: "men_topwear", level: 3 },
          { name: "Kurtas", categoryId: "men_topwear_kurtas", parentCategoryId: "men_topwear", level: 3 }
        ]
      },
      {
        name: "Bottomwear",
        categoryId: "men_bottomwear",
        parentCategoryId: "men",
        level: 2,
        levelThreeCategory: [
          { name: "Jeans", categoryId: "men_bottomwear_jeans", parentCategoryId: "men_bottomwear", level: 3 },
          { name: "Trousers", categoryId: "men_bottomwear_trousers", parentCategoryId: "men_bottomwear", level: 3 },
          { name: "Shorts", categoryId: "men_bottomwear_shorts", parentCategoryId: "men_bottomwear", level: 3 },
          { name: "Track Pants", categoryId: "men_bottomwear_trackpants", parentCategoryId: "men_bottomwear", level: 3 },
          { name: "Cargos", categoryId: "men_bottomwear_cargos", parentCategoryId: "men_bottomwear", level: 3 }
        ]
      },
      {
        name: "Footwear",
        categoryId: "men_footwear",
        parentCategoryId: "men",
        level: 2,
        levelThreeCategory: [
          { name: "Casual Shoes", categoryId: "men_footwear_casual", parentCategoryId: "men_footwear", level: 3 },
          { name: "Formal Shoes", categoryId: "men_footwear_formal", parentCategoryId: "men_footwear", level: 3 },
          { name: "Sneakers", categoryId: "men_footwear_sneakers", parentCategoryId: "men_footwear", level: 3 },
          { name: "Sandals", categoryId: "men_footwear_sandals", parentCategoryId: "men_footwear", level: 3 },
          { name: "Slippers", categoryId: "men_footwear_slippers", parentCategoryId: "men_footwear", level: 3 }
        ]
      },
      {
        name: "Accessories",
        categoryId: "men_accessories",
        parentCategoryId: "men",
        level: 2,
        levelThreeCategory: [
          { name: "Wallets", categoryId: "men_accessories_wallets", parentCategoryId: "men_accessories", level: 3 },
          { name: "Belts", categoryId: "men_accessories_belts", parentCategoryId: "men_accessories", level: 3 },
          { name: "Watches", categoryId: "men_accessories_watches", parentCategoryId: "men_accessories", level: 3 },
          { name: "Sunglasses", categoryId: "men_accessories_sunglasses", parentCategoryId: "men_accessories", level: 3 },
          { name: "Caps & Hats", categoryId: "men_accessories_caps", parentCategoryId: "men_accessories", level: 3 }
        ]
      },
      {
        name: "Sportswear",
        categoryId: "men_sportswear",
        parentCategoryId: "men",
        level: 2,
        levelThreeCategory: [
          { name: "Track Suits", categoryId: "men_sportswear_tracksuits", parentCategoryId: "men_sportswear", level: 3 },
          { name: "Sports T-Shirts", categoryId: "men_sportswear_tshirts", parentCategoryId: "men_sportswear", level: 3 },
          { name: "Shorts", categoryId: "men_sportswear_shorts", parentCategoryId: "men_sportswear", level: 3 },
          { name: "Sweatshirts", categoryId: "men_sportswear_sweatshirts", parentCategoryId: "men_sportswear", level: 3 },
          { name: "Jackets", categoryId: "men_sportswear_jackets", parentCategoryId: "men_sportswear", level: 3 }
        ]
      }
    ]
  },
  {
    name: "Women",
    categoryId: "women",
    level: 1,
    levelTwoCategory: [
      {
        name: "Ethnic Wear",
        categoryId: "women_ethnic",
        parentCategoryId: "women",
        level: 2,
        levelThreeCategory: [
          { name: "Sarees", categoryId: "women_ethnic_sarees", parentCategoryId: "women_ethnic", level: 3 },
          { name: "Kurtis", categoryId: "women_ethnic_kurtis", parentCategoryId: "women_ethnic", level: 3 },
          { name: "Salwar Suits", categoryId: "women_ethnic_salwar", parentCategoryId: "women_ethnic", level: 3 },
          { name: "Lehengas", categoryId: "women_ethnic_lehengas", parentCategoryId: "women_ethnic", level: 3 },
          { name: "Blouses", categoryId: "women_ethnic_blouses", parentCategoryId: "women_ethnic", level: 3 }
        ]
      },
      {
        name: "Western Wear",
        categoryId: "women_western",
        parentCategoryId: "women",
        level: 2,
        levelThreeCategory: [
          { name: "Tops", categoryId: "women_western_tops", parentCategoryId: "women_western", level: 3 },
          { name: "Dresses", categoryId: "women_western_dresses", parentCategoryId: "women_western", level: 3 },
          { name: "Jeans", categoryId: "women_western_jeans", parentCategoryId: "women_western", level: 3 },
          { name: "Skirts", categoryId: "women_western_skirts", parentCategoryId: "women_western", level: 3 },
          { name: "Jackets", categoryId: "women_western_jackets", parentCategoryId: "women_western", level: 3 }
        ]
      },
      {
        name: "Footwear",
        categoryId: "women_footwear",
        parentCategoryId: "women",
        level: 2,
        levelThreeCategory: [
          { name: "Heels", categoryId: "women_footwear_heels", parentCategoryId: "women_footwear", level: 3 },
          { name: "Flats", categoryId: "women_footwear_flats", parentCategoryId: "women_footwear", level: 3 },
          { name: "Sneakers", categoryId: "women_footwear_sneakers", parentCategoryId: "women_footwear", level: 3 },
          { name: "Sandals", categoryId: "women_footwear_sandals", parentCategoryId: "women_footwear", level: 3 },
          { name: "Boots", categoryId: "women_footwear_boots", parentCategoryId: "women_footwear", level: 3 }
        ]
      },
      {
        name: "Jewellery",
        categoryId: "women_jewellery",
        parentCategoryId: "women",
        level: 2,
        levelThreeCategory: [
          { name: "Earrings", categoryId: "women_jewellery_earrings", parentCategoryId: "women_jewellery", level: 3 },
          { name: "Necklaces", categoryId: "women_jewellery_necklaces", parentCategoryId: "women_jewellery", level: 3 },
          { name: "Bracelets", categoryId: "women_jewellery_bracelets", parentCategoryId: "women_jewellery", level: 3 },
          { name: "Rings", categoryId: "women_jewellery_rings", parentCategoryId: "women_jewellery", level: 3 },
          { name: "Bangles", categoryId: "women_jewellery_bangles", parentCategoryId: "women_jewellery", level: 3 }
        ]
      }
    ]
  },
  {
    name: "Home & Furniture",
    categoryId: "home_furniture",
    level: 1,
    levelTwoCategory: [
      {
        name: "Kitchen & Dining",
        categoryId: "home_kitchen_dining",
        parentCategoryId: "home_furniture",
        level: 2,
        levelThreeCategory: [
          { name: "Cookware", categoryId: "home_kitchen_cookware", parentCategoryId: "home_kitchen_dining", level: 3 },
          { name: "Serveware", categoryId: "home_kitchen_serveware", parentCategoryId: "home_kitchen_dining", level: 3 },
          { name: "Dinner Sets", categoryId: "home_kitchen_dinnersets", parentCategoryId: "home_kitchen_dining", level: 3 },
          { name: "Storage Jars", categoryId: "home_kitchen_storage", parentCategoryId: "home_kitchen_dining", level: 3 },
          { name: "Glassware", categoryId: "home_kitchen_glassware", parentCategoryId: "home_kitchen_dining", level: 3 }
        ]
      },
      {
        name: "Furniture",
        categoryId: "home_furniture_main",
        parentCategoryId: "home_furniture",
        level: 2,
        levelThreeCategory: [
          { name: "Sofas", categoryId: "home_furniture_sofas", parentCategoryId: "home_furniture_main", level: 3 },
          { name: "Beds", categoryId: "home_furniture_beds", parentCategoryId: "home_furniture_main", level: 3 },
          { name: "Tables", categoryId: "home_furniture_tables", parentCategoryId: "home_furniture_main", level: 3 },
          { name: "Chairs", categoryId: "home_furniture_chairs", parentCategoryId: "home_furniture_main", level: 3 },
          { name: "Cabinets", categoryId: "home_furniture_cabinets", parentCategoryId: "home_furniture_main", level: 3 }
        ]
      }
    ]
  },
  {
    name: "Electronics",
    categoryId: "electronics",
    level: 1,
    levelTwoCategory: [
      {
        name: "Mobiles",
        categoryId: "electronics_mobiles",
        parentCategoryId: "electronics",
        level: 2,
        levelThreeCategory: [
          { name: "Smartphones", categoryId: "electronics_mobiles_smartphones", parentCategoryId: "electronics_mobiles", level: 3 },
          { name: "Feature Phones", categoryId: "electronics_mobiles_feature", parentCategoryId: "electronics_mobiles", level: 3 },
          { name: "Mobile Accessories", categoryId: "electronics_mobiles_accessories", parentCategoryId: "electronics_mobiles", level: 3 },
          { name: "Chargers", categoryId: "electronics_mobiles_chargers", parentCategoryId: "electronics_mobiles", level: 3 },
          { name: "Power Banks", categoryId: "electronics_mobiles_powerbanks", parentCategoryId: "electronics_mobiles", level: 3 }
        ]
      },
      {
        name: "Laptops",
        categoryId: "electronics_laptops",
        parentCategoryId: "electronics",
        level: 2,
        levelThreeCategory: [
          { name: "Gaming Laptops", categoryId: "electronics_laptops_gaming", parentCategoryId: "electronics_laptops", level: 3 },
          { name: "Business Laptops", categoryId: "electronics_laptops_business", parentCategoryId: "electronics_laptops", level: 3 },
          { name: "2-in-1 Laptops", categoryId: "electronics_laptops_convertible", parentCategoryId: "electronics_laptops", level: 3 },
          { name: "Chromebooks", categoryId: "electronics_laptops_chromebooks", parentCategoryId: "electronics_laptops", level: 3 },
          { name: "Laptop Accessories", categoryId: "electronics_laptops_accessories", parentCategoryId: "electronics_laptops", level: 3 }
        ]
      }
    ]
  }
];
