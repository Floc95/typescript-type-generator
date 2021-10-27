<template>
  <div class="d-flex flex-column flex-sm-row filters mb-3 align-items-center">
    <label class="align-items-center d-flex form-check form-switch mb-3 mb-sm-0 text-light w-100 w-sm-50"
      for="prefixInterface">
      <input class="bg-light bg-opacity-25 form-check-input mt-0"
        type="checkbox" id="prefixInterface" v-model="filters.interfacePrefix">
      <span class="d-block">Prefix interface with I</span>
    </label>
    <label class="align-items-center d-flex form-check form-switch mb-3 mb-sm-0 text-light w-100 w-sm-50"
      for="upperCamelCase">
      <input class="bg-light bg-opacity-25 form-check-input mt-0"
        type="checkbox" id="upperCamelCase" v-model="filters.upperCamelCase">
      <span class="d-block">UpperCamelCase</span>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Filters from '@/models/filters';

@Component
export default class CodeFilters extends Vue {
  @Prop()
  value!: Filters;

  get filters(): Filters {
    return this.value;
  }

  set filters(value: Filters) {
    this.$emit('input', value);
  }
}
</script>

<style scoped lang="less">
.filters {
  height: 64px;
  min-height: 64px;

  .form-switch .form-check-input {
    &:focus {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
    }

    &:checked {
      --bs-bg-opacity: 0.60;
    }
  }
}
</style>
