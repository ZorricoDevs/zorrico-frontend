# PowerShell script to fix favicon dimensions
# This script converts the non-square favicon to a proper square 32x32 favicon

# Check if ImageMagick is available
if (Get-Command magick -ErrorAction SilentlyContinue) {
    Write-Host "Converting favicon to square format using ImageMagick..."

    # Convert to square 32x32 favicon
    magick public/favicon.png -resize 32x32 -gravity center -extent 32x32 public/favicon-fixed.ico

    # Replace the original files
    Copy-Item public/favicon-fixed.ico public/favicon.ico -Force
    Copy-Item public/favicon-fixed.ico public/favicon.png -Force

    Write-Host "✅ Favicon converted to square 32x32 format"
    Remove-Item public/favicon-fixed.ico -Force

} elseif (Get-Command convert -ErrorAction SilentlyContinue) {
    Write-Host "Converting favicon using ImageMagick convert..."

    convert public/favicon.png -resize 32x32 -gravity center -extent 32x32 public/favicon.ico
    Write-Host "✅ Favicon converted using convert command"

} else {
    Write-Host "❌ ImageMagick not found. Please install ImageMagick or use an online favicon generator."
    Write-Host ""
    Write-Host "🔧 Manual Fix Options:"
    Write-Host "1. Online: Go to https://www.favicon-generator.org/"
    Write-Host "2. Photoshop/GIMP: Crop to square (4212x4212) then resize to 32x32"
    Write-Host "3. PowerToys Image Resizer: Right-click → Resize pictures → Custom 32x32"
    Write-Host ""
    Write-Host "Your current favicon is 4212x4930 (not square) which causes squishing."
    Write-Host "A square 32x32 or 16x16 favicon will fix the issue."
}
