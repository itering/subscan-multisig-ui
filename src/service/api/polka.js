export default [
  {
    name: "getNow",
    method: "POST",
    desc: "获取时间信息",
    baseURL: "",
    path: "/now",
    options: {}
  },
  {
    name: "getMetadata",
    method: "POST",
    desc: "元数据",
    baseURL: "",
    path: "/scan/metadata",
    options: {}
  },
  {
    name: "getToken",
    method: "POST",
    desc: "获取token信息",
    baseURL: "",
    path: "/scan/token",
    options: {
      noShowDefaultError: true
    }
  }
];
