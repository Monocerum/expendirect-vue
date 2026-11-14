<script setup>
import { reactive } from 'vue'
import FormRow from '@/components/common/FormRow.vue'
import Modal from '@/components/common/Modal.vue'
import { vFocus } from '@/composables/useFocus'
import { useAppStore } from '@/stores/app'
import { readFileAsDataUrl } from '@/utils/files'

const props = defineProps({
    account: { type: Object, default: undefined },
})
const emit = defineEmits(['close'])

const store = useAppStore()
const form = reactive(props.account ? { ...props.account } : { name: '', opening: 0, icon: '' })

const handleFile = (event) => {
    const [file] = event.target.files
    if (file) readFileAsDataUrl(file, (icon) => (form.icon = icon))
}

const handleSubmit = () => {
    const values = { ...form, opening: Number(form.opening) || 0 }
    if (props.account) store.updateItem('accounts', values)
    else store.addItem('accounts', values)
    emit('close')
}
</script>

<template>
    <Modal :title="account ? 'Edit account' : 'Add account'" @close="emit('close')">
        <form class="form" @submit.prevent="handleSubmit">
            <FormRow label="Account name">
                <input v-model="form.name" v-focus required placeholder="BPI, Travel fund…" />
            </FormRow>
            <FormRow label="Opening balance">
                <input v-model="form.opening" type="number" step="0.01" />
            </FormRow>
            <FormRow label="Icon">
                <input type="file" accept="image/*" @change="handleFile" />
            </FormRow>
            <button class="btn">Save account</button>
        </form>
    </Modal>
</template>
