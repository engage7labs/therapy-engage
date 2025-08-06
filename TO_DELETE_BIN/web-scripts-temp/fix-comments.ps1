# ###desabilitado_mvp### - Corrigir comentários malformados do Spark
$files = Get-ChildItem -Path "." -Recurse -Include "*.tsx", "*.ts" -Exclude "node_modules"

Write-Host "Corrigindo comentarios malformados do Spark..."

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Corrigir template literals comentados incorretamente
    $content = $content -replace '// ###desabilitado_mvp###\s+const prompt = spark\.llmPrompt`([^`]*)`', '// ###desabilitado_mvp### const prompt = "Template desabilitado para MVP"'
    
    # Corrigir outras chamadas do spark comentadas incorretamente
    $content = $content -replace '// ###desabilitado_mvp###\s+([^`\n]*spark[^`\n]*)', '// ###desabilitado_mvp### $1'
    
    # Corrigir blocos de template literals mal comentados
    if ($content -match '// ###desabilitado_mvp###[^`]*`[^`]*`') {
        $lines = $content -split '\r?\n'
        $newLines = @()
        $inCommentedBlock = $false
        
        foreach ($line in $lines) {
            if ($line -match '// ###desabilitado_mvp###.*spark\.llmPrompt') {
                $newLines += '      // ###desabilitado_mvp### const prompt = "Template desabilitado para MVP"'
                $inCommentedBlock = $true
            } elseif ($inCommentedBlock -and $line -match '^\s*`\s*$') {
                $inCommentedBlock = $false
                # Pular esta linha (fim do template)
            } elseif ($inCommentedBlock) {
                # Pular linhas do template comentado
            } else {
                $newLines += $line
            }
        }
        
        $content = $newLines -join "`n"
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  FIXED COMMENTS: $($file.Name)"
    }
}

Write-Host "Correcao de comentarios concluida!"
