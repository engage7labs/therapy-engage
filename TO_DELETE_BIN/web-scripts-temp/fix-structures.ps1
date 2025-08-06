# ###desabilitado_mvp### - Corrigir estruturas incompletas após desabilitação do Spark
$files = @(
    "app\components\session\session-recorder.tsx",
    "components\session\session-recorder.tsx", 
    "src\components\session\session-recorder.tsx",
    "components\session\patient-consent-form.tsx",
    "src\components\session\patient-consent-form.tsx"
)

Write-Host "Corrigindo estruturas incompletas..."

foreach ($filePath in $files) {
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $originalContent = $content
        
        # Corrigir blocos incompletos após comentários do spark
        $content = $content -replace '(\s*// ###desabilitado_mvp###[^\n]*\n)(\s*// ###desabilitado_mvp###[^\n]*\n)(\s*})(\s*catch)', '$1$2$3$4'
        
        # Adicionar fechamento de bloco se necessário após comentários spark
        if ($content -match '// ###desabilitado_mvp###.*const prompt.*\n\s*$') {
            $content = $content -replace '(// ###desabilitado_mvp###.*const prompt.*)\n(\s*)$', '$1' + "`n`$2" + '}`n'
        }
        
        # Corrigir vírgulas em arrays/objetos mal comentados
        $content = $content -replace ',\s*// ###desabilitado_mvp###[^\n]*\n\s*}', '`n      }' 
        
        if ($content -ne $originalContent) {
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "  FIXED STRUCTURE: $filePath"
        }
    }
}

# Corrigir especificamente problemas conhecidos
$sessionRecorderPath = "app\components\session\session-recorder.tsx"
if (Test-Path $sessionRecorderPath) {
    $content = Get-Content $sessionRecorderPath -Raw
    
    # Garantir que há um try-catch completo
    $content = $content -replace '(\s*// ###desabilitado_mvp###.*const aiInsights.*\n\s*// ###desabilitado_mvp###.*const prompt.*)\n(\s*})(\s*catch)', '$1' + "`n`$2`$3"
    
    Set-Content -Path $sessionRecorderPath -Value $content -NoNewline
    Write-Host "  FIXED SPECIFIC: session-recorder.tsx"
}

Write-Host "Correcao de estruturas concluida!"
