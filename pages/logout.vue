<script setup lang="ts">
import { useAuthStore } from "~/store/authStore";
const { logout } = useAuthStore();
onMounted(() => {
    logout();
    useRouter().push('/');
});
</script>

<template>
    <p>Cerrando sesión...</p>
</template>