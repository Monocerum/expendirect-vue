<script setup>
import { ref } from 'vue'
import Modal from '@/components/common/Modal.vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const isConfirming = ref(false)

const handleReset = () => {
    store.resetData()
    isConfirming.value = false
}
</script>

<template>
    <section class="card danger-zone">
        <h2>Reset everything</h2>
        <p class="muted">
            Erases all your accounts, entries, categories, tags, budget plans, bills and profile, and
            restores the default settings and color theme.
        </p>
        <button class="btn danger" @click="isConfirming = true">Reset to defaults</button>
    </section>
    <Modal v-if="isConfirming" title="Reset everything?" @close="isConfirming = false">
        <p>This permanently deletes all of your data on this device and can’t be undone.</p>
        <div class="btns">
            <button class="btn danger" @click="handleReset">Yes, erase everything.</button>
            <button class="link" @click="isConfirming = false">Cancel</button>
        </div>
    </Modal>
</template>