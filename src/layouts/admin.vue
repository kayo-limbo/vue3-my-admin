<template>
  <el-container style="height: 100vh;">
    <el-header style="padding: 0; height: 70px;">
      <FHeader />
    </el-header>
    <el-container style="flex: 1;">
      <el-aside :style="{ width: store.state.asideWidth }" style="height: '100%'; background-color: #ffffff;">
        <FMenu />
      </el-aside>
      <el-main style="padding: 0; flex: 1;">
        <FTagList />
        <router-view v-slot="{Component}">
         <transition name="fade">
           <keep-alive :max="10">
            <component :is="Component" />
          </keep-alive>
         </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
const store = useStore()
// import { onMounted } from 'vue'
import FHeader from '@/layouts/components/FHeader.vue'
import FMenu from '@/layouts/components/FMenu.vue'
import FTagList from '@/layouts/components/FTagList.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%;
}

#app {
  height: 100%;
}
.el-aside {
  transition: all 0.2s; 
}
.fade-enter-from{
  opacity: 0;
}
.fade-enter-to{
  opacity: 1;
}
.fade-leave-from{
  opacity: 1;
}
.fade-leave-to{
  opacity: 0;
}
.fade-enter-active{
  transition-delay: 0.3s;
}

</style>