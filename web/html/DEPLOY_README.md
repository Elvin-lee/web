# 资源申请页面Nginx部署指南

本指南将帮助您将资源申请页面部署到Nginx服务器上，并通过IP地址访问。

## 前提条件

- 已安装Nginx服务器
- 已获取`d:\project\html`目录下的所有文件

## 步骤1：准备文件

确保您有以下文件在`d:\project\html`目录下：
- `resource_request.html` - 主页面文件
- `styles.css` - 样式文件
- `app.js` - 主应用脚本
- `init.js` - 初始化脚本
- `resourceTemplates.js` - 资源模板脚本
- `backgroundSlider.js` - 背景图片轮播脚本
- `images/` - 包含所有背景图片的目录

## 步骤2：配置Nginx

1. 在`d:\project\`目录下找到我们提供的`nginx.conf`文件
2. 将此配置文件复制到您的Nginx安装目录下的`conf`文件夹中，替换原有的`nginx.conf`文件（建议先备份原文件）

### 配置说明

我们的Nginx配置文件包含以下主要设置：
- 监听80端口（默认HTTP端口）
- 根目录设置为`d:\project\html`
- 默认首页设置为`resource_request.html`
- 配置了静态文件缓存策略（图片缓存30天，CSS/JS缓存7天）
- 配置了访问日志和错误日志

## 步骤3：启动Nginx服务

### Windows系统

1. 打开命令提示符（管理员权限）
2. 导航到Nginx安装目录
3. 执行以下命令启动Nginx：
   ```
   nginx.exe
   ```

### Linux系统

1. 打开终端
2. 执行以下命令启动Nginx：
   ```bash
   sudo systemctl start nginx
   ```
   或
   ```bash
   sudo service nginx start
   ```

## 步骤4：访问页面

1. 确保Nginx服务已成功启动
2. 打开浏览器
3. 在地址栏中输入Nginx服务器的IP地址（例如：`http://192.168.1.100`）
4. 您应该能够看到资源申请页面

## 常见问题解决

### 页面无法加载
- 检查Nginx服务是否正在运行
- 检查防火墙设置，确保80端口已开放
- 检查配置文件中的文件路径是否正确

### 图片无法显示
- 检查`images`目录是否存在，且包含所有需要的图片文件
- 检查图片文件权限是否正确

### 样式或脚本未加载
- 检查CSS和JS文件是否存在且路径正确
- 清除浏览器缓存后重新加载页面

## 其他配置选项

如果需要修改端口号、域名或其他配置，请编辑`nginx.conf`文件：

1. 修改端口号：将`listen 80;`改为其他端口号（如`listen 8080;`）
2. 添加域名：将`server_name _;`改为您的域名（如`server_name resource-app.example.com;`）
3. 修改根目录：将`root d:\project\html;`改为您的实际文件路径

修改配置后，请重启Nginx服务使更改生效。

## 停止Nginx服务

### Windows系统

在命令提示符中执行：
```
nginx.exe -s stop
```

### Linux系统

```bash
sudo systemctl stop nginx
```
或
```bash
sudo service nginx stop
```

## 重新加载Nginx配置

修改配置文件后，可以不重启服务而重新加载配置：

### Windows系统

```
nginx.exe -s reload
```

### Linux系统

```bash
sudo systemctl reload nginx
```
或
```bash
sudo service nginx reload
```