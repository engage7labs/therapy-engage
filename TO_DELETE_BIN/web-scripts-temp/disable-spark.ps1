# ###desabilitado_mvp### - Desabilitar todas as referências ao Spark Framework
$files = Get-ChildItem -Path "." -Recurse -Include "*.tsx", "*.ts" -Exclude "node_modules"

Write-Host "Desabilitando referencias ao Spark Framework..."

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Verificar se arquivo tem referências ao spark
    if ($content -match '\bspark\b') {
        # Comentar linhas que usam spark
        $lines = $content -split '\r?\n'
        $newLines = @()
        
        foreach ($line in $lines) {
            if ($line -match '\bspark\b' -and $line -notmatch '^\s*//') {
                # Comentar a linha e adicionar tag
                $newLines += "      // ###desabilitado_mvp### $line"
            } else {
                $newLines += $line
            }
        }
        
        $content = $newLines -join "`n"
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  SPARK DISABLED: $($file.Name)"
        }
    }
}

Write-Host "Desabilitacao do Spark concluida!"
