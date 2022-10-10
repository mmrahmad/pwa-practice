/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const customerData = [
    {
      ssn: '444-44-4444',
      name: 'Bill',
      age: 35,
      email: 'bill@company.com',
    },
    {
      ssn: '555-55-5555',
      name: 'Donna',
      age: 32,
      email: 'donna@home.org',
    },
  ];

  let db: any;
  useEffect(() => {
    const request = indexedDB.open('MyTestDatabase');
    request.onerror = (event: any) => {
      console.error(`Database error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event: any) => {
      db = event.target.result;
    };
    request.onupgradeneeded = (event: any) => {
      db = event.target.result;
      const objectStore = db.createObjectStore('customers', {
        keyPath: 'ssn',
      });
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });

      objectStore.transaction.oncomplete = (event: any) => {
        // Store values in the newly created objectStore.
        const customerObjectStore = db
          .transaction('customers', 'readwrite')
          .objectStore('customers');
        customerData.forEach((customer) => {
          customerObjectStore.add(customer);
        });
      };
    };
  }, []);

  const addMoreData = (data: {
    ssn: string;
    name: string;
    age: number;
    email: string;
  }) => {
    const transaction = db.transaction('customers', 'readwrite');
    const customerObjectDB = transaction.objectStore('customers');
    const requestToAdd = customerObjectDB.add(data);
    requestToAdd.onsuccess = (event: any) => {
      console.log('Added');
    };
    requestToAdd.onerror = (event: any) => {
      console.error(event?.target?.error?.message);
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button
          onClick={() =>
            addMoreData({
              ssn: '333-33-3333',
              name: 'Ahmad 3',
              age: 27,
              email: 'mmrahmode7@gmail.com',
            })
          }
        >
          Add Data
        </button>
      </header>
    </div>
  );
}

export default App;
