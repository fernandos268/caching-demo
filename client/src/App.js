import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      password
      id
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_USERS);
  if (loading) return <h2>Loading...</h2>;
  const { getUsers } = data || sampol;
  return (
    <div className="App">
      <header className="App-header">
        <div>
          {getUsers.map(user => {
            return (
              <div>
                <div>{user.email}</div>
                <div>{user.username}</div>
              </div>
            );
          })}
        </div>
      </header>
    </div>
  );
}

export default App;


const sampol = {
  getUsers: [
    {
        id: 1,
        username: 'backup goldenjayr',
        email: 'goldenjayr@gmail.com',
        password: '12345'
    },
    {
        id: 2,
        username: 'jahara',
        email: 'jahara@gmail.com',
        password: '12345'
    }
]
}