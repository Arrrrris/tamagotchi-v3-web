# Tamagotchi V3 发布到 GitHub Pages

这个目录已经是可直接发布的静态站点（只包含 Tamagotchi 页面和资源）。

## 1) 新建 GitHub 仓库

- 登录 GitHub，创建一个空仓库（例如：`tamagotchi-v3-web`）
- 不要勾选自动创建 README（保持空仓库）

## 2) 推送当前目录到仓库

在本目录执行（把 `<YOUR_REPO_URL>` 替换成你的仓库地址）：

```bash
git init
git add .
git commit -m "chore: publish tamagotchi v3 web"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

## 3) 开启 GitHub Pages

在仓库页面进入：

- `Settings` -> `Pages`
- `Build and deployment` 选择 `Deploy from a branch`
- Branch 选择 `main`，目录选择 `/ (root)`
- 保存后等待 1~3 分钟

上线地址通常为：

`https://<你的GitHub用户名>.github.io/<仓库名>/`

## 4) 说明

- 入口文件是 `index.html`
- 页面文件 `tamagotchi-v3-family.html` 也可直接访问
- favicon 使用相对路径 `./favicon.png`，项目页部署可正常显示

## 5) 上线后快速验收

- 页面可以打开，样式正常
- 角色/食物/道具图片正常加载
- 数据录入与筛选可用
- 移动端顶部 Tab 可横向滑动
- 移动端筛选可展开/收起，PC 端筛选常显
