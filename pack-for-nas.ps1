# MiSub NAS 部署打包脚本
# 用于在本地 Windows 电脑上打包项目文件

$deployDir = "deploy-package"
$zipFile = "misub-deploy.zip"

Write-Host "🚀 开始打包 MiSub 项目..." -ForegroundColor Green

# 要打包的文件和目录
$files = @(
    "src",
    "public",
    "server",
    "functions",
    "Dockerfile",
    "docker-compose.yml",
    "docker-compose.dev.yml",
    "package.json",
    "vite.config.js",
    "schema.sql",
    ".dockerignore",
    "README.md",
    "DOCKER_DEPLOYMENT.md"
)

# 创建部署目录
if (Test-Path $deployDir) {
    Write-Host "🗑️  删除旧的部署目录..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# 复制文件
Write-Host "📦 复制项目文件..." -ForegroundColor Cyan
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Gray
        Copy-Item -Recurse $file $deployDir
    } else {
        Write-Host "  ⚠ $file (不存在,跳过)" -ForegroundColor Yellow
    }
}

# 删除旧的压缩包
if (Test-Path $zipFile) {
    Remove-Item -Force $zipFile
}

# 压缩
Write-Host "🗜️  压缩文件..." -ForegroundColor Cyan
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipFile -Force

# 显示结果
$fileSize = (Get-Item $zipFile).Length / 1MB
Write-Host ""
Write-Host "✅ 部署包已创建!" -ForegroundColor Green
Write-Host "📦 文件名: $zipFile" -ForegroundColor White
Write-Host "📊 大小: $([math]::Round($fileSize, 2)) MB" -ForegroundColor White
Write-Host ""
Write-Host "📝 下一步:" -ForegroundColor Yellow
Write-Host "  1. 将 $zipFile 传输到 NAS 服务器" -ForegroundColor Gray
Write-Host "  2. 在 NAS 上解压: unzip $zipFile" -ForegroundColor Gray
Write-Host "  3. 编辑 docker-compose.yml 设置密码" -ForegroundColor Gray
Write-Host "  4. 运行: docker-compose up -d" -ForegroundColor Gray
Write-Host ""

# 清理临时目录
Remove-Item -Recurse -Force $deployDir

Write-Host "🎉 完成!" -ForegroundColor Green
