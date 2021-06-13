import Vue from "vue";
import {
  Autocomplete,
  Loading,
  MessageBox,
  Notification,
  Message,
  Button,
  DatePicker,
  TimeSelect,
  TimePicker,
  Drawer,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Scrollbar,
  Carousel,
  CarouselItem,
  Checkbox,
  CheckboxGroup,
  Col,
  Collapse,
  CollapseItem,
  // Carousel,
  // CarouselItem,
  // Breadcrumb,
  // BreadcrumbItem,
  InputNumber,
  Dialog,
  // Collapse,
  // CollapseItem,
  Icon,
  Input,
  Link,
  // Menu,
  // Submenu,
  // MenuItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Tooltip,
  // Pagination,
  Popover,
  Row,
  Select,
  Option,
  Pagination,
  Progress
  // Badge
} from "element-ui";
import Account from "../views/Components/form-control/Account.vue";
import Amount from "../views/Components/form-control/Amount.vue";
import Unknown from "../views/Components/form-control/Unknown.vue";
// 按需引入element-ui的部分功能
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
// Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

Vue.use(Autocomplete);
Vue.use(Button);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Drawer);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Carousel);
Vue.use(CarouselItem);
// Vue.use(Breadcrumb)
// Vue.use(BreadcrumbItem)
Vue.use(InputNumber)
Vue.use(Dialog)
// Vue.use(Collapse)
// Vue.use(CollapseItem)
Vue.use(Icon);
Vue.use(Input);
Vue.use(Scrollbar);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Col);
Vue.use(Tooltip);
Vue.use(Link);
// Vue.use(Menu)
// Vue.use(Submenu)
// Vue.use(MenuItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Popover)
Vue.use(Select);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(Progress);
Vue.use(Row);
// Vue.use(Badge)


Vue.use(Account);
Vue.use(Amount);
Vue.use(Unknown);
