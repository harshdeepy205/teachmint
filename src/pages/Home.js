import React, { useEffect, useState } from 'react';
import { getPosts, getUsers } from '../services/api.service';
import ListCard from '../components/ListCard';

function Home() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [userIdCounts, setUserIdCounts] = useState({});

  const countUserIds = () => {
    const counts = {};
    allPosts.forEach((post) => {
      const userId = post.userId;
      if (userId in counts) {
        counts[userId] += 1;
      } else {
        counts[userId] = 1;
      }
    });
    setUserIdCounts(counts);
  };

  const getAllPosts = () => {
    getPosts()
      .then((data) => {
        setAllPosts(data);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  const getAllUsers = () => {
    getUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        setUsers(null)
        console.log(err);
      });
  }
  useEffect(() => {
    setIsLoading(true);
    getAllUsers();
    getAllPosts();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    countUserIds();
  }, [allPosts]);

  return (
    <>
      <div className='text-center my-4'>
        <h2>Directory</h2>
      </div>
      <div className='post-cards-listing px-5'>
        {!isLoading && allPosts
          ? users.map((user, index) => (
            <ListCard
              key={index}
              userName={user.name}
              userId={user.id}
              postCount={userIdCounts[user.id]}
            />
          ))
          : null}
      </div>
    </>
  );
}

export default Home;