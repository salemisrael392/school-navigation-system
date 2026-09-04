/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { ScheduleView } from './components/ScheduleView';
import { HapticVisualFeedback } from './components/HapticVisualFeedback';
import {
  loadStudentSchedule,
  saveStudentSchedule,
  getCurrentDayOfWeek,
  getNextUpcomingClass,
} from './utils/scheduleHelper';
import { ClassScheduleItem, DayOfWeek, CampusNotification } from './types';
import { triggerHaptic } from './utils/haptics';
import {
  loadNotifications,
  saveNotifications,
  loadNotificationSettings,
  saveNotificationSettings,
  generateContextualAlert,
  triggerPushNotification,
  NotificationSettings,
} from './utils/notificationEngine';
import { PushNotificationBanner } from './components/PushNotificationBanner';

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

  // Push Notifications State & Preferences
  const [notifications, setNotifications] = useState<CampusNotification[]>(() =>
    loadNotifications()
  );
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(() => loadNotificationSettings());
  const [activePushBanner, setActivePushBanner] =
    useState<CampusNotification | null>(null);

  // Student Timetable & Schedule State
  const [scheduleItems, setScheduleItems] = useState<ClassScheduleItem[]>(() =>
    loadStudentSchedule()
  );
  const [currentScheduleDay, setCurrentScheduleDay] = useState<DayOfWeek>(() =>
    getCurrentDayOfWeek()
  );

  const nextClassInfo = getNextUpcomingClass(scheduleItems, currentScheduleDay);

  // Schedule initial real-time push notification showcase
  useEffect(() => {
    const timer = setTimeout(() => {
      // Trigger a live building closure alert to demonstrate real-time push alerting
      const demoAlert = triggerPushNotification(
        {
          title: '🚨 Urgent Closure: Central Library Level 2',
          body: 'HVAC repair & air handling unit maintenance underway until 4:00 PM. Level 1 digital lab and reading pods remain open. Alternate quiet zones in Centenary Bhavan.',
          category: 'closure',
          priority: 'urgent',
          buildingId: 'central-library',
          buildingName: 'Central Library',
          locationTag: 'Central Library',
          actionLabel: 'View on Map',
          source: 'campus_broadcast',
        },
        notificationSettings
      );

      setNotifications((prev) => {
        const next = [demoAlert, ...prev];
        saveNotifications(next);
        return next;
      });
      setActivePushBanner(demoAlert);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddClass = (newItem: Omit<ClassScheduleItem, 'id'>) => {
    const item: ClassScheduleItem = {
      ...newItem,
      id: `class-${Date.now()}`,
    };
    const updated = [...scheduleItems, item];
    setScheduleItems(updated);
    saveStudentSchedule(updated);

    // If schedule alert enabled, confirm timetable sync
    if (notificationSettings.scheduleAlerts) {
      const scheduleNotif = triggerPushNotification(
        {
          title: `🎓 Timetable Synced: ${newItem.subjectName}`,
          body: `Added to your ${newItem.day} schedule (${newItem.startTime}) in ${newItem.buildingName} ${newItem.room}. Auto-routing will be available before class.`,
          category: 'schedule',
          priority: 'normal',
          buildingId: newItem.buildingId,
          buildingName: newItem.buildingName,
          locationTag: newItem.room,
          actionLabel: 'View on Map',
          source: 'schedule_conflict',
        },
        notificationSettings
      );
      setNotifications((prev) => {
        const next = [scheduleNotif, ...prev];
        saveNotifications(next);
        return next;
      });
      setActivePushBanner(scheduleNotif);
    }
  };

  const handleDeleteClass = (id: string) => {
    const updated = scheduleItems.filter((item) => item.id !== id);
    setScheduleItems(updated);
    saveStudentSchedule(updated);
  };

  const handleResetSchedule = () => {
    const defaultData = loadStudentSchedule();
    setScheduleItems(defaultData);
    saveStudentSchedule(defaultData);
  };

  const handleHighlightBuildingOnMap = (buildingId: string, room?: string) => {
    const target = CAMPUS_BUILDINGS.find((b) => b.id === buildingId);
    if (target) {
      setSelectedBuilding(target);
      if (room) {
        setRoomDestination(room);
      }
      setActiveTab('explore');
      triggerHaptic('start_navigation');
    }
  };

  // Location change handler with real-time contextual push alert dispatch
  const handleLocationChange = (newLocation: string) => {
    setUserLocationName(newLocation);

    if (!notificationSettings.locationAlerts) return;

    // Intelligent location-aware push alerts
    if (newLocation === 'Central Library Porch') {
      const alert = triggerPushNotification(
        {
          title: '⚠️ Building Closure: Central Library Level 2',
          body: 'Notice for students at Library Porch: Level 2 reference & journals section is closed for HVAC duct maintenance until 4:00 PM. Ground floor digital pods are open.',
          category: 'closure',
          priority: 'high',
          buildingId: 'central-library',
          buildingName: 'Central Library',
          locationTag: 'Central Library Porch',
          actionLabel: 'View Library Status',
          source: 'location_proximity',
        },
        notificationSettings
      );
      setNotifications((prev) => {
        const next = [alert, ...prev];
        saveNotifications(next);
        return next;
      });
      setActivePushBanner(alert);
    } else if (newLocation === 'Sports Arena Lawn') {
      const alert = triggerPushNotification(
        {
          title: '🏆 Campus Event: Inter-College UAV Drone Trials',
          body: 'You arrived at the Sports Arena! Autonomous robotics drone racing trials are currently underway on the turf. Free student entry & live telemetry screens.',
          category: 'event',
          priority: 'normal',
          buildingId: 'sports-complex',
          buildingName: 'SRU Sports Complex',
          locationTag: 'Sports Arena Lawn',
          actionLabel: 'Explore Arena',
          source: 'location_proximity',
        },
        notificationSettings
      );
      setNotifications((prev) => {
        const next = [alert, ...prev];
        saveNotifications(next);
        return next;
      });
      setActivePushBanner(alert);
    } else if (newLocation === 'Centenary Bhavan Steps') {
      const alert = triggerPushNotification(
        {
          title: '📢 Building Advisory: North Glass Portico Entry',
          body: 'You are at Centenary Bhavan. Main south foyer is reserved for university accreditation guests; student access is through the North Glass Portico.',
          category: 'advisory',
          priority: 'normal',
          buildingId: 'centenary-bhavan',
          buildingName: 'Centenary Bhavan',
          locationTag: 'Centenary Steps',
          actionLabel: 'Route on Map',
          source: 'location_proximity',
        },
        notificationSettings
      );
      setNotifications((prev) => {
        const next = [alert, ...prev];
        saveNotifications(next);
        return next;
      });
      setActivePushBanner(alert);
    } else if (newLocation === 'Near Block A Lawns') {
      const alert = triggerPushNotification(
        {
          title: '🎉 Campus Event: SRiX AI Hackathon Showcase',
          body: 'You are near Block A. 36-hour Generative AI prototype demonstrations are live in the Ground Atrium. Open for student testing and sponsor networking.',
          category: 'event',
          priority: 'normal',
          buildingId: 'srix-block-a',
          buildingName: 'Block A • CSE & IT',
          locationTag: 'Block A Lawns',
          actionLabel: 'Route to Block A',
          source: 'location_proximity',
        },
        notificationSettings
      );
      setNotifications((prev) => {
        const next = [alert, ...prev];
        saveNotifications(next);
        return next;
      });
      setActivePushBanner(alert);
    }
  };

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
    handleLocationChange(locations[nextIndex]);
  };

  // Notification action triggers
  const handleNotificationAction = (notification: CampusNotification) => {
    setActivePushBanner(null);
    setIsNotificationsOpen(false);

    if (notification.buildingId) {
      const target = CAMPUS_BUILDINGS.find((b) => b.id === notification.buildingId);
      if (target) {
        setSelectedBuilding(target);
        if (notification.locationTag && notification.locationTag.toLowerCase().includes('room')) {
          setRoomDestination(notification.locationTag);
        }
        setActiveTab('explore');
        triggerHaptic('start_navigation');
      }
    } else {
      setActiveTab('explore');
    }
  };

  const handleSimulateAlert = (
    type: 'closure' | 'event' | 'schedule' | 'advisory'
  ) => {
    const newNotif = generateContextualAlert(
      type,
      userLocationName,
      nextClassInfo.item,
      notificationSettings
    );
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    saveNotifications(updated);
    setActivePushBanner(newNotif);
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleClearAll = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  const handleDeleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleUpdateSettings = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    saveNotificationSettings(settings);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

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
      {/* On-screen Tactile Haptic Feedback Badge */}
      <HapticVisualFeedback />

      {/* Real-time Push Notification Floating Banner Toast */}
      <PushNotificationBanner
        notification={activePushBanner}
        onDismiss={() => setActivePushBanner(null)}
        onActionClick={handleNotificationAction}
        onOpenNotificationsModal={() => {
          setActivePushBanner(null);
          setIsNotificationsOpen(true);
        }}
      />

      {/* Header bar */}
      <Header
        activeTab={activeTab}
        onChangeTab={setActiveTab}
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
        onOpenSOS={() => setIsSOSOpen(true)}
        hasUpcomingClass={Boolean(nextClassInfo.item)}
        unreadCount={unreadNotificationsCount}
        onVoiceSearch={handleVoiceSearch}
        onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
        isListening={isListening}
      />

      {/* Real-time search suggestions dropdown */}
      {searchQuery.trim() !== '' && (
        <div className="max-w-7xl mx-auto w-full px-3 sm:px-6">
          <div className="mt-2 mb-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-lg z-30 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 px-2 py-0.5 uppercase tracking-wider">
              Matching Locations ({searchResults.length})
            </div>
            {searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => {
                  setSelectedBuilding(result);
                  setSearchQuery('');
                  setActiveTab('explore');
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
        </div>
      )}

      {/* Main Tab Content Switching */}
      {activeTab === 'explore' && (
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            {/* Left Sidebar on Desktop (5 cols, order-2 on mobile so map is on top) */}
            <div className="lg:col-span-5 xl:col-span-5 order-2 lg:order-1 space-y-4">
              {/* Selected Building Detail Card */}
              <LocationBottomSheet
                building={selectedBuilding}
                onStartNavigation={() => setIsNavigationOpen(true)}
                onViewFloorPlan={() => setIsFloorPlanOpen(true)}
                onOpenPhotoGallery={() => setIsPhotoGalleryOpen(true)}
              />

              {/* Quick Action Offline & QR Sync Cards */}
              <BannerCards
                onOpenQRScanner={() => setIsQRScannerOpen(true)}
              />

              {/* Popular Nearby Locations Card Container */}
              <div className="bg-white rounded-3xl border border-[#e2d8c3] overflow-hidden shadow-xs">
                <PopularNearby
                  onSelectBuildingById={handleSelectBuildingById}
                  onViewAllDirectory={() => setActiveTab('directory')}
                />
              </div>
            </div>

            {/* Right Interactive Campus Map Canvas (7 cols, sticky on desktop) */}
            <div className="lg:col-span-7 xl:col-span-7 order-1 lg:order-2 lg:sticky lg:top-[128px]">
              <div className="h-[380px] sm:h-[460px] lg:h-[calc(100vh-160px)] min-h-[460px] w-full rounded-3xl overflow-hidden shadow-sm border border-[#e2d8c3] relative bg-[#ebe4d5]">
                <CampusMap
                  selectedBuilding={selectedBuilding}
                  onSelectBuilding={(building) => {
                    setSelectedBuilding(building);
                    setRoomDestination('');
                  }}
                  onOpenSOS={() => setIsSOSOpen(true)}
                  userLocationName={userLocationName}
                  onCycleUserLocation={handleCycleUserLocation}
                  isNavigatingLive={isNavigationOpen}
                  highlightedNextClass={
                    nextClassInfo.item
                      ? {
                          buildingId: nextClassInfo.item.buildingId,
                          subject: nextClassInfo.item.subjectName,
                          room: nextClassInfo.item.room,
                          time: nextClassInfo.item.startTime,
                          courseCode: nextClassInfo.item.courseCode,
                        }
                      : null
                  }
                  onFocusNextClass={() => {
                    if (nextClassInfo.item) {
                      handleHighlightBuildingOnMap(
                        nextClassInfo.item.buildingId,
                        nextClassInfo.item.room
                      );
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </main>
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

      {activeTab === 'schedule' && (
        <ScheduleView
          scheduleItems={scheduleItems}
          onAddClass={handleAddClass}
          onDeleteClass={handleDeleteClass}
          onResetSchedule={handleResetSchedule}
          onHighlightBuildingOnMap={handleHighlightBuildingOnMap}
          currentDay={currentScheduleDay}
          onChangeDay={setCurrentScheduleDay}
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
      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        hasUpcomingClass={Boolean(nextClassInfo.item)}
      />

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
          handleLocationChange(loc);
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
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
        onDeleteNotification={handleDeleteNotification}
        onSelectNotificationAction={handleNotificationAction}
        settings={notificationSettings}
        onUpdateSettings={handleUpdateSettings}
        onSimulateAlert={handleSimulateAlert}
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
