# Corrigir checkbox.tsx
$file = "app/components/ui/checkbox.tsx"
(Get-Content $file) -replace 'import CheckIcon from "lucide-react"', 'import { Check } from "lucide-react"' -replace 'CheckIcon', 'Check' | Set-Content $file

# Corrigir carousel.tsx
$file = "app/components/ui/carousel.tsx"
(Get-Content $file) -replace 'import ArrowLeft from "lucide-react"', 'import { ArrowLeft, ArrowRight } from "lucide-react"' -replace 'import ArrowRight from "lucide-react"', '' | Set-Content $file

# Corrigir resizable.tsx
$file = "app/components/ui/resizable.tsx"
(Get-Content $file) -replace 'import GripVerticalIcon from "lucide-react"', 'import { GripVertical } from "lucide-react"' -replace 'GripVerticalIcon', 'GripVertical' | Set-Content $file

# Corrigir radio-group.tsx
$file = "app/components/ui/radio-group.tsx"
(Get-Content $file) -replace 'import CircleIcon from "lucide-react"', 'import { Circle } from "lucide-react"' -replace 'CircleIcon', 'Circle' | Set-Content $file

# Corrigir pagination.tsx
$file = "app/components/ui/pagination.tsx"
$content = Get-Content $file
$content = $content -replace 'import ChevronLeftIcon from "lucide-react"', 'import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"'
$content = $content -replace 'import ChevronRightIcon from "lucide-react"', ''
$content = $content -replace 'import MoreHorizontalIcon from "lucide-react"', ''
$content = $content -replace 'ChevronLeftIcon', 'ChevronLeft'
$content = $content -replace 'ChevronRightIcon', 'ChevronRight'
$content = $content -replace 'MoreHorizontalIcon', 'MoreHorizontal'
$content | Set-Content $file

# Corrigir navigation-menu.tsx
$file = "app/components/ui/navigation-menu.tsx"
(Get-Content $file) -replace 'import ChevronDownIcon from "lucide-react"', 'import { ChevronDown } from "lucide-react"' -replace 'ChevronDownIcon', 'ChevronDown' | Set-Content $file

# Corrigir menubar.tsx
$file = "app/components/ui/menubar.tsx"
$content = Get-Content $file
$content = $content -replace 'import CheckIcon from "lucide-react"', 'import { Check, ChevronRight, Circle } from "lucide-react"'
$content = $content -replace 'import ChevronRightIcon from "lucide-react"', ''
$content = $content -replace 'import CircleIcon from "lucide-react"', ''
$content = $content -replace 'CheckIcon', 'Check'
$content = $content -replace 'ChevronRightIcon', 'ChevronRight'
$content = $content -replace 'CircleIcon', 'Circle'
$content | Set-Content $file

# Corrigir input-otp.tsx
$file = "app/components/ui/input-otp.tsx"
(Get-Content $file) -replace 'import MinusIcon from "lucide-react"', 'import { Minus } from "lucide-react"' -replace 'MinusIcon', 'Minus' | Set-Content $file

# Corrigir sidebar.tsx
$file = "app/components/ui/sidebar.tsx"
(Get-Content $file) -replace 'import PanelLeftIcon from "lucide-react"', 'import { PanelLeft } from "lucide-react"' -replace 'PanelLeftIcon', 'PanelLeft' | Set-Content $file

# Corrigir sheet.tsx
$file = "app/components/ui/sheet.tsx"
(Get-Content $file) -replace 'import XIcon from "lucide-react"', 'import { X } from "lucide-react"' -replace 'XIcon', 'X' | Set-Content $file

Write-Host "Todos os arquivos foram corrigidos!"
