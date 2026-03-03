import React from 'react';
import Photobooth from './components/Photobooth';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>📸 Mon Petit Photobooth</h1>
      </header>
      <main>
        <Photobooth />
      </main>
    </div>
  );
}

export default App;