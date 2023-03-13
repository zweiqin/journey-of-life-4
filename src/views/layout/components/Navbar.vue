<template>
  <div
    :style="{height:50*$root.dw+'px'}"
    class="navbar"
  >
    <div class="left-menu">
      <hamburger
        :toggle-click="toggleSideBar"
        :is-active="sidebar.opened"
        class="hamburger-container"
      />
      <breadcrumb class="breadcrumb-container" />
    </div>
    <div class="title">{{ title }}</div>

    <div class="right-menu">
      <template v-if="device!=='mobile'">

        <el-tooltip
          :content="$t('navbar.screenfull')"
          effect="dark"
          placement="bottom"
        >
          <screenfull class="screenfull right-menu-item" />
        </el-tooltip>

        <el-tooltip
          :content="$t('navbar.size')"
          effect="dark"
          placement="bottom"
        >
          <size-select class="international right-menu-item" />
        </el-tooltip>

        <lang-select class="international right-menu-item" />

        <el-tooltip
          :content="$t('navbar.theme')"
          effect="dark"
          placement="bottom"
        >
          <theme-picker class="theme-switch right-menu-item" />
        </el-tooltip>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="common.splicingImgUrl() +avatar"
            :style="{height:40*$root.dw+'px'}"
            height="100%"
          >
          <!-- <img :src="img" class="user-avatar"> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <!-- <el-dropdown-item divided>
            <a target="_blank" href="https://github.com/qiguliuxing/dts-shop">
              GitHub
            </a>
          </el-dropdown-item>
          <el-dropdown-item>
            <a target="_blank" href="https://gitee.com/qiguliuxing/dts-shop">
              码云
            </a>
          </el-dropdown-item> -->
          <el-dropdown-item divided>
            <router-link to="/profile/userInfo">
              个人中心
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <router-link to="/profile/password">
              密码修改
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span
              style="display:block;"
              @click="logout"
            >{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  data () {
    return {
      // img: `url(require('@/assets/logo/logo.png'))`
      title: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('toggleSideBar')
    },
    logout () {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  .left-menu {
    // background: #000;
    height: 100%;
    width: 45%;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    .hamburger-container {
      line-height: 100%;
      height: 100%;
      width: 10%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .breadcrumb-container {
      height: 100%;
      line-height: 100%;
      width: 80%;
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items: center;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
  }
  .title {
    height: 100%;
    width: 30%;
  }
  .right-menu {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    width: 25%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 100%;
      // height: 50px;
      // margin-right: 30px;
      .avatar-wrapper {
        height: 100%;
        width: 100%;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        // margin-top: 5px;
        // position: relative;
        // .user-avatar {
        //   width: 100%;
        //   height: 100%;
        //   border-radius: 10px;
        // }
        .el-icon-caret-bottom {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-end;
          // position: absolute;
          // right: -20px;
          // top: 25px;
          // font-size: 12px;
        }
      }
    }
  }
}
</style>
