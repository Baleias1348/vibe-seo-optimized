import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <MainLayout />
                <Toaster />
            </Router>
        </QueryClientProvider>
    );
}

export default App;