import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider, Box, Flex, Alert, AlertIcon, useColorMode } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';

// Components
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Suppliers from './pages/Suppliers';
import MarketIntelligence from './pages/MarketIntelligence';
import Settings from './pages/Settings';
import FlowOverview from './pages/FlowOverview';
import Phase1 from './pages/Phase1';
import Phase2 from './pages/Phase2';
import Phase3 from './pages/Phase3';
import Phase4 from './pages/Phase4';
import Phase5 from './pages/Phase5';

// Stores
import { useAppStore } from './stores/appStore';

// WebSocket connection
import { useWebSocket } from './hooks/useWebSocket';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isConnected } = useWebSocket();
  const { theme } = useAppStore();
  const { colorMode, toggleColorMode } = useColorMode();

  // Sync theme with Chakra UI
  React.useEffect(() => {
    if (theme === 'dark' && colorMode !== 'dark') {
      toggleColorMode();
    } else if (theme === 'light' && colorMode !== 'light') {
      toggleColorMode();
    }
  }, [theme, colorMode, toggleColorMode]);

  return (
    <Router>
      <Flex 
        h="100vh" 
        bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
        overflow="hidden"
      >
        <Sidebar />
        <Box 
          as="main" 
          flex="1" 
          overflow="auto"
          bg={colorMode === 'dark' ? 'gray.900' : 'white'}
          borderLeft="1px"
          borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
        >
          <Box p={8} maxW="1400px" mx="auto">
            {!isConnected && (
              <Alert 
                status="warning" 
                mb={6}
                borderRadius="lg"
                boxShadow="sm"
              >
                <AlertIcon />
                Real-time connection lost. Some features may be limited.
              </Alert>
            )}
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/flow" element={<FlowOverview />} />
              <Route path="/phase-1" element={<Phase1 />} />
              <Route path="/phase-2" element={<Phase2 />} />
              <Route path="/phase-3" element={<Phase3 />} />
              <Route path="/phase-4" element={<Phase4 />} />
              <Route path="/phase-5" element={<Phase5 />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/market-intelligence" element={<MarketIntelligence />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
      </Flex>
    </Router>
  );
}

function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App; 