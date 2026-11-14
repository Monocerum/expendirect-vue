<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import DeleteModal from '@/components/common/DeleteModal.vue'
import { useAppStore } from '@/stores/app'
import { planItemLabel } from '@/utils/budgetPlan'
import { formatMoney } from '@/utils/format'
import TransactionForm from './TransactionForm.vue'

const props = defineProps({
    transaction: { type: Object, required: true },
    color: { type: String, default: undefined },
    name: { type: String, default: '' },
})

const store = useAppStore()
const { state } = storeToRefs(store)
const isEditing = ref(false)
const isDeleteOpen = ref(false)

const accountName = computed(
    () => state.value.accounts.find((account) => account.id === props.transaction.accountId)?.name
)
const bill = computed(() =>
    props.transaction.billId
        ? state.value.payments.find((payment) => payment.id === props.transaction.billId)
        : undefined
)
const excessBadge = computed(() =>
    props.transaction.credited > 0
        ? `Excess PHP ${formatMoney(props.transaction.credited)} → next payment`
        : `Overpaid PHP ${formatMoney(props.transaction.excess)}`
)

const handleDelete = () => {
    store.removeItem('transactions', props.transaction.id)
    isDeleteOpen.value = false
}
</script>

<template>
    <article class="entry">
        <i :style="{ background: color }" />

        <div class="ename">
            <b>{{ name }}</b>
            <small>{{ accountName }}</small>
        </div>

        <span class="eamt"><sup>PHP</sup> {{ formatMoney(transaction.amount) }}</span>

        <div class="emeta">
            <p v-if="transaction.description" class="desc">{{ transaction.description }}</p>

            <span v-if="transaction.plan" class="plan-badge">{{
                planItemLabel(state.plans, transaction.plan)
                }}</span>

            <span v-if="bill" class="bill-badge">Bill · {{ bill.name }}</span>

            <span v-if="transaction.billId && transaction.excess > 0" class="bill-badge">
                {{ excessBadge }}
            </span>

            <div v-if="transaction.tags?.length" class="tags">
                <span v-for="tag in transaction.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <p v-if="transaction.notes" class="note"><small>Note:</small>{{ transaction.notes }}</p>

            <div class="entry-actions">
                <button class="link" @click="isEditing = true">Edit</button>
                <button class="link" @click="isDeleteOpen = true">Delete</button>
            </div>
        </div>
    </article>

    <TransactionForm v-if="isEditing" :transaction="transaction" @close="isEditing = false" />
    <DeleteModal v-if="isDeleteOpen" @confirm="handleDelete" @close="isDeleteOpen = false" />
</template>