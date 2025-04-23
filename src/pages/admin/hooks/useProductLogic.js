import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts, deleteProduct, searchProducts, getProductById } from "../../../redux/reducers/admin/productSlice";
import { toast } from "react-toastify";

const useProductLogic = () => {
  const dispatch = useDispatch();
  const { data: products, searchResults, loading, total } = useSelector((state) => state.productAdmin);
  const { data: categories } = useSelector((state) => state.categoryAdmin);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filterValue, setFilterValue] = useState('all');
  const [isViewMode, setIsViewMode] = useState(false);

  const filterItems = [
    { key: 'all', label: 'Tất cả' },
    { key: 'productName_asc', label: 'Tên A-Z' },
    { key: 'productName_desc', label: 'Tên Z-A' },
    { key: 'price_asc', label: 'Giá tăng dần' },
    { key: 'price_desc', label: 'Giá giảm dần' },
  ];

  useEffect(() => {
    if (isSearching) {
      dispatch(searchProducts({ keyword: searchInput, page, limit }));
    } else {
      dispatch(getProducts({ page, limit }));
    }
  }, [dispatch, page, limit, isSearching, searchInput]);

  const handleSearch = (val) => {
    setPage(1);
    setIsSearching(!!val.trim());
    setSearchInput(val);
  };

  const handleReset = () => {
    setSearchInput("");
    setIsSearching(false);
    setPage(1);
  };

  const dataToShow = isSearching ? searchResults : products;

  const handleViewDetail = async (productId) => {
    try {
      const result = await dispatch(getProductById(productId)).unwrap();
      setEditData(result);
      setIsViewMode(true);
      setIsModalOpen(true);
    } catch {
      toast.error('Không thể tải thông tin sản phẩm');
    }
  };

  const handleEdit = (record) => {
    setEditData(record);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteProduct(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Xóa sản phẩm thành công!");
      const payload = { page, limit, ...(isSearching && { keyword: searchInput }) };
      isSearching ? dispatch(searchProducts(payload)) : dispatch(getProducts(payload));
    } else {
      toast.error("Lỗi khi xóa sản phẩm.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditData(null);
    setIsViewMode(false);
  };

  const handleAdd = () => {
    setEditData(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleFilter = ({ key }) => {
    setFilterValue(key);
    const [sortBy, orderBy] = key === 'all' ? ['', ''] : key.split('_');
    if (isSearching) {
      dispatch(searchProducts({ keyword: searchInput, page: 1, limit, sortBy, orderBy }));
    } else {
      dispatch(getProducts({ page: 1, limit, sortBy, orderBy }));
    }
    setPage(1);
  };

  const onChangePage = (page, limit) => {
    setPage(page);
    setLimit(limit);
    const [sortBy, orderBy] = filterValue === 'all' ? ['', ''] : filterValue.split('_');
    if (isSearching) {
      dispatch(searchProducts({ keyword: searchInput, page, limit, sortBy, orderBy }));
    } else {
      dispatch(getProducts({ page, limit, sortBy, orderBy }));
    }
  };

  return {
    loading,
    filterItems,
    filterValue,
    onFilter: handleFilter,
    searchInput,
    onSearch: handleSearch,
    onReset: handleReset,
    isSearching,
    tableProps: {
      data: dataToShow,
      loading,
      page,
      limit,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onView: handleViewDetail,
    },
    paginationProps: {
      current: page,
      total,
      pageSize: limit,
      onChange: onChangePage,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
      showTotal: (total) => `Tổng ${total} sản phẩm`,
    },
    handleAdd,
    modalProps: {
      isModalOpen,
      setIsModalOpen,
      editData,
      handleCancel,
      refreshData: () => {
        if (isSearching) {
          dispatch(searchProducts({ keyword: searchInput, page, limit }));
        } else {
          dispatch(getProducts({ page, limit }));
        }
      },
      isViewMode,
      setIsViewMode,
    },
    filterProps: {
      filterItems,
      filterValue,
      onFilter: handleFilter,
      searchInput,
      onSearch: handleSearch,
      onReset: handleReset,
      isSearching,
    },
    categories,
  };
};

export default useProductLogic;
