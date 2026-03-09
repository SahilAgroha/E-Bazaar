import React, { useEffect, useState } from "react";
import FilterSection from "./FilterSection";
import ProductCard from "./ProductCard";

import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Button,
  useMediaQuery,
  useTheme
} from "@mui/material";

import { FilterAlt, Search } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchAllProduct, searchProduct } from "../../../State/customer/ProductSlice";

const Product = () => {

  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

  const dispatch = useAppDispatch();

  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, searchProduct: searchResults, totalPages } =
    useAppSelector((store) => store.product);

  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  // ------------------------
  // SEARCH
  // ------------------------

  const handleSearch = () => {

    if (query.trim()) {
      setSearchParams({ query: query.trim() });
    } else {
      setSearchParams({});
    }

  };

  // ------------------------
  // SORT
  // ------------------------

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  // ------------------------
  // PAGINATION
  // ------------------------

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // ------------------------
  // API CALL
  // ------------------------

  useEffect(() => {

    const queryParam = searchParams.get("query");

    const [minPrice, maxPrice] =
      searchParams.get("price")?.split("-") || [];

    const color = searchParams.get("color");

    const minDiscount = searchParams.get("discount")
      ? Number(searchParams.get("discount"))
      : undefined;

    const pageNumber = page - 1;

    


    // SEARCH API
    if (queryParam) {

      dispatch(searchProduct(queryParam));

    } else {

const filters = {
  ...(category && { category }),
  ...(color && { color }),
  ...(minPrice && { minPrice: Number(minPrice) }),
  ...(maxPrice && { maxPrice: Number(maxPrice) }),
  ...(minDiscount && { minDiscount }),
  ...(sort && { sort }),
  pageNumber
};
console.log("Filters sent:", filters);

      dispatch(fetchAllProduct(filters));

    }

  }, [category, searchParams, page, sort, dispatch]);

  const displayProducts =
    searchParams.get("query") ? searchResults : products;

  return (
    <div className="z-10 mt-10">

      {/* TITLE */}

      <h1 className="text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase">
        {searchParams.get("query") ? "Search Results" : "Products"}
      </h1>

      {/* SEARCH BAR */}

      <div className="flex items-center gap-2 px-9 pb-5">

        <TextField
          size="small"
          fullWidth
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={handleSearch}
        >
          Search
        </Button>

      </div>

      <div className="lg:flex">

        {/* FILTERS */}

        <section className="lg:block w-[20%]">
          <FilterSection />
        </section>

        <div className="w-full lg:w-[80%] space-y-5">

          {/* SORT */}

          <div className="flex justify-between items-center px-9 h-[40px]">

            <div>

              {!isLarge && (
                <IconButton>
                  <FilterAlt />
                </IconButton>
              )}

            </div>

            <FormControl size="small" sx={{ width: "200px" }}>

              <InputLabel>Sort</InputLabel>

              <Select
                value={sort}
                label="Sort"
                onChange={handleSortChange}
              >
                <MenuItem value="price_low">
                  Price : Low - High
                </MenuItem>

                <MenuItem value="price_high">
                  Price : High - Low
                </MenuItem>

              </Select>

            </FormControl>

          </div>

          <Divider />

          {/* PRODUCTS */}

          <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-5">

            {displayProducts?.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}

          </section>

          {/* PAGINATION */}

          <div className="flex justify-center py-10">

            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default Product;