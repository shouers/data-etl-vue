<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span style="margin-left:20px;">
          <img
            width="250px;"
            style="margin-left:-10px;"
            height="100%;"
            alt
            srcset
          />
        </span>
      </div>
    </el-header>
    <!--主体-->
    <el-container style="height: 500px;">
      <!--菜单-->
      <el-aside :width="isOpen==true?'64px':'200px'">
        <div class="toggle-btn" @click="toggleMenu">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isOpen"
          :router="true"
          :default-active="activePath"
          background-color="#272c33"
          :collapse-transition="false"
          text-color="rgba(255,255,255,0.7)"
          unique-opened
        >
          <MenuTree  :menuList="this.menuList"></MenuTree>
        </el-menu>
      </el-aside>

      <!--右边主体-->
      <el-main v-loading="loading">

        <router-view></router-view>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import MenuTree from "./MenuTree.vue"; //引进菜单模板

  export default {
    data() {
      return {
        loading: true,
        activePath: "", //激活的路径
        isOpen: false,
        menuList: {},
        userInfo: {},

      };
    },
    components: {
      MenuTree
    },
    methods: {

      /**
       加载菜单数据
       */
      async getMenuList() {
        const { data: res } = await this.axios.get("user/findMenu");
        if (res.code !== 200)
          return this.$message.error("获取菜单失败:" + res.msg);
        this.menuList = res.data;
      },
      /**
       获取用户信息
       */
      async getUserInfo() {
        const { data: res } = await this.axios.get("user/info");
        if (res.code !== 200) {
          return this.$message.error("获取用户信息失败:" + res.msg);
        } else {
          this.userInfo = res.data;
          //保存用户
          this.store.commit("setUserInfo", res.data);
        }
      },
      /**
       * 菜单伸缩
       */
      toggleMenu() {
        this.isOpen = !this.isOpen;
      },

    },
    mounted() {
      //this.getUserInfo();
    },
    created() {
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem("activePath");
      // if(window.sessionStorage.getItem("activePath")==null){
      //   this.activePath='/welcome';
      // }
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  };
</script>

<style>
  /* 为对应的路由跳转时设置动画效果 */

  .el-header {
    background-color: #272c33;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 19px;

    padding-left: 0px;
  }
  .el-aside {
    background-color:#272c33
  }
  .el-main {
    background-color: #eaedf1;
  }
  .home-container {
    width: 100%;
    height: 100% !important;
  }
  .toggle-btn {
    background-color: #2d3a4b !important;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

</style>
