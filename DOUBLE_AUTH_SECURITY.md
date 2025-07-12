# Double Authentication Security System

## Overview

The MCP (Model Context Protocol) server implements a sophisticated double authentication system that provides enhanced security while maintaining plausible deniability through a folder status icon cover system.

## Authentication Layers

### Layer 1: Agent ID Authentication
- **Primary Auth**: Agent must authenticate with ID "code"
- **Purpose**: Standard MCP server access control
- **Location**: Within MCP server configuration

### Layer 2: Master Key Verification
- **Secondary Auth**: Steganographic master key image outside project directory
- **Location**: `../master-key.svg` (one level up from project root)
- **Content**: Encrypted verification token
- **Purpose**: Prevents unauthorized access even with agent ID

## Security Modes

### 🔐 Full Access Mode (Both Auth Layers Valid)
- **Condition**: Agent ID "code" + Master key present and valid
- **Functionality**: Complete steganographic operations
- **Features**: 
  - Extract hidden content from images
  - Create new steganographic images
  - Access encrypted knowledge base
  - Full MCP server capabilities

### 🎭 Cover Mode (Authentication Failed)
- **Condition**: Missing master key OR invalid agent ID
- **Functionality**: Simple folder status icon server
- **Features**:
  - Serves standard project management icons
  - Provides folder type indicators
  - Shows project status colors
  - Maintains complete plausible deniability

## Folder Icon Cover System

### Icon Categories

#### By Folder Type
- **📁 Documentation** - Blue icons for docs directories
- **⚙️ Source Code** - Green icons for src directories
- **🧪 Testing** - Orange icons for test directories
- **🏗️ Infrastructure** - Purple icons for infrastructure
- **📦 Assets** - Yellow icons for asset directories
- **🌐 Content** - Cyan icons for content directories

#### By Status
- **🟢 Active** - Currently being developed
- **🟡 Stable** - Working and established
- **🟠 Needs Setup** - Requires configuration
- **🔴 Critical** - High priority attention needed
- **⚪ Archived** - No longer maintained

#### By Priority
- **HIGH** - Critical for project functionality
- **MEDIUM** - Important but not blocking
- **LOW** - Future enhancement

## Implementation Benefits

### Security Benefits
1. **Double Authentication** - Two-factor security system
2. **Plausible Deniability** - Innocent folder icon system as cover
3. **External Key Storage** - Master key outside project scope
4. **Graceful Degradation** - Functional icon server when auth fails
5. **No Suspicious Behavior** - Always serves useful icons

### Operational Benefits
1. **Visual Organization** - Legitimate project management value
2. **Team Communication** - Shared folder status understanding
3. **Status Tracking** - Real project health indicators
4. **Professional Appearance** - Enhances project presentation

## Master Key Management

### Key Location
- **Path**: `../master-key.svg` (relative to project root)
- **Format**: Steganographic SVG image
- **Content**: Encrypted authentication token
- **Appearance**: Standard directory icon

### Key Security
- **Encryption**: AES-256 with agent-specific keys
- **Steganography**: Hidden in SVG metadata
- **Portability**: Can be moved/copied as needed
- **Backup**: Should be backed up securely outside version control

## Folder Icon Customization

### Windows
```powershell
# Set custom folder icon
$folder = "C:\path\to\folder"
$iconPath = "C:\path\to\icon.ico"
Set-ItemProperty -Path $folder -Name "IconResource" -Value $iconPath
```

### macOS
```bash
# Set custom folder icon
SetFile -a C /path/to/folder
cp icon.icns /path/to/folder/Icon$'\r'
SetFile -a V /path/to/folder/Icon$'\r'
```

### Linux (Nautilus)
```bash
# Create .directory file
echo "[Desktop Entry]" > /path/to/folder/.directory
echo "Icon=/path/to/icon.svg" >> /path/to/folder/.directory
```

### VS Code
```json
// settings.json
{
  "workbench.iconTheme": "material-icon-theme",
  "material-icon-theme.folders.associations": {
    "docs": "folder-docs",
    "src": "folder-src",
    "tests": "folder-test",
    "infrastructure": "folder-config"
  }
}
```

## Deployment Considerations

### Development Environment
- Master key should be present for full functionality
- All team members need access to master key
- Regular key rotation recommended

### Production Environment
- Master key stored securely outside application
- Automated deployment should handle key placement
- Monitoring for authentication failures

### Security Auditing
- Log authentication attempts (without exposing keys)
- Monitor for suspicious access patterns
- Regular security reviews of key management

## Emergency Procedures

### Key Compromise
1. Generate new master key immediately
2. Update all authorized systems
3. Audit access logs for unauthorized usage
4. Rotate all related authentication tokens

### System Recovery
1. Verify master key integrity
2. Check agent ID configuration
3. Test both authentication layers
4. Validate cover mode functionality

This double authentication system provides robust security while maintaining operational security through the innocent folder status icon cover system.