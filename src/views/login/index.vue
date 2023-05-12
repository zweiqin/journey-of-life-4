<template>
	<div class="login">
		<div class="introduce-container">
			<div style="font-size: 18px">巨蜂生活 万店互联</div>
			<div
				style="
          margin-top: 20px;
          margin-bottom: 15px;
          font-size: 40px;
          font-weight: 700;
        "
			>
				新经济 新商业 为商户创效益
			</div>
			<div style="font-size: 15px">JUFENG</div>
		</div>
		<div class="login-container">
			<div class="login-header">
				<h2 class="login-title">欢迎登录巨蜂管理系统</h2>
				<hr />
				<h4>WELCOME TO THE JUFENG management system</h4>
			</div>
			<div class="login-card">
				<!-- <div class="login-changein">
					<div class="code-img" @click="switchLogin">
					<svg-icon v-if="activeName === 'third'" icon-class="computer" class="code-icon code-icon-computer" />
					<svg-icon v-else icon-class="qr-code" class="code-icon code-icon-qr" />
					</div>
					<div class="login-tip">
					<div class="poptip">
					<div class="poptip-arrow"><span></span></div>
					<div class="poptip-content">{{ activeName === 'third' ? '切换为账号密码登录' : '扫码登录更便捷' }}</div>
					</div>
					</div>
					</div> -->
				<el-card
					shadow="never"
					:body-style="{ padding: '0px' }"
					style="border: 0; background-color: transparent"
				>
					<div v-if="activeName === 'third'">
						<div class="login-box">
							<div class="login-content">
								<div class="master-login-title">手机扫码，安全登录</div>
								<div class="qrcode-login">
									<div class="qrcode-img">
										<img
											style="height: 250px; width: 250px"
											src="https://i0.hdslb.com/bfs/archive/aff45710ff2ac08360c5881e013b9bde3284b71f.jpg"
										/>
									</div>
									<div class="qrcode-desc">
										<p>
											打开<span class="light-link"> 微信APP </span>扫一扫登录
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- <el-tabs v-else v-model="activeName" @tab-click="handleClick"> -->
					<!-- <el-tab-pane label="密码登录" name="first"> -->
					<div class="login-box login-tab-box">
						<el-form ref="loginForm" :model="loginForm" :rules="loginRules">
							<el-form-item prop="username">
								<el-input
									v-model="loginForm.username"
									type="text"
									auto-complete="off"
									placeholder="请输入账号"
								>
									<div
										slot="prefix"
										style="width: 100%; height: 100%; background-color: #fdb500"
									>
										<svg-icon
											icon-class="user"
											class="el-input__icon input-icon"
										/>
									</div>
								</el-input>
							</el-form-item>
							<el-form-item prop="password">
								<el-input
									v-model="loginForm.password"
									type="password"
									auto-complete="off"
									placeholder="请输入密码"
									show-password
									@keyup.enter.native="handleLogin"
								>
									<div
										slot="prefix"
										style="width: 100%; height: 100%; background-color: #fdb500"
									>
										<svg-icon
											icon-class="password"
											class="el-input__icon input-icon"
										/>
									</div>
								</el-input>
							</el-form-item>
							<el-form-item prop="code">
								<el-input
									v-model="loginForm.code"
									auto-complete="off"
									placeholder="验证码"
									style="width: 63%"
									@keyup.enter.native="handleLogin"
								>
									<div
										slot="prefix"
										style="width: 100%; height: 100%; background-color: #fdb500"
									>
										<img
											style="width: 14px; height: 14px"
											src="@/assets/image/yanzheng.png"
											alt=""
											srcset=""
										/>
									</div>
								</el-input>
								<div class="login-code">
									<img
										width="100%"
										height="100%"
										:src="codeUrl"
										@click="getCode"
									/>
								</div>
							</el-form-item>
							<el-checkbox
								v-model="loginForm.rememberMe"
								style="margin: 0px 0px 25px 0px; color: rgba(0, 0, 0, 0.85)"
							>
								记住密码
							</el-checkbox>
							<el-form-item style="width: 100%">
								<el-button
									:loading="loading"
									size="medium"
									type="primary"
									style="width: 100%; height: 50px"
									@click.native.prevent="handleLogin"
								>
									<span v-if="!loading">登 录</span>
									<span v-else>登 录 中...</span>
								</el-button>
							</el-form-item>
						</el-form>
					</div>
				</el-card>
			</div>
		</div>
		<!--  底部  -->
		<!-- <div class="el-login-footer">
			<span>Copyright © 2020-2030 团蜂科技版权所有.</span>
			</div> -->
	</div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'

