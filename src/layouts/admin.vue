<template>
  <el-container style="height: 100vh;">
    <el-header style="padding: 0; height: 60px;">
      <FHeader />
    </el-header>
    <el-container>
      <el-aside>
        <FMenu />
      </el-aside>
      <el-main>
        <FTagList />
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import FHeader from '@/layouts/components/FHeader.vue'
import FMenu from '@/layouts/components/FMenu.vue'
import FTagList from '@/layouts/components/FTagList.vue'
</script>

<style>

</style>