<template>
  <el-container class="container">
    <el-header>
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="数据管理" name="user" />
        </el-tabs>
      </div>
      <div class="username">
        <img :src="userinfo.img" class="user-avatar">
        欢迎
        {{ userinfo.username }}
        <el-row>
          <el-button type="danger" @click="logout">离开</el-button>
        </el-row>
      </div>
    </el-header>
    <router-view/>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        tabName: ['user'],
        mappingPath: {
          user: '/manage',
        }
      }
    },
    computed: {
      activeName: {
        get() {
          for (const name of this.tabName) {
            if (this.$route.path.indexOf(name) >= 0) {
              return name
            }
          }
          return ''
        },
        // 上面用v-model绑定的此属性，点击改变activeName时没有set方法会报错
        set() {

        }
      },
      userinfo() {
        return JSON.parse(localStorage.getItem('userInfo')) || {}
      }
    },
    mounted() {
      document.addEventListener('click', (e) => {
        $('#contextmenu').css('visibility', 'hidden')
      })
    },
    methods: {
      handleClick(tab) {
        this.$router.push({ path: this.mappingPath[tab.name] })
      },

      logout() {
        localStorage.clear();
        this.$router.push({ path: '/login' });
      }
    }
  }
</script>

<style>
  .container {
    height: 100%;
  }

  .el-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  .username {
    position: absolute;
    right: 40px;
    top: 0px;
    font-size: 14px;
    height: 60px;
    line-height: 60px;
  }

  .tab {
    z-index: 10;
    width: 100%;
    padding: 0 10px;
    height: 60px;
  }
  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    vertical-align: middle;
  }
</style>
<style scoped>

</style>

