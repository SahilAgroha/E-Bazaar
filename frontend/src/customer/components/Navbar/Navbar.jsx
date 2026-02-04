import React, { useState, useRef } from "react";
import { Avatar, Box, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { AddShoppingCart, FavoriteBorder, Storefront } from "@mui/icons-material";
import CategorySheet from "./CategorySheet";
import { mainCategory } from "../../../data/category/mainCategory";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../State/Store";

const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [showSheet, setShowSheet] = useState(false);
  const {auth}=useAppSelector(store=>store)

  // Ref to timeout for submenu hiding
  const hideTimeoutRef = useRef(null);

  // Start hiding submenu after delay (prevents flicker)
  const handleHideSheet = () => {
    hideTimeoutRef.current = setTimeout(() => setShowSheet(false), 120); // adjust delay as needed
  };

  // Cancel hiding if mouse re-enters
  const cancelHideSheet = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  };

  const navigate=useNavigate();

  return (
    <>
      <Box className="sticky top-0 left-0 right-0 bg-white" sx={{ zIndex: 2 }}>
        <div className="flex items-center justify-between px-5 lg:px-20 h-[70px] border-b select-none">
          <div className="flex items-center gap-9">
            <div className="flex items-center gap-2">
              {!isLarge && (
                <IconButton>
                  <MenuIcon />
                </IconButton>
              )}
              <h1 onClick={()=>navigate("/")} className="logo cursor-pointer text-lg md:text-2xl text-primary-color">
                Buy Baazar
              </h1>
            </div>
            <ul
              className="flex items-center font-medium text-gray-800"
              onMouseLeave={handleHideSheet}
              onMouseEnter={cancelHideSheet}
            >
              {mainCategory.map((item) => (
                <li
                  key={item.categoryId}
                  onMouseEnter={() => {
                    setSelectedCategory(item.categoryId);
                    setShowSheet(true);
                  }}
                  className="mainCategory hover:text-primary-color hover:border-b-2 h-[70px] border-primary-color flex items-center cursor-pointer px-3"
                  style={{ transition: "color 0.1s" }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-1 lg:gap-6 items-center">
            <IconButton>
              <SearchIcon />
            </IconButton>
            {/* Replace `false` with logged-in state check if you add auth */}
            {auth.isLoggedIn ? (
              <Button onClick={()=>navigate("/account/orders")} className="flex items-center gap-2">
                <Avatar
                  sx={{ width: 29, height: 29 }}
                  src="https://s.yimg.com/ny/api/res/1.2/cCr6WKLpu2Oos7jPY9pgOQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xMjYw/https://media.zenfs.com/en/futurism_981/226fd923d54fbbf6a008b3e292dab2de"
                />
                <h1 className="font-semibold hidden lg:block">{auth.user?.fullName}</h1>
              </Button>
            ) : (
              <Button onClick={()=>navigate("/login")} variant="contained">Login</Button>
            )}
            <IconButton onClick={()=>navigate('/wishlist')}>
              <FavoriteBorder sx={{ fontSize: 29 }} />
            </IconButton>
            <IconButton onClick={()=>navigate("/cart")}>
              <AddShoppingCart className="text-gray-700" sx={{ fontSize: 29 }} />
            </IconButton>
            {isLarge && (
              <Button onClick={()=>navigate("/become-seller")} startIcon={<Storefront />} variant="outlined">
                Become Seller
              </Button>
            )}
          </div>
        </div>
        {/* Hoverable category sheet */}
        {showSheet && (
          <div
            className="categorySheet absolute top-[4.41rem] left-20 right-20 border bg-white"
            onMouseEnter={cancelHideSheet}
            onMouseLeave={handleHideSheet}
            style={{ minHeight: 100 }} // adjust min height as needed
          >
            <CategorySheet selectedCategory={selectedCategory} />
          </div>
        )}
      </Box>
    </>
  );
};

export default Navbar;
