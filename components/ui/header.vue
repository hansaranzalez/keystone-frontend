<template>
    <header
      class="fixed top-0 left-0 right-0 z-50 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
    >
      <div class="mx-auto w-full max-w-full px-2">
        <div class="flex h-16 items-center justify-between">
          <!-- Left section: Hamburger menu and Logo -->
          <div class="flex items-center">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-lucide-menu"
              class="mr-2 cursor-pointer"
              aria-label="Main menu"
              @click="toggleMobileMenu"
            />
            
            <!-- Logo - centered on mobile, next to hamburger on desktop -->
            <div class="md:ml-2 md:static md:left-auto md:transform-none absolute left-1/2 transform -translate-x-1/2 md:hidden">
              <span class="text-xl font-bold text-primary-600 dark:text-primary-500">{{ $t('appName') }}</span>
            </div>
            
            <!-- Desktop logo -->
            <div class="hidden md:block">
              <span class="text-xl font-bold text-primary-600 dark:text-primary-500">{{ $t('appName') }}</span>
            </div>
          </div>
  
          <!-- Right section: Avatar and notifications -->
          <div class="flex items-center space-x-1 sm:space-x-3">
            <!-- User avatar with popover -->
            <UPopover :ui="{ width: 'w-72' }" mode="click">
              <UButton 
                color="gray" 
                variant="ghost" 
                class="rounded-full min-w-0 p-1.5"
              >
                <div class="flex items-center">
                  <UAvatar
                    :alt="currentUser.name"
                    :src="currentUser.avatar"
                    size="sm"
                    class="mr-0 lg:mr-2"
                  />
                  <span class="hidden lg:inline text-sm font-medium">{{ currentUser.name }}</span>
                </div>
              </UButton>
              
              <template #content>
                <div class="p-0">
                  <!-- User info section -->
                  <div class="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div class="flex items-center">
                      <UAvatar
                        :alt="currentUser.name"
                        :src="currentUser.avatar"
                        size="md"
                        class="mr-3"
                      />
                      <div>
                        <div class="font-medium">{{ currentUser.name }}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">{{ currentUser.email }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Menu items -->
                  <div class="py-1">
                    <UButton 
                      v-for="(item, index) in userMenuItems" 
                      :key="index"
                      block
                      :color="item.active ? 'primary' : 'gray'" 
                      :variant="item.active ? 'soft' : 'ghost'" 
                      :to="item.to"
                      class="justify-start px-4 py-2 text-left"
                      @click="item.click ? item.click() : null"
                    >
                      <UIcon :name="item.icon" class="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
                      {{ item.label }}
                    </UButton>
                  </div>
                </div>
              </template>
            </UPopover>
  
            <!-- Language switcher -->
            <UiLanguageSwitcher />

            <!-- Notification bell with popover -->
            <UPopover :ui="{ width: 'w-80' }" mode="click">
              <UButton
                color="gray"
                variant="ghost"
                class="relative min-w-0 p-1.5"
                aria-label="Notifications"
              >
                <UIcon name="i-lucide-bell" class="h-5 w-5" />
                <UBadge
                  v-if="unreadNotificationsCount > 0"
                  color="error"
                  size="xs"
                  class="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center"
                >
                  {{ unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }}
                </UBadge>
              </UButton>
              
              <template #content>
                <div class="p-0">
                  <!-- Header -->
                  <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 class="text-sm font-medium">{{ $t('notifications.title') }}</h3>
                    <UButton 
                      v-if="unreadNotificationsCount > 0" 
                      variant="ghost" 
                      color="gray" 
                      size="xs"
                      @click="markAllAsRead"
                    >
                      {{ $t('notifications.markAllAsRead') }}
                    </UButton>
                  </div>
                  
                  <!-- Notification items -->
                  <div class="max-h-96 overflow-auto">
                    <div 
                      v-for="(item, index) in notificationItems" 
                      :key="index"
                      class="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                      :class="{ 'bg-primary-50 dark:bg-primary-950/30': !item.read }"
                    >
                      <div class="font-medium text-sm">{{ item.title }}</div>
                      <div class="text-xs text-slate-500 dark:text-slate-400">{{ item.time }}</div>
                    </div>
                    
                    <div v-if="notificationItems.length === 0" class="px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                      {{ $t('notifications.empty') }}
                    </div>
                  </div>
                  
                  <!-- Footer -->
                  <div class="text-center p-3 border-t border-slate-200 dark:border-slate-700">
                    <UButton variant="ghost" size="sm" color="primary" to="/notifications">{{ $t('notifications.viewAll') }}</UButton>
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </div>
      </div>
    </header>
    <UiMainMenu v-model="isMobileMenuOpen" :current-user="currentUser" />
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/store/authStore';
  
  const { t } = useI18n();
  const authStore = useAuthStore();
  const route = useRoute();

  // Get authenticated user data from auth store
  const user = computed(() => authStore.userGetter);
  
  // Computed user data for display
  const currentUser = computed(() => {
    // Get profile image URL from either the new structure or the legacy field
    const profileImageUrl = user.value?.profile_image?.url || user.value?.profile_image_url || '';
    
    return {
      name: user.value?.name || t('user.guest'),
      avatar: profileImageUrl, // URL to user avatar, will use initials fallback if empty
      email: user.value?.email || ''
    };
  });

defineEmits(['toggle-menu']);
  
  // Check if a route is active
  const isRouteActive = (path) => {
    if (path === '/') return route.path === '/';
    return route.path.startsWith(path);
  };

  // User menu items as a computed property to react to route changes
  const userMenuItems = computed(() => [
    {
      label: t('user.profile'),
      icon: 'i-lucide-user',
      to: '/account',
      active: isRouteActive('/account')
    },

    {
      label: t('user.signOut'),
      icon: 'i-lucide-log-out',
      click: () => signOut()
    }
  ]);

  // Mobile menu state
const isMobileMenuOpen = ref(false);

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
  
  // Sign out function
  const signOut = () => {
    // Use auth store to log out and redirect to login page
    authStore.logout();
    navigateTo('/');
  };
  
  // Notification data
  const unreadNotificationsCount = ref(3);
  
  const notificationItems = ref([
    {
      title: 'New message from John Doe',
      time: '5 minutes ago',
      read: false,
    },
    {
      title: 'Meeting reminder: Property viewing',
      time: 'Today at 3:00 PM',
      read: false,
    },
    {
      title: 'Client feedback received',
      time: 'Yesterday',
      read: false,
    },
    {
      title: 'Sarah Smith updated contact details',
      time: '2 days ago',
      read: true,
    }
  ]);
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    notificationItems.value.forEach(item => {
      item.read = true;
    });
    unreadNotificationsCount.value = 0;
  };
  </script>