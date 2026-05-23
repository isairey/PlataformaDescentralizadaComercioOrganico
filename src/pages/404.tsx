// pages/404.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';


const Custom404: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
                <p className="text-7xl text-gray-600">Page Not Found</p>
                <Button
                    onClick={handleClick}
                    className="mt-4 inline-block px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    Go Back to Home
                </Button>
            </div>
        </div>
    );
};

export default Custom404;

  