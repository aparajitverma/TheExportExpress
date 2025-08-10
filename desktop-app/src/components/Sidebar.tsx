import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  VStack, 
  useColorModeValue,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { useAppStore } from '../stores/appStore';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Settings,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.900', 'white');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeText = useColorModeValue('blue.700', 'blue.200');
  const navTextColor = useColorModeValue('gray.600', 'gray.300');
  const navHoverBg = useColorModeValue('gray.50', 'gray.700');

  const navigation = [
    { name: 'Flow Overview', href: '/flow', icon: Home },
    { name: 'Phase 1', href: '/phase-1', icon: Package },
    { name: 'Phase 2', href: '/phase-2', icon: ShoppingCart },
    { name: 'Phase 3', href: '/phase-3', icon: TrendingUp },
    { name: 'Phase 4', href: '/phase-4', icon: Users },
    { name: 'Phase 5', href: '/phase-5', icon: Settings },
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Suppliers', href: '/suppliers', icon: Users },
    { name: 'Market Intelligence', href: '/market-intelligence', icon: TrendingUp },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <Box 
      bg={bgColor} 
      shadow="xl" 
      transition="all 0.3s ease"
      w={sidebarCollapsed ? '72px' : '280px'}
      borderRight="1px"
      borderColor={borderColor}
      position="relative"
      zIndex={10}
    >
      <Flex 
        alignItems="center" 
        justifyContent="space-between" 
        p={6} 
        borderBottom="1px" 
        borderColor={borderColor}
        minH="80px"
      >
        {!sidebarCollapsed && (
          <Text 
            fontSize="xl" 
            fontWeight="bold" 
            color={textColor}
            letterSpacing="tight"
          >
            ExportExpressPro
          </Text>
        )}
        <Button
          onClick={toggleSidebar}
          p={3}
          borderRadius="lg"
          _hover={{ bg: hoverBg }}
          variant="ghost"
          size="sm"
          minW="40px"
          h="40px"
        >
          {sidebarCollapsed ? <Menu size={24} /> : <X size={24} />}
        </Button>
      </Flex>

      <VStack as="nav" mt={6} spacing={2} px={3}>
        {navigation.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.href;
          
          const navItem = (
            <Box
              key={item.name}
              as={Link}
              to={item.href}
              w="full"
              display="flex"
              alignItems="center"
              px={4}
              py={4}
              fontSize="sm"
              fontWeight="medium"
              transition="all 0.2s ease"
              bg={isActive ? activeBg : 'transparent'}
              color={isActive ? activeText : navTextColor}
              borderRadius="lg"
              _hover={{
                bg: isActive ? activeBg : navHoverBg,
                textDecoration: 'none',
                transform: 'translateX(2px)'
              }}
              position="relative"
            >
              <Icon 
                as={IconComponent} 
                size={22} 
                mr={sidebarCollapsed ? 0 : 4}
                flexShrink={0}
              />
              {!sidebarCollapsed && (
                <Text 
                  flex="1"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  {item.name}
                </Text>
              )}
              {isActive && (
                <Box
                  position="absolute"
                  left="0"
                  top="50%"
                  transform="translateY(-50%)"
                  w="3px"
                  h="60%"
                  bg={activeText}
                  borderRadius="full"
                />
              )}
            </Box>
          );

          return sidebarCollapsed ? (
            <Tooltip 
              key={item.name}
              label={item.name} 
              placement="right"
              hasArrow
              bg={useColorModeValue('gray.800', 'gray.200')}
              color={useColorModeValue('white', 'gray.800')}
            >
              {navItem}
            </Tooltip>
          ) : navItem;
        })}
      </VStack>

      {/* Bottom section for app info */}
      {!sidebarCollapsed && (
        <Box 
          mt="auto" 
          p={6} 
          borderTop="1px" 
          borderColor={borderColor}
        >
          <Text 
            fontSize="xs" 
            color={navTextColor}
            textAlign="center"
          >
            v1.0.0
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar; 