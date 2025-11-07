# Script para corrigir encoding UTF-8 em arquivos TypeScript/React
Write-Host "Corrigindo encoding de arquivos..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "app\src" -Include *.tsx,*.ts -Recurse

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        if ($content -match 'Ã') {
            Write-Host "Corrigindo: $($file.Name)" -ForegroundColor Yellow
            
            $content = $content -replace 'Ã§', 'ç'
            $content = $content -replace 'Ã£', 'ã'
            $content = $content -replace 'Ã©', 'é'
            $content = $content -replace 'Ã­', 'í'
            $content = $content -replace 'Ã³', 'ó'
            $content = $content -replace 'Ã¡', 'á'
            $content = $content -replace 'Ãª', 'ê'
            $content = $content -replace 'Ãµ', 'õ'
            $content = $content -replace 'Ã ', 'à'
            $content = $content -replace ' Ã ', ' à '
            
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
            
            Write-Host "  Corrigido OK" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  Erro em $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host "Concluido!" -ForegroundColor Green
