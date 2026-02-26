食物图片命名规则

1) 文件放在本目录：tools/tamagotchi/food-icons/
2) 文件名使用“食物ID.webp”或“食物ID.png”
   例如：S030.webp、F015.webp、S001.png
3) ID 必须与页面食物资料库里的 id 字段一致
4) 推荐尺寸：至少 64x64（任意尺寸都可显示）

网页会自动按以下顺序读取：
1. ./food-icons/{id}.webp
2. ./food-icons/{id}.png

如果某条食物在数据里手动写了 image 字段，则优先使用手动路径。
