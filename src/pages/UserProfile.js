import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { getCountries, getPosts, getTimezone, getUserData, getUsers } from '../services/api.service';
import ListCard from '../components/ListCard';

function UserProfile() {

  const [countries, setCountries] = useState();
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());
  const [running, setRunning] = useState(true);
  const userID = localStorage.getItem('userId');

  const getAllCountries = () => {
    getCountries()
      .then((res) => {
        setCountries(res)
      })
      .catch((err) => {
        console.log("Get countries API Error", err);
      })
  }

  const getTimeZone = (country) => {
    getTimezone(country)
      .then((res) => {
        setTimezone(res.timezone)
      })
      .catch((err) => {
        console.log("getTimeZone API Error", err);
      })
  }
  const getUser = () => {
    getUserData(userID)
      .then((res) => {
        setUserData(res)
      })
      .catch((err) => {
        console.log("Error", err);
      })
  }

  //This function will update according to the timezone
  useEffect(() => {
    // Update time when timezone changes
    setTime(getTimeInTimezone(timezone));
  }, [timezone]);

  const getTimeInTimezone = (targetTimezone) => {
    const options = {
      timeZone: targetTimezone,
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return new Date().toLocaleTimeString('en-US', options);
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

  useEffect(() => {
    getAllCountries();
    getUser();
    setIsLoading(true);
    getAllPosts();
    // showTime()
    setIsLoading(false);
  }, [])

  //This function will increase the time by one second
  const increaseTimeByOneSecond = () => {
    setTime((prevTime) => {
      const [hours, minutes, seconds] = prevTime.split(':');
      const timeInSeconds = (+hours * 60 + +minutes) * 60 + +seconds + 1;
      const newHours = Math.floor(timeInSeconds / 3600);
      const newMinutes = Math.floor((timeInSeconds - newHours * 3600) / 60);
      const newSeconds = timeInSeconds - newHours * 3600 - newMinutes * 60;
      return `${newHours.toString().padStart(2, '0')}:${newMinutes
        .toString()
        .padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
    });
  };


  useEffect(() => {
    let intervalId;
    if (running) {
      // Update the time every second only if running is true
      intervalId = setInterval(() => {
        increaseTimeByOneSecond();
      }, 1000);
    }
    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [running]); 

  const handleStart = () => {
    setRunning(true);
  };

  const handlePause = () => {
    setRunning(false);
  };

  return (
    <>
      <div className='userinfo-container mx-4'>
        <div className='header d-flex justify-content-between my-4 flex-wrap align-items-center'>
          <Link to="/"><button type="button" className="btn btn-info">Back</button></Link>

          <div className="dropdown">
            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Country Dropdown
            </a>
            <ul className="dropdown-menu timeZoneList">
              {countries && countries.map((country) => (
                <li key={country} onClick={() => { getTimeZone(country) }}><a className="dropdown-item" href="#">{country}</a></li>
              ))}
            </ul>
          </div>

          <div className="time-zone-wrapper">
            <div className="">
              {timezone && 
              <div className='d-flex gap-2 align-items-center flex-wrap timer-container'>
                <div className='btn-wrapper'>
                  <button className='btn btn-primary' onClick={handleStart}>Start</button>
                  <button className='btn btn-danger mx-2' onClick={handlePause}>Pause</button>
                </div>
                <h5 className="card-title">{timezone}: {time}</h5>
              </div>
              }
            </div>
          </div>
        </div>
        {/* user data */}
        <div className="card">
          <div className='card-body'>
            <h4 className="card-title text-center fs-3 fw-bolder mb-4">User Data</h4>
            <div className='row'>
              <div className='col-md-12 col-lg-6'>
                <div className='name-details d-flex flex-column gap-1'>
                  <h2 className='fs-4 fw-normal'><strong>Name:</strong> {userData && userData.name}</h2>
                  <span className='fs-4'><strong>Username:</strong> {userData && userData.username}</span>
                  <span className='fs-4'><strong>CatchPhrase:</strong> {userData && userData.company.catchPhrase}</span>
                </div>
              </div>
              <div className='col-md-12 col-lg-6 d-flex flex-column gap-1'>
                <h3 className='fs-4 fw-normal'><strong> Address:</strong> {userData && userData.address &&
                  `${userData.address.street}, ${userData.address.suite}, ${userData.address.city}, ${userData.address.zipcode}`}</h3>
                <span className='fs-4'><strong>Email:</strong> {userData && userData.email}</span>
                <span className='fs-4'><strong>Phone:</strong> {userData && userData.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='postlist-cards overflow-hidden mt-5'>
          <div className='row py-2 px-1'>
            {!isLoading && allPosts && userID
              ? allPosts.filter(post => post.userId === +userID)
                .map((post, index) => (
                  <div key={index} className='col-md-12 col-lg-4'>
                    <div className="card border-3 pointer pointer my-2">
                      <div className="card-body">
                        <div className="info-wrapper align-items-center d-flex info-wrapper flex-column gap-2">
                          <span className="fs-5">{post?.title}</span>
                          <span className="fs-5">
                            {post?.body}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfile