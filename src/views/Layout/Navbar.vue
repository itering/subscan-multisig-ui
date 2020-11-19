<template>
  <header class="nav-bar-wrapper" :class="{'is-home-page': isHomePage}">
    <nav v-if="isMobile()" class="subscan-container align-items-center is-mobile">
      <el-dropdown class="dropdown" trigger="click">
        <span class="el-dropdown-link align-items-center">
          <!--<div class="choosed-source">{{sourceSelectedLabel}}</div>-->
          <div :class="`network-button ${sourceSelectedValue}-button`">
            <img class="network-button-img" :src="mobileIconImg" />
            <span class="network-arrow" :style="{ backgroundColor: arrowColor }">
              <i class="el-icon-caret-bottom"></i>
            </span>
          </div>
        </span>
        <el-dropdown-menu slot="dropdown" class="menu-dropdown network-dropdown">
          <div class="network-title">Mainnet</div>
          <div class="network-split-line"></div>
          <div v-for="item in sourceList" :key="item.value + ' main'">
            <li v-if="item.type === 'mainnet'" class="menu-dropdown-item align-items-center">
              <i class="choosed-icon" :class="{show: sourceSelected===item.value}"></i>
              <a class="menu-dropdown-item-label" :href="getSourceHref(item.value)">{{item.label}}</a>
            </li>
          </div>
          <div class="network-title">Testnet</div>
          <div class="network-split-line"></div>
          <div v-for="item in filterSourceList" :key="item.value + ' test'">
            <li v-if="item.type === 'testnet'" class="menu-dropdown-item align-items-center">
              <i class="choosed-icon" :class="{show: sourceSelected===item.value}"></i>
              <a class="menu-dropdown-item-label" :href="getSourceHref(item.value)">{{item.label}}</a>
            </li>
          </div>
          <div class="menu-dropdown-item align-items-center">
            <i class="choosed-icon"></i>
            <a
              class="menu-dropdown-item-label join-subscan"
              :href="$t('join_subscan_url')"
              target="_blank"
              rel="noopener"
            >{{$t('join_subscan')}}</a>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <router-link class="logo" to="/" tag="a"></router-link>
      <div class="right-menu align-items-center">
        <div class="mobile-menu">
          <div class="menu-area" @click="drawer = true">
            <icon-svg icon-class="hamburger-button" class="icon" />
          </div>
        </div>
        <el-drawer
          :title="$t('menu')"
          class="mobile-drawer"
          size="260px"
          :visible.sync="drawer"
          :direction="direction"
        >
          <div class="drawer-content">
            <div class="menu-section">
              <div class="row">
                <router-link
                  class="item"
                  to="/"
                  tag="div"
                  @click.native="drawer = false"
                >{{$t('home_page')}}</router-link>

                <el-collapse accordion>
                  <el-collapse-item :title="$t('blockchain')" name="0">
                    <router-link
                      class="sub-item"
                      to="/block"
                      tag="div"
                      @click.native="drawer = false"
                    >{{$t('blocks')}}</router-link>
                    <router-link
                      class="sub-item"
                      to="/extrinsic"
                      tag="div"
                      @click.native="drawer = false"
                    >{{$t('extrinsics')}}</router-link>
                    <router-link
                      class="sub-item"
                      to="/transfer"
                      tag="div"
                      @click.native="drawer = false"
                    >{{$t('transfers')}}</router-link>
                    <router-link
                      class="sub-item"
                      to="/event"
                      tag="div"
                      @click.native="drawer = false"
                    >{{$t('events')}}</router-link>
                  </el-collapse-item>
                  <router-link
                    class="item"
                    to="/account"
                    tag="div"
                    @click.native="drawer = false"
                  >{{$t('accounts')}}</router-link>
                  <el-collapse-item :title="$t('about')" name="4">
                    <a
                      class="sub-item"
                      href="https://medium.com/tag/subscan-update/latest"
                      target="_blank"
                      @mousedown="drawer = false"
                      rel="noopener"
                    >{{$t('version_history')}}</a>
                    <a
                      class="sub-item"
                      href="https://www.subscan.io/privacy"
                      target="_blank"
                      @mousedown="drawer = false"
                      rel="noopener"
                    >{{$t('privacy_policy')}}</a>
                    <a
                      class="sub-item"
                      href="https://www.subscan.io/term"
                      target="_blank"
                      @mousedown="drawer = false"
                      rel="noopener"
                    >{{$t('term_of_use')}}</a>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <div class="language-section">
              <a
                class="contact-item twitter"
                target="_blank"
                rel="noopener"
                href="https://twitter.com/subscan_io/"
              >
                <icon-svg icon-class="twitter-grey" class="icon" />
              </a>
              <a
                class="contact-item riot"
                target="_blank"
                rel="noopener"
                href="https://riot.im/app/#/room/!uaYUrKBueiKUurHliJ:matrix.org?via=matrix.org&via=matrix.parity.io&via=web3.foundation"
              >
                <icon-svg icon-class="riot-grey" class="icon" />
              </a>
              <a
                class="contact-item github"
                target="_blank"
                rel="noopener"
                href="https://github.com/itering/subscan-essentials"
              >
                <icon-svg icon-class="github-grey" class="icon" />
              </a>
              <a
                class="contact-item medium"
                target="_blank"
                rel="noopener"
                href="https://medium.com/subscan"
              >
                <icon-svg icon-class="medium-grey" class="icon" />
              </a>
              <a
                class="contact-item mail"
                target="_blank"
                rel="noopener"
                href="mailto:hello@subscan.io"
              >
                <icon-svg icon-class="email-grey" class="icon" />
              </a>
              <el-dropdown class="language-dropdown" trigger="click" @command="changeLanguage">
                <div class="contact-item language">
                  <icon-svg icon-class="zh" class="icon" />
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item class="menu-item" command="zh-CN">简体中文</el-dropdown-item>
                  <el-dropdown-item class="menu-item" command="en">English</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <div class="row">
                <div class="item" @click="changeLanguage('zh-CN')">简体中文</div>
                <div class="item" @click="changeLanguage('en')">English</div>
              </div>-->
            </div>
          </div>
        </el-drawer>
      </div>
    </nav>
    <nav v-else class="subscan-container align-items-center">
      <router-link class="logo" to="/" tag="a"></router-link>
      <div class="right-menu align-items-center">
        <ul class="nav-item-list align-items-center">
          <router-link class="nav-item" to="/" tag="a" active-class="choosed">{{$t('home_page')}}</router-link>
          <el-dropdown class="account-dropdown" trigger="click">
            <li class="nav-item">
              {{$t('blockchain')}}
              <span>
                <i class="el-icon-caret-bottom"></i>
              </span>
            </li>
            <el-dropdown-menu slot="dropdown" class="account-dropdown-menu">
              <router-link class="account-nav-item" to="/block" tag="a" active-class="choosed">
                <el-dropdown-item class="menu-item">{{$t('blocks')}}</el-dropdown-item>
              </router-link>
              <router-link class="account-nav-item" to="/extrinsic" tag="a" active-class="choosed">
                <el-dropdown-item class="menu-item">{{$t('extrinsics')}}</el-dropdown-item>
              </router-link>
              <router-link class="account-nav-item" to="/transfer" tag="a" active-class="choosed">
                <el-dropdown-item class="menu-item">{{$t('transfers')}}</el-dropdown-item>
              </router-link>
              <router-link class="account-nav-item" to="/event" tag="a" active-class="choosed">
                <el-dropdown-item class="menu-item">{{$t('events')}}</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>
          <router-link
            class="nav-item"
            to="/account"
            tag="a"
            active-class="choosed"
          >{{$t('accounts')}}</router-link>
          <el-dropdown class="account-dropdown" trigger="click">
            <li class="nav-item">
              {{$t('tools')}}
              <span>
                <i class="el-icon-caret-bottom"></i>
              </span>
            </li>
            <el-dropdown-menu slot="dropdown" class="account-dropdown-menu">
              <router-link class="account-nav-item" to="/runtime" tag="a">
                <el-dropdown-item class="menu-item">{{$t('runtime.runtime')}}</el-dropdown-item>
              </router-link>
              <a
                v-if="api_doc_link"
                class="account-nav-item"
                :href="api_doc_link"
                target="_blank"
                rel="noopener"
              >
                <el-dropdown-item class="menu-item">{{$t('api_docs')}}</el-dropdown-item>
              </a>
              <a class="account-nav-item" href="/tools/ss58_transform" tag="a">
                <el-dropdown-item class="menu-item">{{$t('ss58.address_transform')}}</el-dropdown-item>
              </a>
              <a class="account-nav-item" href="/tools/charts" tag="a">
                <el-dropdown-item class="menu-item">{{$t('charts.charts')}}</el-dropdown-item>
              </a>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="account-dropdown" trigger="click">
            <li class="nav-item">
              {{$t('language_demo')}}
              <span>
                <i class="el-icon-caret-bottom"></i>
              </span>
            </li>
            <el-dropdown-menu slot="dropdown" class="account-dropdown-menu">
              <el-dropdown-item class="menu-item" @click.native="changeLanguage('zh-CN')">简体中文</el-dropdown-item>
              <el-dropdown-item class="menu-item" @click.native="changeLanguage('en')">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </ul>
        <el-dropdown class="dropdown" trigger="click">
          <span class="el-dropdown-link align-items-center">
            <!--<div class="choosed-source">{{sourceSelectedLabel}}</div>-->
            <div :class="`network-button ${sourceSelectedValue}-button`">
              <img class="network-button-img" :src="iconImg" />
              <span class="network-arrow" :style="{ backgroundColor: arrowColor }">
                <i class="el-icon-caret-bottom"></i>
              </span>
            </div>
          </span>
          <el-dropdown-menu slot="dropdown" class="menu-dropdown network-dropdown">
            <div class="network-title">Mainnet</div>
            <div class="network-split-line"></div>
            <div v-for="item in sourceList" :key="item.value + ' main'">
              <li v-if="item.type === 'mainnet'" class="menu-dropdown-item align-items-center">
                <i class="choosed-icon" :class="{show: sourceSelected===item.value}"></i>
                <a class="menu-dropdown-item-label" :href="getSourceHref(item.value)">{{item.label}}</a>
              </li>
            </div>
            <div class="network-title">Testnet</div>
            <div class="network-split-line"></div>
            <div v-for="item in filterSourceList" :key="item.value + ' test'">
              <li v-if="item.type === 'testnet'" class="menu-dropdown-item align-items-center">
                <i class="choosed-icon" :class="{show: sourceSelected===item.value}"></i>
                <a class="menu-dropdown-item-label" :href="getSourceHref(item.value)">{{item.label}}</a>
              </li>
            </div>
            <div class="menu-dropdown-item align-items-center">
              <i class="choosed-icon"></i>
              <a
                class="menu-dropdown-item-label join-subscan"
                :href="$t('join_subscan_url')"
                target="_blank"
                rel="noopener"
              >{{$t('join_subscan')}}</a>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="mobile-menu">
          <div class="menu-area" @click="drawer = true">
            <icon-svg icon-class="hamburger-button" class="icon" />
          </div>
        </div>
        <el-drawer
          :title="$t('menu')"
          class="mobile-drawer"
          size="260px"
          :visible.sync="drawer"
          :direction="direction"
        >
          <div class="drawer-content">
            <div class="menu-section">
              <div class="row">
                <router-link
                  class="item"
                  to="/"
                  tag="div"
                  @click.native="drawer = false"
                >{{$t('home_page')}}</router-link>

                <el-collapse accordion>
                  <el-collapse-item :title="$t('blockchain')" name="0">
                    <router-link
                      class="sub-item"
                      to="/block"
                      tag="div"
                      @click.native="drawer = false"
                    >{{$t('blocks')}}</router-link>
                    <router-link
                      class="sub-item"
                      to="/extrinsic"
                      tag="div"
                      @click.native="drawer = false"
                    >{{$t('extrinsics')}}</router-link>
                    <router-link
                      class="sub-item"
                      to="/transfer"
                      tag="div"
                      @click.native="drawer = false"
                    >{{$t('transfers')}}</router-link>
                    <router-link
                      class="sub-item"
                      to="/event"
                      tag="div"
                      @click.native="drawer = false"
                    >{{$t('events')}}</router-link>
                  </el-collapse-item>
                  <router-link
                    class="item"
                    to="/account"
                    tag="div"
                    @click.native="drawer = false"
                  >{{$t('accounts')}}</router-link>
                  <el-collapse-item :title="$t('tools')" name="3">
                    <router-link
                      class="sub-item"
                      to="/runtime"
                      tag="div"
                      @click.native="drawer = false"
                    >{{$t('runtime.runtime')}}</router-link>
                    <a
                      v-if="api_doc_link"
                      class="sub-item"
                      :href="api_doc_link"
                      target="_blank"
                      @mousedown="drawer = false"
                      rel="noopener"
                    >{{$t('api_docs')}}</a>
                    <router-link
                      class="sub-item"
                      to="/tools/ss58_transform"
                      tag="div"
                      @click.native="drawer = false"
                    >{{$t('ss58.address_transform')}}</router-link>
                    <router-link
                      class="sub-item"
                      to="/tools/charts"
                      tag="div"
                      @click.native="drawer = false"
                    >{{$t('charts.charts')}}</router-link>
                  </el-collapse-item>
                  <el-collapse-item :title="$t('about')" name="4">
                    <a
                      class="sub-item"
                      href="https://medium.com/tag/subscan-update/latest"
                      target="_blank"
                      @mousedown="drawer = false"
                      rel="noopener"
                    >{{$t('version_history')}}</a>
                    <a
                      class="sub-item"
                      href="https://www.subscan.io/privacy"
                      target="_blank"
                      @mousedown="drawer = false"
                      rel="noopener"
                    >{{$t('privacy_policy')}}</a>
                    <a
                      class="sub-item"
                      href="https://www.subscan.io/term"
                      target="_blank"
                      @mousedown="drawer = false"
                      rel="noopener"
                    >{{$t('term_of_use')}}</a>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <div class="language-section">
              <a
                class="contact-item twitter"
                target="_blank"
                rel="noopener"
                href="https://twitter.com/subscan_io/"
              >
                <icon-svg icon-class="twitter-grey" class="icon" />
              </a>
              <a
                class="contact-item riot"
                target="_blank"
                rel="noopener"
                href="https://riot.im/app/#/room/!uaYUrKBueiKUurHliJ:matrix.org?via=matrix.org&via=matrix.parity.io&via=web3.foundation"
              >
                <icon-svg icon-class="riot-grey" class="icon" />
              </a>
              <a
                class="contact-item github"
                target="_blank"
                rel="noopener"
                href="https://github.com/itering/subscan-essentials"
              >
                <icon-svg icon-class="github-grey" class="icon" />
              </a>
              <a
                class="contact-item medium"
                target="_blank"
                rel="noopener"
                href="https://medium.com/subscan"
              >
                <icon-svg icon-class="medium-grey" class="icon" />
              </a>
              <a
                class="contact-item mail"
                target="_blank"
                rel="noopener"
                href="mailto:hello@subscan.io"
              >
                <icon-svg icon-class="email-grey" class="icon" />
              </a>
              <el-dropdown class="language-dropdown" trigger="click" @command="changeLanguage">
                <div class="contact-item language">
                  <icon-svg icon-class="zh" class="icon" />
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item class="menu-item" command="zh-CN">简体中文</el-dropdown-item>
                  <el-dropdown-item class="menu-item" command="en">English</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <div class="row">
                <div class="item" @click="changeLanguage('zh-CN')">简体中文</div>
                <div class="item" @click="changeLanguage('en')">English</div>
              </div>-->
            </div>
          </div>
        </el-drawer>
      </div>
    </nav>
  </header>
</template>
<script>
import { mapState } from "vuex";
import { formatSymbol, isMobile } from "Utils/tools";
import _ from "lodash";
export default {
  name: "NavBar",
  components: {
  },
  data() {
    return {
      currentTime: Date.now(),
      drawer: false,
      direction: "rtl",
      sourceList: this.$const["COMMON/networkList"]["all"].value,
    };
  },
  watch: {},
  computed: {
    sourceSelectedValue() {
      let source = this.sourceList.find((item) => {
        return item.value === this.sourceSelected;
      });
      return (source && source.value) || "kusama";
    },
    filterSourceList() {
      let list = [].concat(this.sourceList);
      return _.filter(list, (item) => {
        return item;
      });
    },
    iconImg() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["button"];
    },
    mobileIconImg() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["mobileButton"];
    },
    arrowColor() {
      return this.$const[`SYMBOL/${this.sourceSelected}`]["arrowColor"];
    },
    isHomePage() {
      let path = this.$route.path;
      let result = false;
      switch (path) {
        case "/":
        case "/404":
        case "/noData":
          result = true;
          break;
        default:
          break;
      }
      return result;
    },
    api_doc_link() {
      return  "https://docs.api.subscan.io/";
    },
    ...mapState({
      metadata: (state) => state.polka.metadata,
      sourceSelected: (state) => state.global.sourceSelected,
      token: (state) => state.polka.token,
      language: (state) => state.global.language,
    }),
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.$loop.removeLoop("token");
  },
  methods: {
    async init() {
      // this.getMetaData();
      // await this.getData();
      // this.getToken();
    },
    async getToken() {
      await Promise.all([this.$store.dispatch("SetToken")]);
    },
    isMobile() {
      return isMobile();
    },
    formatSymbol(module, params) {
      return formatSymbol(module, this.$const, this.sourceSelected, params);
    },
    changeSource(value) {
      this.$store.dispatch("SetSourceSelected", value);
      window.location.reload();
    },
    formatSource(module, type) {
      let source = this.$const[`SYMBOL/${this.sourceSelected}`];
      if (source && source[module]) {
        return source[module][type] || "";
      } else {
        return "";
      }
    },
    getSymbol() {
      return this.formatSymbol("balances", {
        block: this.metadata.blockNum,
      });
    },
    async getMetaData() {
      await Promise.all([this.$store.dispatch("SetMetadata")]);
    },
    changeLanguage(language) {
      window.GLOBAL.vbus.$emit("CHANGE_LANGUAGE", language);
      this.$store.dispatch("SetLanguage", language);
      this.closeDrawer();
    },
    closeDrawer() {
      this.drawer = false;
    },
    getSourceHref(source) {
      let href = this.$const[`SYMBOL/${source}`]["domain"]["value"];
      if (
        location &&
        location.origin &&
        location.origin.indexOf("subscan.cn") > -1
      ) {
        href = href.replace("subscan.io", "subscan.cn");
      }
      return href;
    }
  },
};
</script>
<style lang="scss" scoped>
.nav-bar-wrapper {
  height: 50px;
  background: var(--navbar-bg);
  position: relative;
  color: #fff;
  .subscan-container {
    height: 100%;
    width: 1180px;
    max-width: 100%;
    .logo {
      height: 25px;
      width: 119px;
      background: url("../../assets/images/logo@2x.png") no-repeat center center;
      background-size: cover;
      cursor: pointer;
    }
    .rate {
      flex: 1 1 auto;
      margin-top: 2px;
      font-size: 14px;
      margin-left: 20px;
      .label {
        font-weight: bold;
      }
      .info {
        margin-left: 8px;
      }
    }
    .right-menu {
      .nav-item-list {
        .account-dropdown {
          margin-right: 15px;
          &:last-child {
            margin-right: 0;
          }
        }
        > .nav-item {
          height: 50px;
          line-height: 50px;
          cursor: pointer;
          font-size: 14px;
          user-select: none;
          font-weight: 600;
          margin-right: 25px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .account-dropdown {
        color: #fff;
        .nav-item {
          height: 50px;
          line-height: 50px;
          cursor: pointer;
          font-size: 14px;
          user-select: none;
          font-weight: 600;
        }
      }
      .dropdown {
        margin-left: 15px;
        margin-right: 1px;
        border-radius: 2px;
        .el-dropdown-link {
          /*padding: 0 10px;*/
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          .dropdown-icon {
            font-size: 11px;
          }
          .choosed-source {
            height: 31px;
            line-height: 31px;
            color: #201550;
            margin-right: 5px;
          }
        }
      }
      .mobile-menu {
        display: none;
      }
      .network-button {
        height: 30px;
        border-radius: 2px;
        background-color: #fff;
        padding: 0 10px;
        display: flex;
        align-items: center;
        .network-button-img {
          height: 30px;
        }
        .network-arrow {
          margin-left: 10px;
          background-color: #000;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          font-size: 12px;
          color: #fff;
          i {
            vertical-align: text-top;
          }
        }
      }
    }
    &.is-mobile {
      padding: 0 10px 0 20px;
      justify-content: space-between;
      .dropdown {
        border-radius: 2px;
        .el-dropdown-link {
          /*padding: 0 10px;*/
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          .dropdown-icon {
            font-size: 11px;
          }
          .choosed-source {
            height: 31px;
            line-height: 31px;
            color: #201550;
            margin-right: 5px;
          }
        }
      }
      .network-button {
        height: 30px;
        border-radius: 2px;
        background-color: #fff;
        padding: 0 5px;
        display: flex;
        align-items: center;
        .network-button-img {
          height: 20px;
        }
        .network-arrow {
          margin-left: 10px;
          background-color: #000;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          line-height: 12px;
          font-size: 12px;
          color: #fff;
          i {
            vertical-align: text-top;
          }
        }
      }
      .mobile-menu {
        display: block;
        font-size: 34px;
        text-align: right;
        .menu-area {
          display: inline-block;
        }
        .icon {
          cursor: pointer;
        }
      }
      .right-menu {
        width: 52px;
        justify-content: flex-end;
      }
    }
  }
  .nav-bar-search {
    display: none;
  }
  &.is-home-page {
    height: 125px;
    .subscan-container {
      height: 50px;
    }
    .nav-bar-search {
      display: block;
      margin-top: 4px;
      > div {
        width: 760px;
        margin: 0 auto;
      }
    }
  }
  @media screen and (max-width: $screen-xs) {
    .subscan-container {
      padding: 0 15px;
      .rate {
        display: none;
      }
      .right-menu {
        .nav-item-list {
          display: none;
        }
        .dropdown {
          margin-left: 0;
          flex: 1 1 auto;
          span {
            float: right;
          }
        }
        .mobile-menu {
          display: block;
          font-size: 34px;
          text-align: right;
          .menu-area {
            display: inline-block;
          }
          .icon {
            cursor: pointer;
          }
        }
      }
    }
  }
}
.drawer-content {
  height: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  .menu-section {
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    text-align: center;
    .row {
      padding-top: 26px;
    }
    .item {
      font-size: 20px;
      padding: 10px 0;
      color: #fff;
      margin-left: 30px;
      text-align: left;
    }
    /deep/ .el-collapse {
      border: none;
      padding-left: 30px;
      .item {
        margin-left: 0;
      }
      .el-collapse-item__header {
        background-color: initial;
        color: #fff;
        border: none;
        font-size: 20px;
        font-weight: 400;
      }
      .el-collapse-item__wrap {
        background-color: initial;
        color: #fff;
        border: none;
        text-align: left;
        padding-left: 10px;
      }
      .el-collapse-item__content {
        padding-bottom: 0;
      }
    }
    .sub-item {
      display: block;
      font-size: 14px;
      padding: 10px 0;
      color: #fff;
    }
  }
  .language-section {
    height: 70px;
    background-color: #3a3545;
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    .contact-item {
      .icon {
        font-size: 24px;
      }
    }
    .language {
      opacity: 0.5;
    }
  }
}
</style>
<style lang="scss">
@each $theme in kusama, darwinia, crab, polkadot
{
  .#{$theme} {
    > .nav-bar-wrapper {
      background: var(--navbar-bg);
      @if $theme == centrifuge {
        .subscan-container {
          color: #302b3c;
          .logo {
            height: 25px;
            width: 119px;
            background: url("../../assets/images/logo-black.png")
              no-repeat
              center
              center;
            background-size: cover;
          }
          .right-menu {
            .account-dropdown {
              color: #302b3c;
            }
          }
        }
      }
      &.is-home-page {
        background: url("../../assets/images/#{$theme}-banner.png")
          no-repeat
          center
          center;
        background-size: cover;
      }
    }
    @media screen and (max-width: $screen-xs) {
      > .nav-bar-wrapper {
        background: url("../../assets/images/#{$theme}-banner-mobile.png")
          no-repeat center center;
        background-size: cover;
        &.is-home-page {
          background: url("../../assets/images/#{$theme}-banner-mobile.png")
            no-repeat center center;
          background-size: cover;
        }
      }
    }
  }
}
.account-dropdown-menu.el-dropdown-menu {
  .menu-item {
    text-align: left;
    color: #212529;
    cursor: pointer;
    outline: none;
    &:hover {
      color: #16181b;
      text-decoration: none;
      background-color: #f8f9fa;
    }
  }
}
.network-dropdown {
  max-height: 410px;
  overflow: scroll;
}
.menu-dropdown.el-dropdown-menu {
  margin-top: 20px;
  background: #fff;
  padding: 5px 0;
  border-radius: 4px;
  border: 1px solid rgba(219, 219, 219, 1);
  .menu-dropdown-item {
    line-height: 22px;
    height: 42px;
    padding: 10px 30px 10px 13px;
    .menu-dropdown-item-label {
      font-size: 16px;
      font-weight: 600;
      color: #201550;
      cursor: pointer;
      &.join-subscan {
        color: var(--main-color);
      }
    }
    .choosed-icon {
      margin-right: 10px;
      border-radius: 50%;
      width: 7px;
      height: 7px;
      background: linear-gradient(
        315deg,
        rgba(254, 56, 118, 1) 0%,
        rgba(124, 48, 221, 1) 71%,
        rgba(58, 48, 221, 1) 100%
      );
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }
  }
  .network-title {
    color: #98959f;
    font-size: 14px;
    margin-left: 30px;
    margin-top: 15px;
    margin-bottom: 5px;
    font-weight: 600;
  }
  .network-split-line {
    height: 1px;
    margin: 0 30px;
    background-color: #e7eaf3;
  }
  .popper__arrow {
    opacity: 0;
  }
}
.mobile-drawer {
  .el-drawer {
    color: #fff;
    background-color: #302b3c;
  }
  .el-drawer__header {
    padding: 10px 0;
    color: #fff;
    background-color: #3a3545;
    margin-bottom: 0;
    > span {
      margin-left: 10px;
      font-size: 14px;
    }
    button {
      padding: 0 10px;
    }
  }
  /deep/ .el-collapse {
    .el-collapse-item__content {
      max-height: 200px;
      overflow: scroll;
    }
  }
}
</style>
