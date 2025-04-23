import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCategories, deleteCategory, searchCategories, getCategoryById } from "../../../redux/reducers/admin/categorySlice";
import { toast } from "react-toastify";

const useCategoryLogic = () => {
  const dispatch = useDispatch();
  const { data: categories, searchResults, loading, total } = useSelector((state) => state.categoryAdmin);
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
    { key: 'categoryName_asc', label: 'Tên A-Z' },
    { key: 'categoryName_desc', label: 'Tên Z-A' },
  ];

  useEffect(() => {
    if (isSearching) {
      dispatch(searchCategories({ keyword: searchInput, page, limit }));
    } else {
      dispatch(getCategories({ page, limit }));
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

  const dataToShow = isSearching ? searchResults : categories;

  const handleViewDetail = async (categoryId) => {
    try {
      const result = await dispatch(getCategoryById(categoryId)).unwrap();
      setEditData(result);
      setIsViewMode(true);
      setIsModalOpen(true);
    } catch {
      toast.error('Không thể tải thông tin danh mục');
    }
  };

  const handleEdit = (record) => {
    setEditData(record);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteCategory(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Xóa danh mục thành công!");
      const payload = { page, limit, ...(isSearching && { keyword: searchInput }) };
      isSearching ? dispatch(searchCategories(payload)) : dispatch(getCategories(payload));
    } else {
      toast.error("Lỗi khi xóa danh mục.");
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
      dispatch(searchCategories({ keyword: searchInput, page: 1, limit, sortBy, orderBy }));
    } else {
      dispatch(getCategories({ page: 1, limit, sortBy, orderBy }));
    }
    setPage(1);
  };

  const onChangePage = (page, limit) => {
    setPage(page);
    setLimit(limit);
    const [sortBy, orderBy] = filterValue === 'all' ? ['', ''] : filterValue.split('_');
    if (isSearching) {
      dispatch(searchCategories({ keyword: searchInput, page, limit, sortBy, orderBy }));
    } else {
      dispatch(getCategories({ page, limit, sortBy, orderBy }));
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
      showTotal: (total) => `Tổng ${total} danh mục`,
    },
    handleAdd,
    modalProps: {
      isModalOpen,
      setIsModalOpen,
      editData,
      handleCancel,
      refreshData: () => {
        if (isSearching) {
          dispatch(searchCategories({ keyword: searchInput, page, limit }));
        } else {
          dispatch(getCategories({ page, limit }));
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
  };
};

export default useCategoryLogic;
