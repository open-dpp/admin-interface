<template>
  <div class="overflow-hidden rounded-lg bg-white shadow">
    <div class="flex flex-col px-4 py-5 sm:p-6 gap-4">
      <div
        class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6"
      >
        <div
          :class="[
            props.section.type === SectionType.REPEATABLE
              ? 'bg-pink-500'
              : 'bg-indigo-500',
            'flex size-12 shrink-0 items-center justify-center rounded-lg',
          ]"
        >
          <component
            :is="
              props.section.type === SectionType.REPEATABLE
                ? ArrowPathIcon
                : TableCellsIcon
            "
            class="size-6 text-white"
            aria-hidden="true"
          />
        </div>
        <div class="text-sm/6 font-medium text-gray-900">
          {{ props.section.name }}
        </div>
      </div>
      <AddDataField :draft-id="props.draftId" :section-id="props.section.id" />
      <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
        <div class="flex justify-between gap-x-4 py-3">
          <dt class="text-gray-500">Last invoice</dt>
          <dd class="text-gray-700">fjkl;j</dd>
        </div>
        <div class="flex justify-between gap-x-4 py-3">
          <dt class="text-gray-500">Amount</dt>
          <dd class="flex items-start gap-x-2">
            <div class="font-medium text-gray-900">rewqrewq</div>
            <div
              :class="[
                'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
              ]"
            >
              rewrewq
            </div>
          </dd>
        </div>
      </dl>
    </div>
  </div>
  <!--    <Menu as="div" class="relative ml-auto">-->
  <!--      <MenuButton class="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">-->
  <!--        <span class="sr-only">Open options</span>-->
  <!--        <EllipsisHorizontalIcon class="size-5" aria-hidden="true" />-->
  <!--      </MenuButton>-->
  <!--      <transition-->
  <!--        enter-active-class="transition ease-out duration-100"-->
  <!--        enter-from-class="transform opacity-0 scale-95"-->
  <!--        enter-to-class="transform opacity-100 scale-100"-->
  <!--        leave-active-class="transition ease-in duration-75"-->
  <!--        leave-from-class="transform opacity-100 scale-100"-->
  <!--        leave-to-class="transform opacity-0 scale-95"-->
  <!--      >-->
  <!--        <MenuItems-->
  <!--          class="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"-->
  <!--        >-->
  <!--          <MenuItem v-slot="{ active }">-->
  <!--            <a-->
  <!--              href="#"-->
  <!--              :class="[-->
  <!--                active ? 'bg-gray-50 outline-none' : '',-->
  <!--                'block px-3 py-1 text-sm/6 text-gray-900',-->
  <!--              ]"-->
  <!--              >View<span class="sr-only">, {{ client.name }}</span></a-->
  <!--            >-->
  <!--          </MenuItem>-->
  <!--          <MenuItem v-slot="{ active }">-->
  <!--            <a-->
  <!--              href="#"-->
  <!--              :class="[-->
  <!--                active ? 'bg-gray-50 outline-none' : '',-->
  <!--                'block px-3 py-1 text-sm/6 text-gray-900',-->
  <!--              ]"-->
  <!--              >Edit<span class="sr-only">, {{ client.name }}</span></a-->
  <!--            >-->
  <!--          </MenuItem>-->
  <!--        </MenuItems>-->
  <!--      </transition>-->
  <!--    </Menu>-->
  <!--  </div>-->
</template>

<script lang="ts" setup>
import { SectionDraftDto, SectionType } from "@open-dpp/api-client";
import { ArrowPathIcon, TableCellsIcon } from "@heroicons/vue/24/outline";
import AddDataField from "./AddDataField.vue";

const props = defineProps<{ draftId: string; section: SectionDraftDto }>();
</script>
