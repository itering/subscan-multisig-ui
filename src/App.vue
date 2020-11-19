<template>
  <div id="app" :class="[sourceSelected]">
    <navbar/>
    <main class="main">
      <router-view />
    </main>
    <footer-bar class="footer-bar"></footer-bar>
  </div>
</template>

<script>
import Navbar from "Views/Layout/Navbar";
import FooterBar from "Views/Layout/FooterBar";

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
    };
  },
  computed: {
    ...mapState({
      sourceSelected: (state) => state.global.sourceSelected,
    })
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
    this.detectNetwork();
    this.initWebSocket();
  },
  mounted() {
    window.GLOBAL.vbus.$on("CHANGE_LANGUAGE", (language) => {
      this.$i18n.locale = language;
    });
    document.getElementsByTagName("body")[0].className = this.sourceSelected;
  },
  methods: {
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
      // network = "polkadot";
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
.banner {
  position: fixed;
  bottom: 0;
  width: 100%;
  margin-bottom: 10px;
  background: #333;
  padding: 15px;
  display: flex;
  align-items: center;
  .text {
    flex: 1 1 auto;
    font-size: 16px;
    color: #fff;
    .link {
      padding: 0 5px;
      color: #e90979;
    }
  }
  .btn {
    flex: 0 0 80px;
    font-size: 16px;
    cursor: pointer;
    background-color: #e6007a;
    color: #fff;
    display: inline-block;
    width: 80px;
    text-align: center;
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
  }
}
@media screen and (max-width: $screen-xs) {
  .banner {
    display: none;
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
  /deep/ {
    .italic {
      font-style: italic;
    }
  }
  .italic {
    font-style: italic;
    &.el-select {
      /deep/ input {
        font-style: italic;
      }
    }
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