export default {
	name: 'Login',
	data() {
		const phoneCheck = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('手机号不能为空'))
			}
			const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
			if (reg.test(value)) {
				callback()
			} else {
				return callback(new Error('请输入正确的手机号'))
			}
		}
		return {
			activeName: 'first',
			codeUrl: '',
			cookiePassword: '',

			loginForm: {
				username: '',
				password: '',
				rememberMe: false,
				code: '',
				typ: 0,
				uuid: ''
			},
			loginRules: {
				username: [
					{ required: true, trigger: 'blur', message: '用户名不能为空' }
				],
				password: [
					{ required: true, trigger: 'blur', message: '密码不能为空' }
				],
				code: [
					{ required: true, trigger: 'change', message: '验证码不能为空' }
				]
			},

			validationForm: {
				phone: '',
				code: ''
			},
			validationRules: {
				phone: [ { required: true, trigger: 'change', validator: phoneCheck } ],
				code: [
					{ required: true, trigger: 'change', message: '验证码不能为空' }
				]
			},
			validationDisabled: false,
			validationText: '发送验证码',
			countDown: 60,

			loading: false,
			redirect: undefined
		}
	},
	watch: {
		$route: {
			handler(route) {
				this.redirect = route.query && route.query.redirect
			},
			immediate: true
		}
	},
	created() {
		this.getCode()
		this.getCookie()
	},
	methods: {
		switchLogin() {
			if (this.activeName === 'third') {
				this.activeName = 'first'
			} else {
				this.activeName = 'third'
			}
		},
		handleClick(tab, event) {
			console.log(tab, event)
		},
		getCode() {
			getCodeImg().then((res) => {
				console.log(res)
				this.codeUrl = 'data:image/gif;base64,' + res.data.data.img
				this.loginForm.uuid = res.data.data.uuid
			})
		},
		getCookie() {
			const username = Cookies.get('username')
			const password = Cookies.get('password')
			const typ = Cookies.get('typ')
			const rememberMe = Cookies.get('rememberMe')
			this.loginForm = {
				username: username === undefined ? this.loginForm.username : username,
				password: password === undefined ? this.loginForm.password : password,
				typ: typ === undefined ? this.loginForm.typ : typ,
				rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
			}
		},
		handleLogin() {
			if (this.activeName === 'first') {
				this.$refs.loginForm.validate((valid) => {
					if (valid) {
						this.loading = true
						if (this.loginForm.rememberMe) {
							Cookies.set('username', this.loginForm.username, { expires: 30 })
							Cookies.set('password', this.loginForm.password, { expires: 30 })
							Cookies.set('typ', this.loginForm.typ, { expires: 30 })
							Cookies.set('rememberMe', this.loginForm.rememberMe, {
								expires: 30
							})
						} else {
							Cookies.remove('username')
							Cookies.remove('password')
							Cookies.remove('rememberMe')
						}
						this.$store
							.dispatch('LoginByUsername', this.loginForm)
							.then(() => {
								this.loading = false
								this.$router.push({ path: this.redirect || '/' })
							})
							.catch((response) => {
								this.loading = false
								this.getCode()
							})
					}
				})
			} else if (this.activeName === 'second') {
				this.$refs.validationForm.validate((valid) => {
					if (valid) {
						this.loading = true
						this.$store
							.dispatch('LoginByVerification', this.loginForm)
							.then(() => {
								this.loading = false
								this.$router.push({ path: this.redirect || '/' })
							})
							.catch((response) => {
								this.loading = false
							})
					}
				})
			} else if (this.activeName === 'third') {
				return false
			}
		},
		sendCode() {
			this.$refs.validationForm.validateField('phone', (errorMessage) => {
				if (errorMessage) {
					this.$message.error(errorMessage)
				} else {
					// 1.时间开始倒数
					// 2.按钮进入禁用状态
					// 3.如果倒计时结束 按钮恢复可用状态 按钮文字变为重新发送, 时间重置
					// 4.倒计时的过程中 按钮文字为 多少s后重新发送
					this.validationDisabled = true
					const timer = setInterval(() => {
						this.countDown--
						this.validationText = `${this.countDown}s后重新发送`
						if (this.countDown === 0) {
							this.validationDisabled = false
							this.validationText = '重新发送'
							this.countDown = 60
							clearInterval(timer)
						}
					}, 1000)
				}
			})
		}
	}
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  position: relative;
  height: 100%;
  background-image: url('~@/assets/image/login-background2.jpg');
  // background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  .introduce-container {
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    color: #ffffff;
  }

  .login-container {
    position: absolute;
    right: 8%;
    top: 50%;
    transform: translateY(-50%);
    padding: 30px 60px;
    background: #ffffffc0;
    border-radius: 15px;
    box-shadow: 0px 0px 15px 3px #ffffff;

    .login-header {
      color: #000000;

      .login-title {
        // width: 100%;
        height: 1.5em;
        text-align: justify;
      }

      .login-title:after {
        display: inline-block;
        width: 100%;
        content: '';
      }

      hr {
        margin: 4px 0;
        border-color: rgba(0, 0, 0, 0.85);
      }

      h4 {
        // width: 100%;
        height: 1.5em;
        text-align: justify;
      }

      h4:after {
        display: inline-block;
        width: 100%;
        content: '';
      }
    }

    .login-card {
      position: relative;

      .el-tabs__nav-wrap::after {
        background-color: transparent;
      }

      // .login-changein {
      // 	position: absolute;
      // 	right: 2px;
      // 	top: 2px;
      // 	z-index: 2;
      // 	width: 50%;
      // 	height: 44px;
      // 	margin: 0 auto;

      // 	.code-img {
      // 		position: absolute;
      // 		top: 2px;
      // 		right: 2px;

      // 		// z-index: 1;
      // 		.code-icon {
      // 			color: #111;
      // 			cursor: pointer;
      // 		}

      // 		.code-icon-computer {
      // 			font-size: 50px;
      // 		}

      // 		.code-icon-qr {
      // 			font-size: 60px;
      // 		}
      // 	}

      // 	.login-tip {
      // 		position: absolute;
      // 		top: 10px;
      // 		right: 61px;

      // 		.poptip {
      // 			position: relative;
      // 			// z-index: 3;
      // 			border-radius: 6px;
      // 			background-color: rgba(61, 127, 255, .1);
      // 			border: none;
      // 			height: 30px;
      // 			line-height: 30px;
      // 			padding: 0 10px;

      // 			.poptip-arrow {
      // 				position: absolute;
      // 				// z-index: 2;
      // 				top: 9px;
      // 				right: 0;

      // 				// em {
      // 				// 	position: absolute;
      // 				// 	top: 0;
      // 				// 	left: 1px;
      // 				// 	width: 0;
      // 				// 	height: 0;
      // 				// 	border: none;
      // 				// }

      // 				span {
      // 					position: absolute;
      // 					top: 0;
      // 					left: 0;
      // 					width: 0;
      // 					height: 0;
      // 					border-style: solid;
      // 					border-color: #fff0;
      // 					border-width: 6px 0 6px 6px;
      // 					border-left-color: rgba(61, 127, 255, .1);
      // 					overflow: hidden;
      // 				}

      // 			}

      // 			.poptip-content {
      // 				font-size: 14px;
      // 				font-weight: 400;
      // 				color: rgba(61, 127, 255, 1);
      // 			}
      // 		}
      // 	}
      // }

      .login-box {
        // width: 500px;
        height: 350px;
        padding: 25px 25px 5px 25px;
        border-radius: 6px;

        .login-content {
          .master-login-title {
            padding-top: 10px;
            font-weight: lighter;
            font-size: 20px;
            text-align: center;
            font-family: PingFangSC-Regular;
            color: #111;
          }

          .qrcode-login {
            .qrcode-img {
              width: 100%;
              height: 260px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0;
            }

            .qrcode-desc {
              width: 100%;
              margin: 0 auto;

              p {
                text-align: center;
                font-size: 20px;
                color: #111;
                font-family: PingFangSC-Regular;
              }
            }
          }
        }
      }

      .login-tab-box {
        height: 312px;
        padding: 30px 5px 0;

        .el-input {
          height: 38px;
          box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.8);

          input {
            height: 38px;
            padding-left: 50px;
          }

          .el-input__prefix {
            left: 0;
            width: 38px;
          }
        }

        .input-icon {
          color: white;
          height: 39px;
          width: 14px;
          margin-left: 2px;
        }

        .login-tip {
          font-size: 13px;
          text-align: center;
          color: #bfbfbf;
        }

        .login-code {
          width: 33%;
          height: 38px;
          float: right;

          img {
            cursor: pointer;
            vertical-align: middle;
          }
        }

        .el-button--primary {
          background-color: #fdb500;
          /* border-color: #073E8E; */
          border: none;
          box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.8);
        }

        .el-button--primary:active {
          background-color: #dc9e00;
          color: #ffffff;
          outline: none;
        }
      }
    }
  }

  // .el-login-footer {
  // 	height: 40px;
  // 	line-height: 40px;
  // 	position: fixed;
  // 	bottom: 0;
  // 	width: 100%;
  // 	text-align: center;
  // 	color: #fff;
  // 	font-family: Arial;
  // 	font-size: 12px;
  // 	letter-spacing: 1px;
  // }
}
</style>
