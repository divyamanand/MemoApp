import React from 'react';
import { BottomNavigation } from 'react-native-paper';

interface BottomNavProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const routes = [
  { key: 'dashboard', title: 'Dashboard', icon: 'home' },
  { key: 'practice', title: 'Practice', icon: 'science' },
  { key: 'review', title: 'Review', icon: 'history' },
  { key: 'community', title: 'Community', icon: 'people' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeRoute, onNavigate }) => (
  <BottomNavigation
    navigationState={{
      index: routes.findIndex((r) => r.key === activeRoute),
      routes,
    }}
    onIndexChange={(index) => onNavigate(routes[index].key)}
    renderScene={() => null} // Handled externally
  />
);

export default BottomNav;
