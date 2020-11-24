<template>
  <div id="app" :class="[sourceSelected]">
    <navbar />
    <main class="main">
      <div v-if="!isPolkadotConnect" class="connect-section subscan-content">
        <div class="subscan-container subscan-card">
          <div class="connect">
            <div class="loading-anime">
              <ul>
                <li id="a"></li>
                <li id="b"></li>
                <li id="c"></li>
                <li id="d"></li>
                <li id="e"></li>
                <li id="f"></li>
                <li id="g"></li>
                <li id="h"></li>
                <li id="i"></li>
              </ul>
            </div>
            <h1>{{ $t("loading") }}</h1>
            <div>{{ $t("polkadot.waiting") }}</div>
            <div class="btns">
              <div class="button" @click="initPolkadotJs">
                {{ $t("polkadot.connect") }}
              </div>
            </div>
          </div>
          <div class="download">
            <a target="_blank" :href="polkadotInstallLink">{{
              $t("polkadot.download")
            }}</a>
          </div>
          <el-dialog
            class="downloadDialog"
            title=""
            :visible.sync="dialogVisible"
            width="560px"
          >
            <div class="title">{{ $t("error")}}</div>
            <div class="text">{{ $t("polkadot.download_tip") }}</div>
            <div class="btns">
              <a class="button" target="_blank" :href="polkadotInstallLink">
                {{ $t("polkadot.download") }}
              </a>
            </div>
            <span slot="footer" class="dialog-footer"> </span>
          </el-dialog>
        </div>
      </div>
      <div v-else-if="!isKeyringLoaded" class="connect-section subscan-content">
        <div class="subscan-container subscan-card">
          <div class="connect">
            <div class="loading-anime">
              <ul>
                <li id="a"></li>
                <li id="b"></li>
                <li id="c"></li>
                <li id="d"></li>
                <li id="e"></li>
                <li id="f"></li>
                <li id="g"></li>
                <li id="h"></li>
                <li id="i"></li>
              </ul>
            </div>
            <h1>{{ $t("loading") }}</h1>
          </div>
        </div>
      </div>
      <router-view v-else />
    </main>
    <footer-bar class="footer-bar"></footer-bar>
  </div>
</template>

<script>
import Navbar from "Views/Layout/Navbar";
import FooterBar from "Views/Layout/FooterBar";
import { web3Enable, isWeb3Injected } from "@polkadot/extension-dapp";

const queryString = require("query-string");
import { mapState } from "vuex";
import { NETWORK_LIST } from "Config";
export default {
  name: "App",
  components: {
    navbar: Navbar,
    footerBar: FooterBar,
  },
  data() {
    return {
      network: NETWORK_LIST,
      dialogVisible: false,
      polkadotInstallLink:
        "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",
    };
  },
  computed: {
    ...mapState({
      sourceSelected: (state) => state.global.sourceSelected,
      isPolkadotConnect: (state) => state.global.isPolkadotConnect,
      isKeyringLoaded: (state) => state.global.isKeyringLoaded
    }),
  },
  beforeDestroy() {
    this.websocketclose();
  },
  created() {
    // 接受路由中携带语言参数lang
    const parsedObj = queryString.parse(location.search);
    let language = parsedObj["lang"];

    if (language) {
      if (["en", "zh-CN"].indexOf(language) === -1) {
        // 浏览器语言不在列表中
        language = "en";
      }
      this.$store.dispatch("SetLanguage", language);
      this.$i18n.locale = language;
    }
    this.init();
  },
  mounted() {
    window.GLOBAL.vbus.$on("CHANGE_LANGUAGE", (language) => {
      this.$i18n.locale = language;
    });
    document.getElementsByTagName("body")[0].className = this.sourceSelected;
  },
  methods: {
    init() {
      this.initPolkadotJs();
      this.detectNetwork();
      this.initWebSocket();
    },
    async initPolkadotJs() {
      this.isLoading = true;
      const extensions = await web3Enable("multisig");
      this.isLoading = false;
      if (extensions.length === 0) {
        this.dialogVisible = true;
        return;
      }
      if (isWeb3Injected) {
        this.$store.dispatch("SetIsPolkadotConnect", true);
      }
    },
    detectNetwork() {
      const parsedObj = queryString.parse(location.search);
      let networkParam = parsedObj["network"] || "";
      const materialText = location.host + networkParam;
      let network = this.network[0].value;
      this.network.forEach((item) => {
        if (materialText.indexOf(item.key) > -1) {
          network = item.value;
        }
      });
      network = "crab";
      this.$store.dispatch("SetSourceSelected", network);
    },
    initWebSocket() {
      //初始化weosocket
      let wsuri = this.$const[`SYMBOL/${this.sourceSelected}`]["ws"]["value"];
      if (
        process.env.NODE_ENV === "production" &&
        window &&
        window.location.hostname
      ) {
        wsuri = "wss://" + window.location.hostname + "/socket";
      }
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      //数据接收
      try {
        const resData = JSON.parse(e.data);
        switch (resData.topic) {
          case "metadata_update":
            // this.$store.commit("SET_METADATA", resData.content);
            break;
          default:
            break;
        }
      } catch (err) {
        console.log(err);
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose() {
      //关闭
      // console.log("断开连接", e);
    },
  },
};
</script>
<style lang='scss' scoped>
.main {
  display: flex;
}
.connect-section {
  display: flex;
  flex: 1 1 auto;
  @mixin place($n, $t, $l) {
    animation: $n 1s ease-in-out infinite;
    top: $t;
    left: $l;
  }
  .subscan-card {
    position: relative;
    min-height: 500px;
    // flex: 1 1 500px;
  }
  .connect {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    h1 {
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      margin: 50px 0;
    }
    .btns {
      display: flex;
      justify-content: center;
    }
    .button {
      cursor: pointer;
      display: inline-block;
      margin-top: 10px;
      padding: 10px 50px;
      background: #302b3c;
      border-radius: 2px;
      color: #fff;
    }
    > div {
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
    }
  }
  .download {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translate(-50%, 0);
    a {
      color: var(--link-color);
      font-size: 14px;
    }
  }
  .loading-anime {
    position: relative;
    height: 80px;
    //https://codepen.io/hynden/pen/nyblr
    ul {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      transform: rotate(45deg);
    }
    li {
      list-style-type: none;
      position: absolute;
      top: 0px;
      left: 0px;
      width: 20px;
      height: 20px;
      background: var(--main-color);
      border-radius: 50%;
    }
    #a {
      @include place(a, -40px, -40px);
    }
    #b {
      @include place(b, -40px, 0px);
    }
    #c {
      @include place(c, -40px, 40px);
    }
    #d {
      @include place(d, 0px, -40px);
    }
    #e {
      @include place(e, 0px, 0px);
    }
    #f {
      @include place(f, 0px, 40px);
    }
    #g {
      @include place(g, 40px, -40px);
    }
    #h {
      @include place(h, 40px, 0px);
    }
    #i {
      @include place(i, 40px, 40px);
    }

    @keyframes a {
      50% {
        top: 0px;
        left: -40px;
      }
      100% {
        top: 0px;
        left: -40px;
      }
    }
    @keyframes b {
      50% {
        top: -40px;
        left: -40px;
      }
      100% {
        top: -40px;
        left: -40px;
      }
    }
    @keyframes c {
      50% {
        top: -40px;
        left: 0px;
      }
      100% {
        top: -40px;
        left: 0px;
      }
    }
    @keyframes d {
      50% {
        top: 40px;
        left: -40px;
      }
      100% {
        top: 40px;
        left: -40px;
      }
    }
    @keyframes f {
      50% {
        top: -40px;
        left: 40px;
      }
      100% {
        top: -40px;
        left: 40px;
      }
    }
    @keyframes g {
      50% {
        top: 40px;
        left: 0px;
      }
      100% {
        top: 40px;
        left: 0px;
      }
    }
    @keyframes h {
      50% {
        top: 40px;
        left: 40px;
      }
      100% {
        top: 40px;
        left: 40px;
      }
    }
    @keyframes i {
      50% {
        top: 0px;
        left: 40px;
      }
      100% {
        top: 0px;
        left: 40px;
      }
    }
  }
  .downloadDialog {
    .title {
      font-size: 20px;
      font-weight: 600;
      line-height: 26px;
      text-align: center;
      color: var(--black-color);
    }
    .text {
      font-size: 14px;
      font-weight: 600;
      margin: 20px 0;
      word-break: normal;
      text-align: center;
      color: var(--black-color);
    }
    .btns {
      display: flex;
      justify-content: center;
    }
    .button {
      cursor: pointer;
      display: inline-block;
      margin-top: 10px;
      padding: 10px 50px;
      background: #302b3c;
      border-radius: 2px;
      color: #fff;
    }
  }
}

</style>
<style lang="scss">
@import "./assets/style/index.scss";
body {
  --black-color: #302b3c;
  &.crab {
    --main-color: #5930dd;
    --main-color-light: #5930dd80; //50%
    --main-color-super-light: #5930dd4d; //30%
    --main-color-bg-light: #5930dd33; //20%
    --main-color-white: #5930dd0d;
    --main-button-color: #302b3c;
    --link-color: #4572de;
    --navbar-bg: linear-gradient(
      315deg,
      rgba(254, 56, 118, 1) 0%,
      rgba(124, 48, 221, 1) 71%,
      rgba(58, 48, 221, 1) 100%
    );
  }
  &.darwinia {
    --main-color: #5930dd;
    --main-color-light: #5930dd80; //50%
    --main-color-super-light: #5930dd4d; //30%
    --main-color-bg-light: #5930dd33; //20%
    --main-color-white: #5930dd0d;
    --main-button-color: #302b3c;
    --link-color: #4572de;
    --navbar-bg: linear-gradient(
      315deg,
      rgba(254, 56, 118, 1) 0%,
      rgba(124, 48, 221, 1) 71%,
      rgba(58, 48, 221, 1) 100%
    );
  }

  &.kusama {
    --main-color: #e90979;
    --main-color-light: #e9097980;
    --main-color-super-light: #e909794d;
    --main-color-bg-light: #e9097933;
    --main-color-white: #e909790d;
    --main-button-color: #302b3c;
    --link-color: #4572de;
    --navbar-bg: #000;
  }

  &.polkadot {
    --main-color: #e90979;
    --main-color-light: #e9097980;
    --main-color-super-light: #e909794d;
    --main-color-bg-light: #e9097933;
    --main-color-white: #e909790d;
    --main-button-color: #302b3c;
    --link-color: #4572de;
    --navbar-bg: linear-gradient(
      315deg,
      rgba(254, 56, 118, 1) 0%,
      rgba(230, 1, 122, 1) 71%,
      rgba(230, 1, 122, 1) 100%
    );
  }
  .el-select-dropdown__item.selected {
    color: inherit;
    font-weight: inherit;
  }
  .copy-icon {
    color: var(--main-color-light);
    font-size: 10px;
    min-width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--main-color-bg-light);
    border-radius: 50%;
  }
}
#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .nav-bar {
    flex: none;
  }
  .footer-bar {
    flex: none;
  }
  .main {
    flex: auto;
    background: #f8f9fa;
  }
  .subscan-content {
    padding: 20px 0;
    overflow: scroll;
  }
  .subscan-card-title {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 10px;
  }
  .subscan-card {
    background: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    border: 1px solid rgba(231, 234, 243, 1);
  }
  .not-found-img {
    display: block;
    margin: 0 auto;
    width: 290px;
    height: 250px;
  }
  .el-table {
    &::before {
      background-color: transparent;
    }
    tr:last-child {
      &.el-table__row {
        > td {
          border-bottom: none;
        }
      }
    }
    th.is-sortable {
      > .cell {
        display: inline-flex;
        align-items: center;
        .caret-wrapper {
          margin-top: 0.3em;
        }
      }
    }
    .el-table__header-wrapper {
      th,
      tr {
        box-sizing: border-box;
        height: 44px;
        background: #f3f5f9;
        font-size: 14px;
        font-weight: bold;
        color: #302b3c;
      }
      th {
        padding: 0;
        border: none;
      }
    }
    .el-table__body-wrapper {
      .el-table__body tr:hover > td {
        background: none;
      }
      tr {
        box-sizing: border-box;
        height: 50px;
        font-size: 14px;
        color: #302b3c;
      }
      td {
        padding: 0;
      }
    }
    .el-table__expanded-cell {
      background: #f3f5f9;
      &:hover {
        background: #f3f5f9 !important;
      }
    }
    .expand-form {
      background: #f3f5f9;
      padding: 20px;
      .form-item {
        min-height: 40px;
        font-size: 14px;
        color: rgba(48, 43, 60, 1);
        .label {
          min-width: 140px;
        }
        .value {
          width: 900px;
          word-break: break-all;
        }
      }
    }
  }
  .link {
    a {
      color: var(--link-color);
    }
  }
  @media screen and (max-width: $screen-xs) {
    .main {
      padding-left: 20px;
      padding-right: 20px;
      &.is-subscan-home {
        padding: 0;
      }
    }
    > .nav-bar-wrapper {
      height: 125px;
      &.is-home-page {
        height: 125px;
        .nav-bar-search {
          margin-top: 10px;
        }
      }
      .nav-bar-search {
        display: block;
        padding: 0 20px;
        margin-top: 10px;
        > div.search-input-wrapper {
          width: 100%;
        }
      }
      .subscan-container {
        height: 50px;
      }
    }
    .subscan-container {
      .search-input-wrapper {
        display: none;
      }
    }
  }
}
</style>
