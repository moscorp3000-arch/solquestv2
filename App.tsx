import {
  ConnectionProvider,
  RPC_ENDPOINT,
} from './components/providers/ConnectionProvider';
import { clusterApiUrl } from '@solana/web3.js';
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { AuthorizationProvider, useAuthorization } from './components/providers/AuthorizationProvider';
import OnboardingScreen from './screens/OnboardingScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import LessonScreen from './screens/LessonScreen';
import QuizScreen from './screens/QuizScreen';
import ModuleCompleteScreen from './screens/ModuleCompleteScreen';
import BadgesScreen from './screens/BadgesScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import {
  getCompletedModules,
  completeModule,
  getTotalXP,
  addXP,
  getStreak,
  updateStreak,
  getNextUnlockedModule,
  isOnboardingDone,
  setOnboardingDone,
  resetAllProgress,
} from './src/progress';

export type Screen = 'onboarding' | 'welcome' | 'home' | 'lesson' | 'quiz' | 'complete' | 'badges' | 'leaderboard';

export type QuizResult = {
  moduleId: number;
  moduleTitle: string;
  score: number;
  total: number;
  xp: number;
  streak: number;
};

function AppContent() {
  const { selectedAccount } = useAuthorization();
  const [screen, setScreen] = useState<Screen | null>(null); // null = loading
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<number>(1);

  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);

  // On mount — check onboarding + load progress
  useEffect(() => {
    const init = async () => {
      const [onboardingDone, completed, xp, currentStreak] = await Promise.all([
        isOnboardingDone(),
        getCompletedModules(),
        getTotalXP(),
        getStreak(),
      ]);
      setCompletedModules(completed);
      setTotalXP(xp);
      setStreak(currentStreak);

      if (!onboardingDone) {
        setScreen('onboarding');
      } else {
        // wallet check happens via selectedAccount
        setScreen('home');
      }
    };
    init();
  }, []);

  // If wallet disconnects, go to welcome
  useEffect(() => {
    if (screen !== null && screen !== 'onboarding' && !selectedAccount) {
      setScreen('welcome');
    }
  }, [selectedAccount]);

  const handleOnboardingDone = async () => {
    await setOnboardingDone();
    setScreen('welcome');
  };

  const handleQuizComplete = async (result: QuizResult) => {
    await completeModule(result.moduleId);
    const newXP = await addXP(result.xp);
    const newStreak = await updateStreak();
    const updated = await getCompletedModules();
    setCompletedModules(updated);
    setTotalXP(newXP);
    setStreak(newStreak);
    setQuizResult({ ...result, streak: newStreak });
    setScreen('complete');
  };

  const handleStartModule = (moduleId: number) => {
    setActiveModuleId(moduleId);
    setScreen('lesson');
  };

  const handlePlayNext = async () => {
    const nextModule = await getNextUnlockedModule();
    setActiveModuleId(nextModule);
    setScreen('lesson');
  };

  const handleDevReset = () => {
    Alert.alert(
      '🔧 Dev Reset',
      'Reset all progress, XP, streak and onboarding?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            await resetAllProgress();
            setCompletedModules([]);
            setTotalXP(0);
            setStreak(0);
            setScreen('onboarding');
          },
        },
      ]
    );
  };

  // Loading
  if (screen === null) return null;

  if (screen === 'onboarding') {
    return <OnboardingScreen onFinish={handleOnboardingDone} />;
  }

  if (!selectedAccount) {
    return <WelcomeScreen />;
  }

  if (screen === 'lesson') {
    return (
      <LessonScreen
        moduleId={activeModuleId}
        onStartQuiz={() => setScreen('quiz')}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'quiz') {
    return (
      <QuizScreen
        moduleId={activeModuleId}
        onComplete={handleQuizComplete}
        onBack={() => setScreen('lesson')}
      />
    );
  }

  if (screen === 'complete' && quizResult) {
    return (
      <ModuleCompleteScreen
        result={quizResult}
        onContinue={() => setScreen('home')}
        onRetry={() => setScreen('quiz')}
      />
    );
  }

  if (screen === 'badges') {
    return (
      <BadgesScreen
        onBack={() => setScreen('home')}
        completedModules={completedModules}
        streak={streak}
        totalXP={totalXP}
      />
    );
  }

  if (screen === 'leaderboard') {
    return <LeaderboardScreen onBack={() => setScreen('home')} />;
  }

  return (
    <HomeScreen
      onStartQuiz={handleStartModule}
      onViewBadges={() => setScreen('badges')}
      onViewLeaderboard={() => setScreen('leaderboard')}
      onPlayNext={handlePlayNext}
      onDevReset={handleDevReset}
      completedModules={completedModules}
      totalXP={totalXP}
      streak={streak}
    />
  );
}

export default function App() {
  return (
    <ConnectionProvider
      config={{ commitment: 'processed' }}
      endpoint={clusterApiUrl(RPC_ENDPOINT)}>
      <AuthorizationProvider>
        <AppContent />
      </AuthorizationProvider>
    </ConnectionProvider>
  );
}