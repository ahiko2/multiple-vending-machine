import React, { useState } from 'react';
import VendingMachine from './VendingMachine';
import AdminPanel from './AdminPanel';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'machine' | 'admin'>('machine');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('VM001');

  const availableMachines = ['VM001', 'VM002', 'VM003'];

  return (
    <div className="App">
      <nav className="app-navigation">
        <div className="nav-section">
          <h1>🥤 Vending System</h1>
        </div>
        
        <div className="nav-section">
          <button 
            onClick={() => setCurrentView('machine')}
            className={`nav-button ${currentView === 'machine' ? 'active' : ''}`}
          >
            🥤 Vending Machine
          </button>
          <button 
            onClick={() => setCurrentView('admin')}
            className={`nav-button ${currentView === 'admin' ? 'active' : ''}`}
          >
            🔧 Admin Panel
          </button>
        </div>

        {currentView === 'machine' && (
          <div className="nav-section">
            <label htmlFor="machine-selector">Machine:</label>
            <select 
              id="machine-selector"
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="machine-selector"
            >
              {availableMachines.map(machineId => (
                <option key={machineId} value={machineId}>
                  {machineId}
                </option>
              ))}
            </select>
          </div>
        )}
      </nav>

      <main className="app-main">
        {currentView === 'machine' ? (
          <VendingMachine machineId={selectedMachineId} />
        ) : (
          <AdminPanel />
        )}
      </main>
    </div>
  );
}

export default App;
