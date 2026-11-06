# Build SotfGuide.exe (needs only the .NET Framework 4 built into Windows)
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$out  = Join-Path $here 'dist'
$tmp  = Join-Path $here 'obj'
New-Item -ItemType Directory -Force $out, $tmp | Out-Null
$csc = "$env:WINDIR\Microsoft.NET\Framework64\v4.0.30319\csc.exe"

# 1. Generate icon
& $csc /nologo /target:exe "/out:$tmp\IconGen.exe" /r:System.Drawing.dll "$here\IconGen.cs"
if ($LASTEXITCODE -ne 0) { throw 'IconGen build failed' }
& "$tmp\IconGen.exe" "$tmp\icon.ico"

# 2. Compile app (craft.json embedded)
& $csc /nologo /target:winexe /optimize+ /codepage:65001 `
  "/out:$out\SotfGuide.exe" "/win32icon:$tmp\icon.ico" `
  "/resource:$here\craft.json,craft.json" `
  /r:System.Web.Extensions.dll /r:System.Windows.Forms.dll /r:System.Drawing.dll `
  "$here\SotfGuide.cs" "$here\Diagram.cs"
if ($LASTEXITCODE -ne 0) { throw 'App build failed' }
Write-Host "OK: $out\SotfGuide.exe"

# 3. Static web version data (web/data.js)
$web = Join-Path (Split-Path -Parent $here) 'web'
New-Item -ItemType Directory -Force $web | Out-Null
$json = [IO.File]::ReadAllText("$here\craft.json", [Text.Encoding]::UTF8)
[IO.File]::WriteAllText("$web\data.js", "window.BOOK = " + $json + ";`n", (New-Object Text.UTF8Encoding $false))
Write-Host "OK: $web\data.js"
