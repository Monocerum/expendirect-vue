<script setup>
import Modal from './Modal.vue'

defineProps({
	title: { type: String, default: 'Delete?' },
	message: { type: String, default: '' },
})
const emit = defineEmits(['confirm', 'close'])
</script>

<template>
	<Modal :title="title" @close="emit('close')">
		<p class="muted">
			{{ message || 'Are you sure you want to delete this? This action cannot be undone.' }}
		</p>
		<div class="modal-actions">
			<button class="cancel-btn" @click="emit('close')">Cancel</button>
			<button class="delete-btn" @click="emit('confirm')">Delete</button>
		</div>
	</Modal>
</template>