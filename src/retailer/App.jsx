import React, { useState } from 'react';
import LeftNav from './components/LeftNav';
import TopBar from './components/TopBar';
import StatCards from './components/StatCards';
import Charts from './components/Charts';
import CampaignsTable from './components/CampaignsTable';
import DeviceTable from './components/DeviceTable';
import ReferrerTable from './components/ReferrerTable';
import GeoTable from './components/GeoTable';
import HomePage from './components/HomePage';
import AdvertisersPage from './components/AdvertisersPage';
import LiveAnalyticsPage from './components/LiveAnalyticsPage';
import DemandSupplyPage from './components/DemandSupplyPage';
import AdvertiserInsightsPage from './components/AdvertiserInsightsPage';
import SegmentManagerPage from './components/SegmentManagerPage';
import ManageSegmentsPage from './components/ManageSegmentsPage';
import ScheduledReportsPage from './components/ScheduledReportsPage';
import HealthReportPage from './components/HealthReportPage';
import SellerAdvertiserOnboardingPage from './components/SellerAdvertiserOnboardingPage';
import BrandAdvertiserOnboardingPage from './components/BrandAdvertiserOnboardingPage';
import SuperAdminUsersPage from './components/SuperAdminUsersPage';
import AdminUserPage from './components/AdminUserPage';
import AdvertiserUserRolePage from './components/AdvertiserUserRolePage';
import OpsUsersPage from './components/OpsUsersPage';
import AdvertiserUsersPage from './components/AdvertiserUsersPage';
import ActivityLogPage from './components/ActivityLogPage';
import PersonaConfigPage from './components/PersonaConfigPage';
import PersonaAllocationPage from './components/PersonaAllocationPage';
import WalletRulesPage from './components/WalletRulesPage';
import FinanceDashboardPage from './components/FinanceDashboardPage';
import WalletTopUpPage from './components/WalletTopUpPage';
import FinanceAdvertiserManagementPage from './components/FinanceAdvertiserManagementPage';
import ManageAttributesPage from './components/ManageAttributesPage';
import ManageCPMRulesPage from './components/ManageCPMRulesPage';
import DeveloperSettingsPage from './components/DeveloperSettingsPage';
import ManageAttributeTargetingPage from './components/ManageAttributeTargetingPage';
import AccountManagerMappingPage from './components/AccountManagerMappingPage';
import AttributionOverridesPage from './components/AttributionOverridesPage';
import AutomatedRulesPage from './components/AutomatedRulesPage';
import ProductCatalogPage from './components/ProductCatalogPage';
import AppStorePage from './components/AppStorePage';
import DisplayAdsAnalyticsPage from './components/DisplayAdsAnalyticsPage';
import SponsoredAdsAnalyticsPage from './components/SponsoredAdsAnalyticsPage';
import ProductAdsAnalyticsPage from './components/ProductAdsAnalyticsPage';
import DisplayAdsCampaignsPage from './components/DisplayAdsCampaignsPage';
import ProductAdsYieldControlPage from './components/ProductAdsYieldControlPage';
import CPMYieldControlPage from './components/CPMYieldControlPage';
import ProductAdsKeywordBidPage from './components/ProductAdsKeywordBidPage';
import ProductAdsBulkActionsPage from './components/ProductAdsBulkActionsPage';
import ProductAdsLivePage from './components/ProductAdsLivePage';
import SponsoredAdsCampaignsPage from './components/SponsoredAdsCampaignsPage';
import SponsoredAdsInventoryPage from './components/SponsoredAdsInventoryPage';
import ProductAdsDemandSupplyPage from './components/ProductAdsDemandSupplyPage';
import DisplayAdsDemandSupplyPage from './components/DisplayAdsDemandSupplyPage';
import SponsoredAdsDemandSupplyPage from './components/SponsoredAdsDemandSupplyPage';
import MerchantManagementPage from './components/MerchantManagementPage';
import AdvertiserManagementPage from './components/AdvertiserManagementPage';
import AdvertiserOnboardingCatalogPage from './components/AdvertiserOnboardingCatalogPage';
import CatalogStatusPage from './components/CatalogStatusPage';
import DisplayAdsBulkPage from './components/DisplayAdsBulkPage';
import DisplayAdsAdFormatPage from './components/DisplayAdsAdFormatPage';
import DisplayAdsInventoryMgmtPage from './components/DisplayAdsInventoryMgmtPage';
import DevelopSettingsPage from './components/DevelopSettingsPage';
import SetupDetailsPage from './components/SetupDetailsPage';
import BYOTAdminConfigPage from './components/BYOTAdminConfigPage';

