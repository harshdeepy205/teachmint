export const getUsers = async () => {
   return await fetch(`https://jsonplaceholder.typicode.com/users`)
      .then(response => response.json())
}

export const getUserData = async (userID) => {
   return await fetch(`https://jsonplaceholder.typicode.com/users/${userID}`)
      .then(response => response.json())
}

export const getPosts = async () => {
   return await fetch(`https://jsonplaceholder.typicode.com/posts`)
      .then(response => response.json())
}

export const getTimezone = async (country) => {
   return await fetch(`https://worldtimeapi.org/api/timezone/${country}`)
      .then(response => response.json())
}

export const getCountries = async () => {
   return await fetch(`http://worldtimeapi.org/api/timezone`)
      .then(response => response.json())
}