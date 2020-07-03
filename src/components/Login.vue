<template>
  <div class="login_box" >
    <div class="top_icons">
      <img class="left_top" src="../assets/login_Ltop.png">
      <img class="right_top" src="../assets/login_Rtop.png">
    </div>

    <!-- 表单登录 -->
    <div class="center_box">
      <img class="center_Limg" src="../assets/login_Lcenter.png">
      <div class="login_fm">
        <div class="loginForm myClass">
          <h3 class="title">用户登录</h3>
          <el-form :model="loginForm"   >
            <el-form-item  prop="username">
              <el-input class="inner_input"
                        placeholder="请输入用户名"
                        v-model="loginForm.username"
              >
                <i slot="prefix" class="el-input__icon el-icon-user"></i>
              </el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input class="inner_input"
                        placeholder="请输入密码"
                        v-model="loginForm.password"
                        type="password"
              >
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <el-checkbox  v-model="checked">记住用户名和密码</el-checkbox>
            <div class="submit-btn"><el-button class="btn" :loading="loading" type="primary" @click="goLogin" >登 录</el-button></div>
          </el-form>
        </div>
      </div>
    </div>

    <div class="foot_icons">
      <img class="left_foot" src="../assets/login_Lbottom.png">
      <img class="right_foot" src="../assets/login_Rbottom.png">
    </div>

    <div class="foot_title">

    </div>

  </div>
</template>

<script>

    export default {
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                loading: false,
                checked: true
            };
        },
        components: {
        },

        methods: {
            goLogin() {
                this.axios.post('user/login', {
                    username: this.loginForm.username,
                    password: this.loginForm.password
                })
                    .then(() => {
                        this.$router.push('/home')
                        this.loading = false
                    })
                    .catch((res) => {
                        this.loading = false
                    })

            }
        },
        created() {}
    };
</script>

<style scoped>
  .login-container {
    width: 100%;
    height: 100%;

  }
  #login{
    position: relative;
  }


  .login-page {
    position: relative;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 190px auto;
    width: 370px;
    padding: 40px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
  }
  label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
  }

</style>


