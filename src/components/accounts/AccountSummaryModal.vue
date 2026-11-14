<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import Modal from '@/components/common/Modal.vue'
import { useAppStore } from '@/stores/app'
import { accountBalance, sumAmounts } from '@/utils/finance'
import { formatMoney } from '@/utils/format'

const props = defineProps({
    account: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const { state } = storeToRefs(useAppStore())
const transactions = computed(() =>
    state.value.transactions.filter((item) => item.accountId === props.account.id)
)
const income = computed(() =>
    sumAmounts(transactions.value.filter((item) => item.type === 'income'))
)
const expenses = computed(() =>
    sumAmounts(transactions.value.filter((item) => item.type === 'expense'))
)
</script>

<template>
    <Modal :title="account.name" @close="emit('close')">
        <dl class="dl">
            <dt>Opening balance</dt>
            <dd>PHP {{ formatMoney(account.opening) }}</dd>
            <dt>Total income</dt>
            <dd>PHP {{ formatMoney(income) }}</dd>
            <dt>Total expenses</dt>
            <dd>PHP {{ formatMoney(expenses) }}</dd>
            <dt>Entries</dt>
            <dd>{{ transactions.length }}</dd>
            <dt>Balance</dt>
            <dd>PHP {{ formatMoney(accountBalance(state, account.id)) }}</dd>
        </dl>
    </Modal>
</template>
