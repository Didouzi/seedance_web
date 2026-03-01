# Docker 部署指南

## 前置要求

- Docker
- Docker Compose

## 快速开始

### 1. 构建并启动服务

```bash
# 构建并启动所有服务 (MySQL + Next.js App)
docker-compose up -d

# 查看日志
docker-compose logs -f app
```

### 2. 访问应用

应用将在 `http://localhost:3000` 启动

## 配置说明

### 环境变量

在 `docker-compose.yml` 中修改以下环境变量:

```yaml
environment:
  DATABASE_URL: "mysql://seedance:seedance123@mysql:3306/seedance_web"
  NEXTAUTH_URL: "http://your-domain.com"  # 修改为你的域名
  NEXTAUTH_SECRET: "change-this-to-a-random-secret"  # 修改为随机密钥
```

### MySQL 配置

默认配置:
- 用户名: `seedance`
- 密码: `seedance123`
- 数据库: `seedance_web`
- 端口: `3306`

**生产环境请务必修改密码!**

## 仅构建镜像 (不启动)

```bash
# 构建 x86 架构镜像
docker build --platform linux/amd64 -t seedance_web:latest .

# 保存镜像为文件
docker save seedance_web:latest -o seedance_web.tar

# 在服务器上加载镜像
docker load -i seedance_web.tar
```

## 本地开发

### 1. 启动 MySQL

```bash
# 仅启动 MySQL 服务
docker-compose up mysql -d
```

### 2. 运行迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 创建迁移 (首次)
npx prisma migrate dev --name init

# 或直接推送 schema (开发环境)
npx prisma db push
```

### 3. 启动开发服务器

```bash
npm run dev
```

## 生产部署

### 方案 1: 使用 docker-compose

```bash
# 1. 修改 docker-compose.yml 中的环境变量
# 2. 启动服务
docker-compose up -d

# 3. 查看状态
docker-compose ps
```

### 方案 2: 单独部署

```bash
# 1. 构建镜像
docker build --platform linux/amd64 -t seedance_web:latest .

# 2. 运行容器
docker run -d \
  --name seedance_app \
  -p 3000:3000 \
  -e DATABASE_URL="mysql://user:pass@mysql-host:3306/db" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  -e NEXTAUTH_SECRET="your-secret" \
  seedance_web:latest
```

## 数据持久化

MySQL 数据存储在 Docker volume `mysql_data` 中,即使删除容器数据也不会丢失。

查看 volumes:
```bash
docker volume ls
```

备份数据:
```bash
docker exec seedance_mysql mysqldump -u seedance -pseedance123 seedance_web > backup.sql
```

恢复数据:
```bash
docker exec -i seedance_mysql mysql -u seedance -pseedance123 seedance_web < backup.sql
```

## 常用命令

```bash
# 停止服务
docker-compose down

# 停止并删除数据
docker-compose down -v

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f app
docker-compose logs -f mysql

# 进入容器
docker-compose exec app sh
docker-compose exec mysql mysql -u seedance -pseedance123
```

## 故障排查

### 应用无法连接数据库

1. 检查 MySQL 是否启动:
```bash
docker-compose ps
```

2. 检查数据库连接:
```bash
docker-compose exec mysql mysql -u seedance -pseedance123 -e "SHOW DATABASES;"
```

### 查看应用日志

```bash
docker-compose logs -f app
```

### 重新构建镜像

```bash
docker-compose build --no-cache app
docker-compose up -d app
```

