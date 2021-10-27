<template>
  <div class="d-flex flex-column position-relative">
    <div class="position-absolute end-0 p-2" v-if="output">
      <button class="btn btn-primary btn-icon-text"
        v-clipboard:copy="output">
        <i class="bi-clipboard"></i>
        Copy
      </button>
      <button class="btn btn-primary btn-icon-text ms-2"
        @click="download()">
        <i class="bi-download"></i>
        Download
      </button>
    </div>
    <pre v-if="!output"
      class="bg-transparent text-light p-3 flex-grow-1 m-0 position-absolute opacity-50 pointer-events-none">{{placeholder}}</pre>
    <pre id="codeOutput"
         class="bg-light bg-opacity-10 border border-light text-light p-3 rounded flex-grow-1 m-0">{{output}}</pre>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ClassConverter from '@/service/classConverter';
import Filters from '@/models/filters';

@Component
export default class CodeOutput extends Vue {
  @Prop()
  code!: string;

  @Prop()
  filters!: Filters;

  private placeholder = `export interface Person {
  name: string;
  addresses: Address[];
}

export interface Employee extends Person {
  salary: number;
}

export interface Address {
  street: string;
}

export enum PersonType {
  Employee = 1,
  Client = 2,
}`;

  download(): void {
    const blob = new Blob([this.output], { type: 'text/plain' });
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = 'types.ts';
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }

  get output(): string {
    return ClassConverter.Convert(this.code, this.filters);
  }
}
</script>

<style scoped lang="less">
#codeOutput {
  min-height: 450px;
}

.pointer-events-none {
  pointer-events: none;
}
</style>