/* ── Analytics dashboard (the original page) ─────────────────── */
function AnalyticsDashboard({ bare = false }) {
  if (bare) {
    return (
      <div style={{ padding: '24px', fontFamily: "'Open Sans', sans-serif", color: 'var(--osmos-fg-muted)', fontSize: 14 }}>
        Page coming soon…
      </div>
    );
  }
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <TopBar section="Analytics" page="Sponsored Ads" />
      <main style={{ flex: 1, padding: '24px 24px 40px', overflowY: 'auto' }}>
        <StatCards />
        <Charts />
        <CampaignsTable />
        <DeviceTable />
        <ReferrerTable />
        <GeoTable />
      </main>
    </div>
  );
}

/* ── Root ─────────────────────────────────────────────────────── */
export default function App() {
  const [activePage, setActivePage] = useState('home');

  function renderPage() {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'control-center':
        return <AdvertisersPage />;
      case 'manage-segments':
        return (
          <>
            <TopBar section="Control Center" page="Manage Segment" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ManageSegmentsPage />
            </main>
          </>
        );
      case 'advertiser-insights':
        return (
          <>
            <TopBar section="Analytics" page="Advertiser Insights" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AdvertiserInsightsPage />
            </main>
          </>
        );
      case 'live-insights':
        return (
          <>
            <TopBar section="Analytics" page="Live Insights" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <LiveAnalyticsPage />
            </main>
          </>
        );
      case 'demand-supply':
        return (
          <>
            <TopBar section="Analytics" page="Demand & Supply" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <DemandSupplyPage />
            </main>
          </>
        );
      case 'scheduled-reports':
        return (
          <>
            <TopBar section="Analytics" page="Scheduled Reports" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ScheduledReportsPage />
            </main>
          </>
        );
      case 'bu-analytics':
        return (
          <>
            <TopBar section="Analytics" page="BU Analytics" />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AnalyticsDashboard bare />
            </main>
          </>
        );
      case 'brand-onboarding':
        return (
          <>
            <TopBar section="Control Center" page="Brand Advertiser Onboarding" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <BrandAdvertiserOnboardingPage />
            </main>
          </>
        );
      case 'seller-onboarding':
        return (
          <>
            <TopBar section="Control Center" page="Seller Advertiser Onboarding" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <SellerAdvertiserOnboardingPage />
            </main>
          </>
        );
      case 'super-admin':
        return (
          <>
            <TopBar section="Control Center" page="Super Admin Users" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <SuperAdminUsersPage />
            </main>
          </>
        );
      case 'ops-users':
        return (
          <>
            <TopBar section="Control Center" page="Ops Users" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <OpsUsersPage />
            </main>
          </>
        );
      case 'advertiser-users':
        return (
          <>
            <TopBar section="Control Center" page="Advertiser Users" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AdvertiserUsersPage />
            </main>
          </>
        );
      case 'activity-log':
      case 'event-logs':
      case 'product-ads-request-logs':
      case 'display-ads-request-logs':
        return (
          <>
            <TopBar section="Control Center" page="Activity Log" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ActivityLogPage />
            </main>
          </>
        );
      case 'persona-config':
        return (
          <>
            <TopBar section="Control Center" page="Persona Configuration" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <PersonaConfigPage />
            </main>
          </>
        );
      case 'persona-allocation':
        return (
          <>
            <TopBar section="Control Center" page="Advertiser Persona Allocation" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <PersonaAllocationPage />
            </main>
          </>
        );
      case 'wallet-rules':
        return (
          <>
            <TopBar section="Control Center" page="Wallet Rules" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <WalletRulesPage />
            </main>
          </>
        );
      case 'finance-dashboard':
        return (
          <>
            <TopBar section="Finance" page="Finance Dashboard" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <FinanceDashboardPage />
            </main>
          </>
        );
      case 'wallet-topup':
        return (
          <>
            <TopBar section="Finance" page="Wallet Top Up" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <WalletTopUpPage />
            </main>
          </>
        );
      case 'finance-advertisers':
        return (
          <>
            <TopBar section="Finance" page="Advertiser Management" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <FinanceAdvertiserManagementPage />
            </main>
          </>
        );
      case 'overview':
      case 'budget-health':
      case 'delivery-health':
        return (
          <>
            <TopBar section="Health" page="Health Report" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <HealthReportPage />
            </main>
          </>
        );
      case 'manage-attributes':
        return (
          <>
            <TopBar section="Control Center" page="Manage Attributes" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ManageAttributesPage />
            </main>
          </>
        );
      case 'manage-cpm-rules':
        return (
          <>
            <TopBar section="Control Center" page="Manage CPM Rules" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ManageCPMRulesPage />
            </main>
          </>
        );
      case 'debug-console':
        return (
          <>
            <TopBar section="Control Center" page="Event Debugging" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <DeveloperSettingsPage />
            </main>
          </>
        );
      case 'attribute-targeting':
        return (
          <>
            <TopBar section="Control Center" page="Manage Activity Targeting" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ManageAttributeTargetingPage />
            </main>
          </>
        );
      case 'account-manager-mapping':
        return (
          <>
            <TopBar section="Control Center" page="Advertiser Account Manager Mapping" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AccountManagerMappingPage />
            </main>
          </>
        );
      case 'attribution-overrides':
        return (
          <>
            <TopBar section="Control Center" page="Attribution Overrides" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AttributionOverridesPage />
            </main>
          </>
        );
      case 'admin-user-role':
        return (
          <>
            <TopBar section="Control Center" page="Admin User" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AdminUserPage />
            </main>
          </>
        );
      case 'advertiser-user-role':
        return (
          <>
            <TopBar section="Control Center" page="Advertiser User" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AdvertiserUserRolePage />
            </main>
          </>
        );
      case 'automated-rules':
        return (
          <>
            <TopBar section="Control Center" page="Automated Rules" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AutomatedRulesPage />
            </main>
          </>
        );
      case 'advertisers':
      case 'advertiser-management':
        return (
          <>
            <TopBar section="Control Center" page="Advertiser Management" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AdvertiserManagementPage />
            </main>
          </>
        );
      case 'merchant-management':
        return (
          <>
            <TopBar section="Control Center" page="Merchant Management" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AdvertiserManagementPage />
            </main>
          </>
        );
      case 'segment-manager':
        return (
          <>
            <TopBar section="Control Center" page="Segment Manager" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <SegmentManagerPage />
            </main>
          </>
        );
      case 'advertiser-onboarding-catalog':
        return (
          <>
            <TopBar section="Control Center" page="Advertiser Onboarding & Catalog Management" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AdvertiserOnboardingCatalogPage />
            </main>
          </>
        );
      case 'catalog-status':
        return (
          <>
            <TopBar section="Control Center" page="Catalog Status" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <CatalogStatusPage />
            </main>
          </>
        );
      case 'develop-settings':
        return (
          <>
            <TopBar section="Control Center" page="Develop Settings" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <DevelopSettingsPage />
            </main>
          </>
        );
      case 'setup-details':
        return (
          <>
            <TopBar section="Control Center" page="Setup Details" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <SetupDetailsPage />
            </main>
          </>
        );
      case 'product-catalog':
        return (
          <>
            <TopBar section="Control Center" page="Product Catalog" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ProductCatalogPage />
            </main>
          </>
        );
      case 'app-store':
        return (
          <>
            <TopBar section="Apps" page="App Store" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <AppStorePage />
            </main>
          </>
        );
      case 'display-ads-analytics':
      case 'display-ads-live':
        return (
          <>
            <TopBar section="Display Ads" page="Ad Server Analytics" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <DisplayAdsAnalyticsPage />
            </main>
          </>
        );
      case 'display-ads-demand-supply':
        return (
          <>
            <TopBar section="Display Ads" page="Demand & Supply" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <DisplayAdsDemandSupplyPage />
            </main>
          </>
        );
      case 'display-ads-campaigns':
        return (
          <>
            <TopBar section="Display Ads" page="Campaign Review" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <DisplayAdsCampaignsPage />
            </main>
          </>
        );
      case 'display-ads-bulk':
        return (
          <>
            <TopBar section="Display Ads" page="Campaign Bulk Management" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <DisplayAdsBulkPage />
            </main>
          </>
        );
      case 'display-ads-ad-format':
        return (
          <>
            <TopBar section="Display Ads" page="Ad Format Setup" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <DisplayAdsAdFormatPage />
            </main>
          </>
        );
      case 'display-ads-inventory':
        return (
          <>
            <TopBar section="Display Ads" page="Inventory Management" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg)' }}>
              <DisplayAdsInventoryMgmtPage />
            </main>
          </>
        );
      case 'sponsored-ads-analytics':
      case 'sponsored-ads-live':
        return (
          <>
            <TopBar section="Sponsored Ads" page="Ad Server Analytics" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <SponsoredAdsAnalyticsPage />
            </main>
          </>
        );
      case 'sponsored-ads-demand-supply':
        return (
          <>
            <TopBar section="Sponsored Ads" page="Demand & Supply" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <SponsoredAdsDemandSupplyPage />
            </main>
          </>
        );
      case 'product-ads-analytics':
        return (
          <>
            <TopBar section="Product Ads" page="Ad Server Analytics" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ProductAdsAnalyticsPage />
            </main>
          </>
        );
      case 'product-ads-demand-supply':
        return (
          <>
            <TopBar section="Product Ads" page="Demand & Supply" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ProductAdsDemandSupplyPage />
            </main>
          </>
        );
      case 'product-ads-live':
        return (
          <>
            <TopBar section="Product Ads" page="Live Insights" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ProductAdsLivePage />
            </main>
          </>
        );
      case 'product-ads-yield':
        return (
          <>
            <TopBar section="Product Ads" page="CPC Yield Control" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ProductAdsYieldControlPage />
            </main>
          </>
        );
      case 'product-ads-yield-cpm':
        return (
          <>
            <TopBar section="Product Ads" page="CPM Yield Control" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <CPMYieldControlPage />
            </main>
          </>
        );
      case 'product-ads-keyword':
        return (
          <>
            <TopBar section="Product Ads" page="Keyword Bid Settings" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ProductAdsKeywordBidPage />
            </main>
          </>
        );
      case 'product-ads-bulk':
        return (
          <>
            <TopBar section="Product Ads" page="Campaign Bulk Actions" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <ProductAdsBulkActionsPage />
            </main>
          </>
        );
      case 'sponsored-ads-campaigns':
        return (
          <>
            <TopBar section="Sponsored Ads" page="Campaign Review" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <SponsoredAdsCampaignsPage />
            </main>
          </>
        );
      case 'sponsored-ads-inventory':
        return (
          <>
            <TopBar section="Sponsored Ads" page="Inventory Setup" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <SponsoredAdsInventoryPage />
            </main>
          </>
        );
      case 'byot-config':
        return (
          <>
            <TopBar section="BYOT" page="Configuration" onNavigate={setActivePage} />
            <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
              <BYOTAdminConfigPage />
            </main>
          </>
        );
      default:
        return <AnalyticsDashboard />;
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--osmos-bg-subtle)' }}>
      <LeftNav activePage={activePage} onPageChange={setActivePage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {renderPage()}
      </div>
    </div>
  );
}
