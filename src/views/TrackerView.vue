<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import PieChart from '@/components/charts/PieChart.vue'
import AccountSelect from '@/components/common/AccountSelect.vue'
import Modal from '@/components/common/Modal.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import TypeToggle from '@/components/common/TypeToggle.vue'
import CategoryGroupCard from '@/components/tracker/CategoryGroupCard.vue'
import CategoryLegend from '@/components/tracker/CategoryLegend.vue'
import DatePickLink from '@/components/tracker/DatePickLink.vue'
import PeriodTabs from '@/components/tracker/PeriodTabs.vue'
import TransactionEntry from '@/components/transactions/TransactionEntry.vue'
import TransactionForm from '@/components/transactions/TransactionForm.vue'
import { ALL_ACCOUNTS } from '@/constants/accounts'
import { useAppStore } from '@/stores/app'
import { isInPeriod, periodLabel, todayIso } from '@/utils/date'
import { accountBalance, sumAmounts } from '@/utils/finance'
import { formatMoney } from '@/utils/format'
import { groupByCategory, matchesSearch } from '@/utils/transactions'

const { state } = storeToRefs(useAppStore())
const { query } = useRoute()

const accountId = ref(String(query.account || '') || state.value.accounts[0]?.id || '')
const type = ref(query.type === 'income' ? 'income' : 'expense')
const period = ref('day')
const reference = ref(todayIso())
const rangeEnd = ref(todayIso())
const search = ref('')
const isFormOpen = ref(false)
const viewedGroupId = ref(null)

const isAll = computed(() => accountId.value === ALL_ACCOUNTS.id)

const periodTransactions = computed(() =>
    state.value.transactions.filter(
        (item) =>
            (isAll.value || item.accountId === accountId.value) &&
            isInPeriod(item, { period: period.value, reference: reference.value, to: rangeEnd.value })
    )
)
const transactions = computed(() =>
    periodTransactions.value.filter((item) => item.type === type.value)
)
const periodIncome = computed(() =>
    sumAmounts(periodTransactions.value.filter((item) => item.type === 'income'))
)
const periodExpenses = computed(() =>
    sumAmounts(periodTransactions.value.filter((item) => item.type === 'expense'))
)
const groups = computed(() => groupByCategory(transactions.value, state.value.categories))
const searchedGroups = computed(() =>
    groupByCategory(
        transactions.value.filter((item) => matchesSearch(item, search.value, state.value.categories)),
        state.value.categories
    )
)
const viewedGroup = computed(() => groups.value.find((group) => group.id === viewedGroupId.value))
const heading = computed(() => periodLabel(period.value, reference.value, rangeEnd.value))
const total = computed(() => sumAmounts(transactions.value))

watchEffect(() => {
    if (viewedGroupId.value && !viewedGroup.value) viewedGroupId.value = null
})
</script>

<template>
    <div class="between">
        <div>
            <small class="lbl">Account</small>
            <AccountSelect v-model="accountId" include-all />
        </div>
        <p class="bal">
            <small>Balance</small> <sup>PHP</sup> {{ formatMoney(accountBalance(state, accountId)) }}
        </p>
    </div>

    <p v-if="isAll" class="muted">
        All accounts · {{ periodTransactions.length }}
        {{ periodTransactions.length === 1 ? 'entry' : 'entries' }} this period · Income PHP
        {{ formatMoney(periodIncome) }} · Expenses PHP {{ formatMoney(periodExpenses) }} · Net PHP
        {{ formatMoney(periodIncome - periodExpenses) }}
    </p>

    <TypeToggle v-model="type" />

    <section class="card">
        <div class="split">
            <PeriodTabs v-model="period" />
            <div class="grow">
                <small class="lbl">{{ period === 'day' ? 'Date' : period }}</small>
                <h2 class="date-h">{{ heading }}</h2>
                <div v-if="period !== 'overall'" class="datepicks">
                    <DatePickLink v-model="reference" :label="period === 'period' ? 'From' : 'Change date'" />
                    <DatePickLink v-if="period === 'period'" v-model="rangeEnd" label="To" :min="reference" />
                </div>
                <div class="pie-wrap">
                    <PieChart :groups="groups" :total="total" />
                    <div class="amt-col">
                        <button class="plus" :aria-label="`Add ${type}`" @click="isFormOpen = true">+</button>
                        <p class="stack-amt">
                            <span>PHP</span>
                            <b>{{ formatMoney(total) }}</b>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <hr class="rule" />
        <CategoryLegend :groups="groups" @view="viewedGroupId = $event" />
        <p v-if="!groups.length" class="muted center">
            Nothing here yet. Use + to add {{ type === 'income' ? 'income' : 'an expense' }}.
        </p>
    </section>

    <SearchInput v-model="search" placeholder="Search category, tag or note" label="Search categories, tags or notes" />
    <p v-if="search && !searchedGroups.length" class="muted">No matches for “{{ search }}”.</p>
    <div class="grid cards3">
        <CategoryGroupCard v-for="group in searchedGroups" :key="group.id" :group="group" :heading="heading" />
    </div>

    <Modal v-if="viewedGroup" :title="viewedGroup.name" @close="viewedGroupId = null">
        <small class="lbl">{{ heading }}</small>
        <TransactionEntry v-for="item in viewedGroup.items" :key="item.id" :transaction="item"
            :color="viewedGroup.color" :name="viewedGroup.name" />
    </Modal>
    <TransactionForm v-if="isFormOpen" :type="type" :account-id="isAll ? '' : accountId"
        :date="period === 'overall' ? todayIso() : reference" @close="isFormOpen = false" />
</template>