import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchNewProducts,
  fetchBestSellerProducts,
  fetchProductsByKeyword,
  fetchProductsByCategory
} from "../../../redux/reducers/public/productSlice";
import { fetchWishlist } from "../../../redux/reducers/user/accountSlice";
import { filterItems, productTypeItems } from "../config/productFilters";

export default function useProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { data, searchResults, loading, total, featuredProducts, newProducts, bestSellerProducts } = useSelector((state) => state.productPublic);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Math.max(1, parseInt(searchParams.get('page')) || 1));
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit')) || 10);
  const [searchInput, setSearchInput] = useState(searchParams.get('keyword') || "");
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || ""); // keyword thực sự dùng để fetch
  const [isSearching, setIsSearching] = useState(!!searchParams.get('keyword'));
  const [filterValue, setFilterValue] = useState(searchParams.get('sort') || 'all');
  const [productType, setProductType] = useState(searchParams.get('type') || 'all');

  // Handler chỉ gọi khi nhấn Enter hoặc click Search
  const handleSearch = () => {
    setKeyword(searchInput);
    setIsSearching(!!searchInput.trim());
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setKeyword("");
    setIsSearching(false);
    setPage(1);
  };

  const handleFilter = ({ key }) => {
    setFilterValue(key);
    setPage(1);
  };

  const handleProductTypeChange = ({ key }) => {
    setProductType(key);
    setPage(1);
  };

  const getProductTypeLabel = () => {
    const selectedType = productTypeItems.find(item => item.key === productType);
    return selectedType ? selectedType.label : 'Tất cả sản phẩm';
  };

  const handlePageChange = (newPage, newLimit) => {
    const validPage = Math.max(1, newPage);
    setPage(validPage);
    if (newLimit !== limit) {
      setLimit(newLimit);
    }
    setSearchParams({
      page: validPage,
      limit: newLimit || limit,
      ...(keyword && { keyword }),
      ...(filterValue !== 'all' && { sort: filterValue }),
      ...(!categoryId && productType !== 'all' ? { type: productType } : {})
    });
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (limit !== 10) params.set('limit', limit);
    if (isSearching && keyword) params.set('keyword', keyword);
    if (filterValue !== 'all') params.set('sort', filterValue);
    if (!categoryId && productType !== 'all') params.set('type', productType);
    setSearchParams(params);

    const fetchData = async () => {
      if (categoryId) {
        const [sortBy, orderBy] = filterValue === 'all' ? ['productName', 'asc'] : filterValue.split('_');
        await dispatch(fetchProductsByCategory({
          categoryId,
          params: {
            page: Math.max(1, page),
            limit,
            sortBy,
            orderBy
          }
        }));
      } else {
        const fetchParams = {
          page: Math.max(1, page),
          limit,
          ...getSortParams()
        };
        if (isSearching && keyword) {
          fetchParams.keyword = keyword;
          await dispatch(fetchProductsByKeyword(fetchParams));
        } else {
          switch (productType) {
            case 'featured':
              await dispatch(fetchFeaturedProducts(fetchParams));
              break;
            case 'new':
              await dispatch(fetchNewProducts(fetchParams));
              break;
            case 'best-seller':
              await dispatch(fetchBestSellerProducts(fetchParams));
              break;
            default:
              await dispatch(fetchProducts(fetchParams));
              break;
          }
        }
      }
    };
    fetchData();
  }, [dispatch, page, limit, isSearching, keyword, filterValue, productType, categoryId]);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const getSortParams = () => {
    if (filterValue === 'all') return {};
    const [sortBy, orderBy] = filterValue.split('_');
    return { sortBy, orderBy };
  };

  const getCurrentProducts = () => {
    if (categoryId) return data;
    if (isSearching) return searchResults;
    switch (productType) {
      case 'featured':
        return featuredProducts;
      case 'new':
        return newProducts;
      case 'best-seller':
        return bestSellerProducts;
      default:
        return data;
    }
  };

  return {
    products: getCurrentProducts(),
    loading,
    total,
    page,
    setPage,
    limit,
    setLimit,
    filterValue,
    setFilterValue,
    productType,
    setProductType,
    searchInput,
    setSearchInput,
    isSearching,
    setIsSearching,
    handleFilter,
    handleProductTypeChange,
    handleSearch,
    handleReset,
    handlePageChange,
    getProductTypeLabel,
    categoryId,
    navigate,
    productTypeItems,
    filterItems,
  };
}
