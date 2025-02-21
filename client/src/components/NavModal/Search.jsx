import s from "./NavModal.module.scss";
import { searchReset, closeLeft } from "../../assets";
import {
  useGetMeQuery,
  useGetUsersForSearchQuery,
  useAddUserToSearchMutation,
} from "../../services/userApi";
import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import PropTypes from "prop-types";

export const Search = ({ closeModal }) => {
  const { data: me } = useGetMeQuery();

  const {
    data: users,
    isLoading,
    isFetching,

    error,
  } = useGetUsersForSearchQuery();

  const [addToSearch] = useAddUserToSearchMutation();

  const [matchingUsers, setMatchingUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value?.length < 1) {
      setMatchingUsers([]);
      return;
    }
    if (users.length === 0) return;
    const regex = new RegExp(e.target.value, "i");
    const filtered = users.filter((user) => regex.test(user.username));
    setMatchingUsers(filtered);
  };

  const handleAddToSearch = async (user) => {
    try {
      await addToSearch(user.username).unwrap();
    } catch (error) {
      console.error("Error adding user to search: ", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>Something went wrong...</p>;

  return (
    <div className={s.search}>
      <img
        className={s.closeModalBtn}
        onClick={closeModal}
        src={closeLeft}
        alt=""
      />
      <h1>Search</h1>
      <form className={s.searchForm}>
        <input
          value={searchInput}
          onChange={(e) => handleSearch(e)}
          className={s.searchInput}
          placeholder="Search"
          type="text"
        />
        <img
          className={s.searchReset}
          src={searchReset}
          alt="remove search value"
          onClick={() => {
            setSearchInput("");
            setMatchingUsers([]);
          }}
        />
      </form>
      <div className={s.searchResults}>
        <div className={s.results}>
          {matchingUsers?.length > 0 &&
            matchingUsers.map((user) => (
              <Link
                key={user._id}
                to={`/profile/${user?.username}`}
                className={s.result}
                onClick={() => handleAddToSearch(user)}
              >
                <Avatar src={user?.profile_image} size="38" round={true} />

                <p>{user?.username}</p>
              </Link>
            ))}
        </div>
        {me?.search?.length > 0 && !searchInput && (
          <div className={s.recent}>
            <h2>Recent</h2>
            <div className={s.results}>
              {" "}
              {me?.search?.map((user) => (
                <Link
                  key={user?._id}
                  to={`/profile/${user?.username}`}
                  className={s.result}
                >
                  <Avatar src={user?.profile_image} size="38" round={true} />

                  <p>{user?.username}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Search.propTypes = {
  closeModal: PropTypes.func,
};
