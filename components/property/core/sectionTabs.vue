<script lang="ts" setup>
const { t } = useI18n()
const tabs = computed(() => {
    return [
        {
            name: 'basic',
            label: t('property.propertyForm.tabs.basicInfo'),
            icon: 'icon-basic',
        },
        {
            name: 'location',
            label: t('property.propertyForm.tabs.location'),
            icon: 'icon-location',
        },
        {
            name: 'characteristics',
            label: t('property.propertyForm.tabs.characteristics'),
            icon: 'icon-features',
        },
        {
            name: 'media',
            label: t('property.propertyForm.tabs.multimedia'),
            icon: 'icon-photos',
        },
        {
            name: 'finalize',
            label: t('property.propertyForm.tabs.finalize'),
            icon: 'icon-pricing',
        },
       
    ]
})



</script>

<template>
    <UTabs variant="link" :items="tabs" class="w-full" />
</template>