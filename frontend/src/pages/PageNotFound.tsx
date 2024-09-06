import React from 'react';
import LayoutWrapper from '../components/Layout';

const PageNotFound: React.FC = () => {
  return (
    <LayoutWrapper>
      <div className="grid place-content-center h-screen">
        <div className="max-w-xl border border-lightBlack p-12 rounded-2xl">
          <div className="text-center mb-2">
            <h1 className="text-3xl mb-4 font-bold ">404: Page NOT FOUND</h1>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default PageNotFound;
