# IHF 平台测试账号一览表

> 本文档整理了平台所有角色的测试账号信息，供开发、测试和演示使用。
> 更新日期: 2026-07-21（已通过 API 实际验证全部账号）

---

## 一、供应商账号（后端 JWT 认证）

### 登录入口

- 前端地址: `http://localhost:3000/login`
- 后端 API: `http://localhost:8000/api/auth/login`（POST）
- 登录方式: 邮箱/账号 + 密码（连接后端 API 真实验证，返回 JWT Token）
- 前提条件: 后端 Docker 容器已启动（MySQL + PHP-FPM + Nginx）
- 自动补全: 输入账号不含 `@` 时，自动补全为 `账号@ihf-demo.com`

### 账号列表

| 账号输入              | 邮箱                      | 密码            | 登录后显示名称 | 角色标识 | 说明                                          |
|-----------------------|---------------------------|-----------------|----------------|----------|-----------------------------------------------|
| `huifa`               | `huifa@ihf-demo.com`      | `supplier123`   | 惠发食品       | 供应商   | 主测试账号，关联已审核产品，用于全流程测试       |

### 验证结果（2026-07-21）

```
POST /api/auth/login
Status: 200 ✓
User name: 惠发食品
User email: huifa@ihf-demo.com
JWT Token: 已返回
```

### 登录流程

1. 供应商登录走后端 JWT 认证（`AuthPortal.tsx` → `loginWithBackend()`）
2. 账号不含 `@` 时自动补全为 `@ihf-demo.com`（如输入 `huifa` → `huifa@ihf-demo.com`）
3. 登录成功后返回 JWT Token，前端存储在 localStorage 键 `ihf_auth_user` 中
4. 登录失败时页面提示：`登录失败，请检查邮箱和密码是否正确。测试账号：huifa@ihf-demo.com / supplier123`
5. 供应商登录后跳转到 `/supplier`

### 注意事项

- 供应商账号通过后端 API 注册接口创建（非 Seeder 自动生成）
- 密码经 bcrypt 哈希存储在 MySQL `users` 表中
- 若后端未启动，供应商登录将失败
- Token 过期后调用 `/api/auth/refresh` 刷新

---

## 二、采购商账号（前端 Mock 模式）

### 登录入口

- 地址: `http://localhost:3000/login`
- 登录方式: 邮箱/账号 + 密码（前端 Mock，任意密码可登录）
- 适用场景: 前端独立开发、UI 预览（后端采购商模块尚未就绪）

### 账号列表

| 账号输入       | 自动补全邮箱                        | 密码   | 登录后显示名称 | 角色标识 | 说明                                  |
|----------------|-------------------------------------|--------|----------------|----------|---------------------------------------|
| `testbuyer`    | `testbuyer@ihf-demo.com`            | 任意   | testbuyer      | 已认证   | 采购商测试账号                        |
| 任意邮箱       | 输入的邮箱                           | 任意   | 邮箱前缀       | 已认证   | 输入任意邮箱即可自动登录               |

### 注意事项

- 采购商登录走前端 Mock 模式（`AuthPortal.tsx` → `login()`），不连接后端
- 账号不含 `@` 时同样补全为 `@ihf-demo.com`
- 用户信息存储在 localStorage 键 `ihf_auth_user` 中
- 采购商登录后跳转到 `/buyer`

---

## 三、运营管理后台账号（后端 JWT 认证）

### 登录入口

- 前端地址: `http://localhost:3000/admin/login`
- 后端 API: `http://localhost:8000/api/admin/auth/login`（POST）
- 登录方式: 邮箱 + 密码（连接后端 API 真实验证，返回 JWT Token + 权限列表）
- 快捷登录: 登录页提供 5 个演示账号一键填充按钮
- 前提条件: 后端 Docker 容器已启动

### 账号列表

| 角色                          | 姓名       | 邮箱               | 密码        | 部门     | 权限数        | 可用功能                                         |
|-------------------------------|------------|--------------------|-------------|----------|---------------|--------------------------------------------------|
| 超级管理员 (`super_admin`)     | 超级管理员  | `admin@ihf.com`    | `admin123`  | 运营部   | 18 项（全部）  | 所有功能                                         |
| 运营经理 (`operations_manager`)| 运营经理   | `ops@ihf.com`      | `ops123`    | 运营部   | 14 项         | 产品审核、供应商/采购商管理、询盘管理、资讯/Banner管理 |
| 内容编辑 (`content_editor`)   | 内容编辑    | `editor@ihf.com`   | `editor123` | 内容部   | 4 项          | 看板、资讯管理、Banner管理、内容发布               |
| 审核员 (`auditor`)            | 审核员      | `audit@ihf.com`    | `audit123`  | 质检部   | 3 项          | 看板、产品审核查看、询盘查看                       |
| 观察者 (`viewer`)             | 观察者      | `viewer@ihf.com`   | `viewer123` | 市场部   | 1 项          | 仅数据看板查看                                   |

### 验证结果（2026-07-21）

```
POST /api/admin/auth/login
admin@ihf.com    → 超级管理员  (18 项权限) ✓
ops@ihf.com      → 运营经理    (14 项权限) ✓
editor@ihf.com   → 内容编辑    (4 项权限)  ✓
audit@ihf.com    → 审核员      (3 项权限)  ✓
viewer@ihf.com   → 观察者      (1 项权限)  ✓
```

### 权限矩阵（18 项）

