import React from 'react';
import RetirementForm from './components/RetirementForm';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Early Retirement Planner</h1>
      <RetirementForm />
    </div>
  );
};

export default App;