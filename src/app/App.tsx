import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { BeanBankDashboard } from './components/BeanBankDashboard';
import { ReferralAccountDashboard } from './components/ReferralAccountDashboard';
import { MobileH5View } from './components/MobileH5View';
import { ComplianceDashboard } from './components/ComplianceDashboard';
import { BeanExchangeOperationDashboard } from './components/BeanExchangeOperationDashboard';
import { WalletCustodyScreen } from './components/WalletCustodyScreen';
type UserRole = 'beanbank' | 'fi-referral' | 'admin' | null;
type Screen = 'login' | 'dashboard' | 'h5' | 'wallet' | 'compliance';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [previousScreen, setPreviousScreen] = useState<Screen>('dashboard');

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentScreen('dashboard');
  };

  const handleSwitchRole = () => {
    setUserRole(null);
    setCurrentScreen('login');
  };

  const handleNavigate = (screen: Screen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setCurrentScreen(previousScreen);
  };

  const renderScreen = () => {
    if (currentScreen === 'login') {
      return <LoginScreen onLogin={handleLogin} />;
    }
    if (currentScreen === 'h5') {
      return <MobileH5View onBack={handleBack} />;
    }
    if (currentScreen === 'wallet') {
      return <WalletCustodyScreen onSwitchRole={handleSwitchRole} onBack={handleBack} />;
    }
    if (currentScreen === 'compliance') {
      return <ComplianceDashboard onSwitchRole={handleSwitchRole} onBack={handleBack} />;
    }
    if (userRole === 'beanbank') {
      return (
        <BeanBankDashboard
          onSwitchRole={handleSwitchRole}
          onNavigate={(screen) => handleNavigate(screen)}
        />
      );
    }
    if (userRole === 'fi-referral') {
      return (
        <ReferralAccountDashboard
          onSwitchRole={handleSwitchRole}
        />
      );
    }
    if (userRole === 'admin') {
      return (
        <BeanExchangeOperationDashboard
          onSwitchRole={handleSwitchRole}
          onNavigate={(screen) => handleNavigate(screen)}
        />
      );
    }
    return null;
  };

  return (
    <>
      {renderScreen()}
    </>
  );
}