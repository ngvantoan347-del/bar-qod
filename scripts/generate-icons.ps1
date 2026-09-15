# Generates the Dynamic Island app icons (pill/capsule logo).
# Usage: powershell -ExecutionPolicy Bypass -File scripts/generate-icons.ps1 -OutDir src-tauri/icons
param(
    [string]$OutDir = "src-tauri/icons"
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -LiteralPath $OutDir)) {
    New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
}

function New-PillIcon([int]$Size) {
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    $pad = [single]($Size * 0.07)
    $w = [single]($Size - 2 * $pad)
    $h = [single]($Size * 0.42)
    $x = $pad
    $y = [single](($Size - $h) / 2)
    $r = $h / 2

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = 2.0 * $r
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()

    $rect = New-Object System.Drawing.RectangleF([single]$x, [single]$y, [single]$w, [single]$h)
    $c1 = [System.Drawing.Color]::FromArgb(255, 34, 211, 238)
    $c2 = [System.Drawing.Color]::FromArgb(255, 129, 140, 248)
    $c3 = [System.Drawing.Color]::FromArgb(255, 232, 121, 249)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c3, [single]45.0)
    $colors = New-Object System.Drawing.Color[] 3
    $colors[0] = $c1
    $colors[1] = $c2
    $colors[2] = $c3
    $blend = New-Object System.Drawing.Drawing2D.ColorBlend
    $blend.Positions = [single[]]@(0.0, 0.55, 1.0)
    $blend.Colors = $colors
    $brush.InterpolationColors = $blend
    $g.FillPath($brush, $path)

    # notched "dynamic island" white dot
    $dotR = [single]($Size * 0.17)
    $cx = [single]($x + $w - $w * 0.30)
    $cy = [single]($y + $h / 2)
    $dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 250, 252, 255))
    $g.FillEllipse($dotBrush, [single]($cx - $dotR), [single]($cy - $dotR), [single](2 * $dotR), [single](2 * $dotR))

    $path.Dispose()
    $brush.Dispose()
    $dotBrush.Dispose()
    $g.Dispose()
    return $bmp
}

$pngPaths = @()
foreach ($size in @(16, 24, 32, 48, 64, 128, 256)) {
    $bmp = New-PillIcon $size
    $p = Join-Path $OutDir "$($size)x$($size).png"
    $bmp.Save($p, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $pngPaths += , $p
}

# Build icon.ico (single 256x256 PNG frame, Vista+ format)
$png256 = [System.IO.File]::ReadAllBytes((Join-Path $OutDir "256x256.png"))
$ico = Join-Path $OutDir "icon.ico"
$fs = [System.IO.File]::Open($ico, [System.IO.FileMode]::Create)

$writer = New-Object System.IO.BinaryWriter($fs)
# ICONDIR
$writer.Write([UInt16]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]1)
# ICONDIRENTRY
$writer.Write([Byte]0)   # width  -> 256
$writer.Write([Byte]0)   # height -> 256
$writer.Write([Byte]0)   # color count
$writer.Write([Byte]0)   # reserved
$writer.Write([UInt16]1) # planes
$writer.Write([UInt16]32) # bpp
$writer.Write([UInt32]$png256.Length)
$writer.Write([UInt32]22)   # offset
$writer.Write($png256)
$writer.Flush()
$writer.Dispose()
$fs.Dispose()

Write-Output "Icons generated in $OutDir"
Get-ChildItem -LiteralPath $OutDir | Select-Object Name, Length | Format-Table -AutoSize