import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingStackParamList } from './types';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { EducationLevelScreen } from '../screens/EducationLevelScreen';
import { ClassSelectionScreen } from '../screens/ClassSelectionScreen';
import { LanguageSelectionScreen } from '../screens/LanguageSelectionScreen';
import { ModuleSelectionScreen } from '../screens/ModuleSelectionScreen';
import { ModuleDownloadScreen } from '../screens/ModuleDownloadScreen';
import { palette } from '../theme/colors';

const Stack = createStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileSetup"
      screenOptions={{
        headerStyle: {
          backgroundColor: palette.white,
          elevation: 1,
          shadowOpacity: 0.1,
        },
        headerTintColor: palette.gray900,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{ title: 'Student Setup' }}
      />
      <Stack.Screen
        name="EducationLevel"
        component={EducationLevelScreen}
        options={{ title: 'Select Education Level' }}
      />
      <Stack.Screen
        name="ClassSelection"
        component={ClassSelectionScreen}
        options={{ title: 'Select Class' }}
      />
      <Stack.Screen
        name="LanguageSelection"
        component={LanguageSelectionScreen}
        options={{ title: 'Select Medium' }}
      />
      <Stack.Screen
        name="ModuleSelection"
        component={ModuleSelectionScreen}
        options={{ title: 'Curriculum Modules' }}
      />
      <Stack.Screen
        name="ModuleDownload"
        component={ModuleDownloadScreen}
        options={{ title: 'Download Modules' }}
      />
    </Stack.Navigator>
  );
};
