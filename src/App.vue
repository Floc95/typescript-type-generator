<template>
  <div id="app" class="d-flex flex-column">
    <header
    class="align-items-center container d-flex flex-shrink-0 flex-wrap justify-content-between py-3">
      <h5 class="m-0 text-light">
        Typescript Type Generator
      </h5>
      <div>
        <a href="https://github.com/Floc95/typescript-type-generator"
           class="btn btn-outline-light btn-icon-text" target="_blank">
          <i class="bi-github"></i>
          GitHub
        </a>
      </div>
    </header>
    <div class="flex-grow-1">
      <router-view/>
    </div>
    <footer class="container text-center content-space-1">
      <div class="d-inline-flex align-items-center mb-2">
        <img class="brand" src="./assets/logo_big.png" alt="Logo" width="75px" height="75px">
      </div>

      <p class="small text-muted mb-0">
        2021 © Typescript Type Generator. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<style lang="less">
html, body, #app {
  height: 100%;
}
</style>
