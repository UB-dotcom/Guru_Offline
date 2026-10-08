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
import { BoardSelectionScreen } from '../screens/BoardSelectionScreen';
import { StateSelectionScreen } from '../screens/StateSelectionScreen';
import { StreamSelectionScreen } from '../screens/StreamSelectionScreen';
import { SubjectSelectionScreen } from '../screens/SubjectSelectionScreen';
import { ModuleSelectionScreen } from '../screens/ModuleSelectionScreen';
import { ModuleDownloadScreen } from '../screens/ModuleDownloadScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { palette } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

const TabIcon: React.FC<{ focused: boolean; emoji: string; label: string; isCenter?: boolean }> = ({
  focused,
  emoji,
  label,
  isCenter = false,
}) => {
  if (isCenter) {
    return (
      <View style={tabStyles.centerBtnContainer}>
        <View style={tabStyles.centerBtnGlow}>
          <Text style={tabStyles.centerEmoji}>{emoji}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={tabStyles.container}>
      <Text style={[tabStyles.emoji, focused && tabStyles.emojiFocused]}>{emoji}</Text>
      <Text style={[tabStyles.label, focused ? tabStyles.labelFocused : tabStyles.labelUnfocused]}>
        {label}
      </Text>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  emoji: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.65,
  },
  emojiFocused: {
    transform: [{ scale: 1.15 }],
    opacity: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
  },
  labelFocused: {
    color: palette.primary,
  },
  labelUnfocused: {
    color: palette.gray500,
  },
  centerBtnContainer: {
    top: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBtnGlow: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: palette.white,
  },
  centerEmoji: {
    fontSize: 24,
    color: palette.white,
  },
});

const BottomTabs: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#F6F5FB',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#EDE9FE',
        },
        headerTitleStyle: {
          fontWeight: '800',
          color: '#1E1B4B',
          fontSize: 18,
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 12,
          left: 16,
          right: 16,
          height: 64,
          borderRadius: 32,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: '#EDE9FE',
          elevation: 10,
          shadowColor: '#7C5CFC',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          paddingBottom: 6,
          paddingTop: 6,
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
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="📖" label="Modules" />,
        }}
      />
      <Tab.Screen
        name="TutorTab"
        component={TutorScreen}
        options={{
          title: 'Guru AI Tutor',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="✨" label="Tutor" isCenter />,
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{
          title: 'My Progress',
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
        options={{ title: 'Select Language' }}
      />
      <Stack.Screen
        name="BoardSelection"
        component={BoardSelectionScreen}
        options={{ title: 'Select Board' }}
      />
      <Stack.Screen
        name="StateSelection"
        component={StateSelectionScreen}
        options={{ title: 'Select State' }}
      />
      <Stack.Screen
        name="StreamSelection"
        component={StreamSelectionScreen}
        options={{ title: 'Select Stream' }}
      />
      <Stack.Screen
        name="SubjectSelection"
        component={SubjectSelectionScreen}
        options={{ title: 'Manage Subjects' }}
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
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Curriculum Admin Studio', headerShown: false }}
      />
    </Stack.Navigator>
  );
};
