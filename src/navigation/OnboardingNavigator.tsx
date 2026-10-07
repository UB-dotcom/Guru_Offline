import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingStackParamList } from './types';
import { LanguageSelectionScreen } from '../screens/LanguageSelectionScreen';
import { BoardSelectionScreen } from '../screens/BoardSelectionScreen';
import { StateSelectionScreen } from '../screens/StateSelectionScreen';
import { ClassSelectionScreen } from '../screens/ClassSelectionScreen';
import { StreamSelectionScreen } from '../screens/StreamSelectionScreen';
import { SubjectSelectionScreen } from '../screens/SubjectSelectionScreen';
import { ModuleSelectionScreen } from '../screens/ModuleSelectionScreen';
import { ModuleDownloadScreen } from '../screens/ModuleDownloadScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { EducationLevelScreen } from '../screens/EducationLevelScreen';
import { palette } from '../theme/colors';

const Stack = createStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="LanguageSelection"
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
        name="LanguageSelection"
        component={LanguageSelectionScreen}
        options={{ title: '1. Select Language' }}
      />
      <Stack.Screen
        name="BoardSelection"
        component={BoardSelectionScreen}
        options={{ title: '2. Education Board' }}
      />
      <Stack.Screen
        name="StateSelection"
        component={StateSelectionScreen}
        options={{ title: 'State Board' }}
      />
      <Stack.Screen
        name="ClassSelection"
        component={ClassSelectionScreen}
        options={{ title: '3. Select Class' }}
      />
      <Stack.Screen
        name="StreamSelection"
        component={StreamSelectionScreen}
        options={{ title: '4. Select Stream' }}
      />
      <Stack.Screen
        name="SubjectSelection"
        component={SubjectSelectionScreen}
        options={{ title: '5. Select Subjects' }}
      />
      <Stack.Screen
        name="ModuleSelection"
        component={ModuleSelectionScreen}
        options={{ title: '6. Curriculum Modules' }}
      />
      <Stack.Screen
        name="ModuleDownload"
        component={ModuleDownloadScreen}
        options={{ title: 'Download Offline Modules' }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{ title: 'Student Profile' }}
      />
      <Stack.Screen
        name="EducationLevel"
        component={EducationLevelScreen}
        options={{ title: 'Education Level' }}
      />
    </Stack.Navigator>
  );
};
