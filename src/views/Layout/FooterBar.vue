<template>
  <footer class="footer-bar">
    <div
      class="subscan-container space-between align-items-center"
    >
      <div class="info-container align-items-center">
        <div v-if="showLicense" class="license">
          <a target="_blank" rel="noopener" href="http://www.beian.miit.gov.cn">{{$t('license')}}</a>
        </div>
        <div class="copyright">{{$t('copy_right', { year: new Date().getFullYear()})}}</div>
        <div class="terms">
          <a href="https://medium.com/tag/subscan-update/latest">{{$t('version_history')}}</a>
          <a href="https://www.subscan.io/privacy">{{$t('privacy_policy')}}</a>
          <a href="https://www.subscan.io/term">{{$t('term_of_use')}}</a>
        </div>
        <div class="icon-group">
          <el-dropdown class="donate-dropdown" trigger="click">
            <div class="donate">
              <icon-svg icon-class="donate" class="icon" />
            </div>
            <el-dropdown-menu class="donate-menu" slot="dropdown">
              <el-dropdown-item class="menu-item">
                <div class="donate-menu-item">
                  <div class="donate-content">
                    <div class="donate-title">{{$t('donate_unit', {unit: getUnit()})}}</div>
                    <a :href="donateUrl" class="donate-address">{{donateAddress}}</a>
                  </div>
                  <div class="donate-other">
                    <a
                      class="link"
                      href="https://www.subscan.io/donate"
                      target="_blank"
                    >{{$t('donate_other')}}</a>
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="donate-dropdown" trigger="click">
            <div class="donate">
              <icon-svg icon-class="email" class="icon" />
            </div>
            <el-dropdown-menu class="donate-menu" slot="dropdown">
              <el-dropdown-item class="menu-item">
                <div class="contact-menu-item">
                  <div class="contact-content">
                    <div class="contact-title">{{$t('contact_us')}}</div>
                  </div>
                  <div class="media">
                    <a
                      class="contact-item twitter"
                      target="_blank"
                      rel="noopener"
                      href="https://twitter.com/subscan_io/"
                    >
                      <icon-svg icon-class="twitter-black" class="icon" />
                    </a>
                    <a
                      class="contact-item riot"
                      target="_blank"
                      rel="noopener"
                      href="https://riot.im/app/#/room/!uaYUrKBueiKUurHliJ:matrix.org?via=matrix.org&via=matrix.parity.io&via=web3.foundation"
                    >
                      <icon-svg icon-class="riot-black" class="icon" />
                    </a>
                    <a
                      class="contact-item github"
                      target="_blank"
                      rel="noopener"
                      href="https://github.com/itering/subscan-essentials"
                    >
                      <icon-svg icon-class="github-black" class="icon" />
                    </a>
                    <a
                      class="contact-item medium"
                      target="_blank"
                      rel="noopener"
                      href="https://medium.com/subscan"
                    >
                      <icon-svg icon-class="medium-black" class="icon" />
                    </a>
                    <a
                      class="contact-item mail"
                      target="_blank"
                      rel="noopener"
                      href="mailto:hello@subscan.io"
                    >
                      <icon-svg icon-class="email-black" class="icon" />
                    </a>
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="language-dropdown" trigger="click" @command="changeLanguage">
            <div class="language">
              <icon-svg icon-class="zh" class="icon" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="menu-item" command="zh-CN">简体中文</el-dropdown-item>
              <el-dropdown-item class="menu-item" command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div
      class="subscan-container mobile space-between align-items-center"
    >
      <div v-if="showLicense" class="license">
        <a target="_blank" rel="noopener" href="http://www.beian.miit.gov.cn">{{$t('license')}}</a>
      </div>
      <div class="copyright">
        <div class="text">{{$t('copy_right', { year: new Date().getFullYear()})}}</div>
        <el-dropdown class="donate-dropdown" trigger="click">
          <div class="donate">
            <icon-svg icon-class="donate" class="icon" />
          </div>
          <el-dropdown-menu class="donate-menu" slot="dropdown">
            <el-dropdown-item class="menu-item">
              <div class="donate-menu-item">
                <div class="donate-content">
                  <div class="donate-title">{{$t('donate')}}:</div>
                  <a :href="donateUrl" class="donate-address">{{donateAddress}}</a>
                </div>
                <div class="donate-other">
                  <a
                    class="link"
                    href="https://www.subscan.io/donate"
                    target="_blank"
                  >{{$t('donate_other')}}</a>
                </div>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState } from "vuex";
