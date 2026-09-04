/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CAMPUS_BUILDINGS, POPULAR_NEARBY } from './data/campusData';
import { Building, TabType } from './types';
import { DeviceFrame } from './components/DeviceFrame';
import { Header } from './components/Header';
import { BannerCards } from './components/BannerCards';
import { CampusMap } from './components/CampusMap';
import { LocationBottomSheet } from './components/LocationBottomSheet';
import { PopularNearby } from './components/PopularNearby';
import { BottomNavBar } from './components/BottomNavBar';
import { FloorPlanModal } from './components/FloorPlanModal';
import { NavigationModal } from './components/NavigationModal';
import { GuestPassModal } from './components/GuestPassModal';
import { QRScannerModal } from './components/QRScannerModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { NotificationsModal } from './components/NotificationsModal';
import { FilterSheet } from './components/FilterSheet';
import { PhotoGalleryModal } from './components/PhotoGalleryModal';
import { NavigateView } from './components/NavigateView';
import { DirectoryView } from './components/DirectoryView';
import { FreshersView } from './components/FreshersView';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<TabType>('explore');

  // Selected Building
  const [selectedBuilding, setSelectedBuilding] = useState<Building>(
    CAMPUS_BUILDINGS[0] // srix-block-a
  );
  const [roomDestination, setRoomDestination] = useState<string>('');

  // User location & Waypoint
  const [userLocationName, setUserLocationName] = useState<string>(
    'Near Block A Lawns'
  );

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyOpenNow, setOnlyOpenNow] = useState<boolean>(false);
  const [wheelchairAccessible, setWheelchairAccessible] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Modals state
  const [isGuestPassOpen, setIsGuestPassOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isFloorPlanOpen, setIsFloorPlanOpen] = useState<boolean>(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState<boolean>(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState<boolean>(false);
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState<boolean>(false);

  // Cycle user location for demonstration
  const handleCycleUserLocation = () => {
    const locations = [
      'Near Block A Lawns',
      'Main Gate 1 Kiosk',
      'Central Library Porch',
      'Centenary Bhavan Steps',
      'Sports Arena Lawn',
    ];
    const currentIndex = locations.indexOf(userLocationName);
    const nextIndex = (currentIndex + 1) % locations.length;
    setUserLocationName(locations[nextIndex]);
  };

  // Voice Search Handler
  const handleVoiceSearch = () => {
    if (isListening) return;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.start();
        return;
      } catch {
        // fallback to simulation below
      }
    }

    // Voice Simulation fallback
    setIsListening(true);
    setTimeout(() => {
      const sampleQueries = ['AI Lab Level 2', 'Library', 'Centenary Bhavan', 'Canteen'];
      const picked =
        sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      setSearchQuery(picked);
      setIsListening(false);
    }, 1500);
  };

  // Select building by ID
  const handleSelectBuildingById = (buildingId: string) => {
    const found = CAMPUS_BUILDINGS.find((b) => b.id === buildingId);
    if (found) {
      setSelectedBuilding(found);
      setRoomDestination('');
    }
  };

  // Filtered buildings for search dropdown
  const searchResults = searchQuery.trim()
    ? CAMPUS_BUILDINGS.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.facilities.some((f) =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : [];

  return (
    <DeviceFrame>
      {/* Header bar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (cat !== 'all') {
            const found = CAMPUS_BUILDINGS.find((b) => b.category === cat);
            if (found) setSelectedBuilding(found);
          }
        }}
        onOpenGuestPass={() => setIsGuestPassOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onVoiceSearch={handleVoiceSearch}
        onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
        isListening={isListening}
      />

      {/* Real-time search suggestions dropdown */}
      {searchQuery.trim() !== '' && (
        <div className="mx-3 sm:mx-4 mt-2 mb-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-lg z-30 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 px-2 py-0.5 uppercase tracking-wider">
            Matching Locations ({searchResults.length})
          </div>
          {searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => {
                setSelectedBuilding(result);
                setSearchQuery('');
              }}
              className="p-2 rounded-xl hover:bg-[#eff4ff] flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-[#000923]">{result.name}</p>
                <p className="text-[10px] text-slate-500">{result.subtitle}</p>
              </div>
              <span className="text-[10px] text-slate-400">
                {result.distanceMeters}m
              </span>
            </div>
          ))}
          {searchResults.length === 0 && (
            <div className="p-3 text-center text-xs text-slate-500">
              No campus locations found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      )}

      {/* Main Tab Content Switching */}
      {activeTab === 'explore' && (
        <div className="flex-1 flex flex-col">
          {/* Quick Action Banner Cards */}
          <BannerCards
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
          />

          {/* Interactive Campus Vector Map */}
          <CampusMap
            selectedBuilding={selectedBuilding}
            onSelectBuilding={(building) => {
              setSelectedBuilding(building);
              setRoomDestination('');
            }}
            onOpenSOS={() => setIsSOSOpen(true)}
            userLocationName={userLocationName}
            onCycleUserLocation={handleCycleUserLocation}
          />

          {/* Location Bottom Sheet Card */}
          <LocationBottomSheet
            building={selectedBuilding}
            onStartNavigation={() => setIsNavigationOpen(true)}
            onViewFloorPlan={() => setIsFloorPlanOpen(true)}
            onOpenPhotoGallery={() => setIsPhotoGalleryOpen(true)}
          />

          {/* Popular Nearby Carousel */}
          <PopularNearby
            onSelectBuildingById={handleSelectBuildingById}
            onViewAllDirectory={() => setActiveTab('directory')}
          />
        </div>
      )}

      {activeTab === 'navigate' && (
        <NavigateView
          onStartRoute={(building) => {
            setSelectedBuilding(building);
            setIsNavigationOpen(true);
          }}
          userLocationName={userLocationName}
        />
      )}

      {activeTab === 'directory' && (
        <DirectoryView
          onSelectBuilding={(building) => {
            setSelectedBuilding(building);
            setActiveTab('explore');
          }}
          onNavigateToBuilding={(building) => {
            setSelectedBuilding(building);
            setIsNavigationOpen(true);
          }}
        />
      )}

      {activeTab === 'freshers' && <FreshersView />}

      {/* Bottom Sticky Navigation Tabs */}
      <BottomNavBar activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Modals & Overlays */}
      <FloorPlanModal
        building={selectedBuilding}
        isOpen={isFloorPlanOpen}
        onClose={() => setIsFloorPlanOpen(false)}
        onNavigateToRoom={(room) => {
          setRoomDestination(room);
          setIsNavigationOpen(true);
        }}
      />

      <NavigationModal
        destination={selectedBuilding}
        roomDestination={roomDestination}
        isOpen={isNavigationOpen}
        onClose={() => setIsNavigationOpen(false)}
      />

      <GuestPassModal
        isOpen={isGuestPassOpen}
        onClose={() => setIsGuestPassOpen(false)}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onLocationDetected={(loc) => {
          setUserLocationName(loc);
        }}
      />

      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        userLocationName={userLocationName}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onlyOpenNow={onlyOpenNow}
        onToggleOpenNow={() => setOnlyOpenNow(!onlyOpenNow)}
        wheelchairAccessible={wheelchairAccessible}
        onToggleWheelchair={() => setWheelchairAccessible(!wheelchairAccessible)}
      />

      <PhotoGalleryModal
        building={selectedBuilding}
        isOpen={isPhotoGalleryOpen}
        onClose={() => setIsPhotoGalleryOpen(false)}
        onStartNavigation={() => setIsNavigationOpen(true)}
      />
    </DeviceFrame>
  );
}
