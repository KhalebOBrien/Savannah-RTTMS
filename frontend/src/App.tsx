import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './theme/index.css';
import AppRouter from './routes/AppRouter';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
