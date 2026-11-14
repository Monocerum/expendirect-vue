<script setup>
import { reactive, ref, watch } from 'vue'
import FormRow from '@/components/common/FormRow.vue'
import { useAppStore } from '@/stores/app'
import { readFileAsDataUrl } from '@/utils/files'

const store = useAppStore()
const form = reactive({ ...store.state.profile })
const isSaved = ref(false)

watch(form, () => (isSaved.value = false))

const handleFile = (event) => {
    const [file] = event.target.files
    if (file) readFileAsDataUrl(file, (avatar) => (form.avatar = avatar))
}

const handleSubmit = () => {
    store.mergeInto('profile', { ...form })
    isSaved.value = true
}
</script>

<template>
    <form class="card form" @submit.prevent="handleSubmit">
        <h2>Your profile</h2>
        <img v-if="form.avatar" class="pfp" :src="form.avatar" alt="Your profile photo" />
        <FormRow label="Photo">
            <input type="file" accept="image/*" @change="handleFile" />
        </FormRow>
        <FormRow label="Name">
            <input v-model="form.name" />
        </FormRow>
        <FormRow label="Email">
            <input v-model="form.email" type="email" />
        </FormRow>
        <button class="btn">Save profile</button>
        <p v-if="isSaved" class="muted" role="status">Profile saved.</p>
    </form>
</template>