import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUsers, deleteUser, searchUsers, getUserById, updateUserStatus } from "../../../redux/reducers/admin/userSlice";
import { getRoles } from "../../../redux/reducers/admin/roleSlice";
import { toast } from "react-toastify";

const useUserLogic = () => {
  const dispatch = useDispatch();
  const { data: users, searchResults, loading, total } = useSelector((state) => state.userAdmin);
  const { data: roles } = useSelector((state) => state.roleAdmin);
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
    { key: 'username_asc', label: 'Tên đăng nhập A-Z' },
    { key: 'username_desc', label: 'Tên đăng nhập Z-A' },
    { key: 'fullname_asc', label: 'Họ tên A-Z' },
    { key: 'fullname_desc', label: 'Họ tên Z-A' },
  ];

  useEffect(() => {
    if (isSearching) {
      dispatch(searchUsers({ keyword: searchInput, page, limit }));
    } else {
      dispatch(getUsers({ page, limit }));
    }
    dispatch(getRoles());
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

  const dataToShow = isSearching ? searchResults : users;

  const handleViewDetail = async (userId) => {
    try {
      const result = await dispatch(getUserById(userId)).unwrap();
      setEditData(result);
      setIsViewMode(true);
      setIsModalOpen(true);
    } catch {
      toast.error('Không thể tải thông tin user');
    }
  };

  const handleEdit = (record) => {
    setEditData(record);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteUser(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Xoá user thành công!");
      const payload = { page, limit, ...(isSearching && { keyword: searchInput }) };
      isSearching ? dispatch(searchUsers(payload)) : dispatch(getUsers(payload));
    } else {
      toast.error("Lỗi khi xoá user.");
    }
  };

  const handleToggleStatus = async (record) => {
    const result = await dispatch(updateUserStatus( record.userId ));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success("Cập nhật trạng thái thành công!");
      isSearching ? dispatch(searchUsers({ keyword: searchInput, page, limit })) : dispatch(getUsers({ page, limit }));
    } else {
      toast.error("Lỗi khi cập nhật trạng thái user.");
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
      dispatch(searchUsers({ keyword: searchInput, page: 1, limit, sortBy, orderBy }));
    } else {
      dispatch(getUsers({ page: 1, limit, sortBy, orderBy }));
    }
    setPage(1);
  };

  const onChangePage = (page, limit) => {
    setPage(page);
    setLimit(limit);
    const [sortBy, orderBy] = filterValue === 'all' ? ['', ''] : filterValue.split('_');
    if (isSearching) {
      dispatch(searchUsers({ keyword: searchInput, page, limit, sortBy, orderBy }));
    } else {
      dispatch(getUsers({ page, limit, sortBy, orderBy }));
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
      onToggleStatus: handleToggleStatus,
    },
    paginationProps: {
      current: page,
      total,
      pageSize: limit,
      onChange: onChangePage,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
      showTotal: (total) => `Tổng ${total} người dùng`,
    },
    handleAdd,
    modalProps: {
      isModalOpen,
      setIsModalOpen,
      editData,
      handleCancel,
      refreshData: () => {
        if (isSearching) {
          dispatch(searchUsers({ keyword: searchInput, page, limit }));
        } else {
          dispatch(getUsers({ page, limit }));
        }
      },
      isViewMode,
      setIsViewMode,
      roles,
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
    roles,
  };
};

export default useUserLogic;