| 权限标识              | 说明             | 超级管理员 | 运营经理 | 内容编辑 | 审核员 | 观察者 |
|-----------------------|------------------|:----------:|:--------:|:--------:|:------:|:------:|
| `dashboard.view`      | 数据看板         |     Y      |    Y     |    Y     |   Y    |   Y    |
| `products.review`     | 产品审核查看     |     Y      |    Y     |    -     |   Y    |   -    |
| `products.approve`    | 产品审核通过     |     Y      |    Y     |    -     |   -    |   -    |
| `products.reject`     | 产品审核驳回     |     Y      |    Y     |    -     |   -    |   -    |
| `suppliers.view`      | 供应商查看       |     Y      |    Y     |    -     |   -    |   -    |
| `suppliers.verify`    | 供应商资质审核   |     Y      |    Y     |    -     |   -    |   -    |
| `suppliers.suspend`   | 供应商停用/封禁  |     Y      |    Y     |    -     |   -    |   -    |
| `buyers.view`         | 采购商查看       |     Y      |    Y     |    -     |   -    |   -    |
| `buyers.suspend`      | 采购商停用/禁言  |     Y      |    Y     |    -     |   -    |   -    |
| `inquiries.view`      | 询盘查看         |     Y      |    Y     |    -     |   Y    |   -    |
| `inquiries.close`     | 询盘关闭         |     Y      |    Y     |    -     |   -    |   -    |
| `content.news`        | 资讯管理         |     Y      |    Y     |    Y     |   -    |   -    |
| `content.banner`      | Banner 管理      |     Y      |    Y     |    Y     |   -    |   -    |
| `content.publish`     | 内容发布         |     Y      |    Y     |    Y     |   -    |   -    |
| `settings.users`      | 用户管理         |     Y      |    -     |    -     |   -    |   -    |
| `settings.roles`      | 角色权限管理     |     Y      |    -     |    -     |   -    |   -    |
| `settings.system`     | 系统设置         |     Y      |    -     |    -     |   -    |   -    |
| `settings.logs`       | 系统日志         |     Y      |    -     |    -     |   -    |   -    |

### 注意事项

- 管理后台走后端 JWT 认证（`api/admin/auth/login`），非 Mock 模式
- 账号由 `InitialDataSeeder.php` 写入数据库，密码经 bcrypt 哈希存储
- 登录成功后返回 JWT Token + 权限列表，前端 `admin-auth-context.tsx` 存储
- 权限由后端动态返回（`user.permissions` 数组），非前端硬编码
- 管理后台与公网使用独立的认证系统（不同 Token、不同 API 路由组）
- 登录页 5 个演示账号按钮可一键填充邮箱和密码
- 若后端未启动，管理后台登录将失败

---

## 四、账号体系对照说明

| 维度       | 供应商账号                          | 采购商账号                          | 管理后台账号                          |
|------------|-------------------------------------|-------------------------------------|---------------------------------------|
| 邮箱域名   | `@ihf-demo.com`                     | `@ihf-demo.com`                     | `@ihf.com`                            |
| 密码       | 真实密码（bcrypt 哈希）             | 任意                                | 真实密码（bcrypt 哈希）               |
| 认证方式   | 后端 JWT Token + Refresh Token      | 前端 Mock（无认证）                 | 后端 JWT Token + Refresh Token        |
| API 路径   | `api/auth/login`                    | 无（前端直接写入）                  | `api/admin/auth/login`                |
| 存储       | MySQL `users` 表 + localStorage     | localStorage                         | MySQL `admin_users` 表 + localStorage |
| 后端依赖   | 是（必须启动后端）                  | 否                                  | 是（必须启动后端）                    |
| 适用场景   | 全栈联调、API 测试、产品发布全流程  | UI 预览、静态部署                   | 管理后台全功能、权限验证              |

> **注意：** 供应商和管理后台均走后端 JWT 认证，采购商为前端 Mock 模式。三者邮箱域名不同：供应商/采购商用 `@ihf-demo.com`，管理后台用 `@ihf.com`。

---

## 五、快速测试流程

### 流程 1: 供应商发布产品 → 管理员审核 → 前台展示（全栈模式）

1. 访问 `/login`，输入 `huifa` 或 `huifa@ihf-demo.com` + `supplier123`，登录供应商
2. 进入 `/supplier`，点击「发布新产品」
3. 填写产品信息（5 区表单：基本信息、食品属性与安全、图片与视频、贸易与物流、HALAL 认证），提交审核
4. 退出登录，访问 `/admin/login`，点击「超级管理员」按钮一键登录
5. 进入 `/admin/products`，找到刚提交的产品，点击「通过」
6. 访问首页或 `/products`，确认新产品已出现在列表中

### 流程 2: 采购商询盘 → 供应商回复（Mock 模式）

1. 访问 `/login`，切换到采购商标签，输入任意邮箱 + 任意密码登录
2. 进入 `/products`，点击任意产品的「立即询价」
3. 填写询盘内容并提交
4. 退出登录，用 `huifa` / `supplier123` 登录供应商
5. 进入 `/supplier` 的「询盘管理」查看并回复

### 流程 3: 权限验证（管理后台）

1. 用 `viewer@ihf.com` / `viewer123` 登录管理后台
2. 尝试访问 `/admin/products` — 应显示「权限不足」
3. 用 `editor@ihf.com` / `editor123` 登录
4. 只能访问看板和资讯/Banner 管理，无法访问产品审核
