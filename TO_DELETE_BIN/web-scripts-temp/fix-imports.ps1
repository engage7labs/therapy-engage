# ###desabilitado_mvp### - Corrigir importações diretas restantes do Lucide React
$files = Get-ChildItem -Path "." -Recurse -Include "*.tsx", "*.ts" -Exclude "node_modules"

Write-Host "Corrigindo importacoes diretas restantes..."

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Corrigir todas as importações diretas de /dist/esm/icons/
    $content = $content -replace 'import\s+(\w+)\s+from\s+"lucide-react/dist/esm/icons/[^"]*"', 'import { $1 } from "lucide-react"'
    
    # Corrigir importações múltiplas se existirem
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  FIXED: $($file.Name)"
    }
}

Write-Host "Correcao de importacoes concluida!"
