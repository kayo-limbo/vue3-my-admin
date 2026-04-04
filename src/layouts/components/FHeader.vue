<template>
  <div class="header">
    <span>
      <el-icon><Place /></el-icon>
      后台管理
      <el-icon><Fold /></el-icon>
      <el-icon @click="handleRefresh"><Refresh /></el-icon>
        <el-tooltip
        effect="dark"
        content="刷新"
        placement="top"
      ></el-tooltip>
    </span>
    <div class="header-right">
    
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar :size="25" :src="userAvatar" />
          {{ userName }}
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openPasswordDialog">修改密码</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
   <el-dialog v-model="showEditPassword" title="修改密码" width="400px" destroy-on-close>
  <el-form :model="form" label-width="80px" :rules="rules" ref="formRef">
    <el-form-item label="原密码" prop="oldPassword">
      <el-input v-model="form.oldPassword" type="password" show-password placeholder="请输入原密码" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="form.newPassword" type="password" show-password placeholder="请输入新密码" />
    </el-form-item>
    <el-form-item label="确认密码" prop="rePassword">
      <el-input v-model="form.rePassword" type="password" show-password placeholder="请再次输入新密码" />
    </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="showEditPassword = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认修改</el-button>
    </span>
  </template>
</el-dialog>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {Fold, FullScreen, Place, Refresh, ArrowDown} from "@element-plus/icons-vue";
import { usehanlelogout, userefreshpassword, usehandleRefresh } from "@/composable/useManager";
import { useStore } from "vuex";

const store = useStore();

// 从store中获取用户信息
const userName = computed(() => store.state.user.name || '管理员')
const userAvatar = computed(() => store.state.user.avatar || '')

// 使用composable函数
const { handleLogout } = usehanlelogout();
const { form, formRef, showEditPassword, openPasswordDialog, onSubmit, rules } = userefreshpassword();
const { handleRefresh } = usehandleRefresh();
</script>

<style lang="scss" scoped>
.header {
  margin: 0;
  background: #82d4f4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header > span {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.header > span .el-icon {
  font-size: 18px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: #409eff;
    background: #f0f7ff;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-right .el-icon {
  font-size: 18px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: #409eff;
    background: #f0f7ff;
  }
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 16px;
  color: #303133;
  border: none;
  outline: none;
  text-decoration: none;

  &:hover {
    background: #f5f7fa;
    color: #409eff;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
}

.el-icon--right {
  font-size: 12px;
  color: #909399;
  transition: transform 0.3s;
}

.el-dropdown-link:hover .el-icon--right {
  transform: rotate(180deg);
}
</style>