import clipboard from "Directives/clipboard";
export default {
  name: "FooterBar",
  computed: {
    ...mapState({
      sourceSelected: state => state.global.sourceSelected
    }),
    donateAddress() {
      let source = this.$const[`SYMBOL/${this.sourceSelected}`];
      let result = "";
      if (source) {
        result = source["donate"]["address"];
      }
      return result;
    },
    donateUrl() {
      let source = this.$const[`SYMBOL/${this.sourceSelected}`];
      let result = "";
      if (source) {
        result =
          source["domain"]["value"] + "/account/" + source["donate"]["address"];
      }
      if (
        location &&
        location.origin &&
        location.origin.indexOf("subscan.cn") > -1
      ) {
        result = result.replace("subscan.io", "subscan.cn");
      }
      return result;
    },
    showLicense() {
      let result = false;
      let href = window.location && window.location.href;
      if (href.indexOf(".cn") > -1) {
        result = true;
      }
      return result;
    }
  },
  directives: {
    clipboard
  },
  methods: {
    changeLanguage(language) {
      window.GLOBAL.vbus.$emit("CHANGE_LANGUAGE", language);
      this.$store.dispatch("SetLanguage", language);
    },
    getUnit() {
      let source = this.$const[`SYMBOL/${this.sourceSelected}`];
      return source["balances"]["value"];
    },
    clipboardSuccess() {
      this.$message({
        type: "success",
        message: this.$t("copy_success")
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.footer-bar {
  color: #acabb1;
  background: #302b3c;
  .subscan-container {
    flex-direction: column;
    width: 1180px;
    max-width: 100%;
    .partner {
      width: 100%;
      color: #fff;
      font-size: 14px;
      border-bottom: 1px solid rgba(216, 216, 216, 0.2);
      .partner-title {
        display: inline-block;
        margin: 20px 0;
      }
      .partner-list {
        display: flex;
        justify-content: space-between;
        opacity: 0.5;
        margin-bottom: 20px;
      }
      .partner-img-wrapper {
        height: 33px;
        img {
          height: 100%;
        }
      }
    }
    .donate-media {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      border-bottom: 1px solid rgba(216, 216, 216, 0.2);
      .donate {
        display: flex;
        .dot {
          margin-right: 25px;
        }
        .other {
          cursor: pointer;
        }
        .donate-address {
          color: #fff;
        }
      }
      .media {
        margin: 16px 0 20px;
        .contact-item {
          font-size: 24px;
          margin-left: 15px;
        }
      }
    }
    .info-container {
      width: 100%;
      height: 50px;
      display: flex;
    }
    .copyright {
      font-size: 14px;
    }
    .terms {
      flex: 1 1 auto;
      font-size: 14px;
      a {
        margin-left: 20px;
      }
    }
    .license {
      font-size: 14px;
      margin-right: 20px;
    }
    .icon-group {
      opacity: 0.5;
      margin-left: 50px;
      display: flex;
      justify-content: flex-end;
      .donate {
        margin-right: 10px;
        .icon {
          cursor: pointer;
          font-size: 26px;
        }
      }
    }
    .poweredby {
      color: #7b70ae;
      font-size: 14px;
      font-weight: bold;
      margin-left: 10px;
    }
    .contact {
      display: flex;
      margin-right: 10px;
      .contact-item {
        cursor: pointer;
        .icon {
          font-size: 26px;
        }
      }
    }
    .language {
      cursor: pointer;
      .icon {
        font-size: 26px;
      }
    }
    &.is-home-page {
      .terms {
        text-align: right;
      }
    }
    &.mobile {
      display: none;
    }
  }
  @media screen and (max-width: $screen-xs) {
    .subscan-container {
      height: inherit;
      flex-direction: column;
      background-color: #302b3c;
      align-items: initial;
      position: relative;
      display: none;
      &.mobile {
        display: flex;
      }
      .copyright {
        line-height: 40px;
        padding: 0 15px;
        display: flex;
        align-items: center;
        .text {
          flex: 1 1 auto;
        }
        .donate {
          opacity: 0.5;
          display: flex;
          .icon {
            font-size: 26px;
          }
        }
      }
      .license {
        line-height: 40px;
        padding-left: 10px;
      }
      .partner {
        border: none;
        padding: 20px 10px 10px 10px;
        margin: 0;
        display: flex;
        height: auto;
        .partner-title {
          margin: 0;
          padding-right: 20px;
          flex: 0 0 auto;
          font-size: 12px;
        }
        .partner-imgs {
          flex: 1 1 auto;
          height: auto;
          margin: 0;
          opacity: 0.5;
          .partner-img-wrapper {
            display: inline-block;
            margin-right: 10px;
          }
          .logo-math {
            width: 105px;
          }
          .logo-imtoken {
            width: 79px;
          }
          .logo-cobo {
            width: 86px;
          }
          .logo-trust {
            width: 79px;
          }
          .logo-polka {
            width: 92px;
          }
          .logo-hotbit {
            width: 83px;
          }
          .logo-coin {
            width: 71px;
          }
          img {
            width: 100%;
            height: auto;
          }
        }
      }
      .split-line {
        height: 1px;
        background-color: rgba(216, 216, 216, 0.2);
        margin: 0 18px;
      }
      .language-dropdown {
        display: none;
      }
      &.is-home-page {
      }
    }
  }
}
.el-dropdown-menu {
  padding: 16px 0;
  .menu-item {
    display: block;
    width: 160px;
    text-align: center;
    padding: 10px 20px;
    margin: 0;
    font-size: 16px;
    color: #212529;
    cursor: pointer;
    outline: none;
    &:hover {
      color: #16181b;
      text-decoration: none;
      background-color: #f8f9fa;
    }
  }
  &.donate-menu {
    padding: 0;
    .menu-item {
      width: auto;
      padding: 8px 15px;
      cursor: default;
      &:hover {
        color: #212529;
        text-decoration: none;
        background-color: #fff;
      }
    }
  }
  .donate-menu-item {
    // display: flex;
    .donate-content {
      text-align: center;
      padding-bottom: 5px;
      border-bottom: 1px solid #d8d8d8;
    }
    .donate-title {
      color: var(--main-color);
      line-height: 22px;
      font-weight: 600;
    }
    .donate-other {
      color: var(--main-color);
      font-weight: 600;
      margin-top: 8px;
      line-height: 26px;
    }
    .donate-address {
      display: inline-block;
      color: var(--link-color);
      font-size: 14px;
      word-break: break-all;
      max-width: 260px;
      line-height: 18px;
    }
  }
  .contact-menu-item {
    // display: flex;
    .contact-content {
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #d8d8d8;
    }
    .contact-title {
      color: var(--main-color);
      line-height: 22px;
      font-weight: 600;
    }
    .media {
      color: var(--main-color);
      font-weight: 600;
      margin-top: 14px;
      line-height: 26px;
      .contact-item {
        .icon {
          font-size: 24px;
        }
        & + .contact-item {
          margin-left: 15px;
        }
      }
    }
  }
}
</style>
