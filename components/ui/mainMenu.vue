<template>
    <USlideover
      :open="modelValue"
      side="left"
      @update:open="$emit('update:modelValue', $event)"
    >
      <template #content>
        <div class="flex justify-between items-center">
          <h2 class="text-sm font-medium px-3">{{ $t('nav.menu') }}</h2>
          <UButton 
            color="info" 
            variant="ghost" 
            icon="mdi-close" 
            aria-label="Close menu" 
            @click="$emit('update:modelValue', false)"
          />
        </div>
        <div class="flex flex-col h-full overflow-y-auto">
        <!-- User Profile Info -->
        <div class="p-4 mb-4 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center">
            <UAvatar
              :src="currentUser.avatar"
              :alt="currentUser.name"
              size="md"
              class="mr-3"
            />
            <div>
              <div class="font-medium">{{ currentUser.name }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ currentUser.email }}</div>
            </div>
          </div>
        </div>
        
        <!-- Menu Items -->
        <nav class="px-2 flex-1">
          <div v-for="(section, sectionIndex) in menuItems" :key="'section-' + sectionIndex">
            <!-- Section Label if provided -->
            <div v-if="section.label" class="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {{ section.label }}
            </div>
            
            <!-- Menu Items -->
            <div class="space-y-1 mb-6">
              <UButton
                v-for="(item, index) in section.items"
                :key="index"
                :to="item.to"
                block
                :color="item.active ? 'primary' : 'gray'"
                :variant="item.active ? 'soft' : 'ghost'"
                class="justify-start h-11"
                @click="onMenuItemClick(item)"
              >
                <div class="flex items-center">
                  <UIcon :name="item.icon" class="mr-3 h-5 w-5" />
                  <span>{{ item.label }}</span>
                  
                  <!-- Badge for unread or count indicators -->
                  <UBadge
                    v-if="item.count"
                    :color="item.active ? 'white' : 'primary'"
                    size="sm"
                    class="ml-auto"
                  >
                    {{ item.count }}
                  </UBadge>
                </div>
              </UButton>
            </div>
          </div>
        </nav>
        
        <!-- Footer - App Info -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
          <div class="flex justify-between items-center">
            <div class="text-xs text-slate-500 dark:text-slate-400">
              <div>{{ $t('version.app') }} 1.0</div>
              <div>{{ $t('version.api') }} {{ apiVersion }}</div>
            </div>
            
            <!-- Theme Toggle -->
            <UButton
              color="gray"
              variant="ghost"
              :icon="isDarkMode ? 'i-lucide-sun' : 'i-lucide-moon'"
              aria-label="Toggle theme"
              @click="toggleDarkMode"
            />
          </div>
        </div>
      </div>
      </template>
     
    </USlideover>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/store/authStore';
import { useRoute } from 'vue-router';
import { useVersionService } from '~/services/version.service';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    }
  });
  
  // Get authenticated user data from auth store
  const authStore = useAuthStore();
  const user = computed(() => authStore.userGetter);
  
  // Computed user data for display
  const currentUser = computed(() => {
    // Get profile image URL from either the new structure or the legacy field
    const profileImageUrl = user.value?.profile_image?.url || user.value?.profile_image_url || '';
    
    return {
      name: user.value?.name || t('user.guest'),
      avatar: profileImageUrl,
      email: user.value?.email || ''
    };
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  // Theme toggle
  const isDarkMode = ref(false);
  const route = useRoute();
  
  // API version state
  const apiVersion = ref('Loading...');
  
  onMounted(() => {
    // Check the current theme
    isDarkMode.value = document.documentElement.classList.contains('dark');
    
    // Fetch API version
    loadApiVersion();
  });
  
  // Load API version information
  const loadApiVersion = async () => {
    try {
      console.log('MainMenu: Attempting to load API version...');
      const versionService = useVersionService();
      console.log('MainMenu: Version service loaded:', !!versionService);
      
      // Force version refresh
      const version = await versionService.getApiVersion();
      console.log('MainMenu: API Version received:', version);
      
      // Update the displayed version
      apiVersion.value = version || 'Unknown';
    } catch (error) {
      console.error('MainMenu: Error loading API version:', error);
      apiVersion.value = 'Unknown';
    }
  };
  
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle('dark');
  };
  
  const { t } = useI18n();
  
  // Function to check if a route is active, handling exact and nested routes
  const isRouteActive = (path) => {
    if (path === '/') {
      return route.path === '/';
    }
    return route.path.startsWith(path);
  };
  
  // Menu items structure as a computed property to be reactive to route changes
  const menuItems = computed(() => [
    {
      items: [
        {
          label: t('appName'),
          icon: 'i-lucide-home',
          to: '/',
          active: isRouteActive('/')
        },
        {
          label: t('user.profile'),
          icon: 'i-lucide-user',
          to: '/account',
          active: isRouteActive('/account')
        }
      ]
    },
    {
      label: t('user.account'),
      items: [
        {
          label: t('user.signOut'),
          icon: 'i-lucide-log-out',
          to: '/logout',
          active: isRouteActive('/logout')
        }
      ]
    }
  ]);
  
  // Handle menu item click
  const onMenuItemClick = (item) => {
    if (item.action) {
      item.action();
    }
    
    // Close menu on mobile after navigation
    if (window && window.innerWidth < 768) {
      emit('update:modelValue', false);
    }
  };
  </script>