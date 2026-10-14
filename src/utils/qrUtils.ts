import QRCode from 'qrcode';
import { SoftwarePackage } from '../types';

/**
 * Generates a high-resolution base64 Data URL for a QR Code
 */
export async function generateQrCodeDataUrl(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

/**
 * Extracts equipment code or serial from diverse QR formats:
 * - Plain string e.g. "EQ-2026-001"
 * - JSON e.g. {"code":"EQ-2026-001","serial":"5CD1489X7L"}
 * - URL e.g. "https://intranet.empresa/equipos/EQ-2026-001" or "?code=EQ-2026-001"
 */
export function parseScannedQr(rawValue: string): string {
  const trimmed = rawValue.trim();
  if (!trimmed) return '';

  // Try JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.code) return String(parsed.code).trim();
      if (parsed.id) return String(parsed.id).trim();
      if (parsed.serial) return String(parsed.serial).trim();
    } catch {
      // not valid JSON, proceed to other checks
    }
  }

  // Try URL format
  if (trimmed.includes('http://') || trimmed.includes('https://')) {
    try {
      const url = new URL(trimmed);
      const codeParam = url.searchParams.get('code') || url.searchParams.get('id');
      if (codeParam) return codeParam;
      
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        return segments[segments.length - 1];
      }
    } catch {
      // invalid URL
    }
  }

  return trimmed;
}

/**
 * Generates an automated PowerShell provisioning script (.ps1) for rental PCs
 */
export function generatePowerShellDeploymentScript(packages: SoftwarePackage[], profileName: string): string {
  const dateStr = new Date().toISOString().split('T')[0];
  const commands = packages.map(pkg => {
    return `# --- [${pkg.category}] ${pkg.name} v${pkg.version} ---
Write-Host "[TI-RENTAL] Instalando ${pkg.name}..." -ForegroundColor Cyan
# Comando verificado de instalación:
${pkg.silentInstallCmd}
`;
  }).join('\n');

  return `<#
========================================================================
 SCRIPT DE APROVISIONAMIENTO AUTOMATIZADO - EQUIPOS EN ARRENDAMIENTO
 Perfil: ${profileName}
 Generado por: Intranet Corporativa TI
 Fecha de emisión: ${dateStr}
========================================================================
 Instrucciones:
 1. Abrir PowerShell como Administrador en el PC a configurar.
 2. Ejecutar: Set-ExecutionPolicy Bypass -Scope Process -Force
 3. Ejecutar este archivo .ps1 para instalar el lote de software.
========================================================================
#>

$ErrorActionPreference = "Continue"
Write-Host "=========================================================" -ForegroundColor Green
Write-Host " INICIANDO APROVISIONAMIENTO: ${profileName} " -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green

# Crear carpeta temporal de descarga si es necesario
$tempPath = "C:\\Temp\\SoftwareRentalDeploy"
if (-not (Test-Path $tempPath)) {
    New-Item -ItemType Directory -Path $tempPath -Force | Out-Null
}
Set-Location $tempPath

${commands}

Write-Host "=========================================================" -ForegroundColor Green
Write-Host " APROVISIONAMIENTO FINALIZADO CON ÉXITO " -ForegroundColor Green
Write-Host " El PC se encuentra listo para entrega en arrendamiento. " -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
`;
}
