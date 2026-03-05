import {
  ConnectionProvider,
} from './components/providers/ConnectionProvider';
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
import CompletionScreen from './screens/CompletionScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import TermsScreen from './screens/TermsScreen';
import LicensesScreen from './screens/LicensesScreen';
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

const MAINNET_RPC = 'https://api.mainnet-beta.solana.com';
const TOTAL_MODULES = 10;

export type Screen = 'onboarding' | 'welcome' | 'home' | 'lesson' | 'quiz' | 'complete' | 'badges' | 'leaderboard' | 'completion' | 'privacy' | 'terms' | 'licenses';

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
  const [screen, setScreen] = useState<Screen | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const init = async () => {
      const [onboardingDone, completed, xp, currentStreak] = await Promise.all([
        isOnboardingDone(),
        getCompletedModules(),
        getTotalXP(),
        getStreak(),
      ]);
      setCompletedModules(completed ?? []);
      setTotalXP(xp);
      setStreak(currentStreak);
      setScreen(onboardingDone ? 'home' : 'onboarding');
    };
    init();
  }, []);

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

  const handleModuleCompleteNext = async () => {
    const updated = await getCompletedModules();
    if (updated.length >= TOTAL_MODULES) {
      setScreen('completion');
    } else {
      setScreen('home');
    }
  };

  const handleStartModule = (moduleId: number) => {
    setActiveModuleId(moduleId);
    setScreen('lesson');
  };

  const handlePlayNext = async () => {
    const updated = await getCompletedModules();
    if (updated.length >= TOTAL_MODULES) {
      setScreen('completion');
      return;
    }
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
        { text: 'Reset Everything', style: 'destructive', onPress: async () => {
          await resetAllProgress();
          setCompletedModules([]);
          setTotalXP(0);
          setStreak(0);
          setScreen('onboarding');
        }},
      ]
    );
  };

  if (screen === null) return null;
  if (screen === 'onboarding') return <OnboardingScreen onFinish={handleOnboardingDone} />;
  if (screen === 'privacy') return <PrivacyScreen onBack={() => setScreen('home')} />;
  if (screen === 'terms') return <TermsScreen onBack={() => setScreen('home')} />;
  if (screen === 'licenses') return <LicensesScreen onBack={() => setScreen('home')} />;
  if (!selectedAccount) return <WelcomeScreen />;
  if (screen === 'completion') return <CompletionScreen onBack={() => setScreen('home')} totalXP={totalXP} streak={streak} />;

  if (screen === 'lesson') return (
    <LessonScreen moduleId={activeModuleId} onStartQuiz={() => setScreen('quiz')} onBack={() => setScreen('home')} />
  );
  if (screen === 'quiz') return (
    <QuizScreen moduleId={activeModuleId} onComplete={handleQuizComplete} onBack={() => setScreen('lesson')} />
  );
  if (screen === 'complete' && quizResult) return (
    <ModuleCompleteScreen result={quizResult} onContinue={handleModuleCompleteNext} onRetry={() => setScreen('quiz')} />
  );
  if (screen === 'badges') return (
    <BadgesScreen onBack={() => setScreen('home')} completedModules={completedModules} streak={streak} totalXP={totalXP} />
  );
  if (screen === 'leaderboard') return <LeaderboardScreen onBack={() => setScreen('home')} />;

  return (
    <HomeScreen
      onStartQuiz={handleStartModule}
      onViewBadges={() => setScreen('badges')}
      onViewLeaderboard={() => setScreen('leaderboard')}
      onPlayNext={handlePlayNext}
      onDevReset={handleDevReset}
      onPrivacy={() => setScreen('privacy')}
      onTerms={() => setScreen('terms')}
      onLicenses={() => setScreen('licenses')}
      completedModules={completedModules}
      totalXP={totalXP}
      streak={streak}
    />
  );
}

export default function App() {
  return (
    <ConnectionProvider config={{ commitment: 'confirmed' }} endpoint={MAINNET_RPC}>
      <AuthorizationProvider>
        <AppContent />
      </AuthorizationProvider>
    </ConnectionProvider>
  );
}