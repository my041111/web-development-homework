# 确保我们在正确的目录中
$currentDir = Get-Location
Write-Host "当前目录: $currentDir"

# 检查src/app目录是否存在
if (Test-Path -Path ".\src\app") {
    Write-Host "src/app目录存在，继续启动服务器..."
} else {
    Write-Host "错误: src/app目录不存在！" -ForegroundColor Red
    exit 1
}

# 切换到项目目录
Set-Location -Path $PSScriptRoot
# 运行开发服务器
Write-Host "启动Next.js开发服务器..." -ForegroundColor Green
npm run dev