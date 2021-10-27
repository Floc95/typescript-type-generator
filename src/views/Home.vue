<template>
  <div class="container mt-5">
    <h1 class="text-center mb-5 pb-5 text-light">Instantly generate TypeScript interfaces from C#</h1>
    <div class="row">
      <div class="col-md-6 mb-4">
        <CodeInput v-model="code"></CodeInput>
      </div>
      <div class="col-md-6 mb-4">
        <CodeFilters v-model="filters"></CodeFilters>
        <CodeOutput :code="code" :filters="filters"></CodeOutput>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CodeInput from '@/components/CodeInput.vue';
import CodeOutput from '@/components/CodeOutput.vue';
import CodeFilters from '@/components/CodeFilters.vue';
import Filters from '@/models/filters';

@Component({
  components: {
    CodeInput,
    CodeOutput,
    CodeFilters,
  },
})
export default class Home extends Vue {
  private filters: Filters = {
    interfacePrefix: false,
    upperCamelCase: false,
  };

  private code = '';
}
</script>
