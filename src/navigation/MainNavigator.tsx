import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList, MainStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { ModulesScreen } from '../screens/ModulesScreen';
import { TutorScreen } from '../screens/TutorScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ModuleDetailsScreen } from '../screens/ModuleDetailsScreen';
import { ReaderScreen } from '../screens/ReaderScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { QuizResultScreen } from '../screens/QuizResultScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StorageScreen } from '../screens/StorageScreen';
import { AIInfoScreen } from '../screens/AIInfoScreen';
import { EducationLevelScreen } from '../screens/EducationLevelScreen';
import { ClassSelectionScreen } from '../screens/ClassSelectionScreen';
import { LanguageSelectionScreen } from '../screens/LanguageSelectionScreen';
import { ModuleSelectionScreen } from '../screens/ModuleSelectionScreen';
import { ModuleDownloadScreen } from '../screens/ModuleDownloadScreen';
import { palette } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

const TabIcon: React.FC<{ focused: boolean; emoji: string; label: string }> = ({
  focused,
  emoji,
  label,
}) => (
  <View style={tabStyles.container}>
    <Text style={[tabStyles.emoji, focused && tabStyles.emojiFocused]}>{emoji}</Text>
    <Text style={[tabStyles.label, focused ? tabStyles.labelFocused : tabStyles.labelUnfocused]}>
      {label}
    </Text>
  </View>
);

const tabStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  emoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  emojiFocused: {
    transform: [{ scale: 1.15 }],
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
  labelFocused: {
    color: palette.primary,
  },
  labelUnfocused: {
    color: palette.gray500,
  },
});

const BottomTabs: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: palette.white,
          elevation: 2,
          shadowOpacity: 0.08,
        },
        headerTitleStyle: {
          fontWeight: '800',
          color: palette.gray900,
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: palette.white,
          height: 60,
          borderTopColor: palette.gray200,
          borderTopWidth: 1,
          elevation: 8,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Guru Offline',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🏠" label="Home" />,
        }}
      />
      <Tab.Screen
        name="ModulesTab"
        component={ModulesScreen}
        options={{
          title: 'Curriculum Modules',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="📚" label="Modules" />,
        }}
      />
      <Tab.Screen
        name="TutorTab"
        component={TutorScreen}
        options={{
          title: 'AI Tutor (On-Device)',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🤖" label="Tutor" />,
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{
          title: 'Learning Progress',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="📊" label="Progress" />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Student Profile',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="👤" label="Profile" />,
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerStyle: {
          backgroundColor: palette.white,
          elevation: 2,
          shadowOpacity: 0.08,
        },
        headerTintColor: palette.gray900,
        headerTitleStyle: {
          fontWeight: '800',
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tutor"
        component={TutorScreen}
        options={{ title: 'AI Tutor (On-Device)' }}
      />
      <Stack.Screen
        name="Modules"
        component={ModulesScreen}
        options={{ title: 'Curriculum Modules' }}
      />
      <Stack.Screen
        name="ModuleDetails"
        component={ModuleDetailsScreen}
        options={{ title: 'Module Details' }}
      />
      <Stack.Screen
        name="Reader"
        component={ReaderScreen}
        options={{ title: 'Offline Book Reader' }}
      />
      <Stack.Screen
        name="Practice"
        component={PracticeScreen}
        options={{ title: 'Practice Questions' }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ title: 'Curriculum Assessment' }}
      />
      <Stack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{ title: 'Quiz Scorecard', headerLeft: () => null }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Storage"
        component={StorageScreen}
        options={{ title: 'Storage Management' }}
      />
      <Stack.Screen
        name="AIInfo"
        component={AIInfoScreen}
        options={{ title: 'On-Device AI Engine' }}
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
        options={{ title: 'Browse Modules' }}
      />
      <Stack.Screen
        name="ModuleDownload"
        component={ModuleDownloadScreen}
        options={{ title: 'Download Manager' }}
      />
    </Stack.Navigator>
  );
};
