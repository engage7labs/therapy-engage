# Script para corrigir ícones Lucide React problemáticos
# ###desabilitado_mvp### - Substituição automática para resolver build

# Mapeamento de ícones problemáticos para ícones válidos
$iconReplacements = @{
    'Warning' = 'AlertTriangle'
    'TrendUp' = 'TrendingUp'
    'TrendDown' = 'TrendingDown'
    'FirstAid' = 'Cross'
    'Microphone' = 'Mic'
    'MicrophoneSlash' = 'MicOff'
    'VideoCamera' = 'Video'
    'PhoneSlash' = 'PhoneOff'
    'Record' = 'Circle'
    'ChatCircle' = 'MessageCircle'
    'BellRinging' = 'BellRing'
    'ShieldWarning' = 'ShieldAlert'
    'ClipboardText' = 'Clipboard'
    'Stop' = 'Square'
    'CameraSlash' = 'CameraOff'
}

# Arquivos TypeScript/TSX no projeto
$files = Get-ChildItem -Path "." -Recurse -Include "*.tsx", "*.ts" -Exclude "node_modules"

Write-Host "Iniciando correcao automatica de icones Lucide React..."
Write-Host "Encontrados $($files.Count) arquivos para processar"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $changed = $false
    
    foreach ($oldIcon in $iconReplacements.Keys) {
        $newIcon = $iconReplacements[$oldIcon]
        
        # Substituir importações
        if ($content -match "import.*$oldIcon.*from.*lucide-react") {
            $content = $content -replace "\b$oldIcon\b", $newIcon
            $changed = $true
            Write-Host "  OK $($file.Name): $oldIcon -> $newIcon"
        }
        
        # Substituir uso de componentes
        if ($content -match "<$oldIcon\s") {
            $content = $content -replace "<$oldIcon\s", "<$newIcon "
            $changed = $true
        }
        
        if ($content -match "<$oldIcon>") {
            $content = $content -replace "<$oldIcon>", "<$newIcon>"
            $changed = $true
        }
        
        if ($content -match "<$oldIcon/>") {
            $content = $content -replace "<$oldIcon/>", "<$newIcon/>"
            $changed = $true
        }
    }
    
    # Corrigir importações diretas de /dist/esm/icons/
    if ($content -match 'from "lucide-react/dist/esm/icons/') {
        $content = $content -replace 'from "lucide-react/dist/esm/icons/[^"]*"', 'from "lucide-react"'
        $changed = $true
        Write-Host "  FIXED $($file.Name): Corrigida importacao direta"
    }
    
    if ($changed) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  SAVED Arquivo atualizado: $($file.Name)"
    }
}

Write-Host "`nCorrecao de icones concluida!"
Write-Host "Verificando resultado..."
