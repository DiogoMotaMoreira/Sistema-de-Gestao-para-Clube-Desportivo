/**
 * AuthNavigator — Stack Navigator para utilizadores não autenticados.
 *
 * Contém apenas o LoginScreen. Futuramente pode incluir
 * ForgotPasswordScreen, ResetPasswordScreen, etc.
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/auth/LoginScreen';

export type AuthStackParamList = {
  Login: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
