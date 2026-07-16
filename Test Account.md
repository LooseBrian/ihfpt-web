# IHF 平台测试账号一览表

> 本文档整理了平台所有角色的测试账号信息，供开发、测试和演示使用。
> 更新日期: 2026-07-16

---

## 一、公网站点账号

### 登录入口

- 地址: http://localhost:3000/login
- 登录方式: 邮箱/账号 + 密码 (当前阶段无需验证，任意密码可登录)

### 1. 供应商账号

| 账号输入 | 邮箱 | 密码 | 登录后显示名称 | 角色标识 | 说明 |
|---------|------|------|---------------|---------|------|
| huifa | huifa@ihf.org | 任意 | 惠发食品有限公司 | 金牌工厂 | 惠发食品供应商，关联种子产品，有店铺页 /store/huifa |
| greenhalal | greenhalal@ihf.org | 任意 | greenhalal有限公司 | 金牌工厂 | 通用供应商测试账号 |
| xijiangbest | xijiangbest@ihf.org | 任意 | xijiangbest有限公司 | 金牌工厂 | 通用供应商测试账号 |
| 任意邮箱 | 输入的邮箱 | 任意 | 邮箱前缀+有限公司 | 金牌工厂 | 输入任意邮箱即可自动生成供应商账号 |

### 2. 采购商账号

| 账号输入 | 邮箱 | 密码 | 登录后显示名称 | 角色标识 | 说明 |
|---------|------|------|---------------|---------|------|
| testbuyer | testbuyer@ihf.org | 任意 | testbuyer | 已认证 | 采购商测试账号 |
| 任意邮箱 | 输入的邮箱 | 任意 | 邮箱前缀 | 已认证 | 输入任意邮箱即可自动生成采购商账号 |

### 注意事项

- 公网账号登录后，用户信息存储在 localStorage 键 `ihf_auth_user` 中
- 清除浏览器数据或使用无痕模式可重置登录状态
- 供应商登录后跳转到 /supplier，采购商登录后跳转到 /buyer

---

## 二、运营管理后台账号

### 登录入口

- 地址: http://localhost:3000/admin/login
- 登录方式: 邮箱 + 密码 (需匹配预设密码)
- 快捷登录: 登录页提供 5 个演示账号一键填充按钮

### 账号列表

| 角色 | 姓名 | 邮箱 | 密码 | 权限数 | 可用功能 |
|------|------|------|------|--------|----------|
| 超级管理员 (super_admin) | 系统管理员 | admin@ihf.org | admin123 | 18项 (全部) | 所有功能 |
| 运营主管 (operations_manager) | 运营张经理 | ops@ihf.org | ops123 | 14项 | 产品审核、供应商/采购商管理、询盘管理、资讯/Banner管理 |
| 内容编辑 (content_editor) | 编辑小李 | editor@ihf.org | editor123 | 5项 | 资讯管理、Banner管理、产品查看 |
| 审核员 (auditor) | 审核员王工 | audit@ihf.org | audit123 | 7项 | 产品审核(通过/驳回)、供应商查看、询盘查看 |
| 只读查看员 (viewer) | 观察员赵老师 | viewer@ihf.org | viewer123 | 4项 | 看板、供应商/采购商/询盘查看 (纯只读) |

### 权限矩阵 (18项)

| 权限标识 | 说明 | 超级管理员 | 运营主管 | 内容编辑 | 审核员 | 查看员 |
|----------|------|:---------:|:---------:|:---------:|:------:|:------:|
| dashboard.view | 数据看板 | Y | Y | Y | Y | Y |
| products.review | 产品审核查看 | Y | Y | Y | Y | - |
| products.approve | 产品审核通过 | Y | Y | - | Y | - |
| products.reject | 产品审核驳回 | Y | Y | - | Y | - |
| suppliers.view | 供应商查看 | Y | Y | - | Y | Y |
| suppliers.verify | 供应商资质审核 | Y | Y | - | Y | - |
| suppliers.suspend | 供应商停用/封禁 | Y | Y | - | - | - |
| buyers.view | 采购商查看 | Y | Y | - | - | Y |
| buyers.suspend | 采购商停用/禁言 | Y | Y | - | - | - |
| inquiries.view | 询盘查看 | Y | Y | - | Y | Y |
| inquiries.close | 询盘关闭 | Y | Y | - | - | - |
| content.news | 资讯管理 | Y | Y | Y | - | - |
| content.banner | Banner管理 | Y | Y | Y | - | - |
| content.publish | 内容发布 | Y | Y | Y | - | - |
| settings.users | 用户管理 | Y | - | - | - | - |
| settings.roles | 角色权限管理 | Y | - | - | - | - |
| settings.system | 系统设置 | Y | - | - | - | - |
| settings.logs | 系统日志 | Y | - | - | - | - |

### 注意事项

- 管理后台账号信息存储在 localStorage 键 `ihf_admin_user` 中
- 后台与公网使用独立的认证系统，互不影响
- 登录页 5 个演示账号按钮可一键填充邮箱和密码

---

## 三、快速测试流程

### 流程 1: 供应商发布产品 - 管理员审核 - 前台展示

1. 访问 /login，输入 huifa + 任意密码，登录供应商
2. 进入 /supplier，点击「发布新产品」
3. 填写产品信息 (至少 8 项必填字段)，提交审核
4. 退出登录，访问 /admin/login，点击「超级管理员」按钮一键登录
5. 进入 /admin/products，找到刚提交的产品，点击「通过」
6. 访问首页或 /products，确认新产品已出现在列表中

### 流程 2: 采购商询盘 - 供应商回复

1. 访问 /login，切换到采购商标签，输入任意邮箱 + 任意密码登录
2. 进入 /products，点击任意产品的「立即询价」
3. 填写询盘内容并提交
4. 退出登录，用 huifa 登录供应商
5. 进入 /supplier 的「询盘管理」查看并回复

### 流程 3: 权限验证

1. 用 viewer@ihf.org / viewer123 登录管理后台
2. 尝试访问 /admin/products - 应显示「权限不足」
3. 用 editor@ihf.org / editor123 登录
4. 只能访问看板和资讯/Banner管理，无法访问产品审核
