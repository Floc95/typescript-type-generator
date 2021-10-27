<template>
  <div class="h-100 d-flex flex-column">
    <div class="d-flex justify-content-center mb-3 flex-shrink-0">
      <ul class="nav nav-light nav-pills">
        <li class="nav-item">
          <div class="nav-link"
              :class="{'active': inputType === InputType.PasteCode}"
              @click="inputType = InputType.PasteCode">
            <i class="bi-clipboard nav-icon"></i> Paste code
          </div>
        </li>
        <li class="nav-item">
          <div class="nav-link"
              :class="{'active': inputType === InputType.DropFiles}"
              @click="inputType = InputType.DropFiles">
            <i class="bi-file-earmark-code nav-icon"></i> Drop files
          </div>
        </li>
      </ul>
    </div>

    <div class="form-group flex-grow-1" v-if="inputType === InputType.PasteCode">
      <textarea
        class="code-input form-control bg-light bg-opacity-10 text-light border border-light rounded h-100"
        v-model="code" :placeholder="placeholder"></textarea>
    </div>
    <div class="code-input flex-grow-1 dz-dropzone dz-dropzone-card dz-clickable bg-light bg-opacity-10 border border-light rounded"
      @drop.prevent="uploadFiles" @dragover.prevent="draggedOver"
      @click="browseFiles()"
      v-if="inputType === InputType.DropFiles && !files.length">
      <div class="dz-message">
        <i class="icon icon-xxl bi-upload text-light mb-4"></i>
        <h5 class="text-light">Drag and drop your files here</h5>
        <p class="mb-2 text-light">or</p>
        <input type="file" id="selectedFile" style="display: none;" multiple
          @change="uploadFiles" />
        <button class="btn btn-light btn-sm mb-5">
          Browse files
        </button>

        <div class="text-secondary">Your files will not be uploaded to any server,
          it will only be read in your browser</div>
      </div>
    </div>
    <div class="flex-grow-1"
      v-if="inputType === InputType.DropFiles && files.length">
      <ul class="list-group">
        <li class="list-group-item d-flex align-items-center bg-light bg-opacity-10 text-light"
          v-for="f in files" :key="'file-' + f.name">
          <i class="bi-file-earmark-code list-group-icon text-light"></i> {{f.name}}
          <button class="btn btn-xs btn-icon btn-soft-light ms-auto"
            @click="removeFile(f)">
            <i class="bi-x-lg"></i>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { InputType } from '@/models/inputType';

@Component
export default class CodeInput extends Vue {
  @Prop()
  value!: string;

  private InputType = InputType;

  private inputType = InputType.PasteCode;

  private dragover = false;

  private timeout = 0;

  private files: File[] = [];

  private placeholder = `public class Person {
    public string Name { get; set; }
    public List<Address> Addresses { get; set; }
}

public class Employee : Person {
    public decimal Salary { get; set; }
}

public class Address {
    public string Street { get; set; }
}

public enum PersonType {
    Employee = 1,
    Client = 2
}`;

  // eslint-disable-next-line class-methods-use-this
  browseFiles(): void {
    const selectedFile = document.getElementById('selectedFile');
    if (selectedFile) {
      selectedFile.click();
    }
  }

  uploadFiles(event: DragEvent): void {
    let files: FileList | null = event.target
      ? (event.target as HTMLInputElement).files : null;
    if (!files && event.dataTransfer) {
      files = event.dataTransfer.files;
    }

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i += 1) {
        this.files.push(files[i]);
      }
      this.readFiles();
    }
  }

  removeFile(file: File): void {
    this.files = this.files.filter((f) => f !== file);
    this.readFiles();
  }

  readFiles(): void {
    this.code = '';
    this.files.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.code += `${fileReader.result}\r\n`;
      };
      fileReader.readAsText(file);
    });
  }

  draggedOver(event: DragEvent): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    that.dragover = true;

    if (event.dataTransfer) {
      // eslint-disable-next-line no-param-reassign
      event.dataTransfer.dropEffect = 'copy';
    }

    if (that.timeout) {
      clearTimeout(that.timeout);
    }
    that.timeout = setTimeout(() => {
      that.dragover = false;
    }, 250);
  }

  get code(): string {
    return this.value;
  }

  set code(value: string) {
    this.$emit('input', value);
  }
}
</script>

<style scoped lang="less">
.nav-item .nav-link {
  cursor: pointer;
}

.code-input {
  min-height: 450px;
}

.icon.icon-xxl {
    font-size: 2.50rem;
}
</style>
