/**
 * AppNavigator — Switch central baseado no estado de autenticação e role.
 *
 * Lógica:
 * - !isAuthenticated              → AuthNavigator (Login)
 * - isAuthenticated + Desktop role → DesktopNavigator (Drawer/Sidebar)
 * - isAuthenticated + Treinador   → TreinadorNavigator (Bottom Tabs 4)
 * - isAuthenticated + Portal role → PortalNavigator (Bottom Tabs 5)
 */

import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { getLayoutType } from '../constants/roles';
import { AuthNavigator } from './AuthNavigator';
import { DesktopNavigator } from './DesktopNavigator';
import { TreinadorNavigator } from './TreinadorNavigator';
import { PortalNavigator } from './PortalNavigator';

export function AppNavigator(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const activeRole = useAuthStore((s) => s.activeRole);

  // Utilizador não autenticado → Login
  if (!isAuthenticated || !activeRole) {
    return <AuthNavigator />;
  }

  // Determinar layout pelo role ativo
  const layoutType = getLayoutType(activeRole);

  switch (layoutType) {
    case 'desktop':
      return <DesktopNavigator />;
    case 'treinador':
      return <TreinadorNavigator />;
    case 'portal':
      return <PortalNavigator />;
    default:
      return <AuthNavigator />;
  }
}
