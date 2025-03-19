<template>
    <USlideover
      :open="modelValue"
      side="left"
      @update:open="$emit('update:modelValue', $event)"
    >
      <template #content>
        <div class="flex justify-between items-center">
          <h2 class="text-sm font-medium px-3">Menu</h2>
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
              <div>Keystone CRM</div>
              <div>Version 1.0</div>
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
  import { ref, onMounted } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    currentUser: {
      type: Object,
      default: () => ({
        name: 'Benjamin',
        email: 'benjamin@example.com',
        avatar: ''
      })
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  // Theme toggle
  const isDarkMode = ref(false);
  
  onMounted(() => {
    // Check the current theme
    isDarkMode.value = document.documentElement.classList.contains('dark');
  });
  
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle('dark');
  };
  
  // Menu items structure
  const menuItems = [
    {
      items: [
        {
          label: 'Dashboard',
          icon: 'i-lucide-layout-dashboard',
          to: '/dashboard',
          active: true
        },
        {
          label: 'Inbox',
          icon: 'i-lucide-inbox',
          to: '/inbox',
          count: 12
        }
      ]
    },
    {
      label: 'Contacts',
      items: [
        {
          label: 'Clients',
          icon: 'i-lucide-users',
          to: '/clients'
        },
        {
          label: 'Leads',
          icon: 'i-lucide-user-plus',
          to: '/leads',
          count: 3
        }
      ]
    },
    {
      label: 'Properties',
      items: [
        {
          label: 'Listings',
          icon: 'i-lucide-home',
          to: '/listings'
        },
        {
          label: 'Showings',
          icon: 'i-lucide-calendar',
          to: '/showings'
        }
      ]
    },
    {
      label: 'Tools',
      items: [
        {
          label: 'Templates',
          icon: 'i-lucide-file-text',
          to: '/templates'
        },
        {
          label: 'Analytics',
          icon: 'i-lucide-bar-chart',
          to: '/analytics'
        },
        {
          label: 'Settings',
          icon: 'i-lucide-settings',
          to: '/settings'
        }
      ]
    }
  ];
  
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