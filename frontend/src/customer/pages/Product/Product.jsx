import React, { useEffect, useState } from 'react'
import FilterSection from "./FilterSection"
import ProductCard from "./ProductCard"
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
} from '@mui/material'
import { FilterAlt, Search } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchAllProduct, searchProduct } from '../../../State/customer/ProductSlice'

const Product = () => {
  const theme = useTheme()
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"))
  const [sort, setSort] = useState()
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState("")   // 🔎 search input
  const dispatch = useAppDispatch()
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const { products, searchProduct: searchResults, totalPages } = useAppSelector(
    (store) => store.product
  )

  const handleSortChange = (event) => {
    setSort(event.target.value)
  }

  const handlePageChange = (value) => {
    setPage(value)
  }

  // 🔎 search handler updates the URL instead of dispatching directly
  const handleSearch = () => {
    if (query.trim()) {
      setSearchParams({ query: query.trim() })
    } else {
      setSearchParams({})
    }
  }

  useEffect(() => {
    const queryParam = searchParams.get("query")
    const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || []
    const color = searchParams.get("color")
    const minDiscount = searchParams.get("discount") ? Number(searchParams.get("discount")) : undefined
    const pageNumber = page - 1

    if (queryParam) {
      // dispatch search if query exists
      dispatch(searchProduct(queryParam))
    } else {
      // otherwise fetch all products with filters
      const newFilter = {
        color: color || "",
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minDiscount,
        pageNumber,
      }
      dispatch(fetchAllProduct(newFilter))
    }
  }, [category, searchParams, page, sort, dispatch])

  const displayProducts = searchParams.get("query") ? searchResults : products

  return (
    <div className='z-10 mt-10'>
      <div>
        <h1 className='text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase space-x-2'>
          {searchParams.get("query") ? "Search Results" : "Women Saree"}
        </h1>
      </div>

      {/* 🔎 Search Bar */}
      <div className="flex items-center gap-2 px-9 pb-5">
        <TextField
          size="small"
          fullWidth
          placeholder="Search Products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          startIcon={<Search />}
        >
          Search
        </Button>
      </div>

      <div className="lg:flex">
        <section className="filter_section lg:block w-[20%]">
          <FilterSection />
        </section>

        <div className="w-full lg:w-[80%] space-y-5">
          <div className="flex justify-between items-center px-9 h-[40px]">
            <div className="relative w-[50%]">
              {!isLarge && (
                <IconButton>
                  <FilterAlt />
                </IconButton>
              )}
              {!isLarge && (
                <Box>
                  <FilterSection />
                </Box>
              )}
            </div>
            <FormControl size='small' sx={{ width: "200px" }}>
              <InputLabel id="sort-label">Sort</InputLabel>
              <Select
                labelId='sort-label'
                id='sort'
                value={sort}
                label="Sort"
                onChange={handleSortChange}>
                <MenuItem value={"price_low"}>Price : Low - High</MenuItem>
                <MenuItem value={"price_high"}>Price : High - Low</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Divider />

          {/* 🔄 Products Grid */}
          <section className='product_section grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 px-5 justify-center'>
            {displayProducts.map((item) => <ProductCard key={item.id} item={item} />)}
          </section>

          {/* 🔄 Pagination */}
          <div className='flex justify-center py-10'>
            <Pagination
              onChange={(e, value) => handlePageChange(value)}
              count={totalPages}
              page={page}
              variant='outlined'
              color='primary'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
